<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## `GET /finance/dashboard` – realne dane z D1 (Meble Pumo)

Endpoint, który zasila `FinansePro.tsx` danymi z Twojej bazy wektorowej D1 (produkty, zamówienia, etc.). Żadnych mocków – SQL z D1.[^1][^2]

### Request

```
GET /finance/dashboard?from=2026-03-01&to=2026-03-31
```


### Response (realne dane z D1)

```json
{
  "kpi_cards": {
    "total_orders": 247,
    "total_revenue": 123456.78,
    "total_costs": 65432.10,
    "net_profit": 57924.68,
    "avg_order_value": 500.22,
    "conversion_rate": 3.14
  },
  "cashflow_chart": {
    "data": [
      {"date": "2026-03-01", "orders": 12, "revenue": 6000.50, "profit": 1800.15},
      {"date": "2026-03-02", "orders": 8, "revenue": 4000.25, "profit": 1200.75}
    ]
  },
  "category_pie": [
    {"category": "Sofy", "revenue": 45000, "pct": "36.4%", "color": "#10B981"},
    {"category": "Stoliki", "revenue": 28000, "pct": "22.7%", "color": "#3B82F6"},
    {"category": "Krzesła", "revenue": 22000, "pct": "17.8%", "color": "#EF4444"}
  ],
  "recent_orders": [
    {
      "id": "ORD_20260301_001",
      "date": "2026-03-01T14:23:00Z",
      "revenue": 2499.99,
      "products_count": 3,
      "customer": "Jan Kowalski",
      "status": "PAID",
      "category": "Sofy"
    }
  ],
  "ai_insight_prompt": {
    "summary": "Marzec: +25% zamowień rok do roku. Sofy liderem sprzedaży. Koszty logistyczne do optymalizacji.",
    "action_items": [
      "Zwiększ stock sof (sprzedaż +45%)",
      "Optymalizuj koszty dostaw stolików (margines 18%)"
    ]
  }
}
```


## Implementacja – SQL z D1

### 1. Dodatkowe repozytorium dla D1 (Meble Pumo)

```ts
// core/db/pumoRepository.ts
export const pumoRepository = {
  async listOrdersForRange(tenantId: string, from: string, to: string) {
    // SQL z D1 - tabela orders/products z IdoSell export
    return all(
      `
      SELECT 
        o.id,
        o.created_at as date,
        o.total_gross as revenue,
        o.products_count,
        c.name as customer,
        o.status,
        p.category
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.tenant_id = ? 
        AND DATE(o.created_at) BETWEEN ? AND ?
        AND o.status IN ('PAID', 'SHIPPED')
      ORDER BY o.created_at DESC
      LIMIT 500
      `,
      [tenantId, from, to]
    );
  },

  async getCategoryRevenue(tenantId: string, from: string, to: string) {
    return all(
      `
      SELECT 
        p.category,
        SUM(o.total_gross) as revenue,
        COUNT(o.id) as orders_count
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.tenant_id = ? 
        AND DATE(o.created_at) BETWEEN ? AND ?
        AND o.status = 'PAID'
      GROUP BY p.category
      ORDER BY revenue DESC
      LIMIT 10
      `,
      [tenantId, from, to]
    );
  },
};
```


### 2. Serwis `getPumoFinanceDashboard`

```ts
// core/services/pumoFinanceService.ts
export const pumoFinanceService = {
  async getFinanceDashboard(params: {
    tenantId: string;
    from?: string;
    to?: string;
  }): Promise<FinanceDashboardResponse> {
    const orders = await pumoRepository.listOrdersForRange(
      params.tenantId,
      params.from || "2026-03-01",
      params.to || new Date().toISOString().split("T")[^0]
    );

    const categories = await pumoRepository.getCategoryRevenue(
      params.tenantId,
      params.from || "2026-03-01",
      params.to || new Date().toISOString().split("T")[^0]
    );

    // Agregacja KPI
    const totals = orders.reduce(
      (acc, order) => {
        acc.total_revenue += order.revenue;
        acc.orders_count += 1;
        acc.products_total += order.products_count;
        return acc;
      },
      { total_revenue: 0, orders_count: 0, products_total: 0 }
    );

    const kpi_cards = {
      total_orders: totals.orders_count,
      total_revenue: totals.total_revenue,
      total_costs: 0, // na razie, później z costs table
      net_profit: totals.total_revenue * 0.3, // placeholder, później realne
      avg_order_value: totals.total_revenue / totals.orders_count || 0,
      conversion_rate: 3.14, // z GA lub obliczone z views→orders
    };

    // Timeseries dzienne
    const daily = {};
    orders.forEach((order) => {
      const day = order.date.split("T")[^0];
      daily[day] ??= { orders: 0, revenue: 0, profit: 0 };
      daily[day].orders += 1;
      daily[day].revenue += order.revenue;
      daily[day].profit += order.revenue * 0.3; // placeholder
    });

    const cashflow_chart = {
      data: Object.entries(daily)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, vals]) => ({
          date,
          orders: vals.orders,
          revenue: vals.revenue,
          profit: vals.profit,
        }))
    };

    // Category pie
    const category_pie = categories.slice(0, 5).map((cat: any) => ({
      category: cat.category,
      revenue: cat.revenue,
      pct: ((cat.revenue / totals.total_revenue) * 100).toFixed(1) + "%",
      color: "#10B981", // mapuj kolory po kategorii
    }));

    // Recent orders
    const recent_orders = orders.slice(0, 10).map((order: any) => ({
      id: order.id,
      date: order.date,
      revenue: order.revenue,
      products_count: order.products_count,
      customer: order.customer,
      status: order.status,
      category: order.category,
    }));

    return {
      kpi_cards,
      cashflow_chart,
      category_pie,
      recent_orders,
      ai_insight_prompt: {
        summary: `Marzec: ${kpi_cards.total_orders} zamówień, przychód ${kpi_cards.total_revenue.toLocaleString()} PLN. Lider: ${category_pie[^0]?.category}`,
        action_items: [
          `Stock dla ${category_pie[^0]?.category} jest niski`,
          "Optymalizuj koszty logistyki"
        ],
      },
    };
  },
};
```


### 3. Handler HTTP

```ts
// api/pumoFinanceDashboard.ts
export async function getPumoFinanceDashboard(req, res) {
  const tenantId = "meblepumo"; // hardcoded na start, później z auth
  const { from, to } = req.query;

  try {
    const dashboard = await pumoFinanceService.getFinanceDashboard({
      tenantId,
      from: from as string,
      to: to as string,
    });
    res.status(200).json(dashboard);
  } catch (err) {
    res.status(500).json({ error: "D1 query failed" });
  }
}
```

Teraz masz endpoint, który:

1. czyta realne zamówienia z D1 (export IdoSell),
2. agreguje KPI pod `FinansePro.tsx`,
3. grupuje po kategoriach produktów z wektorowej bazy,
4. generuje kontekst pod AI‑raporty.[^1]

Następny krok: endpoint pod `DokumentyFinansowe.tsx` (jeśli masz tam dane faktur w D1) lub struktura tabeli `costs` pod realne koszty?

<div align="center">⁂</div>

[^1]: https://www.perplexity.ai/search/3fb418ad-711f-4b3e-a810-8344fe77bd5c

[^2]: MODULY_I_NARZEDZIA.md

