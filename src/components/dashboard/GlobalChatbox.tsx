import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Maximize2, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GlobalChatbox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock response - in production, call actual API
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Witaj! Jestem Twoim asystentem biznesowym. Jak mogę Ci pomóc?',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[35] w-full max-w-2xl md:w-1/2">
      {/* Collapsed State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Asystent AI</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="bg-business-surface border-2 border-indigo-500/30 rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ease-out max-h-[16vh] min-h-[200px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Asystent AI</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/asystent-ai"
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Pełny widok"
              >
                <Maximize2 className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-business-bg">
            {messages.length === 0 && (
              <div className="text-center text-business-text-dim py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-indigo-400" />
                <p>Zadaj pytanie, aby rozpocząć rozmowę</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-business-surface border border-business-border text-business-text'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-business-surface border border-business-border px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 p-3 border-t border-business-border bg-business-surface">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Wpisz wiadomość..."
              className="flex-1 px-3 py-2 bg-business-bg border border-business-border rounded-lg text-business-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatbox;
