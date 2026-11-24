/*!
 * pg-nav — sidebar drawer, section jump, scrollspy. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var exitIntro = PG.exitIntro;
  var SECTIONS = PG.SECTIONS;
  var SCENE_SECTIONS = PG.SCENE_SECTIONS;
  var sectionFor = PG.sectionFor;
  var slugify = PG.slugify;
  function wireNavDrawer(cards, filter) {
    var sidebar = document.getElementById("pg-sidebar");
    var btn = document.getElementById("pg-menu-btn");
    if (!sidebar || !btn) return;

    // Fixed sidebar on desktop; on narrow screens it slides in and the
    // hamburger toggles it. No backdrop drawer — the nav is chrome, not
    // a component demo.
    function isNarrow() {
      return window.matchMedia("(max-width: 999px)").matches;
    }
    function isOpen() {
      return document.body.classList.contains("pg-sidebar-open");
    }
    function openNav() {
      document.body.classList.add("pg-sidebar-open");
      btn.setAttribute("aria-expanded", "true");
      // Move focus into the panel so keyboard users aren't left behind it.
      var first = sidebar.querySelector(".pg-nav-item");
      if (first) first.focus({ preventScroll: true });
    }
    function closeNav(returnFocus) {
      document.body.classList.remove("pg-sidebar-open");
      btn.setAttribute("aria-expanded", "false");
      if (returnFocus) btn.focus({ preventScroll: true });
    }

    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "pg-sidebar");
    btn.addEventListener("click", function () {
      if (isOpen()) closeNav(true);
      else openNav();
    });

    // Esc closes the panel and returns focus; Tab cycles inside it while
    // it's open, so focus can't wander onto the page behind the overlay.
    document.addEventListener("keydown", function (e) {
      if (!isNarrow() || !isOpen()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeNav(true);
        return;
      }
      if (e.key !== "Tab") return;
      var focusable = sidebar.querySelectorAll("a[href], button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    sidebar.addEventListener("click", function (e) {
      if (e.target.closest("a") && isNarrow()) closeNav(false);
    });

    var lists = { animations: document.getElementById("pg-nav-animations"),
                  components: document.getElementById("pg-nav-components") };

    // "All styles" lives at the top of the map — the reset for any filter.
    if (lists.animations) {
      var allItem = document.createElement("a");
      allItem.href = "#";
      allItem.className = "pg-nav-item is-on";
      allItem.setAttribute("data-style", "all");
      allItem.textContent = "All styles";
      allItem.addEventListener("click", function (e) {
        e.preventDefault();
        filter.applyFilter("all");
        exitIntro();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.matchMedia("(max-width: 999px)").matches) {
          document.body.classList.remove("pg-sidebar-open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
      lists.animations.appendChild(allItem);
    }
  
    SECTIONS.forEach(function (sec) {
      var list = lists[sec.label === "Components" ? "components" : "animations"];
      if (!list) return;
      // Group label carries its count — the sidebar reads as a map of
      // the library at a glance.
      // "Animations" carries two sections (looping + transitions), so the
      // count accumulates per group label instead of being appended twice.
      if (!list.__tlCount) list.__tlCount = { el: null, n: 0 };
      var tally = list.__tlCount;
      tally.n += sec.styles.length;
      if (!tally.el) {
        var labelEl = list.previousElementSibling;
        if (labelEl) {
          tally.el = document.createElement("span");
          tally.el.className = "pg-nav-count";
          labelEl.appendChild(tally.el);
        }
      }
      if (tally.el) tally.el.textContent = tally.n;
      sec.styles.forEach(function (style) {
        var label = style.charAt(0).toUpperCase() + style.slice(1);
        var a = document.createElement("a");
        a.href = "#";
        a.className = "pg-nav-item";
        a.setAttribute("data-style", style);
        a.textContent = label;
        a.addEventListener("click", function (e) {
          e.preventDefault();
          filter.applyFilter(style);
          exitIntro();
          scrollToSection(style);
        });
        list.appendChild(a);
      });
    });
  // The components-library group: one item per scene category. Same
  // contract as the style items — filter AND jump — but the filter key
  // is "cat:<category>" and the jump goes straight to the section.
  var sceneList = document.getElementById("pg-nav-scenes");
  if (sceneList) {
    var labelEl = sceneList.previousElementSibling;
    if (labelEl) {
      var count = document.createElement("span");
      count.className = "pg-nav-count";
      count.textContent = SCENE_SECTIONS.length;
      labelEl.appendChild(count);
    }
    SCENE_SECTIONS.forEach(function (label) {
      var a = document.createElement("a");
      a.href = "#";
      a.className = "pg-nav-item";
      a.setAttribute("data-style", "cat:" + label.toLowerCase());
      a.textContent = label;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        filter.applyFilter("cat:" + label.toLowerCase());
        exitIntro();
        var el = document.getElementById("sec-" + slugify(label));
        if (el) el.scrollIntoView({
          behavior: window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
        if (window.matchMedia("(max-width: 999px)").matches) {
          document.body.classList.remove("pg-sidebar-open");
          var btn = document.getElementById("pg-nav-toggle");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });
      sceneList.appendChild(a);
    });
  }
  }

  // Section anchors: clicking a sidebar item filters AND jumps to that
  // style's group, so the nav works as a map instead of a blind filter.
  function scrollToSection(style) {
    var sec = sectionFor(style);
    if (!sec) return;
    var el = document.getElementById("sec-" + slugify(sec.label));
    if (!el) return;
    el.scrollIntoView({
      behavior: window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  }

  // Scrollspy: the sidebar marks whichever section owns the top of the
  // viewport, so the reader always knows where they are in the library.
  function wireSectionSpy(sections, cards) {
    var groups = document.querySelectorAll(".pg-nav-group");
    if (!groups.length) return;
    // Sections map onto sidebar groups by name: everything that isn't the
    // Components section lives under the Animations heading.
    function groupFor(sec) {
      var want = sec.label === "Components" ? "components" : "animations";
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].textContent.toLowerCase().indexOf(want) === 0) return groups[i];
      }
      return null;
    }
    var raf = 0;
    function paint() {
      raf = 0;
      var best = null;
      // The section that most recently crossed the 120px line — i.e. the one
      // with the LARGEST top that is still above it. (Picking the smallest
      // top would report the very first section no matter how far you've
      // scrolled, because every earlier top is a bigger negative.)
      var bestTop = -Infinity;
      var firstVisible = null;
      for (var i = 0; i < sections.length; i++) {
        var el = sections[i].el;
        // Skip sections emptied by a filter — they collapse to 0 height and
        // would otherwise always win.
        if (!el.offsetHeight) continue;
        var top = el.getBoundingClientRect().top;
        if (!firstVisible) firstVisible = sections[i];
        if (top <= 120 && top > bestTop) { best = sections[i]; bestTop = top; }
      }
      // Nothing has crossed the line yet (page top): the first section is it.
      if (!best) best = firstVisible;
      if (!best) return;
      var cur = groupFor(best);
      for (var j = 0; j < groups.length; j++) {
        groups[j].classList.toggle("is-current", groups[j] === cur);
      }
    }
    function onScroll() {
      if (!raf) raf = window.requestAnimationFrame(paint);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.__pgSpyPaint = paint;
    paint();

    // Header elevation: the sticky bar only casts a shadow once content
    // has actually passed beneath it. Toggled here because this module
    // already owns the page's scroll listening.
    var headerEl = document.querySelector(".pg-header");
    window.addEventListener("scroll", function () {
      if (headerEl) headerEl.classList.toggle("is-scrolled", window.scrollY > 4);
    }, { passive: true });
  }

  PG.wireNavDrawer = wireNavDrawer;
  PG.scrollToSection = scrollToSection;
  PG.wireSectionSpy = wireSectionSpy;
})(typeof window !== "undefined" ? window : this);
