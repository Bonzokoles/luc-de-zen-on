Oto rozbudowany zestaw komponentów frontendowych (React w Astro), endpointów backendowych oraz stylów dla Panelu Administracyjnego mybonzo wraz z projektem podstrony zarządzania kodem i wdrożeniami. Wszystko zaprojektowane modularnie, z możliwością łatwego dodawania kolejnych funkcji.

***

# 1. Komponenty frontendowe (Astro + React)

***

### 1.1. Główny komponent panelu admina - `/src/pages/admin.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import PanelStats from '../components/Admin/PanelStats.jsx';
import TrafficChart from '../components/Admin/TrafficChart.jsx';
import UsersTable from '../components/Admin/UsersTable.jsx';
import TicketsTable from '../components/Admin/TicketsTable.jsx';
import Finances from '../components/Admin/Finances.jsx';
import StatusBox from '../components/Admin/StatusBox.jsx';
import AlertsBar from '../components/Admin/AlertsBar.jsx';
import CodeManager from '../components/Admin/CodeManager.jsx';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (password === 'HAOS77') setAuth(true);
    else alert('Niepoprawne hasło');
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0e1720] text-cyan-400 p-8">
        <h1 className="mb-6 text-3xl font-bold">Panel Administracyjny</h1>
        <input
          type="password"
          placeholder="Podaj hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 p-3 w-72 rounded bg-gray-900 text-cyan-300 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-cyan-700 rounded hover:bg-cyan-900"
        >
          Zaloguj się
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1720] text-cyan-300 p-6 space-y-6">
      <AlertsBar />
      <PanelStats />
      <TrafficChart />
      <UsersTable />
      <TicketsTable />
      <Finances />
      <StatusBox />
      <CodeManager />
      <button
        onClick={() => setAuth(false)}
        className="fixed bottom-6 right-6 bg-red-600 px-4 py-2 rounded hover:bg-red-800"
      >
        Wyloguj się
      </button>
    </div>
  );
}
```

***

### 1.2. Komponent służący do zarządzania kodami, wdrażania i ustawień – `/src/components/Admin/CodeManager.jsx`

```jsx
import React, { useState, useEffect } from 'react';

export default function CodeManager() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Załaduj domyślny lub ostatni kod (można rozszerzyć backendem)
  useEffect(() => {
    setCode('// Wklej lub edytuj kod tutaj');
  }, []);

  async function deployCode() {
    setIsDeploying(true);
    try {
      // Przykładowy endpoint do deploymentu kodu
      const res = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setOutput(data.message || 'Deployment zakończony');
    } catch (e) {
      setOutput('Błąd podczas deploymentu: ' + e.message);
    }
    setIsDeploying(false);
  }

  return (
    <div className="bg-[#131e28] rounded p-4">
      <h3 className="font-bold text-xl mb-3">Zarządzaj kodami i wdrażaj rozwiązania</h3>
      <textarea
        rows={12}
        value={code}
        onChange={e => setCode(e.target.value)}
        className="w-full p-3 bg-gray-900 text-cyan-300 rounded font-mono"
      />
      <button
        disabled={isDeploying}
        onClick={deployCode}
        className="mt-3 px-6 py-2 bg-cyan-700 hover:bg-cyan-900 rounded disabled:opacity-50"
      >
        {isDeploying ? 'Deploy w toku...' : 'Wdrażaj kod'}
      </button>
      {output && <div className="mt-3 whitespace-pre-wrap bg-gray-800 p-3 rounded">{output}</div>}
    </div>
  );
}
```

***

# 2. Przykładowe endpointy backendowe (Cloudflare Workers)

***

### 2.1. Endpoint do wysyłania kodu do deploymentu – `/src/api/admin/deploy.js`

```js
export async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Metoda niedozwolona', { status: 405 });
  }
  try {
    const { code } = await request.json();
    // Tu dodaj mechanizm zapisujący/uruchamiający kod deploymentu
    // Można integrować np. z systemem CI/CD, skryptami wrangler, ActivePieces itd.

    // Na potrzeby przykładowe — zwracamy status ok
    return new Response(JSON.stringify({ message: 'Kod odebrany i gotowy do wdrożenia.' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
```

***

### 2.2. Przykładowe endpointy statystyk (do rozbudowy)

- `/src/api/admin/visitors.js` – liczba odwiedzających  
- `/src/api/admin/queries.js` – zapytania do systemu  
- `/src/api/admin/users.js` – lista użytkowników i statusy  
- `/src/api/admin/tickets.js` – zgłoszenia i statusy  
- `/src/api/admin/finances.js` – zestawienie finansów i płatności  
- `/src/api/admin/status.js` – health i status systemu

***

# 3. Stylizacja (do globalnego CSS lub np. Tailwind config)

```css
body {
  background-color: #0e1720;
  color: #00e7ff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button {
  font-weight: 600;
}

textarea {
  font-family: monospace;
  resize: vertical;
}

.bg-[#131e28] {
  background-color: #131e28;
}

.bg-cyan-700 {
  background-color: #0ea5e9; /* lub inny odcień cyan */
}
```

***

# 4. Możliwości rozbudowy

- W endpointach backendowych podpiąć konkretne źródła danych (bazy, API).
- Rozszerzyć `CodeManager` o podgląd historii kodów, rollback, podgląd logs.
- Dodanie autoryzacji JWT/session zamiast prostego hasła.
- Ping systemów i workerów oraz wyświetlanie alertów w `AlertsBar`.
- Eksportowanie raportów do PDF/CSV z panelu.
- Dynamiczne automatyczne odświeżanie danych pod UI.

***

dodam szablony dodatkowych endpointów statystyk, komponentów lub skryptów deploymentu do wybranych części panelu w DASH_3.md