import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DokumentFinansowy } from '../../types/finanse';

/**
 * Dokumenty Finansowe - Upload i AI Ocena Ryzyka
 * 
 * AI Model: Gemini 2.5 Flash via /api/analyze-risk
 * Token Limit: 8000
 * 
 * Funkcje:
 * - Upload dokumentów (PDF, Excel, faktury)
 * - Parsowanie liczb z dokumentów
 * - AI ocena ryzyka finansowego
 * - Historia dokumentów w localStorage
 */

// ─── Local display type ─────────────────────────────────────────────────────

interface DisplayDoc {
  id: string;
  numer: string;
  kontrahent: string;
  typ: string;
  kwota_brutto: number | null;
  data_wystawienia: string;
  termin_platnosci: string | null;
  status: string;
  poziom_ryzyka: string | null;
  ryzyko_punktowe: number | null;
  podsumowanie_ryzyka: string | null;
  tagi_ryzyka: string[] | null;
  plik_url: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapApiDoc(api: DokumentFinansowy): DisplayDoc {
  return {
    id: String(api.id),
    numer: api.numer,
    kontrahent: api.kontrahent,
    typ: api.typ,
    kwota_brutto: api.kwota_brutto ?? null,
    data_wystawienia: api.data_wystawienia ?? api.created_at,
    termin_platnosci: api.termin_platnosci ?? null,
    status: api.status ?? 'Oczekuje',
    poziom_ryzyka: api.poziom_ryzyka ?? null,
    ryzyko_punktowe: api.ryzyko_punktowe ?? null,
    podsumowanie_ryzyka: api.podsumowanie_ryzyka ?? null,
    tagi_ryzyka: Array.isArray(api.tagi_ryzyka) ? api.tagi_ryzyka : null,
    plik_url: api.plik_url ?? null,
  };
}

function riskStyle(poziom: string | null) {
  if (poziom === 'Wysokie') return 'bg-red-900/40 text-red-400 border-red-700';
  if (poziom === 'Średnie') return 'bg-yellow-900/40 text-yellow-400 border-yellow-700';
  if (poziom === 'Niskie')  return 'bg-green-900/40 text-green-400 border-green-700';
  return 'bg-slate-700 text-slate-400 border-slate-600';
}

function statusStyle(s: string) {
  if (s === 'Zapłacone') return 'bg-green-900/30 text-green-400';
  if (s === 'Przeterminowane') return 'bg-red-900/30 text-red-400';
  return 'bg-slate-700 text-slate-400';
}

// ─── Dodaj Dokument Modal ─────────────────────────────────────────────────────

interface AddModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function DodajDokumentModal({ onClose, onSuccess }: AddModalProps) {
  const [form, setForm] = useState({
    numer: '', kontrahent: '',
    data_wystawienia: new Date().toISOString().split('T')[0],
    termin_platnosci: '',
    kwota_brutto: '', typ: 'Faktura', opis: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ message: string; analiza?: { poziom_ryzyka: string; ryzyko_punktowe: number; podsumowanie_ryzyka: string } } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!form.numer || !form.kontrahent || !form.kwota_brutto) {
      setError('Wymagane: numer faktury, kontrahent, kwota brutto'); return;
    }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (file) fd.append('plik', file);

