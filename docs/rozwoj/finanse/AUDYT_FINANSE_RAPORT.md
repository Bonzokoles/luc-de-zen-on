# AUDYT MODUŁU FINANSE — RAPORT PORÓWNAWCZY

**Data audytu:** 2025-07-17  
**Zakres:** Porównanie dokumentacji (step_01–step_15 + checklista.md) z kodem źródłowym  
**Workspace:** `U:\WWW_MyBonzo_com`  
**Typ:** RESEARCH ONLY — brak zmian w kodzie

---

## Przeczytane pliki

### Dokumentacja (16 plików)
| # | Plik | Opis |
|---|------|------|
| 1 | `docs/rozwoj/finanse/step_01.md` | Plan rozwoju AI ERP shell |
| 2 | `docs/rozwoj/finanse/Step_02_finanse i analiza.md` | Definicja produktu "AI Finanse + Analityka" |
| 3 | `docs/rozwoj/finanse/step_03.md` | Schemat tabel (EN kolumny) |
| 4 | `docs/rozwoj/finanse/step_04.md` | Minimal Core Data API (4 endpointy) |
| 5 | `docs/rozwoj/finanse/step_05.md` | Serwisy: analyzeDocumentRisk, DuckDB |
| 6 | `docs/rozwoj/finanse/step_06.md` | GET /finance/summary |
| 7 | `docs/rozwoj/finanse/step_07.md` | TypeScript typy + getFinanceSummary |
| 8 | `docs/rozwoj/finanse/step_08.md` | GET /finance/dashboard (Meble Pumo) |
| 9 | `docs/rozwoj/finanse/step_09.md` | Tabela costs + costs/dashboard |
| 10 | `docs/rozwoj/finanse/step_10.md` | GET /finance/profitability |
| 11 | `docs/rozwoj/finanse/step_11.md` | Cloudflare-native (R2+D1+Workers, endpoint PL) |
| 12 | `docs/rozwoj/finanse/step_12.md` | dokumenty_finansowe + Gemini risk |
| 13 | `docs/rozwoj/finanse/step_13.md` | Podsumowanie AI + DokumentyFinansowe UI |
| 14 | `docs/rozwoj/finanse/step_14.md` | Asystent Finanse RAG + GPT-4o |
| 15 | `docs/rozwoj/finanse/step_15.md` | Kompletny schemat D1 (PL kolumny) |
| 16 | `docs/rozwoj/finanse/checklista.md` | Master checklist (27 punktów) |

### Kod źródłowy (23 pliki)

**Komponenty React (7):**
- `src/components/finanse/FinanseTabs.tsx` (72 linie)
- `src/components/finanse/FinansePro.tsx` (589 linii)
- `src/components/finanse/FinanseCosts.tsx` (~200 linii)
- `src/components/finanse/FinanseTransakcje.tsx` (~200 linii)
- `src/components/finanse/DokumentyFinansowe.tsx` (~310 linii)
- `src/components/finanse/FinanseImport.tsx` (~350 linii)
- `src/components/finanse/FinanseAsystent.tsx` (~200 linii)

**Strona Astro (1):**
- `src/pages/finanse.astro` (12 linii)

**Typy TypeScript (1):**
- `src/types/finanse.ts` (~230 linii)

**Schemat SQL (1):**
- `src/db/d1-finanse-schema.sql` (~250 linii)

**API endpoints (11):**
- `src/pages/api/finanse/dashboard.ts` (~120 linii)
- `src/pages/api/finanse/costs.ts` (~200 linii)
- `src/pages/api/finanse/transactions.ts` (~120 linii)
- `src/pages/api/finanse/dokumenty-finansowe.ts` (~150 linii)
- `src/pages/api/finanse/import-transakcji.ts` (~110 linii)
- `src/pages/api/finanse/import-kosztow.ts` (~135 linii)
- `src/pages/api/finanse/import-dokumentu.ts` (~175 linii)
- `src/pages/api/finanse/transakcje/dodaj.ts` (~120 linii)
- `src/pages/api/finanse/podsumowanie.ts` (~90 linii)
- `src/pages/api/finanse/asystent.ts` (~115 linii)
- `src/pages/api/finanse/rentownosc.ts` (~100 linii)
- `src/pages/api/asystent-finanse.ts` (277 linii) — **duplikat na innej ścieżce!**

