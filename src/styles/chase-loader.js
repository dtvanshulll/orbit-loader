/*!
 * ChaseLoader — several short dashes evenly spaced around the path,
 * chasing each other in formation: a dasharray with more than one
 * dash/gap pair, all segments rotating together. The multi-runner
 * relative of the core's single chasing segment — same dash math,
 * same linear lap, but the extra dashes make busy paths (letters,
 * long lines) read as continuous motion instead of one lone spark.
 *
 * It is a sibling style module with its own create(), like
 * shimmer-loader.js and handshake-loader.js — never a branch inside
 * orbit-loader.js. Path-based like the core: give it a path element
 * (create) or a container plus options.d (wrap).
 *
 * Mechanics: the dasharray "seg gap" repeated N times has period
 * `total`, so animating stroke-dashoffset by exactly -total loops
 * seamlessly — the formation may spin forever without a jump. The
 * spacing stays fixed because every dash moves with the same offset.
 *
 * Usage:
 *   ChaseLoader.create(pathEl, { segments: 3, color: '#6a9bcc' });
 *   ChaseLoader.wrap(document.querySelector('.box'), {
 *     d: { shape: 'circle', args: [64] }, segments: 4
 *   });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate `segments` evenly spaced dashes along `pathEl`'s `d`.
   *
   * options:
   *   segments         (default 3)    dashes in the formation; each is
   *                                   a separate dash in one dasharray,
   *                                   so they never drift apart
   *   segmentFraction  (default 0.12) each dash's length as a fraction
   *                                   of the path; clamped so the
   *                                   formation always leaves gaps
   *   durationMs       (default 1600) one full lap of the formation
   *   direction        (default "forward") "reverse" runs the lap the
   *                                   other way
   *   color            (default null) dash color; omit for currentColor
   *   strokeWidth      (default null) dash thickness, px
   *   activeClass      (default "is-active") toggled on the path while
   *                                   running, for stylesheet hooks
   *   autoStart        (default true)
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, start() is a no-op and the dashes sit still on the path.
   */
  function create(pathEl, options) {
    options = options || {};
    var segments = Math.max(1, Math.round(options.segments != null ? options.segments : 3));
    var segmentFraction = options.segmentFraction != null ? options.segmentFraction : 0.12;
    var durationMs = options.durationMs != null ? options.durationMs : 1600;
    var reverse = options.direction === "reverse";
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;
    var color = options.color != null ? options.color : null;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : null;

    var total = pathEl.getTotalLength();

    // The formation needs gaps: N dashes at fraction f each must satisfy
    // N*f < 1, or the dashes merge into one solid ring. Clamp rather
    // than throw — a merged formation is still a valid loader, just not
    // what was asked for, and the clamp keeps every caller's geometry sane.
    var maxFraction = 0.9 / segments;
    if (segmentFraction > maxFraction) segmentFraction = maxFraction;
    var seg = total * segmentFraction;
    var gap = total / segments - seg;

    var dasharray = [];
    for (var i = 0; i < segments; i++) dasharray.push(seg + " " + gap);
    pathEl.style.strokeDasharray = dasharray.join(" ");

    // Inline only when the caller passes them — same policy as the core:
    // destroy() clears what we set, never the caller's own styles.
    if (color != null) pathEl.style.stroke = color;
    if (strokeWidth != null) pathEl.style.strokeWidth = strokeWidth;

    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var animation = null;

    function start() {
      if (reducedMotion || animation) return;
      pathEl.classList.add(activeClass);
      // One lap = one dasharray period, so the loop point is invisible:
      // -total is congruent with 0 modulo the dash pattern.
      animation = pathEl.animate(
        [{ strokeDashoffset: 0 }, { strokeDashoffset: reverse ? total : -total }],
        { duration: durationMs, iterations: Infinity, easing: "linear" }
      );
    }

    function stop() {
      if (animation) { animation.cancel(); animation = null; }
      pathEl.classList.remove(activeClass);
    }

    function destroy() {
      stop();
      pathEl.style.strokeDasharray = "";
      if (color != null) pathEl.style.stroke = "";
      if (strokeWidth != null) pathEl.style.strokeWidth = "";
    }

    if (autoStart) start();

    return {
      el: pathEl,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return animation != null; }
    };
  }

  /**
   * Container form: build the SVG (and an optional faint guide) around
   * options.d, then run create() on the path — the same contract as
   * OrbitLoader.wrap, so swapping between the two is a one-word change.
   * `d` accepts a raw path string or a shapes.js spec like
   * { shape: "circle", args: [64] }.
   */
  function wrap(container, options) {
    options = options || {};
    if (typeof container === "string") container = document.querySelector(container);
    if (!container) throw new Error("ChaseLoader.wrap: container not found");

    var d = options.d;
    if (d && typeof d === "object" && global.OrbitLoaderShapes &&
        global.OrbitLoaderShapes[d.shape]) {
      var spec = d;
      d = global.OrbitLoaderShapes[spec.shape].apply(null, spec.args || []);
      if (spec.viewBox && !options.viewBox) options.viewBox = spec.viewBox;
    }
    if (!d) throw new Error("ChaseLoader.wrap: options.d (a path 'd' string or shape spec) is required");

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", options.viewBox || "0 0 100 100");
    svg.setAttribute("class", "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    // Optional faint guide, appended first so the dashes render on top —
    // same reasoning as the core: without it a traced letter is
    // unreadable until a dash happens to pass.
    var guideOpacity = options.guideOpacity != null ? options.guideOpacity : 0;
    if (guideOpacity > 0) {
      var guide = document.createElementNS(SVG_NS, "path");
      guide.setAttribute("d", options.guideD || d);
      guide.setAttribute("class", "orbit-loader-guide");
      guide.style.opacity = guideOpacity;
      svg.appendChild(guide);
    }

    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "orbit-loader-thread");
    svg.appendChild(path);
    container.appendChild(svg);

    var controller = create(path, options);
    controller.svg = svg;
    return controller;
  }

  global.ChaseLoader = { create: create, wrap: wrap };
})(typeof window !== "undefined" ? window : this);
