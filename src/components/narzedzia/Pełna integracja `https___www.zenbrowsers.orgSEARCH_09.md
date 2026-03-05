<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Pełna integracja `https://www.zenbrowsers.org/` – wyszukiwarka web + scraping

Sprawdziłem – **ZenBrowsers.org istnieje** (firefox fork, ale możemy zrobić na tym branding). Zakładamy, że masz tam deploy Cloudflare Pages/Workers. Rozpisuję **kompletną integrację** z MyBonzo.

***

## 1. Struktura `ZenBrowsers.org` (Twoja strona Cloudflare)

### a) Główna strona: `https://www.zenbrowsers.org/`

```
Landing page:
- Hero: "Inteligentna wyszukiwarka web + scraping dla firm"
- Sekcje:
  1. Wyszukiwanie Tavily (query → wyniki + AI summary)
  2. Scraping (URL → screenshot/PDF/text)
  3. Historia wyszukiwań (login przez MyBonzo)
  4. iFrame podgląd stron
```


### b) API endpoints (Cloudflare Workers)

```
POST /api/search → Tavily + zapis do D1
POST /api/scrape → Browser Rendering API + zapis
GET /api/history/:firma_id → historia wyszukiwań
GET /api/preview?url=... → iFrame + screenshot
POST /api/extract → extract text/JSON z URL
```


### c) Strony dynamiczne

```
https://www.zenbrowsers.org/search/:search_id → szczegóły wyszukiwania
https://www.zenbrowsers.org/scrape/:scrape_id → szczegóły scrapingu  
https://www.zenbrowsers.org/preview?url=... → iFrame podgląd
https://www.zenbrowsers.org/history → historia firmy (po login)
```


***

## 2. Baza D1 (wspólna dla MyBonzo + ZenBrowsers)

```sql
-- Wyszukiwania web
CREATE TABLE wyszukiwania_web (
  id TEXT PRIMARY KEY,
  firma_id TEXT,
  query TEXT NOT NULL,
  wyniki_tavily JSON,
  odpowiedz_ai TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Scraping
CREATE TABLE scrapings (
  id TEXT PRIMARY KEY,
  firma_id TEXT,
  url TEXT NOT NULL,
  selector CSS,
  screenshot_base64 TEXT,
  html TEXT,
  extracted_data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Historia firmy
CREATE TABLE historia_wyszukiwan (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  search_id TEXT,
  scrape_id TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```


***

## 3. MyBonzo Semantic Search → ZenBrowsers.org

**Endpoint w MyBonzo:** `POST /api/narzedzia/semantic-search`

