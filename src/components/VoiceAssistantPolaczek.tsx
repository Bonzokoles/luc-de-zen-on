import React, { useState, useRef, useEffect } from 'react';
import './VoiceAssistantPolaczek.css';

interface VoiceAssistantPolaczekProps {
  className?: string;
}

const VoiceAssistantPolaczek: React.FC<VoiceAssistantPolaczekProps> = ({ 
  className = '' 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'user' | 'assistant', text: string}>>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  // POLACZEK responses about BONZO system
  const bonzoResponses = [
    "Witaj! Jestem POLACZEK, Twój polski asystent AI. System BONZO to nowoczesna platforma łącząca sztuczną inteligencję z automatyzacją.",
    "BONZO wykorzystuje zaawansowane technologie jak BigQuery, Cloudflare Workers i Google AI APIs do analizy danych w czasie rzeczywistym.",
    "Główne funkcje BONZO to: wizualizacje audio, analityka BigQuery, generator quizów AI i inteligentny chat. Wszystko zintegrowane w jednym systemie.",
    "System BONZO oferuje wielojęzyczne wsparcie dzięki Google Translate API. Mogę odpowiadać po polsku, angielsku, niemiecku, hiszpańsku i francusku.",
    "Wizualizatory BONZO synchronizują się z muzyką w czasie rzeczywistym, tworząc spektakularne efekty audiowizualne.",
    "BONZO łączy Cloud Run, Cloudflare Workers i Google Cloud AI w spójną architekturę microservices dla maksymalnej wydajności.",
    "Dzięki integracji z POLACZEK API możesz generować quizy, analizować dane i prowadzić konwersacje - wszystko głosowo!"
  ];

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pl-PL';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setConversationHistory(prev => [...prev, { type: 'user', text: transcript }]);
        handleUserInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  };

  const handleUserInput = async (input: string) => {
    setCurrentMessage("Myślę...");
    
    try {
      // Send to Gemini AI via chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Jesteś POLACZEK - polski asystent AI systemu BONZO. Odpowiedz krótko i naturalnie po polsku na: "${input}". 
          
          Kontekst BONZO: System AI z BigQuery, Cloudflare Workers, wizualizatorami audio, generatorami quizów i chatbotem. Łączy Google Cloud AI, tłumaczenia i analitykę w czasie rzeczywistym.
          
          Odpowiadaj jak przyjazny asystent, max 2-3 zdania.`,
          conversationHistory: conversationHistory.slice(-4) // Last 4 messages for context
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.message || data.response || "Przepraszam, nie zrozumiałem pytania.";
        
        setConversationHistory(prev => [...prev, { type: 'assistant', text: aiResponse }]);
        speakText(aiResponse);
      } else {
        // Fallback to predefined responses
        let fallbackResponse = bonzoResponses[0];
        
        if (input.toLowerCase().includes('bigquery') || input.toLowerCase().includes('dane')) {
          fallbackResponse = bonzoResponses[1];
        } else if (input.toLowerCase().includes('funkcje') || input.toLowerCase().includes('możliwości')) {
          fallbackResponse = bonzoResponses[2];
        } else if (input.toLowerCase().includes('język') || input.toLowerCase().includes('tłumaczenie')) {
          fallbackResponse = bonzoResponses[3];
        } else if (input.toLowerCase().includes('muzyka') || input.toLowerCase().includes('wizualizator')) {
          fallbackResponse = bonzoResponses[4];
        } else if (input.toLowerCase().includes('architektura') || input.toLowerCase().includes('technologia')) {
          fallbackResponse = bonzoResponses[5];
        } else if (input.toLowerCase().includes('polaczek') || input.toLowerCase().includes('api')) {
          fallbackResponse = bonzoResponses[6];
        } else {
          fallbackResponse = bonzoResponses[Math.floor(Math.random() * bonzoResponses.length)];
        }

        setConversationHistory(prev => [...prev, { type: 'assistant', text: fallbackResponse }]);
        speakText(fallbackResponse);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorResponse = "Przepraszam, mam problem z połączeniem. Spróbuj ponownie.";
      setConversationHistory(prev => [...prev, { type: 'assistant', text: errorResponse }]);
      speakText(errorResponse);
    }
    
    setCurrentMessage("");
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      setCurrentMessage(text);

      // Use POLACZEK TTS API
      const response = await fetch('/api/polaczek/quiz/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: 'pl'
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            setCurrentMessage('');
            URL.revokeObjectURL(audioUrl);
            // Auto-restart listening after response
            setTimeout(() => {
              if (isActive && !isListening) {
                startListening();
              }
            }, 500);
          };
          await audioRef.current.play();
        }
      } else {
        // Fallback to Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentMessage('');
          // Auto-restart listening after response
          setTimeout(() => {
            if (isActive && !isListening) {
              startListening();
            }
          }, 500);
        };
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      setCurrentMessage('');
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const toggleAssistant = () => {
    if (!isActive) {
      setIsActive(true);
      initializeSpeechRecognition();
      speakText("Cześć! Jestem POLACZEK. Pytaj mnie o system BONZO! Po mojej odpowiedzi automatycznie zacznę słuchać twojego następnego pytania.");
    } else {
      setIsActive(false);
      setConversationHistory([]);
      speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  // Trigger music visualizer when speaking
  useEffect(() => {
    if (isSpeaking && typeof window !== 'undefined') {
      // Trigger visualizer activation
      const event = new CustomEvent('polaczek-speaking', { 
        detail: { isActive: true, message: currentMessage } 
      });
      window.dispatchEvent(event);
    } else if (typeof window !== 'undefined') {
      const event = new CustomEvent('polaczek-speaking', { 
        detail: { isActive: false } 
      });
      window.dispatchEvent(event);
    }
  }, [isSpeaking, currentMessage]);

  return (
    <div className={`voice-assistant-polaczek ${className}`}>
      <audio ref={audioRef} className="audio-hidden" />
      
      {/* Main Assistant Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={toggleAssistant}
          className={`
            relative w-20 h-20 rounded-full border-2 transition-all duration-300
            ${isActive 
              ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/30' 
              : 'bg-gray-700/20 border-gray-500 hover:border-gray-400'
            }
            ${isSpeaking ? 'animate-pulse' : ''}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isSpeaking ? (
              <div className="flex space-x-1">
                <div className="w-1 h-8 bg-blue-400 animate-pulse rounded wave-bar-1"></div>
                <div className="w-1 h-6 bg-blue-400 animate-pulse rounded wave-bar-2"></div>
                <div className="w-1 h-8 bg-blue-400 animate-pulse rounded wave-bar-3"></div>
              </div>
            ) : (
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Pulse rings when active */}
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping ping-ring-delayed"></div>
            </>
          )}
        </button>

        {/* Voice Input Button */}
        {isActive && (
          <button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isListening 
                ? 'bg-red-500/20 border border-red-400 text-red-300' 
                : 'bg-blue-500/20 border border-blue-400 text-blue-300 hover:bg-blue-500/30'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isListening ? '🎤 Słucham...' : '🎙️ Zapytaj o BONZO'}
          </button>
        )}

        {/* Status Display */}
        {isActive && (
          <div className="text-center space-y-2">
            {isSpeaking && (
              <div className="text-blue-300 text-sm animate-pulse">
                🗣️ POLACZEK mówi...
              </div>
            )}
            
            {currentMessage && (
              <div className="max-w-xs text-xs text-gray-400 bg-gray-800/50 rounded p-2 border border-gray-600">
                {currentMessage}
              </div>
            )}
          </div>
        )}

        {/* Conversation History */}
        {isActive && conversationHistory.length > 0 && (
          <div className="w-full max-w-md space-y-2 max-h-40 overflow-y-auto">
            {conversationHistory.slice(-3).map((msg, index) => (
              <div
                key={index}
                className={`
                  text-xs p-2 rounded border
                  ${msg.type === 'user' 
                    ? 'bg-green-900/20 border-green-600/50 text-green-300 ml-4' 
                    : 'bg-blue-900/20 border-blue-600/50 text-blue-300 mr-4'
                  }
                `}
              >
                <strong>{msg.type === 'user' ? '👤' : '🤖'}:</strong> {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistantPolaczek;