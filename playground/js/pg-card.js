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
  var render = PG.render;
  // Tuning mutates cfg.options in place; the reset needs the config as
  // it arrived. Options are plain JSON data (the config block already
  // round-trips them through JSON), so a JSON copy is a deep copy.
  function deepCopyOptions(opts) {
    return JSON.parse(JSON.stringify(opts || {}));
  }
  function buildCard(cfg, index) {
    var card = { cfg: cfg, controller: null, originalOptions: deepCopyOptions(cfg.options) };
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
    // what the code is; Copy and the expand toggle sit at the opposite
    // end of the same row, right above the code they act on.
    var code = document.createElement("div");
    code.className = "pg-code";
    var codeHead = document.createElement("div");
    codeHead.className = "pg-code-head";
    var codeLabel = document.createElement("span");
    codeLabel.className = "pg-code-label";
    codeLabel.textContent = "Usage";
    codeHead.appendChild(codeLabel);
    var codeActions = document.createElement("div");
    codeActions.className = "pg-code-actions";
    // Expand toggle: only rendered once the code actually overflows the
    // panel's cap (see refreshCodePanel); expands to a viewport-bound
    // maximum so even the longest scene recipe stays contained.
    var expand = document.createElement("button");
    expand.className = "pg-expand";
    expand.innerHTML = PG.ICON_CHEVRON;
    expand.setAttribute("aria-label", "Expand code");
    expand.setAttribute("aria-expanded", "false");
    expand.title = "Expand code";
    expand.addEventListener("click", function () {
      var isOpen = code.classList.toggle("is-expanded");
      expand.setAttribute("aria-expanded", isOpen ? "true" : "false");
      expand.setAttribute("aria-label", isOpen ? "Collapse code" : "Expand code");
      expand.title = isOpen ? "Collapse code" : "Expand code";
    });
    codeActions.appendChild(expand);
    var copyCode = document.createElement("button");
    copyCode.className = "pg-copy";
    copyCode.innerHTML = PG.ICON_COPY;
    copyCode.setAttribute("aria-label", "Copy code");
    copyCode.title = "Copy code";
    copyCode.dataset.label = "Copy code";
    copyCode.addEventListener("click", function () { copy(buildSnippet(card), copyCode); });
    codeActions.appendChild(copyCode);
    codeHead.appendChild(codeActions);
    code.appendChild(codeHead);

    // The small usage snippet — this is a library, so the card shows
    // the code you would actually write, not the playground's config.
    var snippet = document.createElement("pre");
    snippet.className = "pg-snippet";
    snippet.textContent = buildSnippet(card);
    card.snippet = snippet;
    code.appendChild(snippet);
    el.appendChild(code);

    // Measure whether the code overflows the compact cap and wire the
    // expand toggle accordingly. Re-run after every snippet update —
    // tuning changes the code, so the toggle must track it.
    card.refreshCodePanel = function () {
      var overflows = snippet.scrollHeight > snippet.clientHeight + 1;
      code.classList.toggle("can-expand", overflows);
      if (!overflows && code.classList.contains("is-expanded")) {
        code.classList.remove("is-expanded");
        expand.setAttribute("aria-expanded", "false");
      }
    };
    card.refreshCodePanel();

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
      // Reset: put this animation's options back to the config they
      // arrived with. Rebuilds the controls too, so sliders and pickers
      // show the restored values instead of lying about the state.
      var reset = document.createElement("button");
      reset.className = "pg-tune pg-reset";
      reset.textContent = "Reset";
      reset.addEventListener("click", function () {
        card.cfg.options = deepCopyOptions(card.originalOptions);
        var fresh = buildControls(card);
        controls.parentNode.replaceChild(fresh, controls);
        controls = fresh;
        if (card.live) render(card);
        if (card.snippet) card.snippet.textContent = PG.buildSnippet(card);
        if (card.refreshCodePanel) card.refreshCodePanel();
      });
      var tuneRow = document.createElement("div");
      tuneRow.className = "pg-tune-row";
      tuneRow.appendChild(tune);
      tuneRow.appendChild(reset);
      el.appendChild(tuneRow);
      el.appendChild(controls);
      card.tune = tune;
    }

    card.el = el;
    return card;
  }

  PG.buildCard = buildCard;
})(typeof window !== "undefined" ? window : this);
