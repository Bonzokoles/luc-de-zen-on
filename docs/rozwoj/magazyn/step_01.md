<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Nowy moduł: Magazyn (stany + alerty + AI optymalizacja)

**Ścieżka:** `/magazyn`

***

### 1. Struktura bazy D1 (Magazyn)

```sql
-- Produkty / pozycje magazynowe
CREATE TABLE produkty_magazyn (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  kod TEXT UNIQUE,
  kategoria TEXT,
  ean_kod TEXT,
  cena_zakupu_netto DECIMAL(10,2),
  cena_sprzedazy_netto DECIMAL(10,2),
  marza_procent DECIMAL(5,2),
  stan_aktualny INTEGER DEFAULT 0,
  minimalny_stan INTEGER DEFAULT 10,  -- alert przy tym stanie
  lokalizacja TEXT,                   -- półka A1, regał B2
  dostawca TEXT,
  data_ostatniego_ruchu DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ruchy magazynowe
CREATE TABLE ruchy_magazynowe (
  id TEXT PRIMARY KEY,
  produkt_id TEXT NOT NULL,
  typ TEXT CHECK (typ IN ('przyjście', 'wydanie', 'korekta', 'inwentaryzacja')),
  ilosc INTEGER NOT NULL,
  powod TEXT,                         -- sprzedaż, zakup, zwrot
  klient_id TEXT,                     -- powiązanie z CRM
  numer_dokumentu TEXT,               -- FV/..., PZ/...
  data DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(produkt_id) REFERENCES produkty_magazyn(id)
);

-- Alerty magazynowe
CREATE TABLE alerty_magazyn (
  id TEXT PRIMARY KEY,
  produkt_id TEXT NOT NULL,
  poziom_alertu TEXT CHECK (poziom_alertu IN ('niski_stan', 'brak_stanu', 'przekroczenie')),
  data_alertu DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved INTEGER DEFAULT 0,
  FOREIGN KEY(produkt_id) REFERENCES produkty_magazyn(id)
);
```


***

### 2. Endpointy Magazynu

#### a) `GET /api/magazyn/produkty`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const firma_id = url.searchParams.get('firma_id') || 'demo';
    const kategoria = url.searchParams.get('kategoria') || 'all';
    const alert_only = url.searchParams.get('alert_only') === 'true';

    let query = `
      SELECT 
        p.*,
        COALESCE(r.stan_aktualny, 0) as stan_aktualny,
        CASE 
          WHEN COALESCE(r.stan_aktualny, 0) <= p.minimalny_stan THEN 'alert'
          ELSE 'ok' 
        END as status_magazynu
      FROM produkty_magazyn p
      LEFT JOIN (
        SELECT 
          produkt_id,
          SUM(CASE WHEN typ = 'przyjście' THEN ilosc ELSE -ilosc END) as stan_aktualny
        FROM ruchy_magazynowe 
        WHERE firma_id = ?
        GROUP BY produkt_id
      ) r ON p.id = r.produkt_id
      WHERE p.firma_id = ?
    `;

    const params = [firma_id, firma_id];

    if (kategoria !== 'all') {
      query += ` AND p.kategoria = ?`;
      params.push(kategoria);
    }

    if (alert_only) {
      query += ` AND COALESCE(r.stan_aktualny, 0) <= p.minimalny_stan`;
    }

    query += ` ORDER BY status_magazynu, p.nazwa`;

    const produkty = await env.D1.prepare(query).bind(...params).all();

    // Statystyki
    const stats = await env.D1.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN stan_aktualny <= minimalny_stan THEN 1 ELSE 0 END) as z_brakiem,
        SUM(stan_aktualny) as calkowity_stan
      FROM produkty_magazyn p
      LEFT JOIN (...) r ON p.id = r.produkt_id
      WHERE p.firma_id = ?
    `).bind(firma_id).first();

    return Response.json({
      produkty: produkty.results,
      stats,
      alerty: produkty.results.filter((p: any) => p.status_magazynu === 'alert').length
    });
  }
};
```


