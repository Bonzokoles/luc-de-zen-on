/**
 * MYBONZO — Wspólne komponenty AI dla narzędzi
 *
 * AIModelSelector — dropdown wyboru modelu
 * CompanyPromptField — textarea kontekstu firmy
 * useAIExecute — hook do wywołania /api/ai/execute (centralny router)
 * useToolAPI — hook do wywołania dedykowanego endpointu narzędzia
 * AntAgentPanel — panel agentów the_ANT_01 / the_ANT_02
 * AIResultMeta — wyświetlanie metadata (model, czas, tokeny)
 */
import { useState, useCallback, type ReactNode } from 'react';

// ─── Typy ───────────────────────────────────────────────
export interface AIExecuteRequest {
  narzedzie: string;
  model?: string;
  company_prompt?: string;
  core_prompt?: string;
  payload: Record<string, unknown>;
}

export interface AIExecuteResponse {
  wynik: string;
  model_uzyty: {
    nazwa_logiczna: string;
    provider: string;
    model_id: string;
  };
  czas_ms: number;
  tokeny: { input: number; output: number };
}

/** Odpowiedź z dedykowanych endpointów per narzędzie */
export interface ToolAPIResponse {
  [key: string]: unknown;
  model_uzyty?: { nazwa_logiczna: string; provider: string; model_id: string };
  czas?: number;
  tokeny?: { input: number; output: number };
}

// ─── Hook: useAIExecute (centralny router) ──────────────
export function useAIExecute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIExecuteResponse | null>(null);

  const execute = useCallback(async (req: AIExecuteRequest): Promise<AIExecuteResponse | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error((errData as { error?: string }).error || `Błąd ${res.status}`);
      }

      const data = (await res.json()) as AIExecuteResponse;
      setResult(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { execute, loading, error, result, reset };
}

// ─── Hook: useToolAPI (dedykowane endpointy narzędzi) ───
export function useToolAPI<T = ToolAPIResponse>(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<{ model?: string; czas?: number; tokeny?: { input: number; output: number } } | null>(null);

  const call = useCallback(async (body: Record<string, unknown>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setData(null);
    setMeta(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error((errData as { error?: string }).error || `Błąd ${res.status}`);
      }

      const result = (await res.json()) as T & { model_uzyty?: { nazwa_logiczna?: string; model_id?: string }; czas?: number; tokeny?: { input: number; output: number } };
      setData(result);

      if (result.model_uzyty) {
        setMeta({
          model: result.model_uzyty.nazwa_logiczna || result.model_uzyty.model_id,
          czas: result.czas,
          tokeny: result.tokeny,
        });
      }

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setMeta(null);
  }, []);

  return { call, loading, error, data, meta, reset };
}

// ─── Komponent: AntAgentPanel ───────────────────────────
interface AntAgentPanelProps {
  currentTool: string;
  className?: string;
}

