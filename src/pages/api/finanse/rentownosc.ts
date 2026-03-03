import type { APIRoute } from 'astro';
import type { CloudflareEnv, RentownoscResponse } from '../../../types/finanse';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const url = new URL(request.url);
  const from = url.searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const to   = url.searchParams.get('to')   ?? new Date().toISOString().split('T')[0];
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  if (!env?.D1) {
    return Response.json(DEMO_RENTOWNOSC);
  }

  try {
    const db = env.D1;

    // Łączne przychody
    const overall = await db.prepare(`
      SELECT
        SUM(CASE WHEN kierunek='PRZYCHÓD' THEN kwota ELSE 0 END) as total_revenue,
        SUM(CASE WHEN kierunek='KOSZT'    THEN kwota ELSE 0 END) as total_costs
      FROM transakcje_finansowe
      WHERE tenant_id = ? AND data >= ? AND data <= ?
    `).bind(tenantId, from, to).first<{ total_revenue: number; total_costs: number }>();

    const total_revenue = overall?.total_revenue ?? 0;
    const total_costs   = overall?.total_costs   ?? 0;
    const gross_profit  = total_revenue - total_costs;
    const gross_margin_pct = total_revenue > 0
      ? Math.round((gross_profit / total_revenue) * 1000) / 10
      : 0;

    // Marże po kategoriach przychodów
    const byCategory = await db.prepare(`
      SELECT
        t.kategoria as category,
        SUM(CASE WHEN t.kierunek='PRZYCHÓD' THEN t.kwota ELSE 0 END) as revenue,
        COALESCE((
          SELECT SUM(k.kwota)
          FROM koszty k
          WHERE k.tenant_id = t.tenant_id
            AND k.data >= ? AND k.data <= ?
            AND k.kategoria LIKE '%' || t.kategoria || '%'
        ), 0) as costs,
        COUNT(CASE WHEN t.kierunek='PRZYCHÓD' THEN 1 END) as orders_count
      FROM transakcje_finansowe t
      WHERE t.tenant_id = ?
        AND t.data >= ? AND t.data <= ?
        AND t.kierunek = 'PRZYCHÓD'
      GROUP BY t.kategoria
      ORDER BY revenue DESC
    `).bind(from, to, tenantId, from, to).all<{
      category: string; revenue: number; costs: number; orders_count: number;
    }>();

    const bycat = (byCategory.results ?? []).map(r => {
      const profit = r.revenue - r.costs;
      const margin_pct = r.revenue > 0 ? Math.round((profit / r.revenue) * 1000) / 10 : 0;
      return {
        category: r.category,
        revenue: Math.round(r.revenue * 100) / 100,
        costs: Math.round(r.costs * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        margin_pct,
        orders_count: r.orders_count,
      };
    });

    const sorted = [...bycat].sort((a, b) => b.margin_pct - a.margin_pct);
    const top_margin = sorted[0] ?? { category: '-', margin_pct: 0, profit: 0 };
    const low_margin_alerts = bycat.filter(c => c.margin_pct < 35).map(c => ({
      category: c.category,
      margin_pct: c.margin_pct,
      revenue: c.revenue,
      costs: c.costs,
    }));

    const response: RentownoscResponse = {
      overall: {
        total_revenue: Math.round(total_revenue * 100) / 100,
        total_costs: Math.round(total_costs * 100) / 100,
        gross_profit: Math.round(gross_profit * 100) / 100,
        gross_margin_pct,
      },
      by_category: bycat,
      top_margin: {
        category: top_margin.category,
        margin_pct: top_margin.margin_pct,
        profit: top_margin.profit,
      },
      low_margin_alerts,
    };

    return Response.json(response);
  } catch (err) {
    console.error('[rentownosc]', err);
    return Response.json(DEMO_RENTOWNOSC);
  }
};

const DEMO_RENTOWNOSC: RentownoscResponse = {
  overall: { total_revenue: 0, total_costs: 0, gross_profit: 0, gross_margin_pct: 0 },
  by_category: [],
  top_margin: { category: '-', margin_pct: 0, profit: 0 },
  low_margin_alerts: [],
};
