/*!
 * TraceLoop shape helpers — geometry. Optional sugar that generates an
 * SVG "d" string for a common outline, so you don't have to hand-write
 * the path arithmetic for the easy cases. The loader styles never
 * depend on these files: they animate whatever path you give them,
 * built here or written by hand.
 *
 * The old single shapes.js grew past the 400-line ceiling, so it is now
 * four files that share one namespace object (window.OrbitLoaderShapes):
 *
 *   shapes-core.js      pure geometry (this file) — no deps
 *   shapes-text.js      letter / text / textBoxForElement + glyph skeletons
 *   outline-glyphs.js   the hand-authored letter-outline contour data
 *   shapes-outline.js   letterOutline() + the offset/stroke math it needs
 *
 * Load order matters: core, text, outline, outline-glyphs. Everything is
 * pure string/number math: no DOM, no browser APIs (textBoxForElement is
 * the one exception, and it only *reads* a rect from an element you hand
 * it). Files share only through the public api object — an underscore
 * key is internal, documented, and not part of the consumer API.
 *
 * Add a new shape by adding a new function here — the style files never
 * need to change for it.
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
  // 2D vector helpers for the corner-rounding math below. Each shape
  // file is its own closure (they share only the api object), so these
  // are a small local copy rather than a cross-file reference — the
  // same two one-liners shapes-outline.js keeps for its own offsetting.
  function vSub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function vLen(v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; }

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
   * crawler passes through the middle on every lap.
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

  function rnd(v) {
    return Math.round(v * 100) / 100;
  }

  // Turn a glyph's unit-space subpaths into an absolute `d` string,
  // optionally shifted right by `offsetX` (how text() places letters
  // side by side without needing per-glyph metrics).

  var api = global ? (global.OrbitLoaderShapes = global.OrbitLoaderShapes || {}) : {};
  // SSR import: the geometry namespace only exists through a real
  // global, so without a window there is nothing to build � stop here.
  if (!global) return;
  api.roundedSquare = roundedSquare;
  api.roundRect = roundRect;
  api.circle = circle;
  api.underline = underline;
  api.polygon = polygon;
  api.infinity = infinity;
  // Internals the glyph/outline files build their data with.
  api._arcPoints = arcPoints;
  api._bezPoints = bezPoints;
  api._rnd = rnd;

  // Load orbit-loader.js first and these attach at OrbitLoader.shapes, as
  // the examples and README use them; load this file alone and they're
  // still reachable at OrbitLoaderShapes.
  if (global && global.OrbitLoader) global.OrbitLoader.shapes = api;
})(typeof window !== "undefined" ? window : undefined);
