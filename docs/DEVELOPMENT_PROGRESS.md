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

1. **Looping loaders** (orbit, dot, ripple, pulse, chase, typing,
   handshake — shimmer REMOVED from the library during the component
   cleanup, see its record below) — the oldest code and the library's
   identity; dedicated harnesses now exist for orbit and dot.
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

Order: orbit (reference implementation) → dot → shimmer (REMOVED
instead — see the component-cleanup record) → chase → handshake
(same fixup pattern) → ripple/pulse/typing verification → docs sync →
playground verification → category gate.

### Component cleanup — ShimmerLoader REMOVED; Shell Toast, Skeleton
### demos, Logo Strip removed; orbit overuse corrected; ButtonLoader
### gains fail() (COMPLETE, uncommitted)

Driven by an external audit directive. Stage-by-stage:

**Removed from the library:**

- `ShimmerLoader` (the component the directive named "Shimmer"):
  source, CSS, build order, traceloop entry, React adapter, types,
  playground script/GLOBALS/band ranges, 3 looping-section cards,
  STYLES.md section, README row. Its usage profile was the
  placeholder-sheen family the directive prunes (skeletons, logo
  sheen, hover sheen); with its scene surface removed it had no
  remaining job. Styles: 25 → 24 (7 looping).
- Scene demos: Skeleton Card + Skeleton List [Skeleton], Logo Strip
  [Logos], Blog Teaser [Blog] (shimmer-dependent), Shell Toast
  [Application Shell]. Categories Logos + Blog emptied and dropped
  from the sidebar registry; Skeleton was an orphan category (never
  registered).
- `examples/infinity-banner.html` (a whole page built on Shimmer);
  shimmer figure/script/css links removed from the other examples.

**Registration bug fixed:** 20 scene categories (Button, Skeleton,
Rating, Form, Toast, Auth, …) had demos but no sidebar section — they
all piled into the first scene grid ("Navbar"). SCENE_SECTIONS now
covers every category: 63 sections = 63 categories, zero orphans.

**Orbit overuse corrected (judged per demo, not bulk-swapped):**

- The five CHART demos (Sparkline Stat, Live Counter, Dashboard Mini,
  Revenue Chart, Donut Chart) drew data with the loader's glowing
  comet — misread as loading. Converted to ProgressLoader, whose
  solid fill reads as data plotting itself; guide lines preserved.
- Save Spinner [Form]: the orbit ring inside the button is gone; the
  button's own border trace (ButtonLoader) carries the wait.
- Kept, with reasons: the path-trace demos (underlines, check draws,
  strike-throughs, annotation, magnifier, sort arrow, spines) — those
  ARE the library's core competency; and the meaningful rings
  (selection, presence, play, pager, active tool) — the ring is the
  state indicator, not decoration. Orbit remains an independent
  component with its own demo cards.

**Button overhaul:**

- Audited all 10 button experiences (ButtonLoader + Button/Auth/
  Social/Checkout/Hero/Download/CTA/Form demos). All KEEP — each
  shows a distinct pattern (fill, trace, ripple, check-draw,
  paired-count); none redundant.
