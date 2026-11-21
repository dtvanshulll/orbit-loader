# OrbitLoader — architecture

How the library actually works, for anyone modifying it (including future
you). The public API is in `README.md`; this file is the "why" behind it.

## The core trick

An SVG `<path>` can have a `stroke-dasharray` (alternating dash/gap
lengths) and a `stroke-dashoffset` (how far along the path the dash
pattern starts). If the dasharray is set to `[segment, total - segment]`
— one dash exactly `segment` long, one gap covering the rest of the
path's length — then animating `stroke-dashoffset` from `0` to
`-total` slides that single dash all the way around the path once,
looping back to its start. That's the entire animation; there is no
per-frame math, no requestAnimationFrame loop, no coordinate geometry.
The path itself supplies the shape, and the browser's own stroke
rendering supplies the bend through every corner/curve.

`total` comes from `pathEl.getTotalLength()` — a real browser API, not an
estimate — so this works identically for a straight line, a rounded
rectangle, a circle, or an arbitrary hand-drawn curve. This is *why* the
library can be shape-agnostic: it never needs to know what shape the path
describes, only its length.

## Why the Web Animations API, not `anime.js`

StoryClip's original splash animation (`storyclip/web/js/splash.js`) did
this same dasharray/dashoffset trick, but drove it with `anime.js`, a
~20 KB vendor script, for one simple linear tween. A standalone library
meant to be dropped into *any* project shouldn't force every consumer to
also load a separate animation library for something the browser can
already do natively.

`Element.animate()` (Web Animations API) has been supported in every
evergreen browser since 2017 and does the identical interpolation:

```js
pathEl.animate(
  [{ strokeDashoffset: 0 }, { strokeDashoffset: -total }],
  { duration, iterations: Infinity, easing: "linear" }
);
```

This is the whole animation. `create()` in `orbit-loader.js` is mostly
bookkeeping around this one call: computing `total`/`segment`, respecting
reduced-motion, and returning start/stop/destroy handles.

## Why `wrap()` is separate from `create()`

Two real use cases showed up while designing this:

1. A caller who already has hand-written SVG markup (their own logo's
   exact outline as a `<path>`) just wants the dash animation attached to
   an existing element — `create(pathEl, options)`.
2. A caller who doesn't want to hand-write `<svg viewBox="..."><path
   d="..."></svg>` every time just wants "wrap this box in an orbiting
   thread" — `wrap(container, { d, viewBox, ...options })`, which builds
   that markup and calls `create()` internally.

`wrap()` is sugar over `create()`, not a separate code path — it always
ends by calling `create()` on the path it just built, so there is exactly
one place that knows how to drive the animation.

## Why shapes are a separate file

`shapes.js` only produces `d` strings (plain string concatenation — no
DOM, no browser APIs). `orbit-loader.js` never imports or calls into it.
This split means:

- The core library has zero knowledge of what shapes exist. Adding a new
  one (hexagon, pill, star) never touches `orbit-loader.js`.
- A project that already has its own path strings (e.g. StoryClip's own
  icon outline) can skip `shapes.js` entirely and pass `d` directly.
- Shape math (rounded-rect corner arcs, circle as two 180° arcs because a
  single SVG arc command can't sweep 360°) stays in one small, easily
  tested file instead of being tangled into the animation logic.

## Reduced motion

Checked once, at `create()`-time, via
`matchMedia("(prefers-reduced-motion: reduce)")` — not a live listener.
Two deliberate consequences:

- A loader created while the OS setting is off and then changed mid-run
  keeps animating until it's naturally stopped/destroyed, rather than
  snapping to a stop mid-lap.
- If reduced motion is on, `start()` is a no-op and the path never gets
  its `activeClass` — `orbit-loader.css`'s `.orbit-loader-thread` default
  (`opacity: 0`) means the path is simply invisible, not present-but-
  frozen-mid-animation. There's no second "static fallback" render to
  maintain in parallel; the loader either orbits or isn't there.

## Deliberately out of scope for v1

- **Text measurement.** `shapes.underline()` takes a `width` you already
  know, rather than the library measuring a text node's rendered width
  via `getBBox()`/`getBoundingClientRect()`. Auto-measuring is tempting
  but couples the library to layout timing (fonts loaded? reflow
  happened?) that's much safer left to the caller, who already knows
  when their own text is ready.
- **Color/theming beyond `currentColor`.** The thread's stroke color is
  simply `currentColor`, so it inherits whatever `color` the container
  already has — no custom CSS properties to document or keep in sync with
  a design system that doesn't exist yet.
- **Multiple simultaneous segments on one path.** One dash, one gap. A
  "chasing dots" look (several short segments) would need a different
  dasharray pattern and isn't the same visual effect OrbitLoader is
  named for — see `ROADMAP.md`.
