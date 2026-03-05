/**
 * finanse-service.ts — współdzielona warstwa zapytań D1 dla modułu finansowego.
 * Eliminuje self-fetch anti-pattern (endpoint wywołujący sam siebie przez HTTP).
 * Importowany przez API endpoints i asystenta finansowego.
 */

export interface DashboardKPI {
  total_revenue: number;
  total_costs: number;
  net_profit: number;
  gross_margin_pct: number;
  total_orders: number;
}

export interface RentownoscSummary {
  top_margin: { category: string; margin_pct: number } | null;
  low_margin_alerts: Array<{ category: string; margin_pct: number }>;
}

export interface HighRiskDocument {
  numer: string;
  kontrahent: string;
  kwota_brutto: number;
  ryzyko_punktowe: number;
  poziom_ryzyka: string;
}

export interface CostsSummary {
  total_costs: number;
  marketing: number;
  employees: number;
  suppliers: number;
  top_expensive_supplier: string;
}

// D1 database interface (Cloudflare Workers compatible)
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}

/**
 * Pobiera KPI dashboardu bezpośrednio z D1
 */
export async function getDashboardKPI(
  db: D1Database,
  tenantId: string,
  from: string,
  to: string
): Promise<DashboardKPI> {
  const kpi = await db.prepare(`
    SELECT
      SUM(CASE WHEN kierunek='PRZYCHÓD' THEN kwota ELSE 0 END) as total_revenue,
      SUM(CASE WHEN kierunek='KOSZT' THEN kwota ELSE 0 END) as total_costs,
      COUNT(DISTINCT CASE WHEN kierunek='PRZYCHÓD' THEN id END) as total_orders
    FROM transakcje_finansowe
    WHERE tenant_id = ? AND data >= ? AND data <= ?
  `).bind(tenantId, from, to).first<{
    total_revenue: number; total_costs: number; total_orders: number;
  }>();

  const revenue = kpi?.total_revenue ?? 0;
  const costs = kpi?.total_costs ?? 0;
  const profit = revenue - costs;

  return {
    total_revenue: Math.round(revenue * 100) / 100,
    total_costs: Math.round(costs * 100) / 100,
    net_profit: Math.round(profit * 100) / 100,
    gross_margin_pct: revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0,
    total_orders: kpi?.total_orders ?? 0,
  };
}

/**
 * Pobiera podsumowanie rentowności bezpośrednio z D1
 */
export async function getRentownoscSummary(
  db: D1Database,
  tenantId: string,
  from: string,
  to: string
): Promise<RentownoscSummary> {
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
      ), 0) as costs
    FROM transakcje_finansowe t
    WHERE t.tenant_id = ? AND t.data >= ? AND t.data <= ? AND t.kierunek = 'PRZYCHÓD'
    GROUP BY t.kategoria ORDER BY revenue DESC
  `).bind(from, to, tenantId, from, to).all<{
    category: string; revenue: number; costs: number;
  }>();

  const items = (byCategory.results ?? []).map(r => {
    const margin = r.revenue > 0 ? Math.round(((r.revenue - r.costs) / r.revenue) * 1000) / 10 : 0;
    return { category: r.category, margin_pct: margin };
  });

  const sorted = [...items].sort((a, b) => b.margin_pct - a.margin_pct);

  return {
    top_margin: sorted[0] ?? null,
    low_margin_alerts: items.filter(c => c.margin_pct < 35),
  };
}

/**
 * Pobiera dokumenty wysokiego ryzyka bezpośrednio z D1
 */
export async function getHighRiskDocuments(
  db: D1Database,
  tenantId: string,
  limit = 5
): Promise<HighRiskDocument[]> {
  const result = await db.prepare(`
    SELECT numer, kontrahent, kwota_brutto, ryzyko_punktowe, poziom_ryzyka
    FROM dokumenty_finansowe
    WHERE tenant_id = ? AND poziom_ryzyka = 'Wysokie'
    ORDER BY ryzyko_punktowe DESC LIMIT ?
  `).bind(tenantId, limit).all<HighRiskDocument>();

  return result.results ?? [];
}

/**
 * Pobiera podsumowanie kosztów bezpośrednio z D1
 */
export async function getCostsSummary(
  db: D1Database,
  tenantId: string,
  from: string,
  to: string
): Promise<CostsSummary> {
  const kpi = await db.prepare(`
    SELECT
      SUM(kwota) AS total_costs,
      SUM(CASE WHEN kategoria = 'Marketing' THEN kwota ELSE 0 END) AS marketing,
      SUM(CASE WHEN kategoria = 'Pracownicy' THEN kwota ELSE 0 END) AS employees,
      SUM(CASE WHEN kategoria = 'Dostawcy' THEN kwota ELSE 0 END) AS suppliers
    FROM koszty
    WHERE tenant_id = ? AND data BETWEEN ? AND ? AND status != 'Anulowane'
  `).bind(tenantId, from, to).first<{
    total_costs: number; marketing: number; employees: number; suppliers: number;
  }>();

  const topSupplier = await db.prepare(`
    SELECT kontrahent, SUM(kwota) AS total
    FROM koszty
    WHERE tenant_id = ? AND data BETWEEN ? AND ? AND kategoria = 'Dostawcy' AND status != 'Anulowane'
    GROUP BY kontrahent ORDER BY total DESC LIMIT 1
  `).bind(tenantId, from, to).first<{ kontrahent: string; total: number }>();

  return {
    total_costs: kpi?.total_costs ?? 0,
    marketing: kpi?.marketing ?? 0,
    employees: kpi?.employees ?? 0,
    suppliers: kpi?.suppliers ?? 0,
    top_expensive_supplier: topSupplier
      ? `${topSupplier.kontrahent} (${topSupplier.total.toLocaleString('pl-PL')} PLN)`
      : 'Brak danych',
  };
}
