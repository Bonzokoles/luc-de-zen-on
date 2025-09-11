import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  orchestratorInfo?: {
    activatedModels: string[];
    source: string;
    selectedModel?: string;
  };
}

interface BielikMainChatboxProps {
  variant?: 'floating' | 'embedded' | 'fullscreen';
  className?: string;
}

// Available Polish AI models from Cloudflare (free tier)
const POLISH_AI_MODELS = [
  {
    id: 'gemma',
    name: 'GEMMA 12B (DOMYŚLNY)',
    description: 'Google Gemma 3 12B - Główny model system',
    model: 'gemma',
    icon: '💎'
  },
  {
    id: 'qwen-pl',
    name: 'Qwen 2.5 7B (PL)',
    description: 'Alibaba model z polską lokalizacją',
    model: 'qwen-pl',
    icon: '🐼'
  },
  {
    id: 'llama-8b',
    name: 'Llama 3.1 8B (PL)',
    description: 'Meta model z polskim kontekstem',
    model: 'llama-8b',
    icon: '🦙'
  },
  {
    id: 'polaczek',
    name: 'POLACZEK Assistant',
    description: 'Zaawansowany polski asystent AI',
    model: 'polaczek',
    icon: '🇵🇱'
  }
];

export default function BielikMainChatbox({ 
  variant = 'embedded', 
  className = '' 
}: BielikMainChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [bielikStatus, setBielikStatus] = useState('disconnected');
  const [selectedModel, setSelectedModel] = useState(POLISH_AI_MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`bielik_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize Bielik connection
    initializeBielik();
    
    // Add initial system message
    setMessages([{
      id: 'init',
      role: 'system',
      content: '🇵🇱 BIELIK Orchestrator Online - Główny AI systemu MyBonzo gotowy do pracy!',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeBielik = async () => {
    try {
      setBielikStatus('connecting');
      const response = await fetch('/api/bielik', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setBielikStatus('active');
        
        // Add connection confirmation message
        setMessages(prev => [...prev, {
          id: 'connection',
          role: 'system',
          content: `✅ BIELIK połączony pomyślnie!\n🧠 Aktywne modele: ${Object.keys(data.connectedModels || {}).length}\n⚡ Wersja: ${data.version}\n🎯 Wszystkie systemy zsynchronizowane`,
          timestamp: new Date(),
          orchestratorInfo: {
            activatedModels: Object.keys(data.connectedModels || {}),
            source: 'bielik-orchestrator'
          }
        }]);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('Bielik connection error:', error);
      setIsConnected(false);
      setBielikStatus('error');
      
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'system',
        content: '❌ Błąd połączenia z BIELIK. Sprawdź konfigurację orkiestratora.',
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !isConnected || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    const newUserMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Use main chat API with selected model
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          model: selectedModel.model,
          language: 'pl',
          usePolaczek: selectedModel.id === 'polaczek'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
          orchestratorInfo: {
            activatedModels: data.connectedModels || [selectedModel.name],
            source: data.source,
            selectedModel: selectedModel.name
          }
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'system',
        content: `❌ Błąd komunikacji z ${selectedModel.name}: ${error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'cleared',
      role: 'system',
      content: '🔄 Chat wyczyszczony. BIELIK Orchestrator pozostaje aktywny.',
      timestamp: new Date()
    }]);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'floating':
        return {
          container: 'fixed bottom-4 right-4 w-96 h-128 bg-black/90 border-2 border-cyan-400 shadow-2xl z-50',
          chat: 'h-80'
        };
      case 'fullscreen':
        return {
          container: 'w-full h-screen bg-black/95 border-2 border-cyan-400',
          chat: 'h-96'
        };
      default:
        return {
          container: 'w-full max-w-4xl mx-auto bg-black/80 border-2 border-cyan-400 shadow-xl',
          chat: 'h-96'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`} style={{ borderRadius: '0px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/50 to-yellow-600/50 border-b-2 border-yellow-400 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🇵🇱</span>
          <div>
            <h3 className="text-yellow-400 font-bold text-lg">BIELIK - Główny AI Chatbox</h3>
            <p className="text-yellow-200 text-sm">Orkiestrator wszystkich modeli AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className={`px-2 py-1 text-xs font-bold border ${
              bielikStatus === 'active' 
                ? 'text-green-400 border-green-400' 
                : bielikStatus === 'connecting'
                ? 'text-yellow-400 border-yellow-400'
                : 'text-red-400 border-red-400'
            }`}
            style={{ borderRadius: '0px' }}
          >
            {bielikStatus.toUpperCase()}
          </span>
          <button 
            onClick={clearChat}
            className="text-cyan-400 hover:text-white transition-colors text-sm"
          >
            🗑️ Wyczyść
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`${styles.chat} overflow-y-auto p-4 bg-black/40`}>
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-3xl px-4 py-3 border-2 ${
                  message.role === 'user'
                    ? 'bg-cyan-900/30 border-cyan-400 text-cyan-100'
                    : message.role === 'system'
                    ? 'bg-yellow-900/30 border-yellow-400 text-yellow-100'
                    : 'bg-red-900/30 border-yellow-400 text-yellow-100'
                }`}
                style={{ borderRadius: '0px' }}
              >
                {/* Message Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">
                    {message.role === 'user' ? '👤 User' : 
                     message.role === 'system' ? '🔧 System' : '🇵🇱 BIELIK'}
                  </span>
                  <span className="text-xs opacity-60">
                    {message.timestamp.toLocaleTimeString('pl-PL')}
                  </span>
                </div>

                {/* Message Content */}
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Orchestrator Info */}
                {message.orchestratorInfo && (
                  <div className="mt-3 pt-2 border-t border-current/20">
                    <div className="text-xs opacity-80">
                      <span className="font-semibold">🧠 Aktywowane moduły:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {message.orchestratorInfo.activatedModels.map((model, idx) => (
                          <span 
                            key={idx}
                            className="px-1 py-0.5 bg-white/10 border border-current/30 text-xs"
                            style={{ borderRadius: '0px' }}
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-yellow-900/30 border-2 border-yellow-400 text-yellow-100 px-4 py-3 max-w-3xl" style={{ borderRadius: '0px' }}>
              <div className="flex items-center gap-2">
                <span>🇵🇱 BIELIK orchestrates response...</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-yellow-400 animate-bounce"
                      style={{ 
                        borderRadius: '0px',
                        animationDelay: `${i * 0.1}s` 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Model Selection */}
      <div className="border-t-2 border-cyan-400 p-3 bg-black/70 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-300 text-xs font-semibold">🧠 AKTYWNY MODEL AI:</span>
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900/30 transition-colors text-xs"
            style={{ borderRadius: '0px' }}
          >
            {selectedModel.icon} {selectedModel.name}
            <span className="text-xs">▼</span>
          </button>
        </div>

        {/* Model Selector Dropdown */}
        {showModelSelector && (
          <div 
            className="absolute bottom-full right-3 mb-2 bg-black/90 border-2 border-cyan-400 shadow-2xl z-50 min-w-80"
            style={{ borderRadius: '0px' }}
          >
            <div className="p-3">
              <h4 className="text-yellow-400 font-bold mb-3 text-sm">🇵🇱 POLSKIE MODELE AI (Cloudflare)</h4>
              {POLISH_AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModelSelector(false);
                    setMessages(prev => [...prev, {
                      id: `model_switch_${Date.now()}`,
                      role: 'system',
                      content: `🔄 Przełączono na model: ${model.name}\n📝 ${model.description}`,
                      timestamp: new Date(),
                      orchestratorInfo: {
                        activatedModels: [model.name],
                        source: `/api/chat?model=${model.model}`,
                        selectedModel: model.name
                      }
                    }]);
                  }}
                  className={`w-full text-left p-3 border-b border-cyan-400/30 hover:bg-cyan-900/30 transition-colors ${
                    selectedModel.id === model.id ? 'bg-yellow-900/30 border-l-4 border-l-yellow-400' : ''
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{model.icon}</span>
                    <div>
                      <div className={`font-semibold ${selectedModel.id === model.id ? 'text-yellow-400' : 'text-cyan-300'}`}>
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{model.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-cyan-400 p-4 bg-black/60">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Napisz do ${selectedModel.name}...`}
            disabled={!isConnected || isLoading}
            className="flex-1 px-4 py-3 bg-black/80 border-2 border-cyan-400/50 text-white placeholder-cyan-300/60 focus:border-cyan-400 focus:outline-none font-mono"
            style={{ borderRadius: '0px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-red-700 to-yellow-600 text-white font-bold border-2 border-yellow-400 hover:from-yellow-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            style={{ borderRadius: '0px' }}
          >
            {selectedModel.icon} Wyślij
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <span className="text-cyan-300">
              📡 Status: <span className={bielikStatus === 'active' ? 'text-green-400' : 'text-red-400'}>
                {bielikStatus}
              </span>
            </span>
            <span className="text-cyan-300">
              💬 Sesja: {sessionId.current.slice(-8)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={initializeBielik}
              disabled={isConnected}
              className="text-yellow-400 hover:text-white transition-colors"
            >
              🔄 Reconnect
            </button>
            <span className="text-yellow-400">
              🧠 AI Orchestrator Active
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInputValue('Pokaż status wszystkich modeli AI')}
            className="px-3 py-1 bg-cyan-900/30 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-800/50 transition-colors text-xs"
            style={{ borderRadius: '0px' }}
          >
            📊 Status modeli
          </button>
          <button
            onClick={() => setInputValue('Aktywuj wszystkie funkcje AI')}
            className="px-3 py-1 bg-yellow-900/30 border border-yellow-400/50 text-yellow-300 hover:bg-yellow-800/50 transition-colors text-xs"
            style={{ borderRadius: '0px' }}
          >
            ⚡ Aktywuj funkcje
          </button>
          <button
            onClick={() => setInputValue('Wygeneruj raport systemu')}
            className="px-3 py-1 bg-red-900/30 border border-red-400/50 text-red-300 hover:bg-red-800/50 transition-colors text-xs"
            style={{ borderRadius: '0px' }}
          >
            📋 Raport systemu
          </button>
          <button
            onClick={() => setInputValue('Zoptymalizuj wydajność wszystkich workers')}
            className="px-3 py-1 bg-green-900/30 border border-green-400/50 text-green-300 hover:bg-green-800/50 transition-colors text-xs"
            style={{ borderRadius: '0px' }}
          >
            🚀 Optymalizuj
          </button>
        </div>
      </div>
    </div>
  );
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).BielikMainChatbox = BielikMainChatbox;
}
