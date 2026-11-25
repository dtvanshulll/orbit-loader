# TraceLoop — Development Progress Tracker

The source of truth for incremental development. Read this first every
session; update it before ending one. Statuses: `NOT STARTED`,
`IN PROGRESS`, `REVIEW`, `POLISHING`, `VERIFICATION`, `COMPLETE`.

The audit report (2026-11-25) established the roadmap; the registered
audit protocol lives in [docs/rules/CODEBASE-AUDIT.md](rules/CODEBASE-AUDIT.md).

## Workstream: Website upgrade (playground + examples)

**Interrupted:** Component 2 — Path-Wipe Reveal was inspected (PRD/ROADMAP
read, RouteLoader template studied) but never started — no files written.
Resume it after the website workstream. **(Resolved: Component 2 is now
COMPLETE — see its record under Category 1.)**

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
- Phase 3 — design system: `COMPLETE` — focus-ring audit found one gap
  (About panel link + close button had no `:focus-visible`; everything
  else already covered); two hardcoded accent hexes moved onto
  `--pg-accent` / new `--pg-accent-hi` token (`0ba62cb`)
- Phase 4 — reusable components: the pg-* modules already are them; no
  over-fragmentation planned
- Phase 5 — showcase infra: `COMPLETE` — per-style direction options
  (`a2ca3fd`); Reset control + live Usage snippets (`0ba62cb`). Found
  while verifying: **every slider wrote the LAST option key** (var-in-
  loop closure bug, pre-existing) — multi-option cards' tuning controls
  silently set the wrong option. Fixed with per-iteration capture.
- Phase 6 — lazy loading & performance: `COMPLETE` (P1 fixed;
  300→9 concurrent animations on browse, verified across scroll cycles;
  scene-card live-flag leak found and fixed during verification)
- Phase 7 — page polish: `COMPLETE` — the mobile header/code fixes in
  Phase 8 covered the found polish gaps; desktop catalog verified by
  screenshot in Phases 5/6
- Phase 8 — responsive/a11y review: `COMPLETE` (`5b578df`). Found and
  fixed: menu-button click bubbled into the brand handler (stole focus
  into search + flipped to intro mid-drawer); the skip link was dead
  on real keyboards (fixed-position + off-screen transform is dropped
  from Chrome tab traversal — rebuilt with the clip-path pattern);
  phone header fit (wordmark clipped to "Th", search collapsed) —
  mark hidden, wordmark capped, responsive placeholder swap; code
  blocks scroll instead of mid-token wrapping on phones. Reduced-
  motion and contrast audited — already compliant.
- Phase 9 — regression gate: `COMPLETE` — smoke 49 OK, build OK,
  route-test 44/44, regression 7/7, react mounts, playground e2e
  (browse/lazy/copy/about/search) clean, no console errors.

**Watched item:** one transient tune-render left a stage empty
(unreproduced; render clears before building, so a mid-build throw
would leave a blank card). If it recurs, wrap the build half of
render() and re-queue on failure.

---

## Current category

**Category 1 — Page Transitions & Choreography**

Sequence: 1) Route/Page Transition System → 2) Path-Wipe Reveal →
3) Choreography / Sequence API.

## Existing-components cleanup workstream (IN PROGRESS)

Category order (by age × importance × unexamined surface — the fix
batch already cleared the known defects in transitions/components):

1. **Looping loaders** (orbit, dot, shimmer, ripple, pulse, chase,
   typing, handshake) — the oldest code and the library's identity;
   no dedicated test harness existed for any of them.
2. One-shot transitions (tab, page, button, toast, swap) — route/
   pathwipe already meet the bar.
3. Progress + feedback (progress, countup, shake, shuffle).
4. Component animations (search, modal, accordion, drawer, dropdown,
   input).
5. Cross-cutting: React adapter, `index.d.ts` LoaderOptions grab-bag
   dissolution (backlogged — a mass refactor if done all at once).

### Category 1 audit — looping loaders

All eight KEEP (each genuinely distinct; documented in ARCHITECTURE).
Shared findings across the path-based five (orbit, dot, shimmer,
chase, handshake):

