# 002 — Add an `npm test` smoke baseline

- **Status**: TODO
- **Commit**: 644f4f4
- **Severity**: MEDIUM
- **Category**: DX / verification baseline
- **Estimated scope**: 1 new file (`scripts/smoke.js`), 1 line in `package.json`

## Problem

`package.json` has `build:*` scripts but no `test` script. The `tests/`
directory holds manual browser pages (`dist-test.html`,
`react-test.html`, `tabs-test.html`) that no command runs. Every change
is currently verified by hand in a live browser. There is no cheap,
repeatable gate that catches the class of bug already shipped once this
phase: `animations/scenes-more.js` passed `node --check` but threw
`CHECK is not defined` at runtime, silently dropping 12 of 127
playground demos.

## Target

**`scripts/smoke.js`** — a Node script (no new dependencies) that:

1. Syntax-checks every `.js` under `src/`, `src/styles/`, `react/`,
   `animations/`, and root-level `*-loader.js` / `shapes.js` via
   `node --check` (spawn per file, collect failures).
2. Runtime-loads every `animations/*.js` with the DOM-stub harness and
   asserts the entry count:

   ```js
   global.window = { ORBIT_ANIMATIONS: [], matchMedia: function () { return { matches: false }; } };
   global.document = {
     createElement: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {} }; },
     createElementNS: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {} }; },
     querySelector: function () { return null; },
     querySelectorAll: function () { return []; },
     addEventListener: function () {}
   };
   ```

   After requiring each file, `window.ORBIT_ANIMATIONS.length` must be
   greater than before the require. A throw or a zero-add means the
   scene file is dead — exactly the `scenes-more.js` failure mode.
3. Prints `SMOKE OK — N files, M animations` and exits 0, or lists
   failures and exits 1.

**`package.json`**: add `"test": "node scripts/smoke.js"` to `scripts`
(after `"build:css"`, keeping the existing entries untouched).

## Repo conventions to follow

`scripts/build-css.js` already exists as the pattern: plain Node, no
dependencies, run via an npm script. ES5-compatible syntax is only
required for library source — build/tooling scripts may use modern
Node syntax (match `scripts/build-css.js`'s style).

## Verification

`npm test` exits 0 with the SMOKE OK line. Then temporarily break a
scene (e.g. reference an undefined const) and confirm `npm test`
exits 1 naming the file — revert the break.
