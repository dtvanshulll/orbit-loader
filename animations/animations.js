/*!
 * OrbitLoader — ANIMATION CONFIGS
 * ================================
 *
 * This ONE file drives the whole playground (playground/index.html).
 * Every animation is a block in the list below: the name is its heading,
 * and `options` holds whatever customization that style supports.
 *
 * To add your own animation: copy any block, paste it at the end of the
 * list, change `name`, `style` and `options`. Save, refresh the
 * playground — your animation appears, fully editable, with a
 * "Copy code" button that gives you the standalone snippet.
 *
 * style:    "orbit"   — glowing segment chases a path   (OrbitLoader)
 *           "dot"     — a dot travels the path          (DotLoader)
 *           "shimmer" — filled band + light through it  (ShimmerLoader)
 *           "ripple"  — concentric rings grow & fade    (RippleLoader)
 *
 * `d` (except for ripple) is either a raw path string or a shape recipe:
 *     d: { shape: "circle", args: [72] }
 * Supported shapes: roundedSquare, roundRect, circle, underline,
 * infinity, letter, letterOutline, text, textBox.
 * letter / letterOutline take ONE character (A-Z, 0-9) — the playground
 * gives you a box to type it. text takes a word (A-Z 0-9 space).
 * textBox measures the animation's own box: args = [padding, radius].
 *
 * `note` is the one-line description shown under the card heading.
 * `box` styles the preview container the animation is drawn on.
 */
