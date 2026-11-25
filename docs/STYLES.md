# TraceLoop — style reference

Every style's options, defaults and controller. Defaults are quoted
from each file's doc comment — the source is the truth if this file
and the code ever disagree.

Shared conventions:

- `color: null` means "inherit `currentColor`" — the loader keeps
  whatever color its container's CSS gives it.
- `autoStart: true` begins animating at creation; pass `false` and
  call the controller's `start()` when you're ready.
- `prefers-reduced-motion: reduce` is checked once at creation in
  every style; when set, nothing moves and nothing blinks.
- Controllers always expose `start()`, `stop()`, `destroy()`,
  `isRunning()`, plus the style-specific members listed below.

The looping loaders are in this file; the one-shot transitions and
component styles live in [STYLES-UI.md](STYLES-UI.md).

The playground's **Components library** shows these same styles doing
real jobs inside finished blocks — navbar, hero, login, stats, FAQ,
pricing, footer, data table and more (63 categories, 170 demos). Each
card's usage panel copies a one-call-per-element recipe; see
`animations/scenes.js` and `animations/scenes-2.js` for the scene
configs and `playground/js/pg-render.js` (`buildScene`) for how parts
bind loaders to elements inside a mockup.

## OrbitLoader — `src/styles/orbit-loader.js`

The core crawler: a glowing segment traces the path forever.

    OrbitLoader.wrap(containerOrPathEl, options)

| option | default | meaning |
|---|---|---|
| `d` | required | the path to trace (a `d` string, or a resolved shape from `src/shapes/`) |
| `viewBox` | `"0 0 100 100"` | MUST match the coordinate space `d` was written in |
| `segmentFraction` | `0.18` | how much of the lap the glowing segment covers |
| `durationMs` | `2200` | time for one full lap |
| `direction` | `"forward"` | `"forward"` or `"reverse"` |
| `offset` | `0` | how far outside the container the SVG sits (px) |
| `color` | `null` | stroke color; omit for `currentColor` |
| `strokeWidth` | `null` | stroke width in px; stylesheet default is `2` |
| `steps` | `0` | metronome mode: when > 1 the segment sits, then snaps to the next of `steps` positions — ticking, not gliding (1 falls back to the glide — one slice is the whole lap) |
| `breathe` | `0` | breathing outline: the stroke-width swells by this fraction (0.5 = 50%) once per cycle |
| `breatheMs` | `1600` | one inhale-exhale cycle for `breathe` |
| `guideOpacity` | `0` | when > 0, a faint static copy of the path stays visible — essential for letters/words |
| `guideD` | same as `d` | a different path for the guide, if you want the guide to read a shape the crawler doesn't trace |
| `activeClass` | `"is-active"` | class added to the path while running |
| `autoStart` | `true` | |

Controller exposes: `path`, plus `start()` / `stop()` / `destroy()` /
`isRunning()`. `wrap()` adds `svg` and `container` (the guide, when
enabled, is `svg.querySelector('.orbit-loader-guide')`).

`wrap()` makes the container `position: relative` if it is static (the
injected SVG is absolutely positioned and would otherwise escape to the
nearest positioned ancestor) and restores the caller's value on
`destroy()`.

## DotLoader — `src/styles/dot-loader.js`

A traveling dot with a family of behaviors. Takes the same options as
OrbitLoader (`d`, `viewBox`, `durationMs`, `direction`, `offset`,
`guideOpacity`, `guideD`), plus:

