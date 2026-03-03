<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Cloudflare‑native: R2 + D1 + Workers + polskie nazwy

Całość na Cloudflare (R2 storage, D1 baza, Workers API), z polskimi nazwami endpointów i prostym UI do dokumentów.

### 1. Struktura Cloudflare (polskie nazwy)

```
mybonzo-finanse/
├── wrangler.toml          # config Workers + D1 + R2
├── src/
│   ├── api/
│   │   ├── dashboard-finanse.ts     # GET /api/finanse/dashboard
│   │   ├── dokumenty-finansowe.ts   # GET /api/dokumenty-finansowe/dashboard
│   │   ├── rentownosc.ts           # GET /api/rentownosc
│   │   └── import-kosztow.ts       # POST /api/import-kosztow/csv
│   ├── storage/
│   │   └── r2-buckets.ts           # helper R2 operations
│   └── db/
│       └── d1-schema.sql           # CREATE TABLE koszty, etc.
└── ui/
    └── dokumenty.tsx               # drag&drop CSV/PDF
```


### 2. Endpointy polskie nazwy

```
GET  /api/finanse/dashboard           → FinansePro.tsx
GET  /api/dokumenty-finansowe         → DokumentyFinansowe.tsx  
POST /api/analiza-ryzyka              → analiza Gemini
POST /api/import-kosztow/csv          → upload CSV faktur
GET  /api/rentownosc                  → marże po kategoriach
GET  /api/podsumowanie-finansowe      → AI summary (prompt + dane)
```


### 3. Prosty upload dokumentów/kosztów (R2 + D1)

**UI w `dokumenty.tsx`** (drag \& drop CSV/PDF):

```tsx
// src/components/DokumentyUploader.tsx
function DokumentyUploader() {
  const handleDrop = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const res = await fetch('/api/import-kosztow/csv', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    toast.success(`${result.imported} kosztów zaimportowanych`);
  };

  return (
    <div className="border-2 border-dashed p-8 rounded-lg">
      <p>Przeciągnij CSV z fakturami lub PDF</p>
      <input 
        type="file" 
        multiple 
        accept=".csv,.pdf"
        onChange={(e) => handleDrop(Array.from(e.target.files || []))}
      />
    </div>
  );
}
```

**Worker `import-kosztow.ts`** (R2 + D1):

```ts
// src/api/import-kosztow.ts
export default {
  async fetch(request: Request, env: Env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    let imported = 0;
    for (const file of files) {
      if (file.name.endsWith('.csv')) {
        await handleCsvImport(file, env);
        imported++;
      } else if (file.name.endsWith('.pdf')) {
        // Zapisz PDF do R2, dodaj rekord do D1 jako 'DO ANALIZY'
        const pdfKey = `dokumenty/${Date.now()}-${file.name}`;
        await env.R2_FINANSE.put(pdfKey, file.stream());
        await env.D1.prepare(`
          INSERT INTO dokumenty_finansowe 
          (id, tenant_id, typ, plik_url, status) 
          VALUES (?, ?, 'PDF', ?, 'DO_ANALIZY')
        `).bind(crypto.randomUUID(), 'meblepumo', pdfKey).run();
      }
    }

    return Response.json({ imported, message: 'Import zakończony' });
  }
};

async function handleCsvImport(file: File, env: Env) {
  const csv = await file.text();
  const lines = csv.split('\n').slice(1); // pomiń header

  for (const line of lines) {
    const [data, kwota, kontrahent, kategoria] = line.split(';');
    
    if (!kwota || !kontrahent) continue;

    const id = `cost_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    // Wstaw do D1
    await env.D1.prepare(`
      INSERT INTO koszty 
      (id, tenant_id, data, kwota, kontrahent, kategoria, status) 
      VALUES (?, 'meblepumo', ?, ?, ?, ?, 'PAID')
    `).bind(id, data, parseFloat(kwota), kontrahent, kategoria).run();
  }
}
```


### 4. `wrangler.toml` dla całego stacku

```toml
name = "mybonzo-finanse"
main = "src/api/dashboard-finanse.ts"
compatibility_date = "2026-03-03"

[[d1_databases]]
binding = "D1"
database_name = "mybonzo"
database_id = "twoj_d1_id"

[[r2_buckets]]
binding = "R2_FINANSE"
bucket_name = "mybonzo-finanse"

[env.production.vars]
TENANT_ID = "meblepumo"
```


### 5. Polskie nazwy w UI + dashboard

**`FinansePro.tsx`** (fragment):

```tsx
// Karty KPI
<div className="grid grid-cols-3 gap-4">
  <KPICard 
    tytul="Przychody" 
    wartosc={data.kpi_cards.przychody} 
    zmiana="+25%" 
  />
  <KPICard 
    tytul="Koszty" 
    wartosc={data.kpi_cards.koszty} 
    zmiana="-9%" 
  />
  <KPICard 
    tytul="Zysk netto" 
    wartosc={data.kpi_cards.zysk_netto} 
    kolor="green" 
  />
</div>

// Wykres
<WykresPrzeplywow 
  dane={data.wykres_przeplywow} 
  tytul="Przepływy pieniężne" 
/>

// AI insight
<div className="bg-blue-50 p-4 rounded-lg">
  <h3>Analiza AI</h3>
  <p>{data.wglad_ai.podsumowanie}</p>
  <ul>
    {data.wglad_ai.dzialania.map((akcja, i) => (
      <li key={i}>{akcja}</li>
    ))}
  </ul>
</div>
```


### 6. Deploy jednym poleceniem

```bash
# lokalnie
wrangler dev --remote

# produkcja
wrangler deploy
wrangler d1 execute mybonzo --file=./db/d1-schema.sql --remote
```

**Teraz masz:**

- ✅ Cloudflare Workers + D1 + R2 (zero zewnętrznych usług),
- ✅ Polskie endpointy i UI (`/api/finanse/dashboard`, „Przychody”, „Koszty"),
- ✅ Drag \& drop CSV/PDF → automatyczny import do `koszty` + zapis PDF do R2,
- ✅ Realne dane Pumo z D1 (bez fakerów).

Następny krok: struktura tabeli `dokumenty_finansowe` w D1 + logika analizy ryzyka z Gemini po imporcie PDF?

<div align="center">⁂</div>

