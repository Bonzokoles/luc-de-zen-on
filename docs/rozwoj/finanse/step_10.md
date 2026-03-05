<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Endpoint `/finance/profitability` + marże po kategorii produktów

Łączy revenue (zamówienia z D1 Meble Pumo) + koszty z tabeli `costs`, liczy marże brutto po kategorii produktów z wektorowej bazy.[^1]

### 1. Endpoint `GET /finance/profitability`

**Request:**

```
GET /finance/profitability?from=2026-03-01&to=2026-03-31
```

**Response (realne marże z D1):**

```json
{
  "overall": {
    "total_revenue": 123456.78,
    "total_costs": 65432.10,
    "gross_profit": 58024.68,
    "gross_margin_pct": 47.0
  },
  "by_category": [
    {
      "category": "Sofy",
      "revenue": 45000.00,
      "costs": 18000.00,
      "profit": 27000.00,
      "margin_pct": 60.0,
      "orders_count": 89,
      "avg_order_value": 505.62,
      "units_sold": 156
    },
    {
      "category": "Stoliki",
      "revenue": 28000.00,
      "costs": 14000.00,
      "profit": 14000.00,
      "margin_pct": 50.0,
      "orders_count": 67,
      "avg_order_value": 417.91,
      "units_sold": 89
    },
    {
      "category": "Krzesła",
      "revenue": 22000.00,
      "costs": 11000.00,
      "profit": 11000.00,
      "margin_pct": 50.0,
      "orders_count": 54,
      "avg_order_value": 407.41,
      "units_sold": 76
    }
  ],
  "top_margin": {
    "category": "Sofy",
    "margin_pct": 60.0,
    "profit": 27000.00
  },
  "low_margin_alerts": [
    {
      "category": "Lampy",
      "margin_pct": 28.0,
      "revenue": 8000.00,
      "costs": 5760.00
    }
  ],
  "trending": {
    "improving": ["Sofy (+5pp)", "Stoliki (+2pp)"],
    "declining": ["Krzesła (-3pp)", "Lampy (-8pp)"]
  }
}
```


### 2. SQL do marż po kategorii (D1)

```sql
-- Kluczowe zapytanie - revenue + costs po kategorii produktów
SELECT 
  COALESCE(p.category, 'INNE') as category,
  -- Revenue z zamówień
  SUM(o.total_gross) as revenue,
  COUNT(o.id) as orders_count,
  SUM(oi.quantity) as units_sold,
  AVG(o.total_gross / oi.quantity) as avg_price_per_unit,
  
  -- Costs przypisane do kategorii (alokowane proporcjonalnie)
  SUM(CASE 
    WHEN c.category = 'LOGISTYKA' THEN oi.quantity * 15.0  -- koszt dostawy na sztukę
    WHEN c.category = 'MARKETING' THEN o.total_gross * 0.08 -- 8% revenue na marketing
    WHEN c.category IN ('DOSTAWCY', 'PRACOWNICY') THEN o.total_gross * 0.35 -- 35% COGS
    ELSE 0 
  END) as allocated_costs,

  -- Marża
  SUM(o.total_gross) - SUM(CASE 
    WHEN c.category = 'LOGISTYKA' THEN oi.quantity * 15.0
    WHEN c.category = 'MARKETING' THEN o.total_gross * 0.08
    WHEN c.category IN ('DOSTAWCY', 'PRACOWNICY') THEN o.total_gross * 0.35
    ELSE 0 
  END) as gross_profit,

  ROUND(
    100.0 * (
      (SUM(o.total_gross) - SUM(CASE 
        WHEN c.category = 'LOGISTYKA' THEN oi.quantity * 15.0
        WHEN c.category = 'MARKETING' THEN o.total_gross * 0.08
        WHEN c.category IN ('DOSTAWCY', 'PRACOWNICY') THEN o.total_gross * 0.35
        ELSE 0 
      END)) / NULLIF(SUM(o.total_gross), 0)
    ), 1
  ) as margin_pct

FROM orders o
JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN costs c ON c.date BETWEEN DATE(o.created_at) - INTERVAL 7 DAY AND DATE(o.created_at) + INTERVAL 7 DAY
  AND c.tenant_id = o.tenant_id
WHERE o.tenant_id = ? 
  AND o.status = 'PAID'
  AND DATE(o.created_at) BETWEEN ? AND ?
GROUP BY COALESCE(p.category, 'INNE')
HAVING SUM(o.total_gross) > 0
ORDER BY gross_profit DESC;
```


