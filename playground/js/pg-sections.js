/*!
 * pg-sections — section registry, headings, the "add your own" card. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  function buildAddCard() {
    var el = document.createElement("section");
    el.className = "pg-card pg-add";
    el.innerHTML =
      "<h3>Add your own</h3>" +
      "<p>Copy any block in <code>animations/</code>, change " +
      "<code>name</code>, <code>style</code> and <code>options</code>, " +
      "save, refresh — it appears here automatically.</p>";
    return el;
  }

  // Card sections: every animation belongs to one of three groups,
  // rendered as titled sections so the growing library stays scannable.
  var SECTIONS = [
    { label: "Looping loaders", styles: ["orbit", "dot", "shimmer", "ripple", "typing", "handshake"] },
    { label: "UI transitions", styles: ["tab", "page", "button", "toast", "progress"] },
    { label: "Components", styles: ["search", "modal", "accordion", "drawer", "dropdown", "input"] }
  ];

  function sectionFor(style) {
    for (var i = 0; i < SECTIONS.length; i++) {
      if (SECTIONS[i].styles.indexOf(style) >= 0) return SECTIONS[i];
    }
    return null;
  }

  // Section anchors are derived from the label so the sidebar can deep-link
  // and the scroll-margin rules in CSS line up with the sticky header.
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function buildSection(sec, index) {
    var wrap = document.createElement("section");
    wrap.className = "pg-section";
    wrap.id = "sec-" + slugify(sec.label);

    // One header line: ordinal, name, count, then a rule that eats the
    // remaining width — a section break you can scan without reading.
    var head = document.createElement("div");
    head.className = "pg-section-head";
    var num = document.createElement("span");
    num.className = "pg-section-num";
    num.textContent = (index + 1 < 10 ? "0" : "") + (index + 1);
    var h = document.createElement("h2");
    h.className = "pg-section-title";
    h.textContent = sec.label;
    var count = document.createElement("span");
    count.className = "pg-section-count";
    var rule = document.createElement("span");
    rule.className = "pg-section-rule";
    head.appendChild(num);
    head.appendChild(h);
    head.appendChild(count);
    head.appendChild(rule);

    var grid = document.createElement("div");
    grid.className = "pg-section-grid";
    wrap.appendChild(head);
    wrap.appendChild(grid);
    return { el: wrap, grid: grid, styles: sec.styles, label: sec.label, countEl: count };
  }

  PG.SECTIONS = SECTIONS;
  PG.buildSection = buildSection;
  PG.buildAddCard = buildAddCard;
})(typeof window !== "undefined" ? window : this);
