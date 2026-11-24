/*!
 * ProgressLoader — determinate progress along any path: a filled
 * portion that grows from the path's start toward its end, with a
 * glowing head dot at the frontier. Sibling style module with its own
 * create(), like orbit-loader.js itself (path-based). Needs only
 * orbit-loader.css; does NOT require shapes.js.
 *
 * What makes it different from every progress bar: the track is any
 * SVG path you hand it — a circle, an underline, a lightning bolt, a
 * company logo — and the fill traces that shape as progress advances.
 * Downloads, uploads, multi-step wizards, installers: anywhere a
 * number 0..1 exists, it can now be drawn along a shape that means
 * something.
 *
 * This is a ONE-SHOT, driven style:
 *   prog.setProgress(0.4);   // fill 40% of the path
 *   prog.done();             // snap-fill the rest and settle
 * Call start() to run the built-in demo loop (fills in steps, resets).
 *
 * Usage:
 *   var prog = ProgressLoader.create(box, {
 *     d: OrbitLoaderShapes.circle(120), viewBox: '0 0 120 120'
 *   });
 *   prog.setProgress(0.75);
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Build the progress track for `pathEl` (an SVGPathElement already
   * in the DOM) or for `container` + options.d (a `d` string; the
   * path is created for you). Like the core loader, one call does
   * both: create(pathEl, options) or create(container, options).
   *
   * options:
   *   d           (required with a container) the track's path data
   *   viewBox     (default "0 0 100 100") the SVG's viewBox
   *   width       (default 100%)  CSS width of the injected SVG
   *   strokeWidth (default 2)     track stroke width, px
   *   headRadius  (default 3)     the frontier dot's radius, px
   *   color       (default null)  fill and head color; omit for
   *                               currentColor
   *   guideOpacity (default 0.3)  the unfilled track's opacity
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, the demo loop does nothing and setProgress() still paints
   * (a static fill is fine — it's not motion).
   */
  function create(pathEl, options) {
    options = options || {};
    var variant = options.variant != null ? options.variant : "bar";
    var steps = options.steps != null ? options.steps : 4;
    var chunk = options.chunk != null ? options.chunk : 0.18;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var container = null;
    if (pathEl && pathEl.ownerSVGElement) {
      // Path-based call: animate the given element, like the core.
      container = pathEl.parentNode;
    } else {
      // Container-based call: build the SVG around options.d.
      container = pathEl;
      if (typeof container === "string") {
        container = document.querySelector(container);
      }
      if (!container) throw new Error("ProgressLoader.create: target not found");
      if (!options.d && variant === "ring") {
        // Ring preset: a circle sized to the container so the common
        // case needs no path math from the consumer.
        var side = options.size != null ? options.size : 64;
        var r = (side - strokeWidth * 2) / 2;
        options.d = "M" + side / 2 + "," + strokeWidth +
          " A" + r + "," + r + " 0 1 1 " + (side / 2 - 0.01) + "," + strokeWidth;
        options.viewBox = "0 0 " + side + " " + side;
      }
      if (!options.d) {
        throw new Error("ProgressLoader.create: container call needs options.d");
      }
      var svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", options.viewBox || "0 0 100 100");
      if (options.width != null) svg.style.width = options.width;
      svg.setAttribute("class", "orbit-loader-path orbit-loader-progress");
      svg.setAttribute("aria-hidden", "true");

      var guide = document.createElementNS(SVG_NS, "path");
      guide.setAttribute("d", options.d);
      guide.setAttribute("class", "orbit-loader-guide");
      guide.style.strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
      guide.style.opacity = options.guideOpacity != null ? options.guideOpacity : 0.3;
      if (options.color != null) guide.style.stroke = options.color;
      svg.appendChild(guide);

      pathEl = document.createElementNS(SVG_NS, "path");
      pathEl.setAttribute("d", options.d);
      pathEl.setAttribute("class", "orbit-loader-thread");
      pathEl.style.strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
      if (options.color != null) pathEl.style.stroke = options.color;
      svg.appendChild(pathEl);
      container.appendChild(svg);
    }

    var headRadius = options.headRadius != null ? options.headRadius : 3;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    // The 'steps' variant marks each quantization boundary with a small
    // tick on the track, so "fills in steps" reads as steps — without
    // them the fill just looks like a slower continuous bar.
    if (variant === "steps" && pathEl.getTotalLength) {
      var tickTotal = pathEl.getTotalLength();
      for (var t = 1; t < steps; t++) {
        var pt = pathEl.getPointAtLength(tickTotal * t / steps);
        var tick = document.createElementNS(SVG_NS, "circle");
        tick.setAttribute("cx", pt.x);
        tick.setAttribute("cy", pt.y);
        tick.setAttribute("r", Math.max(2, strokeWidth * 1.4));
        tick.setAttribute("class", "orbit-loader-progress-tick");
        if (color != null) tick.style.fill = color;
        tick.style.opacity = 0.55;
        pathEl.parentNode.appendChild(tick);
      }
    }

    // The frontier dot: a small circle riding the fill's leading edge.
    var head = document.createElementNS(SVG_NS, "circle");
    head.setAttribute("r", headRadius);
    head.setAttribute("class", "orbit-loader-progress-head");
    if (color != null) head.style.fill = color;
    pathEl.parentNode.appendChild(head);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var total = pathEl.getTotalLength ? pathEl.getTotalLength() : 100;

    // Fill state: 0..1. The fill is the dash segment [0, p*total];
    // the head sits at p*total along the path.
    var progress = 0;
    var raf = null;
    var running = false;   // demo loop
    var restTimer = null;

    function paint(p) {
      progress = Math.max(0, Math.min(1, p));
      var segLen = total * progress;
      pathEl.style.strokeDasharray = segLen + " " + (total - segLen);
      pathEl.style.strokeDashoffset = 0;
      var pt = pathEl.getPointAtLength(segLen);
      head.setAttribute("cx", pt.x);
      head.setAttribute("cy", pt.y);
      head.style.opacity = progress > 0 && progress < 1 ? 1 : 0;
    }

    /**
     * Fill to fraction `p` (0..1). Animates from the current fill at
     * a constant rate — progress bars should move at a speed that
     * matches the data, but a short eased glide reads better than a
     * jump for small updates.
     */
    // The eased fill shared by every variant; setProgress routes to it.
    function fillTo(p) {
      var from = progress;
      var to = Math.max(0, Math.min(1, p));
      if (reducedMotion || Math.abs(to - from) < 0.005) {
        paint(to);
        return;
      }
      if (raf != null) { global.cancelAnimationFrame(raf); raf = null; }
      var t0 = null;
      var dur = 350;
      var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
      function frame(ts) {
        if (t0 == null) t0 = ts;
        var t = Math.min(1, (ts - t0) / dur);
        paint(from + (to - from) * ease(t));
        if (t < 1) {
          raf = global.requestAnimationFrame(frame);
        } else {
          raf = null;
        }
      }
      raf = global.requestAnimationFrame(frame);
    }

    // Public setter: stops the indeterminate loop, then eases the fill.
    function setProgress(p) {
      if (variant === "indeterminate") { stopIndeterminate(); }
      fillTo(p);
    }

    /** Snap-fill the remainder and fade the head — the "complete" beat. */
    function done() {
      setProgress(1);
      if (!reducedMotion) {
        var anim = head.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 400, delay: 250, fill: "forwards"
        });
        anim.onfinish = function () { paint(1); };
      }
    }

    // ---- 'steps' variant: quantize to segments, pop on each new one.
    var lastStep = -1;
    function setProgressSteps(target) {
      var idx = Math.min(steps, Math.max(0, Math.round(target * steps)));
      if (idx === lastStep && target < 1) {
        paint(progress); // no segment change: hold the current fill
        return;
      }
      lastStep = idx;
      fillTo(idx / steps);
      if (!reducedMotion && idx > 0 && head.animate) {
        head.animate(
          [{ r: headRadius }, { r: headRadius * 1.8 }, { r: headRadius }],
          { duration: 260, easing: "ease-out" }
        );
      }
    }

    // ---- 'indeterminate' variant: a chunk sliding around the track.
    var indRaf = null;
    var indPos = 0;
    function indFrame(ts) {
      if (!running) { indRaf = null; return; }
      if (indT0 == null) indT0 = ts;
      var t = (ts - indT0) / 1000;
      // Constant speed, wrapping; ease is a lie for an indeterminate bar.
      indPos = (t * 0.55) % 1;
      var startFrac = indPos;
      var endFrac = (indPos + chunk) % 1;
      if (endFrac > startFrac) {
        pathEl.style.strokeDasharray =
          (total * (endFrac - startFrac)) + " " + total;
        pathEl.style.strokeDashoffset = -(total * startFrac);
      } else {
        // The chunk wraps the seam: draw it as two dashes.
        pathEl.style.strokeDasharray =
          (total * (1 - startFrac)) + " " + total + " " +
          (total * endFrac) + " 0";
        pathEl.style.strokeDashoffset = -(total * startFrac);
      }
      head.style.opacity = 0;
      indRaf = global.requestAnimationFrame(indFrame);
    }
    var indT0 = null;

    function startIndeterminate() {
      if (reducedMotion) { paint(0.4); return; }
      if (indRaf != null) return;
      indT0 = null;
      indRaf = global.requestAnimationFrame(indFrame);
    }

    function stopIndeterminate() {
      if (indRaf != null) { global.cancelAnimationFrame(indRaf); indRaf = null; }
    }

    // Demo loop: fill in uneven steps (like real chunked downloads),
    // complete, rest, reset.
    function demoRun() {
      var steps = [0.15, 0.35, 0.42, 0.7, 0.85, 1];
      var i = 0;
      function next() {
        if (!running) return;
        var p = steps[i++];
        if (p >= 1) {
          done();
          restTimer = global.setTimeout(function () {
            if (!running) return;
            paint(0);
            demoRun();
          }, 700);
          return;
        }
        setProgress(p);
        global.setTimeout(next, 420 + (i % 3) * 260);
      }
      next();
    }

    function start() {
      if (running) return;
      running = true;
      // The visibility gate lives on the path itself (same class the
      // core's thread uses), not on the svg.
      pathEl.classList.add("is-active");
      if (variant === "indeterminate") { startIndeterminate(); return; }
      if (!reducedMotion) demoRun();
      else paint(0.6);
    }

    function stop() {
      running = false;
      stopIndeterminate();
      if (raf != null) { global.cancelAnimationFrame(raf); raf = null; }
      if (restTimer != null) { global.clearTimeout(restTimer); restTimer = null; }
      pathEl.classList.remove("is-active");
    }

    function destroy() {
      stop();
      var svg = pathEl.parentNode;
      if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
    }

    function isRunning() { return running; }

    paint(0);
    if (autoStart) start();

    return {
      el: container,
      svg: pathEl.parentNode,
      path: pathEl,
      head: head,
      setProgress: setProgress,
      done: done,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.ProgressLoader = {
    create: create,
    wrap: create
  };
})(window);
