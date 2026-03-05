<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# finanse i analiza

Dla „Finanse i analiza” możesz mieć w 3 miesiące sensowny, sprzedażowy pakiet, oparty na modułach `finanse`, `analityka-raporty`, `wizualizacje` i Asystencie AI.[^1]

## 1. Co ma być produktem „AI Finanse + Analityka”

Jedna spójna funkcja dla MŚP: **„powiedz mi, co się dzieje z kasą i na co uważać”**, a nie tylko tabelki.[^1]
Cele biznesowe:

- widok cashflow (dzienny/tygodniowy/miesięczny),
- szybka analiza ryzyka dokumentów/kontrahentów,
- AI‑raporty i insighty zamiast ręcznej interpretacji,
- proste, ładne dashboardy KPI.


## 2. Minimalna warstwa danych pod finanse + analitykę

Na start wystarczą 3 główne tabele logiczne (niezależnie od tego, czy w DB, czy lakehouse):

1. `finance_transactions`

- Pola (logicznie): data, kwota, waluta, typ (przychód/koszt), kategoria, kontrahent, projekt, status (planowane/zapłacone).
- Źródło: ręczne importy CSV / integracje z fakturowaniem / e‑commerce.

2. `finance_documents`

- Pola: numer dokumentu, typ (faktura, umowa, oferta), kontrahent, data, kwota, status, link do pliku.
- Do tego: pola na wyniki analizy ryzyka (score, tagi ryzyk, komentarz AI).[^1]

3. `kpi_snapshots`

- Pola: data, kategoria (finanse, sprzedaż, cashflow), nazwa KPI, wartość, dodatkowy JSON (np. rozbicie po kanale).
- Zasilane batchowo z transakcji; konsumowane przez `analityka-raporty` i `wizualizacje`.[^1]

Wszystko oznaczone tenant_id, żeby od razu być gotowym na wielu klientów.

## 3. Jak z tego zrobić moduły w UI

1. `/finanse` (FinansePro + DokumentyFinansowe)

- Widok 1: **Kasa i wyniki**
    - wykres przepływów, saldo, przychód/koszty, top kategorie;
    - panel „AI podsumowanie miesiąca/tygodnia” (Asystent AI dostaje agregaty + kontekst i generuje tekst).[^1]
- Widok 2: **Dokumenty i ryzyko**
    - lista dokumentów z `finance_documents`,
    - przycisk „analizuj ryzyko” → `/api/analyze-risk` (Gemini) + zapis score do tabeli.[^1]

2. `/analityka-raporty`

- Dashboard oparty na `kpi_snapshots`:
    - wybór zakresu czasu, filtr po projekcie/kliencie,
    - wykresy KPI (recharts/d3/visx – już masz w `wizualizacje`).[^1]
- Sekcja „Zadaj pytanie o liczby”:
    - input → Asystent AI → wewnętrznie zapytanie po KPI/transactions → tekstowy raport.

3. `/wizualizacje`

- Użyj istniejących komponentów `Wizualizacje.tsx` / `DashboardVisual.tsx`, ale podłącz je do nowych endpointów finansowych zamiast mocków.[^1]


## 4. API, które musisz dorobić (wysoki poziom)

- `GET /api/finance/transactions` – listowanie / agregacje (z filtrami).
- `GET /api/finance/kpi` – odczyt `kpi_snapshots` (np. `?name=cashflow&type=monthly`).
- `POST /api/finance/import` – wrzucenie CSV/JSON z transakcjami (MVP).
- `POST /api/finance/documents/analyze` – wrapper na istniejące `/api/analyze-risk` + zapis wyniku w `finance_documents`.[^1]
- `POST /api/ai/finance-summary` – przyjmuje zakres dat i opcjonalne filtry, zwraca raport AI (internie LLM + dane).


## 5. Roadmap tylko dla „Finanse + Analiza” (skrót)

1. Faza 1 – MVP danych i widoków (2–4 tygodnie)

- Zaimplementuj 3 tabele logiczne, proste API `GET /transactions`, `GET /kpi`.
- Podłącz `/finanse` i `/analityka-raporty` do prawdziwych danych (nawet z ręcznego importu).[^1]

2. Faza 2 – AI na liczbach (4–8 tygodni)

- Integracja `DokumentyFinansowe` z trwałym storage wyniku ryzyka.[^1]
- Endpoint `finance-summary` + komponent w UI: tekstowe raporty AI (dzienny/miesięczny).
- Podstawowe alerty (np. wykrycie spadku przychodu, „dziury” w cashflow).

3. Faza 3 – prognozy i scenariusze (8–16 tygodni)

- Modele prognoz cashflow/sprzedaży (Python service), zapis do `kpi_snapshots` i osobnych tabel forecast.
- W UI: „co jeśli” – symulacje scenariuszy (np. spadek/zwiększenie sprzedaży, opóźnienia płatności).

Czy chcesz, żebym teraz rozpisał konkretny schemat JSON/kolumn dla `finance_transactions` i `finance_documents`, tak żebyś mógł od razu tworzyć typy/ORM i endpointy?

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