| option | default | meaning |
|---|---|---|
| `dotRadius` | `3` | the dot's radius, in the path's own coordinate space |
| `dots` | `1` | how many dots travel the path, evenly spaced — 2+ turns one bead into a train |
| `color` | `null` | the dot's fill; omit for `currentColor` |
| `wobble` | `0` | the moth: the dot also breathes perpendicular to the path by this amplitude (path units) |
| `wobbleCycles` | `3` | full in-out undulations per lap for `wobble`; keep it whole so closed paths loop seamlessly |
| `trail` | `0` | breadcrumbs: this many ghost footprints follow the head, each smaller and fainter |
| `relay` | `false` | with `dots` > 1, only one dot is lit; the light passes along as the base position crosses each slot. Ignored when `crossing` is set (the flash owns the dots' opacity) |
| `crossing` | `false` | doubles the dots and sends the second half the opposite way; each pair flashes when it passes through itself |

Controller exposes: `path`, `dot` (the head), `dots`, `twins`,
`ghosts`, plus `start()` / `stop()` / `destroy()` / `isRunning()`;
`wrap()` adds `svg` and `container`. A `stop()`/`start()` cycle
restarts the lap from the path's start, like OrbitLoader. The
breadcrumb trail is cleared on stop — it never freezes visible.

`wrap()` makes the container `position: relative` if it is static and
restores the caller's value on `destroy()`.

## RippleLoader — `src/styles/ripple-loader.js`

Rings radiate from the container's center. Container-based:
`create()` and `wrap()` are the same call and take the container.

| option | default | meaning |
|---|---|---|
| `rings` | `3` | how many concentric rings are alive at once |
| `durationMs` | `1800` | one ring's full life: emerge at the center, expand, fade at the edge |
| `startScale` | `0.15` | the fraction of the box a ring spans when it's born |
| `strokeWidth` | `3` | ring stroke width, in the SVG's 100-unit space |
| `color` | `null` | ring color |
| `activeClass` | `"is-active"` | added to the container while running |
| `autoStart` | `true` | |

Controller exposes: `el`, `svg`, `circles`, plus `start()` / `stop()` /
`destroy()` / `isRunning()`. The container is made `position: relative`
if static and restored on `destroy()`. Reduced motion: nothing runs,
rings stay invisible.

## PulseLoader — `src/styles/pulse-loader.js`

A ring that breathes in place — swells and softens on the spot instead of
sending a segment around a path. Container-based: `create()` and
`wrap()` are the same call and take the container.

| option | default | meaning |
|---|---|---|
| `rings` | `2` | rings breathing at once, half a period apart |
| `durationMs` | `2000` | one full breath: swell out, settle back |
| `minScale` | `0.82` | the ring's rest size as a fraction of the box |
| `maxOpacity` | `0.7` | the ring's peak opacity at full swell |
| `strokeWidth` | `4` | ring stroke width, in the SVG's 100-unit space |
| `dot` | `true` | the steady center dot anchoring the pulse; `false` for rings only |
| `color` | `null` | ring and dot color |

## ChaseLoader — `src/styles/chase-loader.js`

Several short dashes evenly spaced around the path, chasing each other in
formation — the multi-runner relative of OrbitLoader. Path-based like the
core: `create()` takes a path element, `wrap()` takes a container plus
`options.d` (raw string, or a resolved shape from `src/shapes/`).

| option | default | meaning |
|---|---|---|
| `segments` | `3` | dashes in the formation |
| `segmentFraction` | `0.12` | each dash's length as a fraction of the path; clamped so gaps always remain |
| `durationMs` | `1600` | one full lap of the formation |
| `direction` | `'forward'` | `'reverse'` runs the lap the other way |
| `guideOpacity` | `0` | faint static copy of the path under the dashes (wrap only) |
| `color`, `strokeWidth`, `activeClass`, `autoStart` | as OrbitLoader | |

## TypingLoader — `src/styles/typing-loader.js`

The chat "typing…" wave. Container-based.

| option | default | meaning |
|---|---|---|
| `dots` | `3` | how many dots in the row |
| `durationMs` | `1000` | one dot's full rise-and-fall cycle |
| `staggerMs` | `180` | the delay between neighbors — what turns bounces into a traveling wave |
| `lift` | `0.3` | how high a dot rises, as a fraction of the SVG's height |
| `dotRadius` | `7` | dot radius, in the SVG's 100-unit space |
| `color` | `null` | dot color |

Controller also exposes: `dots` (the elements).

## HandshakeLoader — `src/styles/handshake-loader.js`

Two segments crawl from opposite ends, overlap and flash at the
meeting point, retract, rest, restart. Same options and controller as
OrbitLoader (plus `paths`, the two segment elements), plus:

| option | default | meaning |
|---|---|---|
| `durationMs` | `2400` | one full cycle: converge, flash, retract, rest |
| `meetAt` | `0.5` | where along the path the fronts meet, as a fraction of total length |
| `overlap` | `0.12` | how far past each other the fronts push during the flash |
