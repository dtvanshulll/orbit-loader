/*!
 * TraceLoop shape helpers — text. Letter and word paths drawn from
 * hand-authored glyph skeletons, plus textBoxForElement() for wrapping
 * a live text element. See shapes-core.js for the file map and the
 * load order (core, text, outline-glyphs, outline).
 *
 * Registers the internals the outline file builds on (_aspect, _glyphs,
 * _rnd) — underscore keys are internal, not consumer API.
 */
(function (global) {
  "use strict";

  var PI = Math.PI;
  var api = global.OrbitLoaderShapes = global.OrbitLoaderShapes || {};
  // textBoxForElement draws a rounded box via core geometry.
  var roundRect = api.roundRect;
  var rnd = api._rnd;
var arcPoints = api._arcPoints;
  var bezPoints = api._bezPoints;
  var GLYPH_ASPECT = 0.6;


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

  api.letter = letter;
  api.text = text;
  api.textBoxForElement = textBoxForElement;
  // Internals for shapes-outline.js — see the file map in shapes-core.js.
  api._aspect = GLYPH_ASPECT;
  api._glyphs = GLYPHS;

  if (global.OrbitLoader) global.OrbitLoader.shapes = api;
})(typeof window !== "undefined" ? window : this);
