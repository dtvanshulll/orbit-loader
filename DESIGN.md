# TraceLoop — Design System

The rules every surface in this project (playground, examples, docs,
the library's own injected DOM) follows. Written down so the next
change doesn't drift. Values are tokens; use the token, not the value.

## Colors

Near-black neutrals carry the chrome; the loaders carry the color.
One accent per context, never a wash of it.

### Surfaces (dark lab bench)

| token | value | use |
|---|---|---|
| `--tl-bg` | `#0e0e12` | page background |
| `--tl-card` | `#15151a` | cards, panels |
| `--tl-raised` | `#1c1c22` | raised elements: inputs, toasts, mock components |
| `--tl-border` | `#26262d` | hairline borders, dividers |
| `--tl-stage` | `#0a0a0d` | demo stages — the darkest step, where loaders perform |

### Text

| token | value | use |
|---|---|---|
| `--tl-text` | `#eceef2` | primary text |
| `--tl-secondary` | `#9a9ba4` | secondary text, descriptions |
| `--tl-muted` | `#6d6e77` | metadata, captions, quiet labels |

### Accents (each tied to a job, not decoration)

| token | value | assigned to |
|---|---|---|
| `--tl-accent` | `#e8355c` | the brand crawler; primary interactive accents |
| `--tl-blue` | `#5b8cff` | progress, navigation, anything moving toward completion |
| `--tl-gold` | `#ffd54a` | time: countdowns, trails, highlights |
| `--tl-mint` | `#34d399` | success, "alive" states |
| `--tl-silver` | `#d8dce4` | neutral loaders, monochrome demos |
| `--tl-lavender` | `#cfc0f5` | reserved for the infinity banner identity |

### Rules

1. Never use an accent for structure (borders, headings, backgrounds).
   Structure is neutral; color is earned by meaning.
2. One accent per component. Two accents means one is decoration.
3. No gradients, no glows on containers, no radial washes. Glow belongs
   to the loaders themselves.
4. Off-white (`--tl-text`) is the primary button color on dark. Accent
   buttons are for the single most important action on a screen.

## Typography

System stack, no webfonts — the library must not pull fonts.

| token | value |
|---|---|
| `--tl-font` | `system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--tl-mono` | `ui-monospace, "Cascadia Mono", Consolas, monospace` |

Scale (4px grid, 1.5 line-height for body):

| use | size | weight |
|---|---|---|
| display (hero) | `clamp(40px, 6vw, 64px)` | 600, tracking `-0.02em` |
| h2 | 28px | 600 |
| h3 (card titles) | 17px | 600 |
| body | 15px | 400 |
| secondary | 14px | 400 |
| caption / meta | 12–13px | 400, mono for technical labels |

Rules: sentence case everywhere; no uppercase tracked labels; no
trailing periods on captions and notes; negative tracking only on the
display size.

## Spacing & layout

- 4px grid: all spacing is a multiple of 4 (`4 8 12 16 20 24 32 48`).
- Card padding 16–22px; page gutter 24px; section gap 40px.
- Radius: `8px` controls and inputs, `9–12px` cards and panels.
  One radius per element, no mixed corners.
- Borders are 1px `--tl-border`. Never shadow-box a dark theme;
  elevation is a lighter surface step, not a drop shadow (except the
  toast, which floats over content).

## Motion

The library's own motion grammar — playground and examples follow it
so the site feels like the product.

| token | value | use |
|---|---|---|
| `--tl-ease-out` | `cubic-bezier(0.2, 0, 0.2, 1)` | entrances, completions |
| `--tl-ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | crawls, position moves |
| `--tl-ease-sweep` | `cubic-bezier(0.45, 0, 0.55, 1)` | edge sweeps, pulses |
| fast | 150–250ms | hovers, color/state changes |
| medium | 400–700ms | one-shot transitions (tab, drawer-class actions) |
| slow | 2000–6000ms | loader loop periods |

Rules:

1. Named transitions only — never `transition: all`.
2. One entrance per page load; scroll reveals may stagger but never
   re-trigger upward.
3. `prefers-reduced-motion` collapses every animation to its final
   state. This is checked, not assumed.
4. Progress bars move at a speed that tells the truth; countdowns run
   linear (easing a countdown lies about the time left).

## Component states

Every interactive element ships all four: default, hover, focus-visible
(2px accent outline, offset 2px), disabled (0.7 opacity, no pointer).
Inputs add a focus border step (`#3a3a44`).

## Do / Don't (the unslop list)

Do: quiet chrome, flat stages, mono style tags, tabular numerals in
inputs, one bright moment per page.

Don't: emoji in UI copy, "✨ New" badges, purple gradients, glossy
blobs, 999px pill radii, uppercase micro-labels, checkerboard
backgrounds, more than one accent per component.

## Icons

- Icons are **inline SVG stroke paths**: 24×24 grid, `stroke-width="2"`,
  `stroke-linecap="round"`, `stroke-linejoin="round"` — Lucide geometry.
- Never emoji, never unicode glyphs (✓ ✕ ▾), never CSS-drawn
  pseudo-elements pretending to be icons.
- Stroke paths, not filled shapes, so the library can animate them with
  the same dasharray draw it uses everywhere else.
- Source real geometry with the `better-icons` skill
  (`npx better-icons get lucide:<name> --json`) instead of inventing
  coordinates by hand.
- Icons inherit `currentColor`; size with width/height, never scale
  with font-size tricks.

## UI rules (every visible surface)

These are the rules the playground, examples and docs pages were audited
against. They are binding, not suggestions — a surface that breaks one is
unfinished.

**One arrangement, one column.** Every page uses a single left-anchored
content column: `max-width: 1336px`, `32px` gutters, all zones (header,
hero, sections, footer) share the same left edge. Verify with DOM
`getBoundingClientRect().x`, not by eye. Cards may inset their own content
by one padding step; nothing else may.

**`box-sizing: border-box` globally.** The first shell bug on this project
was a "240px" sidebar that measured 269px because width excluded padding.

**A navigation rail is three zones:** pinned brand at the top, a
scrolling middle (`flex: 1; min-height: 0; overflow-y: auto`) and a
pinned footer. Never let the whole rail scroll — the last entries end
up clipped against the viewport edge and the footer disappears. When a
row is a flex pair (label + count), check that no stray pseudo-element
is a third flex item: an `::after { content: "" }` left behind from a
float layout silently pushes the count into the middle of the row.

**One control per job.** If the sidebar already lists every style, there is
no second row of filter chips repeating it. Duplicate navigation is the
fastest way to look machine-assembled.

**Section headers are one line:** ordinal (`01`), name, count, then a rule
that eats the remaining width. No boxes, no fills, no uppercase tracking.

**State is one thing at a time.** Exactly one nav item carries the active
surface. A scrollspy marks the *group heading* it has scrolled into; it
never lights a whole group of items (seven highlighted rows read as broken
state).

**Snippets are the content.** A demo card shows: title + style tag, one
sentence of why, the stage, the library call, and controls collapsed behind
a Tune toggle. Copy the *library usage*, never the playground's config.

**Motion: three tokens, one curve each.** `--pg-ease-out` for entrances and
panels, `--pg-ease-inout` for movement that returns, `--pg-dur-fast/base/
panel` for durations. Never hand-write a duration or a bezier inside a
component — an undefined `var(--pg-ease-out)` silently drops the whole
`transition` shorthand, which is how the sidebar lost its easing.

**Reduced motion is a first-class state:** every entrance, panel, slide and
press collapses to its final value. Test by emulation, not by reading CSS.

**Touch grows, mouse stays dense.** Keep card controls compact for pointer
users; add `@media (pointer: coarse)` to lift targets to ~40px and nav rows
to 12px padding. Never bloat the desktop grid for the phone.

**No emoji as an icon, in any surface** — including config files that feed
demos. Use a Lucide stroke path (`box.html` in `animations/animations.js`
exists for exactly this).
