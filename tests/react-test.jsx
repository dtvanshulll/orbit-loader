import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Orbit, Typing, Tab, shapes } from '../react/index.js';

function App() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ background: '#0e0e12', color: '#eceef2', padding: 40, display: 'flex', gap: 32, alignItems: 'center' }}>
      <Orbit d={{ shape: 'circle', args: [72] }} viewBox="0 0 72 72" width={72} height={72} color="#e8355c" />
      <Typing width={100} height={40} color="#34d399" />
      <div>
        <div style={{ display: 'flex', gap: 16, fontSize: 14, cursor: 'pointer' }}>
          {['Alpha', 'Beta', 'Gamma'].map((t, i) => (
            <span key={t} onClick={() => setTab(i)} style={{ color: tab === i ? '#eceef2' : '#9a9ba4' }}>{t}</span>
          ))}
        </div>
        <Tab labels={['Alpha', 'Beta', 'Gamma']} color="#5b8cff" width={180} autoStart={false} id="rtab" />
      </div>
    </div>
  );
}
createRoot(document.getElementById('root')).render(React.createElement(App));
document.title = 'REACT MOUNTED';