**CSS (1):**
- `src/styles/global.css` (450 linii — przeczytane 100 pierwszych)

---

## A) TABELA ZGODNOŚCI STEP-BY-STEP

| Step | Temat | Status | Uwagi |
|------|-------|--------|-------|
| **01** | Plan rozwoju AI ERP | ✅ PASS | Dokument strategiczny, brak wymagań implementacyjnych |
| **02** | Definicja "AI Finanse + Analityka" | ✅ PASS | 3 tabele zdefiniowane → zaimplementowane (nazwy PL per step_11+) |
| **03** | Schemat tabel (EN kolumny) | ⚠️ EWOLUOWAŁ | Kolumny zmienione z EN na PL w step_11/15. Stary schemat EN → tabela `costs` nadal istnieje jako relikt |
| **04** | Minimal Core API (4 endpointy EN) | ⚠️ CZĘŚCIOWY | 3/4 konceptów zaimplementowane (PL nazwy). Brak `GET /analytics/test` |
| **05** | Service layer (analyzeDocumentRisk, DuckDB) | ⚠️ ARCHITEKTURA INNA | Risk analysis inline w `import-dokumentu.ts` zamiast osobnego serwisu. DuckDB zastąpiony przez D1. Brak warstwy repository/service |
| **06** | GET /finance/summary | ⚠️ CZĘŚCIOWY | Koncept zrealizowany przez `/api/finanse/dashboard`. Typ `FinanceSummaryResponse` istnieje w types ale **żaden endpoint go NIE używa** |
| **07** | TypeScript typy + getFinanceSummary | ⚠️ CZĘŚCIOWY | Typy zdefiniowane w `finanse.ts`. `FinanceSummaryResponse` i `FinanceSummaryKPI` — **martwy kod** (nieużywane). Brak funkcji `getFinanceSummary` jako osobnej utility |
| **08** | Dashboard endpoint | ✅ PASS | `/api/finanse/dashboard` zwraca KPI, timeseries, categories, recent_transactions. **Brakuje pola `ai_insight_prompt`** ze step_08 |
| **09** | Costs table + dashboard | ⚠️ DUPLIKACJA | **DWA tabele kosztów:** `costs` (EN, step_09) + `koszty` (PL, step_15). API czyta wyłącznie z `koszty`. Tabela `costs` to martwy schemat. Profitability stub zwraca `0` |
| **10** | Profitability/Rentowność | ✅ PASS | `/api/finanse/rentownosc` implementuje: overall, by_category, top_margin, low_margin_alerts. **Brak trending data** (step_10: monthly trending) |
| **11** | Cloudflare-native (R2+D1+Workers) | ✅ PASS | R2_FINANSE binding, D1 binding, polskie endpointy, CSV/PDF import — wszystko zaimplementowane |
| **12** | Import dokumentu + Gemini | ✅ PASS | `import-dokumentu.ts`: multipart form → R2 upload → D1 insert → `analyzeWithGemini()` → UPDATE z wynikami. UI modal w `DokumentyFinansowe.tsx` |
| **13** | Podsumowanie AI + UI dokumentów | ✅ PASS | `podsumowanie.ts` pobiera dashboard+rentownosc+ryzyka → Gemini prompt PL → raport. `DokumentyFinansowe.tsx` ma tabelę z filtrami ryzyka |
| **14** | Asystent Finanse RAG | ⚠️ DUPLIKACJA | **DWA endpointy:** `/api/finanse/asystent.ts` (prostszy, GPT-4o) + `/api/asystent-finanse.ts` (pełny RAG + session parsing). Komponent `FinanseAsystent.tsx` używa **prostszej** wersji |
| **15** | Kompletny schemat D1 | ✅ PASS | `d1-finanse-schema.sql` zawiera 3 tabele PL + views + indexes + seed data. **Plus relikt `costs` EN** |

