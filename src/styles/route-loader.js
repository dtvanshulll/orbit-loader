/*!
 * RouteLoader — the route/page transition: new content arrives while
 * the old content leaves, driven by your code, not a demo loop. The
 * one-shot behind routers, wizards, settings panes and any "this view
 * was replaced by that view" moment.
 *
 *   <div class="view" style="min-height:200px">…current page…</div>
 *   var route = RouteLoader.wrap('.view', { variant: 'wipe' });
 *   route.to('<h2>Page two</h2>…');          // HTML string
 *   route.to(document.querySelector('#next')); // or an element
 *   route.to(1);                              // or an items index
 *
 * It is a sibling style module with its own create(), container-based
 * like swap-loader.js — but it is NOT SwapLoader again: SwapLoader
 * trades between panels that already exist in the DOM (log-in/sign-up
 * flips). RouteLoader owns the content lifecycle — it mounts the page
 * you hand it, animates the old one out, and unmounts it — which is
 * what a route change needs and a panel swap must never do.
 *
 * Variants:
 *   fade  — the old page fades away as the new one fades in
 *   slide — the old page slides out toward `direction`, the new one
 *           enters from the opposite side (paging forward/back)
 *   wipe  — a cover panel sweeps across the container; the content
 *           swaps underneath at the moment of full cover, then the
 *           panel keeps travelling and departs. The swap is chained
 *           to the cover animation's own finish event, so it can
 *           never fire early or late.
 *
 * Layout: the arriving page sits in normal flow, so it defines the
 * container's height even when the pages differ; the leaving page is
 * pinned as an absolute overlay while it animates. The container is
 * made position:relative (if static) and overflow:hidden — a page
 * transition is a closed world; override overflow in your own CSS if
 * you need popovers to escape it.
 *
 * options:
 *   variant     (default 'fade')   'fade' | 'slide' | 'wipe'
 *   direction   (default 'left')   which way the content travels:
 *                                  'left' | 'right' | 'up' | 'down'.
 *                                  For slide, the old page exits this
 *                                  way and the new one enters from the
 *                                  opposite side; for wipe, the panel
 *                                  travels this way. Per-call override:
 *                                  to(x, { direction: 'right' }) is the
 *                                  reversal.
 *   exitMs      (default 170)      the leaving page's fade/slide —
 *                                  exits accelerate, entrances
 *                                  decelerate (the swap-loader rule)
 *   durationMs  (default 300)      the arriving page's fade/slide; for
 *                                  wipe, the time to COVER — the full
 *                                  crossing is twice that
 *   distance    (default 8)        slide travel, % of the container
 *   wipeColor   (default null)     the cover panel's color; omit for
 *                                  var(--tl-card)
 *   items       (default null)     HTML strings for the demo loop —
 *                                  to(i) then indexes this list
 *   restMs      (default 2400)     the demo loop's pause on each page
 *   onDone      (default null)     callback after each transition
 *                                  lands; per-call opts.onDone wins
 *   autoStart   (default true)     run the demo loop when items exist
 *
 * A second to() while one is in flight cancels the first cleanly:
 * animations cancel, the half-dead old page is removed, the settled
 * page stays, and the new transition runs from there — the newer call
 * always wins, never a torn half-state.
 *
 * Reduced motion is checked once at creation: if set, every to() is an
 * instant content swap — the page still changes, nothing moves.
 */
