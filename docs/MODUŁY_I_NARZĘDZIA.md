# Dokumentacja Modułów i Narzędzi — MyBonzo ERP

> Stan: 3 marca 2026 | Framework: Astro + React + Cloudflare Pages

---

## Architektura Ogólna

```
src/
├── pages/          ← Strony Astro (.astro) — routing
├── modules/        ← Logika biznesowa + eksport komponentów
├── components/     ← Komponenty React UI (.tsx)
└── pages/api/      ← API Endpoints (Cloudflare Workers)

lib/
├── tools.json          ← Rejestr 133 narzędzi AI
├── tools-extended.json ← Rozszerzony katalog (140 narzędzi, v2.0)
├── compatibilityMatrix.ts ← Macierz kompatybilności narzędzi
├── workflowScoring.ts  ← CHUCK scoring engine
└── examples.ts         ← Przykładowe workflow
```

---

## MODUŁY (`src/modules/`)

### 1. `asystent-ai`
- **Strona:** `/asystent-ai`
- **Komponent:** `AsystentAI.tsx`
- **API:** `POST /api/chat-openai` (GPT-4o)
- **Opis:** Główny chatbot biznesowy. Prowadzi konwersację w języku polskim, odpowiada na pytania firmowe, analizuje sytuacje biznesowe.

---

### 2. `finanse`
- **Strona:** `/finanse`
- **Komponenty:**
  - `FinansePro.tsx` — zarządzanie finansami, cash flow, przepływy gotówkowe, rotacje należności
  - `DokumentyFinansowe.tsx` — analiza ryzyka finansowego dokumentów (AI: Gemini 2.5 Flash)
- **API:** `POST /api/analyze-risk`
- **Opis:** Moduł finansowy ERP. Obsługuje przegląd przepływów pieniężnych i automatyczną analizę ryzyka w dokumentach finansowych.

---

### 3. `crm-klienci`
- **Strona:** `/crm-klienci`
- **Komponent:** `CRMKlienci.tsx`
- **Opis:** System zarządzania relacjami z klientami. Przeglądanie kontaktów, historia interakcji, statusy klientów.

---

### 4. `magazyn`
- **Strona:** `/magazyn`
- **Komponent:** `Magazyn.tsx`
- **Opis:** Moduł magazynowy ERP. Zarządzanie stanami magazynowymi, produktami, ruchami towarowymi.

---

### 5. `projekty`
- **Strona:** `/projekty`
- **Komponent:** `Projekty.tsx`
- **Opis:** Zarządzanie projektami i zadaniami. Śledzenie postępów, statusy projektów, przypisanie zespołu.

---

### 6. `seo-analityka`
- **Strona:** `/seo-analityka`
- **Komponent:** `SEOAnalityka.tsx`
- **API:** `POST /api/seo-ai` (OpenAI GPT-4 / Gemini / DeepSeek — fallback chain)
- **Opis:** Analizator SEO wspomagany AI. Crawluje URL, analizuje treść strony, generuje rekomendacje SEO, meta tagi, propozycje słów kluczowych.

---

### 7. `analityka-raporty`
- **Strona:** `/analityka-raporty`
- **Komponent:** `AnalitikaRaporty.tsx`
- **Opis:** Raporty biznesowe i dashboardy analityczne. Wykresy, tabele, wskaźniki KPI.

---

### 8. `konwerter`
- **Strona:** `/konwerter`
- **Komponent:** `Konwerter.tsx`
- **Opis:** Konwerter danych biznesowych (formaty, waluty, jednostki miar, kalkulacje).

---

### 9. `ai-biznes-erp`
- **Strona:** `/ai-biznes-erp`
- **Komponent:** `NewsBiznesowe.tsx`
- **Opis:** Główna strona ERP z newsfeedem biznesowym AI. Agreguje moduły: `FinansePro`, `DokumentyFinansowe` i newsy branżowe.

---

### 10. `wizualizacje`
- **Strona:** `/wizualizacje`
- **Komponenty:**
  - `Wizualizacje.tsx` — główne wizualizacje danych (recharts, d3, visx)
  - `DashboardVisual.tsx` — dashboard z wykresami KPI
  - `MusicPlayerVisualizer.tsx` — wizualizer audio (moduł rozrywkowy)
- **Opis:** Moduł wizualizacji danych. Dane pobierane dynamicznie z modułów FinansePro, Projekty, CRM.

---

### 11. `unified-ops`
- **Strona:** `/unified-ops`
- **Komponenty:** `WorkflowCanvas`, `Toolbar`, `NodePalette`
- **Opis:** Zunifikowany pulpit operacyjny. Wizualny builder procesów oparty na canvasie z paletą węzłów i narzędzi.

---

### 12. `chuck-jimbo`
- **Strona:** `/chuck-jimbo`
- **API:**
  - `POST /api/chuck/analyze` — analiza zapytania
  - `POST /api/chuck/exec` — wykonanie narzędzia
  - `GET  /api/chuck/tools` — lista dostępnych narzędzi
- **Opis:** System agentowy CHUCK. Orkiestruje narzędzia AI, ocenia kompatybilność, wykonuje workflow wieloetapowe.

---

## NARZĘDZIA (`src/modules/narzedzia/`)

Dostępne pod `/narzedzia/*` — osobne strony z wyspecjalizowanymi funkcjami AI.

### 1. `generator-tresci` → `/narzedzia/generator-tresci`
- **Komponent:** `src/components/narzedzia/GeneratorTresci.tsx`
- **API:** `POST /api/generate-content` (Gemini 2.5 Flash)
- **Opis:** Generator treści marketingowych. Tworzy posty na Facebook/Instagram/LinkedIn, opisy produktów, newslettery, artykuły blogowe, opisy firm. W 100% po polsku.

