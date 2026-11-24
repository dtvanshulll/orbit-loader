/*!
 * TypingLoader — the classic chat "typing…" indicator: a row of dots
 * that take turns rising and falling, forever. Sibling style module
 * with its own create(), like ripple-loader.js — container-based (the
 * dots don't trace a path), so create() and wrap() are the same call
 * and both take the container. Needs only orbit-loader.css; does NOT
 * require orbit-loader.js.
 *
 * Mechanics, all browser-native: each dot is one Element.animate() on
 * transform+opacity with an infinite iteration and a per-dot delay.
 * The delays stagger the dots, and because every animation loops on
 * the same period, the wave persists forever — no rAF, no timers.
 *
 * Usage:
 *   TypingLoader.create(document.querySelector('.chat-bubble'), {
 *     color: '#d97757'
 *   });
 *   typing.stop();
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Bouncing dots inside `el` (an element or a selector string). The
   * injected SVG keeps the dots centered in the element at any size.
   *
   * options:
   *   dots        (default 3)     how many dots in the row
   *   durationMs  (default 1000)  one dot's full rise-and-fall cycle
   *   staggerMs   (default 180)   the delay between neighboring dots —
   *                               this is what turns three bounces into
   *                               a traveling wave
   *   lift        (default 0.3)   how high a dot rises, as a fraction
   *                               of the SVG's height
   *   dotRadius   (default 7)     dot radius, in the SVG's 100-unit
   *                               space
   *   color       (default null)  dot color; omit for currentColor
   *   autoStart   (default true)
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, start() is a no-op and nothing is visible.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("TypingLoader.create: container not found");
    var dots = Math.max(1, options.dots != null ? options.dots : 3);
    var durationMs = options.durationMs != null ? options.durationMs : 1000;
    var staggerMs = options.staggerMs != null ? options.staggerMs : 180;
    var lift = options.lift != null ? options.lift : 0.3;
    var dotRadius = options.dotRadius != null ? options.dotRadius : 7;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    // Dots sit on a shared baseline in a 100×40 viewBox; lift is a
    // fraction of that height so the bounce scales with the box.
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.setAttribute("class", "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    var circles = [];
    var step = 100 / (dots + 1);
    for (var i = 0; i < dots; i++) {
      var c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", step * (i + 1));
      c.setAttribute("cy", 30);
      c.setAttribute("r", dotRadius);
      c.setAttribute("class", "orbit-loader-typing-dot");
      if (color != null) c.style.fill = color;
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
      var rise = -40 * lift;
      for (var i = 0; i < circles.length; i++) {
        anims.push(circles[i].animate(
          [
            { transform: "translateY(0)", opacity: 0.45 },
            { transform: "translateY(" + rise + "px)", opacity: 1, offset: 0.5 },
            { transform: "translateY(0)", opacity: 0.45 }
          ],
          {
            duration: durationMs,
            iterations: Infinity,
            easing: "ease-in-out",
            // The stagger IS the effect: dot i is i·staggerMs late, and
            // since every animation loops on the same period, the wave
            // holds forever.
            delay: i * staggerMs
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
      dots: circles,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return anims.length > 0; }
    };
  }

  // The dots don't trace a path, so there's nothing for wrap() to
  // build — it's the same call as create(), kept for API symmetry with
  // the other styles so drop-in swaps stay drop-in.
  global.TypingLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
