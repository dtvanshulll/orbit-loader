# OrbitLoader

A glowing stroke-segment that chases around an SVG path, forever, as a
loading indicator. Wrap a logo's outline, a circle, a hand-drawn underline
beneath some text — any path works, because the library only ever animates
a moving dash-segment along whatever `d` it's given. It never cuts across
a corner or curve: the segment bends through the path exactly as the path
itself does, because it's drawn *on* the real path, not a separate shape
rotated to approximate it.

No dependencies, no build step. Two small files, loaded via `<script>`.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how and why it's
built this way, and [docs/ROADMAP.md](docs/ROADMAP.md) for what's planned
next (more loader styles, more shapes, optional npm packaging).

## Quick start

```html
<link rel="stylesheet" href="orbit-loader.css">
<div class="orbit-loader-wrap" style="width:84px;height:84px;border-radius:24px;background:#111">
  <!-- your logo/icon/content here -->
</div>

<script src="orbit-loader.js"></script>
<script src="shapes.js"></script>
<script>
  OrbitLoader.wrap(document.querySelector(".orbit-loader-wrap"), {
    d: OrbitLoader.shapes.roundedSquare(84, 24),
    viewBox: "0 0 84 84",
  });
</script>
```

See `examples/index.html` for a live demo of a logo box, a circle, and
text with an underline thread.

## API

### `OrbitLoader.wrap(container, options)`

Builds the `<svg><path></svg>` for you and appends it to `container`
(an element, or a selector string). `container` should already be
`.orbit-loader-wrap` (or carry the same `position: relative`,
`display: inline-block` styling) so the injected, absolutely-positioned
SVG lines up over it.

Returns a controller: `{ start(), stop(), destroy(), isRunning(), path, svg }`.

**`options.d`** (required) — the path's `d` attribute. Supply your own, or
use one of the `shapes.js` generators (below).

**`options.viewBox`** (default `"0 0 100 100"`) — must match the
coordinate space `d` was built in (e.g. `"0 0 84 84"` for
`shapes.roundedSquare(84, ...)`), or the thread will be stretched/offset
relative to the shape it's meant to trace.

Plus every option `create()` takes (below).

### `OrbitLoader.create(pathEl, options)`

The lower-level call, for when you already have a `<path>` element (e.g.
hand-written SVG markup rather than injected via `wrap`).

| option | default | meaning |
|---|---|---|
| `segmentFraction` | `0.18` | how much of the lap the glowing segment covers, as a fraction of the path's total length |
| `durationMs` | `2200` | time for one full lap |
| `direction` | `"forward"` | `"forward"` or `"reverse"` |
| `activeClass` | `"is-active"` | class added to the path while running, so CSS can fade it in |
| `autoStart` | `true` | start animating immediately |

`prefers-reduced-motion: reduce` is checked once at creation — if set, the
loader never starts (the path simply has no motion; see
`orbit-loader.css`'s reduced-motion rule, which also keeps it invisible).

### `OrbitLoader.shapes` (from `shapes.js`, optional)

Ready-made `d`-string generators for the easy cases — the core library
never depends on this file, so skip it and hand-write your own path if
none of these fit.

- `roundedSquare(size, radius)` — a square with rounded corners
- `circle(size)` — a circle of the given diameter
- `underline(width, gap)` — a straight line `gap` px below a text baseline

Add a new shape by adding a new function to this file; `orbit-loader.js`
never needs to change for it.

## Adding a new loader style

OrbitLoader's one style today is a stroke segment chasing a static path.
A different style (e.g. a pulsing ring, a trailing dot instead of a
segment) belongs as a sibling module (say, `pulse-loader.js`) with its own
`create()`, not as a branch inside this one — keeps each style's code
readable on its own, and this core free to stay small.

## License

MIT — see `LICENSE`.
