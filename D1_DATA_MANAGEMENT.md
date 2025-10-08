# Alternatywne sposoby zarządzania danymi w Cloudflare D1

## 🛠️ Dostępne Metody (bez redeploy)

### 1. **Wrangler CLI - Bezpośredni SQL**

```bash
# Konfiguracja w wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "mybonzo-analytics"
database_id = "5d83cdc3-e897-4af2-b647-27352297430b"

# Wykonanie SQL bezpośrednio
wrangler d1 execute mybonzo-analytics --command="INSERT INTO business_data ..."
wrangler d1 execute mybonzo-analytics --file="data.sql"
```

### 2. **API Endpoint na Live Site**

```typescript
// /api/d1-import.ts
export async function POST({ request, locals }) {
  const data = await request.json();
  const db = locals.runtime.env.DB;

  const stmt = db.prepare(
    "INSERT INTO business_data (name, value, category) VALUES (?, ?, ?)"
  );
  const results = await db.batch(
    data.map((item) => stmt.bind(item.name, item.value, item.category))
  );

  return new Response(
    JSON.stringify({ success: true, inserted: results.length })
  );
}
```

### 3. **Bulk Import via CSV/JSON**

```bash
# Import z pliku CSV
wrangler d1 execute mybonzo-analytics --file="business_data.csv"

# Import z pliku JSON (poprzez SQL)
node convert-json-to-sql.js data.json > import.sql
wrangler d1 execute mybonzo-analytics --file="import.sql"
```

### 4. **Workers Script dla Import**

```javascript
// import-worker.js
export default {
  async fetch(request, env) {
    const data = await request.json();
    const results = [];

    for (const item of data.businesses) {
      const stmt = env.DB.prepare(`
        INSERT INTO business_data (name, industry, revenue, employees)
        VALUES (?, ?, ?, ?)
      `);
      const result = await stmt
        .bind(item.name, item.industry, item.revenue, item.employees)
        .run();
      results.push(result);
    }

    return Response.json({ success: true, imported: results.length });
  },
};
```

### 5. **Dashboard Admin Panel**

```typescript
// /admin/data-import.astro - Strona administracyjna
const importBusinessData = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const data = JSON.parse(await file.text());

  const response = await fetch("/api/d1-import", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.json();
};
```

## 🚀 Zalecane Podejście

### Krok 1: Dodaj konfigurację D1 do wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "mybonzo-analytics"
database_id = "5d83cdc3-e897-4af2-b647-27352297430b"
```

### Krok 2: Utwórz API endpoint do importu

- `/api/admin/data-import.ts`
- Zabezpieczony tokenem admin
- Obsługuje JSON/CSV

### Krok 3: Panel administracyjny

- `/admin/data-management`
- Upload plików
- Preview przed importem
- Bulk operations

## 💡 Korzyści

- ✅ Bez potrzeby redeploy
- ✅ Realtime import danych
- ✅ Walidacja danych
- ✅ Rollback możliwości
- ✅ Progress tracking
