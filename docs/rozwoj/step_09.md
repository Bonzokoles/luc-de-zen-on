<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Endpoint `GET /finance/costs` + struktura tabeli `costs` dla D1

Przygotuję strukturę pod realne koszty (logistyka, marketing, dostawy, pracownicy), żebyś mógł śledzić marże i net profit zamiast placeholderów 30%.[^1]

### 1. Struktura tabeli `costs` w D1

```sql
-- wrangler d1 execute mybonzo --local --command="CREATE TABLE IF NOT EXISTS costs (...)"
CREATE TABLE costs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  currency TEXT DEFAULT 'PLN',
  type ENUM('FIXED', 'VARIABLE') DEFAULT 'VARIABLE',
  category TEXT NOT NULL, -- 'MARKETING', 'LOGISTYKA', 'PRACOWNICY', 'DOSTAWCY', 'ADMIN'
  subcategory TEXT,       -- 'FB Ads', 'Dostawa InPost', 'ZUS', 'Meble XYZ'
  counterparty TEXT,     -- nazwa dostawcy/firmy
  counterparty_id TEXT,  -- ID z CRM
  project_id TEXT,       -- powiązanie z projektami
  description TEXT,
  source_system TEXT DEFAULT 'MANUAL', -- 'IMPORT_CSV', 'INTEGRACJA', 'MANUAL'
  status ENUM('PLANNED', 'PAID', 'PENDING') DEFAULT 'PENDING',
  vat_rate DECIMAL(5,2),
  net_amount DECIMAL(18,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  meta JSON
);

-- Indexy na wydajność
CREATE INDEX idx_costs_tenant_date ON costs(tenant_id, date);
CREATE INDEX idx_costs_category ON costs(tenant_id, category);
CREATE INDEX idx_costs_status ON costs(tenant_id, status);
```

**Przykładowy rekord (import z CSV dostawców):**

```json
{
  "id": "cost_20260301_fb_ads_001",
  "tenant_id": "meblepumo",
  "date": "2026-03-01",
  "amount": 1500.00,
  "category": "MARKETING",
  "subcategory": "FB Ads",
  "counterparty": "Meta Platforms Inc.",
  "status": "PAID",
  "net_amount": 1219.51,
  "vat_rate": 23.0
}
```


### 2. Endpoint `GET /finance/costs/dashboard`

Karmi dashboard kosztów w `FinansePro.tsx` + sekcję marż / rentowności.

**Request:**

```
GET /finance/costs/dashboard?from=2026-03-01&to=2026-03-31
```

**Response (realne z D1):**

```json
{
  "kpi_cards": {
    "total_costs": 65432.10,
    "marketing": 18000.50,
    "logistics": 25000.75,
    "employees": 12000.00,
    "suppliers": 10431.85,
    "avg_daily_costs": 2110.39
  },
  "costs_chart": {
    "data": [
      {"date": "2026-03-01", "total": 3200.50, "marketing": 1500.00, "logistics": 1200.50},
      {"date": "2026-03-02", "total": 2800.25, "marketing": 800.00, "logistics": 1800.25}
    ]
  },
  "category_breakdown": [
    {"category": "LOGISTYKA", "amount": 25000.75, "pct": "38.3%", "color": "#EF4444"},
    {"category": "MARKETING", "amount": 18000.50, "pct": "27.5%", "color": "#F59E0B"},
    {"category": "PRACOWNICY", "amount": 12000.00, "pct": "18.3%", "color": "#10B981"}
  ],
  "recent_costs": [
    {
      "id": "cost_20260301_fb_ads_001",
      "date": "2026-03-01",
      "amount": 1500.00,
      "category": "MARKETING",
      "subcategory": "FB Ads",
      "counterparty": "Meta Platforms Inc.",
      "status": "PAID"
    }
  ],
  "profitability": {
    "gross_profit": 58024.68,  // revenue - costs
    "gross_margin_pct": 47.0,  // (gross_profit / revenue) * 100
    "top_expensive_supplier": "InPost (logistyka, 12k PLN)"
  }
}
```


### 3. Repozytorium dla kosztów

```ts
// core/db/costsRepository.ts
export const costsRepository = {
  async listCostsForRange(tenantId: string, from: string, to: string) {
    return all(
      `
      SELECT 
        date, amount, category, subcategory, counterparty,
        status, net_amount
      FROM costs
      WHERE tenant_id = ? 
        AND date BETWEEN ? AND ?
        AND status IN ('PAID')
      ORDER BY date DESC
      LIMIT 500
      `,
      [tenantId, from, to]
    );
  },

  async getCostsByCategory(tenantId: string, from: string, to: string) {
    return all(
      `
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM costs
      WHERE tenant_id = ? 
        AND date BETWEEN ? AND ?
        AND status = 'PAID'
      GROUP BY category
      ORDER BY total DESC
      `,
      [tenantId, from, to]
    );
  },
};
```


### 4. Serwis agregujący koszty

```ts
// core/services/costsService.ts
export const costsService = {
  async getCostsDashboard(params: { tenantId: string; from?: string; to?: string }) {
    const costs = await costsRepository.listCostsForRange(
      params.tenantId,
      params.from || "2026-03-01",
      params.to || new Date().toISOString().split("T")[^0]
    );

    const byCategory = await costsRepository.getCostsByCategory(
      params.tenantId,
      params.from || "2026-03-01",
      params.to || new Date().toISOString().split("T")[^0]
    );

    // KPI po kategoriach
    const categoryTotals = {
      marketing: 0,
      logistics: 0,
      employees: 0,
      suppliers: 0,
    };

    byCategory.forEach((cat: any) => {
      if (cat.category === "MARKETING") categoryTotals.marketing = cat.total;
      if (cat.category === "LOGISTYKA") categoryTotals.logistics = cat.total;
      if (cat.category === "PRACOWNICY") categoryTotals.employees = cat.total;
      if (cat.category === "DOSTAWCY") categoryTotals.suppliers = cat.total;
    });

    const kpi_cards = {
      total_costs: costs.reduce((sum, c) => sum + c.amount, 0),
      marketing: categoryTotals.marketing,
      logistics: categoryTotals.logistics,
      employees: categoryTotals.employees,
      suppliers: categoryTotals.suppliers,
      avg_daily_costs: costs.length ? costs.reduce((sum, c) => sum + c.amount, 0) / costs.length : 0,
    };

    // ... reszta analogicznie jak w revenue dashboard

    return {
      kpi_cards,
      // charts, recent, profitability...
    };
  },
};
```


### 5. Jak to spiąć z revenue dashboardem

Żeby mieć pełny obraz w `FinansePro.tsx`:

```ts
// Jeden fetch łączy revenue + costs
const [revenueData] = useApi("/finance/dashboard");
const [costsData] = useApi("/finance/costs/dashboard");

// KPI netto = revenue - costs
<KPICard title="Marża brutto" value={revenueData.kpi_cards.total_revenue - costsData.kpi_cards.total_costs} />
```

Teraz masz realne koszty z D1, które możesz zasilać:

- ręcznie (CSV z dostawców),
- automatycznie (integracje z InPost, hurtowniami),
- z panelu księgowego.

Następny krok: endpoint `/finance/profitability` który łączy revenue (zamówienia Pumo) + costs i liczy marże po kategorii/produkcie?

<div align="center">⁂</div>

[^1]: https://www.perplexity.ai/search/3fb418ad-711f-4b3e-a810-8344fe77bd5c