- `wrap()` never fixes up a `position: static` container, though the
  injected SVG is absolutely positioned — the component styles all do
  this; the looping styles predate the pattern. Real visual bug.
- No dedicated test harness (only orbit appeared incidentally in
  other tests).
- Verified NON-issue: `getTotalLength()` under `display:none` works
  (pure path-data geometry per SVG2) — a deferred-measurement retry
  was prototyped for this and removed after the harness proved the
  hypothesis wrong; a regression test now pins the spec behavior.

Orbit-specific: `create()` on a non-path threw a cryptic TypeError
(now a clear error); the `steps` doc said "> 0" while the code needs
"> 1" (doc fixed); STYLES.md's controller line listed `guide`/`anim`
which the controller never exposed (doc fixed).

Order: orbit (reference implementation) → dot → shimmer → chase →
handshake (same fixup pattern) → ripple/pulse/typing verification →
docs sync → playground verification → category gate.

### Cleanup 1.1 — OrbitLoader (COMPLETE)

Decision: **IMPROVE**.

- `wrap()` makes a static container `position: relative` and restores
  the caller's value on `destroy()` (matches the component styles'
  forcedPosition pattern); `controller.container` exposed.
- `create()` rejects a non-`<path>` element with a clear message
  (was: cryptic `getTotalLength is not a function`).
- Doc truth: `steps` metronome requires > 1 (1 falls back to the
  glide — documented in the source header and STYLES.md).
- Deferred-measurement machinery prototyped for a suspected
  hidden-container bug was REMOVED after testing showed
  `getTotalLength()` works under `display:none` (SVG2 geometry is
  layout-independent); the behavior is pinned by a regression test
  instead.
- STYLES.md: controller shape corrected (`path` + start/stop/destroy/
  isRunning; wrap adds `svg`/`container` — the listed `guide`/`anim`
  never existed).

Tests: new `tests/orbit-test.html` — **34/34 PASS** (guards, visible
+ hidden measurement, static-host fixup + restore, steps/breathe/
reverse keyframe shapes via `effect.getKeyframes()`, guide, offset,
color/strokeWidth apply+clear, destroy restoration, reduced motion,
empty-d degenerate dasharray). Full gate: smoke 48/178 OK, build OK,
route/regression/dist PASS, playground orbit cards live with the SVG
anchored to the host (offset cards extend exactly `offset` px, as
documented).

## Current component

**Component 2 — PathWipeLoader (`src/styles/pathwipe-loader.js`)** — status: `COMPLETE`
(verified; see test log below).

### Completed work

- Sibling style module, container-based, ES5 IIFE — the container IS
  the stage; `create()` and `wrap()` are the same call.
- Mechanism: an SVG `<clipPath>` (userSpaceOnUse) holds the closed
  reveal region; the container is clipped with `clip-path: url(#id)`;
  the region travels as ONE WAAPI transform on the path inside the
  clipPath (browser-composited, no per-frame JS). Optional `edgeColor`
  overlay SVG draws the open edge profile with the same transform.
- Shapes: `diagonal`, `wave`, `zigzag`, `arc`, `custom` (consumer `d`
  sampled once via an offscreen SVG for its bounding box, closed
  toward the reveal side).
- Directions: `left/right/up/down`, per-call override.
- `reveal()` snaps fully closed then sweeps open (re-reveal replays);
  `conceal()` resumes from the in-flight animation's computed
  transform — no snap flash mid-reveal; a direction change mid-flight
  snaps to the new region's open end (old coordinates are meaningless
  to the new region).
- `show()`/`hide()` instant (also the reduced-motion path, checked
  once at creation). `hide()` closes along `lastDir || direction` so
  it never parks a foreign region.
- Demo loop (`conceal → rest → reveal → rest`) with a `looping` flag:
  every continuation re-checks it, so `stop()` during any phase ends
  the loop instead of letting the in-flight step's onDone restart it
  (bug found by the harness, fixed).
- `ensureDefs` re-applies the clip style on every call — `hide()`
  after `show()` used to leave the content visible because the early
  return skipped the style re-application (bug found by the harness,
  fixed).
