import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../types/finanse';

interface CostKpiCards {
  total_costs: number;
  marketing: number;
  logistics: number;
  employees: number;
  suppliers: number;
  avg_daily_costs: number;
}

interface CostsChartPoint {
  date: string;
  total: number;
  marketing: number;
  logistics: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  pct: number;
  color: string;
}

interface RecentCost {
  id: string;
  date: string;
  category: string;
  counterparty: string;
  amount: number;
  status: string;
}

interface Profitability {
  gross_profit: number;
  gross_margin_pct: number;
  top_expensive_supplier: string;
}

interface CostsDashboardResponse {
  kpi_cards: CostKpiCards;
  costs_chart: { data: CostsChartPoint[] };
  category_breakdown: CategoryBreakdown[];
  recent_costs: RecentCost[];
  profitability: Profitability;
  from: string;
  to: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: '#6366f1',
  Logistyka: '#f59e0b',
  Pracownicy: '#10b981',
  Dostawcy: '#3b82f6',
  Czynsz: '#ec4899',
  'IT / SaaS': '#8b5cf6',
  Transport: '#f97316',
  Inne: '#6b7280',
};

function buildDemoResponse(from: string, to: string): CostsDashboardResponse {
  const total = 45_230;

  return {
    kpi_cards: {
      total_costs: total,
      marketing: 8_400,
      logistics: 6_200,
      employees: 18_500,
      suppliers: 9_130,
      avg_daily_costs: Math.round(total / 30),
    },
    costs_chart: {
      data: Array.from({ length: 6 }, (_, i) => {
        const d = new Date(from);
        d.setDate(d.getDate() + i * 5);
        return {
          date: d.toISOString().split('T')[0],
          total: 1_200 + Math.floor(Math.random() * 800),
          marketing: 200 + Math.floor(Math.random() * 300),
          logistics: 150 + Math.floor(Math.random() * 200),
        };
      }),
    },
    category_breakdown: [
      { category: 'Pracownicy', amount: 18_500, pct: 40.9, color: CATEGORY_COLORS['Pracownicy'] },
      { category: 'Dostawcy', amount: 9_130, pct: 20.2, color: CATEGORY_COLORS['Dostawcy'] },
      { category: 'Marketing', amount: 8_400, pct: 18.6, color: CATEGORY_COLORS['Marketing'] },
      { category: 'Logistyka', amount: 6_200, pct: 13.7, color: CATEGORY_COLORS['Logistyka'] },
      { category: 'Transport', amount: 3_000, pct: 6.6, color: CATEGORY_COLORS['Transport'] },
    ],
    recent_costs: [
      { id: 'CST-001', date: from, category: 'Pracownicy', counterparty: 'Jan Kowalski', amount: 5_200, status: 'PAID' },
      { id: 'CST-002', date: from, category: 'Marketing', counterparty: 'Google Ads', amount: 2_800, status: 'PAID' },
      { id: 'CST-003', date: to, category: 'Dostawcy', counterparty: 'Tartak Mazowsze', amount: 4_300, status: 'PENDING' },
    ],
    profitability: {
      gross_profit: 32_000,
      gross_margin_pct: 41.4,
      top_expensive_supplier: 'Tartak Mazowsze (4 300 PLN)',
    },
    from,
    to,
  };
}

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const url = new URL(request.url);

  const from = url.searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const to = url.searchParams.get('to') ?? new Date().toISOString().split('T')[0];
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  if (!env?.D1) {
    return Response.json(buildDemoResponse(from, to));
  }

  try {
    const db = env.D1;

    // KPI agregaty — czytamy z tabeli `koszty` (PL kolumny: kwota, kategoria, data, status, kontrahent)
    const kpiResult = await db.prepare(`
      SELECT
        SUM(kwota) AS total_costs,
        SUM(CASE WHEN kategoria = 'Marketing' THEN kwota ELSE 0 END) AS marketing,
        SUM(CASE WHEN kategoria IN ('Logistyka') THEN kwota ELSE 0 END) AS logistics,
        SUM(CASE WHEN kategoria = 'Pracownicy' THEN kwota ELSE 0 END) AS employees,
        SUM(CASE WHEN kategoria = 'Dostawcy' THEN kwota ELSE 0 END) AS suppliers
      FROM koszty
      WHERE tenant_id = ? AND data BETWEEN ? AND ? AND status != 'Anulowane'
    `).bind(tenantId, from, to).first<{
      total_costs: number; marketing: number; logistics: number; employees: number; suppliers: number;
    }>();

    const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
    const totalCosts = kpiResult?.total_costs ?? 0;

    // Wykres dzienny – ostatnie 30 punktów
    const chartResult = await db.prepare(`
      SELECT
        data AS date,
        SUM(kwota) AS total,
        SUM(CASE WHEN kategoria = 'Marketing' THEN kwota ELSE 0 END) AS marketing,
        SUM(CASE WHEN kategoria IN ('Logistyka') THEN kwota ELSE 0 END) AS logistics
      FROM koszty
      WHERE tenant_id = ? AND data BETWEEN ? AND ? AND status != 'Anulowane'
      GROUP BY data ORDER BY data ASC
    `).bind(tenantId, from, to).all<CostsChartPoint>();

    // Breakdown po kategoriach
    const breakdownResult = await db.prepare(`
      SELECT kategoria AS category, SUM(kwota) AS amount
      FROM koszty
      WHERE tenant_id = ? AND data BETWEEN ? AND ? AND status != 'Anulowane'
      GROUP BY kategoria ORDER BY amount DESC
    `).bind(tenantId, from, to).all<{ category: string; amount: number }>();

    const categoryBreakdown: CategoryBreakdown[] = (breakdownResult.results ?? []).map((row) => ({
      category: row.category,
      amount: row.amount,
      pct: totalCosts > 0 ? Math.round((row.amount / totalCosts) * 1000) / 10 : 0,
      color: CATEGORY_COLORS[row.category] ?? CATEGORY_COLORS['Inne'],
    }));

    // Ostatnie koszty
    const recentResult = await db.prepare(`
      SELECT id, data AS date, kategoria AS category, kontrahent AS counterparty, kwota AS amount, status
      FROM koszty
      WHERE tenant_id = ? AND data BETWEEN ? AND ?
      ORDER BY data DESC, created_at DESC LIMIT 10
    `).bind(tenantId, from, to).all<RecentCost>();

    // Najdroższy dostawca
    const topSupplierResult = await db.prepare(`
      SELECT kontrahent AS counterparty, SUM(kwota) AS total
      FROM koszty
      WHERE tenant_id = ? AND data BETWEEN ? AND ? AND kategoria = 'Dostawcy' AND status != 'Anulowane'
      GROUP BY kontrahent ORDER BY total DESC LIMIT 1
    `).bind(tenantId, from, to).first<{ counterparty: string; total: number }>();

    const topSupplier = topSupplierResult
      ? `${topSupplierResult.counterparty} (${topSupplierResult.total.toLocaleString('pl-PL')} PLN)`
      : 'Brak danych';

    // Zysk brutto = przychody - koszty za ten sam okres
    const revenueResult = await db.prepare(`
      SELECT COALESCE(SUM(kwota), 0) AS revenue
      FROM transakcje_finansowe
      WHERE tenant_id = ? AND data BETWEEN ? AND ? AND kierunek = 'PRZYCHOD'
    `).bind(tenantId, from, to).first<{ revenue: number }>();

    const totalRevenue = revenueResult?.revenue ?? 0;
    const grossProfit = totalRevenue - totalCosts;
    const grossMarginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;

    return Response.json({
      kpi_cards: {
        total_costs: totalCosts,
        marketing: kpiResult?.marketing ?? 0,
        logistics: kpiResult?.logistics ?? 0,
        employees: kpiResult?.employees ?? 0,
        suppliers: kpiResult?.suppliers ?? 0,
        avg_daily_costs: Math.round(totalCosts / days),
      },
      costs_chart: { data: chartResult.results ?? [] },
      category_breakdown: categoryBreakdown,
      recent_costs: recentResult.results ?? [],
      profitability: {
        gross_profit: grossProfit,
        gross_margin_pct: grossMarginPct,
        top_expensive_supplier: topSupplier,
      },
      from,
      to,
    } satisfies CostsDashboardResponse);
  } catch (e) {
    console.error('/api/finanse/costs error:', e);
    return Response.json(buildDemoResponse(from, to));
  }
};
