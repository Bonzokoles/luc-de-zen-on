/**
 * FinanseAsystent — AI Chat Widget dla modułu finansowego
 * Endpoint: POST /api/finanse/asystent (GPT-4o + kontekst D1)
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  zrodla?: string[];
  tokeny?: number;
}

const QUICK_PROMPTS = [
  { icon: '📊', label: 'Podsumowanie miesiąca', prompt: 'Jakie są wyniki finansowe za ostatni miesiąc?' },
  { icon: '⚠️', label: 'Ryzykowne dokumenty', prompt: 'Które dokumenty mają najwyższy poziom ryzyka i ile wynoszą należności?' },
  { icon: '📈', label: 'Najlepsza kategoria', prompt: 'Która kategoria produktów przynosi największą marżę?' },
  { icon: '💸', label: 'Optymalizacja kosztów', prompt: 'Gdzie mogę zredukować koszty bez ryzyka dla przychodów?' },
  { icon: '🔮', label: 'Prognoza cash flow', prompt: 'Jak wygląda prognoza przepływów pieniężnych na następne 30 dni?' },
];

export default function FinanseAsystent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [zakres] = useState(() => {
    const now = new Date();
    const od = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const doo = now.toISOString().split('T')[0];
    return { od, doo };
  });
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Cześć! Jestem **Asystentem Finansowym MyBonzo ERP**.\n\nMam dostęp do Twoich danych finansowych: transakcji, dokumentów, rentowności kategorii i analiz ryzyka.\n\nO co chcesz się zapytać? 👇`,
    }]);
  }, []);

  const send = useCallback(async (pytanie: string) => {
    if (!pytanie.trim() || loading) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: pytanie };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/finanse/asystent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pytanie,
          zakres: { od: zakres.od, do: zakres.doo },
        }),
      });

      const data = await res.json() as { odpowiedz?: string; zrodla?: string[]; tokeny?: number; error?: string };

      setMessages(prev => [...prev, {
        id: `a${Date.now()}`,
        role: 'assistant',
        content: data.odpowiedz ?? data.error ?? 'Brak odpowiedzi',
        zrodla: data.zrodla,
        tokeny: data.tokeny,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err${Date.now()}`,
        role: 'assistant',
        content: '❌ Błąd połączenia z API. Sprawdź czy serwer jest uruchomiony.',
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, zakres]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <h3 className="font-bold text-white">Asystent Finansowy AI</h3>
          <p className="text-xs text-slate-400">GPT-4o · dane z D1 · zakres: {zakres.od} – {zakres.doo}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-violet-700 text-white'
            }`}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-indigo-600/90 text-white rounded-tr-sm'
                : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
              {msg.zrodla && msg.zrodla.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-600 flex flex-wrap gap-1">
                  {msg.zrodla.map((z, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                      📌 {z}
                    </span>
                  ))}
                </div>
              )}
              {msg.tokeny && (
                <p className="mt-1 text-right text-xs text-slate-500">{msg.tokeny} tokenów</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.label}
              onClick={() => send(p.prompt)}
              className="flex-shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-violet-500 rounded-full text-xs text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Zapytaj o finanse... (Enter = wyślij, Shift+Enter = nowa linia)"
            rows={2}
            className="flex-1 bg-slate-800 border border-slate-600 focus:border-violet-500 rounded-xl px-3 py-2 text-sm text-white resize-none outline-none transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-1.5"
          >
            {loading ? '⏳' : '🚀'} Wyślij
          </button>
        </form>
      </div>
    </div>
  );
}
