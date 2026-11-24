/*!
 * pg-render — config to live animation: path resolution, box build, render. Part of the old playground.js, split under the 400-line ceiling;
 * see pg-data.js for the module map.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var GLOBALS = PG.GLOBALS;
  var CONTAINER_STYLES = PG.CONTAINER_STYLES;

  // Cards whose path needs a real measurement (textBox) can't be drawn
  // while they're hidden — the intro keeps the whole catalog display:none
  // at init, and a hidden element measures 0x0, which collapses the box
  // to nothing. Those cards queue here and re-render the moment the
  // catalog becomes visible (exitIntro calls PG.renderPending()).
  var pendingMeasure = [];

  // Turn a `d` recipe into { d, guideD, viewBox }. "textBox" is resolved
  // against the animation's own box element (it measures real layout).
  // Scene parts pass bare d strings (underline rules, icon outlines)
  // with no viewBox; without one the svg falls back to 0 0 100 100 and
  // the path renders as a sliver. Measure the path once and frame it.
  function viewBoxOf(d, host) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = "position:absolute;left:-9999px;top:0;width:10px;height:10px;overflow:visible";
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    host.appendChild(svg);
    var b = p.getBBox();
    host.removeChild(svg);
    var pad = 4;
    return "" + (b.x - pad) + " " + (b.y - pad) + " " + (b.width + pad * 2) + " " + (b.height + pad * 2);
  }

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
    if (box.styleCss) s.push(box.styleCss);
    if (box.boxShadow) s.push("box-shadow:" + box.boxShadow);
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
    // A measurement-path card in a hidden subtree would draw a 0x0 box;
    // queue it instead of rendering a broken animation. Scene cards need
    // the same deferral: their d-based parts measure the path bbox for a
    // viewBox, and getBBox sees nothing inside display:none.
    var needsMeasure = (cfg.options && cfg.options.d &&
        cfg.options.d.shape === "textBox") || !!cfg.parts;
    if (needsMeasure && !card.stage.offsetWidth) {
      if (pendingMeasure.indexOf(card) < 0) pendingMeasure.push(card);
      return;
    }
    if (card.controller) card.controller.destroy();
    card.stage.innerHTML = "";
    var boxEl = buildBox(cfg.box || {});
    card.stage.appendChild(boxEl);
    // Scene configs animate a whole component mockup: several loaders,
    // each bound to one element inside box.html via part.el.
    if (cfg.parts) {
      card.controller = buildScene(cfg, boxEl);
      card.resolved = null;
      return;
    }
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

  // Build a scene: one controller per part, wrapped in a composite so
  // the rest of the playground (destroy on re-render, filters) treats
  // it exactly like a single-style card.
  function buildScene(cfg, boxEl) {
    var parts = cfg.parts || [];
    var controllers = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var target = part.el ? boxEl.querySelector(part.el) : boxEl;
      if (!target) continue;
      var src = part.options || {};
      var opts = {};
      for (var k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) opts[k] = src[k];
      }
      // A part may ask for a static fill (data-table bars, meters):
      // skip the demo loop; the fraction is painted once after create.
      if (opts.to != null) opts.autoStart = false;
      var c;
      if (CONTAINER_STYLES[part.style]) {
        c = window[GLOBALS[part.style]].create(target, opts);
      } else {
        var resolved = resolveD(opts.d, target);
        opts.d = resolved.d;
        if (resolved.guideD) opts.guideD = resolved.guideD;
        if (resolved.viewBox) opts.viewBox = resolved.viewBox;
        else if (opts.d && opts.viewBox == null) opts.viewBox = viewBoxOf(opts.d, boxEl);
        c = window[GLOBALS[part.style]].wrap(target, opts);
      }
      controllers.push(c);
      if (opts.to != null && c.setProgress) c.setProgress(opts.to);
    }
    return {
      destroy: function () {
        for (var i = controllers.length - 1; i >= 0; i--) {
          try { controllers[i].destroy(); } catch (e) { /* already gone */ }
        }
      },
      isRunning: function () {
        for (var i = 0; i < controllers.length; i++) {
          if (controllers[i].isRunning && controllers[i].isRunning()) return true;
        }
        return false;
      }
    };
  }

  PG.resolveD = resolveD;
  PG.buildBox = buildBox;
  PG.render = render;
  // Re-render every card that was queued while hidden. Safe to call any
  // time — cards still hidden simply re-queue.
  PG.renderPending = function () {
    var list = pendingMeasure;
    pendingMeasure = [];
    for (var i = 0; i < list.length; i++) render(list[i]);
  };
})(typeof window !== "undefined" ? window : this);
