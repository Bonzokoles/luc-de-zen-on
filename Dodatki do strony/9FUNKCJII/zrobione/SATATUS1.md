Poniżej znajdziesz zestaw gotowych plików: backend (API), frontend (React), szablon stylów oraz przykładowe dane do panelu “Status Workerów” z wykresami i tabelą. Te fragmenty możesz skopiować do projektu i łatwo rozbudować.

***

## 1. Endpoint backend – `/src/api/workersStatus.js`

```js
// Przykład mockowanego endpointu API do statusu workerów

export async function handler(req) {
  // Docelowo pobierz dane z systemu monitoringu/Cloudflare Workers API
  const data = [
    {
      name: 'GeneratorFAQ',
      status: 'online',
      cpu: 32,
      ram: 79,
      requests: 150,
      responseMs: 140,
      lastCheck: '2025-09-02T16:40:00Z'
    },
    {
      name: 'Magazyn',
      status: 'offline',
      cpu: null,
      ram: null,
      requests: 0,
      responseMs: null,
      lastCheck: '2025-09-02T16:38:00Z'
    },
    {
      name: 'Rekomendacje',
      status: 'partial',
      cpu: 67,
      ram: 39,
      requests: 69,
      responseMs: 200,
      lastCheck: '2025-09-02T16:41:00Z'
    }
    // ... inne workery
  ];

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

***

## 2. Komponent React Dashboard – `/src/components/WorkersStatusDashboard.jsx`

```jsx
import React, { useState } from 'react';
import WorkersStatusChart from './WorkersStatusChart';

const statusColor = status =>
  status === 'online' ? 'text-green-400'
    : status === 'partial' ? 'text-yellow-400'
    : 'text-red-400';

export default function WorkersStatusDashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    const res = await fetch('/api/workersStatus');
    const data = await res.json();
    setWorkers(data);
    setLoading(false);
  };

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300">
      <h2 className="font-bold text-2xl mb-4">STATUS WORKERÓW</h2>
      <p>Sprawdź status i dostępność wszystkich API workerów</p>
      <div className="flex gap-2 my-3">
        <button className="bg-cyan-900 px-3 py-1 rounded" onClick={fetchStatus}>HEALTH CHECK</button>
        <button className="bg-cyan-900 px-3 py-1 rounded" onClick={() => setShowChart(true)}>MONITORING</button>
        <button className="bg-cyan-900 px-3 py-1 rounded" onClick={fetchStatus}>API STATUS</button>
      </div>

      <div className="mb-2">
        {loading ? "Trwa sprawdzanie..." :
          workers.length > 0
            ? <span>
                {workers.filter(w => w.status === 'online').length} / {workers.length} online
              </span>
            : <span>Częściowo online (0/0)</span>
        }
      </div>

      <table className="min-w-full bg-black rounded text-cyan-100 my-3">
        <thead>
          <tr>
            <th className="py-1">Nazwa</th>
            <th className="py-1">Status</th>
            <th className="py-1">CPU</th>
            <th className="py-1">RAM</th>
            <th className="py-1">Requests/min</th>
            <th className="py-1">Response [ms]</th>
            <th className="py-1">Health Check</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w, i) => (
            <tr key={i} className="border-b border-cyan-800">
              <td>{w.name}</td>
              <td className={statusColor(w.status)}>{w.status}</td>
              <td>{w.cpu !== null ? w.cpu + "%" : "-"}</td>
              <td>{w.ram !== null ? w.ram + "%" : "-"}</td>
              <td>{w.requests}</td>
              <td>{w.responseMs !== null ? w.responseMs : "-"}</td>
              <td>{w.lastCheck ? new Date(w.lastCheck).toLocaleTimeString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="w-full bg-cyan-800 p-3 rounded mb-2" onClick={fetchStatus}>
        SPRAWDŹ WSZYSTKIE
      </button>
      <button className="w-full bg-cyan-800 p-3 rounded" onClick={() => setShowChart(!showChart)}>
        MONITOR
      </button>

      {showChart && workers.length > 0 && (
        <WorkersStatusChart workers={workers} onClose={() => setShowChart(false)} />
      )}
    </div>
  );
}
```

***

## 3. Komponent wykresu – `/src/components/WorkersStatusChart.jsx`

(dla uproszczenia – korzysta np. z [recharts.org](https://recharts.org))

```jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WorkersStatusChart({ workers, onClose }) {
  // Dane do wykresu: można uzupełnić o historię z backendu!
  const chartData = workers.map(w => ({
    name: w.name,
    requests: w.requests,
    cpu: w.cpu,
    ram: w.ram
  }));

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-cyan-950 rounded-lg p-6 z-50 w-[560px] border border-cyan-700 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-cyan-400">Monitoring Workerów</h3>
        <button className="text-cyan-400 hover:text-pink-300" onClick={onClose}>[zamknij]</button>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="requests" stroke="#00e7ff" />
          <Line type="monotone" dataKey="cpu" stroke="#ffc13b" />
          <Line type="monotone" dataKey="ram" stroke="#e91e63" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

***

## 4. Przykładowy styl (dodaj do głównego CSS lub Tailwinda)

```css
/* Wybrane klasy dostosowujące tło, kolory statusów, tabelę */
.bg-black { background: #0e1720; }
.text-cyan-300 { color: #00e7ff; }
.text-green-400 { color: #49ff77; }
.text-yellow-400 { color: #ffd600; }
.text-red-400 { color: #ff456e; }
.bg-cyan-800 { background: #054b59; }
.bg-cyan-900 { background: #083848; }
```

***

# Instrukcja

1. Umieść endpoint `/src/api/workersStatus.js` w katalogu backend (jako handler lub API worker).
2. Umieść komponenty dashboardu i wykresu w folderze komponentów React.
3. Upewnij się, że masz skonfigurowanego Recharts (`npm install recharts`).
4. Dodaj styl do CSS lub Tailwinda zgodnie z własnym systemem.
5. Połącz dashboard w głównym layoucie lub podstronie admina.

***

Działający panel automatycznie pobierze dane o statusie workerów, zaprezentuje tabelę oraz wykres dla admina – i łatwo można go rozbudować o historię, alerty i szczegółowe analizy.

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/92027992/bc426bbc-cbe3-4760-af2f-546ee4fbc8d6/3397E736-8941-4C1B-9B58-C55F58A5F9BB.jpg)