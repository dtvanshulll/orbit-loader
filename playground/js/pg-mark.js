/*!
 * pg-mark — the header brand mark, hero instrument, reveal-on-scroll. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var cardsEl = PG.cardsEl;
  // The little orbiting logo in the header — the library demoing itself.
  var MARK_LOOP = "M 25 26 C 13 28 5 22 6 14 C 7 8 13 5 18 7 C 23 9 24 15 20 18 C 16 21 10 19 11 14 C 12 10 17 10 18 13";
  function startMark() {
    var mark = document.getElementById("pg-mark");
    if (!mark || !window.OrbitLoader || !OrbitLoader.shapes) return;
    OrbitLoader.wrap(mark, {
      d: MARK_LOOP,
      viewBox: "0 0 32 32",
      durationMs: 1800,
      strokeWidth: 3,
      guideOpacity: 0.3
    });
    // One dot on the same path and clock: the pen tip drawing the loop.
    if (window.DotLoader) {
      DotLoader.wrap(mark, {
        d: MARK_LOOP,
        viewBox: "0 0 32 32",
        durationMs: 1800,
        dots: 1,
        dotRadius: 2.2
      });
    }
  }

  // The hero instrument: a large ring crawler with a dot train orbiting
  // inside it — the hero's one bright moment, the product demoing itself
  // at display scale. Skipped under reduced motion (the loaders check
  // that themselves; nothing shows, which is the correct final state).
  function startHero() {
    if (!window.OrbitLoader || !OrbitLoader.shapes) return;
    var ring = document.getElementById("pg-hero-ring");
    var orbit = document.getElementById("pg-hero-orbit");
    if (ring) {
      OrbitLoader.wrap(ring, {
        d: OrbitLoader.shapes.circle(300),
        viewBox: "0 0 300 300",
        durationMs: 3600,
        segmentFraction: 0.32,
        strokeWidth: 3,
        guideOpacity: 0.4
      });
    }
    if (orbit && window.DotLoader) {
      DotLoader.wrap(orbit, {
        d: OrbitLoader.shapes.circle(196),
        viewBox: "0 0 196 196",
        durationMs: 5200,
        dots: 3,
        dotRadius: 4,
        direction: "reverse"
      });
    }
  }

  // Scroll reveal: cards fade and rise in small batches as they enter
  // the viewport. The hidden state lives under .pg-reveal, which is only
  // added here — with no JS the cards are simply visible — and the whole
  // effect is skipped under reduced motion.
  function wireReveal() {
    var reduced = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;
    cardsEl.classList.add("pg-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("pg-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    var cards = cardsEl.querySelectorAll(".pg-card");
    for (var i = 0; i < cards.length; i++) {
      // Cards already in the first viewport reveal immediately with a
      // small stagger; the rest wait for scroll.
      if (cards[i].getBoundingClientRect().top < window.innerHeight) {
        (function (el, d) {
          setTimeout(function () { el.classList.add("pg-in"); }, d);
        })(cards[i], 60 + (i % 3) * 90);
      } else {
        io.observe(cards[i]);
      }
    }
  }

  PG.startMark = startMark;
  PG.startHero = startHero;
  PG.wireReveal = wireReveal;
})(typeof window !== "undefined" ? window : this);
