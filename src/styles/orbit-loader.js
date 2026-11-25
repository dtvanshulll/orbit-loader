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
   *   color            (default null)   stroke color as any CSS color;
   *                                     omit for currentColor, so the
   *                                     thread keeps inheriting the
   *                                     container's color as before
   *   strokeWidth      (default null)   stroke width in px; omit for the
   *                                     stylesheet default (2)
   *   steps            (default 0)      when > 0, the metronome mode: the
   *                                     segment doesn't glide — it sits,
   *                                     then snaps to the next of `steps`
   *                                     positions around the path, like a
   *                                     clock hand ticking. The lap still
   *                                     takes durationMs; each step holds
   *                                     ~70% of its slice and snaps in
   *                                     the last ~30%
   *   breathe          (default 0)      when > 0, the breathing outline:
   *                                     the thread's own stroke-width
   *                                     swells and settles by this
   *                                     fraction (0.5 = swells 50%) once
   *                                     per breatheMs, while the crawl
   *                                     continues — the shape inhales
   *   breatheMs        (default 1600)   one inhale-exhale cycle
   */
  function create(pathEl, options) {
    options = options || {};
    var segmentFraction = options.segmentFraction != null ? options.segmentFraction : 0.18;
    var durationMs = options.durationMs != null ? options.durationMs : 2200;
    var reverse = options.direction === "reverse";
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;
    var color = options.color != null ? options.color : null;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : null;
    var steps = Math.max(0, Math.round(options.steps != null ? options.steps : 0));
    var breathe = options.breathe != null ? options.breathe : 0;
    var breatheMs = options.breatheMs != null ? options.breatheMs : 1600;

    var total = pathEl.getTotalLength();
    var segment = total * segmentFraction;
    pathEl.style.strokeDasharray = segment + " " + (total - segment);

    // Applied inline only when the caller actually passes them, so a
    // caller who didn't keeps pure currentColor/stylesheet behaviour —
    // and destroy() only clears what we set, never their own styles.
    if (color != null) pathEl.style.stroke = color;
    if (strokeWidth != null) pathEl.style.strokeWidth = strokeWidth;

    // Checked once at creation, not live — a loader that's already running
    // when the user's OS setting changes can finish its current lap rather
    // than needing to watch a media query for the rest of its life.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var animation = null;
    var breatheAnim = null;

    function start() {
      if (reducedMotion || animation) return;
      pathEl.classList.add(activeClass);
      if (steps > 1) {
        // Metronome: one keyframe pair per tick — hold the segment still
        // for most of its slice, then snap it to the next position. The
        // final offset (-total) is congruent with 0 modulo the dasharray
        // period (total), so the infinite loop is seamless.
        var slice = total / steps;
        var keyframes = [];
        for (var i = 0; i < steps; i++) {
          keyframes.push(
            { offset: i / steps, strokeDashoffset: -i * slice, easing: "linear" },
            { offset: (i + 1) / steps - 0.3 / steps, strokeDashoffset: -i * slice, easing: "ease-in-out" },
            { offset: (i + 1) / steps, strokeDashoffset: -(i + 1) * slice }
          );
        }
        animation = pathEl.animate(keyframes,
          { duration: durationMs, iterations: Infinity });
      } else {
        animation = pathEl.animate(
          [{ strokeDashoffset: 0 }, { strokeDashoffset: reverse ? total : -total }],
          { duration: durationMs, iterations: Infinity, easing: "linear" }
        );
      }
      if (breathe > 0) {
        // Read the live width rather than guessing the default — the
        // stylesheet owns it unless the caller passed strokeWidth.
        var base = parseFloat(global.getComputedStyle(pathEl).strokeWidth) || 2;
        var peak = base * (1 + breathe);
        breatheAnim = pathEl.animate(
          [
            { strokeWidth: base, easing: "ease-in-out" },
            { strokeWidth: peak, easing: "ease-in-out" },
            { strokeWidth: base }
          ],
          { duration: breatheMs, iterations: Infinity }
        );
      }
    }

    function stop() {
      if (animation) {
        animation.cancel();
        animation = null;
      }
      if (breatheAnim) {
        breatheAnim.cancel();
        breatheAnim = null;
      }
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
   *   d              (required) the path's "d" attribute — see src/shapes/
   *                  for ready-made generators, or supply your own
   *   viewBox        (default "0 0 100 100") — MUST match the shape's own
   *                  coordinate space (e.g. "0 0 84 84" for a path built
   *                  from shapes.roundedSquare(84, ...)), or the thread
   *                  will be stretched/offset relative to what it's tracing
   *   svgClassName   (default "orbit-loader-path")
   *   pathClassName  (default "orbit-loader-thread")
   *   guideOpacity   (default 0)       when > 0, a faint static copy of
   *                                   the path is drawn behind the moving
   *                                   segment, so the traced shape reads
   *                                   even where the segment isn't —
   *                                   essential for letters/words, nice
   *                                   for any outline
   *   guideD          (default: same as d)  a different path for the guide
   *                                   than the one being crawled — e.g.
   *                                   letterOutline()'s full letter
   *                                   drawing (outer contour + inside
   *                                   spaces) while the crawler takes
   *                                   the outer contour only
   *   offset         (default 0)      how far outside the container the
   *                                   injected SVG extends, in px on every
   *                                   side — the traced shape renders on
   *                                   that larger canvas, so its straight
   *                                   edges sit `offset` px away from the
   *                                   box edge (a circle offsets exactly;
   *                                   other shapes scale about the center,
   *                                   so build the path for the expanded
   *                                   size yourself if you need an exact
   *                                   geometric offset)
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

    // offset: grow the SVG canvas beyond the box on all sides. The
    // stylesheet pins the SVG to inset:0/100%, so these are inline
    // overrides — inline because it's per-instance, not per-stylesheet.
    var offset = options.offset != null ? options.offset : 0;
    if (offset) {
      svg.style.inset = -offset + "px";
      svg.style.width = "calc(100% + " + (2 * offset) + "px)";
      svg.style.height = "calc(100% + " + (2 * offset) + "px)";
    }

    // Optional faint guide: a static copy of the same path, appended
    // first so the moving segment renders on top of it. Off by default —
    // the core's identity is the moving segment alone — but without it a
    // traced letter is unreadable until the segment happens to pass.
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
    path.setAttribute("class", options.pathClassName || "orbit-loader-thread");
    svg.appendChild(path);
    container.appendChild(svg);

    var controller = create(path, options);
    controller.svg = svg;
    // wrap() owns the svg it injected; create()'s destroy only ever
    // touches pathEl, so wrap it here rather than leaving an orphaned
    // <svg> in the container after destroy().
    var innerDestroy = controller.destroy;
    controller.destroy = function () {
      innerDestroy();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    };
    return controller;
  }

  global.OrbitLoader = { create: create, wrap: wrap };
})(typeof window !== "undefined" ? window : this);
