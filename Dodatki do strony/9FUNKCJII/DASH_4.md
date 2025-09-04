Oto kolejna porcja gotowych, modułowych komponentów React dla panelu administracyjnego mybonzo, które łatwo będzie integrować i rozszerzać. Komponenty są zgodne stylem i strukturą z poprzednimi przykładami.

***

# Gotowe komponenty React do panelu Admin (kontynuacja)

***

## 1. Komponent tabeli zamówień/faktur – `/src/components/Admin/OrdersTable.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300 max-h-96 overflow-auto">
      <h3 className="font-bold mb-3">Zamówienia i faktury</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="py-1 border-b border-cyan-600">ID</th>
            <th className="py-1 border-b border-cyan-600">Klient</th>
            <th className="py-1 border-b border-cyan-600">Data</th>
            <th className="py-1 border-b border-cyan-600">Kwota</th>
            <th className="py-1 border-b border-cyan-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b border-cyan-700">
              <td>{o.id}</td>
              <td>{o.clientName}</td>
              <td>{new Date(o.date).toLocaleDateString()}</td>
              <td>{o.amount} PLN</td>
              <td className={`font-semibold ${o.status === 'opłacone' ? 'text-green-400' : 'text-yellow-400'}`}>
                {o.status}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Brak zamówień
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

***

## 2. Komponent wykresu sprzedaży dziennej – `/src/components/Admin/SalesChart.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/admin/sales')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="bg-[#131e28] p-4 rounded text-cyan-300" style={{ height: 300 }}>
      <h3 className="font-bold mb-3">Sprzedaż dzienna (ostatni miesiąc)</h3>
      {data.length === 0 ? (
        <p>Ładowanie...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#00e7ff" fill="#0a7185" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```

***

## 3. Komponent alertów systemowych – `/src/components/Admin/AlertsBar.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function AlertsBar() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('/api/admin/alerts')
      .then(res => res.json())
      .then(setAlerts);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-900 text-white p-3 rounded mb-4">
      <strong>Alerty systemowe:</strong>
      <ul>
        {alerts.map((alert, i) => (
          <li key={i} className="mt-1">
            {alert.message} - <em>{new Date(alert.timestamp).toLocaleTimeString()}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

***

## 4. Komponent panelu wskaźników KPI – `/src/components/Admin/KPIPanel.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function KPIPanel() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kpi')
      .then(res => res.json())
      .then(setKpi);
  }, []);

  if (!kpi) return <p>Ładowanie KPI...</p>;

  return (
    <div className="grid grid-cols-4 gap-4 bg-[#131e28] p-4 rounded text-cyan-300">
      <div className="bg-[#0e2633] p-4 rounded shadow">
        <h4 className="font-bold mb-2">Wartość sprzedaży</h4>
        <p className="text-2xl">{kpi.salesValue} PLN</p>
      </div>
      <div className="bg-[#0e2633] p-4 rounded shadow">
        <h4 className="font-bold mb-2">Nowi użytkownicy</h4>
        <p className="text-2xl">{kpi.newUsers}</p>
      </div>
      <div className="bg-[#0e2633] p-4 rounded shadow">
        <h4 className="font-bold mb-2">Średni czas reakcji</h4>
        <p className="text-2xl">{kpi.avgResponseTime} ms</p>
      </div>
      <div className="bg-[#0e2633] p-4 rounded shadow">
        <h4 className="font-bold mb-2">Zgłoszenia otwarte</h4>
        <p className="text-2xl">{kpi.openTickets}</p>
      </div>
    </div>
  );
}
```

***

# 5. Przykładowe endpointy API dla powyższych komponentów

***

## 5.1. `/src/api/admin/orders.js`

```js
export async function handler(request) {
  const orders = [
    { id: 'ZAM001', clientName: 'Jan Kowalski', date: '2025-09-02', amount: 1250, status: 'opłacone' },
    { id: 'ZAM002', clientName: 'Anna Nowak', date: '2025-09-01', amount: 670, status: 'nieopłacone' },
    { id: 'ZAM003', clientName: 'Piotr W.', date: '2025-08-28', amount: 980, status: 'opłacone' }
  ];
  return new Response(JSON.stringify(orders), { headers: { 'Content-Type': 'application/json' } });
}
```

***

## 5.2. `/src/api/admin/sales.js`

```js
export async function handler(request) {
  const data = [
    { date: '2025-08-30', sales: 1200 },
    { date: '2025-08-31', sales: 900 },
    { date: '2025-09-01', sales: 1500 },
    { date: '2025-09-02', sales: 1700 }
  ];
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
```

***

## 5.3. `/src/api/admin/alerts.js`

```js
export async function handler(request) {
  const alerts = [
    { message: 'Worker "Magazyn" offline', timestamp: Date.now() - 60000 },
    { message: 'Użytkownik zablokowany za nieautoryzowane logowanie', timestamp: Date.now() - 360000 }
  ];
  return new Response(JSON.stringify(alerts), { headers: { 'Content-Type': 'application/json' } });
}
```

***

## 5.4. `/src/api/admin/kpi.js`

```js
export async function handler(request) {
  const kpi = {
    salesValue: 124350,
    newUsers: 340,
    avgResponseTime: 158,
    openTickets: 12
  };
  return new Response(JSON.stringify(kpi), { headers: { 'Content-Type': 'application/json' } });
}
```

***

# 6. Jak rozwijać dalej

- Można tworzyć nowe endpointy i komponenty analogicznie zgodnie z potrzebami panelu.
- Wdrożyć system cache dla statystyk i odświeżania (np. co 5 min).
- Dodawać kontrolki filtrów i wyszukiwania w tabelach (np. po datach, statusach).
- Rozbudowywać funkcje automatycznych alertów i notyfikacji.
- Przygotować testy jednostkowe i integracyjne UI/backend.

***

 przygotuje integracje CI/CD, szablony dokumentacji do każdej sekcji i rozbudowane skrypty deploymentu.sprawdz DASH_5.md