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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      setTranscript('🎤 Nagrywam...');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setTranscript('❌ Błąd dostępu do mikrofonu');
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
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.response;
        
        setTranscript(prev => `${prev.replace('🤖 Agent myśli...', '')}\n🤖 Agent: ${aiResponse}`);
        
        // AUTOMATYCZNIE ODTWÓRZ ODPOWIEDŹ GŁOSEM
        await speakResponse(aiResponse);
      } else {
        setTranscript(prev => `${prev.replace('🤖 Agent myśli...', '')}\n❌ Agent nie odpowiedział`);
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      setTranscript(prev => `${prev.replace('🤖 Agent myśli...', '')}\n❌ Błąd AI`);
    }
  };

  // Text-to-Speech - agent odpowiada głosem
  const speakResponse = async (text: string) => {
    try {
      console.log('🔊 Agent odpowiada głosem:', text);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Tutaj będzie integracja z Cloudflare AI
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('/api/voice/recognition', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        const userMessage = result.transcript || 'Nie rozpoznano mowy';
        setTranscript(`Ty: ${userMessage}`);
        
        // DODAJEMY AI RESPONSE - Agent odpowiada automatycznie!
        if (userMessage && userMessage !== 'Nie rozpoznano mowy') {
          await handleAIResponse(userMessage);
        }
      } else {
        setTranscript('❌ Błąd przetwarzania');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscript('❌ Błąd połączenia');
    }
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setTranscript('✅ Połączono z Voice AI');
    } else {
      setTranscript('❌ Rozłączono');
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
