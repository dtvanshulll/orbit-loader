# 003 — Fade the catalog grid on search re-filter

- **Status**: TODO
- **Commit**: 644f4f4
- **Severity**: LOW
- **Category**: missed opportunity (jarring content swap)
- **Estimated scope**: 2 files (~15 lines): `playground/js/pg-filter.js`, `playground/css/page.css`

## Problem

Typing in the header search re-renders the catalog grid instantly —
141 cards teleport between filter states with no transition. This is
the highest-frequency animated seam in the playground (every keystroke
while filtering) and it currently reads as a hard cut. Per the audit's
category 8: a state change that teleports where a brief transition
would prevent a jarring change.

Frequency check: this fires per keystroke, so the fix must be cheap —
opacity only, no movement, no stagger, no per-card delay.

## Target

In `playground/js/pg-filter.js`, after the re-render replaces the
grid's children, apply a one-shot fade to the grid container (not the
cards — one element, one animation):

```js
// after the grid's innerHTML/children are updated:
if (grid.animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  grid.animate(
    [{ opacity: 0.35 }, { opacity: 1 }],
    { duration: 140, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
  );
}
```

Values, exactly: start opacity **0.35** (not 0 — the grid must never
look blank while typing), duration **140ms** (under the 200ms tooltip
budget; this fires per keystroke), easing **`cubic-bezier(0.23, 1,
0.32, 1)`** (strong ease-out — an entrance). Do not debounce, do not
cancel a running animation — `grid.animate` auto-replaces the previous
one, which is the correct interruptible behavior for keystroke
frequency.

No CSS file change is required. If the executor prefers a CSS route,
the equivalent is a `pg-grid-fade` keyframe (`from { opacity: 0.35 }`)
applied by toggling a class, with the same reduced-motion guard — but
the WAAPI route above is preferred (no CSS to keep in sync).

## Repo conventions to follow

Reduced motion is checked per-effect at the call site with
`matchMedia("(prefers-reduced-motion: reduce)").matches` — see
`playground/js/pg-nav.js`'s scroll-shadow guard and the chrome-only
reduced-motion block at the end of `playground/css/page.css`. The
motion token `--pg-ease-out`-style curves are inlined as
`cubic-bezier(...)` in the JS files (the playground JS does not read
CSS custom properties for easings) — match that.

The grid element is the container `pg-render.js` fills; the executor
should locate it by the same selector/filter code path that already
re-renders it (the variable holding the grid in `pg-filter.js`), not
by re-querying the DOM.

## Verification

Serve the playground (`npx http-server -p 8643 -c-1`), open
`playground/index.html`, click "Browse the animations", type in the
search box: the grid dims briefly and fades back per keystroke with no
blank frame. In DevTools, emulate `prefers-reduced-motion: reduce` and
confirm no animation runs. `node --check playground/js/pg-filter.js`
passes.
