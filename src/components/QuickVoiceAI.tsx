import React, { useState, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface QuickVoiceAIProps {
  variant?: 'hero' | 'compact' | 'floating';
}

export default function QuickVoiceAI({ variant = 'compact' }: QuickVoiceAIProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Check microphone permissions first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setTranscript('❌ Przeglądarka nie obsługuje nagrywania audio');
        return;
      }

      // Check permissions state
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permissionStatus.state === 'denied') {
        setTranscript('❌ Brak dostępu do mikrofonu - sprawdź ustawienia przeglądarki');
        return;
      }

      setTranscript('🔄 Łączenie z mikrofonem...');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        console.warn('WEBM/Opus not supported, falling back to default format');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Validate audio blob
        if (audioBlob.size === 0) {
          setTranscript('❌ Nie udało się nagrać audio - spróbuj ponownie');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        console.log(`🎤 Nagranie zakończone: ${audioBlob.size} bytes`);
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setTranscript('❌ Błąd podczas nagrywania');
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      setTranscript('🎤 Nagrywam... (mów teraz)');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setTranscript('❌ Dostęp do mikrofonu został odrzucony');
        } else if (error.name === 'NotFoundError') {
          setTranscript('❌ Nie znaleziono mikrofonu');
        } else if (error.name === 'NotSupportedError') {
          setTranscript('❌ Nagrywanie audio nie jest obsługiwane');
        } else {
          setTranscript(`❌ Błąd dostępu do mikrofonu: ${error.message}`);
        }
      } else {
        setTranscript('❌ Nieznany błąd mikrofonu');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setTranscript('⏳ Przetwarzam...');
    }
  };

  // Agent AI Response - automatyczne odpowiadanie głosem
  const handleAIResponse = async (userMessage: string) => {
    try {
      setTranscript(prev => `${prev}\n🤖 Agent myśli...`);
      
      const response = await fetch('/api/ai/advanced-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: 'pl-PL',
          context: 'mybonzo-voice-chat',
          features: ['speech', 'voice-response']
        }),
        signal: AbortSignal.timeout(15000) // 15s timeout for AI
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API Error ${response.status}: ${errorData.error || 'AI service unavailable'}`);
      }

      const data = await response.json();
      
      if (!data.success && !data.response) {
        throw new Error(data.error || 'AI response generation failed');
      }

      const aiResponse = data.response;
      
      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error('Empty AI response received');
      }
      
      console.log(`🤖 AI Agent odpowiada: "${aiResponse}"`);
      
      setTranscript(prev => `${prev.replace('🤖 Agent myśli...', '')}\n🤖 Agent: ${aiResponse}`);
      
      // AUTOMATYCZNIE ODTWÓRZ ODPOWIEDŹ GŁOSEM z retry mechanism
      await speakResponse(aiResponse);
      
    } catch (error) {
      console.error('AI Response Error:', error);
      
      let errorMessage = '❌ Błąd AI';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '❌ AI zbyt długo myśli - spróbuj ponownie';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = '❌ Błąd połączenia z AI - sprawdź internet';
        } else if (error.message.includes('500')) {
          errorMessage = '❌ Błąd serwera AI - spróbuj za chwilę';
        } else {
          errorMessage = `❌ Błąd AI: ${error.message}`;
        }
      }
      
      setTranscript(prev => `${prev.replace('🤖 Agent myśli...', '')}\n${errorMessage}`);
    }
  };

  // Text-to-Speech - agent odpowiada głosem z wizualizacją
  const speakResponse = async (text: string) => {
    try {
      console.log('🔊 Agent odpowiada głosem:', text);
      
      if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis not supported in this browser');
        setTranscript(prev => `${prev}\n⚠️ Przeglądarka nie obsługuje syntezatora mowy`);
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Wait a bit for cancellation to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Emit event for AI visualizer when speaking starts
      utterance.onstart = () => {
        console.log('🔊 TTS started');
        window.dispatchEvent(new CustomEvent('ai-voice-start', { 
          detail: { text, duration: text.length * 100 } 
        }));
      };
      
      // Stop visualizer when speech ends
      utterance.onend = () => {
        console.log('🔊 TTS ended');
        window.dispatchEvent(new CustomEvent('ai-voice-end'));
      };

      // Handle TTS errors
      utterance.onerror = (event) => {
        console.error('TTS Error:', event);
        window.dispatchEvent(new CustomEvent('ai-voice-end'));
        setTranscript(prev => `${prev}\n⚠️ Błąd podczas odtwarzania głosu`);
      };

      // Retry mechanism for TTS
      let attempts = 0;
      const maxAttempts = 3;
      
      const trySpeak = () => {
        attempts++;
        console.log(`🔊 TTS attempt ${attempts}/${maxAttempts}`);
        
        speechSynthesis.speak(utterance);
        
        // Fallback if TTS doesn't start within 2 seconds
        setTimeout(() => {
          if (speechSynthesis.speaking || speechSynthesis.pending) {
            return; // TTS is working
          }
          
          if (attempts < maxAttempts) {
            console.warn(`TTS attempt ${attempts} failed, retrying...`);
            trySpeak();
          } else {
            console.error('TTS failed after all attempts');
            setTranscript(prev => `${prev}\n❌ Nie udało się odtworzyć głosu`);
          }
        }, 2000);
      };
      
      trySpeak();
      
    } catch (error) {
      console.error('TTS Error:', error);
      setTranscript(prev => `${prev}\n❌ Błąd syntezatora mowy`);
      
      // Ensure visualizer stops even on error
      window.dispatchEvent(new CustomEvent('ai-voice-end'));
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setTranscript('⏳ Przetwarzam audio z Google Cloud...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'pl-PL');
      
      const response = await fetch('/api/voice/recognition', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(30000) // 30s timeout
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Voice recognition failed');
      }

      const userMessage = result.transcript || 'Nie rozpoznano mowy';
      const confidence = result.confidence || 0;
      
      console.log(`🎤 Rozpoznano: "${userMessage}" (pewność: ${confidence}%)`);
      
      setTranscript(`Ty: ${userMessage} (${confidence}%)`);
      
      // Auto-respond only if confidence is high enough
      if (userMessage && userMessage !== 'Nie rozpoznano mowy' && confidence > 50) {
        await handleAIResponse(userMessage);
      } else if (confidence <= 50) {
        setTranscript(prev => `${prev}\n⚠️ Niska pewność rozpoznania - spróbuj mówić wyraźniej`);
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setTranscript('❌ Przekroczono czas oczekiwania - spróbuj ponownie');
        } else if (error.message.includes('network')) {
          setTranscript('❌ Błąd sieci - sprawdź połączenie internetowe');
        } else {
          setTranscript(`❌ Błąd przetwarzania: ${error.message}`);
        }
      } else {
        setTranscript('❌ Nieznany błąd podczas przetwarzania audio');
      }
    }
  };

  const toggleConnection = async () => {
    if (!isConnected) {
      // Connecting - check permissions and capabilities
      try {
        setTranscript('🔄 Sprawdzanie uprawnień...');
        
        // Check if required APIs are available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Przeglądarka nie obsługuje nagrywania audio');
        }

        if (!('speechSynthesis' in window)) {
          console.warn('Speech Synthesis not available - TTS will be limited');
        }

        // Check microphone permission
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          console.log(`Microphone permission: ${permissionStatus.state}`);
          
          if (permissionStatus.state === 'denied') {
            throw new Error('Dostęp do mikrofonu został zablokowany w ustawieniach przeglądarki');
          }
        } catch (permError) {
          console.warn('Could not check microphone permission:', permError);
        }

        // Test API connectivity
        setTranscript('🔄 Testowanie połączenia z API...');
        
        const apiTest = await fetch('/api/voice/recognition', {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        
        if (!apiTest.ok) {
          throw new Error('API Voice Recognition niedostępne');
        }

        const apiInfo = await apiTest.json();
        console.log('API Voice Recognition capabilities:', apiInfo);
        
        // Test AI endpoint
        const aiTest = await fetch('/api/ai/advanced-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'test', language: 'pl-PL' }),
          signal: AbortSignal.timeout(5000)
        });

        if (!aiTest.ok) {
          console.warn('AI Chat API may be unavailable');
        }

        setIsConnected(true);
        setTranscript(`✅ Połączono z Voice AI\n🎤 Google Cloud Speech-to-Text: ${apiInfo.googleCloud?.enabled ? 'Aktywne' : 'Symulacja'}\n🤖 AI Chat: ${aiTest.ok ? 'Dostępny' : 'Ograniczony'}\n💬 Naciśnij "Rozpocznij nagrywanie" aby zacząć`);
        
      } catch (error) {
        console.error('Connection error:', error);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setTranscript('❌ Przekroczono czas połączenia - sprawdź internet');
          } else {
            setTranscript(`❌ Błąd połączenia: ${error.message}`);
          }
        } else {
          setTranscript('❌ Nieznany błąd podczas łączenia');
        }
        
        setIsConnected(false);
      }
    } else {
      // Disconnecting
      setIsConnected(false);
      setTranscript('❌ Rozłączono z Voice AI');
      
      // Stop any ongoing recording or speech
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }
  };

  const getButtonStyle = () => {
    const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105";
    
    if (isRecording) {
      return `${baseStyle} bg-red-500 hover:bg-red-600 text-white animate-pulse`;
    }
    
    if (isConnected) {
      return `${baseStyle} bg-green-500 hover:bg-green-600 text-white shadow-lg`;
    }
    
    return `${baseStyle} bg-blue-500 hover:bg-blue-600 text-white shadow-md`;
  };

  return (
    <div className="voice-ai-widget p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">🎤 MyBonzo Voice AI</h3>
        
        {/* Connection Button */}
        <button
          onClick={toggleConnection}
          className={`${getButtonStyle()} w-full max-w-sm`}
          disabled={isRecording}
        >
          {isConnected ? <Phone className="w-5 h-5" /> : <PhoneOff className="w-5 h-5" />}
          {isConnected ? 'Połączony' : 'Połącz'}
        </button>
        
        {/* Voice Recording Button */}
        {isConnected && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={getButtonStyle()}
            disabled={!isConnected}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isRecording ? 'Stop nagrywania' : 'Rozpocznij nagrywanie'}
          </button>
        )}
        
        {/* Transcript Display */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <p className="text-gray-300 text-sm">
            {transcript || '🎯 Naciśnij "Połącz" aby rozpocząć'}
          </p>
        </div>
        
        {/* Audio Visualizer */}
        {isRecording && (
          <div className="flex justify-center items-center space-x-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-blue-400 rounded-full animate-pulse h-${4 + (i % 3) * 2}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
