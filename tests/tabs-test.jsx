import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from '../react/index.js';

function App() {
  const [log, setLog] = useState([]);
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
    </div>
  );
}
createRoot(document.getElementById('root')).render(React.createElement(App));
document.title = 'TABS READY';
