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
container's top edge (made `position: relative` if static, restored
on `destroy()`). Five variants: `bar` (the trickle), plus the full-
page wipes `curtain`, `iris`, `slide` and `bars` — on the wipe
variants the demo loop runs cover/hold/reveal cycles and `done()` is
a no-op (the cycle owns the rhythm). The bar re-measures its real-
pixel viewBox on resize.

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
`fail()` settles the border once in the danger color (the trace color
is restored after), `reset()` returns to idle. Three variants:
`trace` (border crawl), `fill` (a color layer sweeps in and drains),
`ripple` (a circle expands from the press point). Container-based;
pass the button element. The button is made `position: relative` if
static and restored on `destroy()` — the feedback SVG lives inside it.

| option | default | meaning |
|---|---|---|
| `variant` | `'trace'` | `'trace'`, `'fill'` or `'ripple'` |
| `radius` | `8` | corner radius, px — match the button's border-radius |
| `durationMs` | `1100` | one lap around the perimeter |
| `segmentFraction` | `0.22` | the crawler's length as a fraction of the perimeter |
| `strokeWidth` | `2` | trace thickness, px |
| `color` | `null` | trace color |
| `dangerColor` | `'#e5484d'` | the `fail()` feedback color |

Controller also exposes: `svg`, `segment`/`layer`, `begin()`,
`success()`, `fail()`, `reset()`, `isRunning()` (the demo loop OR a
pending `begin()`). Reduced motion: every call is a no-op.

## ToastLoader — `src/styles/toast-loader.js`

The toast's countdown: `begin(ms)` drains a bar along the bottom edge
over `ms` (wall-clock accurate at any refresh rate; hover pauses the
clock without losing position), then stops. `dismiss()` stops early,
leaving the bar where it is. Container-based; the container is made
`position: relative` if static and restored on `destroy()`.

| option | default | meaning |
|---|---|---|
| `variant` | `'edge'` | `'edge'` (bottom rail), `'bar'` (inset track) or `'ring'` (corner timer circle) |
| `thickness` | `3` | bar thickness, px |
| `ringSize` | `22` | the ring variant's corner circle size, px |
| `durationMs` | `3200` | the demo loop's countdown length |
| `restMs` | `1200` | the demo loop's pause between toasts |
| `color` | `null` | bar color |
| `d` | `null` | optional path `d` — a curved bottom edge |
| `pauseOnHover` | `true` | hover pauses the countdown |

Controller also exposes: `svg`, `bar`, `begin(ms)`, `dismiss()`,
`start()`, `stop()`, `destroy()`, `isRunning()`. `begin(0)` is floored
to one frame's worth so a zero lifetime can't NaN the bar.

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

Controller exposes: `el`, `panels`, `index()`, `swapTo(i)` (wraps
modulo the panel count), `next()`, `start()`, `stop()`, `destroy()`,
`isRunning()` (the demo loop, including its one-rest click pause).
The container is made `position: relative` if static and restored on
`destroy()`; an in-flight trade is canceled on `destroy()` so no panel
is left stuck invisible.

## RouteLoader — `src/styles/route-loader.js`

The route/page content transition: new content arrives while the old
content leaves, driven by your code. Where SwapLoader trades between
panels that already exist, RouteLoader owns the content lifecycle — it
mounts the page you hand it, animates the old one out, and unmounts
it — which is what a route change needs. Container-based; the arriving
page sits in normal flow (so it defines the container's height even
when pages differ) while the leaving page is pinned as an absolute
overlay. The container is made `position: relative` if static and gets
`overflow: hidden` — a page transition is a closed world; override the
overflow in your own CSS if popovers must escape mid-transition.

    var route = RouteLoader.wrap('.view', { variant: 'wipe' });
    route.to('<h2>Page two</h2>…');            // HTML string
    route.to(element);                          // or an element (adopted)
    route.to(1);                                // or an items index
    route.to(x, { direction: 'right' });        // reverse

Variants: `fade` (crossfade), `slide` (old exits toward `direction`,
new enters from the opposite side), `wipe` (a cover panel sweeps
across; the content swaps underneath at the moment of full cover, then
the panel keeps travelling and departs — the swap is chained to the
cover animation's own finish event, so it can never fire early or
late; `durationMs` is the time to cover, the full crossing is twice
that).

A second `to()` while one is in flight cancels the first cleanly: the
newer call always wins, never a torn half-state. `items` plus
`autoStart` runs a demo loop over HTML pages (an empty container starts
on `items[0]`).

