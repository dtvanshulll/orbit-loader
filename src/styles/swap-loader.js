/*!
 * TraceLoop — the swap style (SwapLoader): two panels trading places.
 * The panel you're leaving accelerates out (short, fades as it goes),
 * the one arriving decelerates in — the one-shot transition behind
 * log-in/sign-up flips, tab bodies and wizard steps.
 *
 *   <div class="auth">            <- container, sized and position:relative
 *     <div>log-in panel</div>     <- panels are the container's element
 *     <div>sign-up panel</div>       children, in swap order
 *   </div>
 *   SwapLoader.wrap('.auth').swapTo(1);
 *
 * The loader positions every child absolutely over the container, so
 * give the container its final size — the panels fill it. The demo
 * loop cycles through the panels; `swapTo(i)` drives it for real UI.
 *
 * options:
 *   axis        (default 'x')    'x' slides horizontally, 'y' vertically
 *   exitMs      (default 170)    the leaving panel's slide-and-fade;
 *                                deliberately shorter than the entrance —
 *                                exits accelerate, entrances decelerate
 *   durationMs  (default 300)    the arriving panel's slide-and-fade
 *   restMs      (default 2600)   the demo loop's pause on each panel
 *   distance    (default 5)      slide distance, % of the container
 *   autoStart   (default true)   run the demo loop immediately
 *
 * Reduced motion is checked once at creation: if set, swaps are an
 * instant class toggle with no motion.
 */
(function (global) {
  "use strict";

  /** Swap the panels inside `el` (an element or selector string). */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("SwapLoader.create: container not found");

    var axis = options.axis === "y" ? "y" : "x";
    var exitMs = options.exitMs != null ? options.exitMs : 170;
    var durationMs = options.durationMs != null ? options.durationMs : 300;
    var restMs = options.restMs != null ? options.restMs : 2600;
    var distance = options.distance != null ? options.distance : 5;
    var autoStart = options.autoStart !== false;

    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }

    // Panels: the container's element children, stacked over it.
    var panels = [];
    for (var n = 0; n < el.children.length; n++) {
      var p = el.children[n];
      if (p.nodeType !== 1) continue;
      p.classList.add("orbit-loader-swap-panel");
      panels.push(p);
    }
    if (panels.length < 2) {
      throw new Error("SwapLoader.create: container needs at least two panels");
    }

    // Checked once at creation, like every style.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var index = -1;
    var timer = null;

    /** Mark `i` as the only visible panel, no motion. */
    function settle(i) {
      for (var k = 0; k < panels.length; k++) {
        panels[k].classList.toggle("is-in", k === i);
        panels[k].classList.toggle("is-out", k !== i);
      }
      index = i;
    }

    var move = axis === "x" ? "translateX" : "translateY";

    /**
     * One-shot swap to panel `i`. The leaving panel accelerates out
     * while the arriving one decelerates in from the far side — both
     * fade, so the trade reads as a place changing, not two boxes
     * flying. Self-healing: every panel except the two trading places
     * is forced to its rest state first, so a swap whose finish event
     * never fired (a throttled background tab) can't leave stale
     * classes behind, and a swap interrupted by the next one simply
     * retargets — the newer animation wins per property.
     */
    function swapTo(i) {
      i = ((i % panels.length) + panels.length) % panels.length;
      if (i === index) return;
      var fromIdx = index < 0 ? i : index;
      var from = panels[fromIdx];
      var to = panels[i];
      for (var k = 0; k < panels.length; k++) {
        if (k === i || k === fromIdx) continue;
        panels[k].classList.remove("is-in");
        panels[k].classList.add("is-out");
      }
      if (reducedMotion || !from.animate) { settle(i); return; }
      to.style.zIndex = 2;
      from.style.zIndex = 1;
      to.classList.remove("is-out");
      to.classList.add("is-in");
      from.animate(
        [{ opacity: 1, transform: move + "(0)" },
         { opacity: 0, transform: move + "(-" + distance + "%)" }],
        { duration: exitMs, easing: "cubic-bezier(0.3, 0, 1, 1)", fill: "forwards" }
      );
      to.animate(
        [{ opacity: 0, transform: move + "(" + distance + "%)" },
         { opacity: 1, transform: move + "(0)" }],
        { duration: durationMs, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
      ).onfinish = function () {
        // Best-effort cleanup when the finish event fires; the sanitize
        // at the next swapTo heals the classes when it doesn't.
        from.classList.remove("is-in");
        from.classList.add("is-out");
      };
      index = i;
    }

    /** Demo loop: advance to the next panel after each rest. */
    function step() { swapTo(index + 1); }
    function start() {
      if (timer != null) return;
      if (index < 0) settle(0);
      timer = global.setInterval(step, restMs + durationMs);
    }
    function stop() {
      if (timer != null) { global.clearInterval(timer); timer = null; }
    }
    function destroy() {
      stop();
      for (var k = 0; k < panels.length; k++) {
        panels[k].classList.remove("orbit-loader-swap-panel", "is-in", "is-out");
        panels[k].style.zIndex = "";
      }
    }

    settle(0);
    if (autoStart) start();

    return {
      el: el,
      panels: panels,
      index: function () { return index; },
      swapTo: swapTo,
      next: step,
      start: start,
      stop: stop,
      destroy: destroy
    };
  }

  global.SwapLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
