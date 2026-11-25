/*!
 * ShakeLoader — an attention shake: the element judders in place and
 * settles. The one-shot "this needs your eyes" transition — an
 * invalid field, a rejected card, a row that can't be deleted — the
 * same family as csshake (MIT), which was studied for this style.
 *
 * It is a sibling style module with its own create(), container-based
 * like pulse-loader.js: the shake transforms the element you hand it,
 * so create() and wrap() are the same call. No CSS file — every
 * keyframe is generated here, so there is nothing to inject.
 *
 * Where csshake shakes at constant amplitude until the class is
 * removed, this style is a damped shake by default: the amplitude
 * decays across the one shot, the way a struck tuning fork settles.
 * A shake that rings at full strength and then just stops reads as a
 * glitch; one that decays into stillness reads as the element
 * physically resisting and giving up — which is what "no" should
 * feel like. `decay: 0` restores the constant csshake behaviour.
 *
 * The judder is translate + a little rotation, mixed — pure
 * translateX reads as sliding, the tiny rotation is what makes it
 * read as shaking. Steps are deterministic (alternating signs, no
 * randomness) so every playback is identical.
 *
 * Reduced motion: no shake at all — the element simply stays put.
 *
 * Usage:
 *   var shake = ShakeLoader.create('.field', { variant: "little" });
 *   shake.stop();
 */
(function (global) {
  "use strict";

  /**
   * Shake `el` in place. `el` is an element or a selector string.
   *
   * options:
   *   variant     (default "default") "little" (~1.5px, polite nudge),
   *               "default" (~3px, a clear no), "hard" (~5px, alarm)
   *   durationMs  (default 600)     the whole decayed shake
   *   decay       (default 1)       how much the amplitude dies away
   *               across the shot: 1 settles to a quarter strength,
   *               0.5 half, 0 constant amplitude like csshake
   *   restMs      (default 0)       0 shakes once; > 0 repeats after
   *                               this pause (demo loops)
   *   autoStart   (default true)
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = global.document.querySelector(el);
    if (!el) throw new Error("ShakeLoader.create: element not found");
    var variants = { little: 1.5, "default": 3, hard: 5 };
    var amp = variants[options.variant] != null ? variants[options.variant] : variants["default"];
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 600);
    var decay = options.decay != null ? Math.max(0, Math.min(1, options.decay)) : 1;
    var restMs = Math.max(0, options.restMs != null ? options.restMs : 0);
    var autoStart = options.autoStart !== false;

    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var animation = null;
    var repeatTimer = null;
    var running = false;

    // One keyframe every ~8% of the shot: direction alternates, the
    // vertical component is a fraction of the horizontal (shakes are
    // mostly side-to-side), rotation is proportional to the
    // horizontal so the two read as one motion. Damping shrinks the
    // amplitude as t grows when decay > 0.
    function buildKeyframes() {
      var steps = 12;
      var keyframes = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var damp = decay > 0 ? 1 - decay * 0.75 * t : 1;
        var sign = i % 2 === 0 ? 1 : -1;
        var x = (i === steps ? 0 : sign * amp * damp);
        var y = (i % 4 < 2 ? 0.45 : -0.35) * amp * damp * (i === steps ? 0 : 1);
        var rot = (x / amp) * (amp / 3);
        keyframes.push({
          transform: "translate(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px) rotate(" + rot.toFixed(2) + "deg)",
          offset: t
        });
      }
      return keyframes;
    }

    function start() {
      if (reducedMotion) return;
      stop();
      running = true;
      animation = el.animate(buildKeyframes(), {
        duration: durationMs,
        easing: "ease-in-out"
      });
      animation.addEventListener("finish", function () {
        animation = null;
        running = false;
        if (restMs > 0) {
          repeatTimer = global.setTimeout(function () { start(); }, restMs);
        }
      });
    }

    function stop() {
      if (animation) { animation.cancel(); animation = null; }
      if (repeatTimer != null) { global.clearTimeout(repeatTimer); repeatTimer = null; }
      el.style.transform = "";
      running = false;
    }

    function destroy() {
      stop();
    }

    if (autoStart) start();

    return {
      el: el,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return running; }
    };
  }

  global.ShakeLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
