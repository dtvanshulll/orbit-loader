/*!
 * PathWipeLoader — the path-wipe reveal: content unmasked (or masked)
 * by a traveling SVG path edge — a wave, zigzag, diagonal, arc, or your
 * own profile — sweeping across the container as an SVG clip-path. The
 * one-shot behind section reveals, image unveilings and "this panel
 * arrives with a shaped edge" moments.
 *
 *   var pw = PathWipeLoader.wrap('.reveal', { shape: 'wave' });
 *   pw.reveal();                    // edge sweeps across, content appears
 *   pw.conceal();                   // edge sweeps back, content hides
 *
 * Container-based like route-loader.js — but NOT RouteLoader's wipe
 * again: RouteLoader swaps CONTENT under a rectangular cover panel;
 * PathWipe reveals or conceals content already there, and the edge is
 * an actual SVG path, not a straight rectangular edge.
 *
 * Mechanism: an SVG <clipPath> (userSpaceOnUse) holds the closed reveal
 * region and the container is clipped with `clip-path: url(#id)`. The
 * region travels as one WAAPI transform on the path inside the
 * clipPath — the browser composites the wipe, no per-frame JS. An
 * optional `edgeColor` line draws the open edge profile in an overlay
 * SVG running the same transform, so the front reads as a drawn stroke.
 *
 * options:
 *   shape       'diagonal' | 'wave' (default) | 'zigzag' | 'arc' | 'custom'
 *   d           custom edge profile ('custom', or a built-in override),
 *               drawn on the travel cross-axis; closed toward the reveal side
 *   direction   'left'|'right'|'up'|'down' (default 'right' = reveals from
 *               the left edge rightward); per-call override
 *   durationMs  one reveal or conceal (default 700)
 *   amplitude   edge excursion, fraction of travel span (default 0.12)
 *   detail      hump/tooth count for wave/zigzag (default 4)
 *   edgeColor   visible edge line on the reveal front (default null)
 *   restMs      demo loop pause between reveal/conceal (default 1600)
 *   autoStart   run the demo loop at creation (default true)
 *   onDone      callback(mode) after each reveal or conceal lands
 *
 * Controller: reveal(opts?) snaps the clip fully closed then sweeps it
 * open (a re-reveal replays from the start); conceal(opts?) sweeps back
 * from the edge's current position — read from the in-flight
 * animation's computed transform, so concealing mid-reveal never
 * flashes; show()/hide() instant (also the reduced-motion path);
 * start()/stop() demo loop (conceal → rest → reveal → rest); destroy();
 * isRunning(). Per-call opts: direction, durationMs, onDone. Reduced
 * motion is checked once at creation: reveal()/conceal() become instant
 * show()/hide() — the content still appears/hides, nothing moves.
 */
