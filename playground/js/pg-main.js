/*!
 * pg-main — init: build everything, wire it, boot. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var render = PG.render;
  var buildSnippet = PG.buildSnippet;
  var buildConfigBlock = PG.buildConfigBlock;
  var buildCard = PG.buildCard;
  var makeFilter = PG.makeFilter;
  var enterIntro = PG.enterIntro;
  var exitIntro = PG.exitIntro;
  var wireSearch = PG.wireSearch;
  var wireNavDrawer = PG.wireNavDrawer;
  var wireSectionSpy = PG.wireSectionSpy;
  var startMark = PG.startMark;
  var startHero = PG.startHero;
  var wireReveal = PG.wireReveal;
  var SECTIONS = PG.SECTIONS;
  var buildSection = PG.buildSection;
  var cardsEl = PG.cardsEl;
  function init() {
    var list = window.ORBIT_ANIMATIONS || [];
    var cards = [];
    var sections = [];
    var grids = {};
    for (var s = 0; s < SECTIONS.length; s++) {
      var sec = buildSection(SECTIONS[s], s);
      sections.push(sec);
      cardsEl.appendChild(sec.el);
      for (var t = 0; t < sec.styles.length; t++) grids[sec.styles[t]] = sec.grid;
    }
    var addGrid = grids.search || cardsEl; // leftover configs land in Components
    for (var i = 0; i < list.length; i++) {
      var card = buildCard(list[i], i);
      // Append BEFORE rendering: textBoxForElement measures real layout,
      // and a detached card measures 0x0.
      (grids[list[i].style] || addGrid).appendChild(card.el);
      try { render(card); } catch (e) { window.__initErr = e.message + " | cfg=" + list[i].name; }
      // Remember the resolved viewBox so the copied snippet has it.
      if (card.resolved && card.resolved.viewBox) card.cfg._viewBox = card.resolved.viewBox;
      cards.push(card);
    }
    // Counts reflect real cards (variants included), not style names.
    for (var c = 0; c < sections.length; c++) {
      sections[c].countEl.textContent = sections[c].grid.querySelectorAll(".pg-card").length;
    }
    var filter = makeFilter(cards, sections);
    startMark();
    startHero();
    wireReveal();
    wireNavDrawer(cards, filter);
    // After the nav exists — the spy paints into its items.
    wireSectionSpy(sections, cards);
    wireSearch(cards, filter);
    var browse = document.getElementById("pg-browse");
    if (browse) browse.addEventListener("click", function (e) {
      e.preventDefault();
      filter.clearSearch();
      filter.applyFilter("all");
      exitIntro();
    });
    var brand = document.querySelector(".pg-brand");
    if (brand) {
      brand.addEventListener("click", function () { enterIntro(); });
      brand.setAttribute("title", "Back to the intro");
    }
    // Small debug hook for console testing of the generators.
    window.__playgroundDebug = {
      cards: cards,
      buildSnippet: buildSnippet,
      buildConfigBlock: buildConfigBlock
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }


})(typeof window !== "undefined" ? window : this);
