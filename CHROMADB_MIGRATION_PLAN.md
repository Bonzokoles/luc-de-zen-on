# ChromaDB to Cloudflare D1 Migration Script

## 🔍 Analiza ChromaDB

### Znalezione Dane:

- **Database**: `chroma.sqlite3` (160KB)
- **Collection**: `bonzo_library` - "Bonzo Admin Dashboard Library"
- **Status**: Kolekcja istnieje ale embeddings są puste (0 rekordów)
- **Segments**: 2 segmenty (vector + metadata)

### Problem:

ChromaDB zawiera tylko strukturę, ale brak faktycznych danych sprzedażowych. Gemini prawdopodobnie przygotował strukturę ale nie zapisał danych.

## 🚀 Rozwiązanie: API Import System

### 1. Dodaj endpoint do importu danych sprzedażowych

```typescript
// src/pages/api/admin/sales-data-import.ts
export async function POST({ request, locals }) {
  const data = await request.json();
  const db = locals.runtime.env.DB;

  // Utworz tabele jeśli nie istnieją
  await db.exec(`
    CREATE TABLE IF NOT EXISTS global_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      region TEXT,
      product_category TEXT,
      revenue REAL,
      units_sold INTEGER,
      currency TEXT DEFAULT 'USD',
      date_recorded DATE,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_country ON global_sales(country);
    CREATE INDEX IF NOT EXISTS idx_date ON global_sales(date_recorded);
  `);

  const stmt = db.prepare(`
    INSERT INTO global_sales 
    (country, region, product_category, revenue, units_sold, currency, date_recorded, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const results = await db.batch(
    data.sales.map((item) =>
      stmt.bind(
        item.country,
        item.region,
        item.category,
        item.revenue,
        item.units,
        item.currency || "USD",
        item.date,
        "gemini_import"
      )
    )
  );

  return new Response(
    JSON.stringify({
      success: true,
      imported: results.length,
      message: `Imported ${results.length} sales records`,
    })
  );
}
```

### 2. Gemini Data Collection Script

```javascript
// gemini-sales-collector.js (do uruchomienia lokalnie)
async function collectGlobalSalesData() {
  const countries = [
    "USA",
    "Germany",
    "Japan",
    "UK",
    "France",
    "Canada",
    "Australia",
  ];
  const categories = ["Electronics", "Software", "Services", "Hardware"];

  const salesData = [];

  for (const country of countries) {
    for (const category of categories) {
      // Symulacja danych (zastąp prawdziwym API)
      salesData.push({
        country: country,
        region: getRegion(country),
        category: category,
        revenue: Math.random() * 1000000,
        units: Math.floor(Math.random() * 10000),
        currency: getCurrency(country),
        date: new Date().toISOString().split("T")[0],
      });
    }
  }

  // Import do D1
  const response = await fetch(
    "https://luc-de-zen-on.pages.dev/api/admin/sales-data-import",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ADMIN_TOKEN",
      },
      body: JSON.stringify({ sales: salesData }),
    }
  );

  console.log("Import result:", await response.json());
}
```

### 3. Admin Dashboard Panel

```astro
---
// src/pages/admin/sales-dashboard.astro
const db = locals.runtime.env.DB;
const salesData = await db.prepare(`
  SELECT country, SUM(revenue) as total_revenue, SUM(units_sold) as total_units
  FROM global_sales
  GROUP BY country
  ORDER BY total_revenue DESC
`).all();
---

<div class="sales-dashboard">
  <h2>Global Sales Data</h2>
  <div class="stats-grid">
    {salesData.results.map(row => (
      <div class="country-stat">
        <h3>{row.country}</h3>
        <p>Revenue: ${row.total_revenue.toLocaleString()}</p>
        <p>Units: {row.total_units.toLocaleString()}</p>
      </div>
    ))}
  </div>
</div>
```

## 🎯 Następne Kroki

1. **Dodaj D1 binding do wrangler.toml**
2. **Stwórz API endpoint do importu**
3. **Uruchom Gemini collection script**
4. **Zbuduj admin dashboard**
5. **Deploy i test**

## 💾 Migracja ChromaDB → D1

Jeśli w przyszłości będą dane w ChromaDB:

```python
# chroma-to-d1-export.py
import sqlite3
import json
import requests

def export_chroma_to_d1():
    conn = sqlite3.connect('chroma.sqlite3')
    # Wyciągnij embeddings i metadane
    # Przekształć na format D1
    # Wyślij przez API
    pass
```
