/*!
 * OrbitLoader — a glowing stroke-segment that chases around an SVG path,
 * forever, as a loading indicator. Wrap a logo's outline, a circle, a
 * hand-drawn underline beneath some text — any path works, because the
 * library only ever animates a dash-segment along whatever "d" it's given.
 *
 * No dependencies. Animates via the native Web Animations API, so there is
 * nothing to install and nothing else to load.
 *
 * Usage:
 *   var orbit = OrbitLoader.create(document.querySelector('path.my-thread'));
 *   orbit.stop();
 *
 *   var orbit = OrbitLoader.wrap(document.querySelector('.logo-box'), {
 *     d: OrbitLoader.shapes.roundedSquare(84, 24),
 *     viewBox: '0 0 84 84'
 *   });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate a moving stroke-dasharray/-dashoffset segment along `pathEl`'s
   * own outline — not a separate shape rotated to approximate it, so the
   * visible segment bends through corners/curves exactly as the path does.
   *
   * options:
   *   segmentFraction  (default 0.18)   how much of the lap the glowing
   *                                     segment covers, as a fraction of
   *                                     the path's total length
   *   durationMs       (default 2200)   time for one full lap
   *   direction        (default "forward") "forward" | "reverse"
   *   activeClass      (default "is-active") added to pathEl while running,
   *                                     so CSS can fade it in/out
   *   autoStart        (default true)
   */
  function create(pathEl, options) {
    options = options || {};
    var segmentFraction = options.segmentFraction != null ? options.segmentFraction : 0.18;
    var durationMs = options.durationMs != null ? options.durationMs : 2200;
    var reverse = options.direction === "reverse";
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;

    var total = pathEl.getTotalLength();
    var segment = total * segmentFraction;
    pathEl.style.strokeDasharray = segment + " " + (total - segment);

    // Checked once at creation, not live — a loader that's already running
    // when the user's OS setting changes can finish its current lap rather
    // than needing to watch a media query for the rest of its life.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var animation = null;

    function start() {
      if (reducedMotion || animation) return;
      pathEl.classList.add(activeClass);
      animation = pathEl.animate(
        [{ strokeDashoffset: 0 }, { strokeDashoffset: reverse ? total : -total }],
        { duration: durationMs, iterations: Infinity, easing: "linear" }
      );
    }

    function stop() {
      if (animation) {
        animation.cancel();
        animation = null;
      }
      pathEl.classList.remove(activeClass);
    }

    function destroy() {
      stop();
      pathEl.style.strokeDasharray = "";
    }

    if (autoStart) start();

    return {
      path: pathEl,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return !!animation; },
    };
  }

  /**
   * Convenience: builds the <svg><path></svg> itself and appends it to
   * `container`, instead of requiring the caller to hand-write that markup.
   * `container` is an element or a selector string; it should be
   * `position: relative` (or similar) so the injected SVG, which is
   * absolutely positioned edge-to-edge, lines up over its contents.
   *
   * Takes every option `create()` takes, plus:
   *   d              (required) the path's "d" attribute — see shapes.js
   *                  for ready-made generators, or supply your own
   *   viewBox        (default "0 0 100 100") — MUST match the shape's own
   *                  coordinate space (e.g. "0 0 84 84" for a path built
   *                  from shapes.roundedSquare(84, ...)), or the thread
   *                  will be stretched/offset relative to what it's tracing
   *   svgClassName   (default "orbit-loader-path")
   *   pathClassName  (default "orbit-loader-thread")
   */
  function wrap(container, options) {
    options = options || {};
    if (typeof container === "string") container = document.querySelector(container);
    if (!container) throw new Error("OrbitLoader.wrap: container not found");
    if (!options.d) throw new Error("OrbitLoader.wrap: options.d (an SVG path 'd' string) is required");

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", options.viewBox || "0 0 100 100");
    svg.setAttribute("class", options.svgClassName || "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", options.d);
    path.setAttribute("class", options.pathClassName || "orbit-loader-thread");
    svg.appendChild(path);
    container.appendChild(svg);

    var controller = create(path, options);
    controller.svg = svg;
    return controller;
  }

  global.OrbitLoader = { create: create, wrap: wrap };
})(typeof window !== "undefined" ? window : this);
