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

The playground's **Components library** shows these same styles doing
real jobs inside finished blocks — navbar, hero, login, stats, FAQ,
pricing, footer, data table and more (19 categories, 85 demos). Each
card's usage panel copies a one-call-per-element recipe; see
`animations/scenes.js` and `animations/scenes-more.js` for the scene
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
| `steps` | `0` | metronome mode: when > 0 the segment sits, then snaps to the next of `steps` positions — ticking, not gliding |
| `breathe` | `0` | breathing outline: the stroke-width swells by this fraction (0.5 = 50%) once per cycle |
| `breatheMs` | `1600` | one inhale-exhale cycle for `breathe` |
| `guideOpacity` | `0` | when > 0, a faint static copy of the path stays visible — essential for letters/words |
| `guideD` | same as `d` | a different path for the guide, if you want the guide to read a shape the crawler doesn't trace |
| `activeClass` | `"is-active"` | class added to the path while running |
| `autoStart` | `true` | |

Controller also exposes: `path`, `guide`, `svg`, `anim`.

## DotLoader — `src/styles/dot-loader.js`

A traveling dot with a family of behaviors. Takes the same options as
OrbitLoader (`d`, `viewBox`, `durationMs`, `direction`, `offset`,
`guideOpacity`, `guideD`), plus:

| option | default | meaning |
|---|---|---|
| `dotRadius` | `3` | the dot's radius, in the path's own coordinate space |
| `dots` | `1` | how many dots travel the path, evenly spaced (or `dots: [3, 8, 1]` to vary the count per lap) |
| `color` | `null` | the dot's fill; omit for `currentColor` |
| `wobble` | `0` | the moth: the dot also breathes perpendicular to the path by this amplitude (path units) |
| `wobbleCycles` | `3` | full in-out undulations per lap for `wobble`; keep it whole so closed paths loop seamlessly |
| `trail` | `0` | breadcrumbs: this many ghost footprints follow the head, each smaller and fainter |
| `relay` | `false` | with `dots` > 1, only one dot is lit; the light passes along as the base position crosses each slot |
| `crossing` | `false` | doubles the dots and sends the second half the opposite way; each pair flashes when it passes through itself |

Controller also exposes: `dot(s)`, `twins`, `ghosts`.

## ShimmerLoader — `src/styles/shimmer-loader.js`

A soft light band sweeps the path like brushed metal.

| option | default | meaning |
|---|---|---|
| `bandWidth` | `10` | the filled band's stroke width, in path units |
| `bandOpacity` | `0.25` | how strongly the band is filled; the glow rides on top of it |
| `strokeWidth` | `2` | the shimmer line's own width |
| `color` | `null` | stroke color for band + shimmer |
| `durationMs`, `viewBox`, `offset`, `guideOpacity`, `guideD`, `autoStart` | as OrbitLoader | |

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

## TabLoader — `src/styles/tab-loader.js`

The tab underline, as a one-shot primitive: `play(from, to)` crawls it
from one fraction of the rail to another, stretching mid-flight.
Container-based. `start()` runs a demo loop that switches tabs forever.

| option | default | meaning |
|---|---|---|
| `labels` | `null` | array of strings — renders a clickable label row above the rail and overrides `tabs` |
| `tabs` | `4` | how many tabs the demo loop cycles through |
| `segmentFraction` | `0.16` | the underline's length as a fraction of the rail |
| `durationMs` | `700` | one crawl between tabs |
| `restMs` | `1500` | the demo loop's pause on a tab |
| `stretch` | `1.5` | how much the segment stretches mid-crawl (1 = rigid slide) |
| `strokeWidth` | `3` | underline thickness, px |
| `color` | `null` | underline color |
| `d` | `null` | optional path `d` string — a curved tab rail |

Controller also exposes: `segment`, `play(from, to)`, `set(f)`.

## PageLoader — `src/styles/page-loader.js`

The top-of-page progress bar: `start()` trickles toward 90%,
`done()` sweeps to 100% and fades. Container-based; pins to the
container's top edge.