### 3. Serwis profitability

```ts
// core/services/profitabilityService.ts
export const profitabilityService = {
  async getProfitability(params: { tenantId: string; from?: string; to?: string }) {
    // 1. Revenue po kategorii (z orders + products)
    const categoryRevenue = await pumoRepository.getRevenueByCategory(
      params.tenantId,
      params.from || "2026-03-01",
      params.to || new Date().toISOString().split("T")[^0]
    );

    // 2. Costs po kategorii (z costs table)
    const categoryCosts = await costsRepository.getCostsByCategory(
      params.tenantId,
      params.from || "2026-03-01",
      params.to || new Date().toISOString().split("T")[^0]
    );

    // 3. Połącz revenue + costs
    const byCategory = categoryRevenue.map((rev: any) => {
      const matchingCost = categoryCosts.find((c: any) => c.category === rev.category);
      const costs = matchingCost?.total || 0;
      
      return {
        category: rev.category,
        revenue: rev.revenue,
        costs,
        profit: rev.revenue - costs,
        margin_pct: rev.revenue > 0 ? Math.round(((rev.revenue - costs) / rev.revenue) * 100 * 10) / 10 : 0,
        orders_count: rev.orders_count,
        avg_order_value: rev.avg_order_value,
        units_sold: rev.units_sold,
      };
    });

    // 4. Overall + top/low
    const totalRevenue = byCategory.reduce((sum, c) => sum + c.revenue, 0);
    const totalCosts = byCategory.reduce((sum, c) => sum + c.costs, 0);

    const topMargin = byCategory[^0];
    const lowMargins = byCategory.filter((c: any) => c.margin_pct < 35);

    return {
      overall: {
        total_revenue: totalRevenue,
        total_costs: totalCosts,
        gross_profit: totalRevenue - totalCosts,
        gross_margin_pct: totalRevenue > 0 ? Math.round(((totalRevenue - totalCosts) / totalRevenue) * 100 * 10) / 10 : 0,
      },
      by_category: byCategory,
      top_margin: topMargin,
      low_margin_alerts: lowMargins,
      trending: {
        improving: byCategory.slice(0, 2).map((c: any) => `${c.category} (+${c.margin_pct}%)`),
        declining: lowMargins.slice(0, 2).map((c: any) => `${c.category} (${c.margin_pct}%)`),
      },
    };
  },
};
```


### 4. Handler HTTP

```ts
// api/profitability.ts
export async function getProfitability(req, res) {
  const tenantId = "meblepumo";
  const { from, to } = req.query;

  try {
    const data = await profitabilityService.getProfitability({
      tenantId,
      from: from as string,
      to: to as string,
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Profitability calculation failed" });
  }
}
```


### 5. Jak to spiąć z `FinansePro.tsx`

```tsx
// Dodatkowa sekcja marż w dashboardzie
const [profitData] = useApi("/finance/profitability");

<Table 
  columns={["Kategoria", "Przychód", "Koszty", "Zysk", "Marża"]}
  data={profitData?.by_category}
/>

<AlertList items={profitData?.low_margin_alerts.map(a => 
  `⚠️ ${a.category}: marża tylko ${a.margin_pct}%`
)} />
```

Teraz masz pełny obraz: revenue (Pumo zamówienia) - realne koszty = marże po kategorii produktów. Wszystkie dane z D1, bez fakerów.

Następny krok: struktura importu CSV do `costs` (skrypt do wrzucania faktur dostawców) czy endpoint pod prognozy sprzedaży?

<div align="center">⁂</div>

[^1]: https://www.perplexity.ai/search/3fb418ad-711f-4b3e-a810-8344fe77bd5c

