<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# tak, mam juz wstępne dashboardy do poszczególnych nrzędzi ,dopisuj co musi być,albo zeby podmieniac jesli nie ma

Dopiszę Ci, co Core Data API musi zwracać, żeby zasilić istniejące dashboardy w `FinansePro`, `DokumentyFinansowe`, `AnalitykaRaporty` i `Wizualizacje` – tak, żebyś mógł tylko podmieniać źródło danych zamiast zmieniać UI.[^1]

## 1. `GET /finance/summary` – backend pod główny dashboard finansowy

Ten endpoint karmi karty KPI + główny wykres (cashflow) w `FinansePro.tsx` i może być też źródłem danych dla `AnalitykaRaporty.tsx` / `DashboardVisual.tsx`.[^1]

### Request (MVP)

```http
GET /finance/summary?from=2026-03-01&to=2026-03-31
```

Parametry (MVP):

- `from`, `to` – zakres dat (string ISO, opcjonalne, jak brak → ostatnie 30 dni),
- w przyszłości: `project_id`, `counterparty_id`, `direction`, itp.


### Response – dopasowany do dashboardu

```json
{
  "range": {
    "from": "2026-03-01",
    "to": "2026-03-31"
  },
  "currency": "PLN",
  "kpi": {
    "total_income": 123456.78,
    "total_expense": 65432.10,
    "net_cashflow": 57924.68,
    "opening_balance": 200000.00,
    "closing_balance": 257924.68,
    "avg_daily_income": 3982.47,
    "avg_daily_expense": 2101.04
  },
  "timeseries": {
    "granularity": "DAY",
    "points": [
      {
        "date": "2026-03-01",
        "income": 10000.0,
        "expense": 4000.0,
        "net": 6000.0,
        "balance": 206000.0
      },
      {
        "date": "2026-03-02",
        "income": 8000.0,
        "expense": 3000.0,
        "net": 5000.0,
        "balance": 211000.0
      }
    ]
  },
  "by_category": [
    {
      "category": "SPRZEDAZ",
      "direction": "INCOME",
      "amount": 100000.0
    },
    {
      "category": "MARKETING",
      "direction": "EXPENSE",
      "amount": 15000.0
    },
    {
      "category": "LOGISTYKA",
      "direction": "EXPENSE",
      "amount": 8000.0
    }
  ],
  "ai_context": {
    "summary_prompt_payload": {
      "range": {
        "from": "2026-03-01",
        "to": "2026-03-31"
      },
      "kpi": {
        "total_income": 123456.78,
        "total_expense": 65432.10,
        "net_cashflow": 57924.68,
        "opening_balance": 200000.00,
        "closing_balance": 257924.68
      },
      "top_categories": [
        {
          "category": "SPRZEDAZ",
          "income": 100000.0
        },
        {
          "category": "MARKETING",
          "expense": 15000.0
        }
      ]
    }
  }
}
```

- `kpi` – idzie na karty KPI (przychody, koszty, cashflow, saldo początkowe/końcowe).
- `timeseries.points` – idzie na liniowy/kolumnowy wykres „Przepływy w czasie”.
- `by_category` – wykres kołowy/słupkowy „Struktura przychodów/kosztów”.
- `ai_context.summary_prompt_payload` – to gotowy obiekt, który możesz bezpośrednio wrzucić do LLM, żeby Asystent AI / sekcja „AI analiza finansowa” miała wszystko w jednym.[^1]

Na froncie możesz mieć np.:

```ts
const res = await fetch("/finance/summary?from=...&to=...");
const data = await res.json();

// wykres: data.timeseries.points
// KPI karty: data.kpi
// prompt do LLM: data.ai_context.summary_prompt_payload
```


## 2. Co dopisać / podmienić w istniejących modułach

Bazując na tym, co masz w dokumentacji:[^1]

### `FinansePro.tsx`

- Jeśli już masz tam wykres cashflow + karty:
    - podmień źródło danych na `GET /finance/summary`,
    - użyj:
        - `data.kpi.total_income`, `data.kpi.total_expense`, `data.kpi.net_cashflow`, `data.kpi.closing_balance` do kart,
        - `data.timeseries.points` do wykresu,
        - `data.by_category` do wykresu struktury (jeśli go masz / chcesz dodać).
- Jeśli nie masz jeszcze kart – minimalny zestaw do dodania:
    - karta „Przychody” – `total_income`,
    - karta „Koszty” – `total_expense`,
    - karta „Cashflow netto” – `net_cashflow`,
    - karta „Saldo końcowe” – `closing_balance`.


### `DokumentyFinansowe.tsx`

- Zostaje na `GET /finance/documents` i `POST /finance/documents/analyze` – nic nie zmieniamy, tylko zadbaj, żeby kolumny w tabeli pokrywały się z JSON (status, kwoty, `risk_score`, `risk_level`, `risk_summary`).[^1]


### `AnalitykaRaporty.tsx`

- Możesz podejść na 2 sposoby:

1. **Re-use `finance/summary`** – np. dla zakładki „Finanse” w `AnalitykaRaporty` po prostu używaj tych samych danych co w `FinansePro`, ale z inną wizualizacją.
2. **Dodatkowy endpoint** (później): `/analytics/kpi` oparty na `kpi_snapshots` – ale na start, żeby nie przepalać czasu, pierwszy wariant jest ok.


### `Wizualizacje.tsx` / `DashboardVisual.tsx`

- Te komponenty już są przygotowane do „dowolnych danych” z modułów Finanse/Projekty/CRM.[^1]
- Dla finansów:
    - wykresy czasu → `timeseries.points`,
    - wykresy kategorii → `by_category`.


## 3. Jak policzyć `finance/summary` w serwisie

W warstwie serwisu (np. `financeService.getSummary`) robisz coś w tym stylu (pseudo‑kod):

1. Z `finance_transactions`:
    - wybierz transakcje w zakresie dat i dla danego tenant_id,
    - policz:
        - sumę przychodów (direction = INCOME),
        - sumę kosztów (direction = EXPENSE),
        - cashflow netto,
        - grupowanie po dniu (timeseries),
        - grupowanie po kategorii (`by_category`),
    - odtwórz saldo dzienne, zakładając `opening_balance` (na razie może być wartość konfiguracyjna / 0, później policzona historycznie).
2. Zbuduj obiekt dokładnie w formacie jak w JSON powyżej.

Przykładowy szkic (wysokopoziomowo):

```ts
async function getFinanceSummary(tenantId: string, range: { from?: string; to?: string }) {
  const rows = await financeRepository.listTransactionsForRange(tenantId, range);

  // compute totals, timeseries, by_category...
  // zwróć obiekt zgodny z /finance/summary response
}
```

W repo możesz dodać dedykowaną metodę:

```ts
listTransactionsForRange(tenantId, from, to)
```

która zwraca `date, amount, direction, category` itd., a agregację robisz w JS/TS na początek (później można przenieść do SQL w DuckDB).

***

Jeśli chcesz, następnym krokiem mogę rozpisać konkretny typ TS dla `FinanceSummaryResponse` + szkic funkcji `getFinanceSummary` (agregacja w JS), tak żebyś mógł od razu podpiąć to pod `FinansePro.tsx`.

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

