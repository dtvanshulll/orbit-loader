# TraceLoop — Product Requirements Document

Version 1.0 — the pivot document. This is what we're building and why;
feature work should trace back to a line here.

## Vision

A dependency-free animation library that developers **import and use** —
not a collection of demos they have to reverse-engineer. One install,
one import, every animation from a simple page transition to complex
choreographed sequences, customizable with a color and a few options.

> "I have seen many UI libraries that just import it and customize the
> color and everything. I want to make it like that only."

## Who it's for

Front-end developers who need production-quality motion without pulling
in Framer Motion/GSAP-sized dependencies for a loading state or a tab
switch. Solo devs and small teams; framework-agnostic first.

## Product principles

1. **Import and go.** `import { OrbitLoader } from 'traceloop'` must
   work with zero configuration. The consumer never builds a component.
2. **The path is the API.** Every animation is driven by an SVG path —
   that's the differentiator; keep it central as scope grows.
3. **Simple things simple, complex things possible.** A loader is one
   call with a color. A choreographed sequence is composable from the
   same primitives.
4. **Honest motion.** No fake progress, no eased countdowns, reduced
   motion always honored.
5. **No runtime dependencies.** The library ships its own code only.

## Scope

### In scope

- **Looping loaders** (shipped): orbit crawler, dot (with moth/trail/
  relay/crossing behaviors), shimmer, ripple, typing, handshake.
- **One-shot transitions** (shipped): tab underline, page progress bar,
  button border trace, toast countdown, determinate path progress.
- **Component animations** (growing): search bar, modal, accordion,
  dropdown, input focus — the standard set developers reach for.
- **Page transitions** (planned): simple (fade/slide/wipe) through
  complex (path-wipe reveals, choreographed sequences).
- **Distribution**: npm ESM + UMD bundle, CSS import, React adapter,
  documented patterns for Vue/Svelte/Angular/plain HTML.

### Out of scope (for now)

- CSS-only variants of the animations (they need JS by design).
- Canvas/WebGL motion; SVG path space is the product.
- A React component library of static UI (buttons, cards) — TraceLoop
  animates elements, it doesn't replace a design system.

## Stack support

| Stack | Status | How |
|---|---|---|
| Plain HTML / any bundler-less page | shipped | `<script>` tags, globals |
| ESM (Vite, Next, Astro, SvelteKit…) | shipped | `import { ... } from 'traceloop'` |
| React | shipped | `traceloop/react` adapter components |
| Vue | documented | ESM in `onMounted`, destroy in `onUnmounted` |
| Svelte | documented | ESM in `onMount`, destroy on unmount |
| Angular | documented | ESM in `ngAfterViewInit`, destroy in `ngOnDestroy` |
| Web Components | roadmap | wrapper elements if demand appears |

## Success criteria

- A stranger can go from npm install to a visible animation in under
  60 seconds using only the README.
- Every public option is documented and verified against source.
- Zero runtime dependencies; dist bundle stays under ~15KB minified
  per style group.
- Every animation honors reduced motion and cleans up after destroy.

## Phases

1. **P1 (current)** — library packaging: ESM/UMD dist, React adapter,
   docs. Curate styles to the useful set.
2. **P2** — component animations: search, modal, accordion, dropdown,
   input focus; page transitions simple → complex.
3. **P3** — choreography API (sequence/timeline of one-shot styles),
   web-component wrappers, TypeScript types.