### Podsumowanie sekcji A:
- **✅ PASS:** 8/15 (step 01, 02, 08 (z zastrzeżeniem), 11, 12, 13, 15 + 10)
- **⚠️ CZĘŚCIOWY/EWOLUOWAŁ:** 6/15 (step 03, 04, 05, 06, 07, 09)
- **⚠️ DUPLIKACJA:** 1/15 (step 14)

---

## B) CHECKLISTA COMPLIANCE (27 PUNKTÓW)

| # | Wymaganie z checklisty | Status | Szczegóły |
|---|------------------------|--------|-----------|
| **1** | Schemat D1: transakcje_finansowe, dokumenty_finansowe, koszty | ✅ PASS | Wszystkie 3 tabele + kpi_snapshots w `d1-finanse-schema.sql` |
| **2** | Widoki: v_kpi_miesieczne, v_ryzykowne_dokumenty | ✅ PASS | Oba zdefiniowane w schemacie |
| **3** | Indeksy: tenant_id+data, poziom_ryzyka, status, kategoria | ✅ PASS | Komprehensywne indeksy w schemacie |
| **4** | Rekordy testowe (seed data) | ✅ PASS | INSERT seed data na końcu schematu |
| **5** | R2 bucket `R2_FINANSE` + binding | ✅ PASS | Binding w `CloudflareEnv`, użyty w `import-dokumentu.ts` |
| **6** | Konwencja ścieżek PDF: `dokumenty/{ts}-{nazwa}` | ✅ PASS | Zaimplementowane w `import-dokumentu.ts` linia ~117 |
| **7** | `/api/finanse/dashboard` (KPI, cashflow, categories, recent) | ✅ PASS | Pełna implementacja z demo fallback |
| **8** | `/api/rentownosc` (overall, by_category, low_margin_alerts) | ✅ PASS | Implementacja z SQL join revenue+costs. Brak `units_sold` i `trending` |
| **9** | `/api/dokumenty-finansowe` (lista + filtry) | ✅ PASS | GET z filtrami ryzyko/status + POST do tworzenia |
| **10** | `/api/import-dokumentu` (FormData + PDF + R2 + D1 + Gemini) | ✅ PASS | Pełny pipeline: multipart → R2 → D1 → analyzeWithGemini → UPDATE |
| **11** | `/api/import-dokumentow/csv` (opcjonalny) | ❌ BRAK | Nie zaimplementowany (checklista oznacza jako opcjonalny) |
| **12** | `/api/import-kosztow/csv` | ✅ PASS | `import-kosztow.ts`: CSV parsing, walidacja, INSERT do `koszty` |
| **13** | `/api/koszty/dashboard` | ✅ PASS | Jako `/api/finanse/costs` — KPI, chart, breakdown, recent costs |
| **14** | `POST /api/transakcje/dodaj` | ✅ PASS | `transakcje/dodaj.ts`: JSON body, walidacja, INSERT do transakcje_finansowe |
| **15** | `/api/podsumowanie-finansowe` | ✅ PASS | `podsumowanie.ts`: dashboard+rentownosc+ryzyka → Gemini prompt → raport Markdown |
| **16** | `/api/asystent-finanse` (GPT-4o + RAG) | ✅ PASS | Dwie wersje! Prostsza (`/api/finanse/asystent.ts`) + pełna RAG (`/api/asystent-finanse.ts`) |
| **17** | UI layout: nagłówek, filtry, KPI, wykresy, transakcje, alerty, asystent | ⚠️ CZĘŚCIOWY | **Brak sekcji "Alerty i ryzyka"** w FinansePro.tsx. Brak podpięcia `low_margin_alerts` z rentownosc |
| **18** | Podłączenie danych dashboard → UI (KPI, cashflow, categories, transactions) | ✅ PASS | FinansePro.tsx fetches `/api/finanse/dashboard` i mapuje na KPI cards, wykresy, tabelę |
| **19** | Podłączenie rentownosc → alerty ryzyka w UI | ❌ FAIL | **Brak:** FinansePro.tsx **nie** pobiera danych z `/api/rentownosc`. Sekcja alertów marży niskiej nie istnieje w UI |
| **20** | Import: 3 kafelki (CSV przychody, CSV dokumenty, PDF+AI) | ✅ PASS | FinanseImport.tsx: transakcje CSV, koszty CSV, PDF z Gemini AI |
| **21** | Import: modal/drag&drop + upload + wynik | ✅ PASS | Każdy kafelek ma modal z paste/upload + feedback po imporcie |
| **22** | Import: historia importów | ⚠️ CZĘŚCIOWY | Historia **tylko w pamięci** (state React), nie persystowana do D1/localStorage |
| **23** | Dokumenty: nagłówek + KPI bar (total, high risk, overdue, risk amount) | ✅ PASS | DokumentyFinansowe.tsx ma KPI bar z 4 kartami |
| **24** | Dokumenty: tabela z API | ✅ PASS | Podpięta do `/api/finanse/dokumenty-finansowe` |
| **25** | Dokumenty: filtr po ryzyku i statusie | ⚠️ CZĘŚCIOWY | Filtr po ryzyku ✅, **brak filtra po statusie** w UI (API go wspiera) |
| **26** | Przycisk "+ Dodaj dokument" + modal + upload | ✅ PASS | `DodajDokumentModal` w DokumentyFinansowe.tsx |
| **27** | Asystent: wykrywanie modułu "Finanse" → kierowanie na `/api/asystent-finanse` | ⚠️ CZĘŚCIOWY | Asystent jest **osobną zakładką** (nie wykrywa kontekstu). Używa prostszej wersji `/api/finanse/asystent` zamiast pełnej RAG `/api/asystent-finanse` |
| **28** | Asystent: szybkie pytania | ✅ PASS | 5 predefiniowanych przycisków (podsumowanie, ryzyka, kategoria, optymalizacja, cashflow) |

