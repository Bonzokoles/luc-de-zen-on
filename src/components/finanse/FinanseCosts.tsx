/**
 * FinanseCosts — Dashboard kosztów operacyjnych
 * Konsumuje: GET /api/finanse/costs
 */
import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';

interface KpiCards {
  total_costs: number;
  marketing: number;
  logistics: number;
  employees: number;
  suppliers: number;
  avg_daily_costs: number;
}

interface ChartPoint {
  date: string;
  total: number;
  marketing: number;
  logistics: number;
}

interface CategoryRow {
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

interface CostsDashboard {
  kpi_cards: KpiCards;
  costs_chart: { data: ChartPoint[] };
  category_breakdown: CategoryRow[];
  recent_costs: RecentCost[];
  profitability: { gross_profit: number; gross_margin_pct: number; top_expensive_supplier: string };
  from: string;
  to: string;
}

function fmt(n: number) {
  return n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Zapłacone', PENDING: 'Oczekujące', CANCELLED: 'Anulowane',
};

export default function FinanseCosts() {
  const today = new Date().toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const [data, setData]       = useState<CostsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [from, setFrom]       = useState(monthAgo);
  const [to, setTo]           = useState(today);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/finanse/costs?from=${from}&to=${to}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch {
      setError('Błąd pobierania kosztów');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const kpi = data?.kpi_cards;

  const kpiCards = [
    { label: 'Łączne koszty',    value: kpi?.total_costs ?? 0,    color: 'from-red-600 to-rose-600',       icon: '💸' },
    { label: 'Pracownicy',        value: kpi?.employees ?? 0,       color: 'from-purple-600 to-violet-600',  icon: '👥' },
    { label: 'Dostawcy',          value: kpi?.suppliers ?? 0,       color: 'from-blue-600 to-sky-600',       icon: '📦' },
    { label: 'Marketing',         value: kpi?.marketing ?? 0,       color: 'from-pink-600 to-fuchsia-600',   icon: '📣' },
    { label: 'Logistyka',         value: kpi?.logistics ?? 0,       color: 'from-amber-600 to-yellow-600',   icon: '🚚' },
    { label: 'Śr. dzienny koszt', value: kpi?.avg_daily_costs ?? 0, color: 'from-slate-600 to-slate-700',    icon: '📅' },
  ];

  return (
    <div className="space-y-6">
      {/* Filtry */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Od</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Do</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <button onClick={fetchData}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">
          Odśwież
        </button>
        {loading && <span className="text-xs text-slate-500 animate-pulse self-center">Ładowanie…</span>}
        {error && <span className="text-xs text-red-400 self-center">{error}</span>}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiCards.map(card => (
          <div key={card.label}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white`}>
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="text-lg font-bold font-mono">{fmt(card.value)}</div>
            <div className="text-xs opacity-80 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Wykres + breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Wykres dzienny */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Koszty w czasie</h3>
          {(data?.costs_chart?.data?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data!.costs_chart.data} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={((v: number) => `${fmt(v)} PLN`) as any}
                />
                <Bar dataKey="total"      fill="#ef4444" name="Razem" />
                <Bar dataKey="marketing"  fill="#ec4899" name="Marketing" />
                <Bar dataKey="logistics"  fill="#f59e0b" name="Logistyka" />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm py-10 text-center">Brak danych wykresu</p>
          )}
        </div>

        {/* Pie breakdown */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Podział per kategoria</h3>
          {(data?.category_breakdown?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data!.category_breakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data!.category_breakdown.map(row => (
                    <Cell key={row.category} fill={row.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  formatter={((v: number) => `${fmt(v)} PLN`) as any}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="space-y-2 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center text-sm text-slate-500">
                  <span>—</span><span>—</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ostatnie koszty */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 text-sm font-semibold text-slate-300">
          Ostatnie koszty
          {data?.profitability?.top_expensive_supplier && (
            <span className="ml-3 text-xs font-normal text-slate-500">
              Najdroższy dostawca: <span className="text-amber-400">{data.profitability.top_expensive_supplier}</span>
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-700/50">
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Kategoria</th>
                <th className="px-4 py-2 text-left">Kontrahent</th>
                <th className="px-4 py-2 text-right">Kwota</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_costs ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Brak danych</td>
                </tr>
              )}
              {(data?.recent_costs ?? []).map(c => (
                <tr key={c.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3 text-slate-300">{c.category}</td>
                  <td className="px-4 py-3 text-slate-400">{c.counterparty}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-red-400">
                    {fmt(c.amount)} PLN
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {STATUS_LABELS[c.status] ?? c.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
