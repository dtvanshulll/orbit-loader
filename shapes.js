/*!
 * OrbitLoader shape helpers — optional sugar that generates an SVG "d"
 * string for a common outline, so you don't have to hand-write the path
 * arithmetic for the easy cases. OrbitLoader itself (orbit-loader.js)
 * doesn't depend on this file at all: it animates whatever path you give
 * it, built here or written by hand.
 *
 * Add a new shape by adding a new function here — the core library never
 * needs to change for it.
 */
(function (global) {
  "use strict";

  /**
   * A square of `size` with corners rounded by `radius`, starting and
   * ending at the midpoint of the top edge — matches the path StoryClip's
   * splash screen uses for its 84x84 logo box (radius 24).
   */
  function roundedSquare(size, radius) {
    var s = size, r = radius;
    return (
      "M" + r + ",0" +
      " H" + (s - r) +
      " A" + r + "," + r + " 0 0 1 " + s + "," + r +
      " V" + (s - r) +
      " A" + r + "," + r + " 0 0 1 " + (s - r) + "," + s +
      " H" + r +
      " A" + r + "," + r + " 0 0 1 0," + (s - r) +
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
   * x=`width` — pair with OrbitLoader.wrap over a text element to trace a
   * loading thread back and forth under a word instead of around a shape.
   */
  function underline(width, gap) {
    gap = gap != null ? gap : 4;
    return "M0," + gap + " H" + width;
  }

  var shapes = { roundedSquare: roundedSquare, circle: circle, underline: underline };

  // Load orbit-loader.js first and these attach at OrbitLoader.shapes, as
  // the examples and README use them; load this file alone and they're
  // still reachable at OrbitLoaderShapes.
  if (global.OrbitLoader) global.OrbitLoader.shapes = shapes;
  global.OrbitLoaderShapes = shapes;
})(typeof window !== "undefined" ? window : this);
