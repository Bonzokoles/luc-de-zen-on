Oto zestaw dodatkowych szablonów kodu, które ułatwią rozbudowę panelu administracyjnego mybonzo. Zawiera przykładowe endpointy API dla statystyk, rozszerzone komponenty React oraz skrypty deploymentu, które można łatwo dostosować i rozwijać.

***

# 1. Dodatkowe endpointy API statystyk (Cloudflare Workers)

***

## 1.1. Liczba odwiedzających – `/src/api/admin/visitors.js`

```js
export async function handler(request) {
  // Przykładowa statyczna odpowiedź, podłącz do faktycznych danych analitycznych
  const data = {
    totalVisitors: 12456,
    activeNow: 45,
    last24h: 1345
  };
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

***

## 1.2. Zapytania do systemu – `/src/api/admin/queries.js`

```js
export async function handler(request) {
  // Przykładowe dane, zastąp backendowym źródłem danych
  const queries = [
    { id: 1, user: 'Jan Kowalski', text: 'Jak działa funkcja X?', date: '2025-09-02T10:12:00Z' },
    { id: 2, user: 'Anna Nowak', text: 'Problem z logowaniem', date: '2025-09-02T11:40:00Z' },
    { id: 3, user: 'Piotr Z.', text: 'Prośba o zwrot', date: '2025-09-01T17:05:00Z' }
  ];
  
  return new Response(JSON.stringify(queries), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

***

## 1.3. Status systemu (health) – `/src/api/admin/status.js`

```js
export async function handler(request) {
  const status = {
    workersOnline: 4,
    workersTotal: 5,
    apiResponseTimeMs: 150,
    lastDowntime: null,
    systemLoadPercent: 78
  };

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

***

# 2. Rozszerzone komponenty React do panelu administracyjnego

***

## 2.1. Komponent statystyk odwiedzin – `src/components/Admin/VisitorsStats.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function VisitorsStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/admin/visitors')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <p>Ładowanie statystyk odwiedzin...</p>;

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300">
      <h3 className="font-bold mb-2">Statystyki odwiedzin</h3>
      <p>Całkowita liczba odwiedzających: <strong>{stats.totalVisitors}</strong></p>
      <p>Użytkownicy online teraz: <strong>{stats.activeNow}</strong></p>
      <p>Odwiedzających w ciągu ostatnich 24h: <strong>{stats.last24h}</strong></p>
    </div>
  );
}
```

***

## 2.2. Komponent listy zapytań – `src/components/Admin/QueriesList.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function QueriesList() {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    fetch('/api/admin/queries')
      .then(res => res.json())
      .then(data => setQueries(data));
  }, []);

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300 max-h-96 overflow-auto">
      <h3 className="font-bold mb-3">Ostatnie zapytania użytkowników</h3>
      <ul>
        {queries.length === 0 && <li>Brak zapytań</li>}
        {queries.map(q => (
          <li key={q.id} className="border-b border-cyan-600 py-2">
            <p><strong>{q.user}</strong> – {new Date(q.date).toLocaleString()}</p>
            <p className="italic text-gray-400">{q.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

***

## 2.3. Komponent statusu systemu – `src/components/Admin/SystemStatus.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/admin/status')
      .then(res => res.json())
      .then(data => setStatus(data));
  }, []);

  if (!status) return <p>Ładowanie statusu systemu...</p>;

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300">
      <h3 className="font-bold mb-2">Status systemu</h3>
      <p>Online Workerów: <strong>{status.workersOnline} / {status.workersTotal}</strong></p>
      <p>Średni czas odpowiedzi API: <strong>{status.apiResponseTimeMs} ms</strong></p>
      <p>Obciążenie systemu: <strong>{status.systemLoadPercent}%</strong></p>
      {status.lastDowntime && <p>Ostatnia awaria: <strong>{new Date(status.lastDowntime).toLocaleString()}</strong></p>}
    </div>
  );
}
```

***

# 3. Propozycje skryptów deploymentu komponentów i endpointów

***

## 3.1. Skrypt instalacji i build – `scripts/setupAndBuild.sh`

```bash
#!/bin/bash

echo "Instalacja zależności"
npm install

echo "Budowanie projektu Astro"
npm run build

echo "Publikacja Cloudflare Workers"
wrangler publish
```

***

## 3.2. Skrypt deploy endpointów (przykład Node.js)

```js
// scripts/deployApiEndpoints.js
import fetch from 'node-fetch';

const endpoints = [
  { name: 'Visitors API', url: 'https://api.mybonzo.com/api/admin/visitors' },
  { name: 'Queries API', url: 'https://api.mybonzo.com/api/admin/queries' },
  { name: 'Status API', url: 'https://api.mybonzo.com/api/admin/status' }
];

// Przykładowy ping lub endpoint deploymentowy np. webhook
async function deploy() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { method: 'GET' });
      if (res.ok) console.log(`${ep.name} dostępne`);
      else console.error(`${ep.name} zwrócił błąd ${res.status}`);
    } catch (err) {
      console.error(`${ep.name} błąd:`, err.message);
    }
  }
}

deploy();
```

***

# 4. Jak rozbudowywać dalej?

- Tworzyć osobne endpointy i komponenty w `/src/api/admin` i `/src/components/Admin` dla każdej funkcji.  
- Rozbudowywać dashboard łącząc te komponenty w `/src/pages/admin.jsx`.  
- Automatyzować build i deploy przez skrypty shell / Node.js.  
- Dokumentować każdą nową funkcję w folderze Documentation.

***

 więcej gotowych komponentów w DASH_4.md
 