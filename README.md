# TraceLoop

Loading and UI-transition animations that trace real SVG paths — zero dependencies.

[![npm](https://img.shields.io/npm/v/traceloop.svg)](https://www.npmjs.com/package/traceloop)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

**TraceLoop** draws a glowing segment that crawls along any `<path>` you give it: circles, squares, letters, words, infinity signs, your logo. Seventeen styles — six looping loaders and eleven one-shot transitions (tab switches, page loads, buttons, toasts, progress, search bars, modals, accordions, drawers, dropdowns, inputs) — all driven by the path itself, so the motion follows your shape instead of being bolted next to it.

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
  color: '#e8355c'
});
```

That's the whole integration — import the style, pass a color. The
`css` import is the only stylesheet you ever need.

### React

```jsx
import { Orbit, Tab, shapes } from 'traceloop/react';

<Orbit d={{ shape: 'circle', args: [72] }} width={72} height={72} color="#e8355c" />
<Tab labels={['One', 'Two', 'Three']} color="#5b8cff" />
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
<link rel="stylesheet" href="orbit-loader.css">
<div class="orbit-loader-wrap" style="width:72px; height:72px"></div>
<script src="dist/traceloop.umd.js"></script>  <!-- everything, one file -->
<script>
  OrbitLoader.wrap(document.querySelector('.orbit-loader-wrap'), {
    d: OrbitLoaderShapes.circle(72),
    viewBox: '0 0 72 72',
    color: '#e8355c'
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

**What it doesn't do:** spinners, skeleton screens (the shimmer style is a band, not a layout skeleton), Lottie-grade character animation, or React components — it's DOM in, DOM out; wrap it yourself.

## The eleven styles

| File | Global | What it does |
|---|---|---|
| `orbit-loader.js` | `OrbitLoader` | the core: a glowing segment crawls any path, forever |
| `dot-loader.js` | `DotLoader` | a traveling dot — with flutter, breadcrumb trails, relay batons, crossing twins |
| `shimmer-loader.js` | `ShimmerLoader` | a soft light band sweeps the path like brushed metal |
| `ripple-loader.js` | `RippleLoader` | rings radiate from the container — container-based, no path |
| `typing-loader.js` | `TypingLoader` | the chat "typing…" wave — container-based, no path |
| `handshake-loader.js` | `HandshakeLoader` | two segments converge, flash where they meet, retract |
| `tab-loader.js` | `TabLoader` | the tab underline crawls to the tab you clicked — one-shot |
| `page-loader.js` | `PageLoader` | the top progress bar trickles, then sweeps done — one-shot |
| `button-loader.js` | `ButtonLoader` | the button's own border is its pending-progress track — one-shot |
| `toast-loader.js` | `ToastLoader` | the toast's lifetime drains along its bottom edge — one-shot |
| `progress-loader.js` | `ProgressLoader` | determinate progress filling along any path |

Full option tables for every style: [docs/STYLES.md](docs/STYLES.md).

## Shapes

`shapes.js` (optional) generates `d` strings so you don't have to write path data: `circle`, `roundedSquare`, `roundRect`, `polygon`, `underline`, `infinity`, `letter` (a full authored alphabet, A–Z and 0–9), `letterOutline`, `text`, `textBoxForElement`. Spell words, outline boxes, trace your logo.

```js
OrbitLoader.wrap(el, { d: OrbitLoaderShapes.text('LOADING'), ... });
```

## Try it

- **Playground** — all 35 animations with live sliders and copy-paste code: clone the repo, serve the folder, open `playground/index.html`
- **UI transitions in context** — `examples/ui-transitions.html`: one mock app where every trigger is wired
- **Classic demos** — `examples/index.html`

## Status

v0.1.0, experimental, maintained by one person. The API is stable within a style but new styles land regularly; pin or vendor the files. [ROADMAP](docs/ROADMAP.md) lists what isn't built yet.

## Accessibility

Every style checks `prefers-reduced-motion: reduce` once at creation: if set, nothing animates and nothing blinks — the guides render as static shapes. Loaders are `aria-hidden`; announce progress in your app's own markup.

## License

[MIT](LICENSE) — free for any use, attribution appreciated but not required.

Built by Anshul
