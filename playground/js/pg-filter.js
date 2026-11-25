/*!
 * pg-filter — style filter, live search, intro/catalog switching. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};

  // The live search's state, shared by the filter and the intro wiring.
  var searchState = { query: "" };

  // The page has two states: the intro (hero + search, no catalog) and
  // the catalog (sections + cards). The home page is the intro only —
  // the library is one deliberate step away, not crammed under the hero.

  // One filter for the whole page. The sidebar is the only control that
  // drives it — it *is* the map of the library, so there is no second row
  // of chips repeating the same seventeen names in the body.
  function makeFilter(cards, sections) {
    // Shared tail for every way the catalog can be narrowed: hide empty
    // sections, refresh their counts, let the spy re-pick.
    function syncSections() {
      for (var s = 0; s < sections.length; s++) {
        var sec = sections[s];
        var visible = 0;
        var kids = sec.grid.children;
        for (var c = 0; c < kids.length; c++) {
          if (kids[c].style.display !== "none") visible++;
        }
        sec.el.style.display = visible ? "" : "none";
        if (sec.countEl) sec.countEl.textContent = visible;
      }
      if (window.__pgSpyPaint) window.__pgSpyPaint();
    }

    // One-shot fade on the grids a filter/search pass just narrowed.
    // Opacity only (no layout, no movement) because this fires per
    // keystroke; 0.35 start so the grid never looks blank mid-type.
    function fadeGrids() {
      if (window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      for (var s = 0; s < sections.length; s++) {
        var g = sections[s].grid;
        if (!g || g.style.display === "none" || !g.animate) continue;
        if (!g.offsetParent) continue;
        g.animate(
          [{ opacity: 0.35 }, { opacity: 1 }],
          { duration: 140, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
      }
    }

    function applyFilter(style) {
      clearSearch();
      var isCat = style.indexOf("cat:") === 0;
      var want = isCat ? style.slice(4) : null;
      for (var k = 0; k < cards.length; k++) {
        var cfg = cards[k].cfg;
        var hit = style === "all" ||
          (isCat ? (cfg.category || "").toLowerCase() === want : cfg.style === style);
        cards[k].el.style.display = hit ? "" : "none";
      }
      // Mirror the state onto the sidebar entries and keep the active
      // one in view inside the rail (block:nearest never scrolls the
      // page itself).
      var items = document.querySelectorAll(".pg-nav-item");
      for (var n = 0; n < items.length; n++) {
        items[n].classList.toggle("is-on",
          items[n].getAttribute("data-style") === style);
      }
      var active = document.querySelector(".pg-nav-item.is-on");
      if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
      syncSections();
      fadeGrids();
    }

    // Free-text search across name, style and note. Runs against the
    // catalog view; typing switches you out of the intro.
    function applyQuery(q) {
      var query = (q || "").trim().toLowerCase();
      searchState.query = query;
      // A live search suspends the style filter — the box is the truth.
      var items = document.querySelectorAll(".pg-nav-item");
      for (var n = 0; n < items.length; n++) {
        items[n].classList.toggle("is-on", false);
      }
      var hits = 0;
      for (var k = 0; k < cards.length; k++) {
        var cfg = cards[k].cfg;
        var hay = (cfg.name + " " + cfg.style + " " + (cfg.category || "") + " " + (cfg.note || "")).toLowerCase();
        var show = !query || hay.indexOf(query) >= 0;
        cards[k].el.style.display = show ? "" : "none";
        if (show) hits++;
      }
      var results = document.getElementById("pg-results");
      if (results) {
        results.hidden = !query;
        results.textContent = query
          ? hits + " result" + (hits === 1 ? "" : "s") + " for \u201C" + q.trim() + "\u201D"
          : "";
      }
      syncSections();
      fadeGrids();
    }

    function clearSearch() {
      var input = document.getElementById("pg-search-input");
      if (input && input.value) input.value = "";
      searchState.query = "";
      // Keep the clear button in sync with a programmatically emptied
      // box (the input listener only fires on real user input).
      var form = document.getElementById("pg-search");
      if (form) form.classList.remove("has-value");
      var clearBtn = document.querySelector(".pg-search-clear");
      if (clearBtn) clearBtn.hidden = true;
      var results = document.getElementById("pg-results");
      if (results) results.hidden = true;
      // Clearing the query also clears what it filtered — the catalog
      // returns to "all" so the sidebar state and the cards agree.
      for (var k = 0; k < cards.length; k++) cards[k].el.style.display = "";
      var items = document.querySelectorAll(".pg-nav-item");
      for (var n = 0; n < items.length; n++) {
        items[n].classList.toggle("is-on",
          items[n].getAttribute("data-style") === "all");
      }
      syncSections();
    }

    return { applyFilter: applyFilter, applyQuery: applyQuery, clearSearch: clearSearch, syncSections: syncSections };
  }

  // The sidebar: the permanent map of the library and the page's only
  // filter control. On narrow screens a hamburger slides it in; each entry
  // Intro <-> catalog. Entering the intro hides the catalog; leaving it
  // reveals the sections. The brand wordmark is the way back home.
  function enterIntro() {
    document.body.classList.add("pg-intro");
    window.scrollTo(0, 0);
    var input = document.getElementById("pg-search-input");
    if (input) input.focus({ preventScroll: true });
  }
  function exitIntro() {
    document.body.classList.remove("pg-intro");
    // One-shot rise for the catalog as it arrives; cleared on end so the
    // class never lingers to replay on later reflows.
    document.body.classList.add("pg-arriving");
    var cards = document.querySelector(".pg-cards");
    if (cards && cards.getAnimations) {
      var anims = cards.getAnimations();
      if (anims.length) {
        anims[anims.length - 1].addEventListener("finish", function () {
          document.body.classList.remove("pg-arriving");
        });
      } else { document.body.classList.remove("pg-arriving"); }
    } else {
      window.setTimeout(function () { document.body.classList.remove("pg-arriving"); }, 320);
    }
    // Cards that need a real measurement render through the lazy
    // activation observer now — it fires the moment the catalog becomes
    // visible, so no manual flush here (that used to draw all 176 at
    // once, the thing lazy activation exists to prevent).
  }
  function isIntro() {
    return document.body.classList.contains("pg-intro");
  }

  // The intro's search box: real filtering, not a decorative demo. Typing
  // drops you into the catalog with the query applied; Esc clears it and
  // goes home; "/" from anywhere jumps into the box.
  function wireSearch(cards, filter) {
    var form = document.getElementById("pg-search");
    var input = document.getElementById("pg-search-input");
    if (!form || !input) return;
    // Clear button: appears only while the box holds text; one job —
    // empty the box, reset the filter, hand focus back.
    var clearBtn = form.querySelector(".pg-search-clear");
    function syncClear() {
      form.classList.toggle("has-value", !!input.value);
      if (clearBtn) clearBtn.hidden = !input.value;
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        syncClear();
        filter.clearSearch();
        filter.syncSections();
        input.focus({ preventScroll: true });
      });
    }
    // The row is the target: a tap on its padding or icon still lands
    // in the input instead of dying on dead space.
    form.addEventListener("click", function (e) {
      if (e.target === form || e.target.closest("svg, .pg-search-kbd")) {
        document.getElementById("pg-search-input").focus();
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!input.value.trim()) { exitIntro(); filter.syncSections(); return; }
      filter.applyQuery(input.value);
      exitIntro();
    });
    input.addEventListener("input", function () {
      syncClear();
      if (!input.value.trim()) {
        if (!isIntro()) { filter.clearSearch(); filter.syncSections(); }
        return;
      }
      filter.applyQuery(input.value);
      exitIntro();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      filter.clearSearch();
      filter.syncSections();
      enterIntro();
    });
    // "/" focuses the search from anywhere, like every docs site.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || isIntro()) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      e.preventDefault();
      enterIntro();
    });
  }

  // The brand mark: a coiled loop, not a generic circle — the path-trace
  // motif at icon scale. The segment crawls the spiral and a single dot

  PG.makeFilter = makeFilter;
  PG.enterIntro = enterIntro;
  PG.exitIntro = exitIntro;
  PG.isIntro = isIntro;
  PG.wireSearch = wireSearch;
})(typeof window !== "undefined" ? window : this);