### Podsumowanie sekcji B:
- **✅ PASS:** 19/28
- **⚠️ CZĘŚCIOWY:** 5/28 (punkty 17, 22, 25, 27, 8)
- **❌ FAIL/BRAK:** 2/28 (punkty 11, 19)
- **Procent zgodności: ~68% pełny PASS, ~86% PASS+CZĘŚCIOWY**

---

## C) PROBLEMY JAKOŚCI KODU

### C1. KRYTYCZNE — Martwy kod i duplikacje

| # | Problem | Plik(i) | Szczegóły |
|---|---------|---------|-----------|
| **C1.1** | **Duplikacja endpoint asystenta** | `api/finanse/asystent.ts` + `api/asystent-finanse.ts` | Dwa endpointy robią to samo z różnym poziomem zaawansowania. Pełna wersja RAG (`asystent-finanse.ts`, 277 linii) z session parsing, structured response, koszty context — **nie jest używana przez UI**. Prostsza wersja (115 linii) — **jest używana**. Jeden musi zostać usunięty. |
| **C1.2** | **Duplikacja tabel kosztów** | `d1-finanse-schema.sql` | `costs` (EN kolumny, step_09) + `koszty` (PL kolumny, step_15). API czyta **wyłącznie** z `koszty`. Tabela `costs` to martwy schemat zajmujący miejsce w D1. |
| **C1.3** | **Martwy typ `FinanceSummaryResponse`** | `types/finanse.ts` | Typy `FinanceSummaryResponse`, `FinanceSummaryKPI`, `TimeseriesPoint`, `CategoryBreakdown` z step_06/07 **nie są importowane/używane** przez żaden endpoint ani komponent. ~40 linii martwego kodu. |
| **C1.4** | **Duplikacja funkcjonalności transakcji** | `FinansePro.tsx` + `FinanseTransakcje.tsx` | FinansePro ma wewnętrzny widok "transactions" z tabelą transakcji. FinanseTransakcje to **oddzielna zakładka** z tego samego funkcjonalnego zakresu. Użytkownik widzi dwie listy transakcji. |
| **C1.5** | **`CATEGORY_COLORS` zdefiniowany ale nieużywany** | `FinansePro.tsx` | Obiekt `CATEGORY_COLORS` (mapping kategorii → kolory hex) zdefiniowany na górze, nigdy nie referencjonowany. Wewnętrzne wykresy hardcodują kolory inline. |

