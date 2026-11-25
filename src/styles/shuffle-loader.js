/*!
 * ShuffleLoader — a list that reorders itself with a FLIP glide.
 * The one-shot component animation for anything queued: a task list
 * reshuffling by priority, a race standings board, a "now playing"
 * queue, a leaderboard between rounds. Items don't jump to their new
 * spots — they glide, which is what makes a reorder read as a
 * decision rather than a glitch.
 *
 * It is a sibling style module with its own create(), container-based
 * like pulse-loader.js: the shuffle operates on the element children
 * of the container you hand it, so create() and wrap() are the same
 * call. No CSS file — FLIP is measure, mutate, invert, play, all in
 * inline styles and WAAPI.
 *
 * The technique is the FLIP pattern coined by Paul Lewis and refined
 * in davidkpiano's flipping library (both studied for this style,
 * both permissively licensed): capture each child's First rect, make
 * the reorder (Last), compute the Inverted delta, and Play it back
 * to zero with a transform animation. Nothing here is copied — the
 * reorder policy is this library's own: one deterministic mover per
 * cycle (the last child promoted to the top by default), so demo
 * loops are reproducible and the eye can follow a single element
 * through the swap instead of tracking chaos.
 *
 * Reduced motion: the reorder still happens (the list must stay
 * truthful) but items snap to their new spots with no glide.
 *
 * Usage:
 *   var shuffle = ShuffleLoader.create('.queue', { intervalMs: 2800 });
 *   shuffle.stop();
 */
(function (global) {
  "use strict";

  /**
   * Reorder the element children of `container` on a loop, gliding
   * each one from its old spot to its new one. `container` is an
   * element or a selector string; its element children are the rows.
   *
   * options:
   *   intervalMs  (default 2600) the pause between shuffles — also
   *                              the demo loop's rhythm
   *   durationMs  (default 480)  how long one glide takes
   *   moveFrom    (default "last") which child is promoted to the
   *                              top each cycle: "last", "first"
   *                              (demotes instead), or an index
   *   easing      (default "cubic-bezier(0.23, 1, 0.32, 1)") the
   *                              glide's easing — a fast-out curve,
   *                              so items leave promptly and arrive
   *                              gently
   *   autoStart   (default true)
   */
  function create(container, options) {
    options = options || {};
    if (typeof container === "string") container = global.document.querySelector(container);
    if (!container) throw new Error("ShuffleLoader.create: container not found");
    var intervalMs = Math.max(400, options.intervalMs != null ? options.intervalMs : 2600);
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 480);
    var moveFrom = options.moveFrom != null ? options.moveFrom : "last";
    var easing = options.easing || "cubic-bezier(0.23, 1, 0.32, 1)";
    var autoStart = options.autoStart !== false;

    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var timer = null;
    var anims = [];
    var running = false;

    function children() {
      var out = [];
      for (var i = 0; i < container.children.length; i++) {
        out.push(container.children[i]);
      }
      return out;
    }

    // One deterministic mover per cycle: the default promotes the
    // last child to the top, so a 4-row list cycles its bottom row
    // upward and every shuffle is the same shape — reproducible for
    // demos, followable for eyes.
    function pickMover(kids) {
      if (moveFrom === "last") return kids[kids.length - 1];
      if (moveFrom === "first") return kids[0];
      var idx = Math.max(0, Math.min(kids.length - 1, Math.round(moveFrom)));
      return kids[idx];
    }

    function shuffle() {
      var kids = children();
      if (kids.length < 2) return;
      var mover = pickMover(kids);
      if (!mover) return;

      // First
      var first = {};
      kids.forEach(function (el) {
        var r = el.getBoundingClientRect();
        first[i_key(el)] = r;
      });

      // Last — the reorder itself
      container.insertBefore(mover, container.firstChild);

      // Invert + Play: translate every child from where it was to
      // where it is, then glide the transform to zero. The mover
      // travels the farthest; the pushed-down rows each glide one
      // slot — the formation shift is the animation.
      kids.forEach(function (el, i) {
        if (reducedMotion) return;
        var r = el.getBoundingClientRect();
        var f = first[i_key(el)];
        var dx = f.left - r.left;
        var dy = f.top - r.top;
        if (!dx && !dy) return;
        anims.push(el.animate(
          [
            { transform: "translate(" + dx + "px, " + dy + "px)" },
            { transform: "translate(0px, 0px)" }
          ],
          { duration: durationMs, easing: easing }
        ));
      });
      if (!reducedMotion) running = true;
      if (anims.length) {
        var lastAnim = anims[anims.length - 1];
        lastAnim.addEventListener("finish", function () {
          anims = [];
          running = false;
        });
      } else {
        running = false;
      }
    }

    // Identity for the First map: the element itself, via a wrapper
    // object — ES5 has no Map, and elements make fine keys when the
    // lookup is a linear scan over a handful of rows.
    function i_key(el) {
      for (var k in first_) if (first_[k] === el) return k;
      var id = "k" + (first_n++);
      first_[id] = el;
      return id;
    }
    var first_ = {};
    var first_n = 0;

    function start() {
      stop();
      shuffle();
      if (children().length >= 2) {
        timer = global.setInterval(shuffle, intervalMs);
      }
    }

    function stop() {
      if (timer != null) { global.clearInterval(timer); timer = null; }
      anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* gone */ } });
      anims = [];
      running = false;
    }

    function destroy() {
      stop();
    }

    if (autoStart) start();

    return {
      container: container,
      shuffle: shuffle,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return running || timer != null; }
    };
  }

  global.ShuffleLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
