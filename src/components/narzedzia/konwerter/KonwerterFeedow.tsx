/**
 * KonwerterFeedow — konwerter feedów XML/JSON/YAML/CSV/HTML
 * Przeportowany z CAY_FEED_conventer (vanilla JS → React/TypeScript)
 * Funkcje: URL fetch (przez /api/fetch-url), drag & drop, statystyki, 6 formatów wyjściowych
 */

import { useState, useCallback, useRef } from 'react';

// ========== TYPES ==========

type InputFormat = 'xml' | 'json' | 'yaml' | 'csv' | 'html' | 'txt';

interface OutputFormats {
  json: boolean;
  csv: boolean;
  yaml: boolean;
  html: boolean;
  markdown: boolean;
  jsonl: boolean;
}

interface FileStats {
  records: number;
  fields: number;
  sizeKB: string;
}

interface ConvertedFile {
  name: string;
  content: string;
  mimeType: string;
}

interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error' | 'loading';
}

// ========== PARSERS ==========

function detectFormat(data: string): InputFormat {
  const trimmed = data.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.includes('>'))) return 'xml';
  if (/^[a-z_].*:/m.test(trimmed) || trimmed.includes(':\n')) return 'yaml';
  if (trimmed.includes('<table') || trimmed.includes('<tr')) return 'html';
  if (trimmed.includes(',') && trimmed.includes('\n')) return 'csv';
  return 'txt';
}

function parseXML(xml: string): Record<string, any>[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const errors = doc.getElementsByTagName('parsererror');
  if (errors.length > 0) {
    throw new Error('Błąd w strukturze XML');
  }

  function elementToObj(el: Element): any {
    const result: Record<string, any> = {};
    for (const child of Array.from(el.children)) {
      const key = child.tagName;
      const val = child.children.length > 0 ? elementToObj(child) : child.textContent || '';
      if (result[key]) {
        if (!Array.isArray(result[key])) result[key] = [result[key]];
        result[key].push(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  }

  const items: Record<string, any>[] = [];
  const root = doc.documentElement;
  for (const child of Array.from(root.children)) {
    items.push(elementToObj(child));
  }
  return items.length > 0 ? items : [elementToObj(root)];
}

function parseCSV(csv: string): Record<string, any>[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',');
    const row: Record<string, any> = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx] ? vals[idx].trim().replace(/^"|"$/g, '') : '';
    });
    rows.push(row);
  }
  return rows;
}

function parseHTML(html: string): Record<string, any>[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tables = doc.getElementsByTagName('table');
  const data: Record<string, any>[] = [];

  for (const table of Array.from(tables)) {
    const rows = table.getElementsByTagName('tr');
    const headers: string[] = [];

    for (const row of Array.from(rows)) {
      const ths = row.getElementsByTagName('th');
      const tds = row.getElementsByTagName('td');

      if (ths.length > 0 && headers.length === 0) {
        for (const th of Array.from(ths)) headers.push(th.textContent?.trim() || '');
      } else if (tds.length > 0) {
        const obj: Record<string, any> = {};
        Array.from(tds).forEach((td, i) => {
          obj[headers[i] || `col${i}`] = td.textContent?.trim() || '';
        });
        data.push(obj);
      }
    }
  }
  return data;
}

