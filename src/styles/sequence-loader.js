/*!
 * SequenceLoader — the choreography API: a timeline of one-shot
 * style calls. Sibling module with its own create(), like every
 * style — but it has no visuals of its own: it schedules. Each step
 * is a plain function (usually a call into a controller you already
 * built: page.play(), search.open(), button.begin()), timed either
 * absolutely (`at`, milliseconds from play()) or relatively
 * (`after`, milliseconds after the previous step).
 *
 * Why a function per step instead of { style, method } descriptors:
 * the sequence would otherwise need to know every style's method
 * names — a coupling the library avoids everywhere else. A step is
 * just "call this at this time"; the caller owns the controllers.
 *
 * The timeline is wall-clock (setTimeout chain, each step scheduled
 * when the previous one fires), so stop() is exact and a throttled
 * tab can't skip steps — timers may fire late, never out of order.
 * Under reduced motion the timeline still runs: it is scheduling,
 * not motion, and every style collapses itself to its final state
 * on its own.
 *
 * Usage:
 *   var seq = SequenceLoader.create([
 *     { at: 0,    do: function () { wipe.show(); } },
 *     { after: 350, do: function () { search.open(); } },
 *     { after: 500, do: function () { countup.start(); } }
 *   ], { onDone: function () {} });
 *   seq.play();
 */
(function (global) {
  "use strict";

  /**
   * Build a sequence from `steps`.
   *
   * step:
   *   at        (one of at/after)  ms from play()
   *   after     (one of at/after)  ms after the previous step (the
   *                                first step's `after` runs from 0)
   *   do        (required)         the function to call
   *
   * options:
   *   loop        (default false)  replay the whole timeline after
   *                                loopRestMs once it finishes
   *   loopRestMs  (default 800)    the pause between loop replays
   *   onDone      (default null)   called when the timeline finishes
   *                                (not fired on stop(); fired on
   *                                every loop completion)
   *   autoPlay    (default false)  play() at creation
   */
  function create(steps, options) {
    options = options || {};
    if (!steps || !steps.length || typeof steps.length !== "number") {
      throw new Error("SequenceLoader.create: steps must be a non-empty array");
    }

    // Normalize to absolute times, preserving call order for steps
    // that land on the same instant (Array.prototype.sort is not
    // stable in every engine we support, so the index breaks ties).
    var prev = 0;
    var timeline = [];
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i] || {};
      if (typeof s.do !== "function") {
        throw new Error("SequenceLoader.create: step " + i + " needs a do function");
      }
      var hasAt = s.at != null, hasAfter = s.after != null;
      if (hasAt && hasAfter) {
        throw new Error("SequenceLoader.create: step " + i + " takes at OR after, not both");
      }
      var t;
      if (hasAt) {
        t = Math.max(0, s.at);
        prev = t;
      } else if (hasAfter) {
        t = Math.max(0, prev + Math.max(0, s.after));
        prev = t;
      } else {
        throw new Error("SequenceLoader.create: step " + i + " needs at or after");
      }
      timeline.push({ t: t, do: s.do, i: i });
    }
    timeline.sort(function (a, b) { return a.t - b.t || a.i - b.i; });

    var loop = options.loop === true;
    var loopRestMs = Math.max(0, options.loopRestMs != null ? options.loopRestMs : 800);
    var onDone = typeof options.onDone === "function" ? options.onDone : null;
    var autoPlay = options.autoPlay === true;

    var total = timeline[timeline.length - 1].t;
    var timer = null;
    var cursor = 0;       // next step to fire
    var running = false;
    var fired = [];       // steps fired in the current run (for debug/inspect)

    // Schedule the next step when the current one fires — not all up
    // front — so a stop() between steps cancels exactly one timer and
    // a throttled tab delays the tail instead of reordering it. The
    // wait for step `cursor` is its absolute time minus the previous
    // step's (the first step waits from play()).
    function scheduleNext() {
      if (!running || cursor >= timeline.length) return;
      var step = timeline[cursor];
      var prevT = cursor > 0 ? timeline[cursor - 1].t : 0;
      timer = global.setTimeout(function () { fire(step); },
        Math.max(0, step.t - prevT));
    }

    function fire(step) {
      if (!running) return;
      timer = null;
      fired.push(step.i);
      step.do();
      cursor++;
      if (cursor >= timeline.length) {
        // The timeline is done. Loop replays after the rest; a plain
        // run reports done and stops.
        if (loop) {
          timer = global.setTimeout(function () {
            timer = null;
            if (!running) return;
            cursor = 0;
            fired = [];
            scheduleNext();
          }, loopRestMs);
        } else {
          running = false;
          if (onDone) onDone();
        }
        return;
      }
      scheduleNext();
    }

    /** Run the timeline from its first step. A running sequence
     *  restarts. */
    function play() {
      stop();
      running = true;
      cursor = 0;
      fired = [];
      scheduleNext();
    }

    /** Stop the timeline. Steps already fired stay fired (their
     *  effects are the callers' to undo); pending steps never run. */
    function stop() {
      running = false;
      if (timer != null) { global.clearTimeout(timer); timer = null; }
    }

    function destroy() {
      stop();
      fired = [];
    }

    function isRunning() { return running; }

    /** The timeline's total length in ms — the last step's time. */
    function duration() { return total; }

    /** Indices of the steps fired in the current (or last) run. */
    function firedSteps() { return fired.slice(); }

    if (autoPlay) play();

    return {
      play: play,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning,
      duration: duration,
      firedSteps: firedSteps
    };
  }

  global.SequenceLoader = {
    create: create,
    wrap: create
  };
})(window);
