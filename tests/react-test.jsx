import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Orbit, Typing, Tab, shapes } from '../react/index.js';

function App() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ background: '#141413', color: '#faf9f5', padding: 40, display: 'flex', gap: 32, alignItems: 'center' }}>
      <Orbit d={{ shape: 'circle', args: [72] }} viewBox="0 0 72 72" width={72} height={72} color="#d97757" />
      <Typing width={100} height={40} color="#788c5d" />
      <div>
        <div style={{ display: 'flex', gap: 16, fontSize: 14, cursor: 'pointer' }}>
          {['Alpha', 'Beta', 'Gamma'].map((t, i) => (
            <span key={t} onClick={() => setTab(i)} style={{ color: tab === i ? '#faf9f5' : '#b0aea5' }}>{t}</span>
          ))}
        </div>
        <Tab labels={['Alpha', 'Beta', 'Gamma']} color="#6a9bcc" width={180} autoStart={false} id="rtab" />
      </div>
    </div>
  );
}
createRoot(document.getElementById('root')).render(React.createElement(App));
document.title = 'REACT MOUNTED';
