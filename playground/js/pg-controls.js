/*!
 * pg-controls — generated tuning controls per animation option. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var RANGES = PG.RANGES;
  var LETTER_SHAPES = PG.LETTER_SHAPES;
  var render = PG.render;
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
    // Every control redraws the stage AND refreshes the Usage snippet —
    // the code block must always show what the card now does, not what
    // it did at page load.
    var redraw = function () {
      render(card);
      if (card.snippet) card.snippet.textContent = PG.buildSnippet(card);
    };

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
        // Two value families share the option name: the loopers crawl
        // forward/reverse, the route transition travels left/right/up/
        // down. Offer the family the card's current value belongs to.
        var values = ["left", "right", "up", "down"].indexOf(value) >= 0
          ? ["left", "right", "up", "down"]
          : ["forward", "reverse"];
        var sel = document.createElement("select");
        values.forEach(function (d) {
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
        // `key` is one function-scoped binding shared by every iteration
        // — a closure over it would make every slider write the LAST
        // option (they all did: tuning strokeWidth set guideOpacity).
        // Capture the key per iteration.
        (function (k, label) {
          var num = numInput(value, r[0], r[1], r[2], function (v) { opts[k] = v; redraw(); });
          grid.appendChild(field(label, num));
        })(key, key);
        continue;
      }
    }
    return grid;
  }

  PG.buildControls = buildControls;
})(typeof window !== "undefined" ? window : this);
