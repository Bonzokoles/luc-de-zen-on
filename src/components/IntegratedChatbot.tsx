// Chatbot z integracją Polaczek AI Assistant
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  via?: string;
  model?: string;
  error?: boolean;
}

export default function IntegratedChatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usePolaczek, setUsePolaczek] = useState(true);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          usePolaczek: usePolaczek,
          model: usePolaczek ? "polaczek" : "llama-8b",
          language: "pl",
        }),
      });

      interface ChatApiResponse {
        answer: string;
        via?: string;
        modelUsed?: string;
      }
      const data = await response.json() as ChatApiResponse;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: data.answer || "Brak odpowiedzi",
          via: data.via || "standard",
          model: data.modelUsed,
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "Przepraszam, wystąpił błąd podczas komunikacji z AI.",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={usePolaczek}
              onChange={(e) => setUsePolaczek(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">
              Użyj Polaczek AI Assistant
              {usePolaczek && <span className="text-green-600 ml-1">✓</span>}
            </span>
          </label>
        </div>
      </div>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">
            Rozpocznij rozmowę z AI!
            {usePolaczek && (
              <span className="block text-sm mt-2">
                🤖 Polaczek AI Assistant aktywny
              </span>
            )}
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : msg.error
                    ? "bg-red-100 text-red-800"
                    : "bg-white border"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === "assistant" && msg.via && (
                  <div className="text-xs mt-2 opacity-70">
                    via: {msg.via} | model: {msg.model}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-white border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <span className="text-sm text-gray-500 ml-2">
                  {usePolaczek ? "Polaczek myśli..." : "AI myśli..."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            usePolaczek ? "Zapytaj Polaczka..." : "Napisz wiadomość..."
          }
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !message.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "➤"}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          💡 <strong>Integracja:</strong> Główny chat API teraz automatycznie
          przekierowuje do Polaczek AI Assistant gdy jest wybrany.
        </p>
        <p className="mt-1">
          🔧 <strong>Fallback:</strong> Jeśli Polaczek nie odpowiada, system
          przełącza się na standardowy model AI.
        </p>
      </div>
    </div>
  );
}
