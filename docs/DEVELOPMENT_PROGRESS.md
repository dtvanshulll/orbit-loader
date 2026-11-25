# TraceLoop — Development Progress Tracker

The source of truth for incremental development. Read this first every
session; update it before ending one. Statuses: `NOT STARTED`,
`IN PROGRESS`, `REVIEW`, `POLISHING`, `VERIFICATION`, `COMPLETE`.

The audit report (2026-11-25) established the roadmap; the registered
audit protocol lives in [docs/rules/CODEBASE-AUDIT.md](rules/CODEBASE-AUDIT.md).

## Workstream: Website upgrade (playground + examples)

**Interrupted:** Component 2 — Path-Wipe Reveal was inspected (PRD/ROADMAP
read, RouteLoader template studied) but never started — no files written.
Resume it after the website workstream.

The website is `playground/` (index.html + 10 `pg-*` plain-script modules
sharing `window.PG` + 8 CSS partials) and `examples/` (3 static pages).
No framework, no build step — by design, same rules as the library.

### Phase 1 — Audit (COMPLETE)

**Preserve (already good):** `--pg-*` token system with motion tokens;
real generated controls that re-render; live search + sidebar filter +
scrollspy; copy with clipboard fallback + icon feedback; scene mockups;
skip link, focus trap in the nav drawer, reduced-motion handling; every
module under the 400-line ceiling.

**Findings (prioritized):**

1. **P1 — no lazy activation.** Entering the catalog renders all 176
   cards at once: **300 concurrent animations, 174 of 176 stages
   offscreen** (measured). Fix: IntersectionObserver-gated render —
   activate near the viewport, destroy + placeholder when it leaves
   (stages have min-heights, so placeholders prevent scroll jump).
2. **P2 — stale hardcoded counts.** About panel says "19 styles / 113
   live demos"; actual 24/176. Hero prose hardcodes the same numbers in
   words. Fix: compute both from the loaded configs (single source).
3. **P3 — bug:** `pg-nav.js` looks up `pg-nav-toggle`; the button's id
   is `pg-menu-btn` — aria-expanded isn't reset when a scene category
   closes the mobile drawer.
4. **P4 — dead code:** `buildEmbedBlock` (pg-snippet.js) has no caller;
   `PG.SCRIPTS` exists only for it.
5. **P5 — controls bug:** the `direction` select hardcodes
   forward/reverse; RouteLoader's direction is left/right/up/down, so
   route cards offer wrong values.
6. **P6 — polish:** no meta description/og tags; duplicate `radius` key
   in RANGES.

**Deliberate non-changes:** dark-only theme (the "dark lab bench" is the
documented DESIGN.md direction; loader colors and 176 config backgrounds
are tuned to it — a light theme would be a redesign, not an upgrade);
static script tags stay (parser-blocking order is the no-build
contract); Google Fonts stay external (preconnect + display=swap
already present); `examples/` stays as-is (consumer-facing examples,
not site chrome).

### Phases

- Phase 2 — architecture cleanup & bug fixes: `COMPLETE` (P2–P6 fixed;
  commit `a2ca3fd`)
- Phase 3 — design system: tokens already strong; focus-ring audit
  pending
- Phase 4 — reusable components: the pg-* modules already are them; no
  over-fragmentation planned
- Phase 5 — showcase infra: per-style direction options DONE (`a2ca3fd`);
  reset control pending
- Phase 6 — lazy loading & performance: `COMPLETE` (P1 fixed;
  300→9 concurrent animations on browse, verified across scroll cycles;
  scene-card live-flag leak found and fixed during verification)
- Phase 7 — page polish · Phase 8 — responsive/a11y review ·
  Phase 9 — regression gate: pending

**Watched item:** one transient tune-render left a stage empty
(unreproduced; render clears before building, so a mid-build throw
would leave a blank card). If it recurs, wrap the build half of
render() and re-queue on failure.

---

## Current category

**Category 1 — Page Transitions & Choreography**

Sequence: 1) Route/Page Transition System → 2) Path-Wipe Reveal →
3) Choreography / Sequence API.

## Current component

**Component 1 — RouteLoader (`src/styles/route-loader.js`)** — status: `COMPLETE`
(verified; see test log below).

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

## Fix batch — existing-component cleanup (COMPLETE)

Eight issues from the audit of existing components, all verified
against source and fixed across three commits (`3a75e1b`, `6aa5ef8`,
`4395979`):

1. **React adapter dropped `d`/`viewBox`/`width` for container-based
   styles** — forwarded. (`6aa5ef8`)
2. **`resolveD` silently rendered nothing on unknown shape names** —
   throws now. (`6aa5ef8`)
3. **React `Tabs` ignored `segFraction`** — the prop was never
   forwarded to TabLoader's `segmentFraction` (names differ), so the
   drawn underline kept the 0.16 default while `measure()` used the
   custom fraction; label text was also missing from the effect deps,
   so label changes left the underline under stale geometry. Both
   fixed; verified in-browser: `segFraction={0.5}` draws exactly 0.5
   of the rail, label swap re-measures. (`4395979`)
4. **React adapter didn't forward `d`/`viewBox`** — see #1. (`6aa5ef8`)
5. **ToastLoader depletion assumed 16.7ms frames** — drained ~2x too
   fast on 120Hz displays. Now driven by the rAF timestamp delta
   (wall-clock accurate at any refresh rate); hover-pause advances the
   timestamp without consuming lifetime. Verified in-browser: a 1000ms
   toast with a 400ms mid-count pause expires at ~1400ms. (`4395979`)
6. **ProgressLoader's `steps` variant was dead code** —
   `setProgressSteps()` existed but `setProgress()` never routed to
   it, so `steps` behaved exactly like the continuous fill. Routed
   (and the demo loop quantizes too); verified: `setProgress(0.3)`
   with `steps: 4` paints 0.25, continuous variant unquantized. Docs
   for `variant`/`steps` added to STYLES-UI. (`4395979`)
7. **DropdownLoader `select(i)` while closed mutated state** — guarded
   like its siblings `open()`/`close()`; verified no-op closed,
   functional open. (`4395979`)
8. **`wrap()` SVG boilerplate duplicated across orbit/dot/shimmer/chase/
   handshake loaders** — decision: **keep, documented**. Extracting a
   shared helper would break the standalone `<script>`-per-file
   contract (a sibling style must never import another style module);
   the duplication is noted in ARCHITECTURE's "Why loader styles are
   sibling files" section with a keep-in-sync warning. (`4395979`)

Regression gates for the batch: smoke 49 files OK, build OK,
route-test 44/44 PASS, `tests/fix-verify.html` 7/7 PASS, React
adapter mounts OK.

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
