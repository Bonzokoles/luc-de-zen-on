<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Linki + tunel danych między MyBonzo ↔ ZenBrowsers.org

Robimy **jednokierunkowy tunel** (MyBonzo → ZenBrowsers) + **dwukierunkowy** (zapis/odczyt danych) przez query params i D1.

***

## 1. Jednokierunkowy link (MyBonzo → ZenBrowsers)

### Format linku z MyBonzo:

```
https://www.zenbrowsers.org/search?
  id={search_id}&           # ID wyszukiwania z D1
  firma={firma_id}&         # ID firmy MyBonzo
  query={encoded_query}&    # oryginalne zapytanie
  ctx={context_hash}&       # kontekst (np. "semantic_search_finanse")
  back={mybonzo_url}        # URL powrotu do MyBonzo
```

**Przykład w MyBonzo UI:**

```tsx
const zenLink = `https://www.zenbrowsers.org/search?` +
  `id=${wyniki.search_id}&` +
  `firma=${firmaId}&` +
  `query=${encodeURIComponent(query)}&` +
  `ctx=semantic_search&` +
  `back=${encodeURIComponent(window.location.href)}`;

<a href={zenLink} target="_blank" className="btn-primary">
  🚀 Otwórz w ZenBrowsers.org
</a>
```


### Na ZenBrowsers.org (`/search/[id].astro`):

```astro
---
const { id, firma, query, ctx, back } = Astro.url.searchParams;
// Pobierz dane z D1 używając 'id'
const searchData = await db.getSearch(id);
---

<!-- Hero z danymi z linku -->
<div class="search-header">
  <h1>🔍 {decodeURIComponent(query || 'Wyszukiwanie')}</h1>
  <p>Kontynuacja z MyBonzo ({ctx})</p>
  <a href={back} class="btn-back">⬅️ Powrót do MyBonzo</a>
</div>
```


***

## 2. Tunel dwukierunkowy (przekaz danych)

### a) Zapis danych (MyBonzo → ZenBrowsers przez D1)

**MyBonzo zapisuje dane przed linkiem:**

```typescript
// Przed redirectem zapisz kontekst do D1
await env.D1.prepare(`
  UPDATE wyszukiwania_web 
  SET kontekst_mybonzo = ?, dane_kontekstowe = ?
  WHERE id = ?
`).bind(
  'semantic_search_finanse',     # ctx
  JSON.stringify({ user_id: '123', moduł: 'finanse' }),
  searchId
).run();
```


### b) Odczyt na ZenBrowsers

```astro
---
const kontekst = await db.getSearchContext(id);
const mybonzoData = JSON.parse(kontekst.dane_kontekstowe);
---

<!-- Pokazuje kontekst MyBonzo -->
<div class="context-panel">
  <h4>📊 Kontekst MyBonzo:</h4>
  <p>Moduł: {kontekst.kontekst_mybonzo}</p>
  <pre>{JSON.stringify(mybonzoData, null, 2)}</pre>
</div>
```


### c) Callback z ZenBrowsers → MyBonzo

**Na ZenBrowsers przycisk „Zapisz i wróć”:**

```
https://mybonzo.app/?action=zenbrowsers_callback&
  search_id=abc123&
  scrape_ids=scrap1,scrap2&
  extracted_data={"cena": 1234}&
  firma_id=firma123
```

**MyBonzo odbiera callback:**

```typescript
// MyBonzo pages/api/callback.astro
if (Astro.url.searchParams.has('action') && Astro.url.searchParams.get('action') === 'zenbrowsers_callback') {
  const searchId = Astro.url.searchParams.get('search_id');
  const scrapeIds = Astro.url.searchParams.get('scrape_ids')?.split(',');
  const extractedData = Astro.url.searchParams.get('extracted_data');
  
  // Zapisz do D1
  await db.saveZenCallback({ search_id, scrape_ids, extracted_data });
  
  // Redirect do odpowiedniego modułu
  return Astro.redirect('/semantic-search?success=zenbrowsers');
}
```


***

## 3. Kompletny przykład – flow end‑to‑end

### Krok 1: MyBonzo Semantic Search

```
Użytkownik: "szukaj ceny iPhone 16 Pro"
→ Tavily → search_id = "search_123456"
→ Link: https://www.zenbrowsers.org/search/search_123456?firma=firma123&ctx=finanse
```


### Krok 2: ZenBrowsers.org `/search/search_123456`

```
Pobiera z D1: wyniki Tavily
Pokazuje:
- AI summary
- Lista wyników z iFrame preview
- Przyciski: [Scrapuj] [Eksport CSV] [Zapisz i wróć]

Użytkownik klika "Scrapuj apple.com/iphone16"
→ POST /api/scrape → scrape_id = "scrap_789"
→ Zapisz do D1
```


### Krok 3: Użytkownik „Zapisz i wróć”

```
→ https://mybonzo.app/?action=zenbrowsers_callback&
     search_id=search_123456&
     scrape_ids=scrap_789&
     extracted_data={"model": "iPhone 16 Pro", "cena": "5499 PLN"}
```


### Krok 4: MyBonzo callback

```
Odbiera dane → zapisuje do D1 (np. do tabeli `scraped_data`)
→ Pokazuje modal: "Dane ze scraping zapisane!"
→ Kontynuuj pracę z danymi
```


***

## 4. Dodatkowe funkcje tunelu

### a) Real‑time updates (WebSocket / SSE)

```
ZenBrowsers scraping → SSE do MyBonzo:
mybonzo.app/scrape-status?scrape_id=789
→ MyBonzo pokazuje progress bar
```


### b) Shared clipboard (tymczasowy)

```
ZenBrowsers: skopiuj JSON → zapisz do D1 temp_clipboard
MyBonzo: odczytaj clipboard dla firmy
```


### c) OAuth‑like token

```
MyBonzo wydaje token: firma_123_session_xyz789 (5min ważności)
ZenBrowsers w linku: ?token=xyz789
ZenBrowsers weryfikuje token → zapisuje dane tylko dla tej firmy
```


***

## 5. Przykład linku z pełnym tunelem

```
https://www.zenbrowsers.org/search/search_123456?
  firma=firma123&
  ctx=semantic_search_finanse&
  token=xyz789&
  back=https://mybonzo.app/finanse&
  data_hash=abc123
```

**Na ZenBrowsers walidacja:**

```typescript
// Sprawdź token w D1, jeśli OK → pełny dostęp do danych firmy
```

**Co masz:**

- ✅ Kompletny tunel MyBonzo → ZenBrowsers (search_id + kontekst),
- ✅ Callback ZenBrowsers → MyBonzo (scraped data),
- ✅ iFrame preview + scraping,
- ✅ Zapis wszystkiego do D1 (wyszukiwania + scrapings),
- ✅ Gotowe linki z query params.

**Chcesz kod konkretnej strony Astro na ZenBrowsers.org (`/search/[id].astro`)?**

