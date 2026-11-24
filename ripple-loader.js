/*!
 * RippleLoader — concentric circles that grow from the center, get
 * bigger, and fade away, one after another, forever: ripples on water.
 * The "inside circle becomes big then goes" style — `rings` controls how
 * many are alive at once, so with enough rings the effect reads as
 * unlimited concentric circles chasing each other outward.
 *
 * It is a sibling style module with its own create(), like
 * dot-loader.js and shimmer-loader.js — but it is container-based
 * rather than path-based: rings don't trace a path, they radiate from
 * the center of whatever box you give them, so create() and wrap() are
 * the same call and both take the container. It needs only
 * orbit-loader.css and does NOT require orbit-loader.js.
 *
 * Mechanics, all browser-native: each ring is one Element.animate() on
 * transform+opacity with an infinite iteration and a per-ring delay.
 * The delays stagger the rings, and because each animation loops on the
 * same period, the stagger persists forever — no rAF, no timers.
 *
 * Usage:
 *   RippleLoader.create(document.querySelector('.loader-box'), {
 *     rings: 3, color: '#e8355c'
 *   });
 *   ripple.stop();
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Radiating rings inside `el` (an element or a selector string). The
   * injected SVG fills the element, so give the element the final size
   * you want — the rings scale with it.
   *
   * options:
   *   rings        (default 3)    how many concentric rings are alive at
   *                               once; they emerge evenly staggered, so
   *                               more rings = denser, more continuous
   *                               ripples
   *   durationMs   (default 1800) one ring's full life: emerge at the
   *                               center, grow to the edge, fade out
   *   startScale   (default 0.15) the fraction of the box a ring spans
   *                               when it's born
   *   strokeWidth  (default 3)    ring stroke width, in the SVG's 100-
   *                               unit space (3 ≈ 3% of the box)
   *   color        (default null) ring color; omit for currentColor
   *   activeClass  (default "is-active") reserved for symmetry with the
   *                               other styles; rings are invisible via
   *                               CSS until their animation runs
   *   autoStart    (default true)
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, start() is a no-op and nothing is visible.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("RippleLoader.create: container not found");
    var rings = options.rings != null ? options.rings : 3;
    var durationMs = options.durationMs != null ? options.durationMs : 1800;
    var startScale = options.startScale != null ? options.startScale : 0.15;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 3;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    var circles = [];
    for (var i = 0; i < rings; i++) {
      var c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", "50");
      c.setAttribute("cy", "50");
      c.setAttribute("r", "42");
      c.setAttribute("class", "orbit-loader-ring");
      c.style.strokeWidth = strokeWidth;
      if (color != null) c.style.stroke = color;
      svg.appendChild(c);
      circles.push(c);
    }
    el.appendChild(svg);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var anims = [];

    function start() {
      if (reducedMotion || anims.length) return;
      for (var i = 0; i < circles.length; i++) {
        anims.push(circles[i].animate(
          [
            { transform: "scale(" + startScale + ")", opacity: 0.9 },
            { transform: "scale(1)", opacity: 0 }
          ],
          {
            duration: durationMs,
            iterations: Infinity,
            easing: "ease-out",
            // The stagger IS the effect: ring i is born i/rings of a
            // period late, and since every animation loops on the same
            // period, the offset holds forever.
            delay: i * durationMs / circles.length
          }
        ));
      }
    }

    function stop() {
      for (var i = 0; i < anims.length; i++) anims[i].cancel();
      anims = [];
    }

    function destroy() {
      stop();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      circles: circles,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return anims.length > 0; }
    };
  }

  // Rings don't trace a path, so there's nothing for wrap() to build —
  // it's the same call as create(), kept for API symmetry with the
  // other styles so drop-in swaps stay drop-in.
  global.RippleLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