export function AntAgentPanel({ currentTool, className = '' }: AntAgentPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeAgent, setActiveAgent] = useState<1 | 2 | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  const askANT = async (antNumber: 1 | 2) => {
    if (!question.trim()) return;
    setAgentLoading(true);
    setAnswer('');

    try {
      const res = await fetch(`/api/ant/0${antNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'auto',
          pytanie: question,
          kontekst: `Użytkownik korzysta z narzędzia: ${currentTool}`,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { odpowiedz: string };
      setAnswer(data.odpowiedz);
    } catch (err) {
      setAnswer(`Błąd: ${err instanceof Error ? err.message : 'nieznany'}`);
    } finally {
      setAgentLoading(false);
    }
  };

  return (
    <div className={`border border-slate-700 rounded-lg ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span>🤖 Agenci pomocniczy (the_ANT)</span>
        <span className={`transform transition-transform text-xs ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveAgent(1)}
              className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-colors ${
                activeAgent === 1 ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              🗄️ the_ANT_01<br />
              <span className="text-[10px]">Pomoc z bazą danych</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAgent(2)}
              className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-colors ${
                activeAgent === 2 ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 the_ANT_02<br />
              <span className="text-[10px]">Pomoc z organizacją</span>
            </button>
          </div>

          {activeAgent && (
            <div className="space-y-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={activeAgent === 1
                  ? 'Np. Jak zaimportować faktury z CSV?'
                  : 'Np. Jak zorganizować tygodniowy import danych?'}
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 resize-y"
              />
              <button
                type="button"
                onClick={() => askANT(activeAgent)}
                disabled={agentLoading || !question.trim()}
                className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm text-white rounded-lg transition-colors"
              >
                {agentLoading ? '⏳ Odpowiadam...' : `Zapytaj the_ANT_0${activeAgent}`}
              </button>
            </div>
          )}

          {answer && (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Komponent: ToolResultMeta ──────────────────────────
interface ToolResultMetaProps {
  model?: string;
  czas?: number;
  tokeny?: { input: number; output: number };
  className?: string;
}

export function ToolResultMeta({ model, czas, tokeny, className = '' }: ToolResultMetaProps) {
  if (!model && !czas) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-700 pt-2 mt-3 ${className}`}>
      {model && <span>🤖 {model}</span>}
      {czas && <span>⏱ {(czas / 1000).toFixed(1)}s</span>}
      {tokeny && (tokeny.input + tokeny.output > 0) && (
        <span>🎫 {tokeny.input}→{tokeny.output} tokens</span>
      )}
    </div>
  );
}

// ─── Komponent: AIModelSelector ─────────────────────────
interface AIModelSelectorProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const MODEL_OPTIONS = [
  { value: 'auto', label: '🤖 Auto (najlepszy dostępny)', desc: 'System wybierze optymalny model' },
  { value: 'szybki', label: '⚡ Szybki', desc: 'Gemini 2.5 Flash — szybki i tani' },
  { value: 'dokladny', label: '🎯 Dokładny', desc: 'GPT-4o — najwyższa jakość' },
  { value: 'ekonomiczny', label: '💰 Ekonomiczny', desc: 'DeepSeek — niski koszt' },
];

export function AIModelSelector({ value, onChange, className = '' }: AIModelSelectorProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-slate-300">
        Model AI
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {MODEL_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500">
        {MODEL_OPTIONS.find((o) => o.value === value)?.desc}
      </p>
    </div>
  );
}

// ─── Komponent: CompanyPromptField ──────────────────────
interface CompanyPromptFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function CompanyPromptField({
  value,
  onChange,
  placeholder = 'Opisz swoją firmę / markę / kontekst biznesowy… (opcjonalne)',
  className = '',
}: CompanyPromptFieldProps) {
  const [expanded, setExpanded] = useState(!!value);

  return (
    <div className={`space-y-1 ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
        <span className="font-medium">Kontekst firmy</span>
        {value && <span className="text-xs text-blue-400">(wypełnione)</span>}
      </button>
      {expanded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white 
                     placeholder-slate-500 resize-y min-h-[60px]
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      )}
      {expanded && (
        <p className="text-xs text-slate-500">
          AI uwzględni ten opis przy generowaniu — wpływa na ton, branżę i styl.
        </p>
      )}
    </div>
  );
}

// ─── Komponent: AIResultMeta ────────────────────────────
interface AIResultMetaProps {
  result: AIExecuteResponse;
  className?: string;
}

export function AIResultMeta({ result, className = '' }: AIResultMetaProps) {
  const providerIcon: Record<string, string> = {
    google: '🟢',
    openai: '🔵',
    deepseek: '🟣',
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-700 pt-2 mt-3 ${className}`}
    >
      <span>
        {providerIcon[result.model_uzyty.provider] || '🤖'}{' '}
        {result.model_uzyty.model_id}
      </span>
      <span>⏱ {(result.czas_ms / 1000).toFixed(1)}s</span>
      {result.tokeny.input + result.tokeny.output > 0 && (
        <span>
          🎫 {result.tokeny.input}→{result.tokeny.output} tokens
        </span>
      )}
    </div>
  );
}

// ─── Komponent: AIStatusIndicator ───────────────────────
interface AIStatusIndicatorProps {
  loading: boolean;
  error: string | null;
  children?: ReactNode;
}

export function AIStatusIndicator({ loading, error, children }: AIStatusIndicatorProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-300">Generuję odpowiedź AI…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 rounded-lg border border-red-800">
        <p className="text-sm text-red-400">❌ {error}</p>
      </div>
    );
  }

  return <>{children}</>;
}
