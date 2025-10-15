import React, { useState, useRef, useEffect } from "react";
import "./TransformersVoiceAI.module.css";

// @ts-ignore - Transformers.js types
import { pipeline } from "@xenova/transformers";

interface TransformersVoiceAIProps {
  className?: string;
}

export default function TransformersVoiceAI({
  className = "",
}: TransformersVoiceAIProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const synthesizerRef = useRef<any | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize SpeechT5 model
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load SpeechT5 TTS model with speaker embeddings
        const synthesizer = await pipeline(
          "text-to-speech",
          "Xenova/speecht5_tts",
          {
            quantized: false,
          }
        );

        synthesizerRef.current = synthesizer;
        setIsModelLoaded(true);
        console.log("SpeechT5 model loaded successfully");
      } catch (err) {
        console.error("Failed to load SpeechT5 model:", err);
        setError("Nie udało się załadować modelu SpeechT5");

        // Fallback to CPU if WebGPU fails
        try {
          const synthesizer = await pipeline(
            "text-to-speech",
            "Xenova/speecht5_tts",
            {
              quantized: true,
            }
          );
          synthesizerRef.current = synthesizer;
          setIsModelLoaded(true);
          console.log("SpeechT5 model loaded on CPU (fallback)");
        } catch (fallbackErr) {
          console.error("CPU fallback also failed:", fallbackErr);
          setError("Model SpeechT5 nie może zostać załadowany");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeModel();
  }, []);

  const synthesizeSpeech = async (inputText: string) => {
    if (!synthesizerRef.current || !inputText.trim()) {
      setError("Brak modelu lub pustego tekstu");
      return;
    }

    try {
      setIsSpeaking(true);
      setError(null);

      // Generate speech using SpeechT5
      const result = await synthesizerRef.current(inputText, {
        speaker_embeddings:
          "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin",
      });

      // Convert audio data to playable format
      const audio = result.audio;
      const sampleRate = result.sampling_rate || 16000;

      // Create AudioBuffer
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const audioBuffer = audioContext.createBuffer(
        1,
        audio.length,
        sampleRate
      );
      audioBuffer.copyToChannel(audio, 0);

      // Convert to WAV blob for HTML audio element
      const wavBlob = audioBufferToWav(audioBuffer);
      const audioUrl = URL.createObjectURL(wavBlob);

      // Play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error("Speech synthesis error:", err);
      setError("Błąd podczas syntezy mowy");
    } finally {
      setIsSpeaking(false);
    }
  };

  // Convert AudioBuffer to WAV blob
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const sampleRate = buffer.sampleRate;

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * 2, true);

    // Convert float32 to int16
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  const handleSpeak = () => {
    if (text.trim()) {
      synthesizeSpeech(text.trim());
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  return (
    <div className={`transformers-voice-ai ${className}`}>
      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} />

      <div className="voice-controls">
        <div className="input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Wprowadź tekst do syntezy mowy..."
            className="text-input"
            rows={3}
            disabled={!isModelLoaded}
          />
        </div>

        <div className="control-buttons">
          <button
            onClick={handleSpeak}
            disabled={!isModelLoaded || isSpeaking || !text.trim()}
            className="speak-btn"
          >
            {isSpeaking ? "🔊 Mówi..." : "🎤 Mów"}
          </button>

          <button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className="stop-btn"
          >
            ⏹️ Stop
          </button>
        </div>

        <div className="status-info">
          {isLoading && (
            <span className="loading">⏳ Ładowanie modelu SpeechT5...</span>
          )}
          {isModelLoaded && !isLoading && (
            <span className="ready">✅ Model gotowy</span>
          )}
          {error && <span className="error">❌ {error}</span>}
        </div>
      </div>
    </div>
  );
}
