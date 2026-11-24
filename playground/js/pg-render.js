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
    // A measurement-path card in a hidden subtree would draw a 0x0 box;
    // queue it instead of rendering a broken animation.
    if (cfg.options && cfg.options.d && cfg.options.d.shape === "textBox" &&
        !card.stage.offsetWidth) {
      if (pendingMeasure.indexOf(card) < 0) pendingMeasure.push(card);
      return;
    }
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
