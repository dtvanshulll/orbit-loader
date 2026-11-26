/*!
 * ButtonLoader — the submit-button border trace: while a button's
 * action is pending, a glowing segment crawls around the button's own
 * border perimeter; on success the whole border lights and settles.
 * Sibling style module with its own create(), container-based. Needs
 * only orbit-loader.css; does NOT require orbit-loader.js or src/shapes/.
 *
 * What makes it different from a spinner dropped next to a button:
 * the feedback happens ON the button — its own silhouette becomes the
 * progress track — so the button never changes size or layout, and
 * the waiting state reads as the button itself being busy.
 *
 * This is a ONE-SHOT, triggered style:
 *   btn.begin();     // border crawl starts (pending)
 *   btn.success();   // full border lights once, then fades
 *   btn.fail();      // the border settles once in the danger color,
 *                    // then fades and the trace color is restored
 *   btn.reset();     // back to idle
 * Call start() to run the built-in demo loop (begin → success forever).
 *
 * options:
 *   dangerColor  (default "#e5484d") the fail() feedback color
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
    var dangerColor = options.dangerColor != null ? options.dangerColor : "#e5484d";
    var autoStart = options.autoStart !== false;
    var forcedPosition = global.getComputedStyle(el).position === "static";
    if (forcedPosition) el.style.position = "relative";

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
      return makeFill(el, fillLayer, durationMs, dangerColor, reducedMotion, autoStart, forcedPosition);
    }
    if (variant === "ripple") {
      return makeRipple(el, color, dangerColor, durationMs, reducedMotion, autoStart, forcedPosition);
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
      svg.setAttribute("width", w); svg.setAttribute("height", h);
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

    /** Pending: the crawler laps the border until success()/fail(),
     * reset() or destroy() stops it. */
    function begin() {
      if (reducedMotion) return;
      measure();
      if (successAnim) successAnim.cancel();
      if (lapAnim) lapAnim.cancel();
      el.classList.add("is-active");
      // Infinite lap: the dash period equals the perimeter, so the
      // loop point is invisible.
      var segLen = total * segFrac;
      lapAnim = seg.animate(
        [{ strokeDashoffset: 0 }, { strokeDashoffset: -total }],
        { duration: durationMs, iterations: Infinity }
      );
    }

    /** Success: the whole border lights at once, holds, fades. */
    function success() {
      if (reducedMotion) return;
      settle(lapAnim, null);
    }

    /** Failure: the border settles once in the danger color — the same
     * settle as success(), read as a no — then the trace color is
     * restored, so a red flash never rethemes a brand-colored trace. */
    function fail() {
      if (reducedMotion) return;
      var prevStroke = seg.style.stroke; seg.style.stroke = dangerColor;
      settle(lapAnim, function () { seg.style.stroke = prevStroke; });
    }

    /* Shared settle: one full-border draw, hold, fade. `done` runs
     * when the animation lands (used by fail() to restore the stroke). */
    function settle(lap, done) {
      measure();
      if (lap) lap.cancel();
      var ease = "cubic-bezier(0.2, 0, 0.2, 1)";
      successAnim = seg.animate([
        { strokeDasharray: "0 " + total, strokeDashoffset: 0, opacity: 1 },
        { strokeDasharray: total + " 0", strokeDashoffset: 0, opacity: 1, offset: 0.35 },
        { opacity: 0 }
      ], { duration: 900, easing: ease });
      successAnim.onfinish = function () {
        if (done) done();
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
      if (forcedPosition) el.style.position = "";
    }

    // "Running" = the demo loop OR a pending begin(); is-active is the
    // truthful pending marker (added by begin, removed on settle/reset).
    function isRunning() { return running || el.classList.contains("is-active"); }

    measure();
    paint(0);
    if (autoStart) start();

    return {
      el: el, svg: svg, segment: seg,
      begin: begin, success: success, fail: fail, reset: reset,
      start: start, stop: stop, destroy: destroy, isRunning: isRunning
    };
  }

  /**
   * 'fill' variant controller: a color layer sweeps in from the left on
   * begin() (the "working" state), then drains right on success()/fail().
   * The layer is clipped to the button's border-radius via CSS overflow,
   * so no path math is needed.
   */
  function makeFill(el, layer, durationMs, dangerColor, reducedMotion, autoStart, forcedPosition) {
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
    /* Drain the layer right-to-left. With a danger color, the color
     * rides IN the keyframes and the caller's fill is restored on
     * finish — a synchronous swap would never be seen. */
    function drain(bg) {
      var prev = bg != null ? layer.style.background : null;
      if (bg != null) layer.style.background = bg;
      if (layer.animate) {
        var anim = layer.animate(
          [{ transform: "scaleX(1)", transformOrigin: "right center" },
           { transform: "scaleX(0)", transformOrigin: "right center" }],
          { duration: durationMs * 0.45, easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "forwards" }
        );
        if (prev != null) anim.onfinish = function () { layer.style.background = prev; };
      } else {
        layer.style.transform = "scaleX(0)";
        if (prev != null) layer.style.background = prev;
      }
    }
    function settle(bg) {
      if (!busy) begin();
      drain(bg);
      busy = false;
      el.classList.remove("is-active");
    }
    function success() { settle(null); }
    function fail() { if (!reducedMotion) settle(dangerColor); }
    function reset() { busy = false; el.classList.remove("is-active"); layer.style.transform = "scaleX(0)"; }
    var demoTimer = null;
    function start() {
      if (reducedMotion || demoTimer != null) return;
      // Preview loop: sweep in, hold, drain, rest, repeat — the full
      // cycle, never one dead frame.
      begin();
      demoTimer = setTimeout(function () {
        success();
        demoTimer = setTimeout(function () {
          demoTimer = null; start();
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
      if (forcedPosition) el.style.position = "";
    }
    if (autoStart) start();
    return {
      el: el, layer: layer,
      begin: begin, success: success, fail: fail, reset: reset,
      start: start, stop: stop, destroy: destroy, isRunning: function () { return busy; }
    };
  }

  /**
   * 'ripple' variant controller: a circle expands from the press point
   * and fades — the tactile acknowledgment. begin(x, y) takes optional
   * page-relative press coordinates (center without them); fail() fires
   * a danger-colored ripple from the center.
   */
  function makeRipple(el, color, dangerColor, durationMs, reducedMotion, autoStart, forcedPosition) {
    function begin(x, y, rippleColor) {
      if (reducedMotion) return;
      var rect = el.getBoundingClientRect();
      var cx = x != null ? x - rect.left : rect.width / 2;
      var cy = y != null ? y - rect.top : rect.height / 2;
      var size = Math.max(rect.width, rect.height) * 2.2;
      var dot = document.createElement("span");
      dot.className = "orbit-loader-button-ripple";
      dot.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (cx - size / 2) + "px;top:" + (cy - size / 2) + "px;" +
        (function () { var f = rippleColor || color; return f != null ? "background:" + f : ""; })();
      el.appendChild(dot);
      el.classList.add("is-active");
      var drop = function () { if (dot.parentNode) dot.parentNode.removeChild(dot); };
      if (dot.animate) {
        dot.animate(
          [{ transform: "scale(0)", opacity: 0.35 },
           { transform: "scale(1)", opacity: 0 }],
          { duration: durationMs * 0.55, easing: "cubic-bezier(0.2, 0, 0.2, 1)" }
        ).onfinish = drop;
      } else {
        setTimeout(drop, durationMs * 0.55);
      }
    }
    function press(ev) {
      begin(ev.clientX, ev.clientY);
    }
    function success() { /* ripple is momentary; nothing to settle */ }
    function fail() {
      if (reducedMotion) return;
      var r = el.clientWidth / 2, c = el.clientHeight / 2;
      begin(r, c, dangerColor);
    }
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
      // Demo: a center ripple every beat, so the preview keeps
      // showing the press acknowledgment.
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
      if (forcedPosition) el.style.position = "";
    }
    if (autoStart) {
      // A ripple wants a real press: wire pointerdown so the demo IS
      // the interaction, like the tab labels.
      el.addEventListener("pointerdown", press);
    }
    return {
      el: el,
      begin: begin, success: success, fail: fail, reset: reset,
      start: start, stop: stop, destroy: destroy, isRunning: function () { return false; }
    };
  }
  if (global) global.ButtonLoader = {
    create: create,
    wrap: create
  };
})(typeof window !== "undefined" ? window : undefined);
