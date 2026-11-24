/*!
 * TraceLoop React — styled <Tabs>: the first real UI component. Owns
 * the state, the keyboard, and the ARIA; TabLoader draws the underline
 * crawl. Themed entirely through the --tl-* tokens — override them on
 * :root and every Tabs instance re-themes.
 *
 * Usage:
 *   <Tabs items={['One', 'Two', 'Three']}>
 *     <div>Panel one</div>
 *     <div>Panel two</div>
 *     <div>Panel three</div>
 *   </Tabs>
 *
 * Behavior: click switches; ArrowLeft/ArrowRight/Home/End move and
 * select with roving tabindex; panels are labelled tabs. The underline
 * crawls from the old tab to the new one — the same one-shot motion as
 * the vanilla TabLoader, no demo loop.
 */
import React, { useRef, useState, useEffect } from 'react';
import { TabLoader } from '../src/traceloop.js';

export function Tabs(props) {
  var items = props.items || [];
  var initial = props.initial != null ? props.initial : 0;
  var onChange = props.onChange;
  var color = props.color;
  var segFraction = props.segFraction != null ? props.segFraction : 0.16;
  var durationMs = props.durationMs;
  var className = props.className;
  var children = props.children;

  var railRef = useRef(null);
  var tabRefs = useRef([]);
  var ctrlRef = useRef(null);
  var idRef = useRef('tl-tabs-' + Math.random().toString(36).slice(2, 8));

  var n = items.length;
  // Real geometry: the underline must sit under the ACTUAL label, not
  // an assumed even division — so fractions are measured from the
  // rendered buttons on mount and on resize.
  var fracRef = useRef([]);
  var measure = function () {
    if (!railRef.current || !tabRefs.current.length) return;
    var rail = railRef.current.getBoundingClientRect();
    var segLen = segFraction * rail.width;
    fracRef.current = tabRefs.current.map(function (btn) {
      if (!btn) return 0;
      var r = btn.getBoundingClientRect();
      var center = r.left - rail.left + r.width / 2;
      return (center - segLen / 2) / rail.width;
    });
  };

  var activeRef = useRef(initial);
  var _force = useState(0);
  var active = activeRef.current; // read through the ref; state only triggers renders

  // Build the rail once per meaningful input; the underline is set to
  // the active tab without motion on mount.
  useEffect(function () {
    if (!railRef.current) return undefined;
    var opts = { tabs: n, autoStart: false };
    if (color != null) opts.color = color;
    if (durationMs != null) opts.durationMs = durationMs;
    var ctrl = TabLoader.create(railRef.current, opts);
    ctrlRef.current = ctrl;
    // Measure after layout, then park the underline under the active tab.
    measure();
    ctrl.set(fracRef.current[activeRef.current] || 0);
    var onResize = function () {
      measure();
      ctrl.set(fracRef.current[activeRef.current] || 0);
    };
    window.addEventListener('resize', onResize);
    return function () {
      window.removeEventListener('resize', onResize);
      if (ctrlRef.current) ctrlRef.current.destroy();
      ctrlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, color, durationMs]);

  function select(i, moveFocus) {
    if (i === activeRef.current || i < 0 || i >= n) return;
    var fr = fracRef.current;
    if (ctrlRef.current && fr.length) {
      ctrlRef.current.play(fr[activeRef.current] || 0, fr[i] || 0);
    }
    activeRef.current = i;
    _force[1](function (x) { return x + 1; });
    if (moveFocus && tabRefs.current[i]) tabRefs.current[i].focus();
    if (onChange) onChange(i);
  }

  function onKeyDown(e) {
    var next = null;
    if (e.key === 'ArrowRight') next = (activeRef.current + 1) % n;
    else if (e.key === 'ArrowLeft') next = (activeRef.current - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next != null) {
      e.preventDefault();
      select(next, true);
    }
  }

  var id = idRef.current;

  return React.createElement(
    'div',
    {
      className: className != null ? className : 'tl-tabs',
      // The underline strokes use currentColor — the styled default is
      // the brand accent; consumers re-theme via --tl-accent.
      style: { color: 'var(--tl-accent, #d97757)' }
    },
    React.createElement(
      'div',
      {
        role: 'tablist',
        onKeyDown: onKeyDown,
        // inline-flex so the wrapper hugs the buttons; the rail is
        // absolutely positioned inside it and inherits exactly that
        // width — the underline tracks real tab geometry.
        style: { display: 'inline-flex', gap: '4px', position: 'relative', paddingBottom: '10px' }
      },
      items.map(function (label, i) {
        var selected = i === active;
        return React.createElement(
          'button',
          {
            key: label + i,
            ref: function (el) { tabRefs.current[i] = el; },
            type: 'button',
            role: 'tab',
            id: id + '-tab-' + i,
            'aria-selected': selected ? 'true' : 'false',
            'aria-controls': id + '-panel-' + i,
            tabIndex: selected ? 0 : -1,
            onClick: function () { select(i, false); },
            style: {
              font: '13px/1.4 system-ui, sans-serif',
              padding: '8px 14px',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              color: selected
                ? 'var(--tl-text, #faf9f5)'
                : 'var(--tl-secondary, #b0aea5)',
              transition: 'color 0.15s ease'
            }
          },
          label
        );
      }),
      React.createElement('div', {
        ref: railRef,
        className: 'tl-tabs-rail',
        'aria-hidden': 'true',
        style: { position: 'absolute', left: 0, right: 0, bottom: 0, pointerEvents: 'none' }
      })
    ),
    React.Children.map(children, function (child, i) {
      if (child == null) return child;
      return React.createElement(
        'div',
        {
          role: 'tabpanel',
          id: id + '-panel-' + i,
          'aria-labelledby': id + '-tab-' + i,
          hidden: i !== active ? 'hidden' : undefined,
          style: { padding: '14px 2px', color: 'var(--tl-secondary, #b0aea5)', fontSize: '14px' }
        },
        child
      );
    })
  );
}
