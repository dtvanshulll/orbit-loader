/*!
 * DotLoader — a small filled circle that travels along an SVG path,
 * instead of OrbitLoader's stroke-segment chasing it.
 *
 * Why a separate file and a different technique: a dot is a point, not a
 * stretch of stroke, so it cannot be expressed as a dasharray pattern —
 * it needs per-frame positioning via getPointAtLength() inside a
 * requestAnimationFrame loop. That's a genuinely different mechanism from
 * the core's dashoffset tween, which is exactly why it's a sibling style
 * module with its own create() rather than a branch inside
 * orbit-loader.js (which it does NOT need to be loaded — only
 * orbit-loader.css for base styling).
 *
 * The rAF loop is still effectively free: one getPointAtLength() call per
 * frame, no layout reads, no per-frame math beyond advancing a position.
 * It also pauses for free when the tab is hidden (browsers throttle rAF),
 * and dt is clamped so a throttled tab can't make the dot teleport.
 *
 * Usage:
 *   var dot = DotLoader.wrap(document.querySelector('.logo-box'), {
 *     d: OrbitLoaderShapes.circle(84),
 *     viewBox: '0 0 84 84'
 *   });
 *   dot.stop();
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Move a dot along `pathEl`. Takes every option OrbitLoader.create()
   * takes (same defaults, same controller shape), plus:
   *
   *   dotRadius  (default 3)  the dot's radius, in the path's own
   *                           coordinate units — with wrap() and a viewBox
   *                           that matches the container's pixel size
   *                           (e.g. "0 0 84 84" on an 84px box) these are
   *                           effectively CSS pixels
   *   dots       (default 1)   how many dots travel the path, evenly
   *                           spaced around it — 2+ turns one bead into
   *                           a train (or, on a circle, a little solar
   *                           system). One getPointAtLength() call per
   *                           dot per frame, so keep the count sane
   *   color      (default null) the dot's fill as any CSS color; omit
   *                           for currentColor, so the dot keeps
   *                           inheriting the container's color as before
   *   wobble     (default 0)   the moth: the dot rides the path but also
   *                           breathes PERPENDICULAR to it, offset along
   *                           the path normal by this amplitude (in path
   *                           coordinate units) — it flutters toward and
   *                           away from the line like a moth at a flame
   *   wobbleCycles (default 3) how many full in-out undulations per lap;
   *                           keep it a whole number so closed paths loop
   *                           seamlessly
   *   trail      (default 0)   breadcrumbs: this many ghost footprints
   *                           follow the head dot along the path, each
   *                           smaller and fainter than the last — a dying
   *                           trail of dots, not a stroke
   *   relay      (default false) with dots > 1, only one dot is lit at a
   *                           time; the light passes to the next dot as
   *                           the base position crosses into its slot —
   *                           a baton pass, not a train. Ignored when
   *                           `crossing` is also set (the crossing
   *                           flash owns the dots' opacity).
   *   crossing   (default false) doubles the dots and sends the second
   *                           half the opposite way; each pair flashes
   *                           briefly every time it passes through
   *                           itself
   *
   * start() after stop() restarts the lap from the path's start (and
   * clears the breadcrumb history), matching OrbitLoader's fresh-lap
   * semantics.
   *
   * The dot element is created here and appended next to the path (they
   * must share an SVG so coordinates line up); destroy() removes it again
   * since we own it. The path itself is left untouched — a caller tracing
   * a dot around their own hand-written visible path gets exactly that.
   *
   * Reduced motion is checked once at creation, exactly like the core:
   * if set, start() is a no-op and the dot never becomes visible.
   */
  function create(pathEl, options) {
    if (!pathEl || typeof pathEl.getPointAtLength !== "function" ||
        typeof pathEl.getTotalLength !== "function") {
      throw new Error("DotLoader.create: pathEl must be an SVG <path> element");
    }
    options = options || {};
    var durationMs = options.durationMs != null ? options.durationMs : 2200;
    var reverse = options.direction === "reverse";
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;
    var dotRadius = options.dotRadius != null ? options.dotRadius : 3;
    var dotCount = Math.max(1, options.dots != null ? options.dots : 1);
    var color = options.color != null ? options.color : null;
    var wobble = options.wobble != null ? options.wobble : 0;
    var wobbleCycles = options.wobbleCycles != null ? options.wobbleCycles : 3;
    var trail = Math.max(0, Math.round(options.trail != null ? options.trail : 0));
    var relay = !!options.relay;
    var crossing = !!options.crossing;

    var total = pathEl.getTotalLength();

    // Ghost footprints are appended first so the real dots render on top
    // of them; destroy() removes everything we created.
    var ghosts = [];
    for (var g = 0; g < trail; g++) {
      var ghost = document.createElementNS(SVG_NS, "circle");
      ghost.setAttribute("r", dotRadius);
      ghost.setAttribute("class", "orbit-loader-ghost");
      if (color != null) ghost.style.fill = color;
      if (pathEl.parentNode) pathEl.parentNode.appendChild(ghost);
      ghosts.push(ghost);
    }

    var dots = [];
    for (var d = 0; d < dotCount; d++) {
      var circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("r", dotRadius);
      circle.setAttribute("class", "orbit-loader-dot");
      // Only applied inline when the caller passes it, so omitting color
      // keeps pure currentColor behaviour — and destroy() only clears what
      // we set, never the caller's own styles.
      if (color != null) circle.style.fill = color;
      if (pathEl.parentNode) pathEl.parentNode.appendChild(circle);
      dots.push(circle);
    }

    // Crossing twins: one reverse runner per forward dot, appended after
    // so the pair reads as two travellers, not a highlight.
    var twins = [];
    if (crossing) {
      for (var t = 0; t < dotCount; t++) {
        var twin = document.createElementNS(SVG_NS, "circle");
        twin.setAttribute("r", dotRadius);
        twin.setAttribute("class", "orbit-loader-dot");
        if (color != null) twin.style.fill = color;
        if (pathEl.parentNode) pathEl.parentNode.appendChild(twin);
        twins.push(twin);
      }
    }

    // Recent head positions for the breadcrumb trail; ghosts[i] sits at
    // history[i], so the trail length is capped by the pool size.
    var history = [];

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var rafId = null;
    var lastTs = null;
    // Position travels 0..total and wraps; starting at total going
    // backwards is the same visual as starting at 0 going forwards,
    // modulo one lap — either way the dot begins at the path's start.
    var pos = 0;

    function frame(ts) {
      if (lastTs == null) lastTs = ts;
      // Clamp dt: a backgrounded tab pauses rAF entirely, and on return
      // the raw gap would fling the dot partway around the path.
      var dt = Math.min(ts - lastTs, 100);
      lastTs = ts;
      pos += (reverse ? -1 : 1) * total * dt / durationMs;
      // Wrap into [0, total) in either direction (the double-mod keeps a
      // negative pos from staying negative under JS's % operator).
      pos = ((pos % total) + total) % total;
      // Even spacing: dot i leads the base position by i/dots of a lap,
      // so the train keeps its formation as it travels.
      var head = null;
      for (var i = 0; i < dots.length; i++) {
        var len = ((pos + i * total / dots.length) % total + total) % total;
        var pt = pathEl.getPointAtLength(len);
        if (wobble > 0) {
          // Path normal at this point: tangent from a point a hair ahead,
          // rotated 90°. The undulation is tied to ARC LENGTH, not time,
          // so it is frozen to the path's shape and seamless on closed
          // loops when wobbleCycles is a whole number.
          var ahead = pathEl.getPointAtLength((len + 1) % total);
          var tx = ahead.x - pt.x, ty = ahead.y - pt.y;
          var tl = Math.sqrt(tx * tx + ty * ty) || 1;
          var off = wobble * Math.sin(2 * Math.PI * wobbleCycles * len / total);
          pt = { x: pt.x - (ty / tl) * off, y: pt.y + (tx / tl) * off };
        }
        dots[i].setAttribute("cx", pt.x);
        dots[i].setAttribute("cy", pt.y);
        if (i === 0) head = pt;
      }
      if (twins.length) {
        // Twins run the opposite way and flash when they pass a forward
        // dot: along-path distance small means the two just crossed.
        var flashDist = total * 0.03;
        for (var j = 0; j < twins.length; j++) {
          var back = ((total - pos - j * total / dots.length) % total + total) % total;
          var bp = pathEl.getPointAtLength(back);
          twins[j].setAttribute("cx", bp.x);
          twins[j].setAttribute("cy", bp.y);
          var gap = Math.abs(back - ((pos + j * total / dots.length) % total + total) % total);
          gap = Math.min(gap, total - gap);
          twins[j].style.opacity = gap < flashDist ? "1" : "0.55";
          dots[j].style.opacity = gap < flashDist ? "1" : "";
        }
      }
      if (relay && !crossing && dots.length > 1) {
        // The baton: exactly one dot lit, decided by which slot the base
        // position is currently crossing.
        var lit = Math.floor(pos / (total / dots.length)) % dots.length;
        for (var k = 0; k < dots.length; k++) {
          dots[k].style.opacity = k === lit ? "" : "0.18";
        }
      }
      if (ghosts.length) {
        history.unshift({ x: head.x, y: head.y });
        if (history.length > ghosts.length) history.pop();
        for (var m = 0; m < ghosts.length; m++) {
          var h = history[m];
          if (!h) break;
          ghosts[m].setAttribute("cx", h.x);
          ghosts[m].setAttribute("cy", h.y);
          var fade = 1 - m / ghosts.length;
          ghosts[m].style.opacity = (0.45 * fade).toFixed(3);
          ghosts[m].setAttribute("r", (dotRadius * (0.35 + 0.65 * fade)).toFixed(2));
        }
      }
      rafId = global.requestAnimationFrame(frame);
    }

    function start() {
      if (reducedMotion || rafId != null) return;
      // Restart semantics, matching OrbitLoader's fresh lap: a
      // stop()/start() cycle begins again from the path's start with
      // an empty breadcrumb trail (stop() already cleared the ghosts'
      // opacity, so nothing flashes stale mid-trail).
      pos = 0;
      history.length = 0;
      for (var i = 0; i < dots.length; i++) dots[i].classList.add(activeClass);
      for (var j = 0; j < twins.length; j++) twins[j].classList.add(activeClass);
      lastTs = null;
      rafId = global.requestAnimationFrame(frame);
    }

    function stop() {
      if (rafId != null) {
        global.cancelAnimationFrame(rafId);
        rafId = null;
      }
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove(activeClass);
        dots[i].style.opacity = "";
      }
      for (var j = 0; j < twins.length; j++) {
        twins[j].classList.remove(activeClass);
        twins[j].style.opacity = "";
      }
      // Ghosts too: their opacity is driven per-frame, so without this
      // a stopped loader left its breadcrumb trail frozen visible —
      // the stylesheet's "invisible whenever no rAF loop is running"
      // contract only held before the first run.
      for (var m = 0; m < ghosts.length; m++) ghosts[m].style.opacity = "";
    }

    function destroy() {
      stop();
      // Everything in these pools is ours — created here, removed here.
      // Inline fills are cleared too, but never any style we didn't set.
      var pools = [dots, twins, ghosts];
      for (var p = 0; p < pools.length; p++) {
        for (var i = 0; i < pools[p].length; i++) {
          if (color != null) pools[p][i].style.fill = "";
          if (pools[p][i].parentNode) pools[p][i].parentNode.removeChild(pools[p][i]);
        }
      }
    }

    if (autoStart) start();

    return {
      path: pathEl,
      dot: dots[0],
      dots: dots,
      twins: twins,
      ghosts: ghosts,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return rafId != null; }
    };
  }

  /**
   * Convenience wrapper, same contract as OrbitLoader.wrap(): builds the
   * <svg><path></svg> over `container` and calls create() on it. Takes
   * every option create() takes, plus `d` (required) and `viewBox`
   * (default "0 0 100 100") — `viewBox` MUST match the coordinate space
   * `d` was built in or the dot won't line up with what it traces.
   *
   * Also takes `offset` (default 0), same meaning as OrbitLoader.wrap():
   * the injected SVG extends that many px beyond the container on every
   * side, so the traced shape sits `offset` px away from the box edge.
   * And `guideOpacity` (default 0): a faint static copy of the path drawn
   * behind the dot, so the traced shape reads even where the dot isn't —
   * essential for letters/words. `guideD` (default: same as d) lets the
   * guide show a fuller drawing than the crawled path, e.g. a letter's
   * inside spaces while the dot takes the outer contour only.
   * `svgClassName` / `pathClassName` override the injected classes, same
   * as OrbitLoader.wrap().
   *
   * The path gets class "orbit-loader-track" (invisible by default in
   * orbit-loader.css) rather than the core's "orbit-loader-thread": in
   * dot mode the travelling dot is the effect, so the path it follows
   * shouldn't light up as a stroke behind it.
   */
  function wrap(container, options) {
    options = options || {};
    if (typeof container === "string") container = document.querySelector(container);
    if (!container) throw new Error("DotLoader.wrap: container not found");
    if (!options.d) throw new Error("DotLoader.wrap: options.d (an SVG path 'd' string) is required");

    // Same static-container fixup as OrbitLoader.wrap(): the injected
    // SVG is absolutely positioned and would escape a static host.
    var forcedPosition = global.getComputedStyle(container).position === "static";
    if (forcedPosition) container.style.position = "relative";

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", options.viewBox || "0 0 100 100");
    svg.setAttribute("class", options.svgClassName || "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    // offset: grow the SVG canvas beyond the box on all sides, exactly as
    // OrbitLoader.wrap() does — same option, same semantics.
    var offset = options.offset != null ? options.offset : 0;
    if (offset) {
      svg.style.inset = -offset + "px";
      svg.style.width = "calc(100% + " + (2 * offset) + "px)";
      svg.style.height = "calc(100% + " + (2 * offset) + "px)";
    }

    // Optional faint guide, same as OrbitLoader.wrap() — appended first
    // so the dot renders on top of it.
    var guideOpacity = options.guideOpacity != null ? options.guideOpacity : 0;
    if (guideOpacity > 0) {
      var guide = document.createElementNS(SVG_NS, "path");
      guide.setAttribute("d", options.guideD || options.d);
      guide.setAttribute("class", "orbit-loader-guide");
      guide.style.opacity = guideOpacity;
      svg.appendChild(guide);
    }

    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", options.d);
    path.setAttribute("class", options.pathClassName || "orbit-loader-track");
    svg.appendChild(path);
    container.appendChild(svg);

    var controller = create(path, options);
    controller.svg = svg;
    controller.container = container;
    // wrap() owns the svg it injected; create()'s destroy only ever
    // touches the dots/ghosts/twins it created, so wrap it here rather
    // than leaving an orphaned <svg> in the container after destroy() —
    // and undo the position fixup wrap() itself applied.
    var innerDestroy = controller.destroy;
    controller.destroy = function () {
      innerDestroy();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
      if (forcedPosition) container.style.position = "";
    };
    return controller;
  }

  global.DotLoader = { create: create, wrap: wrap };
})(typeof window !== "undefined" ? window : this);