| option | default | meaning |
|---|---|---|
| `variant` | `'fade'` | `'fade'`, `'slide'` or `'wipe'` |
| `direction` | `'left'` | which way the content travels: `'left'`, `'right'`, `'up'`, `'down'` — for slide, the old page exits this way; for wipe, the panel travels this way |
| `exitMs` | `170` | the leaving page's fade/slide — exits accelerate, entrances decelerate |
| `durationMs` | `300` | the arriving page's fade/slide; for wipe, the time to cover |
| `distance` | `8` | slide travel, % of the container |
| `wipeColor` | `null` | the cover panel's color; omit for `var(--tl-card)` |
| `items` | `null` | HTML strings for the demo loop; `to(i)` indexes this list |
| `restMs` | `2400` | the demo loop's pause on each page |
| `onDone` | `null` | callback after each transition lands, with the mounted page; per-call `opts.onDone` wins |
| `autoStart` | `true` | run the demo loop when `items` exist |

Controller also exposes: `to(content, opts)`, `next()`, `index()`
(last items index shown, `-1` for custom content), plus the shared
`start()` / `stop()` / `destroy()` / `isRunning()`. Reduced motion:
every `to()` is an instant content swap — the page still changes,
nothing moves.

## PathWipeLoader — `src/styles/pathwipe-loader.js`

The path-wipe reveal: content is unmasked (or masked) by a traveling
shaped edge — a wave, a zigzag, a diagonal, an arc, or your own path
profile — sweeping across the container as an SVG clip-path. Where
RouteLoader's wipe swaps CONTENT under a rectangular cover panel,
PathWipe reveals or conceals the content that is already there, and
the edge is an actual SVG path, not a straight rectangular edge.
Container-based (the container IS the stage); the container is made
`position: relative` if static.

Mechanism: an SVG `<clipPath>` (userSpaceOnUse) holds the closed
reveal region — the edge profile closed toward the reveal side — and
the container is clipped with `clip-path: url(#id)`. The region
travels as one WAAPI transform on the path inside the clipPath, so the
browser composites the wipe; there is no per-frame JS. An optional
`edgeColor` line draws the open edge profile in an overlay SVG running
the same transform, so the front reads as a drawn stroke.

    var pw = PathWipeLoader.wrap('.reveal', { shape: 'wave', edgeColor: '#d97757' });
    pw.reveal();                    // edge sweeps across, content appears
    pw.conceal();                   // edge sweeps back, content hides
    pw.reveal({ direction: 'down' }); // per-call override

`reveal()` snaps the clip fully closed before animating open — a
re-reveal replays the wipe from the start. `conceal()` animates from
the edge's current position (read from the in-flight animation's
computed transform), so concealing mid-reveal never snaps or flashes;
a direction change mid-flight snaps to the new region's open end
instead, because the old region's coordinates mean nothing to the new
one. `show()` / `hide()` are the instant paths (and the reduced-motion
path — checked once at creation: reveal/conceal become show/hide, the
content still appears/hides, nothing moves).

| option | default | meaning |
|---|---|---|
| `shape` | `'wave'` | `'diagonal'`, `'wave'`, `'zigzag'`, `'arc'` or `'custom'` |
| `d` | `null` | custom edge profile (`'custom'`, or an override of a built-in): drawn across the container on the travel cross-axis; the library closes it toward the reveal side |
| `direction` | `'right'` | edge travel: `'left'`, `'right'`, `'up'`, `'down'` — `'right'` reveals from the left edge rightward; per-call override |
| `durationMs` | `700` | one reveal or conceal |
| `amplitude` | `0.12` | edge excursion, fraction of the travel span |
| `detail` | `4` | hump/tooth count for wave/zigzag |
| `edgeColor` | `null` | visible edge line on the reveal front |
| `restMs` | `1600` | demo loop pause between reveal/conceal |
| `autoStart` | `true` | run the demo loop at creation |
| `onDone` | `null` | callback after each reveal or conceal lands, with `'reveal'` or `'conceal'`; per-call `opts.onDone` wins |

Controller also exposes: `reveal(opts)`, `conceal(opts)`, `show()`,
`hide()`, plus the shared `start()` / `stop()` / `destroy()` /
`isRunning()`. Per-call opts: `direction`, `durationMs`, `onDone`.

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
| `variant` | `'bar'` | `'bar'` (continuous fill), `'ring'` (circular track), `'steps'` (fill quantizes to `steps` boundaries — each new segment pops the head; tick marks sit on the track), `'indeterminate'` (a chunk slides the track forever) |
| `steps` | `4` | segment count for the `'steps'` variant |

Controller also exposes: `el`, `svg`, `path`, `head`,
`setProgress(p)`, `done()`, `start()`, `stop()`, `destroy()`,
`isRunning()`. `setProgress` routes by variant: `'steps'` quantizes to
the nearest boundary, `'indeterminate'` stops the loop first,
everything else eases a continuous fill. Container calls get the
static-position fixup (restored on `destroy()`); a path-based call
never touches the caller's positioning. Under reduced motion
`setProgress()` still paints (a static fill is fine — it's not
motion); `steps` is floored at 1 so a zero count can't NaN the fill.

