/*!
 * OrbitLoader shape helpers — optional sugar that generates an SVG "d"
 * string for a common outline, so you don't have to hand-write the path
 * arithmetic for the easy cases. The loader styles (orbit-loader.js,
 * dot-loader.js) don't depend on this file at all: they animate whatever
 * path you give them, built here or written by hand.
 *
 * Add a new shape by adding a new function here — the style files never
 * need to change for it. Everything in this file is pure string/number
 * math: no DOM, no browser APIs (textBoxForElement is the one exception,
 * and it only *reads* a rect from an element you hand it).
 */
(function (global) {
  "use strict";

  var PI = Math.PI;

  /**
   * A square of `size` with corners rounded by `radius`, starting and
   * ending at the midpoint of the top edge — matches the path StoryClip's
   * splash screen uses for its 84x84 logo box (radius 24).
   */
  function roundedSquare(size, radius) {
    return roundRect(size, size, radius);
  }

  /**
   * A rectangle of `width` x `height` with corners rounded by `radius` —
   * the general case of roundedSquare, for text boxes and non-square
   * frames.
   */
  function roundRect(width, height, radius) {
    var w = width, h = height, r = radius;
    return (
      "M" + r + ",0" +
      " H" + (w - r) +
      " A" + r + "," + r + " 0 0 1 " + w + "," + r +
      " V" + (h - r) +
      " A" + r + "," + r + " 0 0 1 " + (w - r) + "," + h +
      " H" + r +
      " A" + r + "," + r + " 0 0 1 0," + (h - r) +
      " V" + r +
      " A" + r + "," + r + " 0 0 1 " + r + ",0" +
      " Z"
    );
  }

  /**
   * A circle of diameter `size`, drawn as two half-arcs (a single SVG arc
   * command can't sweep a full 360 degrees).
   */
  function circle(size) {
    var r = size / 2;
    return (
      "M" + r + ",0" +
      " A" + r + "," + r + " 0 1 1 " + r + "," + size +
      " A" + r + "," + r + " 0 1 1 " + r + ",0" +
      " Z"
    );
  }

  /**
   * A straight underline sitting `gap` below y=0, spanning from x=0 to
   * x=`width` — pair with a loader's wrap() over a text element to trace
   * a thread back and forth under a word instead of around a shape.
   */
  function underline(width, gap) {
    gap = gap != null ? gap : 4;
    return "M0," + gap + " H" + width;
  }

  /**
   * A regular polygon (`sides` ≥ 3) inscribed in a `size` × `size` box,
   * one vertex pointing up. `radius` (default 0) rounds the corners —
   * the cut is tangent to both edges, clamped so it can never eat more
   * than half an edge. Returns a bare `d` string like circle(), so any
   * style can chase it: triangle, pentagon, hexagon, star bases.
   */
  function polygon(sides, size, radius) {
    sides = Math.max(3, Math.round(sides || 3));
    var R = size / 2, cx = R, cy = R;
    var verts = [];
    for (var i = 0; i < sides; i++) {
      var a = -PI / 2 + (i * 2 * PI) / sides;
      verts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    }
    var r = radius != null ? radius : 0;
    if (r <= 0) {
      var sharp = ["M" + rnd(verts[0][0]) + "," + rnd(verts[0][1])];
      for (var j = 1; j < sides; j++) {
        sharp.push("L" + rnd(verts[j][0]) + "," + rnd(verts[j][1]));
      }
      return sharp.join("") + "Z";
    }
    // Corner rounding: the interior angle of a regular n-gon, the tangent
    // length along each edge, and the arc radius clamped to half an edge.
    var alpha = ((sides - 2) * PI) / sides;
    var t = r / Math.tan(alpha / 2);
    var halfEdge = R * Math.sin(PI / sides);
    if (t > halfEdge) {
      t = halfEdge;
      r = t * Math.tan(alpha / 2);
    }
    var cmds = [];
    for (var k = 0; k < sides; k++) {
      var prev = verts[(k - 1 + sides) % sides];
      var v = verts[k];
      var next = verts[(k + 1) % sides];
      // Tangent points on the incoming and outgoing edges, then the arc
      // between them — sweep 1 because the vertex loop runs clockwise.
      var inLen = vLen(vSub(v, prev));
      var outLen = vLen(vSub(next, v));
      var p1 = [v[0] + ((prev[0] - v[0]) / inLen) * t, v[1] + ((prev[1] - v[1]) / inLen) * t];
      var p2 = [v[0] + ((next[0] - v[0]) / outLen) * t, v[1] + ((next[1] - v[1]) / outLen) * t];
      if (k === 0) cmds.push("M" + rnd(p1[0]) + "," + rnd(p1[1]));
      else cmds.push("L" + rnd(p1[0]) + "," + rnd(p1[1]));
      cmds.push("A" + rnd(r) + "," + rnd(r) + " 0 0 1 " + rnd(p2[0]) + "," + rnd(p2[1]));
    }
    return cmds.join("") + "Z";
  }

  /**
   * An infinity sign (lemniscate) `size` wide and `height` tall (default
   * height: size/2, the classic wide-and-short ∞ proportion). Sampled
   * from the Gerono lemniscate (x = cos t, y = sin t · cos t) into a
   * smooth closed polyline starting at the center crossing, so the
   * crawler passes through the middle on every lap. Pair with
   * ShimmerLoader for the filled-band-with-light-through-it look.
   */
  function infinity(size, height) {
    height = height != null ? height : size * 0.5;
    var steps = 72;
    var parts = [];
    for (var i = 0; i <= steps; i++) {
      var t = -PI / 2 + 2 * PI * (i / steps);
      var x = (Math.cos(t) + 1) / 2 * size;
      var y = height / 2 + Math.sin(t) * Math.cos(t) * height;
      parts.push((i === 0 ? "M" : "L") + rnd(x) + "," + rnd(y));
    }
    return parts.join("");
  }

  /* ------------------------------------------------------------------ *
   * Letters and digits.
   *
   * Each glyph is a hand-drawn single-stroke skeleton (the line a pen
   * would travel), stored as subpaths of [u, v] points in a unit box —
   * u across the glyph's width, v down its height. Curves are sampled
   * into short segments at build time, which keeps every glyph a plain
   * polyline: trivial to offset (for text()), and the moving segment
   * bends through it exactly like through any other path.
   * ------------------------------------------------------------------ */

  // Glyph width as a fraction of its height — monospaced on purpose, so
  // text() can advance the cursor without per-glyph metrics.
  var GLYPH_ASPECT = 0.6;

  // Sample points along an ellipse arc (radians; y grows downward, so
  // positive sin(t) is *below* the center).
  function arcPoints(cx, cy, rx, ry, a0, a1, steps) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = a0 + (a1 - a0) * (i / steps);
      pts.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
    }
    return pts;
  }

  // Sample points along a cubic Bézier, for the few glyphs (S, 6, 9)
  // that read better as a flowing curve than as arcs.
  function bezPoints(p0, p1, p2, p3, steps) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = i / steps, u = 1 - t;
      pts.push([
        u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
        u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]
      ]);
    }
    return pts;
  }

  var GLYPHS = {
    A: [[[0,1],[0.5,0],[1,1]], [[0.18,0.62],[0.82,0.62]]],
    B: [
      [[0,0],[0,1]],
      [[0,0],[0.65,0]].concat(arcPoints(0.65,0.25,0.35,0.25,-PI/2,PI/2,10), [[0,0.5]]),
      arcPoints(0.65,0.75,0.35,0.25,-PI/2,PI/2,10).concat([[0,1]])
    ],
    C: [arcPoints(0.55,0.5,0.55,0.44,-0.9,0.9-2*PI,20)],
    D: [
      [[0,0],[0,1]],
      [[0,0],[0.5,0]].concat(arcPoints(0.5,0.5,0.5,0.5,-PI/2,PI/2,14), [[0,1]])
    ],
    E: [[[1,0],[0,0],[0,1],[1,1]], [[0,0.5],[0.8,0.5]]],
    F: [[[1,0],[0,0],[0,1]], [[0,0.5],[0.8,0.5]]],
    G: [arcPoints(0.55,0.5,0.55,0.44,-0.9,0.6-2*PI,24)
        .concat([[1.0,0.52],[0.56,0.52]])],
    H: [[[0,0],[0,1]], [[1,0],[1,1]], [[0,0.5],[1,0.5]]],
    I: [[[0.5,0],[0.5,1]], [[0,0],[1,0]], [[0,1],[1,1]]],
    J: [[[0.7,0],[0.7,0.72]].concat(arcPoints(0.375,0.72,0.325,0.22,0,PI,10))],
    K: [[[0,0],[0,1]], [[1,0],[0.05,0.58]], [[0.3,0.4],[1,1]]],
    L: [[[0,0],[0,1],[1,1]]],
    M: [[[0,1],[0,0],[0.5,0.35],[1,0],[1,1]]],
    N: [[[0,1],[0,0],[1,1],[1,0]]],
    O: [arcPoints(0.5,0.5,0.5,0.5,-PI/2,1.5*PI,40)],
    P: [[[0,1],[0,0],[0.65,0]].concat(arcPoints(0.65,0.25,0.35,0.25,-PI/2,PI/2,10), [[0,0.5]])],
    Q: [arcPoints(0.5,0.5,0.5,0.5,-PI/2,1.5*PI,24), [[0.55,0.65],[1,1]]],
    R: [
      [[0,1],[0,0],[0.65,0]].concat(arcPoints(0.65,0.25,0.35,0.25,-PI/2,PI/2,10), [[0,0.5]]),
      [[0.3,0.5],[1,1]]
    ],
    S: [bezPoints([0.88,0.12],[0.6,0.0],[0.15,0.02],[0.15,0.28],14)
        .concat(bezPoints([0.15,0.28],[0.15,0.52],[0.85,0.48],[0.85,0.72],14).slice(1))
        .concat(bezPoints([0.85,0.72],[0.85,0.98],[0.4,1.0],[0.12,0.88],14).slice(1))],
    T: [[[0,0],[1,0]], [[0.5,0],[0.5,1]]],
    U: [[[0,0],[0,0.65]].concat(arcPoints(0.5,0.65,0.5,0.35,PI,0,14), [[1,0]])],
    V: [[[0,0],[0.5,1],[1,0]]],
    W: [[[0,0],[0.25,1],[0.5,0.35],[0.75,1],[1,0]]],
    X: [[[0,0],[1,1]], [[1,0],[0,1]]],
    Y: [[[0,0],[0.5,0.5],[1,0]], [[0.5,0.5],[0.5,1]]],
    Z: [[[0,0],[1,0],[0,1],[1,1]]],
    "0": [arcPoints(0.5,0.5,0.5,0.5,-PI/2,1.5*PI,40)],
    "1": [[[0.15,0.18],[0.55,0],[0.55,1]]],
    "2": [[[0,0.2]].concat(arcPoints(0.5,0.2,0.5,0.2,PI,2*PI,14), [[1,0.2],[0,1],[1,1]])],
    "3": [[[0.08,0],[0.5,0]].concat(
          arcPoints(0.5,0.25,0.45,0.25,-PI/2,1.68,12),
          arcPoints(0.5,0.75,0.45,0.25,-1.68,PI,12),
          [[0.08,0.98]])],
    "4": [[[0.7,0],[0,0.65],[1,0.65]], [[0.7,0],[0.7,1]]],
    "5": [[[1,0],[0.12,0],[0.05,0.5]],
          [[0.1,0.5],[0.6,0.5]].concat(arcPoints(0.6,0.75,0.4,0.25,-PI/2,PI/2,10), [[0.08,1]])],
    "6": [bezPoints([0.85,0.06],[0.25,0.1],[0.06,0.35],[0.06,0.72],12)
          .concat(arcPoints(0.5,0.72,0.44,0.28,PI,3*PI,20))],
    "7": [[[0,0],[1,0],[0.3,1]]],
    "8": [
      arcPoints(0.5,0.26,0.42,0.26,-PI/2,1.5*PI,28),
      arcPoints(0.5,0.74,0.46,0.26,-PI/2,1.5*PI,28)
    ],
    "9": [bezPoints([0.15,0.94],[0.75,0.9],[0.94,0.65],[0.94,0.28],12)
          .concat(arcPoints(0.5,0.28,0.44,0.28,0,2*PI,20))]
  };

  function rnd(v) {
    return Math.round(v * 100) / 100;
  }

  // Turn a glyph's unit-space subpaths into an absolute `d` string,
  // optionally shifted right by `offsetX` (how text() places letters
  // side by side without needing per-glyph metrics).
  function glyphToPath(glyph, size, offsetX) {
    var w = size * GLYPH_ASPECT;
    var parts = [];
    for (var i = 0; i < glyph.length; i++) {
      var sub = glyph[i];
      var cmds = ["M" + rnd(offsetX + sub[0][0] * w) + "," + rnd(sub[0][1] * size)];
      for (var j = 1; j < sub.length; j++) {
        cmds.push("L" + rnd(offsetX + sub[j][0] * w) + "," + rnd(sub[j][1] * size));
      }
      parts.push(cmds.join(""));
    }
    return parts.join(" ");
  }

  /**
   * A single-stroke skeleton of `char` (A-Z or 0-9, case-insensitive),
   * `0.6 * size` wide and `size` tall — pair with viewBox
   * `"0 0 <0.6*size> <size>"`. The crawler travels the pen stroke, so
   * multi-stroke glyphs (A, B, K...) are traced stroke by stroke.
   */
  function letter(char, size) {
    var glyph = GLYPHS[String(char).toUpperCase()];
    if (!glyph) {
      throw new Error('shapes.letter: no glyph for "' + char + '" — A-Z and 0-9 only');
    }
    return glyphToPath(glyph, size, 0);
  }

  /**
   * A whole word/number as ONE crawlable path, letter placed after
   * letter — the segment or dot travels through "O", jumps to "R", and
   * so on (subpath jumps cost no length, so the crawl is continuous).
   *
   * Returns { d, viewBox, width, height } rather than a bare string,
   * because the width depends on the string — spread it into wrap():
   *   var word = OrbitLoaderShapes.text("ORBIT", 26);
   *   OrbitLoader.wrap(el, { d: word.d, viewBox: word.viewBox });
   *
   * A-Z, 0-9 and spaces only (spaces just advance the cursor).
   */
  function text(str, size, spacing) {
    spacing = spacing != null ? spacing : size * 0.15;
    var w = size * GLYPH_ASPECT;
    var parts = [];
    var cursor = 0;
    var chars = String(str).toUpperCase().split("");
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (ch === " ") {
        cursor += w * 0.6 + spacing;
        continue;
      }
      var glyph = GLYPHS[ch];
      if (!glyph) {
        throw new Error('shapes.text: no glyph for "' + ch + '" — A-Z, 0-9 and spaces only');
      }
      parts.push(glyphToPath(glyph, size, cursor));
      cursor += w + spacing;
    }
    var width = Math.max(cursor - spacing, w);
    return {
      d: parts.join(" "),
      width: rnd(width),
      height: rnd(size),
      viewBox: "0 0 " + rnd(width) + " " + rnd(size)
    };
  }

  /* ------------------------------------------------------------------ *
   * Glyph outlines.
   *
   * letter() draws the pen stroke — the crawler travels INSIDE the
   * letter. letterOutline() draws AROUND it: the contour of the stroke
   * band, offset half the stroke thickness to each side of the skeleton
   * with round joins and round caps, so the crawler travels the letter's
   * edge and never its inside. Same unit-space glyph data, different
   * geometry pass over it.
   * ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ *
   * Glyph outlines.
   *
   * Two ways to get a crawler that travels around a letter:
   *
   * 1. OUTLINE_GLYPHS (the proper way): every letter A–Z and digit 0–9
   *    is hand-authored like a drawing — a closed OUTER contour (the
   *    silhouette, which the crawler travels) plus closed counter
   *    contours (the inside spaces, shown only in the faint guide).
   *    Every contour starts at the glyph's bottom-left and runs
   *    clockwise, so the crawl is systematic: same start, same
   *    direction, every time.
   *
   * 2. Stroke-offset fallback: the letter() skeleton offset half the
   *    stroke thickness to each side — kept for characters outside the
   *    authored set.
   * ------------------------------------------------------------------ */

  /**
   * One clean closed silhouette for a SINGLE-stroke glyph (C, G, S, U,
   * J, 2, 3, 5, 6, 9): run the stroke-offset machinery on the skeleton
   * in nominal pixel space (width GLYPH_ASPECT, height 1) so the offset
   * distance is uniform, then map the contour back to unit glyph space.
   * Only for single-stroke skeletons — a multi-stroke one would produce
   * overlapping contours here, which is exactly what the hand-authored
   * polygons below exist to avoid.
   */
  function skeletonOutline(skeleton, thickness) {
    var r = (thickness != null ? thickness : 0.132) / 2;
    var px = skeleton.map(function (p) { return [p[0] * GLYPH_ASPECT, p[1]]; });
    var contour = strokeContours(px, r, false)[0];
    return contour.map(function (p) { return [p[0] / GLYPH_ASPECT, p[1]]; });
  }

  // Shared metrics for the authored polygons: stroke thickness 0.22 in
  // u-units ≡ 0.132 in v-units (the same pixel width either way, since
  // the glyph box is 0.6 wide), stems at u 0–0.22 and 0.78–1, bars 0.132
  // of the height tall.
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
  function contoursToD(contours, size) {
    var w = size * GLYPH_ASPECT;
    return contours.map(function (c) {
      var cmds = ["M" + rnd(c[0][0] * w) + "," + rnd(c[0][1] * size)];
      for (var i = 1; i < c.length; i++) {
        cmds.push("L" + rnd(c[i][0] * w) + "," + rnd(c[i][1] * size));
      }
      return cmds.join("") + "Z";
    }).join(" ");
  }

  /**
   * Build the crawl + guide paths for an authored glyph, or null if the
   * letter hasn't been authored yet. `d` is the OUTER contour only —
   * that's what the crawler travels. `guideD` is the full drawing
   * (outer + inside spaces) for the faint static guide, so the letter
   * reads as a letter with both its spaces visible.
   */
  function authoredOutline(char, size) {
    var g = OUTLINE_GLYPHS[char];
    if (!g) return null;
    var w = size * GLYPH_ASPECT;
    return {
      d: contoursToD([g.outer], size),
      guideD: contoursToD([g.outer].concat(g.counters), size),
      width: rnd(w),
      height: rnd(size),
      viewBox: "0 0 " + rnd(w) + " " + rnd(size)
    };
  }

  function vSub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function vAdd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function vScale(v, k) { return [v[0] * k, v[1] * k]; }
  function vLen(v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; }
  function vNorm(v) { return vScale(v, 1 / vLen(v)); }
  // Left-hand normal of a direction (y grows downward on screen, so this
  // points to one consistent side of the stroke).
  function vNormal(d) { return [-d[1], d[0]]; }

  /**
   * Offset a polyline by `side * r` perpendicular to its segments.
   * Gentle corners are mitered (offset distance stays ~r); sharp ones
   * are beveled, because a miter spike on a sharp corner like A's apex
   * would dwarf the glyph. `closed` loops wrap the vertex indices.
   */
  function offsetPolyline(pts, side, r, closed) {
    var n = pts.length;
    var out = [];
    for (var i = 0; i < n; i++) {
      var prev = pts[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)];
      var next = pts[closed ? (i + 1) % n : Math.min(i + 1, n - 1)];
      var openEnd = !closed && (i === 0 || i === n - 1);
      var nIn = vScale(vNormal(vNorm(vSub(pts[i], prev))), side * r);
      var nOut = vScale(vNormal(vNorm(vSub(next, pts[i]))), side * r);
      if (openEnd) {
        // An endpoint has one segment; offset along its normal only.
        out.push(vAdd(pts[i], i === 0 ? nOut : nIn));
      } else {
        var m = vNorm(vAdd(nIn, nOut));
        var cosHalf = m[0] * nIn[0] + m[1] * nIn[1];
        if (cosHalf < 0.5) {
          // Bevel: cut straight between the two segment offsets.
          out.push(vAdd(pts[i], nIn));
          out.push(vAdd(pts[i], nOut));
        } else {
          out.push(vAdd(pts[i], vScale(m, r / cosHalf)));
        }
      }
    }
    return out;
  }

  /**
   * Semicircular cap around `center`: point(φ) = center + dir·r·cosφ +
   * leftN·r·sinφ, so φ 0→π sweeps from the left-offset side around the
   * outward tip to the right-offset side.
   */
  function capPoints(center, dir, leftN, r, a0, a1, steps) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = a0 + (a1 - a0) * (i / steps);
      pts.push(vAdd(center, vAdd(vScale(dir, r * Math.cos(t)), vScale(leftN, r * Math.sin(t)))));
    }
    return pts;
  }

  function contourToPath(pts) {
    var cmds = ["M" + rnd(pts[0][0]) + "," + rnd(pts[0][1])];
    for (var i = 1; i < pts.length; i++) {
      cmds.push("L" + rnd(pts[i][0]) + "," + rnd(pts[i][1]));
    }
    return cmds.join("");
  }

  /**
   * The outline contours of one skeleton subpath: for an open stroke, a
   * single closed contour (left offsets forward, round end cap, right
   * offsets back, round start cap); for a closed loop, two contours (the
   * outer and inner offset loops).
   */
  function strokeContours(pts, r, closed) {
    var contours = [];
    if (closed) {
      contours.push(offsetPolyline(pts, 1, r, true));
      contours.push(offsetPolyline(pts, -1, r, true));
      return contours;
    }
    var n = pts.length;
    var dIn = vNorm(vSub(pts[n - 1], pts[n - 2]));
    var dOut = vNorm(vSub(pts[1], pts[0]));
    var left = offsetPolyline(pts, 1, r, false);
    var right = offsetPolyline(pts, -1, r, false).reverse();
    var contour = left.concat(
      capPoints(pts[n - 1], dIn, vNormal(dIn), r, 0, PI, 6).slice(1),
      right.slice(0, right.length - 1),
      capPoints(pts[0], dOut, vNormal(dOut), r, PI, 2 * PI, 6).slice(1)
    );
    contours.push(contour);
    return contours;
  }

  /**
   * A crawler path that travels AROUND a letter. For authored glyphs
   * (see OUTLINE_GLYPHS) this is the letter's outer silhouette, drawn
   * like a picture: one systematic lap along the outside surface only —
   * fixed start (bottom-left), fixed direction (clockwise) — while the
   * inside spaces ride along in `guideD` for the faint guide. For
   * letters not yet authored, falls back to offsetting the letter()
   * skeleton half of `thickness` (default size * 0.16) to each side.
   *
   * Returns { d, guideD, viewBox, width, height } — `d` is what the
   * crawler travels, `guideD` is the full letter drawing for the guide
   * (pass it as wrap()'s guideD option; it defaults to `d`).
   */
  function letterOutline(char, size, thickness) {
    var authored = authoredOutline(String(char).toUpperCase(), size);
    if (authored) return authored;
    thickness = thickness != null ? thickness : size * 0.16;
    var glyph = GLYPHS[String(char).toUpperCase()];
    if (!glyph) {
      throw new Error('shapes.letterOutline: no glyph for "' + char + '" — A-Z and 0-9 only');
    }
    var w = size * GLYPH_ASPECT;
    var r = thickness / 2;
    var pad = r * 1.5; // the outline can bulge up to ~1.5r past the box
    var parts = [];
    for (var i = 0; i < glyph.length; i++) {
      var pts = [];
      for (var j = 0; j < glyph[i].length; j++) {
        pts.push([glyph[i][j][0] * w + pad, glyph[i][j][1] * size + pad]);
      }
      var closed = Math.abs(pts[0][0] - pts[pts.length - 1][0]) < 0.01 &&
                   Math.abs(pts[0][1] - pts[pts.length - 1][1]) < 0.01;
      if (closed) pts.pop();
      var contours = strokeContours(pts, r, closed);
      for (var k = 0; k < contours.length; k++) {
        parts.push(contourToPath(contours[k]));
      }
    }
    var width = w + pad * 2;
    var height = size + pad * 2;
    var d = parts.join(" ");
    return {
      d: d,
      guideD: d,
      width: rnd(width),
      height: rnd(height),
      viewBox: "0 0 " + rnd(width) + " " + rnd(height)
    };
  }

  /**
   * A rounded box drawn `padding` px outside a LIVE text element's
   * measured bounds — the "boundary of a text view" case. Measured once,
   * at call time, via getBoundingClientRect(): the caller decides when
   * layout is ready (fonts loaded, element in the DOM), so this file
   * never has to guess.
   *
   * Returns { d, viewBox, width, height }. Pair with the wrap() offset
   * option so the injected SVG maps 1:1 onto the measured box:
   *   var box = OrbitLoaderShapes.textBoxForElement(el, 8, 10);
   *   OrbitLoader.wrap(el, { d: box.d, viewBox: box.viewBox, offset: 8 });
   */
  function textBoxForElement(el, padding, radius) {
    padding = padding != null ? padding : 8;
    if (!el || !el.getBoundingClientRect) {
      throw new Error("shapes.textBoxForElement: el must be a DOM element");
    }
    var rect = el.getBoundingClientRect();
    var w = rect.width + padding * 2;
    var h = rect.height + padding * 2;
    return {
      d: roundRect(w, h, radius != null ? radius : 10),
      width: rnd(w),
      height: rnd(h),
      viewBox: "0 0 " + rnd(w) + " " + rnd(h)
    };
  }

  var shapes = {
    roundedSquare: roundedSquare,
    roundRect: roundRect,
    circle: circle,
    polygon: polygon,
    underline: underline,
    infinity: infinity,
    letter: letter,
    letterOutline: letterOutline,
    text: text,
    textBoxForElement: textBoxForElement
  };

  // Load orbit-loader.js first and these attach at OrbitLoader.shapes, as
  // the examples and README use them; load this file alone and they're
  // still reachable at OrbitLoaderShapes.
  if (global.OrbitLoader) global.OrbitLoader.shapes = shapes;
  global.OrbitLoaderShapes = shapes;
})(typeof window !== "undefined" ? window : this);
