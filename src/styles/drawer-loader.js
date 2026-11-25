/*!
 * DrawerLoader — the drawer, as a component: the panel slides in from
 * its edge while the edge facing the content draws itself (a left
 * drawer's right edge draws downward, a bottom sheet's top edge draws
 * across), so the eye rides the reveal instead of jumping to the end
 * state. Sibling style module, container-based. Needs only
 * orbit-loader.css; does NOT require orbit-loader.js.
 *
 * Three drawer types via `side`:
 *   'left'   — the classic side drawer, slides in from the left
 *   'right'  — slides in from the right (carts, settings panels)
 *   'bottom' — the bottom sheet; adds a grab handle that draws too
 *
 * One-shot, triggered:
 *   drawer.open();
 *   drawer.close();
 *   drawer.toggle();
 * start() runs the demo loop (open, rest, close, rest).
 *
 * Usage:
 *   var drawer = DrawerLoader.create(panelEl, { side: 'right', color: '#6a9bcc' });
 *   menuBtn.addEventListener('click', function () { drawer.toggle(); });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  var CLOSED_TRANSFORM = {
    left: "translateX(-101%)",
    right: "translateX(101%)",
    bottom: "translateY(101%)"
  };

  /**
   * Animate the drawer panel `el` (an element or selector string).
   * The panel should be positioned (fixed or absolute) against the
   * viewport edge it slides from; the backdrop is injected as a
   * sibling.
   *
   * options:
   *   side        (default 'left') 'left' | 'right' | 'bottom'
   *   durationMs  (default 420)   one open or close
   *   restMs      (default 1600)  the demo loop's pause per state
   *   strokeWidth (default 2)     leading-edge thickness, px
   *   color       (default null)  edge color; omit for currentColor
   *   backdrop    (default true)  inject and fade a backdrop sibling
   *   backdropPosition (default 'fixed') 'fixed' for real drawers,
   *                  'absolute' for previews and embedded demos
   *   handle      (default auto)  bottom sheets get a grab handle;
   *                  pass false to skip it
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation: if set, open/close
   * snap visibility with no motion.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("DrawerLoader.create: container not found");
    var side = options.side || "left";
    if (!CLOSED_TRANSFORM[side]) side = "left";
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 420);
    var restMs = options.restMs != null ? options.restMs : 1600;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var color = options.color != null ? options.color : null;
    var withBackdrop = options.backdrop !== false;
    var backdropPosition = options.backdropPosition || "fixed";
    var withHandle = side === "bottom" ? options.handle !== false : false;
    var autoStart = options.autoStart !== false;

    // The slide is an inline transform (the closed offset depends on
    // the side), animated by the CSS transition on the host class.
    el.classList.add("orbit-loader-drawer-host");
    el.style.transform = CLOSED_TRANSFORM[side];
    // The panel must stack ABOVE its backdrop, or the backdrop dims
    // the very edge that's drawing.
    el.style.zIndex = "41";

    var backdrop = null;
    if (withBackdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "orbit-loader-drawer-backdrop";
      backdrop.style.position = backdropPosition;
      el.parentNode.insertBefore(backdrop, el.nextSibling);
    }

    // The leading edge: the panel edge that faces the content. It is
    // a path measured in real pixels at open time, drawn with the
    // same dasharray crawl as every other path in the library.
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-drawer-edge");
    svg.setAttribute("aria-hidden", "true");

    var edge = document.createElementNS(SVG_NS, "path");
    edge.setAttribute("class", "orbit-loader-drawer-edge-line");
    edge.style.strokeWidth = strokeWidth;
    if (color != null) edge.style.stroke = color;
    svg.appendChild(edge);
    el.appendChild(svg);

    // Bottom sheets get a grab handle: a rounded bar, drawn after the
    // edge lands.
    var handleSvg = null;
    var handlePath = null;
    if (withHandle) {
      handleSvg = document.createElementNS(SVG_NS, "svg");
      handleSvg.setAttribute("class", "orbit-loader-drawer-handle");
      handleSvg.setAttribute("viewBox", "0 0 36 5");
      handleSvg.setAttribute("width", "36");
      handleSvg.setAttribute("height", "5");
      handlePath = document.createElementNS(SVG_NS, "path");
      handlePath.setAttribute("d", "M4,2.5 L32,2.5");
      handlePath.style.strokeWidth = 4;
      if (color != null) handlePath.style.stroke = color;
      handleSvg.appendChild(handlePath);
    }

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var isOpen = false;
    var anims = [];

    // Position the edge svg along the leading edge. Called at open
    // time so it stays correct if the panel's size changes.
    function placeEdge() {
      var w = el.clientWidth, h = el.clientHeight;
      var inset = strokeWidth / 2 + 0.5;
      if (side === "bottom") {
        svg.style.top = "0";
        svg.style.left = "0";
        svg.setAttribute("viewBox", "0 0 " + w + " " + strokeWidth);
        svg.setAttribute("width", w);
        svg.setAttribute("height", strokeWidth);
        edge.setAttribute("d", "M0," + inset + " L" + w + "," + inset);
        return w;
      }
      var x = side === "left" ? w - inset : inset;
      svg.style.top = "0";
      svg.style.left = (side === "left" ? "auto" : "0");
      svg.style.right = (side === "left" ? "0" : "auto");
      svg.setAttribute("viewBox", "0 0 " + strokeWidth + " " + h);
      svg.setAttribute("width", strokeWidth);
      svg.setAttribute("height", h);
      edge.setAttribute("d", "M" + inset + ",0 L" + inset + "," + h);
      return h;
    }

    /** Open: backdrop fades, panel slides in, leading edge draws. */
    function open() {
      if (isOpen) return;
      isOpen = true;
      el.classList.add("is-active");
      el.style.transform = "none";
      if (backdrop) backdrop.classList.add("is-active");
      if (reducedMotion) return;
      var len = placeEdge();
      if (handleSvg) el.appendChild(handleSvg);
      edge.style.opacity = 1;
      var a = edge.animate(
        [{ strokeDasharray: "0 " + len }, { strokeDasharray: len + " 0" }],
        { duration: durationMs, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
      );
      anims.push(a);
      if (handlePath) {
        var hlen = 28;
        handlePath.style.strokeDasharray = hlen + " " + hlen;
        handlePath.style.strokeDashoffset = hlen;
        handlePath.style.opacity = 1;
        var ha = handlePath.animate(
          [{ strokeDashoffset: hlen }, { strokeDashoffset: 0 }],
          { duration: durationMs * 0.4, delay: durationMs * 0.7,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
        );
        anims.push(ha);
      }
    }

    /** Close: slide out, retract the edge, then hide. */
    function close() {
      if (!isOpen) return;
      isOpen = false;
      if (backdrop) backdrop.classList.remove("is-active");
      if (reducedMotion) {
        el.style.transform = CLOSED_TRANSFORM[side];
        el.classList.remove("is-active");
        return;
      }
      var len = placeEdge();
      var a = edge.animate(
        [{ strokeDasharray: len + " 0" }, { strokeDasharray: "0 " + len }],
        { duration: durationMs * 0.8, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
      );
      anims.push(a);
      el.style.transform = CLOSED_TRANSFORM[side];
      global.setTimeout(function () {
        if (!isOpen) {
          el.classList.remove("is-active");
          edge.style.opacity = 0;
          if (handlePath) handlePath.style.opacity = 0;
          if (handleSvg && handleSvg.parentNode) {
            handleSvg.parentNode.removeChild(handleSvg);
          }
        }
      }, durationMs);
    }

    /** Toggle — the common case for a menu or cart button. */
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
      for (var i = 0; i < anims.length; i++) anims[i].cancel();
      anims = [];
      if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      if (handleSvg && handleSvg.parentNode) handleSvg.parentNode.removeChild(handleSvg);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
      el.classList.remove("orbit-loader-drawer-host");
      el.style.transform = "";
      el.style.zIndex = "";
    }

    function isRunning() { return running || el.classList.contains("is-active"); }

    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      edge: edge,
      backdrop: backdrop,
      open: open,
      close: close,
      toggle: toggle,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.DrawerLoader = {
    create: create,
    wrap: create
  };
})(window);
