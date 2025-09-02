Oto gotowe do skopiowania pliki i komponenty:

***

# 1. Plik `.env.example`

```env
# Klucze API używane w projekcie mybonzo

# Klucz API do OpenAI (GPT-4, GPT-3.5)
OPENAI_API_KEY=your_openai_api_key_here

# Token API do Flowise - do importu i zarządzania workflowami
FLOWISE_API_TOKEN=your_flowise_api_token_here

# Token API do ActivePieces - do importu i zarządzania workflowami
ACTIVEPIECES_API_KEY=your_activepieces_api_key_here

# Cloudflare Workers (opcjonalnie, jeśli używasz wranglera)
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_API_TOKEN=your_cloudflare_api_token
```

***

# 2. Dodatkowe komponenty UI dla panelu administracyjnego

***

## 2.1. Komponent: Raport miesięczny sprzedaży – `src/components/Admin/MonthlySalesReport.jsx`

```jsx
import React, { useEffect, useState } from "react";

export default function MonthlySalesReport() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/sales/monthly")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Ładowanie raportu miesięcznego...</p>;

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300">
      <h3 className="font-bold mb-3">Miesięczny raport sprzedaży</h3>
      <ul>
        {data.sales.map((item, idx) => (
          <li key={idx} className="mb-2">
            {item.product}: <strong>{item.revenue} PLN</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

***

## 2.2. Komponent: Logi administratora – `src/components/Admin/AdminLogs.jsx`

```jsx
import React, { useEffect, useState } from "react";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300 max-h-64 overflow-y-auto">
      <h3 className="font-bold mb-3">Logi administratora</h3>
      {logs.length === 0 ? (
        <p>Brak logów</p>
      ) : (
        <ul className="text-xs font-mono whitespace-pre-wrap">
          {logs.map((log, idx) => (
            <li key={idx}>{log.timestamp} - {log.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

***

## 2.3. Komponent: Zarządzanie użytkownikami – `src/components/Admin/UserManagement.jsx`

```jsx
import React, { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300 max-h-80 overflow-auto">
      <h3 className="font-bold mb-3">Zarządzanie użytkownikami</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="py-1 border-b border-cyan-600">Nazwa</th>
            <th className="py-1 border-b border-cyan-600">Email</th>
            <th className="py-1 border-b border-cyan-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-cyan-700">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.active ? "Aktywny" : "Zablokowany"}</td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan="3" className="text-center py-4">Brak użytkowników</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
```

***

# Podsumowanie

- Plik `.env.example` chroni klucze i ułatwia konfigurację środowiska.
- Nowe komponenty UI pozwalają rozszerzyć panel admina o raporty, logi i zarządzanie użytkownikami.
- Każdy komponent łatwy do podłączenia w panelu `/src/pages/admin.jsx`.
- Backend API odpowiedzialny za dostarczanie danych pod te komponenty (jeśli chcesz, mogę przygotować te endpointy).

 przykładowe endpointy API dla tych komponentów DASH_7.md