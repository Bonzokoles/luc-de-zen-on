import type { APIRoute } from 'astro';
import type { CloudflareEnv, FinanceDashboardResponse } from '../../../types/finanse';

const CATEGORY_COLORS: Record<string, string> = {
  'Sprzedaż': '#10B981',
  'Marketing': '#3B82F6',
  'Logistyka': '#EF4444',
  'Dostawcy': '#F59E0B',
  'Pracownicy': '#8B5CF6',
  'Administracja': '#6366F1',
};

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;

  const url = new URL(request.url);
  const from = url.searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const to   = url.searchParams.get('to')   ?? new Date().toISOString().split('T')[0];
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  // Fallback z danymi demo gdy brak D1
  if (!env?.D1) {
    return Response.json(buildDemoResponse(from, to));
  }

  try {
    const db = env.D1;

    // KPI cards — przychody + koszty
    const kpi = await db.prepare(`
      SELECT
        SUM(CASE WHEN kierunek='PRZYCHÓD' THEN kwota ELSE 0 END) as total_revenue,
        SUM(CASE WHEN kierunek='KOSZT'    THEN kwota ELSE 0 END) as total_costs,
        COUNT(DISTINCT CASE WHEN kierunek='PRZYCHÓD' THEN id END) as total_orders
      FROM transakcje_finansowe
      WHERE tenant_id = ? AND data >= ? AND data <= ?
    `).bind(tenantId, from, to).first<{
      total_revenue: number; total_costs: number; total_orders: number;
    }>();

    const total_revenue = kpi?.total_revenue ?? 0;
    const total_costs   = kpi?.total_costs   ?? 0;
    const total_orders  = kpi?.total_orders  ?? 0;
    const net_profit    = total_revenue - total_costs;
    const gross_margin_pct = total_revenue > 0 ? Math.round((net_profit / total_revenue) * 1000) / 10 : 0;
    const avg_order_value  = total_orders > 0 ? Math.round((total_revenue / total_orders) * 100) / 100 : 0;

    // Cashflow timeseries (dzień po dniu)
    const timeseries = await db.prepare(`
      SELECT
        data as date,
        SUM(CASE WHEN kierunek='PRZYCHÓD' THEN kwota ELSE 0 END) as revenue,
        SUM(CASE WHEN kierunek='KOSZT'    THEN kwota ELSE 0 END) as expense,
        COUNT(CASE WHEN kierunek='PRZYCHÓD' THEN 1 END) as orders
      FROM transakcje_finansowe
      WHERE tenant_id = ? AND data >= ? AND data <= ?
      GROUP BY data ORDER BY data ASC
    `).bind(tenantId, from, to).all<{ date: string; revenue: number; expense: number; orders: number }>();

    // Kumulacyjny profit do wykresu
    let runningProfit = 0;
    const cashflowData = (timeseries.results ?? []).map(row => {
      runningProfit += (row.revenue - row.expense);
      return {
        date: row.date,
        orders: row.orders,
        revenue: Math.round(row.revenue * 100) / 100,
        profit: Math.round(runningProfit * 100) / 100,
      };
    });

    // Kategorie — pie chart
    const byCat = await db.prepare(`
      SELECT kategoria, kierunek, SUM(kwota) as amount
      FROM transakcje_finansowe
      WHERE tenant_id = ? AND data >= ? AND data <= ? AND kierunek = 'PRZYCHÓD'
      GROUP BY kategoria ORDER BY amount DESC LIMIT 6
    `).bind(tenantId, from, to).all<{ kategoria: string; kierunek: string; amount: number }>();

    const totalForPie = (byCat.results ?? []).reduce((s, r) => s + r.amount, 0);
    const categoryPie = (byCat.results ?? []).map(r => ({
      category: r.kategoria,
      revenue: Math.round(r.amount * 100) / 100,
      pct: totalForPie > 0 ? `${Math.round((r.amount / totalForPie) * 1000) / 10}%` : '0%',
      color: CATEGORY_COLORS[r.kategoria] ?? '#94A3B8',
    }));

    // Ostatnie transakcje
    const recent = await db.prepare(`
      SELECT * FROM transakcje_finansowe
      WHERE tenant_id = ?
      ORDER BY created_at DESC LIMIT 10
    `).bind(tenantId).all();

    const response: FinanceDashboardResponse = {
      kpi_cards: {
        total_orders,
        total_revenue: Math.round(total_revenue * 100) / 100,
        total_costs: Math.round(total_costs * 100) / 100,
        net_profit: Math.round(net_profit * 100) / 100,
        avg_order_value,
        gross_margin_pct,
      },
      cashflow_chart: { data: cashflowData },
      category_pie: categoryPie,
      recent_transactions: recent.results as never,
      ai_insight: {
        summary: `Zakres ${from}–${to}: przychody ${total_revenue.toLocaleString('pl-PL')} PLN, koszty ${total_costs.toLocaleString('pl-PL')} PLN, marża ${gross_margin_pct}%.`,
        action_items: gross_margin_pct < 35 ? ['⚠️ Marża poniżej 35% — przejrzyj koszty'] : ['✅ Marża w normie'],
      },
    };

    return Response.json(response);
  } catch (err) {
    console.error('[finanse/dashboard]', err);
    return Response.json(buildDemoResponse(from, to));
  }
};

// ---- Dane demo gdy brak D1 ----
function buildDemoResponse(from: string, to: string): FinanceDashboardResponse {
  return {
    kpi_cards: {
      total_orders: 0,
      total_revenue: 0,
      total_costs: 0,
      net_profit: 0,
      avg_order_value: 0,
      gross_margin_pct: 0,
    },
    cashflow_chart: { data: [] },
    category_pie: [],
    recent_transactions: [],
    ai_insight: {
      summary: `Brak danych za ${from}–${to}. Zaimportuj transakcje aby zobaczyć dashboard.`,
      action_items: ['Przejdź do importu CSV lub dodaj transakcję ręcznie'],
    },
  };
}
