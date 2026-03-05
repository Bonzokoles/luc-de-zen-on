/**
 * MYBONZO — Wspólne komponenty AI dla narzędzi
 *
 * AIModelSelector — dropdown wyboru modelu
 * CompanyPromptField — textarea kontekstu firmy
 * useAIExecute — hook do wywołania /api/ai/execute
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

// ─── Hook: useAIExecute ─────────────────────────────────
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
