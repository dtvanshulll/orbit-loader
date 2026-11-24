/*!
 * TraceLoop — LOOPING SHAPE-DEMO CONFIGS (playground data).
 *
 * Looping configs whose path comes from a shape generator: letters,
 * words, boxes, polygons, the infinity band.
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
    name: "Logo Box",
    style: "orbit",
    note: "The original: a glowing segment chasing the edge of an app-icon tile",
    // A stroke icon, not an emoji: the same Lucide geometry every style animates.
    box: { width: 84, height: 84, background: "#201f1c", borderRadius: 24, html: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#e8e6dc" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.296 3.464l3.02 3.956M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3zM3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm3.18-5.724l3.1 3.899"/></svg>' },
    options: {
      d: { shape: "roundedSquare", args: [84, 24] },
      viewBox: "0 0 84 84",
      durationMs: 2200
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
    box: { width: 462, height: 20, background: "#1c1b19", border: "1px solid #3a3831", borderRadius: 6 },
    options: {
      d: { shape: "text", args: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 20, 6] },
      durationMs: 9000,
      segmentFraction: 0.12,
      color: "#e8e6dc",
      guideOpacity: 0.3
    }
  },

  {
    name: "Silver Infinity",
    style: "shimmer",
    note: "Light sweeping through an infinity band on black",
    box: { width: 120, height: 60, background: "#000", border: "1px solid #4a473e", borderRadius: 16 },
    options: {
      d: { shape: "infinity", args: [120] },
      viewBox: "0 0 120 60",
      durationMs: 2400,
      bandWidth: 10,
      bandOpacity: 0.5,
      color: "#e8e6dc"
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
      color: "#d97757",
      guideOpacity: 0.35
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
      color: "#d97757",
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
      color: "#6a9bcc",
      guideOpacity: 0.35
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
      color: "#e8e6dc"
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
      color: "#e8e6dc",
      guideOpacity: 0.35
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
      color: "#d97757",
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
      color: "#788c5d",
      guideOpacity: 0.3
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
      color: "#e8e6dc",
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
      color: "#d97757",
      guideOpacity: 0.35
    }
  }
  );
})(typeof window !== "undefined" ? window : this);