---

### 2. `generator-faktur` → `/narzedzia/generator-faktur`
- **Komponent:** `src/components/narzedzia/GeneratorFaktur.tsx`
- **Opis:** Generator faktur i dokumentów sprzedażowych. Automatyczne wypełnianie danych, eksport PDF.

---

### 3. `kreator-dokumentow` → `/narzedzia/kreator-dokumentow`
- **Komponent:** `src/components/narzedzia/KreatorDokumentow.tsx`
- **API:** `POST /api/generate-document-gemini` (Gemini 2.5 Flash)
- **Opis:** Kreator dokumentów biznesowych — umowy, oferty, pisma urzędowe, regulaminy. AI generuje gotowy dokument na podstawie opisu.

---

### 4. `asystent-email` → `/narzedzia/asystent-email`
- **Komponent:** `src/components/narzedzia/AsystentEmail.tsx`
- **API:** `POST /api/generate-email` (GPT-4 Turbo)
- **Opis:** Asystent pisania emaili biznesowych. Typy: email biznesowy, oferta handlowa, podziękowanie, reklamacja, zaproszenie. Dostosowuje ton i styl do odbiorcy.

---

### 5. `kalkulator-biznesowy` → `/narzedzia/kalkulator-biznesowy`
- **Komponent:** `src/components/narzedzia/KalkulatorBiznesowy.tsx`
- **Opis:** Kalkulator finansowo-biznesowy. Marże, VAT, amortyzacja, ROI, kalkulacje cen.

---

### 6. `organizer-zadan` → `/narzedzia/organizer-zadan`
- **Komponent:** `src/components/narzedzia/OrganizerZadan.tsx`
- **Opis:** Organizer zadań z priorytetyzacją. Lista zadań, deadline'y, statusy, filtrowanie.

---

### 7. `semantic-search-demo` → `/narzedzia/semantic-search-demo`
- **Komponent:** `src/components/narzedzia/SemanticSearchDemo.tsx`
- **API:** `POST /api/mini-helper-semantic-search`
- **Opis:** Demo wyszukiwania semantycznego. Wyszukuje narzędzia i zasoby AI po opisie (embeddingi), zwraca dopasowania kontekstowe.

---

### 8. `workflow-builder` → `/narzedzia/workflow-builder`
- **Komponent:** `src/components/narzedzia/WorkflowBuilder.tsx`
- **Silnik:** `lib/compatibilityMatrix.ts` + `lib/workflowScoring.ts`
- **Opis:** Wizualny builder workflow oparty na silniku CHUCK. Pozwala łączyć narzędzia AI w łańcuchy, oblicza score kompatybilności połączeń, generuje i eksportuje workflow.

---

## API ENDPOINTS (`src/pages/api/`)

| Endpoint | Metoda | Model AI | Używany przez |
|---|---|---|---|
| `/api/chat-openai` | POST | GPT-4o | `AsystentAI` |
| `/api/generate-content` | POST | Gemini 2.5 Flash | `GeneratorTresci` |
| `/api/generate-email` | POST | GPT-4 Turbo | `AsystentEmail` |
| `/api/generate-document-gemini` | POST | Gemini 2.5 Flash | `KreatorDokumentow` |
| `/api/analyze-risk` | POST | Gemini 2.5 Flash | `DokumentyFinansowe` |
| `/api/seo-ai` | POST | GPT-4 / Gemini / DeepSeek | `SEOAnalityka` |
| `/api/mini-helper-semantic-search` | POST | Embeddingi | `SemanticSearchDemo` |
| `/api/debug-env` | GET | — | diagnostyka środowiska |
| `/api/chuck/analyze` | POST | — | CHUCK System |
| `/api/chuck/exec` | POST | — | CHUCK System |
| `/api/chuck/tools` | GET | — | CHUCK System |

---

## Rejestr Narzędzi AI (`lib/`)

### `tools.json`
- **133 narzędzia** AI zdefiniowane jako obiekty `{ name, description, category, inputs, outputs }`
- Format płaskiej listy, używany przez komponenty bezpośrednio

### `tools-extended.json` (v2.0 — 2026-02-13)
- **140 narzędzi** pogrupowanych w kategorie
- Struktura: `{ version, totalTools, lastUpdated, metadata, categories: { ... } }`
- Rozszerzone metadane (tagi, kompatybilność, wymagania środowiskowe)

### `compatibilityMatrix.ts`
- Macierz kompatybilności między narzędziami
- Funkcja `calculateConnectionScore(toolA, toolB)` — zwraca score 0–100
- Funkcja `getCompatibleTools(tool)` — lista kompatybilnych narzędzi

### `workflowScoring.ts`
- Silnik oceny workflow CHUCK
- Typy: `WorkflowEdge`, `WorkflowNode`, `WorkflowScore`
- Oblicza jakość i efektywność całego workflow

### `examples.ts`
- Gotowe przykładowe workflow
- Używane jako seed dla `WorkflowBuilder`

---

## Zmienne Środowiskowe (wymagane)

| Zmienna | Użycie |
|---|---|
| `GOOGLE_API_KEY` | Gemini 2.5 Flash (generate-content, generate-document, analyze-risk) |
| `OPENAI_API_KEY` | GPT-4o (chat-openai), GPT-4 Turbo (generate-email), SEO fallback |
| `DEEPSEEK_API_KEY` | SEO analityka — fallback |

Konfiguracja przez Cloudflare Pages → Settings → Environment Variables (lub `wrangler.toml` lokalnie).
