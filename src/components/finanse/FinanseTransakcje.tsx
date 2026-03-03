/**
 * FinanseTransakcje — Lista transakcji z filtrami
 * Konsumuje: GET /api/finanse/transactions
 */
import { useState, useEffect, useCallback } from 'react';
import type { TransakcjaFinansowa, KierunekTransakcji } from '../../types/finanse';

interface ApiResponse {
  items: TransakcjaFinansowa[];
  total: number;
  from: string;
  to: string;
  limit: number;
  offset: number;
}

const DIRECTION_COLORS: Record<string, string> = {
  'PRZYCHÓD':     'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'KOSZT':        'bg-red-500/20 text-red-300 border border-red-500/30',
  'PRZENIESIENIE':'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  'Zaksięgowano': 'text-emerald-400',
  'Oczekujące':   'text-yellow-400',
  'Planowane':    'text-sky-400',
  'Anulowane':    'text-slate-500 line-through',
};

function fmt(n: number) {
  return n.toLocaleString('pl-PL', { minimumFractionDigits: 2 });
}

export default function FinanseTransakcje() {
  const today = new Date().toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const [items, setItems]           = useState<TransakcjaFinansowa[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [from, setFrom]             = useState(monthAgo);
  const [to, setTo]                 = useState(today);
  const [direction, setDirection]   = useState<KierunekTransakcji | ''>('');
  const [search, setSearch]         = useState('');
  const [offset, setOffset]         = useState(0);
  const LIMIT = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ from, to, limit: String(LIMIT), offset: String(offset) });
      if (direction) params.set('direction', direction);
      const res = await fetch(`/api/finanse/transactions?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError('Błąd pobierania transakcji');
    } finally {
      setLoading(false);
    }
  }, [from, to, direction, offset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = search.trim()
    ? items.filter(i =>
        (i.kontrahent ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (i.kategoria ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (i.opis ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <div className="space-y-4">
      {/* Filtry */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Od</label>
            <input
              type="date" value={from}
              onChange={e => { setFrom(e.target.value); setOffset(0); }}
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Do</label>
            <input
              type="date" value={to}
              onChange={e => { setTo(e.target.value); setOffset(0); }}
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Kierunek</label>
            <select
              value={direction}
              onChange={e => { setDirection(e.target.value as KierunekTransakcji | ''); setOffset(0); }}
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Wszystkie</option>
              <option value="PRZYCHÓD">Przychody</option>
              <option value="KOSZT">Koszty</option>
              <option value="PRZENIESIENIE">Przeniesienia</option>
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-slate-400 mb-1">Szukaj</label>
            <input
              type="text" value={search} placeholder="Kontrahent, kategoria…"
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
            />
          </div>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Odśwież
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <span className="text-sm text-slate-300 font-medium">
            Transakcje <span className="text-slate-500">({total} łącznie)</span>
          </span>
          {loading && <span className="text-xs text-slate-500 animate-pulse">Ładowanie…</span>}
        </div>

        {error && (
          <div className="p-4 text-sm text-red-400">{error}</div>
        )}

        {!error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-slate-700/50">
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Kierunek</th>
                  <th className="px-4 py-2 text-left">Kategoria</th>
                  <th className="px-4 py-2 text-left">Kontrahent</th>
                  <th className="px-4 py-2 text-right">Kwota</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Brak transakcji w wybranym zakresie
                    </td>
                  </tr>
                )}
                {filtered.map(txn => (
                  <tr key={txn.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{txn.data}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIRECTION_COLORS[txn.kierunek] ?? ''}`}>
                        {txn.kierunek}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{txn.kategoria}</td>
                    <td className="px-4 py-3 text-slate-400">{txn.kontrahent ?? '—'}</td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${
                      txn.kierunek === 'PRZYCHÓD' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {txn.kierunek === 'PRZYCHÓD' ? '+' : '−'}{fmt(txn.kwota)} {txn.waluta}
                    </td>
                    <td className={`px-4 py-3 text-xs ${STATUS_COLORS[txn.status] ?? 'text-slate-400'}`}>
                      {txn.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700 text-sm text-slate-400">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
              className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Poprzednia
            </button>
            <span>Strona {currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setOffset(offset + LIMIT)}
              className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Następna →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
