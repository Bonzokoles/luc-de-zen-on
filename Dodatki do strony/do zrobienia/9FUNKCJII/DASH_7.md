Oto gotowe przykładowe endpointy API w formacie Cloudflare Workers (lub inny backend zgodny z projektem) dla komponentów: raport miesięczny sprzedaży, logi administratora i zarządzanie użytkownikami.

***

# 1. Endpoint API – Raport miesięczny sprzedaży `/src/api/admin/sales/monthly.js`

```js
export async function handler(request) {
  // Przykładowe dane raportu miesięcznego
  const data = {
    sales: [
      { product: "Produkt A", revenue: 12500 },
      { product: "Produkt B", revenue: 10800 },
      { product: "Produkt C", revenue: 9600 },
      { product: "Usługa D", revenue: 7200 }
    ]
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
```

***

# 2. Endpoint API – Logi administratora `/src/api/admin/logs.js`

```js
export async function handler(request) {
  // Przykładowe logi z ostatnich zdarzeń systemowych
  const logs = [
    { timestamp: "2025-09-02T16:20:00Z", message: "Zalogowano użytkownika admin" },
    { timestamp: "2025-09-01T09:10:00Z", message: "Utworzono nowy workflow" },
    { timestamp: "2025-08-30T14:45:00Z", message: "Błąd połączenia z API zewnętrznym" }
  ];

  return new Response(JSON.stringify(logs), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
```

***

# 3. Endpoint API – Zarządzanie użytkownikami `/src/api/admin/users.js`

```js
export async function handler(request) {
  // Przykładowa lista użytkowników
  const users = [
    { id: 1, name: "Jan Kowalski", email: "jan.kowalski@example.com", active: true },
    { id: 2, name: "Anna Nowak", email: "anna.nowak@example.com", active: false },
    { id: 3, name: "Piotr Wiśniewski", email: "piotr.wisniewski@example.com", active: true }
  ];

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
```

***

# Uwagi do implementacji

- Endpoints można rozbudować o autoryzację (np. JWT, basic auth).  
- Dane statyczne to przykłady – w produkcji podłączyć do bazy danych lub odpowiednich usług.  
- Można dodać operacje POST/PUT/DELETE do zarządzania użytkownikami, jeśli planujesz takie funkcje.  

 rozszerzone endpointy CRUD i integracje z bazą danych. - DASH_8.md