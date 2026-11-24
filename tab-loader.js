/*!
 * TabLoader — the tab-switch underline, as a path primitive: a glowing
 * segment that crawls along a rail from the old tab to the new one,
 * stretching mid-flight and settling into place. Sibling style module
 * with its own create(), container-based like ripple/typing/tether.
 * Needs only orbit-loader.css; does NOT require orbit-loader.js.
 *
 * What makes it different from the CSS "width-morph" underline every
 * UI kit ships: the indicator TRAVELS — its leading edge runs ahead of
 * its trailing edge, so it visibly crawls and stretches like the rest
 * of this library — and because it rides a path, it works on curved
 * tab rails too (hand it any `d` and it follows the curve).
 *
 * This is a ONE-SHOT, triggered style: nothing loops on its own. You
 * call play(from, to) when the user switches tabs; call start() to run
 * the built-in demo loop (switching tabs forever) for previews.
 *
 * Usage:
 *   var tab = TabLoader.create(document.querySelector('.tabs'), {
 *     tabs: 4, color: '#d97757'
 *   });
 *   tab.play(0, 0.5);        // crawl the underline to the middle tab
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Build the tab rail inside `el` (an element or a selector string).
   *
   * options:
   *   tabs        (default 4)     how many tabs the demo loop cycles
   *                               through (purely informational to the
   *                               primitive itself)
   *   labels      (default null)  array of tab label strings — renders
   *                               a clickable label row above the rail
   *                               and overrides `tabs`
   *   segmentFraction (default 0.16) the underline's length as a
   *                               fraction of the rail
   *   durationMs  (default 700)   one crawl between tabs
   *   restMs      (default 1500)  the demo loop's pause on a tab
   *   stretch     (default 1.5)   how much the segment stretches
   *                               mid-crawl (1 = rigid slide)
   *   strokeWidth (default 3)     underline thickness, in the SVG's
   *                               coordinate space
   *   color       (default null)  underline color; omit for currentColor
   *   d           (default null)  optional path `d` string — give the
   *                               rail a curve and the crawl follows it
   *   autoStart   (default true)  run the demo loop immediately
   *
   * Reduced motion is checked once at creation, like every style: if
   * set, play() and the demo loop do nothing.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("TabLoader.create: container not found");
    var tabs = Math.max(1, options.tabs != null ? options.tabs : 4);
    var segFrac = options.segmentFraction != null ? options.segmentFraction : 0.16;
    var durationMs = options.durationMs != null ? options.durationMs : 700;
    var restMs = options.restMs != null ? options.restMs : 1500;
    var stretch = options.stretch != null ? options.stretch : 1.5;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 3;
    var color = options.color != null ? options.color : null;
    var labels = options.labels || null;
    var autoStart = options.autoStart !== false;

    // Optional tab labels: a row of evenly spaced spans above the rail.
    // Each is clickable and crawls the underline to that tab — the
    // demo IS the interaction. Labels inherit currentColor.
    if (labels && labels.length) {
      tabs = labels.length;
      var row = document.createElement("div");
      row.className = "orbit-loader-tab-labels";
      for (var li = 0; li < labels.length; li++) {
        (function (idx, text) {
          var span = document.createElement("span");
          span.className = "orbit-loader-tab-label";
          span.textContent = text;
          span.addEventListener("click", function () {
            var center = (idx + 0.5) / tabs - segFrac / 2;
            play(current, center);
          });
          row.appendChild(span);
        })(li, labels[li]);
      }
      el.appendChild(row);
    }

    // A short strip: the rail is a hairline meant to sit under real
    // tab labels. The viewBox is built in REAL PIXELS (re-measured on
    // resize) — 1 unit = 1px — because with a stretched viewBox and
    // non-scaling-stroke, browsers compute dash patterns in screen
    // space and the segment would shatter into repeating dashes.
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-path orbit-loader-tab");
    svg.setAttribute("aria-hidden", "true");
    // The base .orbit-loader-path rule is position:absolute (for
    // overlays); this rail must sit in flow BELOW the labels.
    svg.style.position = "relative";
    svg.style.top = "auto";
    svg.style.left = "auto";

    var customD = options.d || null;

    // The rail: a faint full-width line the consumer can keep visible
    // as the tab bar's track, plus the bright moving segment drawn on
    // the same line via dasharray — the same trick as the core, but
    // driven by one-shot animations instead of a loop.
    var rail = document.createElementNS(SVG_NS, "path");
    rail.setAttribute("class", "orbit-loader-tab-rail");
    rail.style.strokeWidth = 1;
    if (color != null) rail.style.stroke = color;
    svg.appendChild(rail);

    var seg = document.createElementNS(SVG_NS, "path");
    seg.setAttribute("class", "orbit-loader-tab-seg");
    seg.style.strokeWidth = strokeWidth;
    if (color != null) seg.style.stroke = color;
    svg.appendChild(seg);
    el.appendChild(svg);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Total path length for dasharray math — the rail's pixel width
    // for the default straight rail; a custom curved `d` measures
    // whatever it is (in its own 100-unit space).
    var total = 100;

    function measure() {
      if (customD) {
        rail.setAttribute("d", customD);
        seg.setAttribute("d", customD);
        svg.setAttribute("viewBox", "0 0 100 10");
        svg.setAttribute("preserveAspectRatio", "none");
        total = seg.getTotalLength ? seg.getTotalLength() : 100;
        return;
      }
      var w = Math.max(1, el.clientWidth || 300);
      svg.setAttribute("viewBox", "0 0 " + w + " 10");
      svg.removeAttribute("preserveAspectRatio");
      var d = "M0,5 L" + w + ",5";
      rail.setAttribute("d", d);
      seg.setAttribute("d", d);
      total = w;
    }
    measure();
    var onResize = function () { measure(); paint(current); };
    global.addEventListener("resize", onResize);

    // Where the segment currently rests, as a fraction of the rail.
    var current = 0;
    var running = false;   // demo loop flag
    var timer = null;
    var active = null;     // the in-flight Animation, if any

    // Paint the segment resting at fraction `f`. The dash pattern is
    // [segLen, gap] and offset -start shifts it so the segment spans
    // [start, start + segLen] along the path.
    function paint(f) {
      var segLen = total * segFrac;
      seg.style.strokeDasharray = segLen + " " + (total - segLen);
      seg.style.strokeDashoffset = -(f * total);
    }

    /**
     * Crawl the underline from fraction `from` to fraction `to` of the
     * rail. Returns the Animation (or null under reduced motion).
     * The segment stretches to `stretch`× its length at the midpoint
     * and settles back — the leading edge visibly runs ahead, which is
     * the whole point of this style.
     */
    function play(from, to) {
      // Interactive callers (React Tabs, consumer code) reveal the
      // segment here, not just via the demo loop's is-active.
      el.classList.add("is-active");
      if (reducedMotion) {
        current = to;
        paint(to);
        return null;
      }
      if (active) active.cancel();
      current = to;
      var segLen = total * segFrac;
      var midLen = Math.min(total * 0.9, segLen * stretch);
      var ease = "cubic-bezier(0.65, 0, 0.35, 1)";
      active = seg.animate([
        {
          strokeDasharray: segLen + " " + (total - segLen),
          strokeDashoffset: -(from * total)
        },
        {
          strokeDasharray: midLen + " " + (total - midLen),
          strokeDashoffset: -((from + (to - from) / 2) * total - (midLen - segLen) / 2),
          offset: 0.5
        },
        {
          strokeDasharray: segLen + " " + (total - segLen),
          strokeDashoffset: -(to * total)
        }
      ], { duration: durationMs, easing: ease });
      active.onfinish = function () {
        active = null;
        paint(to);
      };
      return active;
    }

    /** Jump (no animation) to a fraction — for initial positioning. */
    function set(f) {
      el.classList.add("is-active");
      current = f;
      paint(f);
    }

    function demoStep() {
      // Which tab the segment currently sits under (its center), then
      // crawl to the next one, wrapping around.
      var idx = Math.min(tabs - 1, Math.max(0, Math.round((current + segFrac / 2) * tabs - 0.5)));
      var next = (idx + 1) % tabs;
      var center = (next + 0.5) / tabs - segFrac / 2;
      play(current, center);
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      el.classList.add("is-active");
      timer = global.setInterval(demoStep, durationMs + restMs);
    }

    function stop() {
      running = false;
      if (timer != null) { global.clearInterval(timer); timer = null; }
      el.classList.remove("is-active");
    }

    function destroy() {
      stop();
      global.removeEventListener("resize", onResize);
      if (active) active.cancel();
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    function isRunning() { return running; }

    paint(0);
    if (autoStart) start();

    return {
      el: el,
      svg: svg,
      segment: seg,
      play: play,
      set: set,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.TabLoader = {
    create: create,
    wrap: create
  };
})(window);
