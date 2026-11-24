/*
 * TraceLoop Playground — renders every animation defined in
 * animations/animations.js as a live, editable card.
 *
 * Each card: preview stage, generated controls for that animation's
 * options (letters/words get a text box — type and it redraws), and
 * buttons that copy either the standalone usage snippet or the config
 * block to paste back into animations.js.
 *
 * No dependencies, no build step — same rules as the library itself.
 */
(function () {
  "use strict";

  var GLOBALS = { orbit: "OrbitLoader", dot: "DotLoader", shimmer: "ShimmerLoader", ripple: "RippleLoader", typing: "TypingLoader", handshake: "HandshakeLoader", tab: "TabLoader", page: "PageLoader", button: "ButtonLoader", toast: "ToastLoader", progress: "ProgressLoader", search: "SearchLoader", modal: "ModalLoader", accordion: "AccordionLoader", drawer: "DrawerLoader", dropdown: "DropdownLoader", input: "InputLoader" };
  var SCRIPTS = { orbit: "orbit-loader.js", dot: "dot-loader.js", shimmer: "shimmer-loader.js", ripple: "ripple-loader.js", typing: "typing-loader.js", handshake: "handshake-loader.js", tab: "tab-loader.js", page: "page-loader.js", button: "button-loader.js", toast: "toast-loader.js", progress: "progress-loader.js", search: "search-loader.js", modal: "modal-loader.js", accordion: "accordion-loader.js", drawer: "drawer-loader.js", dropdown: "dropdown-loader.js", input: "input-loader.js" };
  // Container-based styles: no path to trace, create() takes the box.
  var CONTAINER_STYLES = { ripple: 1, typing: 1, tab: 1, page: 1, button: 1, toast: 1, search: 1, modal: 1, accordion: 1, drawer: 1, dropdown: 1, input: 1 };
  // Shapes that return { d, ... } objects instead of a bare d string —
  // the copied snippet assigns them to a variable first.
  var OBJECT_SHAPES = { letterOutline: 1, text: 1, textBox: 1 };
  // Numeric options: [min, max, step] for the sliders.
  var RANGES = {
    durationMs: [400, 12000, 50],
    strokeWidth: [0.5, 12, 0.5],
    dotRadius: [1, 12, 0.5],
    dots: [1, 8, 1],
    bandWidth: [2, 30, 1],
    bandOpacity: [0.05, 1, 0.05],
    staggerMs: [0, 600, 10],
    lift: [0.05, 0.8, 0.05],
    segmentFraction: [0.02, 0.9, 0.01],
    offset: [0, 40, 1],
    guideOpacity: [0, 1, 0.05],
    rings: [1, 8, 1],
    startScale: [0.05, 0.8, 0.05],
    steps: [0, 24, 1],
    breathe: [0, 1, 0.05],
    breatheMs: [400, 4000, 100],
    wobble: [0, 20, 0.5],
    wobbleCycles: [1, 10, 1],
    trail: [0, 20, 1],
    meetAt: [0.2, 0.8, 0.05],
    overlap: [0, 0.4, 0.02],
    thickness: [1, 6, 0.5],
    radius: [0, 20, 1],
    headRadius: [1, 6, 0.5],
    stretch: [1, 2.5, 0.1],
    restMs: [200, 4000, 100],
    collapsedWidth: [24, 80, 4],
    expandedWidth: [120, 400, 10],
    radius: [0, 20, 1]
  };
  var LETTER_SHAPES = { letter: 1, letterOutline: 1 };

  var cardsEl = document.getElementById("cards");

  /* ---------- config → live animation ---------- */

  // Turn a `d` recipe into { d, guideD, viewBox }. "textBox" is resolved
  // against the animation's own box element (it measures real layout).
  function resolveD(spec, boxEl) {
    if (spec == null) return {}; // the loader supplies its own path (e.g. progress ring preset)
    if (typeof spec === "string") return { d: spec };
    var args = (spec.args || []).slice();
    if (spec.shape === "textBox") {
      var box = OrbitLoaderShapes.textBoxForElement(boxEl, args[0], args[1]);
      return { d: box.d, viewBox: box.viewBox };
    }
    var result = OrbitLoaderShapes[spec.shape].apply(null, args);
    if (typeof result === "string") return { d: result };
    return { d: result.d, guideD: result.guideD, viewBox: result.viewBox };
  }

  function buildBox(box) {
    var el = document.createElement("div");
    el.className = "orbit-loader-wrap";
    var s = [];
    if (box.width) s.push("width:" + box.width + "px");
    if (box.height) s.push("height:" + box.height + "px");
    if (box.background) s.push("background:" + box.background);
    if (box.borderRadius) s.push("border-radius:" + box.borderRadius + "px");
    if (box.border) s.push("border:" + box.border);
    if (box.padding) s.push("padding:" + box.padding);
    if (box.fontSize) s.push("font-size:" + box.fontSize + "px");
    if (box.fontWeight) s.push("font-weight:" + box.fontWeight);
    if (box.color) s.push("color:" + box.color);
    if (box.position) s.push("position:" + box.position);
    if (box.top != null) s.push("top:" + box.top + "px");
    if (box.left != null) s.push("left:" + box.left + "px");
    if (box.right != null) s.push("right:" + box.right + "px");
    if (box.bottom != null) s.push("bottom:" + box.bottom + "px");
    el.style.cssText = s.join(";");
    if (box.content) el.textContent = box.content;
    // box.html is repo-authored config markup (a stroke icon), never user
    // input — that's why innerHTML is acceptable in this one place.
    if (box.html) el.innerHTML = box.html;
    return el;
  }

  // (Re)draw one animation into its stage. Called on load and after
  // every edit — cheap, since each style's create() is trivial.
  function render(card) {
    var cfg = card.cfg;
    if (card.controller) card.controller.destroy();
    card.stage.innerHTML = "";
    var boxEl = buildBox(cfg.box || {});
    card.stage.appendChild(boxEl);
    var opts = {};
    for (var k in cfg.options) {
      if (Object.prototype.hasOwnProperty.call(cfg.options, k)) opts[k] = cfg.options[k];
    }
    if (CONTAINER_STYLES[cfg.style]) {
      card.controller = window[GLOBALS[cfg.style]].create(boxEl, opts);
    } else {
      var resolved = resolveD(opts.d, boxEl);
      opts.d = resolved.d;
      if (resolved.guideD) opts.guideD = resolved.guideD;
      if (resolved.viewBox) opts.viewBox = resolved.viewBox;
      card.resolved = resolved;
      card.controller = GLOBALS[cfg.style] && window[GLOBALS[cfg.style]].wrap(boxEl, opts);
    }
  }

  /* ---------- snippet / config generation ---------- */

  function argsCode(args) {
    return (args || []).map(function (a) { return JSON.stringify(a); }).join(", ");
  }

  function optionsCode(cfg, opts, varName) {
    var lines = [];
    for (var k in opts) {
      if (!Object.prototype.hasOwnProperty.call(opts, k)) continue;
      if (k === "d" || k === "guideD" || k === "viewBox") continue;
      var v = opts[k];
      lines.push("    " + k + ": " + (typeof v === "string" ? JSON.stringify(v) : v) + ",");
    }
    if (opts.d && typeof opts.d === "object" && OBJECT_SHAPES[opts.d.shape]) {
      lines.splice(0, 0, "    d: " + varName + ".d,");
      if (cfg.style !== "ripple" && opts.d.shape === "letterOutline") {
        lines.splice(1, 0, "    guideD: " + varName + ".guideD,");
      }
      lines.push("    viewBox: " + varName + ".viewBox,");
    } else if (opts.d !== undefined) {
      lines.splice(0, 0, "    d: " + (typeof opts.d === "string" ? JSON.stringify(opts.d) : "OrbitLoader.shapes." + opts.d.shape + "(" + argsCode(opts.d.args) + ")") + ",");
      if (card_viewBox(cfg)) lines.push("    viewBox: " + JSON.stringify(card_viewBox(cfg)) + ",");
    }
    // trim trailing comma on the last line
    if (lines.length) {
      var last = lines[lines.length - 1];
      lines[lines.length - 1] = last.replace(/,\s*$/, "");
    }
    return lines.join("\n");
  }

  function card_viewBox(cfg) {
    return cfg._viewBox;
  }

  // Options that belong to the playground's demo loop or staging, not
  // to using the library — dropped from the snippet to keep it small.
  var SNIPPET_SKIP = { autoStart: 1, restMs: 1, durationMs: 1, box: 1, name: 1, note: 1, style: 1, content: 1, _viewBox: 1 };

  function buildSnippet(card) {
    var cfg = card.cfg;
    var opts = cfg.options || {};
    var g = GLOBALS[cfg.style];
    var lines = [];
    lines.push("import { " + g + " } from 'traceloop';");
    lines.push("");
    // Meaningful options only, in insertion order.
    var argLines = [];
    for (var k in opts) {
      if (!Object.prototype.hasOwnProperty.call(opts, k)) continue;
      if (SNIPPET_SKIP[k]) continue;
      var v = opts[k];
      if (v && typeof v === "object" && v.shape) {
        argLines.push("  d: OrbitLoaderShapes." + v.shape + "(" + argsCode(v.args) + "),");
        if (card_viewBox(cfg)) argLines.push("  viewBox: " + JSON.stringify(card_viewBox(cfg)) + ",");
        continue;
      }
      if (k === "d" || k === "guideD" || k === "viewBox") {
        if (typeof v === "string" && k === "d") argLines.push("  d: " + JSON.stringify(v) + ",");
        if (k === "viewBox") argLines.push("  viewBox: " + JSON.stringify(v) + ",");
        continue;
      }
      argLines.push("  " + k + ": " + (typeof v === "string" ? JSON.stringify(v) : v) + ",");
    }
    if (argLines.length) {
      // trim trailing comma
      var last = argLines[argLines.length - 1];
      argLines[argLines.length - 1] = last.replace(/,\s*$/, "");
      lines.push(g + ".wrap('#your-element', {");
      for (var li = 0; li < argLines.length; li++) lines.push(argLines[li]);
      lines.push("});");
    } else {
      lines.push(g + ".wrap('#your-element');");
    }
    return lines.join("\n");
  }

  function buildEmbedBlock(card) {
    var cfg = card.cfg;
    var opts = cfg.options;
    var isRipple = !!CONTAINER_STYLES[cfg.style];
    var varName = "shape";
    var pre = [];
    var usesObjectShape = opts.d && typeof opts.d === "object" && OBJECT_SHAPES[opts.d.shape];
    var usesTextBox = opts.d && typeof opts.d === "object" && opts.d.shape === "textBox";

    if (usesTextBox) {
      pre.push("  var box = OrbitLoaderShapes.textBoxForElement(");
      pre.push("    document.querySelector('.orbit-loader-wrap'), " + argsCode(opts.d.args) + ");");
      varName = "box";
    } else if (usesObjectShape) {
      pre.push("  var shape = OrbitLoaderShapes." + opts.d.shape + "(" + argsCode(opts.d.args) + ");");
    }

    var boxBits = [];
    var b = cfg.box || {};
    if (b.width) boxBits.push("width:" + b.width + "px");
    if (b.height) boxBits.push("height:" + b.height + "px");
    if (b.background) boxBits.push("background:" + b.background);
    if (b.borderRadius) boxBits.push("border-radius:" + b.borderRadius + "px");
    if (b.border) boxBits.push("border:" + b.border);
    if (b.padding) boxBits.push("padding:" + b.padding);
    if (b.fontSize) boxBits.push("font-size:" + b.fontSize + "px");
    if (b.fontWeight) boxBits.push("font-weight:" + b.fontWeight);

    var out = [];
    out.push("<!-- " + cfg.name + " \u2014 OrbitLoader -->");
    out.push('<link rel="stylesheet" href="orbit-loader.css">');
    out.push("");
    out.push('<div class="orbit-loader-wrap" style="' + boxBits.join("; ") + '">');
    if (b.content) out.push("  " + b.content);
    out.push("</div>");
    out.push("");
    out.push('<script src="' + SCRIPTS[cfg.style] + '"><\/script>');
    if (opts.d && typeof opts.d === "object" && opts.d.shape) out.push('<script src="shapes.js"><\/script>');
    out.push("<script>");
    if (pre.length) out.push(pre.join("\n"));
    out.push("  " + GLOBALS[cfg.style] + "." + (isRipple ? "create" : "wrap") + "(document.querySelector('.orbit-loader-wrap'), {");
    out.push(optionsCode(cfg, opts, varName));
    out.push("  });");
    out.push("<\/script>");
    return out.join("\n");
  }

  function buildConfigBlock(card) {
    var cfg = JSON.parse(JSON.stringify(card.cfg));
    delete cfg._viewBox;
    return JSON.stringify(cfg, null, 2).replace(/^\[/, "[").replace(/\]$/, "]");
  }

  function copy(text, btn) {
    var done = function () {
      btn.textContent = "Copied!";
      btn.classList.add("pg-copied");
      setTimeout(function () {
        btn.textContent = btn.dataset.label;
        btn.classList.remove("pg-copied");
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  /* ---------- controls ---------- */

  function field(labelText, input) {
    var wrap = document.createElement("div");
    wrap.className = "pg-field";
    var label = document.createElement("label");
    label.textContent = labelText;
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function numInput(value, min, max, step, onInput) {
    var input = document.createElement("input");
    input.type = "range";
    input.min = min; input.max = max; input.step = step;
    input.value = value;
    var text = document.createElement("input");
    text.type = "number";
    text.min = min; text.max = max; text.step = step;
    text.value = value;
    input.addEventListener("input", function () { text.value = input.value; onInput(parseFloat(input.value)); });
    text.addEventListener("input", function () {
      if (text.value === "") return;
      input.value = text.value;
      onInput(parseFloat(text.value));
    });
    var both = document.createElement("div");
    both.style.cssText = "display:flex;gap:6px;align-items:center";
    both.style.setProperty("flex", "1");
    input.style.flex = "1";
    both.appendChild(input);
    both.appendChild(text);
    return both;
  }

  function buildControls(card) {
    var cfg = card.cfg;
    var opts = cfg.options;
    var grid = document.createElement("div");
    grid.className = "pg-controls";
    var redraw = function () { render(card); };

    for (var key in opts) {
      if (!Object.prototype.hasOwnProperty.call(opts, key)) continue;
      var value = opts[key];

      if (key === "d" && typeof value === "object" && (LETTER_SHAPES[value.shape] || value.shape === "text")) {
        // The alphabet box: type a letter or word, the animation redraws.
        var input = document.createElement("input");
        input.type = "text";
        input.value = value.args[0];
        input.maxLength = LETTER_SHAPES[value.shape] ? 1 : 24;
        input.addEventListener("input", function () {
          if (!input.value) return;
          var up = input.value.toUpperCase();
          input.value = up;
          opts.d.args[0] = up;
          redraw();
        });
        var f = field(value.shape === "text" ? "text (A-Z 0-9)" : "letter (A-Z 0-9)", input);
        f.classList.add("pg-wide");
        grid.appendChild(f);
        continue;
      }

      if (key === "d" || key === "guideD" || key === "viewBox") continue;

      if (key === "color") {
        var picker = document.createElement("input");
        picker.type = "color";
        picker.value = /^#[0-9a-f]{6}$/i.test(value) ? value : "#d97757";
        var hex = document.createElement("input");
        hex.type = "text";
        hex.value = value != null ? value : "";
        picker.addEventListener("input", function () { hex.value = picker.value; opts.color = picker.value; redraw(); });
        hex.addEventListener("input", function () { opts.color = hex.value; redraw(); });
        var pair = document.createElement("div");
        pair.style.cssText = "display:flex;gap:6px";
        picker.style.flex = "1"; hex.style.flex = "1";
        pair.appendChild(picker); pair.appendChild(hex);
        grid.appendChild(field("color", pair));
        continue;
      }

      if (key === "direction") {
        var sel = document.createElement("select");
        ["forward", "reverse"].forEach(function (d) {
          var o = document.createElement("option");
          o.value = d; o.textContent = d;
          if (d === value) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener("change", function () { opts.direction = sel.value; redraw(); });
        grid.appendChild(field("direction", sel));
        continue;
      }

      if (RANGES[key]) {
        var r = RANGES[key];
        var num = numInput(value, r[0], r[1], r[2], function (v) { opts[key] = v; redraw(); });
        grid.appendChild(field(key, num));
        continue;
      }
    }
    return grid;
  }

  /* ---------- card assembly ---------- */

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

  /* ---------- style filter + chrome ---------- */

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
          // the "Add your own" card matches no style — skip it
          if (kids[c].classList.contains("pg-add")) continue;
          if (kids[c].style.display !== "none") visible++;
        }
        sec.el.style.display = visible ? "" : "none";
        if (sec.countEl) sec.countEl.textContent = visible;
      }
      if (window.__pgSpyPaint) window.__pgSpyPaint();
    }

    function applyFilter(style) {
      clearSearch();
      for (var k = 0; k < cards.length; k++) {
        cards[k].el.style.display =
          style === "all" || cards[k].cfg.style === style ? "" : "none";
      }
      // Mirror the state onto the sidebar entries.
      var items = document.querySelectorAll(".pg-nav-item");
      for (var n = 0; n < items.length; n++) {
        items[n].classList.toggle("is-on",
          items[n].getAttribute("data-style") === style);
      }
      syncSections();
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
        var hay = (cfg.name + " " + cfg.style + " " + (cfg.note || "")).toLowerCase();
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
    }

    function clearSearch() {
      var input = document.getElementById("pg-search-input");
      if (input && input.value) input.value = "";
      searchState.query = "";
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
  // filters to its style and jumps to that group's section.
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
  }

  // The little orbiting logo in the header — the library demoing itself.
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
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!input.value.trim()) { exitIntro(); filter.syncSections(); return; }
      filter.applyQuery(input.value);
      exitIntro();
    });
    input.addEventListener("input", function () {
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
  // rides its head, so the mark IS the product: a path being traced.
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

  // The dashed "add your own" card at the end of the grid.
  function buildAddCard() {
    var el = document.createElement("section");
    el.className = "pg-card pg-add";
    el.innerHTML =
      "<h3>Add your own</h3>" +
      "<p>Copy any block in <code>animations/animations.js</code>, change " +
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
    var addCard = buildAddCard();
    addGrid.appendChild(addCard);
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
})();
