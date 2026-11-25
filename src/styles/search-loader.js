/*!
 * SearchLoader — the search bar, animated: open() widens the field and
 * draws its underline out from the left with a glowing head; close()
 * retracts both. Sibling style module, container-based like tab/page.
 * Needs only orbit-loader.css; does NOT require orbit-loader.js.
 *
 * The underline is a path, so it draws with the same dasharray crawl
 * as everything else in the library — and the field's width animates
 * with a CSS transition in step, so the two motions land together.
 *
 * One-shot, triggered:
 *   search.open();    // expand + underline draw + magnifier draws
 *   search.close();   // collapse + underline retract + icon fades
 * start() runs the demo loop (open, rest, close, rest).
 *
 * The magnifier is real Lucide geometry (24×24, stroke 2, round caps)
 * drawn as stroke paths, so it draws itself with the same dasharray
 * crawl as the underline — ring first, then the handle.
 *
 * Usage:
 *   var search = SearchLoader.create(fieldEl, { color: '#6a9bcc' });
 *   searchBtn.addEventListener('click', function () { search.open(); });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate the search field `el` (an element or selector string).
   * The container's width is driven between `collapsedWidth` and
   * `expandedWidth` (px), with the underline drawing beneath it.
   *
   * options:
   *   collapsedWidth (default 44)   the field's resting width, px
   *   expandedWidth  (default 260)  the field's open width, px
   *   durationMs     (default 450)  one open or close
   *   restMs         (default 1400) the demo loop's pause per state
   *   strokeWidth    (default 2)    underline thickness, px
   *   color          (default null) underline color; omit for currentColor
   *   placeholder    (default 'Search') text that fades in once the
   *                  field is open; pass '' for none
   *   autoStart      (default true) run the demo loop immediately
   *
   * Reduced motion is checked once at creation: if set, the width
   * snaps and the underline never draws.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("SearchLoader.create: container not found");
    var collapsedW = options.collapsedWidth != null ? options.collapsedWidth : 44;
    var expandedW = options.expandedWidth != null ? options.expandedWidth : 260;
    var durationMs = options.durationMs != null ? options.durationMs : 450;
    var restMs = options.restMs != null ? options.restMs : 1400;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    var forcedPosition = global.getComputedStyle(el).position === "static";
    if (forcedPosition) el.style.position = "relative";
    // Width transitions in CSS so it stays smooth and cheap; the
    // underline draw is WAAPI on dashoffset, started at the same
    // moment so both motions land together.
    el.style.transition = "width " + durationMs + "ms cubic-bezier(0.65, 0, 0.35, 1)";
    el.style.width = collapsedW + "px";

    // The underline: one path rebuilt at the field's pixel width
    // (re-measured on resize — 1 unit = 1px, so dash math is exact).
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-path orbit-loader-search");
    svg.setAttribute("aria-hidden", "true");
    // The base .orbit-loader-path is inset:0/height:100% for stretched
    // viewBoxes; this strip must sit at the field's BOTTOM edge at its
    // exact pixel height, so pin it inline (inline beats the base CSS).
    svg.style.top = "auto";
    svg.style.bottom = "0";
    svg.style.height = strokeWidth + "px";

    var line = document.createElementNS(SVG_NS, "path");
    line.setAttribute("class", "orbit-loader-search-line");
    line.style.strokeWidth = strokeWidth;
    if (color != null) line.style.stroke = color;
    svg.appendChild(line);
    el.appendChild(svg);

    // The magnifier: Lucide `search` geometry as stroke paths. Two
    // elements so the ring draws before the handle (staggered), the
    // way the eye reads a magnifier being sketched.
    var icon = document.createElementNS(SVG_NS, "svg");
    icon.setAttribute("class", "orbit-loader-search-icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    var ring = document.createElementNS(SVG_NS, "circle");
    ring.setAttribute("cx", "11");
    ring.setAttribute("cy", "11");
    ring.setAttribute("r", "8");
    var handle = document.createElementNS(SVG_NS, "path");
    handle.setAttribute("d", "M21 21 L16.66 16.66");
    icon.appendChild(ring);
    icon.appendChild(handle);
    el.appendChild(icon);

    // The placeholder: fades in once the field is open, so the demo
    // doesn't read as an empty box. Plain text, muted, non-interactive.
    var placeholderText = options.placeholder !== undefined ? options.placeholder : "Search";
    var placeholder = null;
    if (placeholderText) {
      placeholder = document.createElement("span");
      placeholder.className = "orbit-loader-search-placeholder";
      placeholder.textContent = placeholderText;
      el.appendChild(placeholder);
    }

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var total = 100;
    var isOpen = false;
    var anim = null;

    function measure() {
      var w = Math.max(1, expandedW);
      var h = strokeWidth;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      svg.removeAttribute("preserveAspectRatio");
      line.setAttribute("d", "M0," + (h / 2) + " L" + w + "," + (h / 2));
      total = w;
    }
    measure();
    var onResize = function () { measure(); };
    global.addEventListener("resize", onResize);

    function drawTo(fraction, ms) {
      if (anim) anim.cancel();
      if (reducedMotion) {
        line.style.strokeDasharray = (total * fraction) + " " + (total - total * fraction);
        line.style.strokeDashoffset = 0;
        line.style.opacity = fraction > 0 ? 1 : 0;
        return null;
      }
      var to = fraction;
      anim = line.animate([
        {
          strokeDasharray: "0 " + total,
          strokeDashoffset: 0,
          opacity: 1
        },
        {
          strokeDasharray: (total * to) + " " + (total - total * to),
          strokeDashoffset: 0,
          opacity: 1
        }
      ], { duration: ms, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
      anim.onfinish = function () {
        if (to === 0) line.style.opacity = 0;
      };
      return anim;
    }

    /** Open: the field widens, the underline draws out, and the
        magnifier sketches itself — ring first, then the handle. */
    function open() {
      if (isOpen) return;
      isOpen = true;
      el.classList.add("is-active");
      el.style.width = expandedW + "px";
      drawTo(1, durationMs);
      if (!reducedMotion) {
        var ringLen = 2 * Math.PI * 8;
        var handleLen = Math.sqrt(4.34 * 4.34 * 2);
        ring.style.strokeDasharray = ringLen + " " + ringLen;
        ring.style.strokeDashoffset = ringLen;
        handle.style.strokeDasharray = handleLen + " " + handleLen;
        handle.style.strokeDashoffset = handleLen;
        ring.animate(
          [{ strokeDashoffset: ringLen }, { strokeDashoffset: 0 }],
          { duration: durationMs * 0.6, delay: durationMs * 0.2,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
        handle.animate(
          [{ strokeDashoffset: handleLen }, { strokeDashoffset: 0 }],
          { duration: durationMs * 0.4, delay: durationMs * 0.7,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
      }
      if (placeholder) {
        global.setTimeout(function () {
          if (isOpen) el.classList.add("tl-placeholder-in");
        }, durationMs * 0.8);
      }
    }

    /** Close: everything retracts, placeholder fades out first. */
    function close() {
      if (!isOpen) return;
      isOpen = false;
      el.classList.remove("tl-placeholder-in");
      el.style.width = collapsedW + "px";
      drawTo(0, durationMs);
      if (!reducedMotion) {
        // is-active drops after the retract finishes, not during.
        global.setTimeout(function () {
          if (!isOpen) el.classList.remove("is-active");
        }, durationMs);
      } else {
        el.classList.remove("is-active");
      }
    }

    /** Toggle — the common case for a search icon button. */
    function toggle() { if (isOpen) close(); else open(); }

    // Demo loop: open, rest, close, rest, forever.
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
      global.removeEventListener("resize", onResize);
      if (anim) anim.cancel();
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
      if (icon.parentNode) icon.parentNode.removeChild(icon);
      if (forcedPosition) el.style.position = "";
    }

    function isRunning() { return running || el.classList.contains("is-active"); }

    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      line: line,
      icon: icon,
      placeholder: placeholder,
      open: open,
      close: close,
      toggle: toggle,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.SearchLoader = {
    create: create,
    wrap: create
  };
})(window);
