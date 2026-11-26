# TraceLoop

Loading and UI-transition animations that trace real SVG paths — zero dependencies.

[![npm](https://img.shields.io/npm/v/traceloop.svg)](https://www.npmjs.com/package/traceloop)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

**TraceLoop** draws a glowing segment that crawls along any `<path>` you give it: circles, squares, letters, words, infinity signs, your logo. Twenty-five styles — seven looping loaders, nine one-shot transitions (tab switches, page loads, buttons, toasts, progress, panel swaps, route changes, attention shakes, path-wipe reveals), eight component animations (search bars, modals, accordions, drawers, dropdowns, inputs, counting numbers, list shuffles) and a choreography API that sequences one-shot calls on a timeline — all driven by the path itself, so the motion follows your shape instead of being bolted next to it.

## Quick start

```bash
npm install traceloop
```

```js
import { OrbitLoader, shapes } from 'traceloop';
import 'traceloop/css';

OrbitLoader.wrap(document.querySelector('.box'), {
  d: shapes.circle(72),
  viewBox: '0 0 72 72',
  color: '#d97757'
});
```

That's the whole integration — import the style, pass a color. The
`css` import is the only stylesheet you ever need.

### React

```jsx
import { Orbit, Tab, shapes } from 'traceloop/react';

<Orbit d={{ shape: 'circle', args: [72] }} width={72} height={72} color="#d97757" />
<Tab labels={['One', 'Two', 'Three']} color="#6a9bcc" />
```

Same options as the vanilla library, as props. Mount/unmount and
recreation are handled for you; SSR-safe.

### Vue, Svelte, Angular and everything else

The ESM build is framework-agnostic — create in the mount hook,
destroy in the unmount hook:

```js
// Vue
onMounted(() => { ctrl = OrbitLoader.wrap(el, opts) });
onUnmounted(() => ctrl.destroy());

// Svelte
onMount(() => { ctrl = OrbitLoader.wrap(el, opts) });
onDestroy(() => ctrl.destroy());
```

### No bundler? Script tags still work

```html
<link rel="stylesheet" href="dist/traceloop.css">
<div class="orbit-loader-wrap" style="width:72px; height:72px"></div>
<script src="dist/traceloop.umd.js"></script>  <!-- everything, one file -->
<script>
  OrbitLoader.wrap(document.querySelector('.orbit-loader-wrap'), {
    d: OrbitLoaderShapes.circle(72),
    viewBox: '0 0 72 72',
    color: '#d97757'
  });
</script>
```

(Or load the individual source files the old way — they still ship.)

## Why TraceLoop

Most loader libraries give you a spinner: a shape rotated by CSS, blind to your design. TraceLoop's motion substrate is the SVG path itself — `getTotalLength()` and `stroke-dasharray` — so:

- **The shape is the animation.** Hand it a letter, a word, a polygon, your product logo — the crawler traces that silhouette. Nothing else traces text along its actual outline.
- **Transitions are path primitives too.** The tab underline crawls to the tab you clicked; the progress bar fills along a curve; the button's own border is its pending track. UI kits morph widths with CSS; these ride paths.
- **Zero dependencies, zero build.** Plain ES5 and one CSS file. Works from a `<script>` tag in any page, any framework, none at all.
- **Reduced motion is not an afterthought** — every style checks `prefers-reduced-motion` once at creation and renders nothing that moves.

**What it doesn't do:** spinners, skeleton screens, Lottie-grade character animation, or React components — it's DOM in, DOM out; wrap it yourself.

## The twenty-five styles

| File | Global | What it does |
|---|---|---|
| `src/styles/orbit-loader.js` | `OrbitLoader` | the core: a glowing segment crawls any path, forever |
| `src/styles/dot-loader.js` | `DotLoader` | a traveling dot — with flutter, breadcrumb trails, relay batons, crossing twins |
| `src/styles/ripple-loader.js` | `RippleLoader` | rings radiate from the container — container-based, no path |
| `src/styles/pulse-loader.js` | `PulseLoader` | a ring breathes in place, anchored by a steady center dot — container-based, no path |
| `src/styles/chase-loader.js` | `ChaseLoader` | several dashes chase in formation around the path — the multi-runner orbit |
| `src/styles/typing-loader.js` | `TypingLoader` | the chat "typing…" wave — container-based, no path |
| `src/styles/handshake-loader.js` | `HandshakeLoader` | two segments converge, flash where they meet, retract |
| `src/styles/tab-loader.js` | `TabLoader` | the tab underline crawls to the tab you clicked — one-shot |
| `src/styles/page-loader.js` | `PageLoader` | the top progress bar trickles, then sweeps done — one-shot |
| `src/styles/button-loader.js` | `ButtonLoader` | the button's own border is its pending-progress track — one-shot |
| `src/styles/toast-loader.js` | `ToastLoader` | the toast's lifetime drains along its bottom edge — one-shot |
| `src/styles/swap-loader.js` | `SwapLoader` | two panels trading places — one accelerates out, the next decelerates in — one-shot |
| `src/styles/route-loader.js` | `RouteLoader` | a route/page content transition — fade, slide or a cover-panel wipe between pages you mount — one-shot |
| `src/styles/pathwipe-loader.js` | `PathWipeLoader` | content unmasked (or masked) by a traveling shaped edge — wave, zigzag, diagonal, arc or your own path — as an SVG clip-path — one-shot |
| `src/styles/countup-loader.js` | `CountUpLoader` | a number counting itself up to its value with an easing — stat cards, totals |
| `src/styles/shake-loader.js` | `ShakeLoader` | a damped attention shake — the element judders and settles, for invalid fields and rejections |
| `src/styles/shuffle-loader.js` | `ShuffleLoader` | a list that reorders itself with a FLIP glide — queues, standings, leaderboards |
| `src/styles/progress-loader.js` | `ProgressLoader` | determinate progress filling along any path |
| `src/styles/search-loader.js` | `SearchLoader` | a search field that widens while its underline draws out — one-shot |
| `src/styles/modal-loader.js` | `ModalLoader` | a dialog whose border traces itself on arrival — one-shot |
| `src/styles/accordion-loader.js` | `AccordionLoader` | a section whose left edge draws as it expands — one-shot |
| `src/styles/drawer-loader.js` | `DrawerLoader` | a panel that slides in while its leading edge draws — one-shot |
| `src/styles/dropdown-loader.js` | `DropdownLoader` | a menu that unfolds under its trigger with a drawn edge — one-shot |
| `src/styles/input-loader.js` | `InputLoader` | a text field that types itself, then focuses — one-shot |
| `src/styles/sequence-loader.js` | `SequenceLoader` | the choreography API — a timeline of one-shot style calls, timed `at`/`after`, loopable — no visuals of its own |

Full option tables for every style: [docs/STYLES.md](docs/STYLES.md).

## Shapes

The `src/shapes/` files (optional) generate `d` strings so you don't have to write path data: `circle`, `roundedSquare`, `roundRect`, `polygon`, `underline`, `infinity`, `letter` (a full authored alphabet, A–Z and 0–9), `letterOutline`, `text`, `textBoxForElement`. Spell words, outline boxes, trace your logo.

## Try it

- **Playground** — all 170 animations with live sliders and copy-paste code: clone the repo, serve the folder, open `playground/index.html`
- **Components library** — the same playground, categories view: 46 real-world blocks (navbar, hero, login, stats, FAQ, pricing, footer, data table and more) built as mockups and animated by the styles above — the way you'd actually ship them
- **UI transitions in context** — `examples/ui-transitions.html`: one mock app where every trigger is wired
- **Classic demos** — `examples/index.html`

## Status

v0.1.0, experimental, maintained by one person. The API is stable within a style but new styles land regularly; pin or vendor the files. [ROADMAP](docs/ROADMAP.md) lists what isn't built yet.

## Accessibility

Every style checks `prefers-reduced-motion: reduce` once at creation: if set, nothing animates and nothing blinks — the guides render as static shapes. Loaders are `aria-hidden`; announce progress in your app's own markup.

## License

[MIT](LICENSE) — free for any use, attribution appreciated but not required.

Built by Anshul
