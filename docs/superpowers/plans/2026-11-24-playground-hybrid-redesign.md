# TraceLoop Playground — Hybrid Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Date:** 2026-11-24
**Direction chosen by owner:** Hybrid — docs shell + showcase hero.
**Skill queue folded into this plan:** unslop (done, keep), impeccable (in
progress), ui-ux-pro-max, Awwwards-level motion pass, hallmark detail pass.

---

## Why this plan exists

The playground grew by patching: hero, then sections, then a drawer, then a
sidebar, then snippets. Each patch was locally fine; together the page has no
single idea. The owner's verdict — "it is not arranged at all" — is correct.
This plan replaces accumulation with one coherent shell, then runs the
requested UI-skill passes **on top of that shell** (never before structure,
because polish on a wrong layout is waste).

## The one idea

**A library docs site with one cinematic moment.** The page IS the library:
fixed sidebar (map of everything), snippet-first cards (code is the product),
sections that read like API docs. The hero is the single place where the
library performs — short, loud, then out of the way.

Non-negotiables carried from DESIGN.md / AGENTS.md:

- Vanilla ES5 library code; playground may use modern JS but no build step.
- Dark lab-bench palette from `--pg-*` / `--tl-*` tokens; one accent.
- Lucide stroke icons only; no emoji, no gradients, no uppercase tracked labels.
- Every change verified in the browser at 1440px and 400px before done.

## File structure (what changes)

| File | Change |
|---|---|
| `playground/index.html` | Hero compacted; shell order fixed; anchor ids |
| `playground/playground.css` | Card anatomy, section rhythm, hero, sidebar polish |
| `playground/playground.js` | Card builder: snippet-first order; section anchors |
| `DESIGN.md` | + UI rules section (the "type of UI we have" law) |
| `AGENTS.md` / `CLAUDE.md` | + rule pointing at DESIGN.md UI rules as binding |
| `README.md` | only if a user-facing claim changes |

No changes to library loader files in this plan (component variety is a
separate track already in flight).

---

## Tasks

### Task 1 — Card anatomy: snippet-first, one consistent rhythm

The card is the atom. Current order: title → note → stage → controls →
snippet → actions. Six stacked zones with unequal padding is the "disarray".

- [x] New anatomy: **title+tag** → **stage** (the demo, dominant) →
      **snippet** (the code, quiet, divider-top) → **controls** (collapsed
      behind a "Tune" toggle) → actions row merged into the title row
- [x] Copy code button moves into the card head (right-aligned, small)
- [x] One padding value (16px) inside cards; one gap (16px) between zones
- [x] Stage min-height consistent per section (looping 120px, components 150px)
- [x] Verify: 55 cards render, no `__initErr`, screenshot at 1440

### Task 1b — Shell geometry (discovered during Task 1)

- [x] `box-sizing: border-box` added — sidebar was really 269px wide
- [x] Negative-margin full-bleed hacks removed from header/hero/footer
- [x] One left-anchored content column: 1336px cap, 32px gutters, all zones
      align at x=272 (verified via DOM)
- [x] Filter chips wrap instead of overflowing

### Task 2 — Section rhythm + anchors

- [x] Section headers: number + name + count + rule line (e.g. `01 — Looping
      loaders · 17`), sticky offset clear of the fixed header
- [x] Sidebar items scroll to sections AND set the filter (current behaviour
      keeps filter only — add scroll-to-section)
- [x] `text-wrap: pretty` on notes; straggler advisories re-checked
- [ ] Verify: click sidebar item → correct section in view, filter applied

### Task 3 — Hero: one cinematic moment, then out of the way

- [x] Compact: title, one-line sub, primary CTA, the instrument. Kill the
      meta line and second ghost CTA if they repeat the header
- [x] The instrument (ring + dot train) stays the only large animation above
      the fold's end
- [x] Hero height ≤ 60vh; content column starts above the fold's end
- [ ] Verify: screenshot at 1440×900 — first screen shows hero end + first
      section title

### Task 4 — Sidebar as the permanent map

- [x] Sidebar groups mirror sections 1:1 with counts (done — keep)
- [x] Active section highlights on scroll (scrollspy), not just on filter
- [x] Mobile: sidebar hidden, hamburger toggles; Esc closes; focus trap
- [ ] Verify: scrollspy at 1440, toggle + Esc at 400

### Task 5 — impeccable re-audit to zero

- [ ] `impeccable detect` on the page → fix remaining failures
- [x] Contrast ≥ 4.5:1 for all functional text (verified via computed styles)
- [x] Mark todo #28 done

### Task 6 — ui-ux-pro-max audit

- [ ] Run the skill's data (typography pairings, UX guidelines) against the
      shell; fix what it flags
- [ ] Mark todo #29 done

### Task 7 — Awwwards-level motion pass (motion-design + apple-motion)

- [ ] One easing family, named durations; reveal choreography on scroll
      (staggered, once, respects reduced-motion)
- [ ] Hover states: color/surface only, no scale on cards
- [ ] The hero instrument gets the single showpiece moment (dot train
      entrance), everything else stays quiet
- [ ] Mark todo #30 done

### Task 8 — hallmark detail pass

- [ ] Nested radii audit (inner = outer − padding)
- [ ] Signature detail: the path-traced motif appears exactly twice — hero
      instrument and the section rule lines — nowhere else
- [ ] Mark todo #31 done

### Task 9 — Rules doc + final verification

- [ ] DESIGN.md: write **"UI rules"** section (shell, type scale, spacing
      grid, color roles, motion, iconography, verification bar)
- [ ] AGENTS.md/CLAUDE.md: add binding rule "all UI work follows DESIGN.md
      UI rules; run the verification battery before done"
- [ ] Full battery: 1440 + 400 screenshots, all 55 cards, filters, sidebar,
      keyboard focus, reduced-motion
- [ ] Mark todo #32 done
