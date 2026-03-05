/**
 * FinanseImport — Trzy kafelki importu danych finansowych
 *
 * Kafelek 1: Import przychodów / kosztów (CSV transakcji)
 *   → POST /api/finanse/import-transakcji
 *
 * Kafelek 2: Import kosztów operacyjnych (CSV kosztów)
 *   → POST /api/finanse/import-kosztow
 *
 * Kafelek 3: Import faktur PDF (z auto-analizą AI Gemini)
 *   → POST /api/finanse/import-dokumentu (multipart/form-data)
 *
 * Sekcja 4: Historia importów (in-memory / sessionStorage)
 *
 * step_11, step_12, checklista pkt 19–21
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---- Typy ----
type ActiveTile = 'transakcje' | 'koszty' | 'pdf' | null;

interface ImportResult {
  imported?: number;
  errors?: number;
  error_details?: string[];
  message: string;
  analiza?: {
    ryzyko_punktowe?: number;
    poziom_ryzyka?: string;
    podsumowanie_ryzyka?: string;
  } | null;
}

interface HistoryEntry {
  id: string;
  typ: 'Transakcje CSV' | 'Koszty CSV' | 'Faktura PDF';
  plik: string;
  imported: number;
  errors: number;
  czas: string;
  status: 'success' | 'partial' | 'error';
}

// ---- Przykładowe CSV ----
const SAMPLE_CSV = `data;kwota;kierunek;kategoria;kontrahent;opis
2026-03-01;12500.00;PRZYCHÓD;Meble;IKEA Polska;Faktura VAT 2026/03/01
2026-03-02;3200.50;KOSZT;Logistyka;DHL;Transport towarów
2026-03-03;8900.00;PRZYCHÓD;Akcesoria;Castorama;Sprzedaż hurtowa
2026-03-04;1500.00;KOSZT;Marketing;Google Ads;Kampania marzec`;

const SAMPLE_KOSZTY = `data;kwota;kategoria;kontrahent;opis;status
2026-03-01;1500.00;Marketing;Meta Platforms Inc.;FB Ads marzec;Zapłacone
2026-03-02;2200.50;Logistyka;InPost;Paczki tydzień 1;Zapłacone
2026-03-03;4800.00;Pracownicy;ZUS;Składki marzec 2026;Zapłacone
2026-03-04;950.00;Administracja;Poczta Polska;Wysyłki dokumentów;Oczekujące`;

// ============================================================
// Pomocniczy hook do importu CSV
// ============================================================
function useCsvImport(endpoint: string) {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState('');
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const doImport = useCallback(async (): Promise<HistoryEntry | null> => {
    setLoading(true); setError(''); setResult(null);
    try {
      let res: Response;
      if (mode === 'upload' && file) {
        const fd = new FormData(); fd.append('plik', file);
        res = await fetch(endpoint, { method: 'POST', body: fd });
      } else if (mode === 'paste' && csvText.trim()) {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/csv' },
          body: csvText,
        });
      } else {
        setError('Wybierz plik lub wklej dane CSV'); setLoading(false); return null;
      }
      const data = await res.json() as ImportResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
      return {
        id: `hist_${Date.now()}`,
        typ: endpoint.includes('kosztow') ? 'Koszty CSV' : 'Transakcje CSV',
        plik: file?.name ?? 'wklejony CSV',
        imported: data.imported ?? 0,
        errors: data.errors ?? 0,
        czas: new Date().toLocaleTimeString('pl'),
        status: (data.errors ?? 0) > 0 ? 'partial' : 'success',
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Błąd importu';
      setError(msg); return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, file, csvText, mode]);

  return { file, setFile, csvText, setCsvText, mode, setMode, loading, result, error, fileRef, doImport };
}

// ============================================================
// KAFELEK 1 – Import transakcji CSV
// ============================================================
function TileTransakcje({ onHistory }: { onHistory: (e: HistoryEntry) => void }) {
  const { file, setFile, csvText, setCsvText, mode, setMode, loading, result, error, fileRef, doImport } =
    useCsvImport('/api/finanse/import-transakcji');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0]; if (f) setFile(f);
  };

  const run = async () => { const h = await doImport(); if (h) onHistory(h); };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Wgraj plik CSV z transakcjami (przychody i koszty). Separator: <code className="bg-slate-700 px-1 rounded">;</code>
      </p>
      <div className="flex gap-2">
        <button onClick={() => setMode('upload')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>📤 Plik</button>
        <button onClick={() => setMode('paste')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'paste' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>📋 Wklej</button>
        <button onClick={() => { setMode('paste'); setCsvText(SAMPLE_CSV); }} className="ml-auto px-3 py-1.5 rounded-lg text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">🧪 Przykład</button>
      </div>
      {mode === 'upload' ? (
        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-green-500 bg-green-900/10' : 'border-slate-600 hover:border-blue-500 hover:bg-blue-900/10'}`}>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} className="hidden" />
          <div className="text-3xl mb-2">{file ? '✅' : '📁'}</div>
          {file ? <p className="text-green-400 text-sm font-semibold">{file.name}</p>
                : <><p className="text-slate-300 text-sm font-semibold">Przeciągnij lub kliknij</p><p className="text-slate-500 text-xs mt-1">CSV, Excel, TXT</p></>}
        </div>
      ) : (
        <textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={8}
          placeholder={`Wklej CSV:\n${SAMPLE_CSV}`}
          className="w-full font-mono text-xs bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 resize-y outline-none focus:border-blue-500" />
      )}
      <div className="text-xs text-slate-500 bg-slate-800/50 rounded-lg p-3">
        <span className="font-bold text-slate-400">Wymagane:</span> data; kwota; kierunek (PRZYCHÓD/KOSZT/PRZENIESIENIE)<br/>
        <span className="font-bold text-slate-400">Opcjonalne:</span> kategoria; podkategoria; kontrahent; opis; status; waluta
      </div>
      <button onClick={run} disabled={loading || (mode === 'upload' && !file) || (mode === 'paste' && !csvText.trim())}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl text-white font-bold text-sm transition-all">
        {loading ? '⏳ Importuję...' : '📥 Importuj transakcje'}
      </button>
      <ImportResultBox result={result} error={error} />
    </div>
  );
}

// ============================================================
// KAFELEK 2 – Import kosztów CSV
// ============================================================
function TileKoszty({ onHistory }: { onHistory: (e: HistoryEntry) => void }) {
  const { file, setFile, csvText, setCsvText, mode, setMode, loading, result, error, fileRef, doImport } =
    useCsvImport('/api/finanse/import-kosztow');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0]; if (f) setFile(f);
  };

  const run = async () => { const h = await doImport(); if (h) onHistory(h); };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Importuj koszty operacyjne (marketing, logistyka, pracownicy). Separator: <code className="bg-slate-700 px-1 rounded">;</code>
      </p>
      <div className="flex gap-2">
        <button onClick={() => setMode('upload')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'upload' ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>📤 Plik</button>
        <button onClick={() => setMode('paste')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'paste' ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>📋 Wklej</button>
        <button onClick={() => { setMode('paste'); setCsvText(SAMPLE_KOSZTY); }} className="ml-auto px-3 py-1.5 rounded-lg text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">🧪 Przykład</button>
      </div>
      {mode === 'upload' ? (
        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-orange-500 bg-orange-900/10' : 'border-slate-600 hover:border-orange-500 hover:bg-orange-900/10'}`}>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} className="hidden" />
          <div className="text-3xl mb-2">{file ? '✅' : '📊'}</div>
          {file ? <p className="text-orange-400 text-sm font-semibold">{file.name}</p>
                : <><p className="text-slate-300 text-sm font-semibold">Przeciągnij lub kliknij</p><p className="text-slate-500 text-xs mt-1">CSV, Excel, TXT</p></>}
        </div>
      ) : (
        <textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={8}
          placeholder={`Wklej CSV:\n${SAMPLE_KOSZTY}`}
          className="w-full font-mono text-xs bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 resize-y outline-none focus:border-orange-500" />
      )}
      <div className="text-xs text-slate-500 bg-slate-800/50 rounded-lg p-3">
        <span className="font-bold text-slate-400">Wymagane:</span> data; kwota; kategoria<br/>
        <span className="font-bold text-slate-400">Kategorie:</span> Marketing | Logistyka | Pracownicy | Dostawcy | Administracja<br/>
        <span className="font-bold text-slate-400">Opcjonalne:</span> podkategoria; kontrahent; opis; status; waluta; typ; kwota_netto; vat
      </div>
      <button onClick={run} disabled={loading || (mode === 'upload' && !file) || (mode === 'paste' && !csvText.trim())}
        className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 rounded-xl text-white font-bold text-sm transition-all">
        {loading ? '⏳ Importuję...' : '📊 Importuj koszty'}
      </button>
      <ImportResultBox result={result} error={error} />
    </div>
  );
}

// ============================================================
// KAFELEK 3 – Import faktury PDF + AI
// ============================================================
function TilePDF({ onHistory }: { onHistory: (e: HistoryEntry) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    numer: '', kontrahent: '',
    data_wystawienia: new Date().toISOString().split('T')[0],
    kwota_brutto: '', termin_platnosci: '', typ: 'Faktura', opis: '',
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') setFile(f);
    else if (f) setError('Wybierz plik PDF');
  };

  const doImport = async () => {
    if (!form.numer || !form.kontrahent || !form.kwota_brutto) {
      setError('Wypełnij: numer faktury, kontrahent, kwota brutto'); return;
    }
    setLoading(true); setError(''); setResult(null);
    try {
      const fd = new FormData();
      if (file) fd.append('plik', file);
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });

      const res = await fetch('/api/finanse/import-dokumentu', { method: 'POST', body: fd });
      const data = await res.json() as ImportResult & { error?: string; id?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
      onHistory({
        id: `hist_${Date.now()}`,
        typ: 'Faktura PDF',
        plik: file?.name ?? form.numer,
        imported: 1, errors: 0,
        czas: new Date().toLocaleTimeString('pl'),
        status: 'success',
      });
      setFile(null);
      setForm({ numer: '', kontrahent: '', data_wystawienia: new Date().toISOString().split('T')[0], kwota_brutto: '', termin_platnosci: '', typ: 'Faktura', opis: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd importu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Dodaj fakturę PDF — plik zostanie zapisany w R2, AI (Gemini) automatycznie oceni ryzyko.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { key: 'numer',            label: 'Numer faktury *',     ph: 'FV/03/2026/0012',   type: 'text' },
          { key: 'kontrahent',       label: 'Kontrahent *',         ph: 'Nazwa firmy',        type: 'text' },
          { key: 'kwota_brutto',     label: 'Kwota brutto (PLN) *', ph: '1234.56',            type: 'number' },
          { key: 'data_wystawienia', label: 'Data wystawienia',     ph: '',                   type: 'date' },
          { key: 'termin_platnosci', label: 'Termin płatności',     ph: '',                   type: 'date' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}</label>
            <input type={f.type} value={(form as Record<string,string>)[f.key]} placeholder={f.ph}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full text-sm bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-purple-500" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Typ dokumentu</label>
          <select value={form.typ} onChange={e => setForm(p => ({ ...p, typ: e.target.value }))}
            className="w-full text-sm bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-purple-500">
            {['Faktura','Proforma','Umowa','Oferta','Zwrot','Nota','Inny'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Opis / notatka</label>
        <input value={form.opis} onChange={e => setForm(p => ({ ...p, opis: e.target.value }))} placeholder="Opcjonalny opis"
          className="w-full text-sm bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-purple-500" />
      </div>
      <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${file ? 'border-purple-500 bg-purple-900/10' : 'border-slate-600 hover:border-purple-500 hover:bg-purple-900/10'}`}>
        <input ref={fileRef} type="file" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} className="hidden" />
        <div className="text-3xl mb-2">{file ? '📄' : '🤖'}</div>
        {file ? <p className="text-purple-400 text-sm font-semibold">{file.name} ({(file.size/1024).toFixed(1)} KB)</p>
               : <><p className="text-slate-300 text-sm font-semibold">Przeciągnij PDF lub kliknij (opcjonalne)</p>
                  <p className="text-slate-500 text-xs mt-1">Plik zostanie zapisany w R2, AI przeanalizuje ryzyko</p></>}
      </div>
      <button onClick={doImport} disabled={loading}
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl text-white font-bold text-sm transition-all">
        {loading ? '🤖 Analizuję AI...' : '🤖 Importuj + Analiza AI'}
      </button>
      {error && <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-300 text-sm">❌ {error}</div>}
      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-900/20 border border-purple-700 rounded-xl p-4 space-y-2">
          <p className="font-bold text-green-400 text-sm">✅ {result.message}</p>
          {result.analiza && (
            <div className="bg-slate-800/60 rounded-lg p-3 text-xs space-y-1">
              <p className="font-semibold text-slate-300">Wynik analizy AI:</p>
              <p>Ryzyko: <span className={`font-bold ${{Niskie:'text-green-400',Średnie:'text-yellow-400',Wysokie:'text-red-400'}[result.analiza.poziom_ryzyka ?? ''] ?? 'text-slate-300'}`}>
                {result.analiza.poziom_ryzyka} ({result.analiza.ryzyko_punktowe}/100)
              </span></p>
              <p className="text-slate-400">{result.analiza.podsumowanie_ryzyka}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// Shared: Wynik importu CSV
// ============================================================
function ImportResultBox({ result, error }: { result: ImportResult | null; error: string }) {
  if (error) return <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-300 text-sm">❌ {error}</div>;
  if (!result) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`border rounded-xl p-4 ${(result.imported ?? 0) > 0 ? 'bg-green-900/20 border-green-700' : 'bg-yellow-900/20 border-yellow-700'}`}>
        <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">{(result.imported ?? 0) > 0 ? '✅' : '⚠️'} Wyniki importu</h4>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="text-center p-2 bg-green-900/30 rounded-lg">
            <p className="text-xl font-bold text-green-400">{result.imported ?? 0}</p>
            <p className="text-xs text-slate-400">zaimportowanych</p>
          </div>
          <div className="text-center p-2 bg-red-900/20 rounded-lg">
            <p className="text-xl font-bold text-red-400">{result.errors ?? 0}</p>
            <p className="text-xs text-slate-400">błędów</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">{result.message}</p>
        {(result.error_details ?? []).length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-red-400 cursor-pointer">{result.error_details!.length} błędów</summary>
            <ul className="mt-1 space-y-0.5">
              {result.error_details!.map((e, i) => <li key={i} className="text-xs text-red-300 bg-red-900/20 px-2 py-0.5 rounded">• {e}</li>)}
            </ul>
          </details>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// Historia importów
// ============================================================
function HistoriaImportow({ historia, onClear }: { historia: HistoryEntry[]; onClear: () => void }) {
  if (historia.length === 0) return (
    <div className="text-center text-slate-500 text-sm py-4">Brak historii importów w tej sesji</div>
  );
  return (
    <div className="space-y-2">
      {[...historia].reverse().map(h => (
        <div key={h.id} className="bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-4">
          <span className="text-lg">{h.typ === 'Faktura PDF' ? '📄' : h.typ === 'Koszty CSV' ? '📊' : '📥'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{h.plik}</p>
            <p className="text-xs text-slate-500">{h.typ} · {h.czas}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-green-400">{h.imported} wpisów</p>
            {h.errors > 0 && <p className="text-xs text-red-400">{h.errors} błędów</p>}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${h.status === 'success' ? 'bg-green-900/40 text-green-400' : h.status === 'partial' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-red-900/40 text-red-400'}`}>
            {h.status === 'success' ? 'OK' : h.status === 'partial' ? 'Częściowy' : 'Błąd'}
          </span>
        </div>
      ))}
      <button onClick={onClear} className="text-xs text-slate-500 hover:text-red-400 transition-colors mt-1">🗑 Wyczyść historię</button>
    </div>
  );
}

// ============================================================
// GŁÓWNY KOMPONENT
// ============================================================
const TILES: { id: ActiveTile; label: string; icon: string; color: string; desc: string }[] = [
  { id: 'transakcje', label: 'Transakcje CSV',   icon: '📥', color: 'blue',   desc: 'Importuj przychody i koszty z CSV' },
  { id: 'koszty',     label: 'Koszty CSV',       icon: '📊', color: 'orange', desc: 'Importuj koszty operacyjne z CSV' },
  { id: 'pdf',        label: 'Faktury PDF + AI', icon: '🤖', color: 'purple', desc: 'Dodaj fakturę PDF z analizą AI' },
];

const COLOR_ACTIVE: Record<string, string> = {
  blue:   'border-blue-500 bg-blue-600 text-white',
  orange: 'border-orange-500 bg-orange-600 text-white',
  purple: 'border-purple-500 bg-purple-600 text-white',
};
const COLOR_INACTIVE = 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50';

export default function FinanseImport() {
  const [active, setActive] = useState<ActiveTile>(null);
  const [historia, setHistoria] = useState<HistoryEntry[]>([]);

  const addHistory = (e: HistoryEntry) => setHistoria(prev => [...prev, e]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <span>📥</span> Import Danych Finansowych
        </h2>
        <p className="text-slate-400 text-sm">
          Wybierz rodzaj importu — transakcje, koszty lub faktury PDF z automatyczną analizą AI.
        </p>
      </div>

      {/* Kafelki wyboru */}
      <div className="grid sm:grid-cols-3 gap-4">
        {TILES.map(tile => (
          <button key={tile.id} onClick={() => setActive(active === tile.id ? null : tile.id)}
            className={`border rounded-xl p-5 text-left transition-all duration-200 ${active === tile.id ? COLOR_ACTIVE[tile.color] : COLOR_INACTIVE}`}>
            <div className="text-3xl mb-2">{tile.icon}</div>
            <p className="font-bold text-sm">{tile.label}</p>
            <p className={`text-xs mt-1 ${active === tile.id ? 'text-white/80' : 'text-slate-500'}`}>{tile.desc}</p>
          </button>
        ))}
      </div>

      {/* Panel aktywnego kafelka */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {TILES.find(t => t.id === active)?.icon} {TILES.find(t => t.id === active)?.label}
              </h3>
              <button onClick={() => setActive(null)} className="text-slate-500 hover:text-slate-300 text-sm">✕ Zamknij</button>
            </div>
            {active === 'transakcje' && <TileTransakcje onHistory={addHistory} />}
            {active === 'koszty'     && <TileKoszty     onHistory={addHistory} />}
            {active === 'pdf'        && <TilePDF        onHistory={addHistory} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historia importów */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-300 flex items-center gap-2">
            🕓 Historia importów <span className="bg-slate-700 text-xs px-2 py-0.5 rounded-full">{historia.length}</span>
          </h3>
        </div>
        <HistoriaImportow historia={historia} onClear={() => setHistoria([])} />
      </div>
    </div>
  );
}


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError('');
    }
  };

  const doImport = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let res: Response;

      if (mode === 'upload' && file) {
        const fd = new FormData();
        fd.append('plik', file);
        res = await fetch('/api/finanse/import-transakcji', { method: 'POST', body: fd });
      } else if (mode === 'paste' && csvText.trim()) {
        res = await fetch('/api/finanse/import-transakcji', {
          method: 'POST',
          headers: { 'Content-Type': 'text/csv' },
          body: csvText,
        });
      } else {
        setError('Wybierz plik lub wklej dane CSV');
        setLoading(false);
        return;
      }

      const data = await res.json() as ImportResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd importu');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setMode('paste');
    setCsvText(SAMPLE_CSV);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span>📥</span> Import Transakcji
        </h2>
        <p className="text-slate-400 text-sm">
          Wgraj plik CSV lub Excel z historią transakcji. Separator kolumn: średnik <code className="bg-slate-700 px-1 rounded">;</code>
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          📤 Wgraj plik
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          📋 Wklej CSV
        </button>
        <button
          onClick={loadSample}
          className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 transition-colors"
        >
          🧪 Załaduj przykład
        </button>
      </div>

      {/* Upload zone */}
      <AnimatePresence mode="wait">
        {mode === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                file ? 'border-green-500 bg-green-900/10' : 'border-slate-600 hover:border-blue-500 hover:bg-blue-900/10'
              }`}
            >
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleFileChange} className="hidden" />
              <div className="text-4xl mb-3">{file ? '✅' : '📁'}</div>
              {file ? (
                <>
                  <p className="font-semibold text-green-400">{file.name}</p>
                  <p className="text-sm text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-300">Przeciągnij plik lub kliknij</p>
                  <p className="text-sm text-slate-500 mt-1">CSV, Excel (.xlsx / .xls), TXT</p>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-3"
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300">Zawartość CSV (separator: <code className="bg-slate-700 px-1 rounded">;</code>)</label>
              <span className="text-xs text-slate-500">{csvText.split('\n').length} linii</span>
            </div>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              rows={10}
              placeholder={`Wklej dane CSV, np.:\n${SAMPLE_CSV}`}
              className="w-full font-mono text-xs bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 resize-y outline-none focus:border-blue-500 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Format guide */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
        <h4 className="font-semibold mb-3 text-slate-300 text-sm">📋 Wymagany format CSV</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">WYMAGANE kolumny:</p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li><code className="text-blue-400">data</code> — YYYY-MM-DD</li>
              <li><code className="text-blue-400">kwota</code> — liczba (np. 1234.56)</li>
              <li><code className="text-blue-400">kierunek</code> — PRZYCHÓD | KOSZT | PRZENIESIENIE</li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">OPCJONALNE kolumny:</p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li><code className="text-slate-400">kategoria</code>, <code className="text-slate-400">podkategoria</code></li>
              <li><code className="text-slate-400">kontrahent</code>, <code className="text-slate-400">opis</code></li>
              <li><code className="text-slate-400">status</code>, <code className="text-slate-400">waluta</code>, <code className="text-slate-400">sposob_platnosci</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={doImport}
        disabled={loading || (mode === 'upload' && !file) || (mode === 'paste' && !csvText.trim())}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 rounded-xl text-white font-bold text-sm transition-all"
      >
        {loading ? '⏳ Importuję...' : '📥 Importuj transakcje'}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-300 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border rounded-xl p-5 ${
              result.imported > 0 ? 'bg-green-900/20 border-green-700' : 'bg-yellow-900/20 border-yellow-700'
            }`}
          >
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              {result.imported > 0 ? '✅' : '⚠️'} Wyniki importu
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-900/30 rounded-lg">
                <p className="text-2xl font-bold text-green-400">{result.imported}</p>
                <p className="text-xs text-slate-400">zaimportowanych</p>
              </div>
              <div className="text-center p-3 bg-yellow-900/30 rounded-lg">
                <p className="text-2xl font-bold text-yellow-400">{result.skipped}</p>
                <p className="text-xs text-slate-400">pominiętych</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">{result.message}</p>
            {result.errors.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs text-red-400 cursor-pointer hover:text-red-300">
                  {result.errors.length} błędów — kliknij aby zobaczyć
                </summary>
                <ul className="mt-2 space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-300 bg-red-900/20 px-2 py-1 rounded">• {e}</li>
                  ))}
                </ul>
              </details>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
