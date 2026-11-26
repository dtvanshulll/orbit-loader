/*!
 * TraceLoop shape helpers — outline glyph data. The hand-authored
 * contours letterOutline() prefers: outer contour plus counters (the
 * inside spaces), in glyph-skeleton coordinates. Pure data — the math
 * that consumes it lives in shapes-outline.js. See shapes-core.js for
 * the file map and the load order.
 */
(function (global) {
  "use strict";

  var api = global ? (global.OrbitLoaderShapes = global.OrbitLoaderShapes || {}) : {};
  // SSR import: the geometry namespace only exists through a real
  // global, so without a window there is nothing to build � stop here.
  if (!global) return;
  // The contour data below is built at load time from the point math
  // in shapes-core.js.
  var PI = Math.PI;
  var arcPoints = api._arcPoints;
  var bezPoints = api._bezPoints;
  var GLYPH_ASPECT = api._aspect;
  var skeletonOutline = api._skeletonOutline;
  var OUTLINE_GLYPHS = {
    A: {
      // Outer silhouette: bottom-left → up the left edge → across the
      // flat apex → down the right edge → in along the right leg's foot
      // → up its inner edge → left under the crossbar → down the left
      // leg's inner edge → close. The open area between the legs below
      // the crossbar is part of the OUTSIDE, so the contour dips in
      // there rather than jumping across.
      outer: [
        [0, 1], [0.44, 0], [0.56, 0], [1, 1],
        [0.82, 1], [0.708, 0.72], [0.292, 0.72], [0.18, 1]
      ],
      // The inside space (counter): the triangle above the crossbar.
      counters: [
        [[0.348, 0.58], [0.5, 0.2], [0.652, 0.58]]
      ]
    },

    B: {
      // Left stem + two stacked bowls on the right, traced as one loop.
      outer: [[0, 1], [0, 0], [0.733, 0]]
        .concat(arcPoints(0.733, 0.25, 0.267, 0.25, -PI / 2, PI / 2, 12))
        .concat(arcPoints(0.733, 0.75, 0.267, 0.25, -PI / 2, PI / 2, 12)),
      counters: [
        [[0.217, 0.217], [0.72, 0.217]]
          .concat(arcPoints(0.72, 0.328, 0.063, 0.112, -PI / 2, PI / 2, 8), [[0.72, 0.44], [0.217, 0.44]]),
        [[0.217, 0.56], [0.72, 0.56]]
          .concat(arcPoints(0.72, 0.672, 0.063, 0.112, -PI / 2, PI / 2, 8), [[0.72, 0.783], [0.217, 0.783]])
      ]
    },

    C: {
      // Single open stroke: one arc, round terminals, no counter.
      outer: skeletonOutline(arcPoints(0.5, 0.5, 0.39, 0.434, -0.9, 0.9 - 2 * PI, 26)),
      counters: []
    },

    D: {
      outer: [[0, 1], [0, 0], [0.70, 0]]
        .concat(arcPoints(0.70, 0.5, 0.30, 0.5, -PI / 2, PI / 2, 20)),
      counters: [
        [[0.217, 0.217], [0.667, 0.217]]
          .concat(arcPoints(0.667, 0.5, 0.116, 0.283, -PI / 2, PI / 2, 14), [[0.667, 0.783], [0.217, 0.783]])
      ]
    },

    E: {
      outer: [
        [0, 1], [0, 0], [1, 0], [1, 0.217], [0.217, 0.217],
        [0.217, 0.44], [0.867, 0.44], [0.867, 0.56], [0.217, 0.56],
        [0.217, 0.783], [1, 0.783], [1, 1]
      ],
      counters: []
    },

    F: {
      outer: [
        [0, 1], [0, 0], [1, 0], [1, 0.217], [0.217, 0.217],
        [0.217, 0.44], [0.867, 0.44], [0.867, 0.56], [0.217, 0.56], [0.217, 1]
      ],
      counters: []
    },

    G: {
      // Single open stroke: the C arc continued up the right side into
      // the horizontal bar, ending mid-glyph with a round cap.
      outer: skeletonOutline(
        arcPoints(0.5, 0.5, 0.39, 0.434, -0.9, 0.328 - 2 * PI, 30).concat([[0.52, 0.64]])
      ),
      counters: []
    },

    H: {
      outer: [
        [0, 1], [0, 0], [0.217, 0], [0.217, 0.44], [0.783, 0.44],
        [0.783, 0], [1, 0], [1, 1], [0.783, 1], [0.783, 0.56],
        [0.217, 0.56], [0.217, 1]
      ],
      counters: []
    },

    I: {
      // Stem with full-width serifs top and bottom.
      outer: [
        [0, 1], [0, 0.783], [0.392, 0.783], [0.392, 0.217], [0, 0.217],
        [0, 0], [1, 0], [1, 0.217], [0.608, 0.217], [0.608, 0.783],
        [1, 0.783], [1, 1]
      ],
      counters: []
    },

    J: {
      // Single open stroke: right stem descending into a bottom hook.
      outer: skeletonOutline(
        [[0.83, 0.066], [0.83, 0.70]].concat(arcPoints(0.42, 0.70, 0.31, 0.234, 0, PI, 16))
      ),
      counters: []
    },

    K: {
      // Stem + upper arm + lower leg, notched apart so the silhouette
      // stays one simple polygon.
      outer: [
        [0, 1], [0, 0], [0.217, 0], [0.217, 0.40], [0.75, 0],
        [1, 0], [1, 0.10], [0.50, 0.48], [1, 0.92], [1, 1],
        [0.767, 1], [0.283, 0.60], [0.217, 0.64], [0.217, 1]
      ],
      counters: []
    },

    L: {
      outer: [[0, 1], [0, 0], [0.217, 0], [0.217, 0.783], [1, 0.783], [1, 1]],
      counters: []
    },

    M: {
      outer: [
        [0, 1], [0, 0], [0.192, 0], [0.5, 0.52], [0.808, 0],
        [1, 0], [1, 1], [0.783, 1], [0.783, 0.26], [0.5, 0.74],
        [0.217, 0.26], [0.217, 1]
      ],
      counters: []
    },

    N: {
      outer: [
        [0, 1], [0, 0], [0.217, 0], [0.783, 0.60], [0.783, 0],
        [1, 0], [1, 1], [0.783, 1], [0.217, 0.40], [0.217, 1]
      ],
      counters: []
    },

    O: {
      outer: arcPoints(0.5, 0.5, 0.5, 0.5, 0.75 * PI, 0.75 * PI + 2 * PI, 40),
      counters: [
        arcPoints(0.5, 0.5, 0.28, 0.368, 0.75 * PI, 0.75 * PI + 2 * PI, 32)
      ]
    },

    P: {
      outer: [[0, 1], [0, 0], [0.70, 0]]
        .concat(arcPoints(0.70, 0.27, 0.30, 0.27, -PI / 2, PI / 2, 14), [[0.217, 0.54], [0.217, 1]]),
      counters: [
        [[0.217, 0.217], [0.667, 0.217]]
          .concat(arcPoints(0.667, 0.3135, 0.116, 0.0965, -PI / 2, PI / 2, 8), [[0.667, 0.41], [0.217, 0.41]])
      ]
    },

    Q: {
      // O with a tail spike at the bottom right, kept inside the box.
      outer: arcPoints(0.5, 0.5, 0.5, 0.5, 2.4, 2 * PI + 0.35, 36)
        .concat([[0.99, 0.89]], arcPoints(0.5, 0.5, 0.5, 0.5, 0.62, 2.4, 8)),
      counters: [
        arcPoints(0.5, 0.5, 0.28, 0.368, 0.75 * PI, 0.75 * PI + 2 * PI, 32)
      ]
    },

    R: {
      // P's bowl plus a diagonal leg notched away from the stem.
      outer: [[0, 1], [0, 0], [0.70, 0]]
        .concat(arcPoints(0.70, 0.27, 0.30, 0.27, -PI / 2, PI / 2, 14),
          [[0.517, 0.54], [1, 1], [0.783, 1], [0.433, 0.63], [0.217, 0.63], [0.217, 1]]),
      counters: [
        [[0.217, 0.217], [0.667, 0.217]]
          .concat(arcPoints(0.667, 0.3135, 0.116, 0.0965, -PI / 2, PI / 2, 8), [[0.667, 0.41], [0.217, 0.41]])
      ]
    },

    S: {
      // Single open stroke: two overlapping circular hooks joined
      // through the center — the classic double curve.
      outer: skeletonOutline(
        arcPoints(0.5, 0.32, 0.32, 0.254, -0.6, -3.69, 14)
          .concat(arcPoints(0.5, 0.68, 0.32, 0.254, -0.55, 2.17, 14))
      ),
      counters: []
    },

    T: {
      outer: [
        [0.392, 1], [0.392, 0.217], [0, 0.217], [0, 0],
        [1, 0], [1, 0.217], [0.608, 0.217], [0.608, 1]
      ],
      counters: []
    },

    U: {
      // Single open stroke: two stems joined by a bottom arc.
      outer: skeletonOutline(
        [[0.11, 0.066], [0.11, 0.62]]
          .concat(arcPoints(0.5, 0.62, 0.39, 0.314, PI, 0, 20), [[0.89, 0.066]])
      ),
      counters: []
    },

    V: {
      outer: [[0.40, 1], [0.60, 1], [1, 0], [0.783, 0], [0.5, 0.72], [0.217, 0], [0, 0]],
      counters: []
    },

    W: {
      outer: [
        [0, 0], [0.208, 0], [0.392, 0.78], [0.5, 0.42], [0.608, 0.78],
        [0.792, 0], [1, 0], [0.833, 1], [0.667, 1], [0.5, 0.60],
        [0.333, 1], [0.167, 1]
      ],
      counters: []
    },

    X: {
      outer: [
        [0, 0], [0.233, 0], [0.5, 0.36], [0.767, 0], [1, 0],
        [0.667, 0.5], [1, 1], [0.767, 1], [0.5, 0.64], [0.233, 1],
        [0, 1], [0.333, 0.5]
      ],
      counters: []
    },

    Y: {
      outer: [
        [0, 0], [0.217, 0], [0.5, 0.38], [0.783, 0], [1, 0],
        [0.608, 0.52], [0.608, 1], [0.392, 1], [0.392, 0.52]
      ],
      counters: []
    },

    Z: {
      outer: [
        [0, 0], [1, 0], [1, 0.217], [0.333, 0.783], [1, 0.783],
        [1, 1], [0, 1], [0, 0.783], [0.667, 0.217], [0, 0.217]
      ],
      counters: []
    },

    "0": {
      outer: arcPoints(0.5, 0.5, 0.5, 0.5, 0.75 * PI, 0.75 * PI + 2 * PI, 40),
      counters: [
        arcPoints(0.5, 0.5, 0.28, 0.368, 0.75 * PI, 0.75 * PI + 2 * PI, 32)
      ]
    },

    "1": {
      outer: [
        [0.39, 1], [0.39, 0.14], [0.10, 0.26], [0, 0.18],
        [0.39, 0], [0.61, 0], [0.61, 1]
      ],
      counters: []
    },

    "2": {
      // Single open stroke: top arc, spine diagonal, base bar.
      outer: skeletonOutline(
        arcPoints(0.5, 0.26, 0.36, 0.194, 3.03, -0.45, 14)
          .concat([[0.11, 0.934], [0.89, 0.934]])
      ),
      counters: []
    },

    "3": {
      // Single open stroke: two right-facing bowls joined at the center.
      outer: skeletonOutline(
        arcPoints(0.42, 0.27, 0.30, 0.204, 3.64, 7.85, 16)
          .concat(arcPoints(0.42, 0.73, 0.30, 0.204, 4.712, 8.92, 16))
      ),
      counters: []
    },

    "4": {
      outer: [
        [0, 0.55], [0.317, 0.55], [0.70, 0.045], [0.70, 0],
        [0.917, 0], [0.917, 0.55], [1, 0.55], [1, 0.68], [0.917, 0.68],
        [0.917, 1], [0.70, 1], [0.70, 0.68], [0, 0.68]
      ],
      counters: []
    },

    "5": {
      // Single open stroke: top bar, left stem, bottom bowl.
      outer: skeletonOutline(
        [[0.85, 0.11], [0.17, 0.11], [0.17, 0.72]]
          .concat(arcPoints(0.5, 0.72, 0.33, 0.212, PI, 0.35, 18))
      ),
      counters: []
    },

    "6": {
      // Single open stroke: descends from the top right into a full
      // loop that spirals out at the bottom right.
      outer: skeletonOutline(
        [[0.82, 0.10], [0.66, 0.28], [0.44, 0.44], [0.16, 0.62]]
          .concat(arcPoints(0.40, 0.72, 0.26, 0.214, PI, -5.78, 30))
      ),
      counters: []
    },

    "7": {
      outer: [
        [0, 0], [1, 0], [1, 0.217], [0.40, 1], [0.167, 1],
        [0.733, 0.217], [0, 0.217]
      ],
      counters: []
    },

    "8": {
      // Two stacked bowls traced as one figure-eight outer contour.
      outer: arcPoints(0.5, 0.26, 0.433, 0.26, 1.965, 7.459, 22)
        .concat(arcPoints(0.5, 0.74, 0.45, 0.26, 5.107, 10.60, 22)),
      counters: [
        arcPoints(0.5, 0.26, 0.213, 0.128, 1.965, 1.965 + 2 * PI, 24),
        arcPoints(0.5, 0.74, 0.23, 0.128, 5.107, 5.107 + 2 * PI, 24)
      ]
    },

    "9": {
      // Single open stroke: full loop at the top, stem descending on
      // the right, spiraling back into the bowl.
      outer: skeletonOutline(
        [[0.62, 0.90], [0.62, 0.30]]
          .concat(arcPoints(0.40, 0.30, 0.26, 0.214, 0, -5.9, 30))
      ),
      counters: []
    }
  };

  // Closed contours → one `d` string (each subpath closed with Z).

  // Internal: consumed by shapes-outline.js, not consumer API.
  api._outlineGlyphs = OUTLINE_GLYPHS;
})(typeof window !== "undefined" ? window : undefined);