function parseYAML(yaml: string): Record<string, any> {
  // Simplified YAML parser (key: value pairs)
  const lines = yaml.split('\n');
  const data: Record<string, any> = {};
  for (const line of lines) {
    const match = line.match(/^(\s*)([^:#]+):\s*(.*)$/);
    if (match) {
      const [, , key, value] = match;
      data[key.trim()] = value.trim() || true;
    }
  }
  return data;
}

function parseData(raw: string, format: InputFormat): any {
  switch (format) {
    case 'json': return JSON.parse(raw);
    case 'xml': return parseXML(raw);
    case 'csv': return parseCSV(raw);
    case 'html': return parseHTML(raw);
    case 'yaml': return parseYAML(raw);
    default: return { raw };
  }
}

// ========== CONVERTERS ==========

function toCSV(data: any): string {
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '';
  const headers = Object.keys(arr[0]);
  const rows = [headers.join(',')];
  for (const item of arr) {
    rows.push(headers.map(h => `"${String(item[h] ?? '').replace(/"/g, '""')}"`).join(','));
  }
  return rows.join('\n');
}

function toYAML(obj: any, indent = 0): string {
  const sp = ' '.repeat(indent);
  let result = '';
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        result += `${sp}-\n${toYAML(item, indent + 2)}`;
      } else {
        result += `${sp}- ${item}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result += `${sp}${key}:\n${toYAML(obj[key], indent + 2)}`;
      } else {
        result += `${sp}${key}: ${obj[key]}\n`;
      }
    }
  } else {
    result += `${sp}${obj}\n`;
  }
  return result;
}

function toHTMLTable(data: any): string {
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '<p>Brak danych</p>';
  const headers = Object.keys(arr[0]);
  let html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  body{font-family:system-ui;background:#0f1419;color:#c9d1d9;padding:20px}
  table{border-collapse:collapse;width:100%}
  th{background:#1a1f28;color:#3d7dd6;padding:8px;border:1px solid #2a2f38;text-align:left}
  td{padding:8px;border:1px solid #2a2f38}
  tr:nth-child(even){background:rgba(61,125,214,0.05)}
</style></head><body>
<table><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  for (const item of arr) {
    html += `<tr>${headers.map(h => `<td>${item[h] ?? ''}</td>`).join('')}</tr>`;
  }
  html += '</table></body></html>';
  return html;
}

function toMarkdownTable(data: any): string {
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '*Brak danych*';
  const headers = Object.keys(arr[0]);
  let md = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`;
  for (const item of arr) {
    md += `| ${headers.map(h => String(item[h] ?? '')).join(' | ')} |\n`;
  }
  return md;
}

function toJSONL(data: any): string {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map(item => JSON.stringify(item)).join('\n');
}

// ========== COMPONENT ==========

export default function KonwerterFeedow() {
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [url, setUrl] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [detectedFormat, setDetectedFormat] = useState<InputFormat | null>(null);
  const [stats, setStats] = useState<FileStats | null>(null);
  const [outputFormats, setOutputFormats] = useState<OutputFormats>({
    json: true, csv: false, yaml: false, html: false, markdown: false, jsonl: false,
  });
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ------- Helpers -------

  const calculateStats = useCallback((data: any): FileStats => {
    const size = new Blob([JSON.stringify(data)]).size;
    const arr = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [];
    return {
      records: arr.length,
      fields: arr.length > 0 ? Object.keys(arr[0]).length : 0,
      sizeKB: (size / 1024).toFixed(1),
    };
  }, []);

  const processRawData = useCallback((raw: string) => {
    const fmt = detectFormat(raw);
    const data = parseData(raw, fmt);
    setParsedData(data);
    setDetectedFormat(fmt);
    setStats(calculateStats(data));
    return { fmt, data };
  }, [calculateStats]);

  const toggleFormat = (key: keyof OutputFormats) => {
    setOutputFormats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ------- Download helper -------
  const downloadBlob = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // ------- URL Fetch -------
  const handleFetchURL = async () => {
    if (!url.trim()) {
      setStatus({ text: 'Wklej URL do pliku', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatus({ text: 'Pobieranie pliku...', type: 'loading' });
    setConvertedFiles([]);

    try {
      const res = await fetch(`/api/fetch-url?url=${encodeURIComponent(url.trim())}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const raw = await res.text();
      const { fmt } = processRawData(raw);
      setStatus({ text: `Plik pobrany i sparsowany jako ${fmt.toUpperCase()} ✅`, type: 'success' });
    } catch (err: any) {
      setStatus({ text: `Błąd: ${err.message}`, type: 'error' });
      setParsedData(null);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ------- File Upload -------
  const handleFile = useCallback((file: File) => {
    setIsLoading(true);
    setStatus({ text: 'Wczytywanie pliku...', type: 'loading' });
    setConvertedFiles([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        const { fmt } = processRawData(raw);
        setStatus({ text: `Plik wczytany: ${fmt.toUpperCase()} ✅`, type: 'success' });
      } catch (err: any) {
        setStatus({ text: `Błąd: ${err.message}`, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  }, [processRawData]);

  // ------- Drag & Drop -------
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  // ------- Convert -------
  const handleConvert = () => {
    if (!parsedData) {
      setStatus({ text: 'Najpierw załaduj plik lub pobierz z URL', type: 'error' });
      return;
    }

    const selected = Object.entries(outputFormats).filter(([, v]) => v).map(([k]) => k);
    if (selected.length === 0) {
      setStatus({ text: 'Wybierz co najmniej jeden format wyjściowy', type: 'error' });
      return;
    }

    setStatus({ text: 'Konwersja...', type: 'loading' });

    try {
      const files: ConvertedFile[] = [];

      for (const fmt of selected) {
        let content: string;
        let mimeType: string;
        let ext: string;

        switch (fmt) {
          case 'json':
            content = prettyPrint ? JSON.stringify(parsedData, null, 2) : JSON.stringify(parsedData);
            mimeType = 'application/json';
            ext = 'json';
            break;
          case 'csv':
            content = toCSV(parsedData);
            mimeType = 'text/csv';
            ext = 'csv';
            break;
          case 'yaml':
            content = toYAML(parsedData);
            mimeType = 'text/yaml';
            ext = 'yaml';
            break;
          case 'html':
            content = toHTMLTable(parsedData);
            mimeType = 'text/html';
            ext = 'html';
            break;
          case 'markdown':
            content = toMarkdownTable(parsedData);
            mimeType = 'text/markdown';
            ext = 'md';
            break;
          case 'jsonl':
            content = toJSONL(parsedData);
            mimeType = 'application/jsonl';
            ext = 'jsonl';
            break;
          default:
            continue;
        }

        files.push({ name: `data.${ext}`, content, mimeType });
      }

      setConvertedFiles(files);
      setStatus({ text: `Konwersja zakończona! ${files.length} format(ów) gotowych ✅`, type: 'success' });
    } catch (err: any) {
      setStatus({ text: `Błąd konwersji: ${err.message}`, type: 'error' });
    }
  };

  // ------- Clear -------
  const handleClear = () => {
    setParsedData(null);
    setDetectedFormat(null);
    setStats(null);
    setConvertedFiles([]);
    setStatus(null);
    setUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ------- Format label styles -------
  const formatLabels: Record<keyof OutputFormats, { label: string; icon: string }> = {
    json: { label: 'JSON', icon: '📦' },
    csv: { label: 'CSV', icon: '📊' },
    yaml: { label: 'YAML', icon: '📋' },
    html: { label: 'HTML', icon: '🌐' },
    markdown: { label: 'Markdown', icon: '📝' },
    jsonl: { label: 'JSONL', icon: '📄' },
  };

  // ========== RENDER ==========

  return (
    <div className="space-y-6">

      {/* Dwa panele: URL + Plik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PANEL 1: URL */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <span>🌐</span> Pobierz z URL
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Wklej URL do pliku XML, JSON, YAML, CSV lub HTML
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-slate-300">URL pliku:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchURL()}
            />
          </div>

          <button
            onClick={handleFetchURL}
            disabled={isLoading || !url.trim()}
            className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              isLoading || !url.trim()
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Pobieranie...</>
            ) : (
              <><span>⬇️</span> Pobierz i konwertuj</>
            )}
          </button>

          <div className="mt-3 p-3 bg-blue-900/20 border-l-2 border-blue-500 rounded text-xs text-slate-400">
            <strong className="text-blue-400">💡 Tip:</strong> Pobieranie odbywa się przez serwer (brak ograniczeń CORS). Obsługuje XML/RSS/JSON/YAML/CSV/HTML.
          </div>
        </div>

        {/* PANEL 2: Plik lokalny */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <span>📁</span> Prześlij plik lokalnie
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Wybierz plik z dysku lub przeciągnij — konwersja lokalna (offline)
          </p>

          {/* Drag & Drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-blue-400 bg-blue-900/20'
                : 'border-slate-600 bg-slate-900/30 hover:border-blue-500/50'
            }`}
          >
            <div className="text-3xl mb-2">📄</div>
            <div className="text-sm text-slate-400">
              Przeciągnij plik tutaj<br />
              <span className="text-xs">lub kliknij aby wybrać</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xml,.json,.yaml,.yml,.csv,.html,.txt,.jsonl,.rss,.atom"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
            >
              🗑️ Wyczyść
            </button>
            <button
              onClick={handleConvert}
              disabled={!parsedData}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                parsedData
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              ⚙️ Konwertuj
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${
          status.type === 'success' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' :
          status.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
          status.type === 'loading' ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' :
          'bg-slate-800/50 border-slate-600 text-slate-300'
        }`}>
          {status.type === 'loading' && (
            <span className="animate-spin inline-block w-3 h-3 border-2 border-current/30 border-t-current rounded-full" />
          )}
          {status.type === 'success' && <span>✅</span>}
          {status.type === 'error' && <span>❌</span>}
          {status.type === 'info' && <span>ℹ️</span>}
          {status.text}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          {detectedFormat && (
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-purple-400">{detectedFormat.toUpperCase()}</div>
              <div className="text-xs text-slate-400">Format</div>
            </div>
          )}
          {[
            { label: 'Rekordów', value: stats.records.toLocaleString() },
            { label: 'Pól', value: stats.fields.toString() },
            { label: 'Rozmiar', value: `${stats.sizeKB} KB` },
          ].map(s => (
            <div key={s.label} className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-blue-400">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Output Formats */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h3 className="text-sm font-bold mb-3 text-purple-400">📐 Formaty wyjściowe</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {(Object.keys(outputFormats) as (keyof OutputFormats)[]).map(key => (
            <label
              key={key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border text-sm ${
                outputFormats[key]
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-purple-500/30'
              }`}
            >
              <input
                type="checkbox"
                checked={outputFormats[key]}
                onChange={() => toggleFormat(key)}
                className="sr-only"
              />
              <span>{formatLabels[key].icon}</span>
              <span className="font-medium">{formatLabels[key].label}</span>
              {outputFormats[key] && <span className="ml-auto text-purple-400">✓</span>}
            </label>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={prettyPrint}
            onChange={() => setPrettyPrint(!prettyPrint)}
            className="rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
          />
          Formatowanie (Pretty Print)
        </label>
      </div>

      {/* Convert Button (large) */}
      {parsedData && (
        <button
          onClick={handleConvert}
          className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
        >
          🔄 Konwertuj do wybranych formatów
        </button>
      )}

      {/* Download Area */}
      {convertedFiles.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur border border-emerald-500/30 rounded-xl p-6">
          <h3 className="text-sm font-bold mb-4 text-emerald-400">📥 Pobierz konwertowane pliki:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {convertedFiles.map(file => (
              <button
                key={file.name}
                onClick={() => downloadBlob(file.content, file.name, file.mimeType)}
                className="flex items-center gap-3 px-4 py-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/30 hover:border-emerald-500/50 transition-all text-left group"
              >
                <span className="text-lg">📥</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-emerald-300 truncate">{file.name}</div>
                  <div className="text-xs text-slate-400">
                    {(new Blob([file.content]).size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">⬇</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
