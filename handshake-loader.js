/*!
 * HandshakeLoader — two segments start at opposite ends of an SVG path
 * and crawl TOWARD each other, overlap briefly at the meeting point (the
 * "handshake" flash), then retract and start over. Sibling style module
 * with its own create(), like ripple-loader.js — needs only
 * orbit-loader.css, never orbit-loader.js.
 *
 * Why it's its own file: the core chases with ONE segment on a linear
 * dashoffset tween. Handshake needs two segments whose dasharray AND
 * dashoffset both interpolate (each grows from its own end), plus the
 * overlap-as-flash trick — a different choreography, not an option on
 * the same tween. Every loader in the wild runs one mover; two movers
 * meeting mid-path is the idea that doesn't exist yet.
 *
 * Mechanics, all native: each segment is one path element whose
 * stroke-dasharray is [L, total−L] and whose dashoffset places the dash
 * at its own end. WAAPI interpolates both properties together across
 * keyframes, so the growth, the overlap and the retraction all tween —
 * no rAF, no timers. Both paths render at reduced opacity, so where
 * they overlap the paint doubles and the meeting point flashes brighter
 * than either segment alone.
 *
 * Usage:
 *   HandshakeLoader.wrap(document.querySelector('.box'), {
 *     d: OrbitLoaderShapes.circle(84),
 *     viewBox: '0 0 84 84'
 *   });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Two converging segments on `pathEl`'s own outline — any path works.
   *
   * options:
   *   durationMs  (default 2400)  one full cycle: converge, flash at the
   *                               meeting point, retract, brief rest
   *   meetAt      (default 0.5)   where along the path the two fronts
   *                               meet, as a fraction of total length —
   *                               0.5 is the middle; 0.75 meets later
   *                               along the route
   *   overlap     (default 0.12)  how far past each other the fronts
   *                               push during the flash, as a fraction
   *                               of the path — this is the handshake
   *   color       (default null)  stroke color; omit for currentColor
   *   strokeWidth (default null)  stroke width in px
   *   activeClass (default "is-active")
   *   autoStart   (default true)
   *
   * Reduced motion is checked once at creation, like every style.
   */
  function create(pathEl, options) {
    options = options || {};
    var durationMs = options.durationMs != null ? options.durationMs : 2400;
    var meetAt = options.meetAt != null ? options.meetAt : 0.5;
    var overlap = options.overlap != null ? options.overlap : 0.12;
    var color = options.color != null ? options.color : null;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : null;
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;

    var total = pathEl.getTotalLength();

    // Two copies of the caller's path, stacked. Reduced opacity is the
    // flash mechanism: where both segments overlap, the paint doubles.
    var pathA = pathEl;
    var pathB = pathEl.cloneNode(false);
    pathB.setAttribute("d", pathEl.getAttribute("d"));
    pathB.setAttribute("class", pathEl.getAttribute("class") || "");
    if (pathEl.parentNode) pathEl.parentNode.appendChild(pathB);
    pathA.style.opacity = 0.8;
    pathB.style.opacity = 0.8;
    if (color != null) {
      pathA.style.stroke = color;
      pathB.style.stroke = color;
    }
    if (strokeWidth != null) {
      pathA.style.strokeWidth = strokeWidth;
      pathB.style.strokeWidth = strokeWidth;
    }

    // Checked once at creation, like every style.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Keyframe timeline as fractions of the cycle:
    //   0.00–0.55  converge from both ends
    //   0.55–0.70  push past each other by `overlap` (the flash)
    //   0.70–0.92  retract to nothing
    //   0.92–1.00  rest, empty — then the loop restarts seamlessly
    // A's dash always starts at the path start (offset 0); B's dash is
    // pinned to the path end (offset −(total−L)), so as L interpolates,
    // both the length and the anchor move together.
    function keyframes(fromStart) {
      function dash(l) { return l + " " + (total - l); }
      function offset(l) { return fromStart ? 0 : -(total - l); }
      var meet = total * meetAt;
      var half = meet / 2;
      var push = total * overlap / 2;
      return [
        { strokeDasharray: dash(0), strokeDashoffset: offset(0), easing: "ease-in-out" },
        { strokeDasharray: dash(half), strokeDashoffset: offset(half), offset: 0.55, easing: "ease-in-out" },
        { strokeDasharray: dash(half + push), strokeDashoffset: offset(half + push), offset: 0.7, easing: "ease-in-out" },
        { strokeDasharray: dash(0), strokeDashoffset: offset(0), offset: 0.92, easing: "linear" },
        { strokeDasharray: dash(0), strokeDashoffset: offset(0) }
      ];
    }

    var anims = [];

    function start() {
      if (reducedMotion || anims.length) return;
      pathA.classList.add(activeClass);
      pathB.classList.add(activeClass);
      anims.push(pathA.animate(keyframes(true),
        { duration: durationMs, iterations: Infinity }));
      anims.push(pathB.animate(keyframes(false),
        { duration: durationMs, iterations: Infinity }));
    }

    function stop() {
      for (var i = 0; i < anims.length; i++) anims[i].cancel();
      anims = [];
      pathA.classList.remove(activeClass);
      pathB.classList.remove(activeClass);
    }

    function destroy() {
      stop();
      pathA.style.opacity = "";
      if (color != null) pathA.style.stroke = "";
      if (strokeWidth != null) pathA.style.strokeWidth = "";
      if (pathB.parentNode) pathB.parentNode.removeChild(pathB);
    }

    if (autoStart) start();

    return {
      path: pathEl,
      paths: [pathA, pathB],
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return anims.length > 0; }
    };
  }

  /**
   * Same contract as OrbitLoader.wrap(): builds the <svg><path></svg>
   * over `container` and calls create() on it. Takes every option
   * create() takes, plus `d` (required), `viewBox`, `offset` and
   * `guideOpacity` — same meanings as the core. The guide sits under
   * both segments, so the traced shape reads even before they meet.
   */
  function wrap(container, options) {
    options = options || {};
    if (typeof container === "string") container = document.querySelector(container);
    if (!container) throw new Error("HandshakeLoader.wrap: container not found");
    if (!options.d) throw new Error("HandshakeLoader.wrap: options.d (an SVG path 'd' string) is required");

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", options.viewBox || "0 0 100 100");
    svg.setAttribute("class", "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    var offset = options.offset != null ? options.offset : 0;
    if (offset) {
      svg.style.inset = -offset + "px";
      svg.style.width = "calc(100% + " + (2 * offset) + "px)";
      svg.style.height = "calc(100% + " + (2 * offset) + "px)";
    }

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
    path.setAttribute("class", "orbit-loader-thread");
    svg.appendChild(path);
    container.appendChild(svg);

    var controller = create(path, options);
    controller.svg = svg;
    return controller;
  }

  global.HandshakeLoader = { create: create, wrap: wrap };
})(typeof window !== "undefined" ? window : this);
