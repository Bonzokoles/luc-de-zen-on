<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Typ TS dla `FinanceSummaryResponse` + szkic `getFinanceSummary`

### 1. Typ `FinanceSummaryResponse`

```ts
// core/types/finance.ts
export interface FinanceSummaryRequest {
  tenantId: string;
  from?: string; // ISO date
  to?: string;   // ISO date
}

export interface FinanceSummaryKPI {
  total_income: number;
  total_expense: number;
  net_cashflow: number;
  opening_balance: number;
  closing_balance: number;
  avg_daily_income: number;
  avg_daily_expense: number;
}

export interface TimeseriesPoint {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
  net: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  direction: "INCOME" | "EXPENSE";
  amount: number;
}

export interface FinanceSummaryResponse {
  range: {
    from: string;
    to: string;
  };
  currency: string; // z pierwszej transakcji, domyślnie "PLN"
  kpi: FinanceSummaryKPI;
  timeseries: {
    granularity: "DAY"; // na start tylko DAY
    points: TimeseriesPoint[];
  };
  by_category: CategoryBreakdown[];
  ai_context: {
    summary_prompt_payload: {
      range: { from: string; to: string };
      kpi: Pick<FinanceSummaryKPI, "total_income" | "total_expense" | "net_cashflow" | "opening_balance" | "closing_balance">;
      top_categories: CategoryBreakdown[];
    };
  };
}
```


### 2. Szkic `getFinanceSummary` (agregacja w JS)

```ts
// core/services/financeService.ts
import { financeRepository } from "../db/financeRepository";

export const financeService = {
  // ... inne metody

  async getFinanceSummary(params: {
    tenantId: string;
    from?: string;
    to?: string;
    opening_balance?: number; // opcjonalnie, na start
  }): Promise<FinanceSummaryResponse> {
    // 1. Pobierz surowe transakcje z repozytorium
    const transactions = await financeRepository.listTransactionsForRange({
      tenantId: params.tenantId,
      from: params.from,
      to: params.to,
    });

    // 2. Oblicz totals i średnie
    const totals = {
      income: 0,
      expense: 0,
    };
    const categories: Record<string, { income: number; expense: number }> = {};
    const daily: Record<string, { income: number; expense: number }> = {};
    let currency = "PLN"; // domyślnie

    transactions.forEach((trx: any) => {
      currency = trx.currency || "PLN";
      const day = trx.date.split("T")[^0]; // YYYY-MM-DD

      if (!daily[day]) {
        daily[day] = { income: 0, expense: 0 };
      }

      if (trx.direction === "INCOME") {
        totals.income += trx.amount;
        daily[day].income += trx.amount;
        categories[trx.category] ??= { income: 0, expense: 0 };
        categories[trx.category].income += trx.amount;
      } else if (trx.direction === "EXPENSE") {
        totals.expense += trx.amount;
        daily[day].expense += trx.amount;
        categories[trx.category] ??= { income: 0, expense: 0 };
        categories[trx.category].expense += trx.amount;
      }
    });

    // 3. Oblicz dni w okresie
    const days = Math.ceil(
      (new Date(params.to || Date.now()).getTime() -
        new Date(params.from || "2026-01-01").getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // 4. Zbuduj KPI
    const kpi: FinanceSummaryKPI = {
      total_income: totals.income,
      total_expense: totals.expense,
      net_cashflow: totals.income - totals.expense,
      opening_balance: params.opening_balance ?? 0,
      closing_balance: (params.opening_balance ?? 0) + (totals.income - totals.expense),
      avg_daily_income: days > 0 ? totals.income / days : 0,
      avg_daily_expense: days > 0 ? totals.expense / days : 0,
    };

    // 5. Zbuduj timeseries (posortowane po dacie)
    const sortedDays = Object.keys(daily).sort();
    const timeseries: TimeseriesPoint[] = [];
    let runningBalance = params.opening_balance ?? 0;

    sortedDays.forEach((day) => {
      const net = daily[day].income - daily[day].expense;
      runningBalance += net;
      timeseries.push({
        date: day,
        income: daily[day].income,
        expense: daily[day].expense,
        net,
        balance: runningBalance,
      });
    });

    // 6. Zbuduj by_category (top 10)
    const byCategory: CategoryBreakdown[] = [];
    Object.entries(categories)
      .sort((a, b) => (b[^1].income + b[^1].expense) - (a[^1].income + a[^1].expense))
      .slice(0, 10)
      .forEach(([cat, amounts]) => {
        if (amounts.income > 0) {
          byCategory.push({ category: cat, direction: "INCOME", amount: amounts.income });
        }
        if (amounts.expense > 0) {
          byCategory.push({ category: cat, direction: "EXPENSE", amount: amounts.expense });
        }
      });

    // 7. Zwróć response
    return {
      range: {
        from: params.from ?? "2026-03-01",
        to: params.to ?? new Date().toISOString().split("T")[^0],
      },
      currency,
      kpi,
      timeseries: { granularity: "DAY", points: timeseries },
      by_category: byCategory,
      ai_context: {
        summary_prompt_payload: {
          range: {
            from: params.from ?? "2026-03-01",
            to: params.to ?? new Date().toISOString().split("T")[^0],
          },
          kpi: {
            total_income: kpi.total_income,
            total_expense: kpi.total_expense,
            net_cashflow: kpi.net_cashflow,
            opening_balance: kpi.opening_balance,
            closing_balance: kpi.closing_balance,
          },
          top_categories: byCategory.slice(0, 5),
        },
      },
    };
  },
};
```


### 3. Handler HTTP dla `GET /finance/summary`

```ts
// api/financeSummaryRoute.ts
import { financeService } from "../core/services/financeService";

export async function getFinanceSummary(req, res) {
  const tenantId = req.user.tenantId; // z auth middleware
  const { from, to, opening_balance } = req.query;

  try {
    const summary = await financeService.getFinanceSummary({
      tenantId,
      from: from as string,
      to: to as string,
      opening_balance: parseFloat(opening_balance as string) || undefined,
    });
    res.status(200).json(summary);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute summary" });
  }
}
```

To jest kompletny endpoint pod cały dashboard `FinansePro` – dane do kart, wykresów i AI‑raportów w jednym. Na froncie robisz jeden fetch i masz wszystko.[^1]

Następny krok: jeśli masz już jakieś mocki / statyczne dane w `FinansePro.tsx`, pokaż mi fragment (albo opisz, co tam jest), to dopiszę dokładnie, jak podmienić na te nowe endpointy.

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

