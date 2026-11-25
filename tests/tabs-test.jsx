import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from '../react/index.js';

function App() {
  const [log, setLog] = useState([]);
  // Label text the measure pass must track: flipping these must re-measure
  // the tab geometry (the effect deps include the joined labels).
  const [swapped, setSwapped] = useState(false);
  const labels = swapped ? ['A much longer label text', 'B'] : ['Short', 'Longer Label Here'];
  return (
    <div style={{ background: 'var(--tl-bg, #141413)', minHeight: '100vh', padding: 40 }}>
      <Tabs
        items={['One', 'Two', 'Three']}
        onChange={function (i) { setLog(function (l) { return l.concat(i); }); }}
      >
        <div>Panel one content</div>
        <div>Panel two content</div>
        <div>Panel three content</div>
      </Tabs>
      <div id="log" style={{ color: '#b0aea5', marginTop: 16, fontSize: 12 }}>{log.join(',')}</div>

      {/* segFraction forwarding: the drawn underline must be half the rail */}
      <div style={{ marginTop: 32 }} data-test="segfrac">
        <Tabs items={['Alpha', 'Beta']} segFraction={0.5} color="#6a9bcc">
          <div>Alpha panel</div>
          <div>Beta panel</div>
        </Tabs>
      </div>

      {/* label change must re-measure: geometry before/after must differ */}
      <div style={{ marginTop: 32 }} data-test="remeasure">
        <Tabs items={labels} initial={0}>
          <div>A panel</div>
          <div>B panel</div>
        </Tabs>
        <button id="swap-labels" onClick={function () { setSwapped(!swapped); }}>swap labels</button>
      </div>
    </div>
  );
}
createRoot(document.getElementById('root')).render(React.createElement(App));
document.title = 'TABS READY';