### C2. ŚREDNIE — Jakość implementacji

| # | Problem | Plik | Szczegóły |
|---|---------|------|-----------|
| **C2.1** | **Unsafe `as never` cast** | `dashboard.ts` ~linia z recent_transactions | `recent_transactions: rows.results as never` omija type safety. Powinien być proper type assertion albo generic na `db.prepare().all<T>()`. |
| **C2.2** | **Profitability stub zwraca 0** | `costs.ts` | Pola `gross_profit` i `gross_margin_pct` **zawsze** = 0 z komentarzem "wypełniane przez /api/finanse/rentownosc". Frontend wyświetla te zera. Albo usunąć albo zaimplementować. |
| **C2.3** | **Brak warstwy service/repository** | Wszystkie endpointy API | Step_05 proponował `financeRepository`, `financeService`, `riskClient.ts`. Kod ma **flat structure** — logika SQL bezpośrednio w handlerach API. Utrudnia testowanie i reuse. |
| **C2.4** | **Demo fallback wcięty inline** | Wszystkie endpointy | Każdy endpoint ma rozbudowany demo fallback (`if (!env?.D1) return demoData`). Brak wydzielonego `demoService.ts` — ten sam pattern kopiowany ~10 razy. |
| **C2.5** | **`(locals as { runtime?: ... }).runtime?.env`** | Wszystkie endpointy | Ten sam unsafe cast `(locals as { runtime?: { env: CloudflareEnv } }).runtime?.env` powtórzony w **każdym** endpoincie. Powinien być helper `getCloudflareEnv(locals)` albo middleware. |
| **C2.6** | **Hardcoded `tenantId = 'meblepumo'`** | Wszystkie endpointy | `env?.TENANT_ID ?? 'meblepumo'` — OK na MVP, ale multi-tenant jest deklarowany w typach (tenant_id w każdej tabeli). Brak mechanizmu auth/session per tenant. |
| **C2.7** | **Reports view is placeholder** | `FinansePro.tsx` | Widok "Raporty" wyświetla "Sekcja raportów w przygotowaniu" — placeholder w produkcyjnym kodzie. |
| **C2.8** | **Import history nie persystowana** | `FinanseImport.tsx` | `importHistory` to React state (in-memory). Po odświeżeniu strony historia importów znika. Checklista punkt 21 wymaga logu. |
| **C2.9** | **Internal navigation w FinansePro.tsx** | `FinansePro.tsx` | Komponent ma własną wewnętrzną nawigację (dashboard, transactions, cashflow, reports) **wewnątrz** zakładki "Dashboard" w FinanseTabs. Podwójna nawigacja mylna dla UX. |

### C3. NISKIE — Drobne usprawnienia

