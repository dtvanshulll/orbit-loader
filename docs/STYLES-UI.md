# TraceLoop — style reference: transitions & components

The one-shot transitions and component styles. The looping loaders
live in [STYLES.md](STYLES.md); the conventions there (color
inheritance, `autoStart`, reduced motion, controller basics) apply
here too.

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

## SwapLoader — `src/styles/swap-loader.js`

Two panels trading places: the leaving panel accelerates out (short,
fading) while the arriving one decelerates in from the far side. The
one-shot transition behind log-in/sign-up flips, tab bodies and wizard
steps. Container-based — the panels are the container's element
children, in swap order; give the container its final size.

`swapTo(i)` drives it for real UI; the demo loop cycles the panels.

| option | default | meaning |
|---|---|---|
| `axis` | `'x'` | `'x'` slides horizontally, `'y'` vertically |
| `exitMs` | `170` | the leaving panel's slide-and-fade — shorter than the entrance, exits accelerate |
| `durationMs` | `300` | the arriving panel's slide-and-fade |
| `restMs` | `2600` | the demo loop's pause on each panel |
| `distance` | `5` | slide distance, % of the container |
| `triggers` | `null` | clickable in-panel links that swap on click: `[{ sel: ".signup-link", to: 1 }]`. A click pauses the demo loop for one rest, so the click never fights the cycle |
| `autoStart` | `true` | run the demo loop immediately |
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
| `placement` | `'auto'` | `"top"` forces the menu to open upward (footer selectors near a card's bottom edge); `"bottom"` forces it downward (navbar rows near a card's top edge). Default `auto` flips by viewport room. |
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

## CountUpLoader — `src/styles/countup-loader.js`

The number: counts `el`'s text up from `from` to `to` — stat
cards, dashboards, totals, "users joined" badges. A rAF loop with an
easing on the progress; the value is clamped so a long frame can't
shoot past the target; decimals are fixed and thousands separators
applied at print time. Container-based: `create()` and `wrap()`
are the same call and take the element whose text the counter owns —
no CSS file. Reduced motion: the final value is set once, no count.

| Option | Default | Meaning |
|---|---|---|
| `from` | `0` | the value the count starts at |
| `value` | `100` | the value it lands on — not `to`, which the playground's scene renderer reserves for static fills |
| `durationMs` | `2000` | how long the count takes |
| `easing` | `'easeOutExpo'` | `linear`, `easeOutCubic`, `easeOutExpo` (fast start, long decelerating tail) or `easeOutBack` (overshoots past the target and settles — playful, for small numbers) |
| `decimals` | `0` | digits after the decimal point |
| `separator` | `','` | thousands separator; `null` for none |
| `prefix` / `suffix` | `''` | e.g. `"$"` / `"%"` |
| `restMs` | `0` | `0` runs once; `> 0` repeats the count after this pause (demo loops) |
| `autoStart` | `true` | start counting at creation |

## ShakeLoader — `src/styles/shake-loader.js`

The attention shake: the element judders in place and settles — an
invalid field, a rejected card, a row that can't be deleted.
Container-based, no CSS file; every keyframe is generated. Where
csshake rings at constant amplitude until removed, this is a damped
shake by default: the amplitude decays across the shot the way a
struck tuning fork settles, so the element reads as resisting and
giving up rather than glitching. Translate is mixed with a little
rotation — pure translate reads as sliding, the rotation is what
makes it read as shaking. Reduced motion: no shake at all.

| Option | Default | Meaning |
|---|---|---|
| `variant` | `'default'` | `'little'` (~1.5px, a polite nudge), `'default'` (~3px, a clear no), `'hard'` (~5px, alarm) |
| `durationMs` | `600` | the whole decayed shake |
| `decay` | `1` | how much the amplitude dies away: `1` settles to a quarter strength, `0` constant amplitude like csshake |
| `restMs` | `0` | `0` shakes once; `> 0` repeats after this pause (demo loops) |
| `autoStart` | `true` | shake at creation |
