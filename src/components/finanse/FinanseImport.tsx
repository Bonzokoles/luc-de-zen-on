/**
 * FinanseImport — Upload i import transakcji z CSV / Excel
 * Endpoint: POST /api/finanse/import-transakcji
 *
 * Format CSV (separator ;):
 * data;kwota;kierunek;kategoria;podkategoria;kontrahent;opis;status;waluta;sposob_platnosci
 *
 * Kierunek: PRZYCHÓD | KOSZT | PRZENIESIENIE
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
  message: string;
}

const SAMPLE_CSV = `data;kwota;kierunek;kategoria;kontrahent;opis
2026-03-01;12500.00;PRZYCHÓD;Meble;IKEA Polska;Faktura VAT 2026/03/01
2026-03-02;3200.50;KOSZT;Logistyka;DHL;Transport towarów
2026-03-03;8900.00;PRZYCHÓD;Akcesoria;Castorama;Sprzedaż hurtowa
2026-03-04;1500.00;KOSZT;Marketing;Google Ads;Kampania marzec
2026-03-05;25000.00;PRZYCHÓD;Meble;Amazon.pl;Zamówienie #A-7842`;

export default function FinanseImport() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState('');
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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
