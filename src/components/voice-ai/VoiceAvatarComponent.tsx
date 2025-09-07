import React, { useState, useRef } from 'react';

interface VoiceAvatarProps {
  variant: 'hero' | 'compact' | 'floating';
  avatarSrc?: string;
  avatarType?: 'image' | 'video' | 'animated';
  enableLipSync?: boolean;
  className?: string;
}

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  error?: string;
}

const VoiceAvatarComponent: React.FC<VoiceAvatarProps> = ({
  variant = 'floating',
  avatarSrc = '/placeholder-avatar.jpg',
  avatarType = 'image',
  enableLipSync = false,
  className = ''
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Voice AI Worker endpoint
  const VOICE_AI_ENDPOINT = 'https://voice-ai-worker-production.lissonkarol-msa.workers.dev/voice-ai';

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:audio/wav;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendAudioToAI = async (audioBlob: Blob) => {
    try {
      setVoiceState(prev => ({ ...prev, isProcessing: true }));
      console.log('🚀 Sending audio to Voice AI...', audioBlob.type, audioBlob.size);
      
      // Convert to base64 for better compatibility
      const base64Audio = await blobToBase64(audioBlob);
      
      // Send to transcription
      const transcribeResponse = await fetch(VOICE_AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'transcribe',
          data: base64Audio,
          language: 'pl'
        })
      });
      
      const transcribeResult = await transcribeResponse.json();
      console.log('📝 Transcription:', transcribeResult);
      
      if (transcribeResult.success && transcribeResult.transcription) {
        // Send to chat completion
        const chatResponse = await fetch(VOICE_AI_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat_completion',
            data: transcribeResult.transcription
          })
        });
        
        const chatResult = await chatResponse.json();
        console.log('💬 AI Response:', chatResult);
        
        if (chatResult.success && chatResult.response) {
          // Generate speech
          const speechResponse = await fetch(VOICE_AI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'generate_speech',
              data: chatResult.response
            })
          });
          
          if (speechResponse.ok) {
            const audioData = await speechResponse.blob();
            playAudioResponse(audioData);
          }
        }
      }
      
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    } catch (error) {
      console.error('❌ Voice AI Error:', error);
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Błąd komunikacji z AI', 
        isProcessing: false 
      }));
    }
  };

  const playAudioResponse = (audioBlob: Blob) => {
    try {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
      console.log('🔊 Playing AI response...');
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
        URL.revokeObjectURL(audioUrl);
        console.log('✅ Audio playback finished');
      };
      
      audio.play();
    } catch (error) {
      console.error('❌ Audio playback error:', error);
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const startListening = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('📼 Audio recorded, size:', audioBlob.size, 'bytes');
        sendAudioToAI(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000); // Record in 1s chunks
      setVoiceState(prev => ({ ...prev, isListening: true, error: undefined }));
      
      console.log('🔴 Recording started...');
    } catch (error) {
      console.error('❌ Microphone access error:', error);
      setVoiceState(prev => ({ ...prev, error: 'Brak dostępu do mikrofonu' }));
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setVoiceState(prev => ({ ...prev, isListening: false }));
      console.log('⏹️ Recording stopped');
    }
  };

  const toggleListening = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Avatar component
  const AvatarDisplay = () => (
    <div className="w-52 h-52 relative overflow-hidden border border-yellow-600 shadow-lg shadow-yellow-600/20 bg-gray-800 rounded">
      {avatarType === 'image' && (
        <img
          src={avatarSrc}
          alt="AI Avatar"
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Speaking indicator */}
      {voiceState.isSpeaking && (
        <div className="absolute inset-0 border-2 border-green-400 animate-pulse rounded" />
      )}
      
      {/* Processing indicator */}
      {voiceState.isProcessing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}

      {/* Listening indicator */}
      {voiceState.isListening && (
        <div className="absolute inset-0 border-2 border-red-500 animate-pulse rounded" />
      )}
    </div>
  );

  return (
    <div className="fixed top-6 left-6 z-50 flex flex-col items-center space-y-5">
      <AvatarDisplay />
      
      <button
        onClick={toggleListening}
        disabled={voiceState.isProcessing}
        title={voiceState.isListening ? "Zatrzymaj nagrywanie" : "Rozpocznij nagrywanie"}
        className={`
          w-52 h-10 flex items-center justify-center
          border border-yellow-600 shadow-lg shadow-yellow-600/20
          transition-all duration-200 transform hover:scale-105
          ${voiceState.isListening 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-black hover:bg-gray-800'
          }
          ${voiceState.isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'text-white shadow-lg'
          }
        `}
      >
        {voiceState.isListening ? '🛑' : '🎤'}
      </button>

      {/* Status display */}
      {voiceState.error && (
        <p className="text-red-400 text-base max-w-52 text-center bg-black bg-opacity-50 px-3 rounded">
          {voiceState.error}
        </p>
      )}
      
      {voiceState.isProcessing && (
        <p className="text-yellow-400 text-base max-w-52 text-center bg-black bg-opacity-50 px-3 rounded">
          Przetwarzanie...
        </p>
      )}
    </div>
  );
};

export default VoiceAvatarComponent;
