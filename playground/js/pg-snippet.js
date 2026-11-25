/*!
 * pg-snippet — standalone snippet + config-block generation, clipboard. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var GLOBALS = PG.GLOBALS;
  var CONTAINER_STYLES = PG.CONTAINER_STYLES;
  var OBJECT_SHAPES = PG.OBJECT_SHAPES;
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

  // Scenes copy as a short recipe: one create/wrap call per animated
  // part, selectors matching the mockup's own class names.
  function sceneSnippet(cfg) {
    var globals = [];
    for (var i = 0; i < cfg.parts.length; i++) {
      var g = GLOBALS[cfg.parts[i].style];
      if (globals.indexOf(g) < 0) globals.push(g);
    }
    var lines = ["import { " + globals.join(", ") + " } from 'traceloop';", ""];
    for (var p = 0; p < cfg.parts.length; p++) {
      var part = cfg.parts[p];
      var g = GLOBALS[part.style];
      var fn = CONTAINER_STYLES[part.style] ? ".create(" : ".wrap(";
      var sel = part.el ? "document.querySelector('" + part.el + "')" : "element";
      lines.push(g + fn + sel + ", {");
      var opts = part.options || {};
      var argLines = [];
      for (var k in opts) {
        if (!Object.prototype.hasOwnProperty.call(opts, k)) continue;
        if (k === "d" || k === "guideD" || k === "viewBox") {
          if (k === "d" && typeof opts.d === "string") argLines.push("  d: " + JSON.stringify(opts.d) + ",");
          if (k === "viewBox") argLines.push("  viewBox: " + JSON.stringify(opts.viewBox) + ",");
          continue;
        }
        var v = opts[k];
        argLines.push("  " + k + ": " + (typeof v === "number" || typeof v === "boolean" ? v : JSON.stringify(v)) + ",");
      }
      if (argLines.length) {
        var last = argLines[argLines.length - 1];
        argLines[argLines.length - 1] = last.replace(/,\s*$/, "");
        for (var li = 0; li < argLines.length; li++) lines.push(argLines[li]);
      }
      lines.push("});");
      if (p < cfg.parts.length - 1) lines.push("");
    }
    return lines.join("\n");
  }

  function buildSnippet(card) {
    var cfg = card.cfg;
    if (cfg.parts) return sceneSnippet(cfg);
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

  function buildConfigBlock(card) {
    var cfg = JSON.parse(JSON.stringify(card.cfg));
    delete cfg._viewBox;
    return JSON.stringify(cfg, null, 2).replace(/^\[/, "[").replace(/\]$/, "]");
  }

  function copy(text, btn) {
    var done = function () {
      btn.innerHTML = PG.ICON_CHECK;
      btn.setAttribute("aria-label", "Copied");
      btn.classList.add("pg-copied");
      setTimeout(function () {
        btn.innerHTML = PG.ICON_COPY;
        btn.setAttribute("aria-label", btn.dataset.label);
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

  PG.buildSnippet = buildSnippet;
  PG.buildConfigBlock = buildConfigBlock;
  PG.copy = copy;
})(typeof window !== "undefined" ? window : this);
