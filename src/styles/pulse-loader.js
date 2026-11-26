/*!
 * PulseLoader — a ring that breathes in place: it swells and softens
 * on the spot instead of sending a segment traveling around a path.
 * The quietest style in the library — the ambient "something is
 * alive here" pulse for avatars, status dots and idle badges, where a
 * traveling spark would be too loud.
 *
 * It is a sibling style module with its own create(), like
 * ripple-loader.js and typing-loader.js — but container-based: the
 * pulse doesn't trace a path, it radiates from the center of whatever
 * box you give it, so create() and wrap() are the same call and both
 * take the container. It needs only orbit-loader.css and does NOT
 * require orbit-loader.js.
 *
 * Motion design, deliberately calm: sine-eased in-out swelling (no
 * overshoot, no snap), rings staggered half a period apart so one is
 * always swelling while the other rests, and a small steady center dot
 * as the anchor the eye returns to. Two motion layers — the breathing
 * ring (primary) and the anchored dot (secondary) — nothing more; a
 * pulse this quiet loses its calm if it gets busy.
 *
 * Mechanics, all browser-native: each ring is one Element.animate() on
 * transform+opacity with an infinite iteration; the dot is a second
 * animation on the same clock. No rAF, no timers.
 *
 * Usage:
 *   PulseLoader.create(document.querySelector('.avatar'), {
 *     rings: 2, color: '#d97757'
 *   });
 *   pulse.stop();
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Breathing rings inside `el` (an element or a selector string). The
   * injected SVG fills the element, so give the element the final size
   * you want — the pulse scales with it.
   *
   * options:
   *   rings        (default 2)    rings breathing at once; they run
   *                               half a period apart, so with 2 one
   *                               always swells while the other rests
   *   durationMs   (default 2000) one full breath: swell out, settle
   *                               back. Slow on purpose — this is the
   *                               calm style; under ~1200ms it reads
   *                               as urgency instead
   *   minScale     (default 0.82) the ring's rest size as a fraction
   *                               of the box; it swells to full size
   *   maxOpacity   (default 0.7)  the ring's peak opacity at full
   *                               swell; the rest opacity is a third
   *                               of this, so the breath reads in the
   *                               opacity as much as the scale
   *   strokeWidth  (default 4)    ring stroke width, in the SVG's 100-
   *                               unit space (4 ≈ 4% of the box)
   *   dot          (default true) the steady center dot anchoring
   *                               the pulse; false for rings only
   *   color        (default null) ring and dot color; omit for
   *                               currentColor
   *   activeClass  (default "is-active") added to the container while
   *                               running, so CSS can fade the whole
   *                               loader in/out like the other styles
   *   autoStart    (default true)
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, start() is a no-op and nothing is visible.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("PulseLoader.create: container not found");
    var rings = Math.max(1, Math.round(options.rings != null ? options.rings : 2));
    var durationMs = options.durationMs != null ? options.durationMs : 2000;
    var minScale = Math.min(1, Math.max(0.05, options.minScale != null ? options.minScale : 0.82));
    var maxOpacity = Math.min(1, Math.max(0.05, options.maxOpacity != null ? options.maxOpacity : 0.7));
    var strokeWidth = Math.max(0, options.strokeWidth != null ? options.strokeWidth : 4);
    var withDot = options.dot !== false;
    var color = options.color != null ? options.color : null;
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;

    // The injected SVG is absolutely positioned; on a static container
    // it would escape to the nearest positioned ancestor. Same fixup
    // every container-based style applies; undone on destroy.
    var forcedPosition = global.getComputedStyle(el).position === "static";
    if (forcedPosition) el.style.position = "relative";

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
      c.setAttribute("class", "orbit-loader-pulse-ring");
      c.style.strokeWidth = strokeWidth;
      if (color != null) c.style.stroke = color;
      svg.appendChild(c);
      circles.push(c);
    }

    // The anchor: a small filled dot at the center, steady while the
    // rings breathe around it. It gives the eye a place to rest —
    // without it the pulse reads as two unrelated fades.
    var dot = null;
    if (withDot) {
      dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("cx", "50");
      dot.setAttribute("cy", "50");
      dot.setAttribute("r", "9");
      dot.setAttribute("class", "orbit-loader-pulse-dot");
      if (color != null) dot.style.fill = color;
      svg.appendChild(dot);
    }
    el.appendChild(svg);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var anims = [];

    function start() {
      if (reducedMotion || anims.length) return;
      el.classList.add(activeClass);
      for (var i = 0; i < circles.length; i++) {
        // Sine-eased in-out both ways: the breath has no start or end
        // to accent, so symmetric easing keeps it seamless. Ring i is
        // staggered half a period per index, and because every
        // animation loops on the same period the offset holds forever.
        anims.push(circles[i].animate(
          [
            { transform: "scale(" + minScale + ")", opacity: maxOpacity / 3 },
            { transform: "scale(1)", opacity: maxOpacity },
            { transform: "scale(" + minScale + ")", opacity: maxOpacity / 3 }
          ],
          {
            duration: durationMs,
            iterations: Infinity,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            delay: i * durationMs / (circles.length * 2)
          }
        ));
      }
      if (dot) {
        // The dot breathes too, but only a fifth as much — enough to
        // stay alive, never enough to compete with the rings.
        anims.push(dot.animate(
          [
            { transform: "scale(0.92)", opacity: 0.75 },
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(0.92)", opacity: 0.75 }
          ],
          {
            duration: durationMs,
            iterations: Infinity,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)"
          }
        ));
      }
    }

    function stop() {
      for (var i = 0; i < anims.length; i++) anims[i].cancel();
      anims = [];
      el.classList.remove(activeClass);
    }

    function destroy() {
      stop();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
      if (forcedPosition) el.style.position = "";
    }

    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      circles: circles,
      dot: dot,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return anims.length > 0; }
    };
  }

  // The pulse doesn't trace a path, so there's nothing for wrap() to
  // build — it's the same call as create(), kept for API symmetry with
  // the other styles so drop-in swaps stay drop-in.
  if (global) global.PulseLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : undefined);
