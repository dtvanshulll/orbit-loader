/*!
 * TraceLoop shape helpers — outlines. letterOutline() draws AROUND a
 * letter: the contour of the stroke, so a crawler can travel the
 * outline while the letter's spaces stay visible in the guide. Prefers
 * the authored contours in outline-glyphs.js; falls back to offsetting
 * the letter() skeleton for letters not yet authored. See shapes-core.js
 * for the file map and the load order.
 */
(function (global) {
  "use strict";

  var PI = Math.PI;
  var api = global ? (global.OrbitLoaderShapes = global.OrbitLoaderShapes || {}) : {};
  // SSR import: the geometry namespace only exists through a real
  // global, so without a window there is nothing to build � stop here.
  if (!global) return;
  // Internals registered by the earlier files (underscore keys — see
  // shapes-core.js). Aliased locally so the math below reads as written.
  var GLYPH_ASPECT = api._aspect;
  var GLYPHS = api._glyphs;
  var rnd = api._rnd;
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
    var g = api._outlineGlyphs[char];
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

  api.letterOutline = letterOutline;
  // Internal: the outline-glyphs data file is built with this at load
  // time, so it must be on the api before that file loads.
  api._skeletonOutline = skeletonOutline;

  if (global && global.OrbitLoader) global.OrbitLoader.shapes = api;
})(typeof window !== "undefined" ? window : undefined);
