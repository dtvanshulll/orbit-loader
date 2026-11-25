/*!
 * DropdownLoader — the select menu, as a component: the panel drops
 * from the trigger while its border draws itself, items stagger in,
 * and select(i) draws a Lucide check beside the chosen row before
 * closing. Sibling style module, container-based. Needs only
 * orbit-loader.css; does NOT require orbit-loader.js.
 *
 * One-shot, triggered:
 *   dd.open();       // drop + border trace + items stagger in
 *   dd.select(2);    // check draws on row 2, then closes
 *   dd.close();
 *   dd.toggle();
 * start() runs the demo loop (open, rest, select, rest, close).
 *
 * The trigger button is built for you inside the container — click it
 * and the menu toggles. Flips upward automatically when there is no
 * room below (viewport edge, or a short preview stage).
 *
 * Usage:
 *   var dd = DropdownLoader.create(containerEl, {
 *     items: ['Small', 'Medium', 'Large'],
 *     trigger: 'Size',
 *     color: '#6a9bcc'
 *   });
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate the dropdown rooted at `el` (an element or selector
   * string — usually the trigger button). The menu panel is built as
   * a sibling positioned under the trigger.
   *
   * options:
   *   placement: "top" forces the menu to open upward (footer selectors
   *     near the bottom edge of a card); "bottom" forces it downward
   *     (preview stages, triggers near a container's top); default
   *     "auto" decides by measured space.
   *   items       (default ['Option 1', 'Option 2', 'Option 3'])
   *   trigger     (default 'Options') the trigger button's label
   *   durationMs  (default 320)  one open or close
   *   restMs      (default 1400) the demo loop's pause per state
   *   color       (default null) border/check color; omit for currentColor
   *   autoStart   (default true) run the demo loop immediately
   *
   * Reduced motion is checked once at creation: if set, the panel
   * snaps open and closed with no motion.
   */
  function create(el, options) {
    options = options || {};
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) throw new Error("DropdownLoader.create: trigger not found");
    var items = options.items || ["Option 1", "Option 2", "Option 3"];
    var durationMs = options.durationMs != null ? options.durationMs : 320;
    var restMs = options.restMs != null ? options.restMs : 1400;
    var color = options.color != null ? options.color : null;
    var autoStart = options.autoStart !== false;
    var placement = options.placement === "top" ? "top"
      : options.placement === "bottom" ? "bottom" : "auto";

    // The trigger: built here, so the component is self-contained —
    // the container just needs a position. Click toggles the menu.
    if (global.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }
    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "orbit-loader-dropdown-trigger";
    trigger.textContent = options.trigger != null ? options.trigger : "Options";
    // A dropdown trigger without a chevron doesn't read as a dropdown.
    // Lucide chevron-down, rotating 180° while the panel is open.
    var chevron = document.createElementNS(SVG_NS, "svg");
    chevron.setAttribute("class", "orbit-loader-dropdown-chevron");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("aria-hidden", "true");
    var chevPath = document.createElementNS(SVG_NS, "path");
    chevPath.setAttribute("d", "M6 9 L12 15 L18 9");
    chevron.appendChild(chevPath);
    trigger.appendChild(chevron);
    el.appendChild(trigger);
    trigger.addEventListener("click", function () { toggle(); });

    var panel = document.createElement("div");
    panel.className = "orbit-loader-dropdown-panel";
    var rows = [];
    for (var i = 0; i < items.length; i++) {
      var row = document.createElement("div");
      row.className = "orbit-loader-dropdown-row";
      row.textContent = items[i];
      // The check: Lucide `check` geometry, one stroke path per row,
      // drawn only when that row is selected.
      var check = document.createElementNS(SVG_NS, "svg");
      check.setAttribute("class", "orbit-loader-dropdown-check");
      check.setAttribute("viewBox", "0 0 24 24");
      check.setAttribute("aria-hidden", "true");
      var cp = document.createElementNS(SVG_NS, "path");
      cp.setAttribute("d", "M4 12 L9.5 17.5 L20 7");
      check.appendChild(cp);
      row.appendChild(check);
      panel.appendChild(row);
      rows.push(row);
      (function (idx) {
        row.addEventListener("click", function () { select(idx); });
      })(i);
    }
    // Inside the container, so the panel positions against it — a
    // sibling would position against the consumer's layout context.
    el.appendChild(panel);

    // The border trace: a rounded-rect path measured at open time.
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-loader-dropdown-trace");
    svg.setAttribute("aria-hidden", "true");
    var frame = document.createElementNS(SVG_NS, "path");
    frame.setAttribute("class", "orbit-loader-dropdown-frame");
    frame.style.strokeWidth = 2;
    if (color != null) frame.style.stroke = color;
    svg.appendChild(frame);
    panel.appendChild(svg);

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var isOpen = false;
    var selected = -1;
    var anims = [];
    var timer = null;
    var running = false;
    var phase = 0;

    function measureFrame() {
      var w = panel.clientWidth, h = panel.clientHeight;
      var inset = 1.5;
      var r = 8;
      var x = inset, y = inset;
      var iw = Math.max(1, w - inset * 2), ih = Math.max(1, h - inset * 2);
      r = Math.min(r, iw / 2, ih / 2);
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      var d = "M" + (x + r) + "," + y +
        " L" + (x + iw - r) + "," + y +
        " A" + r + "," + r + " 0 0 1 " + (x + iw) + "," + (y + r) +
        " L" + (x + iw) + "," + (y + ih - r) +
        " A" + r + "," + r + " 0 0 1 " + (x + iw - r) + "," + (y + ih) +
        " L" + (x + r) + "," + (y + ih) +
        " A" + r + "," + r + " 0 0 1 " + x + "," + (y + ih - r) +
        " L" + x + "," + (y + r) +
        " A" + r + "," + r + " 0 0 1 " + (x + r) + "," + y;
      frame.setAttribute("d", d);
      return frame.getTotalLength ? frame.getTotalLength() : 1;
    }

    /** Open: the panel drops in — or flips up when there's no room
        below (edge of viewport, or a short preview stage) — its
        border traces, items stagger. */
    function open() {
      if (isOpen) return;
      isOpen = true;
      trigger.classList.add("tl-open");
      // Flip decision: measure the panel's natural height against the
      // space below the trigger. A hidden panel has no height, so
      // measure it visibly for one frame first.
      panel.style.visibility = "hidden";
      panel.classList.add("tl-open");
      var ph = panel.offsetHeight;
      var triggerBottom = trigger.getBoundingClientRect().bottom;
      // Flip decision: a container that tightly wraps the trigger has no
      // meaningful "room below" (it IS the trigger's box), so fall back to
      // the viewport in that case. Real stages keep their own measurement.
      var hostBottom = el.getBoundingClientRect().bottom;
      var limit = (el.getBoundingClientRect().height > trigger.offsetHeight + 48)
        ? hostBottom
        : (global.innerHeight || hostBottom);
      var roomBelow = limit - triggerBottom - 6;
      var flipUp = placement === "top" ||
        (placement !== "bottom" && ph > roomBelow);
      panel.classList.toggle("tl-up", flipUp);
      // Anchor the panel to the TRIGGER's edge, not the container's —
      // the container may be much taller than the trigger.
      if (flipUp) {
        panel.style.top = "auto";
        panel.style.bottom = (el.clientHeight - trigger.offsetTop + 6) + "px";
      } else {
        panel.style.bottom = "auto";
        panel.style.top = (trigger.offsetTop + trigger.offsetHeight + 6) + "px";
      }
      panel.style.visibility = "";
      if (reducedMotion) return;
      var total = measureFrame();
      frame.style.opacity = 1;
      var a = frame.animate(
        [{ strokeDasharray: "0 " + total }, { strokeDasharray: total + " 0" }],
        { duration: durationMs + 160, easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "forwards" }
      );
      anims.push(a);
      // Items stagger in from the top — the panel is a list, so the
      // reveal reads top-down.
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.style.opacity = 0;
        row.style.transform = "translateY(-4px)";
        var ra = row.animate(
          [{ opacity: 0, transform: "translateY(-4px)" },
           { opacity: 1, transform: "translateY(0)" }],
          { duration: durationMs * 0.6, delay: 60 + i * 55,
            easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "forwards" }
        );
        anims.push(ra);
      }
    }

    /** Close: the panel retracts upward. */
    function close() {
      if (!isOpen) return;
      isOpen = false;
      trigger.classList.remove("tl-open");
      if (reducedMotion) {
        panel.classList.remove("tl-open");
        return;
      }
      panel.classList.remove("tl-open");
      trigger.classList.remove("tl-open");
      frame.style.opacity = 0;
    }

    /** Select row i: its check draws, then the menu closes. */
    function select(i) {
      if (!isOpen) return; // a closed menu has no rows to select — same
                           // guard open()/close() carry
      if (i < 0 || i >= rows.length) return;
      selected = i;
      var cp = rows[i].querySelector(".orbit-loader-dropdown-check path");
      rows.forEach(function (r, ri) {
        r.classList.toggle("is-selected", ri === i);
        var p = r.querySelector(".orbit-loader-dropdown-check path");
        if (ri !== i) p.style.opacity = 0;
      });
      if (reducedMotion) { global.setTimeout(close, 120); return; }
      var len = cp.getTotalLength ? cp.getTotalLength() : 20;
      cp.style.opacity = 1;
      cp.style.strokeDasharray = len + " " + len;
      cp.style.strokeDashoffset = len;
      var a = cp.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 220, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
      );
      anims.push(a);
      global.setTimeout(close, 380);
    }

    /** Toggle — the common case for a trigger button. */
    function toggle() { if (isOpen) close(); else open(); }

    /** The selected index, or -1. */
    function value() { return selected; }

    // Demo loop: open, rest, select the middle row, rest, close.
    function demoStep() {
      phase = (phase + 1) % 4;
      if (phase === 1) open();
      else if (phase === 2) select(Math.floor(items.length / 2));
      else if (phase === 0) close();
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      timer = global.setInterval(demoStep, durationMs + restMs / 2);
    }

    function stop() {
      running = false;
      if (timer != null) { global.clearInterval(timer); timer = null; }
    }

    function destroy() {
      stop();
      for (var i = 0; i < anims.length; i++) anims[i].cancel();
      anims = [];
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      if (trigger && trigger.parentNode) trigger.parentNode.removeChild(trigger);
    }

    function isRunning() { return running; }

    if (autoStart) start();

    return {
      el: el,
      trigger: trigger,
      panel: panel,
      frame: frame,
      open: open,
      close: close,
      toggle: toggle,
      select: select,
      value: value,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: isRunning
    };
  }

  global.DropdownLoader = {
    create: create,
    wrap: create
  };
})(window);