window.ORBIT_ANIMATIONS = [

  {
    name: "Logo Box",
    style: "orbit",
    note: "The original: a glowing segment chasing the edge of an app-icon tile",
    // A stroke icon, not an emoji: the same Lucide geometry every style animates.
    box: { width: 84, height: 84, background: "#1a1a1e", borderRadius: 24, html: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#d8dce4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.296 3.464l3.02 3.956M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3zM3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm3.18-5.724l3.1 3.899"/></svg>' },
    options: {
      d: { shape: "roundedSquare", args: [84, 24] },
      viewBox: "0 0 84 84",
      durationMs: 2200
    }
  },

  {
    name: "Orbit Ring",
    style: "orbit",
    note: "A circle with an inset gap, so the segment never touches the edge",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "circle", args: [72] },
      viewBox: "0 0 72 72",
      durationMs: 1600,
      offset: 6,
      strokeWidth: 3.5,
      color: "#e8355c",
      guideOpacity: 0.35
    }
  },

  {
    name: "Underline Sweep",
    style: "orbit",
    note: "A progress line sweeping back and forth under content",
    box: { width: 120, height: 16 },
    options: {
      d: { shape: "underline", args: [120, 3] },
      viewBox: "0 0 120 12",
      durationMs: 1600,
      segmentFraction: 0.4,
      direction: "reverse",
      strokeWidth: 3,
      color: "#ffd54a",
      guideOpacity: 0.3
    }
  },

  {
    name: "Letter Trace",
    style: "orbit",
    note: "The crawler rides the OUTER silhouette of a letter \u2014 type any letter",
    box: { width: 48, height: 80 },
    options: {
      d: { shape: "letterOutline", args: ["A", 80] },
      durationMs: 2800,
      segmentFraction: 0.45,
      guideOpacity: 0.35
    }
  },

  {
    name: "Letter Crawl",
    style: "orbit",
    note: "The crawler rides the pen stroke inside a letter \u2014 type any letter",
    box: { width: 48, height: 80 },
    options: {
      d: { shape: "letter", args: ["S", 80] },
      durationMs: 2000,
      segmentFraction: 0.3,
      guideOpacity: 0.35
    }
  },

  {
    name: "Alphabet Run",
    style: "orbit",
    note: "The line crawls A to Z in order \u2014 type any word or sequence",
    box: { width: 462, height: 20, background: "#14141a", border: "1px solid #2a2a30", borderRadius: 6 },
    options: {
      d: { shape: "text", args: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 20, 6] },
      durationMs: 9000,
      segmentFraction: 0.12,
      color: "#d8dce4",
      guideOpacity: 0.3
    }
  },

  {
    name: "Silver Infinity",
    style: "shimmer",
    note: "Light sweeping through an infinity band on black",
    box: { width: 120, height: 60, background: "#000", border: "1px solid #3a3a44", borderRadius: 16 },
    options: {
      d: { shape: "infinity", args: [120] },
      viewBox: "0 0 120 60",
      durationMs: 2400,
      bandWidth: 10,
      bandOpacity: 0.5,
      color: "#d8dce4"
    }
  },

  {
    name: "Gold Dot",
    style: "dot",
    note: "A single gold bead orbiting a faint circle",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "circle", args: [72] },
      viewBox: "0 0 72 72",
      durationMs: 1600,
      color: "#ffd54a",
      dotRadius: 4,
      guideOpacity: 0.35
    }
  },

  {
    name: "Loading Box",
    style: "orbit",
    note: "The outline is measured from real text at runtime \u2014 any label works",
    box: { padding: "10px 14px", fontSize: 20, fontWeight: 600, content: "Loading\u2026" },
    options: {
      d: { shape: "textBox", args: [8, 10] },
      offset: 8,
      durationMs: 2600,
      guideOpacity: 0.35
    }
  },

  {
    name: "Triangle Orbit",
    style: "orbit",
    note: "A sharp triangle from the new polygon() shape \u2014 any n-gon works",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "polygon", args: [3, 72] },
      viewBox: "0 0 72 72",
      durationMs: 1800,
      strokeWidth: 3,
      color: "#e8355c",
      guideOpacity: 0.35
    }
  },

  {
    name: "Typing Dots",
    style: "typing",
    note: "The chat indicator: dots take turns rising and falling",
    box: { width: 110, height: 44 },
    options: {
      dots: 3,
      durationMs: 1000,
      staggerMs: 180,
      color: "#e8355c"
    }
  },

  {
    name: "Ripple",
    style: "ripple",
    note: "Rings are born at the center, grow outward and fade \u2014 calm and sparse",
    box: { width: 72, height: 72 },
    options: {
      rings: 3,
      durationMs: 1800,
      strokeWidth: 4,
      color: "#e8355c"
    }
  },

  {
    name: "Concentric Pulse",
    style: "ripple",
    note: "Dense rings chasing each other outward \u2014 reads as unlimited circles",
    box: { width: 96, height: 96 },
    options: {
      rings: 6,
      durationMs: 2400,
      strokeWidth: 3,
      color: "#5b8cff"
    }
  },

  {
    name: "Square Orbit",
    style: "orbit",
    note: "The classic logo box, traced with rounded corners",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "roundedSquare", args: [72, 12] },
      viewBox: "0 0 72 72",
      durationMs: 2000,
      strokeWidth: 3,
      color: "#e8355c",
      guideOpacity: 0.35
    }
  },

  {
    name: "Pentagon Trace",
    style: "orbit",
    note: "Five sharp corners from polygon(5) \u2014 any n-gon, one call",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "polygon", args: [5, 72] },
      viewBox: "0 0 72 72",
      durationMs: 1800,
      strokeWidth: 3,
      color: "#5b8cff",
      guideOpacity: 0.35
    }
  },

  {
    name: "Radar Tick",
    style: "orbit",
    note: "One short bold dash sprinting the circle \u2014 radar sweep energy",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "circle", args: [72] },
      viewBox: "0 0 72 72",
      durationMs: 1000,
      segmentFraction: 0.08,
      strokeWidth: 5,
      color: "#ffffff",
      guideOpacity: 0.3
    }
  },

  {
    name: "Solar System",
    style: "dot",
    note: "Three dots in formation on one orbit \u2014 the dots option at work",
    box: { width: 84, height: 84 },
    options: {
      d: { shape: "circle", args: [84] },
      viewBox: "0 0 84 84",
      durationMs: 2600,
      dots: 3,
      dotRadius: 3,
      color: "#5b8cff",
      guideOpacity: 0.35
    }
  },

  {
    name: "Bee Line",
    style: "dot",
    note: "Four gold dots shuttling back and forth along a line",
    box: { width: 160, height: 16 },
    options: {
      d: { shape: "underline", args: [160, 4] },
      viewBox: "0 0 160 12",
      durationMs: 2000,
      direction: "reverse",
      dots: 4,
      dotRadius: 3.5,
      color: "#ffd54a",
      guideOpacity: 0.3
    }
  },

  {
    name: "Glass Ring",
    style: "shimmer",
    note: "A translucent glass ring with light sweeping around inside it",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "circle", args: [72] },
      viewBox: "0 0 72 72",
      durationMs: 2000,
      bandWidth: 8,
      bandOpacity: 0.2,
      strokeWidth: 2.5,
      color: "#5b8cff"
    }
  },

  {
    name: "Card Shimmer",
    style: "shimmer",
    note: "A skeleton card outline \u2014 the loading-skeleton look, but alive",
    box: { width: 140, height: 40 },
    options: {
      d: { shape: "roundRect", args: [140, 40, 20] },
      viewBox: "0 0 140 40",
      durationMs: 2400,
      bandWidth: 8,
      bandOpacity: 0.25,
      color: "#d8dce4"
    }
  },

  {
    name: "Slow Pond",
    style: "ripple",
    note: "Two wide calm rings \u2014 a stone dropped in water, on loop",
    box: { width: 96, height: 96 },
    options: {
      rings: 2,
      durationMs: 3200,
      startScale: 0.2,
      strokeWidth: 4,
      color: "#34d399"
    }
  },

  {
    name: "Word Orbit",
    style: "orbit",
    note: "A whole word as one path \u2014 type anything into the word box",
    box: { width: 106, height: 30 },
    options: {
      d: { shape: "text", args: ["ORBIT", 30, 4] },
      durationMs: 4000,
      segmentFraction: 0.35,
      color: "#d8dce4",
      guideOpacity: 0.35
    }
  },

  {
    name: "Typing Crowd",
    style: "typing",
    note: "Five dots, tightly staggered \u2014 a busy group chat",
    box: { width: 130, height: 44 },
    options: {
      dots: 5,
      durationMs: 900,
      staggerMs: 140,
      color: "#e8355c"
    }
  },

  {
    name: "Metronome",
    style: "orbit",
    note: "The crawler doesn't glide \u2014 it ticks between twelve positions",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "circle", args: [72] },
      viewBox: "0 0 72 72",
      durationMs: 2400,
      steps: 12,
      strokeWidth: 3.5,
      color: "#ffffff",
      guideOpacity: 0.3
    }
  },

  {
    name: "Breathing Outline",
    style: "orbit",
    note: "The traced shape inhales and exhales while the crawler rides it",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "roundedSquare", args: [72, 16] },
      viewBox: "0 0 72 72",
      durationMs: 2200,
      breathe: 0.6,
      breatheMs: 1600,
      strokeWidth: 2.5,
      color: "#e8355c",
      guideOpacity: 0.35
    }
  },

  {
    name: "Moth",
    style: "dot",
    note: "The dot flutters toward and away from the path, along its normal",
    box: { width: 84, height: 84 },
    options: {
      d: { shape: "circle", args: [84] },
      viewBox: "0 0 84 84",
      durationMs: 2400,
      wobble: 6,
      wobbleCycles: 3,
      dotRadius: 3,
      color: "#5b8cff",
      guideOpacity: 0.35
    }
  },

  {
    name: "Breadcrumbs",
    style: "dot",
    note: "A trail of dying footprints follows the dot along the infinity",
    box: { width: 120, height: 60 },
    options: {
      d: { shape: "infinity", args: [120] },
      viewBox: "0 0 120 60",
      durationMs: 2600,
      trail: 10,
      dotRadius: 3.5,
      color: "#ffd54a",
      guideOpacity: 0.3
    }
  },

  {
    name: "Relay",
    style: "dot",
    note: "Six dots on the track, one baton \u2014 the light passes dot to dot",
    box: { width: 84, height: 84 },
    options: {
      d: { shape: "circle", args: [84] },
      viewBox: "0 0 84 84",
      durationMs: 2400,
      dots: 6,
      relay: true,
      dotRadius: 3.5,
      color: "#e8355c",
      guideOpacity: 0.35
    }
  },

  {
    name: "Crossing Ghosts",
    style: "dot",
    note: "Two runners, opposite directions, flashing every time they pass",
    box: { width: 84, height: 84 },
    options: {
      d: { shape: "roundedSquare", args: [84, 18] },
      viewBox: "0 0 84 84",
      durationMs: 2600,
      crossing: true,
      dotRadius: 3,
      color: "#d8dce4",
      guideOpacity: 0.35
    }
  },

  {
    name: "Handshake",
    style: "handshake",
    note: "Two segments cross the square, flash where they meet, retract",
    box: { width: 72, height: 72 },
    options: {
      d: { shape: "roundedSquare", args: [72, 12] },
      viewBox: "0 0 72 72",
      durationMs: 2400,
      color: "#e8355c",
      guideOpacity: 0.35
    }
  },

  {
    name: "Tab Crawl",
    style: "tab",
    note: "The tab underline crawls to the tab you clicked, stretchy and alive",
    box: { width: 220, height: 48, color: "#eceef2", padding: "12px 8px" },
    options: {
      labels: ["Home", "Files", "Shared", "Settings"],
      durationMs: 700,
      restMs: 1500,
      color: "#e8355c"
    }
  },

  {
    name: "Page Traverse",
    style: "page",
    note: "The top progress bar trickles while a page loads, then sweeps done and fades",
    box: { width: 220, height: 110, background: "#1c1c22", borderRadius: 8 },
    options: {
      thickness: 3,
      durationMs: 2600,
      restMs: 1400,
      color: "#5b8cff"
    }
  },

  {
    name: "Button Trace",
    style: "button",
    note: "While the action pends, the button's own border is the progress track; it lights green on success",
    box: {
      width: 150,
      height: 44,
      background: "#26262d",
      borderRadius: 8,
      content: "Save changes",
      fontSize: 14,
      color: "#eceef2"
    },
    options: {
      radius: 8,
      durationMs: 1100,
      color: "#e8355c"
    }
  },

  {
    name: "Toast Countdown",
    style: "toast",
    note: "The toast's remaining lifetime drains along its bottom edge. No number needed.",
    box: {
      width: 220,
      height: 52,
      background: "#1c1c22",
      borderRadius: 8,
      content: "File uploaded",
      fontSize: 13,
      color: "#eceef2",
      padding: "14px 16px"
    },
    options: {
      thickness: 3,
      durationMs: 3200,
      restMs: 1200,
      color: "#ffd54a"
    }
  },

  {
    name: "Path Progress",
    style: "progress",
    note: "Determinate progress that traces any path: here a circle filling toward 100%",
    box: { width: 96, height: 96 },
    options: {
      d: { shape: "circle", args: [96] },
      viewBox: "0 0 96 96",
      strokeWidth: 2.5,
      headRadius: 3,
      color: "#5b8cff",
      guideOpacity: 0.3
    }
  },

  {
    name: "Search Bar",
    style: "search",
    note: "The field widens while its underline draws out from the left: open and close in one motion",
    box: { width: 260, height: 56, background: "#1c1c22", borderRadius: 8, color: "#eceef2" },
    options: {
      collapsedWidth: 44,
      expandedWidth: 260,
      durationMs: 450,
      restMs: 1400,
      color: "#5b8cff"
    }
  },

  {
    name: "Modal Arrival",
    style: "modal",
    note: "The backdrop fades, the panel rises, and its border draws itself on arrival",
    box: { width: 220, height: 130, background: "#1c1c22", borderRadius: 12, padding: "16px" },
    options: {
      radius: 12,
      durationMs: 480,
      restMs: 1600,
      color: "#e8355c",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Accordion Reveal",
    style: "accordion",
    note: "The section grows while its left edge draws downward, so the eye follows the reveal",
    box: { width: 200, height: 120, background: "#1c1c22", borderRadius: 8 },
    options: {
      durationMs: 420,
      restMs: 1500,
      color: "#34d399"
    }
  },

  {
    name: "Drawer From Left",
    style: "drawer",
    note: "The panel slides in while its leading edge draws downward, and the eye rides the reveal",
    box: { position: "absolute", top: 16, bottom: 16, left: 16, width: 110, background: "#1c1c22", borderRadius: "0 8px 8px 0", color: "#5b8cff" },
    options: {
      side: "left",
      durationMs: 420,
      restMs: 1600,
      color: "#5b8cff",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Drawer From Right",
    style: "drawer",
    note: "Same reveal, mirrored: settings panels and carts usually live on this side",
    box: { position: "absolute", top: 16, bottom: 16, right: 16, width: 110, background: "#1c1c22", borderRadius: "8px 0 0 8px", color: "#5b8cff" },
    options: {
      side: "right",
      durationMs: 420,
      restMs: 1600,
      color: "#5b8cff",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Bottom Sheet",
    style: "drawer",
    note: "The sheet rises while its top edge draws across, finishing with a grab handle",
    box: { position: "absolute", left: 16, right: 16, bottom: 16, height: 64, background: "#1c1c22", borderRadius: "12px 12px 0 0", color: "#ffd54a" },
    options: {
      side: "bottom",
      durationMs: 440,
      restMs: 1600,
      color: "#ffd54a",
      backdropPosition: "absolute"
    }
  },

  {
    name: "Dropdown Menu",
    style: "dropdown",
    note: "The menu drops while its border draws, items stagger in, and a check draws on the chosen row",
    box: { width: 200, height: 196, background: "#1c1c22", borderRadius: 8, padding: "16px", color: "#5b8cff" },
    options: {
      items: ["Small", "Medium", "Large"],
      trigger: "Size",
      durationMs: 320,
      restMs: 1400,
      color: "#5b8cff"
    }
  },

  {
    name: "Input Focus",
    style: "input",
    note: "The underline draws as the label floats up; success hands the line to mint and draws a check",
    box: { width: 220, height: 56, background: "#1c1c22", borderRadius: 8, padding: "14px 12px 12px", color: "#5b8cff" },
    options: {
      label: "Email",
      durationMs: 360,
      restMs: 1500,
      color: "#5b8cff"
    }
    }
,

  {
    name: "Page Curtain",
    style: "page",
    note: "Two panels close from the corners like theater curtains, then part to reveal the page",
    box: { width: 220, height: 110, background: "#1c1c22", borderRadius: 8 },
    options: {
      variant: "curtain",
      durationMs: 2600,
      restMs: 1400,
      color: "#5b8cff"
    }
  },

  {
    name: "Page Iris",
    style: "page",
    note: "A circle wipes open from the center of the page and closes back to nothing",
    box: { width: 220, height: 110, background: "#1c1c22", borderRadius: 8 },
    options: {
      variant: "iris",
      durationMs: 2600,
      restMs: 1400,
      color: "#e8355c"
    }
  },

  {
    name: "Page Slide",
    style: "page",
    note: "One panel sweeps fully across the page and off the far edge",
    box: { width: 220, height: 110, background: "#1c1c22", borderRadius: 8 },
    options: {
      variant: "slide",
      durationMs: 2600,
      restMs: 1400,
      color: "#ffd54a"
    }
  },

  {
    name: "Page Bars",
    style: "page",
    note: "Five vertical bars stagger down in sequence, then stagger away",
    box: { width: 220, height: 110, background: "#1c1c22", borderRadius: 8 },
    options: {
      variant: "bars",
      durationMs: 2600,
      restMs: 1400,
      color: "#cfc0f5"
    }
  },

  {
    name: "Button Fill",
    style: "button",
    note: "A color fill sweeps across while the action runs, then drains away on success",
    box: { width: 150, height: 44, background: "#26262d", borderRadius: 8, content: "Save changes", fontSize: 14, color: "#eceef2" },
    options: {
      variant: "fill",
      durationMs: 1100,
      color: "#ffd54a"
    }
  },

  {
    name: "Button Ripple",
    style: "button",
    note: "A circle ripples out from the press point. Click the button to feel it.",
    box: { width: 150, height: 44, background: "#26262d", borderRadius: 8, content: "Press me", fontSize: 14, color: "#eceef2" },
    options: {
      variant: "ripple",
      durationMs: 1100,
      color: "#e8355c"
    }
  },

  {
    name: "Toast Bar",
    style: "toast",
    note: "An inset countdown bar with a faint track drops in and drains. Hovering pauses it.",
    box: { width: 220, height: 52, background: "#1c1c22", borderRadius: 8, content: "File uploaded", fontSize: 13, color: "#eceef2", padding: "14px 16px" },
    options: {
      variant: "bar",
      enter: "drop",
      durationMs: 3200,
      restMs: 1200,
      color: "#34d399"
    }
  },

  {
    name: "Toast Ring",
    style: "toast",
    note: "A ring in the corner drains clockwise while the toast pops in",
    box: { width: 220, height: 52, background: "#1c1c22", borderRadius: 8, content: "Scheduled for 9:00", fontSize: 13, color: "#eceef2", padding: "14px 16px" },
    options: {
      variant: "ring",
      enter: "pop",
      durationMs: 3200,
      restMs: 1200,
      color: "#5b8cff"
    }
  },

  {
    name: "Progress Ring",
    style: "progress",
    note: "A circular ring fills toward 100% with the head dot riding the frontier",
    box: { width: 96, height: 96 },
    options: {
      variant: "ring",
      size: 64,
      strokeWidth: 3,
      headRadius: 3.5,
      color: "#e8355c"
    }
  },

  {
    name: "Progress Steps",
    style: "progress",
    note: "Fill quantizes to four steps, and each new step pops the head dot",
    box: { width: 220, height: 24 },
    options: {
      variant: "steps",
      steps: 4,
      d: "M0,3 L220,3",
      viewBox: "0 0 220 6",
      strokeWidth: 4,
      color: "#34d399"
    }
  },

  {
    name: "Progress Indeterminate",
    style: "progress",
    note: "A chunk slides along the track forever: the honest bar for unknown ETAs",
    box: { width: 220, height: 24 },
    options: {
      variant: "indeterminate",
      d: "M0,3 L220,3",
      viewBox: "0 0 220 6",
      strokeWidth: 4,
      color: "#5b8cff"
    }
  }
];