| # | Problem | Plik | Szczegóły |
|---|---------|------|-----------|
| **C3.1** | **Brak error boundary** | FinanseTabs.tsx | Brak React Error Boundary wokół tab content. Crash jednego komponentu psuje cały moduł. |
| **C3.2** | **fetch bez AbortController** | Wszystkie komponenty | Brak cleanup/abort w useEffect fetch calls. Możliwe memory leaks przy szybkim przełączaniu zakładek. |
| **C3.3** | **`Date.now()` w ID generation** | Wszystkie endpointy import | Pattern `${Date.now()}_${Math.random().toString(36)}` nie gwarantuje unikalności pod dużym obciążeniem. Powinien być `crypto.randomUUID()` (dostępny w Workers). |
| **C3.4** | **Brak rate limiting** | asystent.ts, podsumowanie.ts | Endpointy AI (GPT-4o, Gemini) bez rate limiting. Każde zapytanie = koszt API. |
| **C3.5** | **CSV separator hardcoded `;`** | import-transakcji.ts, import-kosztow.ts | Brak auto-detection separatora. Pliki z `,` lub `\t` nie zostaną sparsowane. |

---

## D) PROBLEMY ARCHITEKTURY

### D1. Duplikacja endpointów asystenta — DECYZJA WYMAGANA

```
src/pages/api/finanse/asystent.ts     ← 115 linii, UŻYWANY przez FinanseAsystent.tsx
src/pages/api/asystent-finanse.ts     ← 277 linii, NIE UŻYWANY, pełny RAG + session
```

**Problem:** Dwa endpointy z podobną funkcjonalnością na różnych ścieżkach. Pełniejsza wersja (RAG z session context, structured response parsing, costs context) leży nieużywana. UI wywołuje prostszą.

**Różnice:**

| Cecha | `/api/finanse/asystent` | `/api/asystent-finanse` |
|-------|------------------------|------------------------|
| Rozmiar | 115 linii | 277 linii |
| Session history | ❌ brak | ✅ `kontekst_sesji` (6 ostatnich wymian) |
| RAG sources | dashboard + rentownosc + docs | dashboard + rentownosc + docs + **costs** |
| Response parsing | Flat odpowiedz | Structured `odpowiedz` + `nastepne_kroki` + `potrzebne_akcje` |
| Error handling | Basic | Demo fallback + detailed |
| Costs context | ❌ | ✅ `/api/finanse/costs` included |

**Rekomendacja:** Usunąć `/api/finanse/asystent.ts`, przenieść UI na `/api/asystent-finanse` (zmiana jednej linii w FinanseAsystent.tsx + dostosowanie response shape).

### D2. Brak warstwy abstrakcji (Service/Repository)

Step_05 proponował:
```
src/services/financeService.ts
src/services/financeRepository.ts  
src/services/riskClient.ts
```

Rzeczywistość: **Zero osobnych serwisów.** Cała logika (SQL, AI calls, validation, mapping) jest w handlerach APIRoute. To powoduje:
- Brak możliwości unit testowania logiki biznesowej
- Duplikacja SQL patterns (identyczny `(locals as ...).runtime?.env` w 11 plikach)
- Trudność reuse (np. dashboard KPI queries powielane w asystent + podsumowanie)

### D3. Ewolucja schematu EN → PL bez cleanup

Timeline:
1. Step_03: English columns (`date`, `amount`, `currency`, `direction`)
2. Step_09: Tabela `costs` z EN columns
3. Step_11: Decyzja o PL endpoint names
4. Step_15: Nowy schemat z PL columns (`data`, `kwota`, `waluta`, `kierunek`)

**Rezultat:** d1-finanse-schema.sql zawiera **OBIE** tabele kosztów:
- `koszty` (PL — aktywna, używana przez API)
- `costs` (EN — martwa, nie używana nigdzie)

Typy w `finanse.ts` definiują `FinanceSummaryResponse` z EN property names (z step_06/07) **i** `FinanceDashboardResponse` z PL property names (step_08+). Nie ma migration path z jednych na drugie.

### D4. Routing asystenta — brak context detection

Checklista punkt 26 mówi:
> "W AsystentAI.tsx wykryj, czy użytkownik jest w module «Finanse» — jeśli tak, kieruj pytanie na `/api/asystent-finanse`"