| option | default | meaning |
|---|---|---|
| `thickness` | `3` | bar thickness, px |
| `durationMs` | `3600` | how long the demo trickle runs before `done()` fires |
| `restMs` | `1400` | the demo loop's pause after done |
| `color` | `null` | bar color |
| `d` | `null` | optional path `d` — a curved top edge |

Controller also exposes: `bar`.

## ButtonLoader — `src/styles/button-loader.js`

The button's own border is the pending-progress track: `begin()`
crawls the perimeter, `success()` lights the whole border and fades,
`reset()` returns to idle. Container-based; pass the button element.

| option | default | meaning |
|---|---|---|
| `radius` | `8` | corner radius, px — match the button's border-radius |
| `durationMs` | `1100` | one lap around the perimeter |
| `segmentFraction` | `0.22` | the crawler's length as a fraction of the perimeter |
| `strokeWidth` | `2` | trace thickness, px |
| `color` | `null` | trace color |

## ToastLoader — `src/styles/toast-loader.js`

The toast's countdown: `begin(ms)` drains a bar along the bottom edge
over `ms`, then stops. `dismiss()` stops early. Container-based.

| option | default | meaning |
|---|---|---|
| `thickness` | `3` | bar thickness, px |
| `durationMs` | `3200` | the demo loop's countdown length |
| `restMs` | `1200` | the demo loop's pause between toasts |
| `color` | `null` | bar color |
| `d` | `null` | optional path `d` — a curved bottom edge |

Controller also exposes: `bar`, `begin(ms)`, `dismiss()`.

## ProgressLoader — `src/styles/progress-loader.js`

Determinate progress along any path: `setProgress(p)` fills the path
from its start to fraction `p`, with a glowing head dot at the
frontier; `done()` snap-fills the rest. Path-based like the core —
pass a path element, or a container plus `d`.

| option | default | meaning |
|---|---|---|
| `d` | required with a container | the track's path data |
| `viewBox` | `"0 0 100 100"` | the SVG's viewBox |
| `width` | `100%` | CSS width of the injected SVG |
| `strokeWidth` | `2` | track stroke width, px |
| `headRadius` | `3` | the frontier dot's radius, px |
| `color` | `null` | fill and head color |
| `guideOpacity` | `0.3` | the unfilled track's opacity |

Controller also exposes: `path`, `head`, `setProgress(p)`, `done()`.

## SearchLoader — `src/styles/search-loader.js`

The search bar: `open()` widens the field and draws its underline out
from the left with a glowing head; `close()` retracts both. The
underline is a path, so it crawls with the same dasharray motion as
everything else; the width animates with a CSS transition in step.

| Option | Default | Meaning |
|---|---|---|
| `collapsedWidth` | `44` | the field's resting width, px |
| `expandedWidth` | `260` | the field's open width, px |
| `durationMs` | `450` | one open or close |
| `restMs` | `1400` | the demo loop's pause per state |
| `strokeWidth` | `2` | underline thickness, px |
| `color` | `null` | underline color; omit for currentColor |
| `placeholder` | `'Search'` | text that fades in once the field is open; `''` for none |
| `autoStart` | `true` | run the demo loop immediately |

Controller also exposes: `open()`, `close()`, `toggle()`, `line`,
`icon` (the Lucide magnifier — ring draws, then the handle),
`placeholder`.

## ModalLoader — `src/styles/modal-loader.js`

The dialog entrance: the backdrop fades, the panel rises and settles,
and the panel's border traces itself once on arrival. A modal whose
border draws itself reads as *assembled*, not *appeared*.

| Option | Default | Meaning |
|---|---|---|
| `radius` | `12` | panel corner radius, px |
| `durationMs` | `480` | one open or close |
| `restMs` | `1600` | the demo loop's pause per state |
| `strokeWidth` | `2` | border-trace thickness, px |
| `color` | `null` | trace color; omit for currentColor |
| `backdrop` | `true` | inject and fade a backdrop sibling |
| `backdropPosition` | `'fixed'` | `'fixed'` for real dialogs; `'absolute'` for previews |
| `autoStart` | `true` | run the demo loop immediately |

