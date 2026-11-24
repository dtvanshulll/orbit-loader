/*!
 * AccordionLoader — the expanding section, with an edge that draws:
 * open() grows the panel's height and draws its left edge downward
 * with a glowing head, so the eye follows the reveal instead of
 * jumping to the end state. Sibling style module, container-based.
 * Needs only orbit-loader.css; does NOT require orbit-loader.js.
 *
 * One-shot, triggered:
 *   acc.open();      // expand + edge draw + chevron draws & flips
 *   acc.close();     // collapse + edge retract + chevron rotates back
 *   acc.toggle();    // the common case
 * start() runs the demo loop (open, rest, close, rest).
 *
 * The chevron is real Lucide `chevron-down` geometry — a stroke path
 * that draws itself the first time the section opens and rotates 180°
 * with every toggle after that.
 *
 * Usage:
 *   var acc = AccordionLoader.create(panelEl, { color: '#788c5d' });
 *   header.addEventListener('click', function () { acc.toggle(); });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate the collapsible panel `el` (an element or selector
   * string). The panel's height is driven between 0 and its natural
   * height (measured at open time); the left edge draws in step.
   *
   * options:
   *   durationMs  (default 420)   one open or close
   *   restMs      (default 1500)  the demo loop's pause per state
   *   strokeWidth (default 2)     edge thickness, px
   *   closedHeight (default 0)   resting height, px; pass the header
   *                               row's height so it stays visible
   *   color       (default null)  edge color; omit for currentColor
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation: if set, height snaps
   * and the edge never draws.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("AccordionLoader.create: container not found");
    var durationMs = options.durationMs != null ? options.durationMs : 420;
    var restMs = options.restMs != null ? options.restMs : 1500;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    // How tall the panel sits when closed. 0 keeps the old behavior (a
    // bare reveal); pass the header's height and the header stays
    // visible while the body collapses — a real accordion.
    var closedHeight = options.closedHeight != null ? options.closedHeight : 0;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }

    // Height animates via CSS transition; the edge draw is WAAPI on
    // dashoffset, started at the same moment.
    el.style.transition = "height " + durationMs + "ms cubic-bezier(0.65, 0, 0.35, 1)";
    el.style.overflow = "hidden";
    el.style.height = closedHeight + "px";

    // The edge: a vertical path at the panel's left, rebuilt in real
    // pixels at open time (1 unit = 1px, dash math stays exact).
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-accordion");
    svg.setAttribute("aria-hidden", "true");
    svg.style.top = "0";
    svg.style.left = "0";

    var edge = document.createElementNS(SVG_NS, "path");
    edge.setAttribute("class", "orbit-loader-accordion-edge");
    edge.style.strokeWidth = strokeWidth;
    if (color != null) edge.style.stroke = color;
    svg.appendChild(edge);
    el.appendChild(svg);

    // The chevron: Lucide `chevron-down` as one stroke path, pinned
    // to the panel's top-right. Draws itself on first open; every
    // toggle after that just rotates it — drawing again would read
    // as noise on a control users hit repeatedly.
    var chevron = document.createElementNS(SVG_NS, "svg");
    chevron.setAttribute("class", "orbit-loader-accordion-chevron");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("aria-hidden", "true");
    var chevPath = document.createElementNS(SVG_NS, "path");
    chevPath.setAttribute("d", "M6 9 L12 15 L18 9");
    chevron.appendChild(chevPath);
    el.appendChild(chevron);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var isOpen = false;
    var anim = null;
    var chevronDrawn = false;

    function measureEdge() {
      var h = el.scrollHeight || 1;
      var w = strokeWidth;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      edge.setAttribute("d", "M" + (w / 2) + ",0 L" + (w / 2) + "," + h);
      return h;
    }

    function drawEdge(toFraction, ms) {
      if (anim) anim.cancel();
      var h = measureEdge();
      if (reducedMotion) return null;
      var from = toFraction > 0 ? 0 : 1;
      anim = edge.animate([
        { strokeDasharray: (h * from) + " " + h, opacity: 1 },
        { strokeDasharray: (h * toFraction) + " " + h, opacity: 1 }
      ], { duration: ms, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
      anim.onfinish = function () {
        if (toFraction === 0) edge.style.opacity = 0;
      };
      return anim;
    }

    /** Open: measure the natural height, grow, draw the edge down.
        The chevron draws itself the first time; after that it only
        rotates, so repeated toggles stay quiet. */
    function open() {
      if (isOpen) return;
      isOpen = true;
      el.classList.add("is-active");
      chevron.classList.add("is-open");
      var h = measureEdge();
      el.style.height = h + "px";
      drawEdge(1, durationMs);
      if (!reducedMotion && !chevronDrawn) {
        chevronDrawn = true;
        var len = chevPath.getTotalLength ? chevPath.getTotalLength() : 17;
        chevPath.style.strokeDasharray = len + " " + len;
        chevPath.style.strokeDashoffset = len;
        chevPath.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: durationMs * 0.7, delay: durationMs * 0.15,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
      }
    }

    /** Close: collapse, retract the edge, rotate the chevron back. */
    function close() {
      if (!isOpen) return;
      isOpen = false;
      chevron.classList.remove("is-open");
      el.style.height = closedHeight + "px";
      drawEdge(0, durationMs);
      global.setTimeout(function () {
        if (!isOpen) el.classList.remove("is-active");
      }, durationMs);
    }

    /** Toggle — the common case for an accordion header. */
    function toggle() { if (isOpen) close(); else open(); }

    // Demo loop.
    var timer = null;
    var running = false;
    var phase = 0;

    function demoStep() {
      if (phase === 0) { open(); phase = 1; }
      else { close(); phase = 0; }
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      timer = global.setInterval(demoStep, durationMs + restMs);
    }

    function stop() {
      running = false;
      if (timer != null) { global.clearInterval(timer); timer = null; }
    }

    function destroy() {
      stop();
      if (anim) anim.cancel();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    function isRunning() { return running; }

    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      edge: edge,
      chevron: chevron,
      open: open,
      close: close,
      toggle: toggle,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.AccordionLoader = {
    create: create,
    wrap: create
  };
})(window);
