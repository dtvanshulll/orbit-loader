/*!
 * TraceLoop React adapter — `traceloop/react`.
 *
 * One component per style, same name, same options as the vanilla
 * library — passed as props. The component renders a positioned host
 * div, creates the controller on mount, destroys it on unmount, and
 * recreates it only when the options actually change (not on every
 * render). `d` accepts a path string or a `{ shape, args }` object
 * resolved through the bundled shapes.
 *
 * SSR-safe: nothing happens until the component mounts client-side.
 *
 * Usage:
 *   import { OrbitLoader, TabLoader } from 'traceloop/react';
 *   <OrbitLoader d={{ shape: 'circle', args: [72] }} color="#d97757" />
 */
import React from 'react';
import {
  OrbitLoader, DotLoader, ShimmerLoader, RippleLoader, PulseLoader,
  ChaseLoader, TypingLoader,
  HandshakeLoader, TabLoader, PageLoader, ButtonLoader, ToastLoader,
  ProgressLoader, SearchLoader, ModalLoader, AccordionLoader, DrawerLoader,
  DropdownLoader, InputLoader, SwapLoader, CountUpLoader, ShakeLoader, shapes
} from '../src/traceloop.js';

// Resolve the `d` prop: a raw path string passes through; a
// { shape, args } object calls the generator. Returns { d, viewBox }.
function resolveD(d, defaultViewBox) {
  if (!d || typeof d === 'string') return { d: d, viewBox: defaultViewBox };
  var out = shapes[d.shape].apply(null, d.args || []);
  return { d: out, viewBox: d.viewBox || defaultViewBox };
}

// Factory: builds one React component per style. `containerBased`
// styles take the host element directly; path styles take a resolved
// `d`. Options come from props minus the layout props.
function makeComponent(Style, name, containerBased) {
  function Component(props) {
    var ref = React.useRef(null);
    var controllerRef = React.useRef(null);

    // Layout props are ours; everything else is a style option.
    var d = props.d, viewBox = props.viewBox, width = props.width,
        height = props.height, className = props.className,
        style = props.style, children = props.children;
    var options = {};
    for (var k in props) {
      if (k === 'd' || k === 'viewBox' || k === 'width' || k === 'height' ||
          k === 'className' || k === 'style' || k === 'children') continue;
      options[k] = props[k];
    }

    // Recreate only when the meaningful inputs change — a new options
    // object identity on every render must not restart the animation.
    var signature = JSON.stringify([name, d, viewBox, options]);

    React.useEffect(function () {
      if (!ref.current) return undefined;
      var opts = {};
      for (var key in options) opts[key] = options[key];
      var ctrl;
      if (containerBased) {
        ctrl = Style.create(ref.current, opts);
      } else {
        var r = resolveD(d, viewBox || '0 0 100 100');
        opts.d = r.d;
        opts.viewBox = r.viewBox;
        ctrl = Style.wrap(ref.current, opts);
      }
      controllerRef.current = ctrl;
      return function () {
        if (controllerRef.current) controllerRef.current.destroy();
        controllerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signature]);

    return React.createElement(
      'div',
      {
        ref: ref,
        className: className != null ? className : 'orbit-loader-wrap',
        style: Object.assign(
          width ? { width: width } : {},
          height ? { height: height } : {},
          style || {}
        )
      },
      children
    );
  }
  Component.displayName = name;
  return Component;
}

export const Orbit = makeComponent(OrbitLoader, 'Orbit', false);
export const Dot = makeComponent(DotLoader, 'Dot', false);
export const Shimmer = makeComponent(ShimmerLoader, 'Shimmer', false);
export const Ripple = makeComponent(RippleLoader, 'Ripple', true);
export const Pulse = makeComponent(PulseLoader, 'Pulse', true);
export const Chase = makeComponent(ChaseLoader, 'Chase', false);
export const Typing = makeComponent(TypingLoader, 'Typing', true);
export const Handshake = makeComponent(HandshakeLoader, 'Handshake', false);
export const Tab = makeComponent(TabLoader, 'Tab', true);
export const Page = makeComponent(PageLoader, 'Page', true);
export const Button = makeComponent(ButtonLoader, 'Button', true);
export const Toast = makeComponent(ToastLoader, 'Toast', true);
export const Swap = makeComponent(SwapLoader, 'Swap', true);
export const CountUp = makeComponent(CountUpLoader, 'CountUp', true);
export const Shake = makeComponent(ShakeLoader, 'Shake', true);
export const Progress = makeComponent(ProgressLoader, 'Progress', false);
export const Search = makeComponent(SearchLoader, 'Search', true);
export const Modal = makeComponent(ModalLoader, 'Modal', true);
export const Accordion = makeComponent(AccordionLoader, 'Accordion', true);
export const Drawer = makeComponent(DrawerLoader, 'Drawer', true);
export const Dropdown = makeComponent(DropdownLoader, 'Dropdown', true);
export const Input = makeComponent(InputLoader, 'Input', true);

export { shapes };
export { Tabs } from './tabs.jsx';
