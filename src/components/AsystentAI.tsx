import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    icon: '💼',
    title: 'Strategia biznesowa',
    prompt: 'Pomóż mi opracować strategię rozwoju małego biznesu w branży [twoja branża]'
  },
  {
    icon: '💰',
    title: 'Finanse',
    prompt: 'Jak mogę zoptymalizować koszty i zwiększyć rentowność mojej firmy?'
  },
  {
    icon: '📈',
    title: 'Marketing',
    prompt: 'Zaproponuj mi skuteczne działania marketingowe dla [twój biznes]'
  },
  {
    icon: '📧',
    title: 'Komunikacja',
    prompt: 'Pomóż mi napisać profesjonalny email w sprawie [temat]'
  },
  {
    icon: '⚖️',
    title: 'Aspekty prawne',
    prompt: 'Jakie dokumenty prawne powinienem mieć prowadząc [typ działalności]?'
  },
  {
    icon: '🎯',
    title: 'Cele biznesowe',
    prompt: 'Pomóż mi ustalić realistyczne cele biznesowe na najbliższy kwartał'
  }
];

const AsystentAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll do najnowszej wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-assistant-messages');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-assistant-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Dodaj wiadomość użytkownika
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      // CLAUDE 3.7 SONNET - najlepszy do rozmów i doradztwa biznesowego
      const response = await fetch('/api/chat-openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'anthropic/claude-3.7-sonnet' // Upgrade do najnowszej wersji
        }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas komunikacji z AI');
      }

      // Stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                }
              } catch (e) {
                // Ignoruj błędy parsowania
              }
            }
          }
        }
      }

      // Dodaj odpowiedź asystenta
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fullContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (error: any) {
      console.error('Błąd:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Przepraszam, wystąpił błąd: ${error.message}. Spróbuj ponownie.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Czy na pewno chcesz wyczyścić historię rozmowy?')) {
      setMessages([]);
      localStorage.removeItem('ai-assistant-messages');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Bot className="w-8 h-8 text-primary-400" />
          Asystent Biznesowy AI
        </h1>
        <p className="text-gray-300">
          Twój osobisty doradca biznesowy 24/7 - zadaj pytanie, otrzymaj ekspercką pomoc
        </p>
      </div>

      {/* Chat Container */}
      <div className="card">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4 bg-surface-darker rounded-lg">
          {messages.length === 0 && !streamingContent && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-semibold mb-2">Witaj! Jestem Twoim Asystentem Biznesowym</p>
              <p className="text-sm text-center max-w-md mb-6">
                Mogę pomóc Ci w prowadzeniu biznesu - od strategii po codzienne zadania.
                Wybierz gotowy prompt poniżej lub zadaj własne pytanie!
              </p>

              {/* Quick Prompts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-3xl">
                {quickPrompts.map((qp, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(qp.prompt);
                      inputRef.current?.focus();
                    }}
                    className="p-3 bg-surface-dark border border-gray-700 rounded-lg hover:border-primary-500 transition-colors text-left"
                  >
                    <div className="text-2xl mb-1">{qp.icon}</div>
                    <div className="text-xs font-semibold text-white">{qp.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-dark text-gray-100'
                  }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                <p className="text-xs opacity-50 mt-2">
                  {message.timestamp.toLocaleTimeString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming Message */}
          {streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[80%] rounded-lg p-4 bg-surface-dark text-gray-100">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-primary-400">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>Piszę...</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[80%] rounded-lg p-4 bg-surface-dark text-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Zadaj pytanie... (Enter - wyślij, Shift+Enter - nowa linia)"
            className="input-field flex-1 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="btn-primary px-6 flex items-center gap-2 self-end"
          >
            <Send className="w-4 h-4" />
            Wyślij
          </button>
        </div>

        {/* Action Buttons */}
        {messages.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearHistory}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Wyczyść historię
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Jak korzystać z Asystenta?</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Zadawaj pytania po polsku - o biznes, marketing, finanse, prawo, strategię</li>
              <li>Możesz poprosić o pomoc w pisaniu emaili, postów, planów działań</li>
              <li>Asystent pamięta kontekst rozmowy - możesz zadawać pytania uzupełniające</li>
              <li>Używaj gotowych promptów lub zadawaj własne pytania</li>
              <li>Historia rozmów zapisuje się automatycznie w przeglądarce</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              💡 <strong>Wskazówka:</strong> Im dokładniej opiszesz swoją sytuację, tym lepszą otrzymasz pomoc!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsystentAI;
