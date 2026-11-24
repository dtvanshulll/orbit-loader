/*!
 * ModalLoader — the dialog entrance, with the library's signature on
 * it: the backdrop fades, the panel rises and settles, and the
 * panel's border traces itself once on arrival. Sibling style module,
 * container-based. Needs only orbit-loader.css; does NOT require
 * orbit-loader.js.
 *
 * What makes the border trace worth doing: a modal that pops in reads
 * as "appeared"; a modal whose border draws itself reads as
 * "assembled" — the eye follows the frame being built, which is the
 * moment the user commits to what's inside it.
 *
 * One-shot, triggered:
 *   modal.open();    // backdrop + rise + border trace + close icon draws
 *   modal.close();   // reverse, then hidden (or click the X)
 * start() runs the demo loop (open, rest, close, rest).
 *
 * The close button is real Lucide `x` geometry — two stroke paths
 * that draw themselves one after the other once the border trace
 * finishes, so the dialog assembles from the frame inward.
 *
 * Usage:
 *   var modal = ModalLoader.create(dialogEl, { color: '#d97757' });
 *   openBtn.addEventListener('click', function () { modal.open(); });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate the dialog panel `el` (an element or selector string).
   * The panel is shown/hidden with the visibility class; the backdrop
   * is expected to be the consumer's (or use `backdrop: true` to have
   * one injected as a sibling).
   *
   * options:
   *   radius      (default 12)    panel corner radius, px
   *   durationMs  (default 480)   one open or close
   *   restMs      (default 1600)  the demo loop's pause per state
   *   strokeWidth (default 2)     border-trace thickness, px
   *   color       (default null)  trace color; omit for currentColor
   *   backdrop    (default true)  inject and fade a backdrop sibling
   *   backdropPosition (default 'fixed')
   *                  'fixed' covers the viewport (real dialogs);
   *                  'absolute' covers the nearest positioned ancestor
   *                  (previews, embedded demos) — pass this wherever
   *                  the panel isn't a top-level dialog.
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation: if set, open/close
   * snap visibility with no motion.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("ModalLoader.create: container not found");
    var radius = options.radius != null ? options.radius : 12;
    var durationMs = options.durationMs != null ? options.durationMs : 480;
    var restMs = options.restMs != null ? options.restMs : 1600;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var color = options.color != null ? options.color : null;
    var withBackdrop = options.backdrop !== false;
    var backdropPosition = options.backdropPosition || "fixed";
    var autoStart = options.autoStart !== false;

    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }

    // Optional backdrop: a fixed overlay behind the panel, faded by
    // its own is-active class (toggled in open/close — sibling-order
    // selectors would depend on DOM position, which we don't own).
    var backdrop = null;
    if (withBackdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "orbit-loader-modal-backdrop";
      backdrop.style.position = backdropPosition;
      el.parentNode.insertBefore(backdrop, el.nextSibling);
    }
    // The rise-and-settle entrance lives on this class, and the panel
    // stacks above its backdrop so the backdrop never dims the trace.
    // The rise duration follows durationMs so the border trace and the
    // movement land together instead of trailing each other.
    el.classList.add("orbit-loader-modal-host");
    el.style.transitionDuration = durationMs + "ms, " + durationMs + "ms";
    el.style.zIndex = "41";

    // The border trace: a rounded-rect path measured at open time, so
    // it stays correct if the panel's content changes size.
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-modal-trace");
    svg.setAttribute("aria-hidden", "true");

    var frame = document.createElementNS(SVG_NS, "path");
    frame.setAttribute("class", "orbit-loader-modal-frame");
    frame.style.strokeWidth = strokeWidth;
    if (color != null) frame.style.stroke = color;
    svg.appendChild(frame);
    el.appendChild(svg);

    // The close button: Lucide `x` as two stroke paths in one 24×24
    // svg. It draws itself after the border trace, and clicking it
    // closes the dialog — the icon is wired, not decorative.
    var closeBtn = document.createElementNS(SVG_NS, "svg");
    closeBtn.setAttribute("class", "orbit-loader-modal-close");
    closeBtn.setAttribute("viewBox", "0 0 24 24");
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("aria-label", "Close");
    var x1 = document.createElementNS(SVG_NS, "path");
    x1.setAttribute("d", "M18 6 L6 18");
    var x2 = document.createElementNS(SVG_NS, "path");
    x2.setAttribute("d", "M6 6 L18 18");
    closeBtn.appendChild(x1);
    closeBtn.appendChild(x2);
    el.appendChild(closeBtn);
    closeBtn.addEventListener("click", function () { close(); });

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var isOpen = false;
    var anims = [];
    var timer = null;
    var running = false;
    var phase = 0;

    function measureFrame() {
      var w = el.clientWidth, h = el.clientHeight;
      var inset = strokeWidth / 2 + 0.5;
      var x = inset, y = inset;
      var iw = Math.max(1, w - inset * 2), ih = Math.max(1, h - inset * 2);
      var r = Math.min(radius, iw / 2, ih / 2);
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      var d = "M" + (x + r) + "," + y +
        " L" + (x + iw - r) + "," + y +
        " A" + r + "," + r + " 0 0 1 " + (x + iw) + "," + (y + r) +
        " L" + (x + iw) + "," + (y + ih - r) +
        " A" + r + "," + r + " 0 0 1 " + (x + iw - r) + "," + (y + ih) +
        " L" + (x + r) + "," + (y + ih) +
        " A" + r + "," + r + " 0 0 1 " + x + "," + (y + ih - r) +
        " L" + x + "," + (y + r) +
        " A" + r + "," + r + " 0 0 1 " + (x + r) + "," + y;
      frame.setAttribute("d", d);
      return frame.getTotalLength ? frame.getTotalLength() : 1;
    }

    /** Open: backdrop fades in, panel rises, border traces once. */
    function open() {
      if (isOpen) return;
      isOpen = true;
      el.classList.add("is-active");
      el.classList.add("tl-open");
      if (backdrop) backdrop.classList.add("is-active");
      if (reducedMotion) return;
      var total = measureFrame();
      frame.style.strokeDasharray = total + " 0";
      frame.style.opacity = 1;
      // Rise: translateY + settle, driven by CSS classes so it stays
      // in sync with the stylesheet; the trace is WAAPI.
      var a = frame.animate(
        [{ strokeDasharray: "0 " + total, opacity: 1 },
         { strokeDasharray: total + " 0", opacity: 1, offset: 0.8 },
         { strokeDasharray: total + " 0", opacity: 0 }],
        { duration: durationMs + 60, easing: "cubic-bezier(0.2, 0, 0.2, 1)" }
      );
      anims.push(a);
      a.onfinish = function () { frame.style.opacity = 0; };
      // The X draws once the frame has traced past it — staggered
      // strokes, same dasharray crawl.
      var xLen = Math.sqrt(12 * 12 * 2);
      [x1, x2].forEach(function (stroke, i) {
        stroke.style.strokeDasharray = xLen + " " + xLen;
        stroke.style.strokeDashoffset = xLen;
        var sa = stroke.animate(
          [{ strokeDashoffset: xLen }, { strokeDashoffset: 0 }],
          { duration: 240, delay: durationMs + 80 + i * 140,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
        anims.push(sa);
      });
    }

    /** Close: reverse, then hidden. */
    function close() {
      if (!isOpen) return;
      isOpen = false;
      if (backdrop) backdrop.classList.remove("is-active");
      if (reducedMotion) {
        el.classList.remove("tl-open", "is-active");
        return;
      }
      el.classList.remove("tl-open");
      global.setTimeout(function () {
        if (!isOpen) el.classList.remove("is-active");
      }, durationMs);
    }

    // Demo loop.
    function demoStep() {
      if (phase === 0) { open(); phase = 1; }
      else { close(); phase = 0; }
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      timer = global.setInterval(demoStep, durationMs + restMs + 400);
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
      if (svg.parentNode) svg.parentNode.removeChild(svg);
      el.classList.remove("orbit-loader-modal-host");
      el.style.zIndex = "";
    }

    function isRunning() { return running; }

    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      frame: frame,
      closeBtn: closeBtn,
      open: open,
      close: close,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.ModalLoader = {
    create: create,
    wrap: create
  };
})(window);
