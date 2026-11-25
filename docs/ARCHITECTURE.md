# TraceLoop — architecture

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

This is the whole animation. `create()` in `src/styles/orbit-loader.js` is mostly
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

`src/shapes/` only produces `d` strings (plain string concatenation — no
DOM, no browser APIs). `src/styles/orbit-loader.js` never imports or calls into it.
This split means:

- The core library has zero knowledge of what shapes exist. Adding a new
  one (hexagon, pill, star) never touches `src/styles/orbit-loader.js`.
- A project that already has its own path strings (e.g. StoryClip's own
  icon outline) can skip `src/shapes/` entirely and pass `d` directly.
- Shape math (rounded-rect corner arcs, circle as two 180° arcs because a
  single SVG arc command can't sweep 360°, glyph skeletons sampled into
  polylines so they can be offset letter-by-letter, and stroke-outline
  offsetting with miter/bevel joins for letterOutline) stays in one
  small, easily tested file instead of being tangled into the animation
  logic. Letters that need a truly clean crawl get hand-authored
  silhouettes instead (OUTLINE_GLYPHS: a closed outer contour the crawler
  travels, plus counter contours for the inside spaces, each starting
  bottom-left and running clockwise). The full set — A–Z and 0–9 — is
  authored, because a generated offset can't produce a clean union
  outline where strokes meet; single-stroke glyphs (C, G, S, U, J, 2,
  3, 5, 6, 9) are derived from their skeletons by one shared helper
  (`skeletonOutline`) instead of being hand-pointed twice.

## Why loader styles are sibling files, not options

`dot-loader.js` duplicates a little of what
`src/styles/orbit-loader.js` does (the `wrap()` markup-building, the reduced-motion
check) on purpose. They are different *visual styles* with genuinely
different mechanics — the dot can't use dasharray at all and needs a
per-frame `getPointAtLength()` rAF loop — so an option flag in the core
would be a branch, and a shared "effects helper" would be an abstraction
with one user. A sibling file per style keeps each one readable on its
own, lets a consumer load only the styles it uses, and means none of them
depends on `src/styles/orbit-loader.js` (only the shared `src/css/` for base
styling). See "Adding a new loader style" in `README.md` for the rule
going forward.

The same goes for the `wrap()` SVG boilerplate (svg element, viewBox,
size measurement, reduced-motion flag) that `orbit`, `dot`,
`chase` and `handshake` each carry their own copy of. It looks like the
obvious thing to extract — and that is the trap: a shared helper would
make every style file depend on it, ending the load-one-style standalone
contract. The duplication stays; if the boilerplate ever needs to
change, change it in every file that carries it in the same commit (a
grep for `createElementNS` across `src/styles/` finds them all).

`ripple-loader.js` is the extreme case of the same principle: it has no
path at all — rings radiate from the container's center — so it doesn't
even take a path element. `create()` and `wrap()` are the same call,
both take the container, and the whole effect is staggered infinite
WAAPI loops on `transform`/`opacity` (no rAF, no dasharray). Forcing
that into the core as an option would have meant a second code path for
"styles that aren't paths" hiding inside a path library.

`tether-loader.js` joins it as the third container-based style (a ball
on a rope around a center pole — rAF state machine, no path).
`clock-loader.js` sits at the other end of the spectrum: it traces a
path like the core but keeps STATE (which lap markers are lit), which
is why it's a sibling file with its own rAF loop rather than an option
on the core's stateless linear tween. `handshake-loader.js` stays
WAAPI-only but needs TWO interpolating segments (dasharray AND
 dashoffset together, one pinned to each end of the path) — again a
different choreography, not a tweak of the core's single-segment tween.

The transition styles (tab/page/button/toast/progress) are a
third category entirely: ONE-SHOT and triggered. Loop styles exist to
run forever; these exist to play once per UI action — a tab click, a
navigation, a submit, a toast's lifetime, a download
percentage. That difference is architectural, not cosmetic: their
APIs expose play()/begin()/done()/setProgress() instead of a loop, and
each ships a self-running demo loop only so previews (like the
playground) can show them without wiring real interactions.

`typing-loader.js` is the second case of the same shape: the chat
"typing…" dots don't trace a path either, so it is also container-based
(`create()` === `wrap()`, takes the container) and rides staggered
infinite WAAPI loops. Two container-based siblings now prove the
sibling-file rule scales past the path styles without touching the core.

`sequence-loader.js` is the fourth kind: it has no visuals at all. It
is the choreography API — a timeline that schedules calls into
controllers the caller already built (steps are plain functions, timed
`at`/`after`), so the library stays decoupled from every style's method
names. It lives in `src/styles/` to keep one home for `create()`-shaped
modules, ships no CSS, has no playground cards (there is nothing to
render), and the smoke gate counts it like any other source file.

## Reduced motion

Checked once, at `create()`-time, via
`matchMedia("(prefers-reduced-motion: reduce)")` — not a live listener.
Two deliberate consequences:

- A loader created while the OS setting is off and then changed mid-run
  keeps animating until it's naturally stopped/destroyed, rather than
  snapping to a stop mid-lap.
- If reduced motion is on, `start()` is a no-op and the path never gets
  its `activeClass` — `src/css/`'s `.orbit-loader-thread` default
  (`opacity: 0`) means the path is simply invisible, not present-but-
  frozen-mid-animation. There's no second "static fallback" render to
  maintain in parallel; the loader either orbits or isn't there.

## Deliberately out of scope for v1

- **Text measurement beyond the opt-in helpers.** `textBoxForElement()`
  reads a rect from an element you hand it, at call time, because a
  caller asked for it — but the core `underline()`/`letter()`/`text()`
  stay measurement-free, and nothing auto-measures behind your back.
  Layout timing (fonts loaded? reflow happened?) stays the caller's
  decision.
- **Color/theming beyond the `color` option.** Both styles default to
  `currentColor` and a plain `color` override exists because a consumer
  asked for one; anything richer (CSS custom properties, gradients,
  design-system integration) stays out of scope until asked for.
- **Multiple simultaneous segments on one path.** One dash, one gap. A
  "chasing dots" look (several short segments) would need a different
  dasharray pattern and isn't the same visual effect OrbitLoader is
  named for — see `ROADMAP.md`.

## Why style registration stays in four explicit lists

Adding one animation style touches four hand-maintained places:

1. `src/traceloop.js` — one `import './styles/<name>-loader.js'` line
   (required: esbuild bundles what the entry imports; a glob or a
   generated list would need a build step where the library itself has
   none).
2. `src/css/<name>.css` + one entry in `scripts/build-css.js`'s `order`
   array (required: the concatenated `dist/traceloop.css` order is
   semantic — base tokens first, per-style blocks, variant overrides
   last — and no directory listing can express that intent).
3. `playground/index.html` — one `<script src="../src/styles/…">` tag
   (required: parser-blocking script tags keep the no-build dev site
   simple; the alternative is async loading and race conditions).
4. `playground/js/pg-data.js` — one `GLOBALS` entry (key → global
   constructor name) and a `CONTAINER_STYLES` entry (container-based
   vs path-based; intrinsic metadata about the style, not derivable).

A shared "style registry" file cannot centralize these: the library
must never depend on the playground, the playground must never depend
on the ESM entry, and the CSS order is semantic rather than
alphabetical. The lists stay explicit and hand-synced — if you add a
style, change all four in the same commit. A grep for the style's key
across `src/ scripts/ playground/` finds them all.
