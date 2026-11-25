/*!
 * TraceLoop — LOOPING ANIMATION CONFIGS (playground data).
 *
 * Looping configs on plain circle/underline paths. Shape-generator
 * demos (letters, words, boxes, polygons) live in looping-shapes.js.
 *
 * Part of the old animations.js, split one playground section per file
 * under the 400-line ceiling; looping itself is two files split by where
 * the path comes from. Each file pushes onto the shared
 * window.ORBIT_ANIMATIONS list in load order.
 */
(function (global) {
  "use strict";
  var list = global.ORBIT_ANIMATIONS = global.ORBIT_ANIMATIONS || [];
  list.push(
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
      color: "#d97757",
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
      color: "#788c5d",
      guideOpacity: 0.3
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
      color: "#788c5d",
      dotRadius: 4,
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
      color: "#d97757"
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
      color: "#d97757"
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
      color: "#6a9bcc"
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
      color: "#6a9bcc",
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
      color: "#788c5d",
      guideOpacity: 0.3
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
      color: "#788c5d"
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
      color: "#d97757"
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
      color: "#6a9bcc",
      guideOpacity: 0.35
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
      color: "#d97757",
      guideOpacity: 0.35
    }
  },
  {
    name: "Pulse Halo",
    style: "pulse",
    note: "A ring that breathes in place \u2014 swell and soften on the spot, with a steady center dot to anchor the eye",
    box: { width: 84, height: 84 },
    options: { rings: 2, durationMs: 2000, color: "#d97757" }
  },
  {
    name: "Pulse Badge",
    style: "pulse",
    note: "The same breath at badge scale \u2014 rings only, no dot, for status dots and idle markers",
    box: { width: 48, height: 48 },
    options: { rings: 2, durationMs: 1800, strokeWidth: 6, dot: false, maxOpacity: 0.55, color: "#788c5d" }
  },
  {
    name: "Chase Triple",
    style: "chase",
    note: "Three short dashes in formation around a circle \u2014 the multi-runner take on the chasing segment",
    box: { width: 84, height: 84 },
    options: {
      d: { shape: "circle", args: [84] },
      viewBox: "0 0 84 84",
      segments: 3, segmentFraction: 0.14,
      durationMs: 1600, color: "#6a9bcc", guideOpacity: 0.3
    }
  },
  {
    name: "Chase Word",
    style: "chase",
    note: "A four-dash formation sweeping a drawn word \u2014 extra runners keep long paths always in motion",
    box: { width: 240, height: 76 },
    options: {
      d: { shape: "text", args: ["LOOP", 40, 6] },
      segments: 4, segmentFraction: 0.05,
      durationMs: 2600, strokeWidth: 2.5,
      color: "#d97757", guideOpacity: 0.3
    }
  },
  );
})(typeof window !== "undefined" ? window : this);