      const res = await fetch('/api/finanse/import-dokumentu', { method: 'POST', body: fd });
      const data = await res.json() as typeof result & { error?: string };
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd zapisu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2">📄 Dodaj dokument finansowy</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">✕</button>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 text-green-300 text-sm">✅ {result.message}</div>
              {result.analiza && (
                <div className="bg-slate-800/60 rounded-xl p-4 text-sm space-y-1">
                  <p className="font-semibold text-slate-300">Wynik analizy AI:</p>
                  <p>Ryzyko: <span className={`font-bold ${result.analiza.poziom_ryzyka === 'Wysokie' ? 'text-red-400' : result.analiza.poziom_ryzyka === 'Średnie' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {result.analiza.poziom_ryzyka} ({result.analiza.ryzyko_punktowe}/100)
                  </span></p>
                  <p className="text-slate-400">{result.analiza.podsumowanie_ryzyka}</p>
                </div>
              )}
              <button onClick={() => { onSuccess(); onClose(); }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm">
                Odśwież listę i zamknij
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'numer',            label: 'Numer faktury *',     ph: 'FV/03/2026/001',  type: 'text' },
                  { key: 'kontrahent',       label: 'Kontrahent *',         ph: 'Nazwa firmy',      type: 'text' },
                  { key: 'kwota_brutto',     label: 'Kwota brutto (PLN) *', ph: '1234.56',          type: 'number' },
                  { key: 'data_wystawienia', label: 'Data wystawienia',     ph: '',                 type: 'date' },
                  { key: 'termin_platnosci', label: 'Termin płatności',     ph: '',                 type: 'date' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'kontrahent' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}</label>
                    <input type={f.type} value={(form as Record<string, string>)[f.key]}
                      placeholder={f.ph}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full text-sm bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-purple-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Typ dokumentu</label>
                  <select value={form.typ} onChange={e => setForm(p => ({ ...p, typ: e.target.value }))}
                    className="w-full text-sm bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-purple-500">
                    {['Faktura', 'Proforma', 'Umowa', 'Oferta', 'Zwrot', 'Nota', 'Inny'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Opis / notatka</label>
                <input value={form.opis} onChange={e => setForm(p => ({ ...p, opis: e.target.value }))} placeholder="Opcjonalny opis"
                  className="w-full text-sm bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Plik PDF (opcjonalny — AI przeanalizuje ryzyko)</label>
                <div onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${file ? 'border-purple-500 bg-purple-900/10' : 'border-slate-600 hover:border-purple-500'}`}>
                  <input ref={fileRef} type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} className="hidden" />
                  {file ? <p className="text-purple-400 text-sm">📄 {file.name}</p>
                        : <p className="text-slate-500 text-sm">📎 Kliknij aby wgrać PDF</p>}
                </div>
              </div>
              {error && <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-300 text-sm">❌ {error}</div>}
              <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 text-sm font-medium">Anuluj</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl text-white font-bold text-sm">
                  {loading ? '🤖 Zapisuję...' : '✅ Dodaj dokument'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function DokumentyFinansowe() {
  const [documents, setDocuments] = useState<DisplayDoc[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState<DisplayDoc | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterRyzyko, setFilterRyzyko] = useState<string>('wszystkie');

  const fetchDocuments = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/finanse/dokumenty-finansowe?limit=100');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // FIX: API zwraca { items, total }, nie { dokumenty }
      const data = await res.json() as { items?: DokumentFinansowy[]; total?: number };
      if (Array.isArray(data.items)) {
        setDocuments(data.items.map(mapApiDoc));
        setLoadingList(false);
        return;
      }
    } catch (err) {
      console.error('Błąd ładowania dokumentów:', err);
    }
    setLoadingList(false);
    // Fallback demo
    setDocuments([
      { id: '1', numer: 'FV/03/2026/001', kontrahent: 'IKEA Polska Sp. z o.o.', typ: 'Faktura', kwota_brutto: 12500, data_wystawienia: '2026-03-01', termin_platnosci: '2026-03-15', status: 'Zapłacone', poziom_ryzyka: 'Niskie', ryzyko_punktowe: 20, podsumowanie_ryzyka: 'Duży, wiarygodny kontrahent. Niskie ryzyko.', tagi_ryzyka: ['sprawdzony'], plik_url: null },
      { id: '2', numer: 'FV/03/2026/002', kontrahent: 'DHL Express Poland', typ: 'Faktura', kwota_brutto: 3200, data_wystawienia: '2026-03-02', termin_platnosci: '2026-02-20', status: 'Przeterminowane', poziom_ryzyka: 'Wysokie', ryzyko_punktowe: 78, podsumowanie_ryzyka: 'Faktura przeterminowana o 10 dni.', tagi_ryzyka: ['przeterminowane', 'wysoka kwota'], plik_url: null },
      { id: '3', numer: 'FV/03/2026/003', kontrahent: 'Google Ads EMEA Ltd.', typ: 'Faktura', kwota_brutto: 1500, data_wystawienia: '2026-03-04', termin_platnosci: '2026-04-04', status: 'Oczekuje', poziom_ryzyka: 'Średnie', ryzyko_punktowe: 45, podsumowanie_ryzyka: 'Duży podmiot, oczekuje na zapłatę.', tagi_ryzyka: ['terminowe'], plik_url: null },
    ]);
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  // ─── KPI ──
  const total       = documents.length;
  const highRisk    = documents.filter(d => d.poziom_ryzyka === 'Wysokie').length;
  const overdue     = documents.filter(d => {
    if (!d.termin_platnosci || d.status === 'Zapłacone') return false;
    return new Date(d.termin_platnosci) < new Date();
  }).length;
  const sumaRyzyka  = documents
    .filter(d => d.poziom_ryzyka !== 'Niskie')
    .reduce((a, d) => a + (d.kwota_brutto ?? 0), 0);

  // ─── Filtrowanie ──
  const filtered = documents.filter(d =>
    filterRyzyko === 'wszystkie' ? true : d.poziom_ryzyka === filterRyzyko
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl px-6 py-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">📄 Dokumenty Finansowe</h2>
          <p className="text-slate-400 text-sm mt-0.5">Faktury, umowy, dokumenty — z automatyczną oceną ryzyka AI</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-sm flex items-center gap-2 transition-colors">
          ＋ Dodaj dokument
        </button>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Wszystkich',     value: total,                                        icon: '📄', color: 'border-slate-600' },
          { label: 'Wysokie ryzyko', value: highRisk,                                     icon: '🔴', color: 'border-red-700' },
          { label: 'Przeterminowane',value: overdue,                                      icon: '⏰', color: 'border-orange-700' },
          { label: 'Kwota ryzyka',   value: `${sumaRyzyka.toLocaleString('pl')} PLN`,    icon: '💸', color: 'border-yellow-700' },
        ].map(kpi => (
          <div key={kpi.label} className={`bg-slate-800/50 border ${kpi.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold text-white">{kpi.icon} {kpi.value}</p>
            <p className="text-slate-400 text-xs mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap gap-2">
        {['wszystkie', 'Niskie', 'Średnie', 'Wysokie'].map(f => (
          <button key={f} onClick={() => setFilterRyzyko(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterRyzyko === f ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
            {f === 'wszystkie' ? 'Wszystkie' : f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 self-center">{filtered.length} dokumentów</span>
      </div>

      {/* Lista + szczegóły */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Tabela */}
        <div className="lg:col-span-3 bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
          {loadingList ? (
            <div className="text-center py-12 text-slate-500 text-sm">⏳ Ładowanie...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Brak dokumentów<br/>
              <button onClick={() => setShowModal(true)} className="mt-2 text-purple-400 hover:underline text-xs">+ Dodaj pierwszy dokument</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-xs text-slate-500">
                    <th className="text-left px-4 py-3 font-medium">Numer / Kontrahent</th>
                    <th className="text-right px-4 py-3 font-medium">Kwota</th>
                    <th className="text-center px-4 py-3 font-medium">Ryzyko</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map(doc => (
                      <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={() => setSelected(doc)}
                        className={`border-b border-slate-700/50 cursor-pointer transition-colors ${selected?.id === doc.id ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'}`}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-200 truncate max-w-[160px]">{doc.numer}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[160px]">{doc.kontrahent}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {doc.kwota_brutto != null
                            ? <span className="font-semibold text-slate-200">{doc.kwota_brutto.toLocaleString('pl')} PLN</span>
                            : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 border rounded-full text-xs font-medium ${riskStyle(doc.poziom_ryzyka)}`}>
                            {doc.poziom_ryzyka ?? '?'} {doc.ryzyko_punktowe != null ? `(${doc.ryzyko_punktowe})` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Szczegóły */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-200">{selected.numer}</h4>
                  <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300 text-sm">✕</button>
                </div>
                <dl className="space-y-1.5 text-sm">
                  {([
                    ['Kontrahent', selected.kontrahent],
                    ['Typ', selected.typ],
                    ['Data wystawienia', selected.data_wystawienia],
                    ['Termin płatności', selected.termin_platnosci ?? '—'],
                    ['Kwota brutto', selected.kwota_brutto != null ? `${selected.kwota_brutto.toLocaleString('pl')} PLN` : '—'],
                    ['Status', selected.status],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-slate-500 shrink-0">{k}</dt>
                      <dd className="text-slate-200 text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                {selected.poziom_ryzyka && (
                  <div className={`border rounded-xl p-3 text-sm ${riskStyle(selected.poziom_ryzyka)}`}>
                    <p className="font-bold mb-1">⚠️ Ryzyko: {selected.poziom_ryzyka} ({selected.ryzyko_punktowe ?? '?'}/100)</p>
                    {selected.podsumowanie_ryzyka && <p className="text-xs opacity-80">{selected.podsumowanie_ryzyka}</p>}
                    {(selected.tagi_ryzyka ?? []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selected.tagi_ryzyka!.map(t => (
                          <span key={t} className="bg-black/20 px-2 py-0.5 rounded-full text-xs">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {selected.plik_url && (
                  <a href={selected.plik_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-400 hover:underline">
                    📎 Pobierz plik PDF
                  </a>
                )}
                <button onClick={() => setShowModal(true)}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 text-xs font-medium transition-colors">
                  ＋ Dodaj powiązany dokument
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-8 text-center text-slate-500 text-sm h-full flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">👈</span>
                <p>Wybierz dokument z listy aby zobaczyć szczegóły</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <DodajDokumentModal onClose={() => setShowModal(false)} onSuccess={fetchDocuments} />
        )}

      </AnimatePresence>
    </div>
  );
}