- `canAnimate` = `!reducedMotion && el.animate` — the original draft
  had an `&&`/`||` precedence bug that would have animated under
  reduced motion.

### Files created

- `src/styles/pathwipe-loader.js` (400 lines — at the ceiling),
  `src/css/pathwipe.css`, `tests/pathwipe-test.html`.

### Files modified

- `scripts/build-css.js` (pathwipe in CSS order, 18 parts),
  `src/traceloop.js` (import/export/styles map), `src/index.d.ts`
  (PathWipeOptions, PathWipeCallOptions, PathWipeLoader, React
  `PathWipe` declare), `react/index.js` (PathWipe component),
  `playground/index.html` (script tag), `playground/js/pg-data.js`
  (GLOBALS + CONTAINER_STYLES), `playground/js/pg-sections.js` (UI
  transitions list), `animations/transitions.js` (2 demo cards),
  `README.md` (style table row + counts 24→25 styles, 176→178),
  `docs/STYLES-UI.md` (reference section).

### Tests performed

- `npm test` (smoke): PASS — 48 files, 178 animations registered.
- `npm run build`: PASS — ESM/UMD/React bundles + CSS (18 parts),
  PathWipeLoader present in all three bundles.
- `tests/pathwipe-test.html` in a real browser (agent-browser/CDP):
  **31/31 PASS** after fixing the two bugs above. Covers: create
  fixups, reveal/conceal lifecycle + onDone, conceal idempotence when
  closed, show/hide instant, all four built-in shapes, all four
  directions, custom `d`, `d`-without-shape forcing custom, edgeColor
  overlay presence, demo loop start/stop (incl. stop-during-flight),
  per-call direction override, invalid shape fallback, missing
  container throws, destroy restoration, reduced-motion instant path.
- Visual: playground PathWipe Wave Reveal + Zigzag cards render live
  (clip-path applied, edge overlay present, demo loop running, region
  transform verified moving across samples), code contained in the
  card.

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
route-test 44/44 PASS, `tests/regression.html` 7/7 PASS, React
adapter mounts OK.

## Backlog (discovered during this component, not fixed here)

- `index.d.ts`: `LoaderOptions` remains a grab-bag for the 20 older
  styles (React declares for Swap/CountUp/Shake/Shuffle now present,
  Route declare moved up with its siblings).

## Repository restructuring (COMPLETE)

Stages executed across commits `5047c37`, `c3c94e6`, `e0145a2`,
`f6d493b`, `0ba62cb` (types), `5b578df` (tracker):

1. **Root hygiene** (`5047c37`): 5 tracked `tmp-*.png` screenshots
   removed (committed by accident, zero references); react test
   bundles relocated from repo root into `tests/` with the test pages'
   script src updated; `.gitignore`'s five overlapping png patterns
   replaced by one anchored `/*.png`.
2. **Executed plans removed** (`c3c94e6`): `plans/001-003` all
   executed (dropdown placement documented, smoke.js shipped, filter
   fade shipped); `docs/superpowers/plans/` hybrid-redesign plan
   executed (playground has hero, sections, drawer, search). Git
   history preserves all.
3. **Misleading names fixed** (`e0145a2`): `src/css/variants.css` →
   `page-variants.css` (only PageLoader's wipe panels); `animations/
   scenes-more.js` → `scenes-2.js` (sequence now scenes.js, scenes-2,
   scenes-3 … scenes-13); `tests/fix-verify.html` → `regression.html`.
4. **Registration sprawl documented** (`0ba62cb`): ARCHITECTURE's
   "Why style registration stays in four explicit lists" — the wrap()
   boilerplate keep-in-sync note and the four-list rationale.

Regression gates for the restructuring: smoke OK, build OK,
`tests/regression.html` 7/7 PASS.

## Components remaining in this category

- Component 2 — Path-Wipe Reveal: `COMPLETE`
- Component 3 — Choreography / Sequence API: `NOT STARTED`

## Category completion

Not complete — 2 of 3 components done. Category gate runs after all
three.
