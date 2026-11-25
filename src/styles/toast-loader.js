/*!
 * ToastLoader — the toast/notification countdown: a bar along the
 * toast's bottom edge that depletes as the toast's lifetime runs out,
 * then fades with the toast. Sibling style module with its own
 * create(), container-based like ripple/typing/tether. Needs only
 * orbit-loader.css; does NOT require orbit-loader.js.
 *
 * What makes it different from a CSS width animation on a div: the
 * countdown rides a path — give it a curved bottom edge (or any `d`)
 * and the depletion follows the curve — and the bar drains from its
 * far end with a glowing head, so the remaining time reads at a
 * glance without a number.
 *
 * This is a ONE-SHOT, triggered style:
 *   toast.begin(5000);   // countdown starts, 5s lifetime
 *   toast.dismiss();     // stop early (the toast itself is your code's job)
 * Call start() to run the built-in demo loop (count down, rest, repeat).
 *
 * Usage:
 *   var toast = ToastLoader.create(toastEl, { color: '#788c5d' });
 *   toast.begin(5000);
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Build the countdown rail inside `el` (an element or a selector
   * string — usually a toast). The rail pins to the bottom edge; the
   * container is made position:relative if it isn't already.
   *
   * options:
   *   thickness   (default 3)     bar thickness, px
   *   durationMs  (default 3200)  the demo loop's countdown length
   *   restMs      (default 1200)  the demo loop's pause between toasts
   *   color       (default null)  bar color; omit for currentColor
   *   d           (default null)  optional path `d` string in a
   *                               100×100 box — a curved edge
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, begin() and the demo loop do nothing.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("ToastLoader.create: container not found");
    var variant = options.variant != null ? options.variant : "edge";
    var enter = options.enter != null ? options.enter : "none";
    var pauseOnHover = options.pauseOnHover !== false;
    var thickness = options.thickness != null ? options.thickness : (variant === "bar" ? 4 : 3);
    var ringSize = options.ringSize != null ? options.ringSize : 22;
    var durationMs = options.durationMs != null ? options.durationMs : 3200;
    var restMs = options.restMs != null ? options.restMs : 1200;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }

    // The rail hugs the bottom edge, same trick as page-loader but
    // pinned bottom instead of top. ViewBox in real pixels (re-measured
    // on resize) so dash patterns stay exact. The 'bar' variant adds a
    // faint full-width track and sits inset so the countdown reads as
    // a progress bar, not a border; the 'ring' variant parks a small
    // circle in the top-right corner.
    var total = 100;

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-path orbit-loader-toast");
    svg.setAttribute("aria-hidden", "true");
    svg.style.top = "auto";
    // `.orbit-loader-path` stretches its SVG to the container's full
    // height (inset:0 + height:100%) so the traced path can overlay the
    // whole shape. The toast rail must NOT stretch: an edge/bar rail is
    // a `thickness`-px line pinned to the bottom edge — at full height
    // the viewBox's meet-scaling centers the line mid-toast, which read
    // as a stray underline through the banner copy. Pin it explicitly.
    if (variant !== "ring") svg.style.height = thickness + "px";

    var customD = options.d || null;
    var bar = document.createElementNS(SVG_NS, "path");
    bar.setAttribute("class", "orbit-loader-toast-bar");
    bar.style.strokeWidth = thickness;
    if (color != null) bar.style.stroke = color;

    var guide = null;
    if (variant === "ring") {
      svg.setAttribute("class", "orbit-loader-path orbit-loader-toast orbit-loader-toast-ring");
      svg.style.width = ringSize + "px";
      svg.style.height = ringSize + "px";
      svg.style.right = "10px";
      svg.style.left = "auto";
      svg.style.top = "10px";
      var r = ringSize / 2 - thickness;
      guide = document.createElementNS(SVG_NS, "circle");
      guide.setAttribute("cx", ringSize / 2);
      guide.setAttribute("cy", ringSize / 2);
      guide.setAttribute("r", r);
      guide.setAttribute("fill", "none");
      guide.style.strokeWidth = thickness;
      guide.style.opacity = 0.25;
      if (color != null) guide.style.stroke = color;
      svg.appendChild(guide);
      // A circle path starting at 12 o'clock so the drain reads
      // clockwise from the top, the way timers usually run.
      bar.setAttribute("d",
        "M" + ringSize / 2 + "," + thickness +
        " A" + r + "," + r + " 0 1 1 " + (ringSize / 2 - 0.01) + "," + thickness);
      svg.appendChild(bar);
      el.appendChild(svg);
      total = 2 * Math.PI * r;
    } else {
      if (variant === "bar") {
        svg.style.bottom = "6px";
        svg.style.left = "10px";
        svg.style.right = "auto";
        // width:auto is invalid on an SVG — it would fall back to the
        // class rule's width:100% and overflow the toast's right edge by
        // the inset. Size it explicitly to the inset span instead.
        svg.style.width = "calc(100% - 20px)";
      } else {
        svg.style.bottom = "0";
      }
      guide = document.createElementNS(SVG_NS, "path");
      guide.setAttribute("class", "orbit-loader-toast-track");
      guide.style.strokeWidth = thickness;
      guide.style.opacity = variant === "bar" ? 0.22 : 0;
      if (color != null) guide.style.stroke = color;
      svg.appendChild(guide);
      svg.appendChild(bar);
      el.appendChild(svg);
    }

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function measure() {
      if (variant === "ring") {
        svg.setAttribute("viewBox", "0 0 " + ringSize + " " + ringSize);
        total = bar.getTotalLength ? bar.getTotalLength() : 100;
        return;
      }
      if (customD) {
        bar.setAttribute("d", customD);
        guide.setAttribute("d", customD);
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");
        bar.setAttribute("vector-effect", "non-scaling-stroke");
        guide.setAttribute("vector-effect", "non-scaling-stroke");
        total = bar.getTotalLength ? bar.getTotalLength() : 100;
        return;
      }
      var w = Math.max(1, (el.clientWidth || 300) - (variant === "bar" ? 20 : 0));
      var h = thickness;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.removeAttribute("preserveAspectRatio");
      var line = "M0," + (h / 2) + " L" + w + "," + (h / 2);
      bar.setAttribute("d", line);
      guide.setAttribute("d", line);
      total = w;
    }
    measure();
    var onResize = function () { measure(); paint(); };
    global.addEventListener("resize", onResize);

    // Countdown state: `left` is the remaining fraction of the bar.
    var left = 0;
    var raf = null;
    var running = false;   // a countdown is in flight
    var demo = false;      // the demo loop is on
    var endTimer = null;
    var restTimer = null;

    // Paint the bar as the segment [0, left]. It drains from its far
    // end — the remaining time is always anchored at the start, the
    // way a real countdown shrinks.
    function paint() {
      var segLen = total * left;
      bar.style.strokeDasharray = segLen + " " + (total - segLen);
      bar.style.strokeDashoffset = 0;
      bar.style.opacity = left > 0 ? 1 : 0;
    }

    var lastTs = null; // previous frame's timestamp — wall-clock dt

    function tick(ts) {
      if (!running) return;
      // Linear depletion: a countdown should read as constant rate —
      // easing here would lie about the time left. Depletion is driven
      // by the frame timestamp's delta, not a per-frame constant, so
      // the countdown stays wall-clock accurate on any refresh rate
      // and under frame drops (the old 16.7ms guess drained ~2x too
      // fast on 120Hz displays). Hover pauses the clock without
      // losing the position: paused frames advance lastTs but consume
      // nothing, so resuming never fast-forwards through the pause.
      if (lastTs == null) lastTs = ts;
      var dt = ts - lastTs;
      lastTs = ts;
      if (paused) {
        raf = global.requestAnimationFrame(tick);
        return;
      }
      left -= dt / lifetime;
      if (left <= 0) {
        left = 0;
        paint();
        running = false;
        el.classList.remove("is-active");
        if (demo) restTimer = global.setTimeout(start, restMs);
        return;
      }
      paint();
      raf = global.requestAnimationFrame(tick);
    }

    var lifetime = durationMs;
    var paused = false;

    // Hover pauses the countdown — the standard toast affordance: you
    // noticed it, so it waits for you. Resumes where it stopped.
    function onEnter() { if (running) paused = true; }
    function onLeave() { paused = false; }
    if (pauseOnHover && !reducedMotion) {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }

    // Entrance beats: 'drop' falls in and settles, 'pop' scales up.
    // Applied on every begin() so re-showing a toast re-runs it.
    function enterBeat() {
      if (reducedMotion || enter === "none" || !el.animate) return;
      if (enter === "drop") {
        el.animate([
          { opacity: 0, transform: "translateY(-16px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 320, easing: "cubic-bezier(0.2, 0, 0.2, 1)" });
      } else if (enter === "pop") {
        el.animate([
          { opacity: 0, transform: "scale(0.9)" },
          { opacity: 1, transform: "scale(1)" }
        ], { duration: 260, easing: "cubic-bezier(0.2, 0, 0.2, 1)" });
      }
    }

    /**
     * Begin a countdown of `ms` milliseconds (default: the demo
     * length). A running countdown restarts. Under reduced motion
     * this is a no-op.
     */
    function begin(ms) {
      if (reducedMotion) return;
      lifetime = ms != null ? ms : durationMs;
      if (raf != null) { global.cancelAnimationFrame(raf); raf = null; }
      if (endTimer != null) { global.clearTimeout(endTimer); endTimer = null; }
      running = true;
      el.classList.add("is-active");
      left = 1;
      lastTs = null; // the first frame after begin consumes no time
      paint();
      enterBeat();
      raf = global.requestAnimationFrame(tick);
    }

    /** Stop the countdown early, leaving the bar where it is. */
    function dismiss() {
      running = false;
      if (raf != null) { global.cancelAnimationFrame(raf); raf = null; }
      if (endTimer != null) { global.clearTimeout(endTimer); endTimer = null; }
      el.classList.remove("is-active");
    }

    function start() {
      if (demo || reducedMotion) return;
      demo = true;
      begin(durationMs);
    }

    function stop() {
      demo = false;
      if (restTimer != null) { global.clearTimeout(restTimer); restTimer = null; }
      dismiss();
      left = 0;
      paint();
    }

    function destroy() {
      stop();
      global.removeEventListener("resize", onResize);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    function isRunning() { return running || demo; }

    paint();
    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      bar: bar,
      begin: begin,
      dismiss: dismiss,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.ToastLoader = {
    create: create,
    wrap: create
  };
})(window);
