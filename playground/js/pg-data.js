/*
 * TraceLoop Playground — renders every animation defined in
 * animations/ as a live, editable card.
 *
 * The old single playground.js grew past the 400-line ceiling, so it is
 * now plain-script modules sharing one window.PG namespace, loaded in
 * order by index.html:
 *
 *   pg-data.js      constant tables (this file)
 *   pg-render.js    config to live animation, lazy activation
 *   pg-snippet.js   snippet/config generation + clipboard
 *   pg-controls.js  generated tuning controls
 *   pg-card.js      card assembly
 *   pg-filter.js    style filter, live search, intro/catalog switch
 *   pg-nav.js       sidebar drawer, section jump, scrollspy
 *   pg-mark.js      header mark, hero instrument, reveal-on-scroll
 *   pg-sections.js  section registry + headings
 *   pg-main.js      init and boot
 *
 * No dependencies, no build step — same rules as the library itself.
 */
(function (global) {
  "use strict";
  var PG = global.PG = global.PG || {};
  var GLOBALS = { orbit: "OrbitLoader", dot: "DotLoader", shimmer: "ShimmerLoader", ripple: "RippleLoader", pulse: "PulseLoader", chase: "ChaseLoader", typing: "TypingLoader", handshake: "HandshakeLoader", tab: "TabLoader", page: "PageLoader", button: "ButtonLoader", toast: "ToastLoader", progress: "ProgressLoader", search: "SearchLoader", modal: "ModalLoader", accordion: "AccordionLoader", drawer: "DrawerLoader", dropdown: "DropdownLoader", input: "InputLoader", swap: "SwapLoader", countup: "CountUpLoader", shake: "ShakeLoader", shuffle: "ShuffleLoader", route: "RouteLoader" };
  // Container-based styles: no path to trace, create() takes the box.
  var CONTAINER_STYLES = { ripple: 1, pulse: 1, typing: 1, tab: 1, page: 1, button: 1, toast: 1, search: 1, modal: 1, accordion: 1, drawer: 1, dropdown: 1, input: 1, swap: 1, countup: 1, shake: 1, shuffle: 1, route: 1 };
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
    exitMs: [80, 800, 10],
    distance: [2, 30, 1],
    collapsedWidth: [24, 80, 4],
    expandedWidth: [120, 400, 10]
  };
  var LETTER_SHAPES = { letter: 1, letterOutline: 1 };

  // The cards container every module shares; scripts load at the end of
  // <body>, so the element exists by the time this runs.
  PG.cardsEl = document.getElementById("cards");

  // Copy-button icon states — Lucide geometry (24x24, stroke 2, round
  // caps). Static strings authored in-repo, so innerHTML is safe here.
  PG.ICON_COPY = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  PG.ICON_CHECK = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  PG.ICON_CHEVRON = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  PG.GLOBALS = GLOBALS;
  PG.CONTAINER_STYLES = CONTAINER_STYLES;
  PG.OBJECT_SHAPES = OBJECT_SHAPES;
  PG.RANGES = RANGES;
  PG.LETTER_SHAPES = LETTER_SHAPES;
})(typeof window !== "undefined" ? window : this);