- ButtonLoader: new `fail()` state on all three variants (trace:
  danger-color border settle with trace-color restore; fill: danger
  sweep-drain; ripple: danger pulse from center), new `dangerColor`
  option (default #e5484d). File held at exactly 400 lines.
- Button demos now presented under their own "Button" sidebar section
  (was: piled into Navbar via the orphan fallback).
- Fixed: Button Loading's note claimed a check handoff the config
  never had (note now matches); Sidebar Icons' note said "skeleton"
  (searchable residue — reworded).

**Verified:** smoke 47 files / 170 animations, build 4/4 (CSS 17
parts), all six harnesses PASS (orbit 34, dot 26, route 44, pathwipe
31, regression 7, dist), playground 170 cards no errors, search
returns 0 for shimmer/skeleton/blog/shell toast, fail() danger color
verified in-browser, mobile 375px layout intact (no overflow).

### CATEGORY 1 GATE — looping loaders (PASS)

All 7 components through the full lifecycle. Gate checks:

- **Full regression**: smoke 47/170 OK, build 4/4, ALL 11 harnesses
  PASS (orbit 34, dot 26, ripple 23, pulse 25, chase 28, typing 25,
  handshake 23 = 184 looping checks; route 44, pathwipe 31,
  regression 7, dist, tabs).
- **API consistency** (verified from source, not assumed): all 7
  check reduced motion once at creation, wire `activeClass`, apply
  the static-container fixup (in `create()` for container-based, in
  `wrap()` for path-based), and expose `start/stop/destroy/
  isRunning`. Path-based styles guard their input with a clear
  `<path>` error and expose `path`; container-based styles throw
  "container not found" and expose `el`/`svg` — consistent within
  each family.
- **Gate fix**: Pulse and Chase were missing their React type
  declares in `index.d.ts` (the adapter exported them; the hints
  didn't exist). Added — all 7 now declare in types.
- **Docs**: STYLES.md has a section + controller line for all 7;
  README table rows present; zero Shimmer residue.
- **Exports/registration**: traceloop entry (16 refs), React adapter,
  types, playground — all present for all 7.
- **Website**: 70 looping cards render, no init errors; lazy
  activation working (cards run when scrolled into view).

**Verdict: Category 1 PASSES its completion gate.** Next category:
2 — one-shot transitions (tab, page, button, toast, swap; route and
pathwipe already meet the bar).

## Category 2 audit — one-shot transitions

Evidence scan (lines, guards, fixups, clamps, harness existence,
docs): tab 272L (has React tabs-test coverage; its SVG is in-flow —
no escape bug), page 367L (fixup + clamps present, no harness),
button 400L (trace SVG absolutely positioned INSIDE the button —
escape bug, no harness), toast 320L (1 clamp, no harness), swap
196L (fixup never restored, no isRunning, untracked swap animations,
no controller docs, no harness). Order: button → swap → page →
toast → tab → gate.

### CATEGORY 2 GATE — one-shot transitions (PASS)

All 5 components through the full lifecycle (route and pathwipe
already met the bar at ship time).

- **Full regression**: smoke 47/170 OK, build 4/4, ALL 13 harnesses
  PASS (button 28, swap 22, page 29, toast 19 + the 7 looping
  harnesses 184 checks + route 44 + pathwipe 31 + regression 7 +
  dist + tabs).
- **API consistency** (verified from source): all 5 check reduced
  motion once, expose `isRunning()`, clean up in `destroy()`, and
  carry robustness clamps. 4 of 5 apply the static-container fixup +
  restore — tab legitimately doesn't (its SVG is in-flow, nothing to
  escape). All 5 have Controller sections in STYLES-UI (swap's was
  absent before this category).
- **Recurring bug pattern found and fixed category-wide**: triggered
  styles kept animations/timers the demo loop created without
  tracking them, so `stop()`/`destroy()` mid-flight left frozen
  states (swap's fill:forwards panels, page's fill:both bars). Both
  now track and cancel.
- **Website**: 33 transition cards render, no init errors.

**Verdict: Category 2 PASSES its completion gate.** Next category:
3 — progress + feedback (progress, countup, shake, shuffle).

### Cleanup 3.1 — progress + feedback styles (COMPLETE)

Category 3 audit: progress 353L (57 demos, no harness), countup 176L
(10 demos), shake 129L (4 demos), shuffle 180L (4 demos). None had
the static-container fixup.

- **ProgressLoader**: `steps: 0` divided by zero in
  `setProgressSteps` (NaN fill) — floored at 1; container calls now
  get the static-position fixup (restored on destroy; path calls
  never touch the caller's positioning).
- **CountUpLoader**: negative `durationMs` made the rAF progress
  stay negative forever — an infinite loop; floored at 1.
- **ShakeLoader / ShuffleLoader**: `durationMs` floored at 1 to
  match (WAAPI treats negative as 0, churning the repeat loop).
- STYLES-UI: all three feedback styles gained the Controller shape
  (they had none); progress's dual-mode ownership documented.

Tests: new `tests/progress-test.html` **15/15 PASS** (dual-mode,
continuous + steps quantization, done(), indeterminate rAF loop,
fixup, destroy ownership, reduced motion, steps clamp); new
`tests/feedback-test.html` **22/22 PASS** (count formatting/easing/
repeat/clamp, shake variants/decay/reduced, shuffle FLIP/determinism/
clamps). Gate: smoke 47/170, build OK.

### Cleanup 2.5 — TabLoader (COMPLETE)

Decision: **KEEP — polish only** (the healthiest of the category:
React tabs-test coverage, in-flow SVG, resize handling, destroy
cleanup all already present).

- Robustness clamps to match the siblings: `segmentFraction`
  0.01–1 (values > 1 drew an underline longer than the rail),
  `stretch` ≥ 1 (below 1 the segment contracts mid-crawl — the doc
  defines 1 as rigid), `strokeWidth` ≥ 0, `durationMs` ≥ 1,
  `restMs` ≥ 0.
- No dedicated vanilla harness: tab's behavior is covered by
  `tests/tabs-test.jsx` (React, 12 checks), the smoke run, and the
  playground cards — a third overlapping harness would test the same
  dash math a third time.

Verified: TABS READY, smoke 47/170, build OK, playground tab cards
running.

### Cleanup 2.4 — ToastLoader (COMPLETE)

Decision: **IMPROVE**.

- Static-position fixup applied but never restored on `destroy()`;
  now saved/restored.
- `begin(0)` divided the per-frame drain by a zero lifetime (NaN
  dasharray) — floored at one frame's worth (16ms).
- Clamps: `thickness` ≥ 1, `ringSize` ≥ 3× thickness (a ring smaller
  than its own stroke broke the corner geometry), `durationMs` ≥ 1,
  `restMs` ≥ 0.
- STYLES-UI: variants, `pauseOnHover`, wall-clock behavior, and the
  full controller shape documented (was a 2-line stub).

Tests: new `tests/toast-test.html` — **19/19 PASS** (edge/bar/ring
variants, wall-clock drain, dismiss-in-place, hover pause + resume,
begin(0) NaN guard, static host, destroy, reduced motion).

### Cleanup 2.3 — PageLoader (COMPLETE)

Decision: **IMPROVE**.

- Untracked cycle animations: the wipe variants' cover/hold/reveal
  animations were local to `runCycle()` and never canceled — the
  `bars` variant animates with `fill: both`, so a `stop()` mid-cycle
  left the bars frozen mid-extension. Cycle animations are now
  tracked and canceled in `stop()`/`destroy()`.
- The static-position fixup was applied but never restored on
  `destroy()`; now saved/restored.
- Clamps: `barCount` rounded + floored at 1 (0 built zero panels and
  the wipe cycle stalled silently — `onfinish` never fired to schedule
  the next cycle), `thickness` ≥ 1, `durationMs` ≥ 1, `restMs` ≥ 0.
- STYLES-UI: variants documented, `done()`'s no-op on wipe variants
  documented, resize re-measure documented.

Tests: new `tests/page-test.html` — **29/29 PASS** (bar trickle/done
lifecycle, curved-d path measuring, all four wipe variants' cycles,
stop-mid-cycle freeze check, clamps, resize re-measure, destroy,
reduced motion).

### Cleanup 2.2 — SwapLoader (COMPLETE)

Decision: **IMPROVE**.

- `destroy()` mid-swap left panels stuck invisible: the trade's two
  WAAPI animations hold `fill: forwards` (opacity 0 on the leaving
  panel) and were never tracked or canceled. Now tracked and canceled
  in `destroy()`.
- `isRunning()` was missing entirely — every other style exposes it.
  Returns the demo loop's engaged state (including the one-rest click
  pause, truthfully).
- The static-position fixup was applied but never restored on
  `destroy()`; now saved/restored like the looping loaders.
- Input clamps: `exitMs`/`durationMs` ≥ 1 (negatives reach WAAPI,
  which throws), `restMs`/`distance` ≥ 0.
- STYLES-UI: controller shape documented (was absent).

Tests: new `tests/swap-test.html` — **22/22 PASS** (validation,
swap mechanics incl. modulo wrap of out-of-range/negative indices,
static host, destroy-mid-swap opacity check, trigger swap + resume,
reduced-motion instant settle, clamps).

### Cleanup 2.1 — ButtonLoader (COMPLETE)

Decision: **IMPROVE**.

- The trace SVG is absolutely positioned INSIDE the button; a static
  button (the common case) let it escape to the nearest positioned
  ancestor. All three variants force `position: relative` and restore
  on `destroy()`; verified anchored to the button box.
- `isRunning()` only reflected the demo loop; a manual `begin()` left
  it false. Now returns demo-loop OR pending begin.
- The harness caught a real flaw in `fail()`: the danger color was
  swapped in and synchronously restored, so it never showed. The fill
  variant now rides the danger color IN the drain keyframes and
  restores the caller's fill on finish.

Tests: new `tests/button-test.html` — **28/28 PASS** (guards,
static-host anchoring, trace/fill/ripple lifecycles, `fail()` on all
three variants, demo loop, destroy restoration, reduced motion).
STYLES-UI ButtonLoader section expanded (variants, fail, dangerColor,
isRunning semantics).

### Cleanup 1.7 — HandshakeLoader (COMPLETE)

Decision: **IMPROVE**.

- `wrap()` static-container fixup + restore; `controller.container`
  exposed; `svgClassName`/`pathClassName` options (parity).
- `create()` rejects a non-`<path>` element with a clear error.
- Clamps: `meetAt` to 0.01–0.99 (values outside built dashes past the
  path end — negative dasharray gaps), `overlap` to 0–0.5.
- `destroy()` now preserves a caller-set inline opacity on the path:
  the 0.8 flash opacity is set UNCONDITIONALLY (it is the mechanism),
  so the old unconditional clear wiped the caller's own value — the
  one style where "clear what we set" needed a saved prior value.

Tests: new `tests/handshake-test.html` — **23/23 PASS** (guards,
two-segment choreography: mirrored keyframe anchors A-at-start /
B-at-end, peak-past-midpoint overlap, clamps, static host, guide,
class overrides, caller-opacity preservation, clone removal, reduced
motion). Gate: smoke 47/170, build OK.

### Cleanup 1.6 — TypingLoader (COMPLETE)

Decision: **IMPROVE** (same container-based pattern as ripple/pulse).

- Static-container fixup + restore; `activeClass` added (typing didn't
  even have the option — now documented and wired like the others);
  input clamps (`dots` rounded + floored at 1, `staggerMs` ≥ 0 so
  negative values can't produce negative delays, `lift` 0–1 so dots
  can't sink or fly out of the viewBox, `dotRadius` ≥ 0).

Tests: new `tests/typing-test.html` — **25/25 PASS** (duality, even
spacing, wave stagger via `effect.getTiming()`, activeClass wiring,
clamps incl. keyframe-level lift and negative-delay/dotRadius checks,
color serialization, destroy restoration, reduced motion, missing
container). Gate: smoke 47/170, build OK.

### Cleanup 1.5 — ChaseLoader (COMPLETE)

Decision: **IMPROVE**.

- `wrap()` static-container fixup + restore; `controller.container`
  exposed (the shared path-based defect).
- `create()` rejects a non-`<path>` element with a clear error.
- `segmentFraction` floored at 0 (negative fractions built a nonsense
  dasharray); the existing upper clamp (0.9/segments, documented) is
  now covered by a test.
- Controller gains `path` as an alias of `el` — orbit and dot expose
  `path`; chase was the odd one out.
- `wrap()` gains `svgClassName`/`pathClassName` (orbit/dot parity;
  were hardcoded).

Tests: new `tests/chase-test.html` — **28/28 PASS** (guards,
formation math: 4 dash/gap pairs summing to the period, upper+lower
fraction clamps, direction keyframes, shape-spec resolution, guide,
class overrides, container exposure, color/strokeWidth apply+clear,
destroy restoration, reduced motion). Gate: smoke 47/170, build OK.

### Cleanup 1.4 — PulseLoader (COMPLETE)

Decision: **IMPROVE** (same pattern as ripple — the two container-based
styles shared the same gaps).

- Static-container fixup + restore; `activeClass` was a dead option
  (documented, never wired) — now added on `start()`/removed on
  `stop()`; input clamps (`rings` floored at 1 + rounded, `minScale`
  0.05–1, `maxOpacity` 0.05–1, `strokeWidth` ≥ 0).

Tests: new `tests/pulse-test.html` — **25/25 PASS** (duality, ring+dot
build, half-period stagger via `effect.getTiming()`, dot base clock,
activeClass wiring, dot toggle, clamps incl. minScale/maxOpacity
keyframe inspection, color serialization, destroy restoration,
reduced motion, missing container). Gate: smoke 47/170, build OK.

### Cleanup 1.3 — RippleLoader (COMPLETE)

Decision: **IMPROVE**.

- `wrap()`/`create()` static-container fixup + restore (the category's
  shared defect; ripple is container-based so it applied directly).
- `activeClass` was a dead option — documented, never wired. Now added
  to the container on `start()` and removed on `stop()`, matching the
  other styles' contract.
- Input clamps: `rings` rounded and floored at 1 (0/negative built zero
  rings and a permanently idle loader), `startScale` clamped to
  0.01–1, `strokeWidth` floored at 0.

Tests: new `tests/ripple-test.html` — **23/23 PASS** (duality, ring
build, stagger timing via `effect.getTiming()`, activeClass wiring,
clamps, color serialization, destroy restoration, reduced motion,
missing container). Gate: smoke 47/170, build OK.

### Cleanup 1.2 — DotLoader (COMPLETE)

Decision: **IMPROVE**.

- `stop()` now clears the ghost breadcrumbs' opacity — previously a
  stopped loader left its trail frozen visible, contradicting the
  stylesheet's "invisible whenever no rAF loop is running" contract
  (bug found by reading `stop()` against the CSS comment).
- `start()` after `stop()` restarts the lap from the path's start with
  an empty trail history — OrbitLoader's fresh-lap semantics (was:
  silently continued from the stopped position; sibling inconsistency).
- `wrap()` static-container fixup + restore (same as orbit);
  `controller.container` exposed.
- `create()` rejects a non-`<path>` element with a clear error.
- `relay` is ignored when `crossing` is set (the flash owns the dots'
  opacity — the two modes silently fought per frame before);
  documented in the source header and STYLES.md.
- `wrap()` gains `svgClassName`/`pathClassName` (orbit parity; were
  hardcoded).
- STYLES.md: removed the nonexistent `dots: [3, 8, 1]` array form
  (documented-but-never-implemented; idea recorded in ROADMAP);
  controller shape corrected.

Tests: new `tests/dot-test.html` — **26/26 PASS** (guards, on-path
positioning, trail build + stop clearing, restart semantics, static
host fixup, relay/crossing/precedence, wobble deviation, color
serialization, full destroy, reduced motion). Full gate: smoke
48/178 OK, build OK, orbit/route/regression/dist PASS, playground
dot card live and positioned.

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
