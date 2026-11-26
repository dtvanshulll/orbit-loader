/*!
 * TraceLoop — library entry. `import { OrbitLoader } from 'traceloop'`
 * and you're done: every style is loaded and exported here.
 *
 * The style files are classic scripts (window-global IIFEs) so they
 * keep working as plain <script> tags; this entry loads them for their
 * side effects and re-exports the globals as named exports. That makes
 * the ESM bundle work in any bundler (Vite, Next, Astro, SvelteKit)
 * with zero configuration on either side.
 *
 * The UMD build (dist/traceloop.umd.js) exposes the same names on a
 * single global, `TraceLoop`, for script-tag users who want one file
 * instead of many.
 *
 * SSR-safe import: every IIFE tail and every export here is guarded
 * with `typeof window`, so importing the bundle in Node (Next.js,
 * Remix, Astro SSR) succeeds — the exports are simply undefined and
 * nothing touches the DOM. Animations only run client-side.
 */
import './styles/orbit-loader.js';
import './styles/dot-loader.js';
import './styles/ripple-loader.js';
import './styles/pulse-loader.js';
import './styles/chase-loader.js';
import './styles/typing-loader.js';
import './styles/handshake-loader.js';
import './styles/tab-loader.js';
import './styles/page-loader.js';
import './styles/button-loader.js';
import './styles/toast-loader.js';
import './styles/swap-loader.js';
import './styles/route-loader.js';
import './styles/pathwipe-loader.js';
import './styles/countup-loader.js';
import './styles/shake-loader.js';
import './styles/shuffle-loader.js';
import './styles/progress-loader.js';
import './styles/search-loader.js';
import './styles/modal-loader.js';
import './styles/accordion-loader.js';
import './styles/drawer-loader.js';
import './styles/dropdown-loader.js';
import './styles/input-loader.js';
import './styles/sequence-loader.js';
import './shapes/shapes-core.js';
import './shapes/shapes-text.js';
import './shapes/shapes-outline.js';
import './shapes/outline-glyphs.js';

export const OrbitLoader = typeof window !== "undefined" ? window.OrbitLoader : undefined;
export const DotLoader = typeof window !== "undefined" ? window.DotLoader : undefined;
export const RippleLoader = typeof window !== "undefined" ? window.RippleLoader : undefined;
export const PulseLoader = typeof window !== "undefined" ? window.PulseLoader : undefined;
export const ChaseLoader = typeof window !== "undefined" ? window.ChaseLoader : undefined;
export const TypingLoader = typeof window !== "undefined" ? window.TypingLoader : undefined;
export const HandshakeLoader = typeof window !== "undefined" ? window.HandshakeLoader : undefined;
export const TabLoader = typeof window !== "undefined" ? window.TabLoader : undefined;
export const PageLoader = typeof window !== "undefined" ? window.PageLoader : undefined;
export const ButtonLoader = typeof window !== "undefined" ? window.ButtonLoader : undefined;
export const ToastLoader = typeof window !== "undefined" ? window.ToastLoader : undefined;
export const SwapLoader = typeof window !== "undefined" ? window.SwapLoader : undefined;
export const RouteLoader = typeof window !== "undefined" ? window.RouteLoader : undefined;
export const PathWipeLoader = typeof window !== "undefined" ? window.PathWipeLoader : undefined;
export const CountUpLoader = typeof window !== "undefined" ? window.CountUpLoader : undefined;
export const ShakeLoader = typeof window !== "undefined" ? window.ShakeLoader : undefined;
export const ShuffleLoader = typeof window !== "undefined" ? window.ShuffleLoader : undefined;
export const ProgressLoader = typeof window !== "undefined" ? window.ProgressLoader : undefined;
export const SearchLoader = typeof window !== "undefined" ? window.SearchLoader : undefined;
export const ModalLoader = typeof window !== "undefined" ? window.ModalLoader : undefined;
export const AccordionLoader = typeof window !== "undefined" ? window.AccordionLoader : undefined;
export const DrawerLoader = typeof window !== "undefined" ? window.DrawerLoader : undefined;
export const DropdownLoader = typeof window !== "undefined" ? window.DropdownLoader : undefined;
export const InputLoader = typeof window !== "undefined" ? window.InputLoader : undefined;
export const SequenceLoader = typeof window !== "undefined" ? window.SequenceLoader : undefined;
export const shapes = typeof window !== "undefined" ? window.OrbitLoaderShapes : undefined;

/** Every style keyed by name — handy for config-driven UIs. */
export const styles = {
  orbit: OrbitLoader,
  dot: DotLoader,
  ripple: RippleLoader,
  pulse: PulseLoader,
  chase: ChaseLoader,
  typing: TypingLoader,
  handshake: HandshakeLoader,
  tab: TabLoader,
  page: PageLoader,
  button: ButtonLoader,
  toast: ToastLoader,
  swap: SwapLoader,
  route: RouteLoader,
  pathwipe: PathWipeLoader,
  countup: CountUpLoader,
  shake: ShakeLoader,
  shuffle: ShuffleLoader,
  progress: ProgressLoader,
  search: SearchLoader,
  modal: ModalLoader,
  accordion: AccordionLoader,
  drawer: DrawerLoader,
  dropdown: DropdownLoader,
  input: InputLoader,
  sequence: SequenceLoader
};
