<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Moduł SEO Analityka + GEO + AI dla crawlerów

**Ścieżka:** `/seo-analityka`

**Bonus:** GEO lokalizacja + optymalizacja pod roboty wyszukiwarek.

***

### 1. Struktura bazy D1 (SEO)

```sql
-- Strony do analizy
CREATE TABLE strony_seo (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  tytul TEXT,
  meta_description TEXT,
  h1 TEXT,
  slowa_kluczowe JSON,      -- AI extracted keywords
  dlugosc_tekstu INTEGER,
  readability_score INTEGER, -- 0-100
  seo_score INTEGER,        -- 0-100
  geo_country TEXT,
  geo_region TEXT,
  last_crawl DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wyniki crawla
CREATE TABLE crawle_seo (
  id TEXT PRIMARY KEY,
  strona_id TEXT NOT NULL,
  status_code INTEGER,
  crawl_time DATETIME,
  content_hash TEXT,        -- do detekcji zmian
  robots_txt_compliant BOOLEAN,
  crawl_data JSON,          -- pełny wynik
  FOREIGN KEY(strona_id) REFERENCES strony_seo(id)
);

-- Rekomendacje AI
CREATE TABLE rekomendacje_seo (
  id TEXT PRIMARY KEY,
  strona_id TEXT NOT NULL,
  priorytet TEXT CHECK (priorytet IN ('pilne', 'wazne', 'opcjonalne')),
  opis TEXT,
  kategoria TEXT,           -- title, meta, content, speed, mobile
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(strona_id) REFERENCES strony_seo(id)
);
```


***

### 2. Endpointy SEO + Crawler

#### a) `POST /api/seo/crawl`

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      url: string;
      deep_crawl?: boolean;  // full site vs single page
    }>();

    // 1. Cloudflare Browser Rendering + crawling
    const crawlRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/browser/render`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.API_TOKEN}` },
        body: JSON.stringify({
          url: body.url,
          actions: [
            { type: 'wait-for', selector: 'body' },
            { type: 'screenshot' },
            { type: 'html' }
          ]
        })
      }
    );

    const crawlData = await crawlRes.json();

    // 2. Analiza GEO (Cloudflare GEO headers lub IP API)
    const geoData = await getGeoData(body.url);

    // 3. Zapisz stronę (lub UPDATE jeśli istnieje)
    const strona_id = `strona_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await env.D1.prepare(`
      INSERT OR REPLACE INTO strony_seo (
        id, firma_id, url, tytul, meta_description, h1,
        geo_country, geo_region, last_crawl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      strona_id, body.firma_id, body.url,
      extractTitle(crawlData.html),
      extractMetaDesc(crawlData.html),
      extractH1(crawlData.html),
      geoData.country,
      geoData.region,
      new Date().toISOString()
    ).run();

    // 4. Zapisz crawl
    const crawl_id = `crawl_${Date.now()}`;
    await env.D1.prepare(`
      INSERT INTO crawle_seo (id, strona_id, status_code, crawl_time, crawl_data)
      VALUES (?, ?, 200, ?, ?)
    `).bind(crawl_id, strona_id, new Date().toISOString(), JSON.stringify(crawlData)).run();

    return Response.json({
      strona_id,
      seo_data: analyzeSEO(crawlData.html),
      geo_data: geoData,
      screenshot: crawlData.screenshot
    });
  }
};
```


#### b) `POST /api/seo/ai/analiza`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      firma_id: string;
      strona_id: string;
      company_prompt?: string;
    }>();

    const strona = await env.D1.prepare('SELECT * FROM strony_seo WHERE id = ?')
      .bind(body.strona_id).first();
    const crawl = await env.D1.prepare(`
      SELECT crawl_data FROM crawle_seo 
      WHERE strona_id = ? ORDER BY crawl_time DESC LIMIT 1
    `).bind(body.strona_id).first();

    const corePrompt = `
Jesteś ekspertem SEO. Przeanalizuj stronę pod kątem pozycjonowania.

STRONA: ${strona.url}
TYTUŁ: ${strona.tytul}
META: ${strona.meta_description}
H1: ${strona.h1}
GEO: ${strona.geo_country} / ${strona.geo_region}
DŁUGOŚĆ: ${strona.dlugosc_tekstu} znaków

ZADANIE:
1. SEO Score 0-100
2. Lista 5–8 konkretnych rekomendacji (priorytet: pilne/ważne/opcjonalne)
3. Kluczowe słowa do optymalizacji
4. Sugestie title/meta/H1