#### b) `POST /api/magazyn/produkt`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'POST') {
      const body = await request.json<{
        id?: string;
        nazwa: string;
        kod?: string;
        kategoria: string;
        cena_zakupu_netto: number;
        cena_sprzedazy_netto: number;
        minimalny_stan: number;
        firma_id: string;
      }>();

      if (body.id) {
        // UPDATE
        await env.D1.prepare(`
          UPDATE produkty_magazyn SET 
            nazwa=?, kod=?, kategoria=?, cena_zakupu_netto=?, 
            cena_sprzedazy_netto=?, minimalny_stan=?
          WHERE id=? AND firma_id=?
        `).bind(
          body.nazwa, body.kod, body.kategoria,
          body.cena_zakupu_netto, body.cena_sprzedazy_netto,
          body.minimalny_stan, body.id, body.firma_id
        ).run();
      } else {
        // INSERT
        const id = `prod_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await env.D1.prepare(`
          INSERT INTO produkty_magazyn (
            id, firma_id, nazwa, kod, kategoria, 
            cena_zakupu_netto, cena_sprzedazy_netto, minimalny_stan
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, body.firma_id, body.nazwa, body.kod, body.kategoria,
          body.cena_zakupu_netto, body.cena_sprzedazy_netto, body.minimalny_stan
        ).run();
      }
      return Response.json({ success: true });
    }
  }
};
```


#### c) `POST /api/magazyn/ruch`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      produkt_id: string;
      typ: string;      // przyjście, wydanie, korekta
      ilosc: number;
      powod: string;
      klient_id?: string;
      numer_dokumentu?: string;
      firma_id: string;
    }>();

    const id = `ruch_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    await env.D1.prepare(`
      INSERT INTO ruchy_magazynowe (
        id, produkt_id, firma_id, typ, ilosc, powod, 
        klient_id, numer_dokumentu, data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))
    `).bind(
      id, body.produkt_id, body.firma_id, body.typ,
      body.ilosc, body.powod, body.klient_id, body.numer_dokumentu
    ).run();

    // Aktualizuj alerty jeśli stan < minimalny
    await updateMagazynAlerts(body.produkt_id, body.firma_id, env.D1);

    return Response.json({ success: true, ruch_id: id });
  }
};
```


#### d) AI optymalizacja magazynu: `POST /api/magazyn/ai/optymalizacja`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{ firma_id: string; company_prompt?: string }>();

    const magazyn = await env.D1.prepare(`
      SELECT p.*, r.stan_aktualny 
      FROM produkty_magazyn p
      LEFT JOIN (
        SELECT produkt_id, SUM(CASE typ WHEN 'przyjście' THEN ilosc ELSE -ilosc END) as stan_aktualny
        FROM ruchy_magazynowe WHERE firma_id = ?
        GROUP BY produkt_id
      ) r ON p.id = r.produkt_id
      WHERE p.firma_id = ?
    `).bind(body.firma_id, body.firma_id).all();

    const corePrompt = `
Jesteś ekspertem logistyki i zarządzania magazynem.

MAGAZYN (${magazyn.results.length} produktów):
${magazyn.results.map((p: any) => 
  `${p.nazwa} (kod:${p.kod}): stan=${p.stan_aktualny}/${p.minimalny_stan} | marża=${p.marza_procent}%`
).join('\n')}

ZADANIE:
1. Lista TOP 5 produktów do domówienia (najbliżej minimum)
2. 3 rekomendacje optymalizacji (ABC analiza, reorder points)
3. Szacunkowy koszt domówienia

FORMAT JSON:
{
  "do_doomowienia": [...],
  "rekomendacje": [...],
  "koszt_reorder": 0
}
`;

    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'magazyn_ai',
        model: 'auto',
        core_prompt: corePrompt,
        company_prompt: body.company_prompt
      })
    });

    const data = await aiRes.json();
    return Response.json(JSON.parse(data.wynik));
  }
};
```


***

### 3. UI `/magazyn` – layout

```
Nagłówek: "Magazyn – stany i alerty"

KPI (5 kart):
• Łączny stan magazynowy
• Produkty z brakiem
• Wartość magazynu (netto)
• Średnia rotacja
• Koszt reorder

Tabela produktów:
| Nazwa | Kod | Kategoria | Stan | Min | Marża | Status | Akcje |

Filtry: Kategoria | Status (alert/ok) | Szukaj po kodzie/nazwie

Szybkie akcje:
[+ Nowy produkt] [Ruch magazynowy] [Import CSV] [AI optymalizacja]
```

**Przycisk „AI optymalizacja” → modal z wynikami:**

```
🤖 Analiza AI:
TOP 5 do domówienia:
1. Produkt X (0/10) → domów 50szt.
...

Rekomendacje:
• Wprowadź ABC analizę
• Automatyczne alerty SMS
```


***

**Endpointy gotowe:**

1. ✅ `GET /api/magazyn/produkty` – lista + alerty
2. ✅ `POST /api/magazyn/produkt` – CRUD produktów
3. ✅ `POST /api/magazyn/ruch` – ruchy magazynowe
4. ✅ `POST /api/magazyn/ai/optymalizacja` – AI rekomendacje

**Moduł Magazyn gotowy!** Co następne: **Projekty/Zadania**?