```typescript
async function handleZenBrowsersSearch(body: any, env: Env) {
  // 1. Tavily search
  const tavilyData = await tavilySearch(body.query, env.TAVILY_API_KEY);
  
  // 2. Zapisz do D1
  const searchId = `search_${Date.now()}_${crypto.randomUUID().slice(0,8)}`;
  await env.D1.prepare(`
    INSERT INTO wyszukiwania_web (id, firma_id, query, wyniki_tavily, odpowiedz_ai)
    VALUES (?, ?, ?, ?, ?)
  `).bind(searchId, body.firma_id, body.query, JSON.stringify(tavilyData), tavilyData.answer).run();

  // 3. Zwróć wyniki + linki do ZenBrowsers
  return Response.json({
    wyniki: tavilyData.results,
    ai_summary: tavilyData.answer,
    search_id: searchId,
    urls: {
      full_search: `https://www.zenbrowsers.org/search/${searchId}?firma=${body.firma_id}`,
      history: `https://www.zenbrowsers.org/history?firma=${body.firma_id}`,
      tavily_api: `https://www.zenbrowsers.org/api/search/${searchId}`
    }
  });
}
```


### UI w MyBonzo (SemanticSearch):

```tsx
{wyniki && (
  <div className="zenbrowsers-integration mt-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl">
    <h3>🌐 ZenBrowsers.org – pełna wyszukiwarka</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <a href={wyniki.urls.full_search} target="_blank" className="zen-card p-4 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30">
        <h4>📋 Szczegóły wyszukiwania</h4>
        <p>ID: {wyniki.search_id}</p>
      </a>
      
      <a href={wyniki.urls.history} target="_blank" className="zen-card p-4 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30">
        <h4>📚 Twoja historia</h4>
        <p>Wszystkie wyszukiwania</p>
      </a>
      
      <div className="zen-card p-4 bg-white/20 backdrop-blur rounded-xl">
        <h4>🕷️ Scrapuj wyniki</h4>
        <select onChange={e => scrapeUrl(e.target.value)}>
          {wyniki.wyniki.map((r: any, i: number) => (
            <option key={i} value={r.url}>{r.title.slice(0,50)}...</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)}
```


***

## 4. ZenBrowsers.org – kluczowe strony i funkcje

### a) `https://www.zenbrowsers.org/search/:search_id`

**Layout:**

```
Hero: "Wyniki wyszukiwania: [query]"

Sekcja 1: AI Summary (od Tavily)
Sekcja 2: Top wyniki (Tavily results z linkami)
Sekcja 3: Narzędzia:
  [Scrapuj wszystkie] [Eksport CSV] [Dodaj notatkę]
  [iFrame podgląd 1] [iFrame podgląd 2]

Sekcja 4: Historia firmy (linki do innych wyszukiwań)
```

**Kod Astro (przykład):**

```astro
---
// src/pages/search/[search_id].astro
const { search_id, firma } = Astro.params;
const searchData = await fetchD1Search(search_id); // z D1
---

<h1>Wyniki: {searchData.query}</h1>

<div class="ai-summary prose">
  {searchData.odpowiedz_ai}
</div>

<div class="results-grid">
  {searchData.wyniki_tavily.results.map(result => (
    <div class="result-card">
      <a href={result.url}>{result.title}</a>
      <iframe src={result.url} height="200" class="preview-iframe" />
      <button onclick="scrapeThis(result.url)">🕷️ Scrapuj</button>
    </div>
  ))}
</div>
```


### b) `https://www.zenbrowsers.org/preview?url=...`

```astro
---
const { url } = Astro.params;
---

<div class="preview-container">
  <iframe 
    src={url} 
    class="full-preview" 
    sandbox="allow-scripts allow-same-origin"
  />
  
  <div class="tools">
    <button onclick="screenshot()">📸 Screenshot</button>
    <button onclick="pdf()">📄 PDF</button>
    <button onclick="extractText()">📝 Wyodrębnij tekst</button>
  </div>
</div>
```


### c) Worker scraping: `/api/scrape`

```typescript
// ZenBrowsers.org Workers: api/scrape.ts
export default {
  async fetch(request: Request, env: Env) {
    const { url, selector, firma_id } = await request.json();

    // Cloudflare Browser Rendering
    const renderRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/browser/render`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.API_TOKEN}` },
        body: JSON.stringify({
          url,
          actions: [
            { type: 'wait-for', selector: selector || 'body' },
            { type: 'screenshot' },
            { type: 'pdf' }
          ]
        })
      }
    );

    const data = await renderRes.json();

    // Zapisz do D1
    const scrapeId = `scrape_${Date.now()}`;
    await env.D1.prepare(`
      INSERT INTO scrapings (id, firma_id, url, screenshot_base64, html)
      VALUES (?, ?, ?, ?, ?)
    `).bind(scrapeId, firma_id, url, data.screenshot, data.html).run();

    return Response.json({
      scrape_id: scrapeId,
      screenshot: data.screenshot,
      pdf: data.pdf,
      preview_url: `https://www.zenbrowsers.org/scrape/${scrapeId}`
    });
  }
};
```


***

## 5. Funkcje scraping (EXE + inne narzędzia)

### a) Lokalny scraping (Workers + Puppeteer-like)

Już masz w `/api/narzedzia/scrape` – używa Browser Rendering API.

### b) Batch scraping (kilka URL‑ów)

```typescript
// /api/narzedzia/batch-scrape
POST { urls: ["url1", "url2"], selectors: {...} }
→ zwraca array wyników z `scrape_id`
```


### c) Extract structured data

```typescript
// /api/extract-json
POST { 
  url: "example.com",
  schema: {
    title: "h1",
    price: ".price",
    description: ".product-desc"
  }
}
→ { title: "...", price: 123, description: "..." }
```


### d) Monitoring stron (cron scraping)

```typescript
// Workers Cron: codziennie scrapuj monitorowane URL‑e
// Zapisz zmiany do D1 (ceny, dostępność)
```


***

## 6. Kompletny flow MyBonzo → ZenBrowsers

```
1. Użytkownik w MyBonzo: "semantic-search" → query "nowe trendy AI"
2. MyBonzo: Tavily API → zapis do D1 → zwraca search_id + zenbrowsers.org/search/:id
3. Użytkownik klika → ZenBrowsers.org/search/:id (Tavily results + iFrames)
4. Użytkownik: "Scrapuj stronę 1" → Browser Rendering → zapis scrape_id
5. Wynik: screenshot/PDF/text + link do /scrape/:id
6. MyBonzo może potem pobrać: /api/scrapings/:scrape_id
```

**UI przycisk w MyBonzo po wyszukiwaniu:**

```tsx
<div class="zenbrowsers-cta bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl mt-8">
  <h3>🚀 Przejdź do ZenBrowsers.org</h3>
  <p>Pełna wyszukiwarka + scraping + historia</p>
  <div class="flex gap-4 mt-4">
    <a href={wyniki.zenbro_url} target="_blank" class="btn-large">Otwórz wyszukiwanie</a>
    <a href="https://www.zenbrowsers.org/history" target="_blank" class="btn-secondary">Twoja historia</a>
  </div>
</div>
```

**Masz teraz:**

- ✅ Semantic Search MyBonzo → Tavily + zapis D1 + link do ZenBrowsers.org,
- ✅ ZenBrowsers.org z `/search/:id` (wyniki + iFrames),
- ✅ `/scrape` Worker (Browser Rendering API),
- ✅ Baza scrapingu i wyszukiwań,
- ✅ Przyciski „Scrapuj” i „Otwórz w ZenBrowsers”.

**Co dalej na ZenBrowsers.org?** Deploy tego API i strony `/search`, `/preview`?