Controller also exposes: `open()`, `close()`, `frame`,
`closeBtn` (the Lucide X — draws after the border trace; clicking it
closes the dialog).

## AccordionLoader — `src/styles/accordion-loader.js`

The expanding section: `open()` grows the panel's height and draws its
left edge downward with a glowing head, so the eye follows the reveal
instead of jumping to the end state.

| Option | Default | Meaning |
|---|---|---|
| `durationMs` | `420` | one open or close |
| `restMs` | `1500` | the demo loop's pause per state |
| `strokeWidth` | `2` | edge thickness, px |
| `closedHeight` | `0` | resting height, px — pass the header row’s height so it stays visible while the body collapses |
| `color` | `null` | edge color; omit for currentColor |
| `autoStart` | `true` | run the demo loop immediately |

Controller also exposes: `open()`, `close()`, `toggle()`, `edge`,
`chevron` (Lucide chevron-down — draws on first open, rotates with
every toggle after).


## DrawerLoader — `src/styles/drawer-loader.js`

The drawer, as a component: the panel slides in from its edge while
the edge facing the content draws itself — a left drawer's right edge
draws downward, a bottom sheet's top edge draws across. Three types
via `side`: `'left'`, `'right'`, and `'bottom'` (bottom sheet, with a
grab handle that draws after the edge lands).

| Option | Default | Meaning |
|---|---|---|
| `side` | `'left'` | `'left'`, `'right'`, or `'bottom'` |
| `durationMs` | `420` | one open or close |
| `restMs` | `1600` | the demo loop's pause per state |
| `strokeWidth` | `2` | leading-edge thickness, px |
| `color` | `null` | edge color; omit for currentColor |
| `backdrop` | `true` | inject and fade a backdrop sibling |
| `backdropPosition` | `'fixed'` | `'fixed'` for real drawers; `'absolute'` for previews |
| `handle` | `true` | bottom-sheet grab handle; `false` to skip |
| `autoStart` | `true` | run the demo loop immediately |

Controller also exposes: `open()`, `close()`, `toggle()`, `edge`,
`backdrop`.


## DropdownLoader — `src/styles/dropdown-loader.js`

The select menu: the panel drops from the trigger while its border
draws itself, items stagger in top-down, and `select(i)` draws a
Lucide check beside the chosen row before closing. Flips upward
automatically when there is no room below. The trigger button is built
for you inside the container.

| Option | Default | Meaning |
|---|---|---|
| `items` | `['Option 1', …]` | the menu rows |
| `trigger` | `'Options'` | the trigger button's label |
| `placement` | `'auto'` | `"top"` forces the menu to open upward (footer selectors near a card's bottom edge) |
| `durationMs` | `320` | one open or close |
| `restMs` | `1400` | the demo loop's pause per state |
| `color` | `null` | border/check color; omit for currentColor |
| `autoStart` | `true` | run the demo loop immediately |

Controller also exposes: `open()`, `close()`, `toggle()`,
`select(i)`, `value()`, `trigger`, `panel`, `frame`.

## InputLoader — `src/styles/input-loader.js`

The text field: `focus()` draws the underline with the label floating
up, `success()` hands the line to mint and draws a Lucide check at the
right edge, `error()` hands it to red and shakes the field once,
`blur()` retracts everything.

| Option | Default | Meaning |
|---|---|---|
| `label` | `'Email'` | the floating label text; `''` for none |
| `value` | `''` | typed value — the demo loop types it in after focus, character by character |
| `durationMs` | `360` | one focus or blur |
| `restMs` | `1500` | the demo loop's pause per state |
| `strokeWidth` | `2` | underline thickness, px |
| `color` | `null` | focus underline; omit for currentColor |
| `autoStart` | `true` | run the demo loop immediately |

Controller also exposes: `focus()`, `blur()`, `success()`,
`error()`, `line`, `label`, `status`.