(function (global) {
  "use strict";

  var SHAPES = { diagonal: 1, wave: 1, zigzag: 1, arc: 1 };
  var DIRECTIONS = { left: 1, right: 1, up: 1, down: 1 };
  var EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
  var uid = 0;
  function edgeDiagonal(crossSpan, A) {
    return [[0, -A], [crossSpan, A]];
  }

  function edgeWave(crossSpan, A, n) {
    var pts = [], steps = n * 8, i, u;
    for (i = 0; i <= steps; i++) {
      u = crossSpan * i / steps;
      pts.push([u, A * Math.sin(2 * Math.PI * n * u / crossSpan)]);
    }
    return pts;
  }

  function edgeZigzag(crossSpan, A, n) {
    var pts = [], i;
    for (i = 0; i <= n; i++) pts.push([crossSpan * i / n, i % 2 === 0 ? -A : A]);
    return pts;
  }

  function edgeArc(crossSpan, A) {
    // quadratic M(0,-A) Q(crossSpan/2, 3A) (crossSpan,-A) sampled;
    // control 3A makes the midpoint bulge exactly A: mid = (P0+2C+P2)/4
    var pts = [], steps = 16, i;
    for (i = 0; i <= steps; i++) {
      var t = i / steps;
      var x = 2 * (1 - t) * t * (crossSpan / 2) + t * t * crossSpan;
      var y = 2 * (1 - t) * t * (3 * A) + (1 - t) * (1 - t) * (-A) + t * t * (-A);
      pts.push([x, y]);
    }
    return pts;
  }

  /* Map canonical (u, v) points into container coordinates and build
   * the closed reveal region + open edge path + travel range. u runs
   * along the cross axis, v is the excursion from the travel-axis
   * center; the closure extends past the container on the reveal side
   * so corners stay covered at every travel position. */
  function buildRegion(pts, w, h, dir, A) {
    var horizontal = dir === "left" || dir === "right";
    var travelSpan = horizontal ? w : h;
    var ov = travelSpan; // closure overhang, generous
    var T = travelSpan / 2 + Math.abs(A) + travelSpan * 0.05;
    var str = [], i, x, y;
    for (i = 0; i < pts.length; i++) {
      var u = pts[i][0], v = pts[i][1];
      if (horizontal) {
        x = dir === "right" ? w / 2 + v : w / 2 - v;
        y = u;
      } else {
        x = u;
        y = dir === "down" ? h / 2 + v : h / 2 - v;
      }
      str.push(x.toFixed(2) + " " + y.toFixed(2));
    }
    // Closure toward the reveal side: the side the edge came FROM.
    var c1, c2;
    if (horizontal) {
      var cx = (dir === "right") ? -ov : w + ov;
      c1 = cx + " " + h; c2 = cx + " 0";
    } else {
      var cy = (dir === "down") ? -ov : h + ov;
      c1 = w + " " + cy; c2 = "0 " + cy;
    }
    var from = -T, to = T;
    if (dir === "left" || dir === "up") { from = T; to = -T; }
    return {
      regionD: "M" + str.join(" L") + " L" + c1 + " L" + c2 + " Z",
      edgeD: "M" + str.join(" L"), dir: dir,
      axis: horizontal ? "X" : "Y", from: from, to: to
    };
  }

  /* Custom edge profile: sample the consumer's d once for its bounding
   * box, close it toward the reveal side, compute the travel range. */
  function buildCustom(d, w, h, dir) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = "position:absolute;left:-9999px;top:0;width:10px;height:10px;overflow:visible";
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d); svg.appendChild(p); document.body.appendChild(svg);
    var total = p.getTotalLength(), N = 32, i;
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, firstY = 0, lastY = 0, firstX = 0, lastX = 0;
    for (i = 0; i <= N; i++) {
      var pt = p.getPointAtLength(total * i / N);
      if (pt.x < minX) minX = pt.x; if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y; if (pt.y > maxY) maxY = pt.y;
      if (i === 0) { firstX = pt.x; firstY = pt.y; }
      if (i === N) { lastX = pt.x; lastY = pt.y; }
    }
    document.body.removeChild(svg);
    var travelSpan = (dir === "left" || dir === "right") ? w : h;
    var ov = travelSpan, m = travelSpan * 0.05;
    var c1, c2;
    if (dir === "right" || dir === "left") {
      var cx = (dir === "right") ? minX - ov : maxX + ov;
      c1 = cx + " " + lastY; c2 = cx + " " + firstY;
    } else {
      var cy = (dir === "down") ? minY - ov : maxY + ov;
      c1 = lastX + " " + cy; c2 = firstX + " " + cy;
    }
    var regionD = d + " L" + c1 + " L" + c2 + " Z";
    var from, to;
    if (dir === "right") { from = -(maxX + m); to = w - minX + m; }
    else if (dir === "left") { from = w - minX + m; to = -(maxX + m); }
    else if (dir === "down") { from = -(maxY + m); to = h - minY + m; }
    else { from = h - minY + m; to = -(maxY + m); }
    return { regionD: regionD, edgeD: d, dir: dir, axis: (dir === "right" || dir === "left") ? "X" : "Y", from: from, to: to };
  }

  /** Own the content of `el` (element or selector). create() and wrap()
   * are the same call — there is no path to trace; the container IS the stage. */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = global.document.querySelector(el);
    if (!el) throw new Error("PathWipeLoader.create: container not found");

    var shape = SHAPES[options.shape] || options.shape === "custom" || options.d ? (options.shape === "custom" || options.d ? "custom" : options.shape) : "wave";
    var direction = DIRECTIONS[options.direction] ? options.direction : "right";
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 700);
    var amplitude = Math.min(0.5, Math.max(0, options.amplitude != null ? options.amplitude : 0.12));
    var detail = Math.max(1, Math.round(options.detail != null ? options.detail : 4));
    var edgeColor = options.edgeColor != null ? options.edgeColor : null;
    var customD = typeof options.d === "string" && options.d ? options.d : null;
    var restMs = Math.max(0, options.restMs != null ? options.restMs : 1600);
    var baseDone = typeof options.onDone === "function" ? options.onDone : null;
    var autoStart = options.autoStart !== false;

    var forcedPosition = global.getComputedStyle(el).position === "static";
    if (forcedPosition) el.style.position = "relative";
    el.classList.add("orbit-loader-pathwipe");

    // Checked once at creation, like every style. WAAPI on the SVG
    // clip path is the whole mechanism — no el.animate, no animation.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var canAnimate = !reducedMotion && typeof el.animate === "function";

    var id = "tlpw-" + (++uid) + "-" + Math.floor(Math.random() * 1e6);
    var defs = null, clipPath = null, clipRegion = null, edgeSvg = null, edgeLine = null;
    var anims = [], loopTimer = null, lastDir = null;
    var open = true;      // content currently unmasked?
    var busy = false;

    function ensureDefs() {
      if (!defs) {
        var NS = "http://www.w3.org/2000/svg";
        defs = document.createElementNS(NS, "svg");
        defs.setAttribute("class", "orbit-loader-pathwipe-defs"); defs.setAttribute("aria-hidden", "true");
        defs.setAttribute("width", "0"); defs.setAttribute("height", "0");
        clipPath = document.createElementNS(NS, "clipPath");
        clipPath.setAttribute("id", id); clipPath.setAttribute("clipPathUnits", "userSpaceOnUse");
        clipRegion = document.createElementNS(NS, "path");
        clipPath.appendChild(clipRegion);
        defs.appendChild(clipPath);
        el.appendChild(defs);
        if (edgeColor) {
          edgeSvg = document.createElementNS(NS, "svg");
          edgeSvg.setAttribute("class", "orbit-loader-pathwipe-edge"); edgeSvg.setAttribute("aria-hidden", "true");
          edgeLine = document.createElementNS(NS, "path");
          edgeLine.setAttribute("fill", "none"); edgeLine.setAttribute("stroke", edgeColor);
          edgeLine.setAttribute("stroke-width", "2"); edgeLine.setAttribute("stroke-linecap", "round");
          edgeSvg.appendChild(edgeLine); el.appendChild(edgeSvg);
        }
      }
      // Re-apply every call: show() drops the style but keeps the defs,
      // so hide() after show() must restore it (ensureDefs alone used to
      // early-return and the content stayed visible).
      el.style.clipPath = "url(#" + id + ")";
    }

    /* Build the region for one reveal/conceal at today's size (named
     * regionFor to stay distinct from the module-level geometry helper). */
    function regionFor(dir) {
      var w = el.clientWidth || 1, h = el.clientHeight || 1;
      var horizontal = dir === "left" || dir === "right";
      var travelSpan = horizontal ? w : h;
      var A = amplitude * travelSpan;
      var crossSpan = horizontal ? h : w;
      var pts;
      if (customD) return buildCustom(customD, w, h, dir);
      if (shape === "diagonal") pts = edgeDiagonal(crossSpan, A);
      else if (shape === "zigzag") pts = edgeZigzag(crossSpan, A, detail);
      else if (shape === "arc") pts = edgeArc(crossSpan, A);
      else pts = edgeWave(crossSpan, A, detail);
      return buildRegion(pts, w, h, dir, A);
    }

    function cancelAnims() {
      for (var i = 0; i < anims.length; i++) {
        try { anims[i].cancel(); } catch (e) { /* already finished */ }
      }
      anims = [];
    }

    /* Temporarily swap the instance duration for one region build. */
    function withDur(dur, fn) {
      var saved = durationMs;
      durationMs = dur;
      var region = fn();
      durationMs = saved;
      return region;
    }

    /* Park the clip (and edge line) at an absolute travel position. */
    function setT(region, pos) {
      clipRegion.setAttribute("transform", "translate" + region.axis + "(" + pos + "px)");
      if (edgeLine) edgeLine.setAttribute("transform", clipRegion.getAttribute("transform"));
    }

    /* Draw the region and park both paths at travel position `pos`. */
    function place(region, pos) {
      clipRegion.setAttribute("d", region.regionD);
      setT(region, pos);
      if (edgeLine) {
        edgeSvg.setAttribute("viewBox", "0 0 " + (el.clientWidth || 1) + " " + (el.clientHeight || 1));
        edgeLine.setAttribute("d", region.edgeD);
      }
      lastDir = region.dir;
    }

    function run(region, from, to, done, mode) {
      var kf = [
        { transform: "translate" + region.axis + "(" + from + "px)" },
        { transform: "translate" + region.axis + "(" + to + "px)" }];
      var targets = edgeLine ? [clipRegion, edgeLine] : [clipRegion];
      var last = null;
      for (var i = 0; i < targets.length; i++) {
        last = targets[i].animate(kf, { duration: durationMs, easing: EASE, fill: "forwards" });
        anims.push(last);
      }
      busy = true;
      last.addEventListener("finish", function () {
        anims = []; busy = false; open = (mode === "reveal");
        if (done) done(mode);
      });
    }

    /** Reveal: snap closed, then sweep the edge across. */
    function reveal(opts) {
      opts = opts || {};
      var done = typeof opts.onDone === "function" ? opts.onDone : baseDone;
      var dir = DIRECTIONS[opts.direction] ? opts.direction : direction;
      var dur = Math.max(1, opts.durationMs != null ? opts.durationMs : durationMs);
      if (!canAnimate) { show(); if (done) done("reveal"); return; }
      cancelAnims();
      ensureDefs();
      var region = withDur(dur, function () { return regionFor(dir); });
      place(region, region.from); // snap fully closed, then sweep open
      run(region, region.from, region.to, done, "reveal");
    }

    /** Conceal: sweep the edge back from wherever it is now. */
    function conceal(opts) {
      opts = opts || {};
      var done = typeof opts.onDone === "function" ? opts.onDone : baseDone;
      var dir = DIRECTIONS[opts.direction] ? opts.direction : direction;
      var dur = Math.max(1, opts.durationMs != null ? opts.durationMs : durationMs);
      if (!canAnimate) { hide(); if (done) done("conceal"); return; }
      if (!open && !busy) { if (done) done("conceal"); return; } // already closed
      ensureDefs();
      var region = withDur(dur, function () { return regionFor(dir); });
      // Start from the edge's current position: the in-flight
      // animation's computed translate along the region's axis, so
      // concealing mid-reveal never snaps or flashes. A direction change
      // mid-flight snaps to the new region's open end instead — the old
      // region's coordinates mean nothing to the new one.
      var from = region.to;
      if (anims.length && lastDir === dir) {
        var t = global.getComputedStyle(clipRegion).transform;
        var m = t && t.match(/matrix\(([^)]+)\)/);
        if (m) {
          var parts = m[1].split(/,\s*/);
          var val = parseFloat(region.axis === "X" ? parts[4] : parts[5]);
          if (isFinite(val)) from = val;
        }
      }
      cancelAnims();
      place(region, from);
      run(region, from, region.from, done, "conceal");
    }

    /** Instant show: drop the clip entirely. */
    function show() {
      cancelAnims();
      el.style.clipPath = "";
      open = true; busy = false;
    }

    /** Instant hide: apply the clip fully closed. Closes along the
     * direction the region was last placed with, so hiding never parks
     * a foreign region that would leave part of the content visible. */
    function hide() {
      cancelAnims();
      ensureDefs();
      var region = regionFor(lastDir || direction);
      place(region, region.from);
      open = false;
      busy = false;
    }

    /** Demo loop: conceal → rest → reveal → rest → repeat. Every
     * continuation re-checks `looping` — a stop() during any phase must
     * end the loop, not let the in-flight step's onDone restart it. */
    var looping = false;
    function loopStep() {
      if (!looping) return;
      conceal({ onDone: function () {
        if (!looping) return;
        loopTimer = global.setTimeout(function () {
          if (!looping) return;
          reveal({ onDone: function () { if (!looping) return; loopTimer = global.setTimeout(loopStep, restMs); } });
        }, restMs);
      } });
    }
    function start() {
      if (looping) return;
      looping = true;
      loopTimer = global.setTimeout(loopStep, 10);
    }
    function stop() {
      looping = false;
      if (loopTimer != null) { global.clearTimeout(loopTimer); loopTimer = null; }
    }

    function destroy() {
      stop();
      cancelAnims();
      el.style.clipPath = "";
      el.classList.remove("orbit-loader-pathwipe");
      if (defs && defs.parentNode) defs.parentNode.removeChild(defs);
      if (edgeSvg && edgeSvg.parentNode) edgeSvg.parentNode.removeChild(edgeSvg);
      defs = clipPath = clipRegion = edgeSvg = edgeLine = null;
      if (forcedPosition) el.style.position = "";
      open = true; busy = false;
    }

    if (autoStart) start();

    return {
      el: el, reveal: reveal, conceal: conceal, show: show, hide: hide,
      start: start, stop: stop, destroy: destroy,
      isRunning: function () { return busy || looping; }
    };
  }

  global.PathWipeLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
