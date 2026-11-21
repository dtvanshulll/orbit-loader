# OrbitLoader — project instructions

This is its own git repository (`github.com/dtvanshulll/orbit-loader`,
`main` branch), independent of any project that uses it — never assume
you're inside StoryClip or another consumer project just because the
animation originated there.

Full technical detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (how
and why it's built this way) and [docs/ROADMAP.md](docs/ROADMAP.md) (what
isn't built yet). Read both before making structural changes. Usage docs
for consumers are in [README.md](README.md) — keep it in sync with the
actual API whenever a function's signature or options change.

## Identity

- A standalone, dependency-free JS/CSS library: a glowing stroke-segment
  that animates around any SVG path, extracted from StoryClip's splash
  screen so it can be reused in any project.
- No framework, no bundler, no build step, no runtime dependencies. Plain
  `<script>` include. Keep it that way unless `docs/ROADMAP.md`'s
  packaging section is explicitly acted on — don't introduce a build step
  casually.
- License: MIT (`LICENSE`).

## Files

- `orbit-loader.js` — the core: `create(pathEl, options)` and
  `wrap(container, options)`. Depends on nothing else in this repo.
- `shapes.js` — optional `d`-string generators (`roundedSquare`, `circle`,
  `underline`). `orbit-loader.js` never imports this file; it only
  animates whatever path it's given.
- `orbit-loader.css` — base styles for the injected SVG/path.
- `examples/index.html` — a live demo (serve it over HTTP, not
  `file://`, since `OrbitLoader`/`OrbitLoaderShapes` attach to `window`
  and some browsers restrict module/script behavior on local files).

## Coding rules

1. Vanilla JS (ES5-compatible syntax, `window`-global IIFE pattern, no
   `import`/`export`) and plain CSS — matches the "no build step" promise
   in the README. Don't introduce `const`/`let`/arrow functions/classes
   just because they're available; match the existing style so the whole
   file reads consistently.
2. `orbit-loader.js` must never require `shapes.js` to run, and
   `shapes.js` must never touch the DOM or call into `orbit-loader.js` —
   see `docs/ARCHITECTURE.md`'s "Why shapes are a separate file" section.
   A new loader style (pulse ring, trailing dot, etc.) is a new sibling
   file with its own `create()`, never a branch inside the existing one.
3. Every new public function gets a doc comment explaining *why*, not
   just a type signature — this repo has no TypeScript/JSDoc tooling
   generating docs, so the comment *is* the documentation until someone
   reads the source.
4. Keep `README.md`'s API table and `examples/index.html` truthful. If an
   option's default or behavior changes, update both in the same commit.
5. New ideas that aren't needed by a concrete use case yet go into
   `docs/ROADMAP.md`, not into the code as a stub, speculative option, or
   commented-out branch.

## Commits

Plain, descriptive commit messages (no fixed phase/commit-tag convention
like some other projects use here) — this repo doesn't follow StoryClip's
`phase-N: <summary>` format.