**Rzeczywistość:** `FinanseAsystent.tsx` jest **hardcodowany** jako osobna zakładka w `FinanseTabs`. Nie ma globalnego komponentu `AsystentAI.tsx` z context detection. Asystent finansowy jest **izolowany** w module finanse i nie integruje się z potencjalnym globalnym asystentem.

### D5. API endpoint naming nie jest spójne

| Endpoint | Naming convention | Uwaga |
|----------|-------------------|-------|
| `/api/finanse/dashboard` | EN slug | OK |
| `/api/finanse/costs` | EN slug | ≠ tabela `koszty` (PL) |
| `/api/finanse/transactions` | EN slug | ≠ tabela `transakcje_finansowe` (PL) |
| `/api/finanse/dokumenty-finansowe` | PL slug | ✅ spójne z tabelą |
| `/api/finanse/import-transakcji` | PL slug | Mix PL |
| `/api/finanse/import-kosztow` | PL slug | Mix PL |
| `/api/finanse/import-dokumentu` | PL slug | Mix PL |
| `/api/finanse/rentownosc` | PL slug | ✅ |
| `/api/finanse/podsumowanie` | PL slug | ✅ |
| `/api/finanse/asystent` | PL slug | ✅ |
| `/api/asystent-finanse` | PL slug, **inny prefix!** | ❌ Poza namingiem |

Brak jednolitej konwencji: `costs` vs `koszty`, `transactions` vs `transakcje`. Step_11 deklarował polskie endpointy, ale 2 z 11 pozostały anglojęzyczne.

---

## E) ASTRO + REACT BEST PRACTICES

### E1. Problemy Astro

| # | Problem | Lokalizacja | Rekomendacja |
|---|---------|-------------|--------------|
| **E1.1** | Cały moduł jako `client:load` | `finanse.astro` | Jeden masywny React island (~2100 linii łącznie) ładowany eagerly. Rozważyć `client:visible` lub podział na mniejsze islands (np. wykresy osobno). |
| **E1.2** | Brak SSR pre-fetching | `finanse.astro` | Strona nie wykorzystuje Astro SSR do wstępnego pobrania danych. Cały fetch w useEffect = puste karty KPI do załadowania API. Astro pozwala na server-side fetch w frontmatter. |
| **E1.3** | Brak SEO/meta tags | `finanse.astro` | Brak `<title>`, `<meta description>` specyficznych dla modułu finanse. |
| **E1.4** | Brak route-specific loading | - | Brak Astro View Transitions API dla przechodzenia do/z finanse. |

### E2. Problemy React

| # | Problem | Lokalizacja | Rekomendacja |
|---|---------|-------------|--------------|
| **E2.1** | Brak memoizacji ciężkich obliczeń | `FinansePro.tsx` | Mapping transakcji, kalkulacje KPI wykonywane na każdym renderze. Brak `useMemo` / `useCallback`. |
| **E2.2** | Zagnieżdżona wewnętrzna nawigacja | `FinansePro.tsx` | Komponent ma 4 wewnętrzne "widoki" (dashboard/transactions/cashflow/reports) zarządzane stanem. Powoduje re-render ~600 linii na przełączenie. Powinny być osobne komponenty w FinanseTabs. |
| **E2.3** | Brak custom hooks do data fetching | Wszystkie komponenty | Każdy komponent ma własny `useEffect` + `useState` + fetch + error/loading. Brak wspólnego hooka `useFinanseData(endpoint, params)` lub biblioteki (React Query/SWR). |
| **E2.4** | Brak `Suspense` / skeleton loading | Wszystkie komponenty | Loading state to tekst "Ładowanie..." zamiast skeleton UI. Framer-motion jest zaimportowany ale nie używany do loading states. |
| **E2.5** | Demo data hardcoded inline | `DokumentyFinansowe.tsx`, `FinansePro.tsx` | Duże obiekty demo data wewnątrz komponentów. Powinny być w osobnych plikach `__fixtures__/` lub `demo/`. |
| **E2.6** | Brak TypeScript strict mode enforcement | Kilka plików | `as never`, `as unknown as T`, `.json() as Promise<T>` — pattern omijający type safety zamiast proper generics. |
| **E2.7** | Brak testów | Cały moduł | Zero plików testowych dla komponentów React i endpointów API. Brak vitest/jest config. |

