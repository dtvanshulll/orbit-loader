/*!
 * InputLoader — the text field, as a component: focus() draws the
 * field's underline with a glowing head while the label floats up,
 * success() hands the line to mint and draws a Lucide check at the
 * right edge, error() hands it to red and shakes the field once.
 * Sibling style module, container-based. Needs only orbit-loader.css;
 * does NOT require orbit-loader.js.
 *
 * One-shot, triggered:
 *   input.focus();   // underline draws, label floats up
 *   input.blur();    // underline retracts, label settles back (if empty)
 *   input.success(); // mint line + check
 *   input.error();   // red line + one shake
 * start() runs the demo loop (focus, rest, success, rest, blur).
 *
 * Usage:
 *   var input = InputLoader.create(fieldEl, { color: '#6a9bcc' });
 *   fieldEl.addEventListener('focus', function () { input.focus(); });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate the field wrapper `el` (an element or selector string).
   * The wrapper should contain the real input; the underline, label
   * and status icon are injected around it.
   *
   * options:
   *   label       (default 'Email') the floating label text; '' for none
   *   value       (default '')    typed value; the demo loop types it
   *                               in after focus, character by character
   *   durationMs  (default 360)   one focus or blur
   *   restMs      (default 1500)  the demo loop's pause per state
   *   strokeWidth (default 2)     underline thickness, px
   *   color       (default null)  focus underline; omit for currentColor
   *   autoStart   (default true)  run the demo loop immediately
   *   delayMs     (default 0)     wait this long before the demo loop
   *                               starts. Multi-field forms stagger their
   *                               fields with it — without it every field
   *                               on the card focuses, types and blurs
   *                               in lockstep, which reads as one click
   *                               editing every box at once
   *
   * Reduced motion is checked once at creation: if set, state changes
   * snap with no motion.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("InputLoader.create: container not found");
    var labelText = options.label !== undefined ? options.label : "Email";
    var durationMs = options.durationMs != null ? options.durationMs : 360;
    var restMs = options.restMs != null ? options.restMs : 1500;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;
    var delayMs = options.delayMs != null ? options.delayMs : 0;

    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }

    // The underline: one path across the field's bottom, rebuilt at
    // the field's pixel width on resize (1 unit = 1px, dash math exact).
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-input-line");
    svg.setAttribute("aria-hidden", "true");
    svg.style.top = "auto";
    svg.style.bottom = "0";
    svg.style.height = strokeWidth + "px";

    var line = document.createElementNS(SVG_NS, "path");
    line.setAttribute("class", "orbit-loader-input-line-path");
    line.style.strokeWidth = strokeWidth;
    if (color != null) line.style.stroke = color;
    svg.appendChild(line);
    el.appendChild(svg);

    // Floating label: sits in the field, rises to the top edge on focus.
    var label = null;
    if (labelText) {
      label = document.createElement("span");
      label.className = "orbit-loader-input-label";
      label.textContent = labelText;
      el.appendChild(label);
    }

    // The typed value: an optional `value` option. The demo loop types it
    // character by character after focus, so the demo reads as a real
    // field being filled in — focus, label floats, text appears, check.
    var valueText = options.value != null ? String(options.value) : "";
    var valueEl = null;
    if (valueText) {
      valueEl = document.createElement("span");
      valueEl.className = "orbit-loader-input-value";
      valueEl.textContent = "";
      el.appendChild(valueEl);
    }

    // Status icon: Lucide `check` for success, drawn at the right edge.
    var status = document.createElementNS(SVG_NS, "svg");
    status.setAttribute("class", "orbit-loader-input-status");
    status.setAttribute("viewBox", "0 0 24 24");
    status.setAttribute("aria-hidden", "true");
    var check = document.createElementNS(SVG_NS, "path");
    check.setAttribute("d", "M4 12 L9.5 17.5 L20 7");
    status.appendChild(check);
    el.appendChild(status);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var total = 100;
    var anim = null;
    var state = "idle";

    function measure() {
      var w = Math.max(1, el.clientWidth);
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

    function drawTo(fraction, ms, lineColor) {
      if (anim) anim.cancel();
      if (lineColor != null) line.style.stroke = lineColor;
      if (reducedMotion) {
        line.style.strokeDasharray = (total * fraction) + " " + (total - total * fraction);
        line.style.strokeDashoffset = 0;
        line.style.opacity = fraction > 0 ? 1 : 0;
        return null;
      }
      anim = line.animate([
        { strokeDasharray: "0 " + total, opacity: 1 },
        { strokeDasharray: (total * fraction) + " " + (total - total * fraction), opacity: 1 }
      ], { duration: ms, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
      anim.onfinish = function () {
        if (fraction === 0) line.style.opacity = 0;
      };
      return anim;
    }

    /** Focus: the underline draws in and the label floats up. */
    function focus() {
      state = "focus";
      el.classList.add("is-active");
      el.classList.add("tl-focused");
      status.style.opacity = 0;
      drawTo(1, durationMs, color);
    }

    /** Blur: the underline retracts, the label settles back. */
    function blur() {
      state = "idle";
      el.classList.remove("tl-focused", "tl-success", "tl-error");
      status.style.opacity = 0;
      if (valueEl) valueEl.textContent = "";
      drawTo(0, durationMs);
    }

    /** Success: hand the line to mint and draw the check. */
    function success() {
      state = "success";
      el.classList.add("tl-success");
      el.classList.add("is-active");
      drawTo(1, durationMs * 0.6, "#788c5d");
      if (reducedMotion) { status.style.opacity = 1; return; }
      var len = check.getTotalLength ? check.getTotalLength() : 22;
      check.style.strokeDasharray = len + " " + len;
      check.style.strokeDashoffset = len;
      status.style.opacity = 1;
      var a = check.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 240, delay: durationMs * 0.4,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
      );
      anim = a;
    }

    /** Error: hand the line to red and shake the field once. */
    function error() {
      state = "error";
      el.classList.add("tl-error");
      el.classList.add("is-active");
      drawTo(1, durationMs * 0.6, "#d97757");
      if (reducedMotion) return;
      var a = el.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-5px)" },
         { transform: "translateX(4px)" }, { transform: "translateX(-2px)" },
         { transform: "translateX(0)" }],
        { duration: 320, delay: durationMs * 0.5, easing: "ease-out" }
      );
      anim = a;
    }

    // Demo loop: focus, type the value, success, rest, blur. Without a
    // `value` option it's the classic focus → success → blur cycle.
    var timer = null;
    var running = false;
    var phase = 0;
    var typeTimer = null;

    function typeValue() {
      if (!valueEl) { success(); return; }
      var i = 0;
      typeTimer = global.setInterval(function () {
        i++;
        valueEl.textContent = valueText.slice(0, i);
        if (i >= valueText.length) {
          global.clearInterval(typeTimer);
          typeTimer = null;
          success();
        }
      }, Math.max(24, durationMs * 0.12));
    }

    function demoStep() {
      phase = (phase + 1) % 4;
      if (phase === 1) focus();
      else if (phase === 2) typeValue();
      else blur();
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      timer = global.setInterval(demoStep, durationMs + restMs / 2);
    }

    var startTimer = null;

    function stop() {
      running = false;
      if (timer != null) { global.clearInterval(timer); timer = null; }
      if (typeTimer != null) { global.clearInterval(typeTimer); typeTimer = null; }
      if (startTimer != null) { global.clearTimeout(startTimer); startTimer = null; }
    }

    function destroy() {
      stop();
      global.removeEventListener("resize", onResize);
      if (anim) anim.cancel();
      if (label && label.parentNode) label.parentNode.removeChild(label);
      if (valueEl && valueEl.parentNode) valueEl.parentNode.removeChild(valueEl);
      if (status.parentNode) status.parentNode.removeChild(status);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    function isRunning() { return running; }

    if (autoStart && delayMs > 0) {
      startTimer = global.setTimeout(function () {
        startTimer = null;
        start();
      }, delayMs);
    } else if (autoStart) {
      start();
    }

    return {
      el: el,
      svg: svg,
      line: line,
      label: label,
      status: status,
      focus: focus,
      blur: blur,
      success: success,
      error: error,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.InputLoader = {
    create: create,
    wrap: create
  };
})(window);
