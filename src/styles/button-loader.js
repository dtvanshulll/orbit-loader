/*!
 * ButtonLoader — the submit-button border trace: while a button's
 * action is pending, a glowing segment crawls around the button's own
 * border perimeter; on success the whole border lights and settles.
 * Sibling style module with its own create(), container-based like
 * ripple/typing/tether. Needs only orbit-loader.css; does NOT require
 * orbit-loader.js or the files in src/shapes/.
 *
 * What makes it different from a spinner dropped next to a button:
 * the feedback happens ON the button — its own silhouette becomes the
 * progress track — so the button never changes size or layout, and
 * the waiting state reads as the button itself being busy.
 *
 * This is a ONE-SHOT, triggered style:
 *   btn.begin();     // border crawl starts (pending)
 *   btn.success();   // full border lights once, then fades
 *   btn.reset();     // back to idle
 * Call start() to run the built-in demo loop (begin → success forever).
 *
 * Usage:
 *   var btn = ButtonLoader.create(document.querySelector('button'), {
 *     color: '#d97757'
 *   });
 *   form.onsubmit = function () { btn.begin(); ... };
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Trace the border of `el` (an element or a selector string —
   * usually a <button>). The SVG is sized to the element and
   * re-measured on demand, so it survives resizes between actions.
   *
   * options:
   *   radius      (default 8)     corner radius, px, matching the
   *                               button's border-radius
   *   durationMs  (default 1100)  one lap around the perimeter
   *   segmentFraction (default 0.22) the crawler's length as a
   *                               fraction of the perimeter
   *   strokeWidth (default 2)     trace thickness, px
   *   color       (default null)  trace color; omit for currentColor
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, begin()/success() and the demo loop do nothing.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("ButtonLoader.create: container not found");
    var variant = options.variant != null ? options.variant : "trace";
    var radius = options.radius != null ? options.radius : 8;
    var durationMs = options.durationMs != null ? options.durationMs : 1100;
    var segFrac = options.segmentFraction != null ? options.segmentFraction : 0.22;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // 'fill' and 'ripple' skip the border SVG entirely: they animate
    // plain layers inside the button, clipped to its rounded corners.
    if (variant === "fill") {
      var fillLayer = document.createElement("span");
      fillLayer.className = "orbit-loader-button-fill";
      if (color != null) fillLayer.style.background = color;
      el.appendChild(fillLayer);
      return makeFill(el, fillLayer, durationMs, reducedMotion, autoStart);
    }
    if (variant === "ripple") {
      return makeRipple(el, color, durationMs, reducedMotion, autoStart);
    }

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-path orbit-loader-button");
    svg.setAttribute("aria-hidden", "true");

    var border = document.createElementNS(SVG_NS, "path");
    border.setAttribute("class", "orbit-loader-button-rail");
    border.setAttribute("vector-effect", "non-scaling-stroke");
    border.style.strokeWidth = 1;
    if (color != null) border.style.stroke = color;
    svg.appendChild(border);

    var seg = document.createElementNS(SVG_NS, "path");
    seg.setAttribute("class", "orbit-loader-button-seg");
    seg.setAttribute("vector-effect", "non-scaling-stroke");
    seg.style.strokeWidth = strokeWidth;
    if (color != null) seg.style.stroke = color;
    svg.appendChild(seg);
    el.appendChild(svg);

    var total = 0;
    var lapAnim = null;
    var successAnim = null;

    // (Re)measure the element and rebuild the rounded-rect path. The
    // path is inset by strokeWidth/2 so the trace sits just inside
    // the button's edge instead of clipping against it.
    function measure() {
      var w = el.clientWidth, h = el.clientHeight;
      var inset = strokeWidth / 2 + 0.5;
      var x = inset, y = inset;
      var iw = Math.max(1, w - inset * 2), ih = Math.max(1, h - inset * 2);
      var r = Math.min(radius, iw / 2, ih / 2);
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      // Rounded rect as one path, starting after the top-left corner
      // and running clockwise.
      var d = "M" + (x + r) + "," + y +
        " L" + (x + iw - r) + "," + y +
        " A" + r + "," + r + " 0 0 1 " + (x + iw) + "," + (y + r) +
        " L" + (x + iw) + "," + (y + ih - r) +
        " A" + r + "," + r + " 0 0 1 " + (x + iw - r) + "," + (y + ih) +
        " L" + (x + r) + "," + (y + ih) +
        " A" + r + "," + r + " 0 0 1 " + x + "," + (y + ih - r) +
        " L" + x + "," + (y + r) +
        " A" + r + "," + r + " 0 0 1 " + (x + r) + "," + y;
      border.setAttribute("d", d);
      seg.setAttribute("d", d);
      total = seg.getTotalLength ? seg.getTotalLength() : 1;
    }

    function paint(startFrac) {
      var segLen = total * segFrac;
      seg.style.strokeDasharray = segLen + " " + (total - segLen);
      seg.style.strokeDashoffset = -(startFrac * total);
    }

    /**
     * Pending: the crawler laps the border forever until success(),
     * reset() or destroy() stops it.
     */
    function begin() {
      if (reducedMotion) return;
      measure();
      if (successAnim) successAnim.cancel();
      if (lapAnim) lapAnim.cancel();
      el.classList.add("is-active");
      // Infinite lap: dashoffset runs one full period per lap. The
      // dash pattern's period equals the perimeter, so the loop is
      // seamless.
      var segLen = total * segFrac;
      lapAnim = seg.animate(
        [{ strokeDashoffset: 0 }, { strokeDashoffset: -total }],
        { duration: durationMs, iterations: Infinity }
      );
    }

    /**
     * Success: the whole border lights at once, holds a beat, fades.
     * Cancels the pending lap.
     */
    function success() {
      if (reducedMotion) return;
      measure();
      if (lapAnim) lapAnim.cancel();
      var ease = "cubic-bezier(0.2, 0, 0.2, 1)";
      successAnim = seg.animate([
        { strokeDasharray: "0 " + total, strokeDashoffset: 0, opacity: 1 },
        { strokeDasharray: total + " 0", strokeDashoffset: 0, opacity: 1, offset: 0.35 },
        { opacity: 0 }
      ], { duration: 900, easing: ease });
      successAnim.onfinish = function () {
        el.classList.remove("is-active");
        // Demo mode: go again after a beat.
        restTimer = global.setTimeout(function () { begin(); }, 1600);
      };
    }

    /** Back to idle: stop everything, hide the trace. */
    function reset() {
      if (lapAnim) lapAnim.cancel();
      if (successAnim) successAnim.cancel();
      el.classList.remove("is-active");
    }

    // Demo loop: begin → success → rest → begin, forever.
    var restTimer = null;
    var running = false;

    function start() {
      if (running || reducedMotion) return;
      running = true;
      begin();
      // First success fires after a couple of laps.
      global.setTimeout(function () { if (running) success(); }, durationMs * 2.4);
    }

    function stop() {
      running = false;
      if (restTimer != null) { global.clearTimeout(restTimer); restTimer = null; }
      reset();
    }

    function destroy() {
      stop();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    function isRunning() { return running; }

    measure();
    paint(0);
    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      segment: seg,
      begin: begin,
      success: success,
      reset: reset,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  /**
   * 'fill' variant controller: a color layer sweeps in from the left
   * on begin() (the "working" state), then drains to the right on
   * success(). The layer is clipped to the button's own border-radius
   * via CSS overflow, so no path math is needed.
   */
  function makeFill(el, layer, durationMs, reducedMotion, autoStart) {
    var busy = false;
    function begin() {
      if (reducedMotion) return;
      busy = true;
      el.classList.add("is-active");
      if (layer.animate) {
        layer.animate(
          [{ transform: "scaleX(0)", transformOrigin: "left center" },
           { transform: "scaleX(1)", transformOrigin: "left center" }],
          { duration: durationMs * 0.45, easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "forwards" }
        );
      } else {
        layer.style.transform = "scaleX(1)";
      }
    }
    function success() {
      if (!busy) { begin(); }
      if (layer.animate) {
        layer.animate(
          [{ transform: "scaleX(1)", transformOrigin: "right center" },
           { transform: "scaleX(0)", transformOrigin: "right center" }],
          { duration: durationMs * 0.45, easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "forwards" }
        );
      } else {
        layer.style.transform = "scaleX(0)";
      }
      busy = false;
      el.classList.remove("is-active");
    }
    function reset() {
      busy = false;
      el.classList.remove("is-active");
      layer.style.transform = "scaleX(0)";
    }
    var demoTimer = null;
    function start() {
      if (reducedMotion || demoTimer != null) return;
      // Preview loop: sweep in, hold, drain, rest, repeat — so a
      // static preview shows the full cycle, not one dead frame.
      begin();
      demoTimer = setTimeout(function () {
        success();
        demoTimer = setTimeout(function () {
          demoTimer = null;
          start();
        }, durationMs * 0.7);
      }, durationMs);
    }
    function stop() {
      if (demoTimer != null) { clearTimeout(demoTimer); demoTimer = null; }
      reset();
    }
    function destroy() {
      stop();
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }
    if (autoStart) start();
    return {
      el: el, layer: layer,
      begin: begin, success: success, reset: reset,
      start: start, stop: stop, destroy: destroy, isRunning: function () { return busy; }
    };
  }

  /**
   * 'ripple' variant controller: a circle expands from the press
   * point and fades — the tactile acknowledgment. begin(x, y) takes
   * optional page-relative press coordinates; without them the ripple
   * starts from the center. success() is a no-op kept for API parity.
   */
  function makeRipple(el, color, durationMs, reducedMotion, autoStart) {
    function begin(x, y) {
      if (reducedMotion) return;
      var rect = el.getBoundingClientRect();
      var cx = x != null ? x - rect.left : rect.width / 2;
      var cy = y != null ? y - rect.top : rect.height / 2;
      var size = Math.max(rect.width, rect.height) * 2.2;
      var dot = document.createElement("span");
      dot.className = "orbit-loader-button-ripple";
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = (cx - size / 2) + "px";
      dot.style.top = (cy - size / 2) + "px";
      if (color != null) dot.style.background = color;
      el.appendChild(dot);
      el.classList.add("is-active");
      if (dot.animate) {
        var anim = dot.animate(
          [{ transform: "scale(0)", opacity: 0.35 },
           { transform: "scale(1)", opacity: 0 }],
          { duration: durationMs * 0.55, easing: "cubic-bezier(0.2, 0, 0.2, 1)" }
        );
        anim.onfinish = function () {
          if (dot.parentNode) dot.parentNode.removeChild(dot);
        };
      } else {
        setTimeout(function () {
          if (dot.parentNode) dot.parentNode.removeChild(dot);
        }, durationMs * 0.55);
      }
    }
    function press(ev) {
      begin(ev.clientX, ev.clientY);
    }
    function success() { /* ripple is momentary; nothing to settle */ }
    function reset() {
      var dots = el.querySelectorAll(".orbit-loader-button-ripple");
      for (var i = 0; i < dots.length; i++) {
        if (dots[i].parentNode) dots[i].parentNode.removeChild(dots[i]);
      }
      el.classList.remove("is-active");
    }
    var demoTimer = null;
    function start() {
      if (reducedMotion || demoTimer != null) return;
      // Demo: a center ripple every beat so the preview keeps showing
      // the press acknowledgment.
      begin();
      demoTimer = setTimeout(function () {
        demoTimer = null;
        start();
      }, durationMs + 400);
    }
    function stop() {
      if (demoTimer != null) { clearTimeout(demoTimer); demoTimer = null; }
      reset();
    }
    function destroy() {
      stop();
      el.removeEventListener("pointerdown", press);
    }
    if (autoStart) {
      // A ripple wants a real press: wire pointerdown so the demo IS
      // the interaction, like the tab labels.
      el.addEventListener("pointerdown", press);
    }
    return {
      el: el,
      begin: begin, success: success, reset: reset,
      start: start, stop: stop, destroy: destroy, isRunning: function () { return false; }
    };
  }

  global.ButtonLoader = {
    create: create,
    wrap: create
  };
})(window);
