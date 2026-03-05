<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# tak rozpisz

Poniżej konkret, który możesz praktycznie przepisać do typów/ORM/DDL.[^1]

## Tabela `finance_transactions`

### Kolumny (SQL / typy logiczne)

- `id` – string/UUID
- `tenant_id` – string (firma / workspace)
- `date` – date / datetime (data księgowania lub operacji)
- `amount` – decimal(18,2)
- `currency` – string(3) (PLN, EUR, …)
- `direction` – enum: `INCOME`, `EXPENSE`, `TRANSFER`
- `category` – string (np. „sprzedaż”, „marketing”, „logistyka”)
- `subcategory` – string nullable (np. „Ads Facebook”)
- `counterparty_name` – string (kontrahent)
- `counterparty_id` – string nullable (ID z CRM lub zewnętrznego systemu)
- `project_id` – string nullable (powiązanie z modułem `projekty`)[^1]
- `document_id` – string nullable (powiązanie z `finance_documents`)
- `status` – enum: `PLANNED`, `PENDING`, `PAID`, `CANCELLED`
- `payment_method` – string nullable (przelew, karta, gotówka, bramka płatności)
- `source_system` – string (np. `IDOSSELL`, `FAKTURA_MVP`, `MANUAL`)
- `description` – text nullable (opis / notatka)
- `created_at` – datetime
- `updated_at` – datetime
- `meta` – JSON nullable (dowolne dodatkowe pola, np. numer zamówienia, kanał sprzedaży)


### Przykładowy rekord JSON

```json
{
  "id": "trx_01JAZ32ABC123",
  "tenant_id": "tenant_meblepumo",
  "date": "2026-03-01T10:23:00Z",
  "amount": 2499.99,
  "currency": "PLN",
  "direction": "INCOME",
  "category": "SPRZEDAZ",
  "subcategory": "E-COMMERCE",
  "counterparty_name": "Jan Kowalski",
  "counterparty_id": "crm_123",
  "project_id": "proj_salon_2026",
  "document_id": "doc_fv_2026_03_0012",
  "status": "PAID",
  "payment_method": "ONLINE_GATEWAY",
  "source_system": "IDOSSELL",
  "description": "Zamówienie #12345 z e-sklepu",
  "created_at": "2026-03-01T10:24:00Z",
  "updated_at": "2026-03-01T10:24:00Z",
  "meta": {
    "order_id": "ORD-12345",
    "channel": "SHOP",
    "utm_source": "fb_ads"
  }
}
```


## Tabela `finance_documents`

### Kolumny

- `id` – string/UUID
- `tenant_id` – string
- `type` – enum: `INVOICE`, `PROFORMA`, `CONTRACT`, `OFFER`, `ORDER`, `CREDIT_NOTE`, `OTHER`
- `number` – string (np. „FV/03/2026/0123”)
- `issue_date` – date
- `due_date` – date nullable
- `currency` – string(3)
- `amount_net` – decimal(18,2)
- `amount_gross` – decimal(18,2)
- `vat_rate_avg` – decimal(5,2) nullable
- `counterparty_name` – string
- `counterparty_id` – string nullable
- `project_id` – string nullable
- `status` – enum: `DRAFT`, `SENT`, `SIGNED`, `PAID`, `OVERDUE`, `CANCELLED`
- `file_url` – string nullable (link do PDF / pliku w storage)
- `source_system` – string (np. `GENERATOR_FAKTUR`, `UPLOAD`, `EXTERNAL_ERP`)[^1]

Polaz AI-risk/analityka:

- `risk_score` – integer 0–100 nullable
- `risk_level` – enum: `LOW`, `MEDIUM`, `HIGH` nullable
- `risk_tags` – JSON array (np. `["OPÓŹNIENIA_PLATNOSCI","WYSOKIE_KWOTY"]`)
- `risk_summary` – text nullable (krótki opis z AI)
- `ai_model` – string nullable (np. `gemini-2.5-flash`)
- `ai_analyzed_at` – datetime nullable

Ogólne:

- `notes` – text nullable
- `created_at` – datetime
- `updated_at` – datetime
- `meta` – JSON nullable


### Przykładowy rekord JSON

```json
{
  "id": "doc_fv_2026_03_0012",
  "tenant_id": "tenant_meblepumo",
  "type": "INVOICE",
  "number": "FV/03/2026/0012",
  "issue_date": "2026-03-01",
  "due_date": "2026-03-15",
  "currency": "PLN",
  "amount_net": 2032.51,
  "amount_gross": 2499.99,
  "vat_rate_avg": 23.0,
  "counterparty_name": "Jan Kowalski",
  "counterparty_id": "crm_123",
  "project_id": "proj_salon_2026",
  "status": "SENT",
  "file_url": "https://storage.../FV_03_2026_0012.pdf",
  "source_system": "GENERATOR_FAKTUR",
  "risk_score": 72,
  "risk_level": "MEDIUM",
  "risk_tags": [
    "NOWY_KONTRAHENT",
    "DŁUGI_TERMIN_PLATNOSCI"
  ],
  "risk_summary": "Nowy klient, wysoka kwota i termin 14 dni. Zalecane monitorowanie płatności.",
  "ai_model": "gemini-2.5-flash",
  "ai_analyzed_at": "2026-03-01T11:05:00Z",
  "notes": "Pierwsza faktura dla tego klienta.",
  "created_at": "2026-03-01T10:30:00Z",
  "updated_at": "2026-03-01T11:05:00Z",
  "meta": {
    "import_batch_id": "batch_2026_03_01",
    "source_file": "import_03_01.csv"
  }
}
```

Na tej bazie łatwo zrobisz:

- join `finance_transactions` ↔ `finance_documents` (cashflow vs faktury),
- analizę ryzyka na poziomie dokumentu, ale też na poziomie kontrahenta/projektu (agregując score po `counterparty_id` / `project_id`).

Czy chcesz teraz, żebym rozpisał pod to propozycję 3 endpointów API (`GET /transactions`, `GET /documents`, `POST /documents/analyze`), od razu z przykładowymi query param i responsem?

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

