# TraceLoop — Development Progress Tracker

The source of truth for incremental development. Read this first every
session; update it before ending one. Statuses: `NOT STARTED`,
`IN PROGRESS`, `REVIEW`, `POLISHING`, `VERIFICATION`, `COMPLETE`.

The audit report (2026-11-25) established the roadmap; the registered
audit protocol lives in [docs/rules/CODEBASE-AUDIT.md](rules/CODEBASE-AUDIT.md).

## Current category

**Category 1 — Page Transitions & Choreography**

Sequence: 1) Route/Page Transition System → 2) Path-Wipe Reveal →
3) Choreography / Sequence API.

## Current component

**Component 1 — RouteLoader (`src/styles/route-loader.js`)** — status: `VERIFICATION`
(final verification pass done; see test log below).

### Completed work

- Sibling style module, container-based, ES5 IIFE — follows the
  swap-loader/shake-loader patterns.
- Variants: `fade`, `slide`, `wipe` (cover panel crosses; content swap
  chained to the cover animation's finish event — no timer drift).
- Direction: `left/right/up/down`, per-call override = reversal.
- Content lifecycle: mounts HTML strings (via `<template>`), adopts
  elements, indexes `items`; old page pinned as absolute overlay while
  animating out, removed on finish; arriving page in normal flow so it
  defines container height.
- Cancellation: a newer `to()` snaps any in-flight transition (current
  slot transfers at mount for fade/slide, at cover for wipe — the fix
  for the orphaned-page bug found in testing).
- Reduced motion / no WAAPI: instant content swap.
- Demo loop over `items` (empty container auto-starts on `items[0]`).
- `onDone(page)` callback (controller-level and per-call).

### Files created

- `src/styles/route-loader.js`, `src/css/route.css`,
  `tests/route-test.html`, `docs/rules/CODEBASE-AUDIT.md` (registered
  standing rule), this tracker.

### Files modified

- `scripts/build-css.js` (route in CSS order), `src/traceloop.js`
  (import/export/styles map), `src/index.d.ts` (RouteOptions,
  RouteCallOptions, RouteLoader, React `Route` declare),
  `react/index.js` (Route component), `playground/index.html` (script
  tag + hero counts), `playground/js/pg-data.js` (GLOBALS/SCRIPTS/
  CONTAINER_STYLES/RANGES), `playground/js/pg-sections.js` (UI
  transitions list), `animations/transitions.js` (2 demo cards),
  `README.md` (style table row + counts), `docs/STYLES-UI.md`
  (reference section), `AGENTS.md` + `CLAUDE.md` (standing rules +
  file list).

### Tests performed

- `npm test` (smoke): PASS — 47 files, 176 animations registered.
- `npm run build`: PASS — ESM/UMD/React bundles + CSS (17 parts),
  RouteLoader present in all three bundles.
- `tests/route-test.html` in a real browser (agent-browser/CDP):
  **44/44 PASS, stable across 4 consecutive runs.** Covers: create
  fixups, initial capture, string/element/index content, onDone,
  rapid re-cancellation, wipe cover-swap + mid-cover cancel, destroy
  cleanup, reduced-motion instant swap, invalid input, empty+items,
  demo loop start/stop/destroy, 1ms durations.
- Visual: playground Route Wipe/Route Slide cards render full page
  content, contained, nothing clipped; wipe cover panel verified
  mid-sweep in a controlled trigger.

### Issues discovered → fixed

1. **Orphaned mid-flight page** (high): during fade/slide, `current`
   still pointed at the old page, so a mid-flight `to()` orphaned the
   mounted page forever. Fixed: the arriving page owns the settled
   slot from mount (fade/slide) or from the cover beat (wipe).
2. **Whitespace HTML accepted** (medium): `"   "` produced a bare
   text-node page. Fixed: strings with no element children and no
   trimmed text are rejected.
3. **`opts._done` leaked into the caller's options object** (low).
   Fixed: `done` passed as an argument.
4. **Dead `timer` variable and dead CSS rule** (low). Removed.
5. **Wipe panel invisible in the demo cards** (low): panel color
   `--tl-card` equaled the demo box background. Fixed: demo boxes use
   `--tl-raised`.
6. **Test harness raced WAAPI finish events** (medium, harness): fixed
   timeouts race frame production on a loading page. Rewritten to await
   each transition's own `onDone`.

### Remaining work for this component

- None known. (Pre-existing, out-of-scope items are backlogged below.)

## Backlog (discovered during this component, not fixed here)

- `index.d.ts`: React declares missing for Swap/CountUp/Shake/Shuffle;
  `LoaderOptions` remains a grab-bag for the 20 older styles.
- `AGENTS.md` Files list never gained lines for swap/countup/shake/
  shuffle loaders (route-loader's line was added with this component).
- `docs/STYLES.md` claims "60 categories, 94 demos"; the playground
  registry lists 46 — one is stale.
- Root `tmp-*.png` screenshots should be removed or gitignored.
- Uncommitted working tree (predates this component; commit pending).

## Components remaining in this category

- Component 2 — Path-Wipe Reveal: `NOT STARTED`
- Component 3 — Choreography / Sequence API: `NOT STARTED`

## Category completion

Not complete — 1 of 3 components done. Category gate runs after all
three.