## SequenceLoader — `src/styles/sequence-loader.js`

The choreography API: a timeline of one-shot style calls. Each step
is a plain function (usually a call into a controller you already
built), timed `at` (ms from `play()`) or `after` (ms after the
previous step); steps are sorted by resolved time and ties keep call
order. No visuals of its own — it schedules.

```js
var seq = SequenceLoader.create([
  { at: 0,      do: function () { wipe.show(); } },
  { after: 350, do: function () { search.open(); } },
  { after: 500, do: function () { countup.start(); } }
], { onDone: function () {} });
seq.play();
```

| option | default | meaning |
|---|---|---|
| `loop` | `false` | replay the whole timeline after `loopRestMs` |
| `loopRestMs` | `800` | the pause between loop replays |
| `onDone` | `null` | called when the timeline finishes (not on `stop()`) |
| `onError` | `null` | called with `(error, stepIndex)` if a step's `do` throws — the sequence then stops as if `stop()` had been called; the error is still rethrown to the console |
| `autoPlay` | `false` | `play()` at creation |

Controller: `play()` (restarts a running sequence), `stop()` (fired
steps stay fired; pending steps never run), `destroy()`,
`isRunning()`, `duration()` (the last step's time), `firedSteps()`
(indices fired in the current run). The timeline is a setTimeout
chain — each step is scheduled when the previous one fires — so
`stop()` is exact and a throttled tab delays the tail instead of
reordering it. Under reduced motion the timeline still runs: it is
scheduling, not motion, and every style collapses itself to its
final state on its own.

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

Static hosts get the position fixup (restored on
`destroy()`); `isRunning()` is true while the demo loop runs OR the
field is open.

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

Static hosts get the position fixup (restored on
`destroy()`); `isRunning()` is true while the demo loop runs OR the
dialog is open.

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

Static hosts get the position fixup (restored on
`destroy()`); `isRunning()` is true while the demo loop runs OR the
section is open. `durationMs` is floored at 1.


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

The panel is caller-positioned by contract (fixed or
absolute) � no position fixup is applied; `isRunning()` is true while
the demo loop runs OR the drawer is open. `durationMs` is floored at 1.


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

Static hosts get the position fixup (restored on
`destroy()`); `isRunning()` is true while the demo loop runs OR the
menu is open.

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

Static hosts get the position fixup (restored on
`destroy()`); `isRunning()` is true while the demo loop runs OR the
field is focused/in a success or error state.

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
| `easing` | `'easeOutExpo'` | `linear`, `easeOutCubic`, `easeOutExpo` (fast start, long decelerating tail), `easeOutBack` (overshoots past the target and settles — playful, for small numbers), `easeOutBounce` (lands and bounces, like a dropped ball) or `easeOutElastic` (rings past the target and oscillates into place) |
| `decimals` | `0` | digits after the decimal point |
| `separator` | `','` | thousands separator; `null` for none |
| `prefix` / `suffix` | `''` | e.g. `"$"` / `"%"` |
| `restMs` | `0` | `0` runs once; `> 0` repeats the count after this pause (demo loops) |
| `autoStart` | `true` | start counting at creation |

Controller also exposes: `el`, `start()`, `stop()`, `destroy()`,
`isRunning()`, `value()`. `durationMs` is floored at 1 — a negative
duration used to make the rAF progress stay negative forever and loop
without end. Reduced motion prints the final value once (a number
that never moves is the accessible version). — `src/styles/shake-loader.js`

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

Controller also exposes: `el`, `start()`, `stop()`, `destroy()`,
`isRunning()`. Unknown variants fall back to the default amplitude;
`stop()` clears the inline transform so the element lands exactly
where it started.

## ShuffleLoader — `src/styles/shuffle-loader.js`

The reorder: a list that keeps reshuffling itself, each row gliding
from its old spot to its new one — task queues, standings,
leaderboards. The FLIP pattern (measure First, reorder Last, Invert,
Play) with this library's own reorder policy: one deterministic mover
per cycle, the last child promoted to the top by default, so demo
loops are reproducible and the eye can follow a single element
through the swap. Container-based, no CSS file; the container's
element children are the rows. Reduced motion: rows snap, no glide.

| Option | Default | Meaning |
|---|---|---|
| `intervalMs` | `2600` | the pause between shuffles — the demo loop's rhythm |
| `durationMs` | `480` | how long one glide takes |
| `moveFrom` | `'last'` | which child is promoted to the top each cycle: `'last'`, `'first'` (demotes instead), or an index |
| `easing` | fast-out curve | the glide's easing — items leave promptly, arrive gently |
| `autoStart` | `true` | shuffle on the loop immediately |

Controller also exposes: `container`, `shuffle()`, `start()`,
`stop()`, `destroy()`, `isRunning()`. Fewer than two children → no
loop. Reduced motion still promotes the row (a layout change, not
motion) but skips the glide.