### E3. Cloudflare Workers / D1 Best Practices

| # | Problem | Lokalizacja | Rekomendacja |
|---|---------|-------------|--------------|
| **E3.1** | Brak batched D1 writes | `import-transakcji.ts`, `import-kosztow.ts` | Import CSV robi `await stmt.bind(...).run()` **per wiersz** w pętli. D1 wspiera `db.batch([stmt1, stmt2, ...])` co jest **znacząco szybsze** (1 RTT zamiast N). |
| **E3.2** | Self-fetch anti-pattern | `podsumowanie.ts`, `asystent.ts`, `asystent-finanse.ts` | Endpoint robi `fetch(baseUrl + '/api/finanse/dashboard')` do **samego siebie**. To dodatkowe HTTP roundtripy w Workers. Powinny dzielić logikę query przez shared function. |
| **E3.3** | Brak R2 signed URLs | `import-dokumentu.ts` | Po upload PDF, zwraca klucz R2 (`plik_url = pdfKey`). Brak mechanizmu generowania signed URLs do pobrania pliku. Frontend nie może pobrać PDF. |
| **E3.4** | Brak transakcji D1 | Wszystkie endpointy | `import-dokumentu.ts` robi INSERT → Gemini call → UPDATE. Jeśli UPDATE padnie, rekord ma niekompletne dane. Brak `D1.batch()` transaction boundary. |
| **E3.5** | Gemini model hardcoded | `import-dokumentu.ts`, `podsumowanie.ts` | `gemini-2.5-flash` hardcoded w URL. Brak env var na model name. Zmiana modelu wymaga edycji kodu. |

---

## PODSUMOWANIE WYKONAWCZE

### Co działa dobrze ✅
1. **Kompletność funkcjonalna** — moduł pokrywa ~86% checklisty (PASS + CZĘŚCIOWY)
2. **Cloudflare-native architektura** — D1 + R2 + Workers poprawnie zintegrowane
3. **AI Integration** — Gemini (risk analysis) + GPT-4o (assistant) działające
4. **Typowanie TypeScript** — `finanse.ts` ma komprehensywne typy (z wyjątkami martwego kodu)
5. **Demo fallback pattern** — każdy endpoint gracefully degraduje bez D1
6. **UI completeness** — 7 komponentów pokrywa dashboard, transakcje, koszty, dokumenty, import, asystent

### Co wymaga natychmiastowej uwagi 🔴
1. **Duplikacja asystenta** — 2 endpointy, UI używa gorszego → wybrać jeden, usunąć drugi
2. **Martwa tabela `costs`** — usunąć z schematu D1
3. **Brak alertów marży w UI** — checklista pkt 19, `/api/rentownosc` nie podpięty do FinansePro
4. **Self-fetch anti-pattern** — 3 endpointy fetchują same siebie → shared query functions
5. **D1 batch writes** — import CSV per-row jest N× wolniejszy niż batch

### Co jest technicznym długiem ⚠️
1. Brak warstwy service/repository (step_05 niezrealizowany architektonicznie)
2. Brak testów (unit, integration, e2e)
3. Duplikacja locals cast + demo fallback w 11 plikach
4. Martwy kod typów (`FinanceSummaryResponse` + `CATEGORY_COLORS`)
5. Niespójna konwencja nazw endpointów (PL vs EN mix)
6. Cały moduł jako jeden `client:load` React island

---

**Koniec raportu audytowego.**
