/*!
 * PageLoader — the top-of-page progress bar, as a path primitive: a
 * glowing segment that trickles forward while content loads, then
 * sweeps to 100% and fades when it's done. Sibling style module with
 * its own create(), container-based like ripple/typing/tether/tab.
 * Needs only orbit-loader.css; does NOT require orbit-loader.js.
 *
 * What makes it different from NProgress and every CSS clone: the bar
 * is a dasharray segment riding a path, so it inherits this library's
 * crawl character — and it can follow a curved top edge, not just a
 * straight line.
 *
 * This is a ONE-SHOT, triggered style with two calls:
 *   page.start();   // begin trickling — position creeps toward 90%
 *   page.done();    // sweep to 100%, fade out, reset for next time
 *
 * Usage:
 *   var page = PageLoader.create(document.body, { color: '#d97757' });
 *   page.start();
 *   // ... when your data arrives:
 *   page.done();
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Build the progress bar inside `el` (an element or a selector
   * string). The bar pins to the container's top edge; the container
   * is made position:relative if it isn't already.
   *
   * options:
   *   thickness   (default 3)     bar thickness, px
   *   durationMs  (default 3600)  how long the demo trickle takes
   *                               before done() fires automatically
   *   restMs      (default 1400)  the demo loop's pause after done()
   *   color       (default null)  bar color; omit for currentColor
   *   d           (default null)  optional path `d` string in a
   *                               100×100 box — give the bar a curve
   *   variant     (default 'bar') the transition style:
 *                               'bar'     — the NProgress-style trickle
 *                                           bar along the top edge
 *                               'curtain' — two panels close from the
 *                                           top corners, meet, then
 *                                           part — a page wipe
 *                               'iris'    — a circle wipes open from
 *                                           the center of the page
 *                               'slide'   — one panel sweeps fully
 *                                           across and off
 *                               'bars'    — five vertical bars stagger
 *                                           down, then stagger away
 *   barCount    (default 5)     panel count for the 'bars' variant
 *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, start() is a no-op.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("PageLoader.create: container not found");
    var variant = options.variant != null ? options.variant : "bar";
    var barCount = Math.max(1, Math.round(options.barCount != null ? options.barCount : 5));
    var thickness = Math.max(1, options.thickness != null ? options.thickness : 3);
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 3600);
    var restMs = Math.max(0, options.restMs != null ? options.restMs : 1400);
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;

    // The bar hugs the top edge: a full-width SVG of exactly the bar's
    // thickness, absolutely positioned. The viewBox is built in REAL
    // PIXELS (re-measured on resize) — 1 unit = 1px — because with a
    // stretched viewBox, browsers compute dash patterns in screen
    // space and the bar would shatter into repeating dashes. If the
    // host is statically positioned, make it relative so the bar pins
    // correctly (restored on destroy).
    var forcedPosition = global.getComputedStyle(el).position === "static";
    if (forcedPosition) el.style.position = "relative";
    var customD = options.d || null;

    // The 'bar' variant keeps the original edge-bar SVG; every other
    // variant builds plain divs and animates them with WAAPI — these
    // are full-page wipes, where a div animates cheaper than a path.
    var svg = null, bar = null, panels = [];
    if (variant === "bar") {
      svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("class", "orbit-loader-path orbit-loader-page");
      svg.setAttribute("aria-hidden", "true");
      svg.style.height = thickness + "px";

      bar = document.createElementNS(SVG_NS, "path");
      bar.setAttribute("class", "orbit-loader-page-bar");
      bar.style.strokeWidth = thickness;
      if (color != null) bar.style.stroke = color;
      svg.appendChild(bar);
      el.appendChild(svg);
    } else if (variant === "bars") {
      for (var bi = 0; bi < barCount; bi++) {
        var b = document.createElement("div");
        b.className = "orbit-loader-page-panel";
        // A 1% gap between bars so the five columns read as separate
        // bars even at the peak of the cycle, where they all extend.
        b.style.left = (bi * (100 / barCount) + 0.5) + "%";
        b.style.width = (100 / barCount - 1) + "%";
        b.style.transform = "scaleY(0)";
        b.style.transformOrigin = "top center";
        b.style.background = color != null ? color : "currentColor";
        el.appendChild(b);
        panels.push(b);
      }
    } else if (variant === "curtain") {
      // Two half-width panels; left one hinges from the left edge,
      // right one from the right — they close like theater curtains.
      for (var ci = 0; ci < 2; ci++) {
        var c = document.createElement("div");
        c.className = "orbit-loader-page-panel";
        c.style.width = "50%";
        c.style.left = ci === 0 ? "0" : "50%";
        c.style.transform = "scaleX(0)";
        c.style.transformOrigin = ci === 0 ? "left center" : "right center";
        c.style.background = color != null ? color : "currentColor";
        el.appendChild(c);
        panels.push(c);
      }
    } else {
      // 'iris' and 'slide': one full-cover panel. Iris clips to a
      // growing circle; slide translates fully across.
      var s = document.createElement("div");
      s.className = "orbit-loader-page-panel";
      s.style.width = "100%";
      s.style.left = "0";
      s.style.background = color != null ? color : "currentColor";
      if (variant === "iris") {
        s.style.clipPath = "circle(0% at 50% 50%)";
      } else {
        s.style.transform = "translateX(-101%)";
      }
      el.appendChild(s);
      panels.push(s);
    }

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var total = 100;

    function measure() {
      if (variant !== "bar") return;
      if (customD) {
        bar.setAttribute("d", customD);
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");
        bar.setAttribute("vector-effect", "non-scaling-stroke");
        total = bar.getTotalLength ? bar.getTotalLength() : 100;
        return;
      }
      var w = Math.max(1, el.clientWidth || 300);
      var h = thickness;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.removeAttribute("preserveAspectRatio");
      bar.setAttribute("d", "M0," + (h / 2) + " L" + w + "," + (h / 2));
      total = w;
    }
    measure();
    var onResize = function () { measure(); paint(); };
    global.addEventListener("resize", onResize);

    // Trickle state: position (0..1) and segment width, both driven
    // per frame. Position creeps asymptotically toward 0.9 — fast at
    // first, slower and slower, never finishing on its own — which is
    // the honest visual for "something is happening, unknown ETA".
    var pos = 0;
    var raf = null;
    var running = false;
    var doneTimer = null;
    var restTimer = null;
    var fadeAnim = null;

    function paint() {
      // Width shrinks as the trickle progresses, like NProgress: a
      // long confident bar early, a thin determined sliver late.
      var w = 0.14 + 0.2 * (1 - Math.min(1, pos / 0.9));
      var segLen = total * w;
      bar.style.strokeDasharray = segLen + " " + (total - segLen);
      bar.style.strokeDashoffset = -(Math.max(0, pos - w) * total);
      bar.style.opacity = 1;
    }

    // The wipe variants: one full cycle = cover, hold, reveal. Each
    // variant choreographs its own keyframes; the loop re-runs the
    // cycle on the demo timer so previews keep moving. The cycle's
    // animations are tracked so stop()/destroy() can cancel them —
    // the bars variant uses fill:both, and an untracked mid-cycle
    // stop used to leave the bars frozen mid-extension.
    var cycleAnims = [];
    function runCycle() {
      if (!running) return;
      for (var c = 0; c < cycleAnims.length; c++) {
        try { cycleAnims[c].cancel(); } catch (e) { /* already finished */ }
      }
      cycleAnims = [];
      var dur = Math.min(1200, durationMs / 3);
      var ease = "cubic-bezier(0.65, 0, 0.35, 1)";
      var anims = [];
      if (variant === "slide") {
        anims.push(panels[0].animate([
          { transform: "translateX(-101%)" },
          { transform: "translateX(0)", offset: 0.45 },
          { transform: "translateX(0)", offset: 0.55 },
          { transform: "translateX(101%)" }
        ], { duration: dur * 2, easing: ease }));
      } else if (variant === "iris") {
        anims.push(panels[0].animate([
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(75% at 50% 50%)", offset: 0.45 },
          { clipPath: "circle(75% at 50% 50%)", offset: 0.55 },
          { clipPath: "circle(0% at 50% 50%)" }
        ], { duration: dur * 2, easing: ease }));
      } else if (variant === "curtain") {
        anims.push(panels[0].animate([
          { transform: "scaleX(0)" },
          { transform: "scaleX(1)", offset: 0.45 },
          { transform: "scaleX(1)", offset: 0.55 },
          { transform: "scaleX(0)" }
        ], { duration: dur * 2, easing: ease }));
        anims.push(panels[1].animate([
          { transform: "scaleX(0)" },
          { transform: "scaleX(1)", offset: 0.45 },
          { transform: "scaleX(1)", offset: 0.55 },
          { transform: "scaleX(0)" }
        ], { duration: dur * 2, easing: ease }));
      } else if (variant === "bars") {
        for (var i = 0; i < panels.length; i++) {
          (function (panel, idx) {
            anims.push(panel.animate([
              { transform: "scaleY(0)" },
              { transform: "scaleY(1)", offset: 0.35, easing: ease },
              { transform: "scaleY(1)", offset: 0.6 },
              { transform: "scaleY(0)", offset: 1, easing: ease }
            ], { duration: dur * 2, delay: idx * 70, easing: "linear", fill: "both" }));
          })(panels[i], i);
        }
      }
      cycleAnims = anims;
      if (anims.length && anims[0].onfinish !== undefined) {
        anims[0].onfinish = function () {
          if (running) cycleTimer = global.setTimeout(runCycle, restMs);
        };
      }
    }

    var cycleTimer = null;

    function tick() {
      if (!running) return;
      // Asymptotic creep: each frame covers a fraction of the
      // remaining distance to 0.9, so it slows down but never stalls.
      pos += (0.9 - pos) * 0.012 + 0.0006;
      if (pos > 0.92) pos = 0.92;
      paint();
      raf = global.requestAnimationFrame(tick);
    }

    /**
     * Begin trickling. Safe to call while already running. Under
     * reduced motion this is a no-op.
     */
    function start() {
      if (running || reducedMotion) return;
      running = true;
      el.classList.add("is-active");
      if (variant !== "bar") {
        // Wipe variants: cover the page once, then loop the cycle.
        runCycle();
        return;
      }
      pos = 0.02;
      paint();
      raf = global.requestAnimationFrame(tick);
      // Demo mode: finish on a timer so previews loop on their own.
      doneTimer = global.setTimeout(done, durationMs);
    }

    /**
     * Finish: sweep the segment to 100% of the path, fade the bar
     * out, then reset so the next start() begins clean. Returns
     * immediately; the sweep is a WAAPI animation.
     */
    function done() {
      if (!running || variant !== "bar") return;
      running = false;
      if (raf != null) { global.cancelAnimationFrame(raf); raf = null; }
      if (doneTimer != null) { global.clearTimeout(doneTimer); doneTimer = null; }
      var from = Math.max(pos, 0.02);
      var w = 0.14 + 0.2 * (1 - Math.min(1, from / 0.9));
      var ease = "cubic-bezier(0.2, 0, 0.2, 1)";
      // Two animations, run together: the segment's leading edge
      // races to the end while its trailing edge catches up (the bar
      // thins from behind as it drains off the right edge), then the
      // whole bar fades.
      var sweep = bar.animate([
        {
          strokeDasharray: (total * w) + " " + (total - total * w),
          strokeDashoffset: -(Math.max(0, from - w) * total),
          opacity: 1
        },
        {
          strokeDasharray: (total * (1 - Math.max(0, from - w))) + " 0",
          strokeDashoffset: 0,
          opacity: 1,
          offset: 0.7
        },
        { opacity: 0 }
      ], { duration: 500, easing: ease });
      sweep.onfinish = function () {
        pos = 0;
        bar.style.strokeDasharray = "0 " + total;
        el.classList.remove("is-active");
        // Demo mode: go again after a rest.
        restTimer = global.setTimeout(start, restMs);
      };
      fadeAnim = sweep;
    }

    function stop() {
      running = false;
      if (cycleTimer != null) { global.clearTimeout(cycleTimer); cycleTimer = null; }
      for (var c = 0; c < cycleAnims.length; c++) {
        try { cycleAnims[c].cancel(); } catch (e) { /* already finished */ }
      }
      cycleAnims = [];
      if (raf != null) { global.cancelAnimationFrame(raf); raf = null; }
      if (doneTimer != null) { global.clearTimeout(doneTimer); doneTimer = null; }
      if (restTimer != null) { global.clearTimeout(restTimer); restTimer = null; }
      if (fadeAnim) fadeAnim.cancel();
      // Only the 'bar' variant built a bar/svg — the wipe variants
      // (bars/curtain/iris/slide) have neither, just their own panels.
      if (bar) bar.style.opacity = 0;
      el.classList.remove("is-active");
    }

    function destroy() {
      stop();
      global.removeEventListener("resize", onResize);
      if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].parentNode) panels[i].parentNode.removeChild(panels[i]);
      }
      if (forcedPosition) el.style.position = "";
    }

    function isRunning() { return running; }

    // Hidden until the first start() paints it (bar variant only —
    // the wipe variants hide via their own resting transforms).
    if (variant === "bar") {
      bar.style.strokeDasharray = "0 " + total;
      bar.style.opacity = 0;
    }
    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      bar: bar,
      start: start,
      done: done,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  if (global) global.PageLoader = {
    create: create,
    wrap: create
  };
})(typeof window !== "undefined" ? window : undefined);
