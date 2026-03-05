<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# tak,rozpisz a następnie zacznijmy budować logike

Zacznijmy od minimalnego Core Data API pod finanse, a potem zaproponuję prostą logikę (krok po kroku) pod implementację.

## 1. Minimalne endpointy Core Data API (Finanse + prosty analytics)

### 1.1. `GET /finance/transactions`

Cel: lista transakcji do tabeli / widoku FinansePro.

**Request (MVP, bez filtrów):**

- metoda: `GET`
- URL: `/finance/transactions`

**Response 200 (MVP):**

```json
{
  "items": [
    {
      "id": "trx_01JAZ32ABC123",
      "tenant_id": "tenant_demo",
      "date": "2026-03-01T10:23:00Z",
      "amount": 2499.99,
      "currency": "PLN",
      "direction": "INCOME",
      "category": "SPRZEDAZ",
      "subcategory": "E-COMMERCE",
      "counterparty_name": "Jan Kowalski",
      "status": "PAID",
      "payment_method": "ONLINE_GATEWAY",
      "description": "Zamówienie #12345 z e-sklepu"
    }
  ],
  "total": 1
}
```

Możesz dodać później query paramy typu `?from=...&to=...&direction=INCOME`.

***

### 1.2. `GET /finance/documents`

Cel: lista dokumentów finansowych, która zasili widok DokumentyFinansowe + analiza ryzyka.

**Request:**

- metoda: `GET`
- URL: `/finance/documents`

**Response 200 (MVP):**

```json
{
  "items": [
    {
      "id": "doc_fv_2026_03_0012",
      "tenant_id": "tenant_demo",
      "type": "INVOICE",
      "number": "FV/03/2026/0012",
      "issue_date": "2026-03-01",
      "due_date": "2026-03-15",
      "currency": "PLN",
      "amount_net": 2032.51,
      "amount_gross": 2499.99,
      "counterparty_name": "Jan Kowalski",
      "status": "SENT",
      "risk_score": 72,
      "risk_level": "MEDIUM",
      "risk_summary": "Nowy klient, wysoka kwota i termin 14 dni.",
      "ai_analyzed_at": "2026-03-01T11:05:00Z"
    }
  ],
  "total": 1
}
```


***

### 1.3. `POST /finance/documents/analyze`

Cel: wywołać analizę ryzyka (Gemini), zapisać wynik i zwrócić zaktualizowany dokument.

**Request:**

- metoda: `POST`
- URL: `/finance/documents/analyze`

Body:

```json
{
  "document_id": "doc_fv_2026_03_0012"
}
```

**Response 200:**

```json
{
  "id": "doc_fv_2026_03_0012",
  "risk_score": 72,
  "risk_level": "MEDIUM",
  "risk_tags": ["NOWY_KONTRAHENT", "DŁUGI_TERMIN_PLATNOSCI"],
  "risk_summary": "Nowy klient, wysoka kwota i termin 14 dni. Zalecane monitorowanie płatności.",
  "ai_model": "gemini-2.5-flash",
  "ai_analyzed_at": "2026-03-01T11:05:00Z"
}
```

W implementacji ten endpoint:

1. pobiera dokument z tabeli `finance_documents`,
2. woła wewnętrznie Twój istniejący `/api/analyze-risk` (Cloudflare Pages) z danymi dokumentu,
3. zapisuje wynik w storage (R2/Iceberg/DB),
4. zwraca aktualny stan dokumentu.

[^1]

***

### 1.4. `GET /analytics/test`

Cel: bardzo prosty sanity-check, że DuckDB + R2 + tabele działają.

**Request:**

- metoda: `GET`
- URL: `/analytics/test`

**Response 200 (MVP):**

```json
{
  "total_income": 123456.78,
  "total_expense": 65432.10,
  "currency": "PLN",
  "from": "2026-03-01",
  "to": "2026-03-31"
}
```

Pod spodem możesz na sztywno robić agregat:

- `SUM(amount WHERE direction='INCOME')`
- `SUM(amount WHERE direction='EXPENSE')`
na tabeli `finance_transactions`.

***

## 2. Jak zacząć budować logikę – krok 1

Proponuję taki mini-plan implementacyjny (bardziej o kodzie niż o architekturze):

1. **Warstwa dostępu do danych (adapter DuckDB/lakehouse)**
    - Stwórz moduł (np. `core/db/financeRepository.ts` lub analog w Pythonie), który ma funkcje:
        - `listTransactions(params)`,
        - `listDocuments(params)`,
        - `getDocumentById(id)`,
        - `updateDocumentRisk(id, riskPayload)`.
    - W środku na razie możesz mieć:
        - albo połączenie bezpośrednio do DuckDB (SQL),
        - albo nawet „mock repo” na lokalnej bazie / plikach JSON, jeśli chcesz iterować UI przed spięciem z R2.
2. **Warstwa serwisu (logika domenowa Finanse)**
    - Moduł `core/services/financeService.ts`, z metodami:
        - `getTransactions(query)` → woła repo + ewentualnie prostą agregację / mapping na DTO do API,
        - `getDocuments(query)`,
        - `analyzeDocumentRisk(documentId)`:

3. pobiera dokument z repo,
4. woła Twój istniejący endpoint `/api/analyze-risk`,
5. mapuje wynik na `risk_score`, `risk_tags`, `risk_summary`,
6. zapisuje z powrotem przez repo,
7. zwraca odświeżony dokument.
1. **Warstwa HTTP (sam Core Data API)**
    - Endpointy:
        - `GET /finance/transactions` → wywołuje `financeService.getTransactions`,
        - `GET /finance/documents` → `financeService.getDocuments`,
        - `POST /finance/documents/analyze` → `financeService.analyzeDocumentRisk`,
        - `GET /analytics/test` → robi prosty `SELECT` przez repo i liczy sumy.
2. **Front (minimalne spięcie)**
    - W `FinansePro.tsx`:
        - fetch do `/finance/transactions` i render tabeli + proste KPI nad tabelą.
    - W `DokumentyFinansowe.tsx`:
        - fetch do `/finance/documents`,
        - przycisk „Analizuj ryzyko” → `POST /finance/documents/analyze` → odśwież listę.

[^1]

Jeśli chcesz, następny krok to mogę rozpisać konkretny szkic kodu serwisu `analyzeDocumentRisk` (pseudo TS/JS) pokazujący:

- jak pobrać dokument,
- jak zawołać Twój `/api/analyze-risk`,
- jak zaktualizować dane i zwrócić wynik.

Wolisz najpierw szkic serwisu (logika biznesowa) czy warstwy repozytorium pod DuckDB (SQL + interfejs)?

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