(function (global) {
  "use strict";

  var VARIANTS = { fade: 1, slide: 1, wipe: 1 };
  var DIRECTIONS = { left: 1, right: 1, up: 1, down: 1 };
  /* Slide vectors, per direction: [exitX, exitY, enterX, enterY] in %. */
  var VECTORS = {
    left:  [-1, 0,  1, 0],
    right: [ 1, 0, -1, 0],
    up:    [ 0, -1, 0,  1],
    down:  [ 0,  1, 0, -1]
  };
  var EXIT_EASING = "cubic-bezier(0.3, 0, 1, 1)";
  var ENTER_EASING = "cubic-bezier(0.23, 1, 0.32, 1)";
  var WIPE_EASING = "cubic-bezier(0.4, 0, 0.6, 1)";

  /**
   * Own the content of `el` (an element or a selector string).
   * `create()` and `wrap()` are the same call — there is no path to
   * trace, the container IS the stage.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = global.document.querySelector(el);
    if (!el) throw new Error("RouteLoader.create: container not found");

    var variant = VARIANTS[options.variant] ? options.variant : "fade";
    var direction = DIRECTIONS[options.direction] ? options.direction : "left";
    var exitMs = Math.max(1, options.exitMs != null ? options.exitMs : 170);
    var durationMs = Math.max(1, options.durationMs != null ? options.durationMs : 300);
    var distance = options.distance != null ? options.distance : 8;
    var wipeColor = options.wipeColor != null ? options.wipeColor : null;
    var items = options.items && options.items.length ? options.items : null;
    var restMs = Math.max(0, options.restMs != null ? options.restMs : 2400);
    var baseDone = typeof options.onDone === "function" ? options.onDone : null;
    var autoStart = options.autoStart !== false;

    var forcedPosition = false;
    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
      forcedPosition = true;
    }
    el.classList.add("orbit-loader-route");

    // Checked once at creation, like every style.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var canAnimate = !reducedMotion && typeof el.animate === "function";

    var current = null;    // the settled page element (null = untouched content)
    var outgoing = null;   // the page being animated out right now
    var anims = [];        // in-flight Animation objects
    var wipePanel = null;
    var loopTimer = null;
    var index = -1;        // last items index shown; -1 = custom content
    var busy = false;

    /** Wrap `content` (HTML string | Element | items index) in a page. */
    function pageFrom(content) {
      if (typeof content === "number") {
        if (!items) throw new Error("RouteLoader.to: an index needs an items array");
        var i = ((content % items.length) + items.length) % items.length;
        index = i;
        content = items[i];
      }
      if (content && content.nodeType === 1) return content; // adopted as-is
      if (typeof content === "string" && content) {
        // A <template> parses the string so partial documents (<td>,
        // <li> fragments) survive; the wrapper keeps multi-root HTML
        // animatable as one unit.
        var t = global.document.createElement("template");
        t.innerHTML = content;
        var page = global.document.createElement("div");
        while (t.content.firstChild) page.appendChild(t.content.firstChild);
        // Whitespace or otherwise empty strings parse to a bare text
        // node — nothing to show, nothing to animate: reject them.
        if (!page.firstChild || (!page.querySelector("*") && !page.textContent.trim())) {
          throw new Error("RouteLoader.to: the HTML string produced no content");
        }
        return page;
      }
      throw new Error("RouteLoader.to: content must be an element, an HTML string, or an items index");
    }

    /**
     * Claim the container's untouched children as the first page: they
     * move (in place, same visual result) into one wrapper so the exit
     * animation has a single element to grab. Only happens once, and
     * only if the caller didn't hand us a page first.
     */
    function captureCurrent() {
      if (current) return;
      var kids = [];
      for (var n = 0; n < el.childNodes.length; n++) {
        if (el.childNodes[n].nodeType === 1) kids.push(el.childNodes[n]);
      }
      if (!kids.length) return;
      var wrapEl = global.document.createElement("div");
      wrapEl.className = "orbit-loader-route-page";
      el.insertBefore(wrapEl, el.firstChild);
      for (var k = 0; k < kids.length; k++) wrapEl.appendChild(kids[k]);
      current = wrapEl;
    }

    function mount(page) {
      page.classList.add("orbit-loader-route-page");
      el.appendChild(page);
      return page;
    }

    /** Pin the leaving page over the container so it stops sizing it. */
    function pinOut(page) {
      page.classList.add("orbit-loader-route-out");
    }

    /** Cancel everything in flight; `keep` (the settled page) survives. */
    function settle(keep) {
      for (var i = 0; i < anims.length; i++) anims[i].cancel();
      anims = [];
      if (wipePanel && wipePanel.parentNode) {
        wipePanel.parentNode.removeChild(wipePanel);
      }
      wipePanel = null;
      if (outgoing && outgoing.parentNode) {
        outgoing.parentNode.removeChild(outgoing);
      }
      outgoing = null;
      busy = false;
      current = keep || null;
    }

    function finish(page, done) {
      settle(page);
      if (done) done(page);
    }

    /** Fade/slide: old page leaves while the new one arrives. */
    function crossFade(page, prev, dir, done) {
      var v = VECTORS[dir];
      var isSlide = variant === "slide";
      var d = distance;
      var exitKf, enterKf;
      if (isSlide) {
        exitKf = [
          { opacity: 1, transform: "translate(0, 0)" },
          { opacity: 0, transform: "translate(" + (v[0] * d) + "%, " + (v[1] * d) + "%)" }
        ];
        enterKf = [
          { opacity: 0, transform: "translate(" + (v[2] * d) + "%, " + (v[3] * d) + "%)" },
          { opacity: 1, transform: "translate(0, 0)" }
        ];
      } else {
        exitKf = [{ opacity: 1 }, { opacity: 0 }];
        enterKf = [{ opacity: 0 }, { opacity: 1 }];
      }
      if (prev) {
        pinOut(prev);
        outgoing = prev;
        anims.push(prev.animate(exitKf, {
          duration: exitMs, easing: EXIT_EASING, fill: "forwards"
        }));
      }
      var enterAnim = page.animate(enterKf, {
        duration: durationMs, easing: ENTER_EASING
      });
      anims.push(enterAnim);
      // No fill:forwards on the arrival — its natural state IS the end
      // state, so a cancelled transition snaps to a clean, visible page.
      enterAnim.addEventListener("finish", function () {
        finish(page, done);
      });
    }

    /** Wipe: cover panel crosses; content swaps on the cover beat. */
    function crossWipe(page, prev, dir, done) {
      var horizontal = dir === "left" || dir === "right";
      var sign = (dir === "left" || dir === "up") ? 1 : -1;
      var axis = horizontal ? "translateX" : "translateY";
      var coverFrom = axis + "(" + (sign * 100) + "%)";
      var coverTo = axis + "(0%)";
      var leaveTo = axis + "(" + (-sign * 100) + "%)";

      wipePanel = global.document.createElement("div");
      wipePanel.className = "orbit-loader-route-wipe";
      if (wipeColor) wipePanel.style.background = wipeColor;
      el.appendChild(wipePanel);

      var coverAnim = wipePanel.animate(
        [{ transform: coverFrom }, { transform: coverTo }],
        { duration: durationMs, easing: WIPE_EASING }
      );
      anims.push(coverAnim);
      coverAnim.addEventListener("finish", function () {
        // Full cover: swap underneath. The panel hides the instant the
        // content changes, so the swap itself is never visible. The page
        // mounts here rather than at the start so the container's height
        // changes while the panel is opaque over it — the reflow is
        // never seen.
        if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
        outgoing = null;
        mount(page);
        current = page;
        var leaveAnim = wipePanel.animate(
          [{ transform: coverTo }, { transform: leaveTo }],
          { duration: durationMs, easing: WIPE_EASING }
        );
        anims = [leaveAnim];
        leaveAnim.addEventListener("finish", function () {
          finish(page, done);
        });
      });
    }

    /**
     * Transition to `content`. A number indexes `items`; a string is
     * parsed as HTML; an element is adopted (moved from its previous
     * parent). Per-call opts: direction, variant, onDone.
     */
    function to(content, opts) {
      opts = opts || {};
      var done = typeof opts.onDone === "function" ? opts.onDone : baseDone;
      captureCurrent();
      var page = pageFrom(content);
      var dir = DIRECTIONS[opts.direction] ? opts.direction : direction;
      var useVariant = VARIANTS[opts.variant] ? opts.variant : variant;

      // A newer call always wins: snap whatever is mid-flight.
      settle(current);
      if (current === page) return; // already showing
      var prev = current;

      if (!canAnimate) {
        if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
        mount(page);
        current = page;
        if (done) done(page);
        return;
      }

      busy = true;
      if (useVariant === "wipe") {
        // The page mounts at the cover beat (see crossWipe), so the
        // settled slot stays with the old page until then — a cancel
        // before cover must leave the old page showing.
        crossWipe(page, prev, dir, done);
      } else {
        // Fade/slide mount immediately: the arriving page owns the
        // settled slot from now on, so a mid-flight cancel keeps IT
        // and drops the old one — never an orphaned half-state.
        mount(page);
        current = page;
        crossFade(page, prev, dir, done);
      }
    }

    /** Demo loop: advance to the next items page after each rest. */
    function next() {
      if (!items) return;
      to(index + 1);
    }
    function start() {
      if (loopTimer != null || !items || items.length < 2) return;
      loopTimer = global.setInterval(next, restMs + exitMs + durationMs * 2);
    }
    function stop() {
      if (loopTimer != null) { global.clearInterval(loopTimer); loopTimer = null; }
    }

    function destroy() {
      stop();
      settle(current);
      var pages = el.querySelectorAll(".orbit-loader-route-page");
      for (var k = 0; k < pages.length; k++) {
        pages[k].classList.remove("orbit-loader-route-page", "orbit-loader-route-out");
      }
      el.classList.remove("orbit-loader-route");
      if (forcedPosition) el.style.position = "";
      current = null;
    }

    // An empty container with items starts on items[0] — a demo card
    // (or a router booting into its first view) is never blank.
    captureCurrent();
    if (!current && items) {
      current = mount(pageFrom(0));
    }
    if (items && autoStart) start();

    return {
      el: el,
      to: to,
      next: next,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return busy; },
      index: function () { return index; }
    };
  }

  global.RouteLoader = { create: create, wrap: create };
})(typeof window !== "undefined" ? window : this);
