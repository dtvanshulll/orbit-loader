/*!
 * CountUpLoader — a number that counts itself up to its value. The
 * one-shot component animation for anything numeric that lands on
 * screen: stat cards, dashboards, donation totals, "users joined"
 * badges. The number arriving at full value the instant the card
 * renders reads as data; the same number counting up to it reads as
 * something that just happened.
 *
 * It is a sibling style module with its own create(), like
 * pulse-loader.js — container-based: create() and wrap() are the same
 * call and both take the element whose text the counter owns. No CSS
 * file — the counter only ever writes text, so there is nothing to
 * inject and nothing to load.
 *
 * Technique borrowed from studying countup.js (MIT): a rAF loop with
 * an easing function on the progress, the value clamped so a long
 * frame can't shoot past the target, decimals fixed before printing,
 * and thousands separators applied at print time. The easing catalog
 * is the small set that reads well on numbers — expo's fast-start
 * long-tail is the default, because that "decelerating into the
 * final digits" is what makes a counter feel earned.
 *
 * Reduced motion: the count is skipped entirely and the final value
 * is set once — a number that never moves is the accessible version
 * of this animation.
 *
 * Usage:
 *   var counter = CountUpLoader.create('.stat-value', { to: 12480 });
 *   counter.stop();
 */
(function (global) {
  "use strict";

  /**
   * Count `el`'s text up from `from` to `to`. `el` is an element or a
   * selector string; its existing text is replaced while running and
   * restored to the final value on destroy.
   *
   * options:
   *   from        (default 0)     the value the count starts at
   *   value       (default 100)   the value it lands on — named
                                  `value`, not `to`: the playground
                                  scene renderer treats a `to`
                                  option as its static-fill signal
                                  and would never start the count
   *   durationMs  (default 2000)  how long the count takes
   *   easing      (default "easeOutExpo") "linear" | "easeOutCubic" |
   *               "easeOutExpo" | "easeOutBack" | "easeOutBounce" |
   *               "easeOutElastic". Back overshoots past
   *               the target and settles — playful, use for small
   *               numbers; expo decelerates into the final digits
   *   decimals    (default 0)     digits after the decimal point
   *   separator   (default ",")   thousands separator; null for none
   *   prefix      (default "")    e.g. "$"
   *   suffix      (default "")    e.g. "%" or " ms"
   *   restMs      (default 0)     0 runs once; > 0 repeats the count
   *                               after this pause (demo loops)
   *   autoStart   (default true)
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = global.document.querySelector(el);
    if (!el) throw new Error("CountUpLoader.create: element not found");
    var from = options.from != null ? options.from : 0;
    var to = options.value != null ? options.value : 100;
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 2000);
    var easingName = options.easing || "easeOutExpo";
    var decimals = Math.max(0, Math.round(options.decimals != null ? options.decimals : 0));
    var separator = options.separator !== undefined ? options.separator : ",";
    var prefix = options.prefix != null ? options.prefix : "";
    var suffix = options.suffix != null ? options.suffix : "";
    var restMs = Math.max(0, options.restMs != null ? options.restMs : 0);
    var autoStart = options.autoStart !== false;

    // The easing set that reads well on numbers, straight from the
    // shifty/countup school: fast start, long decelerating tail.
    var easings = {
      linear: function (t) { return t; },
      easeOutCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
      easeOutExpo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
      // The Penner bounce and elastic, as canonicalized in
      // tween.js and shifty: the count lands, bounces, settles.
      easeOutBounce: function (t) {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      },
      easeOutElastic: function (t) {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
      },
      easeOutBack: function (t) {
        var c1 = 1.70158, c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      }
    };
    var ease = easings[easingName] || easings.easeOutExpo;

    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var rafId = null;
    var repeatTimer = null;
    var running = false;

    // Print-time formatting: fixed decimals first, then grouping only
    // the integer part — separators inside the decimals would be wrong.
    function print(value) {
      var fixed = value.toFixed(decimals);
      var parts = fixed.split(".");
      if (separator) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      }
      el.textContent = prefix + parts.join(".") + suffix;
    }

    function frame(now, startTime) {
      var progress = Math.min(1, (now - startTime) / durationMs);
      // easeOutBack intentionally overshoots mid-flight — that is its
      // charm — so only clamp against runaway, not against crossing.
      var value = from + (to - from) * ease(progress);
      // Only the monotonic three need the runaway clamp; back,
      // bounce and elastic overshoot or fall back on purpose.
      if (easingName === "linear" || easingName === "easeOutCubic" || easingName === "easeOutExpo") {
        value = Math.min(value, Math.max(from, to));
        value = Math.max(value, Math.min(from, to));
      }
      print(value);
      if (progress < 1) {
        rafId = global.requestAnimationFrame(function (next) { frame(next, startTime); });
      } else {
        rafId = null;
        running = false;
        if (restMs > 0) {
          repeatTimer = global.setTimeout(function () { start(); }, restMs);
        }
      }
    }

    function start() {
      if (reducedMotion) {
        print(to);
        return;
      }
      stop();
      running = true;
      var startTime = global.performance.now();
      rafId = global.requestAnimationFrame(function (now) { frame(now, startTime); });
    }

    function stop() {
      if (rafId != null) { global.cancelAnimationFrame(rafId); rafId = null; }
      if (repeatTimer != null) { global.clearTimeout(repeatTimer); repeatTimer = null; }
      running = false;
    }

    function destroy() {
      stop();
      print(to);
    }

    if (autoStart) start();

    return {
      el: el,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return running; },
      value: function () { return to; }
    };
  }

  if (global) global.CountUpLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : undefined);
