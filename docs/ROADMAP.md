# OrbitLoader — roadmap

Not built yet. Ideas here are things that fit the library's purpose, not a
promise of when they land — pick one up when a real use case needs it,
rather than building ahead of need.

## More loader styles (sibling modules, not branches in the core)

Per the "adding a new loader style" note in `README.md`, each of these
would be its own file (`pulse-loader.js`, etc.) with its own `create()`,
never an `if (style === ...)` branch inside `src/styles/orbit-loader.js`. The core
stays the single-dash-chasing-a-path effect; anything visually different
is a different module that can reuse `src/shapes/` for its path math.

- **Pulse ring** — a ring that scales/fades in place instead of a segment
  that travels. No dasharray needed at all; a plain CSS
  `@keyframes` scale+opacity animation on a static shape.
- **Multi-segment "chasing dots"** — several short dashes evenly spaced
  around the path (a dasharray with more than one dash/gap pair),
  rotating together. Closest relative of the current effect — likely the
  easiest to add first if this is ever needed.
- **Fading trail behind DotLoader's dot** — the dot style itself shipped
  (`dot-loader.js`); a trail of dimming ghost dots behind it is the
  natural next step if a use case asks for it.
- **Varying dot count per lap** — `dots: [3, 8, 1]` growing and
  shrinking the train as it travels (an idea that was once documented
  as shipped; it never was — recorded here where it belongs).

## More shape generators

Add-only, in `src/shapes/`, each a pure function returning a `d` string:

- `hexagon(size)`, `pill(width, height)` — more outline presets.
- `roundedSquareAsymmetric(size, radii)` — independently-radiused corners,
  for logos that aren't uniformly rounded.

## More glyph coverage

`shapes.letter()`/`shapes.text()` ship A-Z, 0-9 and space as hand-drawn
single-stroke skeletons. Add-only, if a use case shows up:

- Lowercase letters and punctuation (`!`, `?`, `.`).
- Per-glyph widths (currently monospaced at `0.6 · size` on purpose, so
  `text()` needs no metrics).
- `letterOutline` for whole words (`textOutline`) — the per-stroke
  outline offsetting already exists; composing it across a string with
  overlapping-stroke cleanup is the missing piece.
- A text-along-a-curve variant (letters placed along an arc instead of a
  baseline).

## Packaging — DONE (was roadmap)

Shipped: npm package `traceloop` with a minimal esbuild build step
(`npm run build` → `dist/`), no runtime dependencies, shipping the
exact same source files as an ESM bundle + a UMD build for `<script>`
tags + a React adapter (`traceloop/react`) + a hand-written
`index.d.ts`. The source files remain vanilla and script-tag friendly;
the build only bundles, it doesn't rewrite.

What's still open here:

- Actually `npm publish` once the GitHub rename lands.
- CI: build + smoke-test `dist/` on push.

## Components and page transitions

Shipped (no longer open): dropdown, input focus, notification-badge
and skeleton territory (skeletons were removed as a style — see the
tracker), simple page transitions (route fade/slide/wipe), the
path-wipe reveal, and the choreography API (`SequenceLoader`, a
timeline of one-shot style calls).

Still open in this area:

- Notification badge and skeleton-to-content component patterns, if
  a real use case shows up.

**Framework wrappers:** the React adapter ships in-package
(`traceloop/react`, one component per style — see README). Further
framework-specific wrapper packages (a Vue directive, a Svelte store,
etc.) remain explicitly not planned: any framework can call
`OrbitLoader.wrap()`/`create()` directly inside its own lifecycle
hooks (`onMounted`, `$effect`, ...) with no wrapper needed;
maintaining one wrapper per framework is a maintenance cost this
library doesn't need to take on.

## Other ideas worth revisiting if a real need comes up

- **Pause-on-hidden-tab.** `Element.animate()` already pauses
  automatically when the tab is backgrounded (browser-native behavior,
  no extra code needed) — noting this here so nobody re-adds a
  `visibilitychange` listener to "fix" something that isn't broken.
- **A `<style>`-free mode** for Shadow DOM consumers, where
  `orbit-loader.css` would need to be imported as a constructable
  stylesheet rather than a global `<link>`. Only worth doing once a
  Shadow DOM consumer actually exists.
- **Direction auto-detection** so `direction: "reverse"` isn't needed for
  paths drawn counter-clockwise — low priority, since it's one option the
  caller can just set correctly once.
