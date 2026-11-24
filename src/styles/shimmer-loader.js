/*!
 * ShimmerLoader — a loader style where the path is drawn as a wide,
 * translucent "filled" band (its two edges read as the boundaries of a
 * logo/outline), and a bright shimmer line with a soft glow travels
 * along the path's center — passing through the filled area rather than
 * along an empty outline.
 *
 * Pair it with shapes.infinity(size) for the classic use: a colour-filled
 * infinity sign with light running through it. But like every style here,
 * it animates whatever path it's given — any closed or open path works.
 *
 * It is a sibling style module, not a branch inside orbit-loader.js: it
 * duplicates the small amount of chase setup the core already has on
 * purpose, so each style file stays independently readable and a consumer
 * only loads the styles it uses. It does NOT require orbit-loader.js to
 * be loaded — only orbit-loader.css for base styling.
 *
 * Mechanics, all browser-native (no rAF, no per-frame math):
 *   - the band is a clone of the path stroked wide at low stroke-opacity
 *     (the "fill" between the boundaries);
 *   - the shimmer is the dasharray/dashoffset chase on the path itself,
 *     plus a second, wider, fainter clone animated with identical
 *     keyframes so it stays exactly in phase — that pair reads as a line
 *     of light with a soft head moving through the band.
 *
 * Usage:
 *   var shimmer = ShimmerLoader.wrap(document.querySelector('.logo-box'), {
 *     d: OrbitLoaderShapes.infinity(120),
 *     viewBox: '0 0 120 60'
 *   });
 *   shimmer.stop();
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Animate a shimmering line through a filled band along `pathEl`.
   * Takes the shared options the other styles take (same controller
   * shape), plus:
   *
   *   bandWidth    (default 10)   the filled band's stroke width, in the
   *                               path's coordinate units — this is the
   *                               distance between the two boundaries
   *   bandOpacity  (default 0.25) how strongly the band is filled; the
   *                               band's edges are what read as the logo
   *                               boundary, the shimmer runs through it
   *   strokeWidth  (default 2)    the shimmer line's own width; the glow
   *                               head is drawn at 3x this width
   *   color        (default null) stroke color for band + shimmer; omit
   *                               for currentColor
   *
   * The band and glow clones are created here and inserted next to the
   * path (they must share its SVG so coordinates line up); destroy()
   * removes them again since we own them. `pathEl` must therefore already
   * be inside an <svg> — via wrap() that's always true.
   *
   * Reduced motion is checked once at creation, exactly like the core:
   * if set, start() is a no-op and nothing becomes visible (the band is
   * a loader, not a static decoration — it either shimmers or isn't
   * there, same philosophy as the core's invisible-when-stopped thread).
   */
  function create(pathEl, options) {
    options = options || {};
    var segmentFraction = options.segmentFraction != null ? options.segmentFraction : 0.15;
    var durationMs = options.durationMs != null ? options.durationMs : 2400;
    var reverse = options.direction === "reverse";
    var activeClass = options.activeClass || "is-active";
    var autoStart = options.autoStart !== false;
    var color = options.color != null ? options.color : null;
    var strokeWidth = options.strokeWidth != null ? options.strokeWidth : 2;
    var bandWidth = options.bandWidth != null ? options.bandWidth : 10;
    var bandOpacity = options.bandOpacity != null ? options.bandOpacity : 0.25;

    var total = pathEl.getTotalLength();
    var segment = total * segmentFraction;
    var dasharray = segment + " " + (total - segment);
    pathEl.style.strokeDasharray = dasharray;
    if (options.strokeWidth != null) pathEl.style.strokeWidth = strokeWidth;
    if (color != null) pathEl.style.stroke = color;

    // The filled band and the glow head are clones of the path, inserted
    // under it (band first, then glow, then the path itself on top).
    // stroke-opacity carries the per-instance fill strength while the
    // element's own opacity stays free for the CSS fade in/out.
    var band = null;
    var glow = null;
    if (pathEl.parentNode) {
      band = document.createElementNS(SVG_NS, "path");
      band.setAttribute("d", pathEl.getAttribute("d"));
      band.setAttribute("class", "orbit-loader-band");
      band.style.strokeWidth = bandWidth;
      band.style.strokeOpacity = bandOpacity;
      if (color != null) band.style.stroke = color;
      pathEl.parentNode.insertBefore(band, pathEl);

      glow = document.createElementNS(SVG_NS, "path");
      glow.setAttribute("d", pathEl.getAttribute("d"));
      glow.setAttribute("class", "orbit-loader-shimmer-glow");
      glow.style.strokeWidth = strokeWidth * 3;
      glow.style.strokeOpacity = 0.3;
      glow.style.strokeDasharray = dasharray;
      if (color != null) glow.style.stroke = color;
      pathEl.parentNode.insertBefore(glow, pathEl);
    }

    // Checked once at creation, not live — same reasoning as the core.
    var reducedMotion = !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var shimmer = null;
    var glowAnimation = null;

    function start() {
      if (reducedMotion || shimmer) return;
      pathEl.classList.add(activeClass);
      if (band) band.classList.add(activeClass);
      if (glow) glow.classList.add(activeClass);
      // One keyframe pair, two animations: the glow clone runs the
      // identical dashoffset tween so it never drifts out of phase with
      // the line it's the glow of.
      var keyframes = [
        { strokeDashoffset: 0 },
        { strokeDashoffset: reverse ? total : -total }
      ];
      var timing = { duration: durationMs, iterations: Infinity, easing: "linear" };
      shimmer = pathEl.animate(keyframes, timing);
      if (glow) glowAnimation = glow.animate(keyframes, timing);
    }

    function stop() {
      if (shimmer) {
        shimmer.cancel();
        shimmer = null;
      }
      if (glowAnimation) {
        glowAnimation.cancel();
        glowAnimation = null;
      }
      pathEl.classList.remove(activeClass);
      if (band) band.classList.remove(activeClass);
      if (glow) glow.classList.remove(activeClass);
    }

    function destroy() {
      stop();
      pathEl.style.strokeDasharray = "";
      if (options.strokeWidth != null) pathEl.style.strokeWidth = "";
      if (color != null) pathEl.style.stroke = "";
      if (band && band.parentNode) band.parentNode.removeChild(band);
      if (glow && glow.parentNode) glow.parentNode.removeChild(glow);
    }

    if (autoStart) start();

    return {
      path: pathEl,
      band: band,
      glow: glow,
      start: start,
      stop: stop,
      destroy: destroy,
      isRunning: function () { return !!shimmer; }
    };
  }

  /**
   * Convenience wrapper, same contract as OrbitLoader.wrap(): builds the
   * <svg><path></svg> over `container` and calls create() on it. Takes
   * every option create() takes, plus `d` (required) and `viewBox`
   * (default "0 0 100 100") — `viewBox` MUST match the coordinate space
   * `d` was built in or the band won't line up with what it fills.
   *
   * Also takes `offset` (default 0), same meaning as OrbitLoader.wrap():
   * the injected SVG extends that many px beyond the container on every
   * side. No separate guide option here — the band itself already shows
   * the whole traced shape.
   */
  function wrap(container, options) {
    options = options || {};
    if (typeof container === "string") container = document.querySelector(container);
    if (!container) throw new Error("ShimmerLoader.wrap: container not found");
    if (!options.d) throw new Error("ShimmerLoader.wrap: options.d (an SVG path 'd' string) is required");

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", options.viewBox || "0 0 100 100");
    svg.setAttribute("class", "orbit-loader-path");
    svg.setAttribute("aria-hidden", "true");

    var offset = options.offset != null ? options.offset : 0;
    if (offset) {
      svg.style.inset = -offset + "px";
      svg.style.width = "calc(100% + " + (2 * offset) + "px)";
      svg.style.height = "calc(100% + " + (2 * offset) + "px)";
    }

    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", options.d);
    path.setAttribute("class", "orbit-loader-thread");
    svg.appendChild(path);
    container.appendChild(svg);

    var controller = create(path, options);
    controller.svg = svg;
    return controller;
  }

  global.ShimmerLoader = { create: create, wrap: wrap };
})(typeof window !== "undefined" ? window : this);
