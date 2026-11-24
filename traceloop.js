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
import './orbit-loader.js';
import './dot-loader.js';
import './shimmer-loader.js';
import './ripple-loader.js';
import './typing-loader.js';
import './handshake-loader.js';
import './tab-loader.js';
import './page-loader.js';
import './button-loader.js';
import './toast-loader.js';
import './progress-loader.js';
import './search-loader.js';
import './modal-loader.js';
import './accordion-loader.js';
import './drawer-loader.js';
import './dropdown-loader.js';
import './input-loader.js';
import './shapes.js';

export const OrbitLoader = window.OrbitLoader;
export const DotLoader = window.DotLoader;
export const ShimmerLoader = window.ShimmerLoader;
export const RippleLoader = window.RippleLoader;
export const TypingLoader = window.TypingLoader;
export const HandshakeLoader = window.HandshakeLoader;
export const TabLoader = window.TabLoader;
export const PageLoader = window.PageLoader;
export const ButtonLoader = window.ButtonLoader;
export const ToastLoader = window.ToastLoader;
export const ProgressLoader = window.ProgressLoader;
export const SearchLoader = window.SearchLoader;
export const ModalLoader = window.ModalLoader;
export const AccordionLoader = window.AccordionLoader;
export const DrawerLoader = window.DrawerLoader;
export const DropdownLoader = window.DropdownLoader;
export const InputLoader = window.InputLoader;
export const shapes = window.OrbitLoaderShapes;

/** Every style keyed by name — handy for config-driven UIs. */
export const styles = {
  orbit: OrbitLoader,
  dot: DotLoader,
  shimmer: ShimmerLoader,
  ripple: RippleLoader,
  typing: TypingLoader,
  handshake: HandshakeLoader,
  tab: TabLoader,
  page: PageLoader,
  button: ButtonLoader,
  toast: ToastLoader,
  progress: ProgressLoader,
  search: SearchLoader,
  modal: ModalLoader,
  accordion: AccordionLoader,
  drawer: DrawerLoader,
  dropdown: DropdownLoader,
  input: InputLoader
};
