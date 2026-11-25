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

export const OrbitLoader = window.OrbitLoader;
export const DotLoader = window.DotLoader;
export const RippleLoader = window.RippleLoader;
export const PulseLoader = window.PulseLoader;
export const ChaseLoader = window.ChaseLoader;
export const TypingLoader = window.TypingLoader;
export const HandshakeLoader = window.HandshakeLoader;
export const TabLoader = window.TabLoader;
export const PageLoader = window.PageLoader;
export const ButtonLoader = window.ButtonLoader;
export const ToastLoader = window.ToastLoader;
export const SwapLoader = window.SwapLoader;
export const RouteLoader = window.RouteLoader;
export const PathWipeLoader = window.PathWipeLoader;
export const CountUpLoader = window.CountUpLoader;
export const ShakeLoader = window.ShakeLoader;
export const ShuffleLoader = window.ShuffleLoader;
export const ProgressLoader = window.ProgressLoader;
export const SearchLoader = window.SearchLoader;
export const ModalLoader = window.ModalLoader;
export const AccordionLoader = window.AccordionLoader;
export const DrawerLoader = window.DrawerLoader;
export const DropdownLoader = window.DropdownLoader;
export const InputLoader = window.InputLoader;
export const SequenceLoader = window.SequenceLoader;
export const shapes = window.OrbitLoaderShapes;

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
