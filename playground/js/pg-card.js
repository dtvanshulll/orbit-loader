/*!
 * pg-card — card assembly: head, note, stage, code block, tune row. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var buildSnippet = PG.buildSnippet;
  var copy = PG.copy;
  var buildControls = PG.buildControls;
  function buildCard(cfg, index) {
    var card = { cfg: cfg, controller: null };
    var el = document.createElement("section");
    el.className = "pg-card";

    // Card anatomy (one rhythm for every card): head row — title and tag —
    // then note, stage, and the code block. The Copy button lives in the
    // code block's own header, right above the code it copies — not stranded
    // at the top of the card, far from the thing it acts on.
    var head = document.createElement("div");
    head.className = "pg-card-head";
    var title = document.createElement("h3");
    title.textContent = cfg.name;
    var tag = document.createElement("span");
    tag.className = "pg-style-tag";
    tag.textContent = cfg.style;
    title.appendChild(tag);
    head.appendChild(title);
    el.appendChild(head);

    if (cfg.note) {
      var note = document.createElement("p");
      note.className = "pg-note";
      note.textContent = cfg.note;
      el.appendChild(note);
    }

    var stage = document.createElement("div");
    stage.className = "pg-stage";
    card.stage = stage;
    el.appendChild(stage);

    // The code block: a labeled panel, not a bare <pre>. The label names
    // what the code is; Copy sits at the opposite end of the same row.
    var code = document.createElement("div");
    code.className = "pg-code";
    var codeHead = document.createElement("div");
    codeHead.className = "pg-code-head";
    var codeLabel = document.createElement("span");
    codeLabel.className = "pg-code-label";
    codeLabel.textContent = "Usage";
    codeHead.appendChild(codeLabel);
    var copyCode = document.createElement("button");
    copyCode.className = "pg-copy";
    copyCode.textContent = "Copy";
    copyCode.dataset.label = "Copy";
    copyCode.addEventListener("click", function () { copy(buildSnippet(card), copyCode); });
    codeHead.appendChild(copyCode);
    code.appendChild(codeHead);

    // The small usage snippet — this is a library, so the card shows
    // the code you would actually write, not the playground's config.
    var snippet = document.createElement("pre");
    snippet.className = "pg-snippet";
    snippet.textContent = buildSnippet(card);
    card.snippet = snippet;
    code.appendChild(snippet);
    el.appendChild(code);

    var controls = buildControls(card);
    if (controls.childNodes.length) {
      var tune = document.createElement("button");
      tune.className = "pg-tune";
      tune.textContent = "Tune";
      tune.setAttribute("aria-expanded", "false");
      tune.addEventListener("click", function () {
        var open = controls.classList.toggle("is-open");
        tune.setAttribute("aria-expanded", open ? "true" : "false");
      });
      var tuneRow = document.createElement("div");
      tuneRow.className = "pg-tune-row";
      tuneRow.appendChild(tune);
      el.appendChild(tuneRow);
      el.appendChild(controls);
      card.tune = tune;
    }

    card.el = el;
    return card;
  }

  PG.buildCard = buildCard;
})(typeof window !== "undefined" ? window : this);
