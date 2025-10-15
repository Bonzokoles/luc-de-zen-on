import React, { useState, useRef, useEffect, useCallback } from "react";
import "./AdvancedGoogleVoiceChat.css";

interface AdvancedGoogleVoiceChatProps {
  className?: string;
}

interface Message {
  type: "user" | "assistant" | "system";
  text: string;
  timestamp: Date;
  audioUrl?: string;
  confidence?: number;
}

const AdvancedGoogleVoiceChat: React.FC<AdvancedGoogleVoiceChatProps> = ({
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [language, setLanguage] = useState("pl-PL");
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: "pl-PL-Wavenet-A",
  });

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Google Cloud Speech-to-Text configuration
  const initializeGoogleSpeechAPI = useCallback(async () => {
    try {
      // Initialize Google Cloud Speech API
      const response = await fetch("/api/google-cloud/initialize-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });

      if (response.ok) {
        setIsConnected(true);
        addMessage(
          "system",
          "Google Cloud Speech API połączony pomyślnie",
          new Date()
        );
      }
    } catch (error) {
      console.error("Błąd inicjalizacji Google Speech API:", error);
      addMessage(
        "system",
        "Używam lokalny Speech Recognition jako fallback",
        new Date()
      );
      initializeLocalSpeechRecognition();
    }
  }, [language]);

  // Local Speech Recognition fallback
  const initializeLocalSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 3;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        addMessage("system", "Słucham...", new Date());
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setCurrentMessage(interimTranscript);

        if (finalTranscript) {
          const confidence =
            event.results[event.resultIndex]?.[0]?.confidence || 0;
          addMessage(
            "user",
            finalTranscript,
            new Date(),
            undefined,
            confidence
          );
          handleUserInput(finalTranscript);
          setCurrentMessage("");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        addMessage(
          "system",
          `Błąd rozpoznawania mowy: ${event.error}`,
          new Date()
        );
      };
    }
  };

  // Audio level monitoring
  const initializeAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyzerRef.current = audioContextRef.current.createAnalyser();

      analyzerRef.current.fftSize = 256;
      source.connect(analyzerRef.current);

      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyzerRef.current) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((sum, value) => sum + value) / dataArray.length;
          setAudioLevel(average);

          if (isListening) {
            requestAnimationFrame(updateAudioLevel);
          }
        }
      };

      updateAudioLevel();
    } catch (error) {
      console.error("Błąd dostępu do mikrofonu:", error);
    }
  };

  // Enhanced Google Cloud Text-to-Speech
  const speakWithGoogleTTS = async (text: string) => {
    try {
      setIsSpeaking(true);

      const response = await fetch("/api/google-cloud/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: voiceSettings.voice,
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: voiceSettings.rate,
            pitch: voiceSettings.pitch,
            volumeGainDb: voiceSettings.volume * 20 - 20,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
        return audioUrl;
      } else {
        // Fallback to Web Speech API
        return speakWithWebAPI(text);
      }
    } catch (error) {
      console.error("Google TTS Error:", error);
      return speakWithWebAPI(text);
    }
  };

  // Web Speech API fallback
  const speakWithWebAPI = (text: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = voiceSettings.rate;
        utterance.pitch = voiceSettings.pitch;
        utterance.volume = voiceSettings.volume;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve(undefined);
        };

        speechSynthesis.speak(utterance);
        synthRef.current = utterance;
      } else {
        setIsSpeaking(false);
        resolve(undefined);
      }
    });
  };

  // Enhanced AI response with Google Cloud AI
  const handleUserInput = async (input: string) => {
    try {
      // Send to enhanced AI with Google Cloud integration
      const response = await fetch("/api/ai/advanced-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: conversationHistory,
          language,
          context: "mybonzo-platform",
          features: ["speech", "sentiment", "translation"],
        }),
      });

      if (response.ok) {
        interface AdvancedChatResponse {
          response: string;
        }
        const data = await response.json() as AdvancedChatResponse;
        const aiResponse = data.response;

        addMessage("assistant", aiResponse, new Date());

        // Speak the response
        const audioUrl = await speakWithGoogleTTS(aiResponse);

        // Update the message with audio URL if available
        if (audioUrl) {
          setConversationHistory((prev) =>
            prev.map((msg) =>
              msg.text === aiResponse && msg.type === "assistant"
                ? { ...msg, audioUrl }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("AI Response Error:", error);
      const fallbackResponse =
        "Przepraszam, wystąpił problem z połączeniem. Spróbuj ponownie.";
      addMessage("assistant", fallbackResponse, new Date());
      speakWithWebAPI(fallbackResponse);
    }
  };

  const addMessage = (
    type: Message["type"],
    text: string,
    timestamp: Date,
    audioUrl?: string,
    confidence?: number
  ) => {
    const message: Message = { type, text, timestamp, audioUrl, confidence };
    setConversationHistory((prev) => [...prev, message]);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      initializeAudioMonitoring();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const clearConversation = () => {
    setConversationHistory([]);
    addMessage("system", "Konwersacja wyczyszczona", new Date());
  };

  // Initialize on mount
  useEffect(() => {
    initializeGoogleSpeechAPI();
    initializeLocalSpeechRecognition();

    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [initializeGoogleSpeechAPI]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`advanced-voice-chat ${className}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="header-info">
          <h3>🎤 Advanced Google Voice Chat</h3>
          <div className="connection-status">
            <span
              className={`status-dot ${
                isConnected ? "connected" : "disconnected"
              }`}
            ></span>
            {isConnected ? "Google Cloud AI" : "Local API"}
          </div>
        </div>

        <div className="voice-controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
            title="Wybór języka dla rozpoznawania mowy"
          >
            <option value="pl-PL">Polski</option>
            <option value="en-US">English</option>
            <option value="de-DE">Deutsch</option>
            <option value="es-ES">Español</option>
            <option value="fr-FR">Français</option>
          </select>

          <button onClick={clearConversation} className="clear-btn">
            🗑️ Wyczyść
          </button>
        </div>
      </div>

      {/* Audio Level Indicator */}
      {isListening && (
        <div className="audio-level-container">
          <div className="audio-level-bar">
            <div
              className="audio-level-fill"
              data-level={Math.round((audioLevel / 255) * 100)}
            ></div>
          </div>
          <span className="audio-level-text">
            Poziom audio: {Math.round(audioLevel)}
          </span>
        </div>
      )}

      {/* Current Message Preview */}
      {currentMessage && (
        <div className="current-message-preview">
          <span className="typing-indicator">💭</span>
          {currentMessage}
        </div>
      )}

      {/* Conversation History */}
      <div className="conversation-container">
        {conversationHistory.map((message, index) => (
          <div key={index} className={`message message-${message.type}`}>
            <div className="message-header">
              <span className="message-sender">
                {message.type === "user"
                  ? "👤"
                  : message.type === "assistant"
                  ? "🤖"
                  : "⚙️"}
                {message.type === "user"
                  ? "Ty"
                  : message.type === "assistant"
                  ? "AI Assistant"
                  : "System"}
              </span>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
              {message.confidence && (
                <span className="confidence-score">
                  ✓{Math.round(message.confidence * 100)}%
                </span>
              )}
            </div>
            <div className="message-content">
              {message.text}
              {message.audioUrl && (
                <audio controls className="message-audio">
                  <source src={message.audioUrl} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Voice Controls */}
      <div className="voice-control-panel">
        <button
          className={`voice-btn primary ${isListening ? "listening" : ""}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
        >
          {isListening ? "⏹️ Zatrzymaj" : "🎤 Mów"}
        </button>

        {isSpeaking && (
          <button className="voice-btn secondary" onClick={stopSpeaking}>
            🔇 Przerwij mówienie
          </button>
        )}

        <div className="status-indicators">
          {isListening && (
            <span className="status-indicator listening">🎤 Słucham</span>
          )}
          {isSpeaking && (
            <span className="status-indicator speaking">🔊 Mówię</span>
          )}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="voice-settings">
        <h4>Ustawienia głosu</h4>
        <div className="settings-grid">
          <div className="setting-group">
            <label>Szybkość: {voiceSettings.rate}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) =>
                setVoiceSettings((prev) => ({
                  ...prev,
                  rate: parseFloat(e.target.value),
                }))
              }
              title="Kontrola szybkości mowy"
              aria-label="Szybkość mowy"
            />
          </div>

          <div className="setting-group">
            <label>Wysokość: {voiceSettings.pitch}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) =>
                setVoiceSettings((prev) => ({
                  ...prev,
                  pitch: parseFloat(e.target.value),
                }))
              }
              title="Kontrola wysokości głosu"
              aria-label="Wysokość głosu"
            />
          </div>

          <div className="setting-group">
            <label>Głośność: {Math.round(voiceSettings.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) =>
                setVoiceSettings((prev) => ({
                  ...prev,
                  volume: parseFloat(e.target.value),
                }))
              }
              title="Kontrola głośności mowy"
              aria-label="Głośność mowy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedGoogleVoiceChat;