FORMAT JSON:
{
  "seo_score": 72,
  "rekomendacje": [
    {"priorytet": "pilne", "kategoria": "title", "opis": "Title za długi (68/60 znaków)"},
    ...
  ],
  "slowa_kluczowe": ["słowo1", "słowo2"],
  "title_sugestia": "...",
  "meta_sugestia": "..."
}
`;

    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'seo_ai_analiza',
        model: 'auto',
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: { strona_id: body.strona_id }
      })
    });

    const data = await aiRes.json();
    const analiza = JSON.parse(data.wynik);

    // Zapisz rekomendacje
    for (const rec of analiza.rekomendacje) {
      await env.D1.prepare(`
        INSERT INTO rekomendacje_seo (strona_id, priorytet, kategoria, opis)
        VALUES (?, ?, ?, ?)
      `).bind(body.strona_id, rec.priorytet, rec.kategoria, rec.opis).run();
    }

    // Aktualizuj stronę
    await env.D1.prepare(`
      UPDATE strony_seo SET seo_score = ? WHERE id = ?
    `).bind(analiza.seo_score, body.strona_id).run();

    return Response.json(analiza);
  }
};
```


#### c) Endpoint masowego crawla: `POST /api/seo/batch-crawl`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      firma_id: string;
      urls: string[];
    }>();

    const results: any[] = [];
    for (const url of body.urls.slice(0, 10)) {  // max 10 na raz
      try {
        const crawlRes = await crawlSinglePage(url, body.firma_id, env);
        results.push(crawlRes);
        await new Promise(r => setTimeout(r, 2000)); // rate limit
      } catch (e) {
        results.push({ url, error: e.message });
      }
    }

    return Response.json({ results });
  }
};
```


***

### 3. Endpoint GEO analiza

```typescript
// src/api/seo/geo.ts
export default {
  async fetch(request: Request, env: Env) {
    const { url } = await request.json();

    // Cloudflare GEO Headers (jeśli masz Workers na stronie)
    // lub zewnętrzne API
    const geoRes = await fetch(`http://ip-api.com/json/${extractDomain(url)}`);
    const geoData = await geoRes.json();

    return Response.json({
      domain: extractDomain(url),
      country: geoData.country,
      region: geoData.regionName,
      city: geoData.city,
      ranking_sugestie: geoRankingSuggestions(geoData.country)
    });
  }
};
```


***

### 4. Agent SEO: `the_ANT_06`

**Endpoint:** `POST /api/ant/06`

**Core prompt:**

```text
Jesteś **the_ANT_06** – ekspertem SEO i crawlerów MyBonzo.

POMAGASZ Z:
- Crawlingiem stron (single/batch)
- Analizą SEO (title, meta, H1, keywords)
- GEO targetowaniem
- Optymalizacją pod roboty Google/Bing
- Integracją z Google Search Console

KROKI ZAWSZE Z:
- konkretnymi endpointami
- formatem request body
- przykładami curl

FORMAT:
**Co zrobić:**

**Endpoint:**
```

curl -X POST ...

```

**Oczekiwany wynik:**
```

...

```
```


***

### 5. UI `/seo-analityka`

```
Nagłówek: "SEO Analityka + Crawler"

KPI:
• Stron zaindeksowanych
• Średni SEO score
• Błędy crawla
• GEO zasięg

Szybkie akcje:
[🔗 Crawl pojedynczej strony] [📂 Batch crawl] [🌍 GEO analiza] [🤖 AI analiza]

Tabela stron:
| URL | SEO Score | Tytuł | Status | Ostatni crawl | Akcje |

Modal po crawlu:
- Screenshot strony
- SEO score + rekomendacje
- GEO dane
- Kluczowe słowa
```

**Przycisk „Batch crawl”:**

```tsx
// Lista URL‑ów z sitemap.xml lub input
const batchCrawl = async (urls: string[]) => {
  const res = await fetch('/api/seo/batch-crawl', {
    method: 'POST',
    body: JSON.stringify({ firma_id: 'firma_123', urls })
  });
  
  const data = await res.json();
  // Pokaż progress + wyniki
};
```


***

**Endpointy SEO gotowe:**

1. ✅ `POST /api/seo/crawl` – pojedynczy crawl + analiza
2. ✅ `POST /api/seo/ai/analiza` – AI rekomendacje SEO
3. ✅ `POST /api/seo/batch-crawl` – masowy crawl
4. ✅ `GET /api/seo/geo` – analiza GEO
5. ✅ `POST /api/ant/06` – agent SEO/crawlerów

**Moduł SEO Analityka kompletny z GEO i crawlerami!** 🌐

**Następny:** **Analityka Raporty** (dashboardy BI)?

