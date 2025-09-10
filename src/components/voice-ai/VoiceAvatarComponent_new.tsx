import React, { useState, useRef, useEffect } from 'react';

interface VoiceAvatarProps {
  variant: 'hero' | 'compact' | 'floating';
  avatarSrc?: string; // Image/video source
  avatarType?: 'image' | 'video' | 'animated'; // Avatar type
  enableLipSync?: boolean; // Lip sync with speech
  className?: string;
}

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  error?: string;
}

const VoiceAvatarComponent: React.FC<VoiceAvatarProps> = ({
  variant = 'hero',
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
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('wss://your-voice-ai-endpoint.com/ws');
        
        wsRef.current.onopen = () => {
          console.log('🔗 Voice AI WebSocket connected');
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };

        wsRef.current.onclose = () => {
          console.log('🔌 Voice AI WebSocket disconnected');
          setTimeout(connectWebSocket, 3000); // Reconnect after 3s
        };

        wsRef.current.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          setVoiceState(prev => ({ ...prev, error: 'Connection failed' }));
        };
      } catch (error) {
        console.error('❌ Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'transcription':
        console.log('📝 Transcription:', data.text);
        setVoiceState(prev => ({ ...prev, isProcessing: true }));
        break;
      case 'response':
        console.log('💬 AI Response:', data.text);
        playAudioResponse(data.audioUrl);
        break;
      case 'error':
        console.error('❌ AI Error:', data.message);
        setVoiceState(prev => ({ ...prev, error: data.message, isProcessing: false }));
        break;
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendAudioToServer(audioBlob);
      };

      mediaRecorderRef.current.start();
      setVoiceState(prev => ({ ...prev, isListening: true, error: undefined }));
      
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('❌ Microphone access denied:', error);
      setVoiceState(prev => ({ ...prev, error: 'Microphone access denied' }));
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && voiceState.isListening) {
      mediaRecorderRef.current.stop();
      setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: true }));
      console.log('🛑 Recording stopped');
    }
  };

  const sendAudioToServer = (audioBlob: Blob) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
      reader.onload = () => {
        const audioData = reader.result as ArrayBuffer;
        wsRef.current?.send(JSON.stringify({
          type: 'audio',
          data: Array.from(new Uint8Array(audioData))
        }));
      };
      reader.readAsArrayBuffer(audioBlob);
    }
  };

  const playAudioResponse = (audioUrl: string) => {
    setVoiceState(prev => ({ ...prev, isSpeaking: true, isProcessing: false }));
    
    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };
    audio.play();
  };

  const toggleListening = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getStatusText = () => {
    if (voiceState.error) return voiceState.error;
    if (voiceState.isListening) return 'Słucham...';
    if (voiceState.isProcessing) return 'Przetwarzam...';
    if (voiceState.isSpeaking) return 'Mówię...';
    return 'Naciśnij aby rozmawiać';
  };

  const getStatusColor = () => {
    if (voiceState.error) return 'text-red-500';
    if (voiceState.isListening) return 'text-green-500';
    if (voiceState.isProcessing) return 'text-yellow-500';
    if (voiceState.isSpeaking) return 'text-blue-500';
    return 'text-gray-800';
  };

  // Avatar component with animation effects
  const AvatarDisplay = () => {
    const avatarClasses = `
      ${variant === 'hero' ? 'w-48 h-48' : variant === 'compact' ? 'w-24 h-24' : 'w-16 h-16'}
      border border-gray-400 opacity-75 shadow-lg hover:shadow-xl
      ${voiceState.isSpeaking ? 'animate-pulse shadow-blue-400' : ''}
      ${voiceState.isListening ? 'ring-2 ring-green-400 ring-opacity-50 shadow-green-400' : ''}
      transition-all duration-300
    `;

    if (avatarType === 'video') {
      return (
        <video 
          className={avatarClasses}
          src={avatarSrc}
          autoPlay
          muted
          loop
        />
      );
    }

    return (
      <img 
        className={avatarClasses}
        src={avatarSrc}
        alt="AI Avatar"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-avatar.jpg';
        }}
      />
    );
  };

  // Render different variants
  switch (variant) {
    case 'hero':
      return (
        <div className={`${className}`}>
          {/* Avatar and microphone fixed in top-left corner */}
          <div className="fixed top-6 left-6 z-50">
            <div className="flex flex-col items-center">
              <AvatarDisplay />
              
              {/* Microphone button directly under the avatar */}
              <button
                onClick={toggleListening}
                disabled={voiceState.isProcessing}
                className="mt-2 hover:bg-gray-200 text-black border border-gray-400 px-4 py-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100 2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{voiceState.isListening ? 'Stop' : 'Talk'}</span>
              </button>
              
              <p className={`text-xs mt-1 text-center ${getStatusColor()}`}>
                {getStatusText()}
              </p>
            </div>
          </div>
        </div>
      );

    case 'compact':
      return (
        <div className={`p-4 ${className}`}>
          <div className="flex items-center space-x-4">
            <AvatarDisplay />
            
            <div className="flex-1">
              <button
                onClick={toggleListening}
                disabled={voiceState.isProcessing}
                className="hover:bg-gray-200 text-black border border-gray-400 px-4 py-2 text-sm transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100 2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>{voiceState.isListening ? 'Stop' : 'Talk'}</span>
              </button>
              
              <p className={`text-xs mt-1 ${getStatusColor()}`}>
                {getStatusText()}
              </p>
            </div>
          </div>
        </div>
      );

    case 'floating':
      return (
        <div className={`fixed bottom-6 right-6 ${className}`}>
          <div className="relative">
            <AvatarDisplay />
            
            <button
              onClick={toggleListening}
              disabled={voiceState.isProcessing}
              className="absolute -bottom-2 -right-2 hover:bg-gray-200 text-black border border-gray-400 p-2 transition-all duration-200 disabled:opacity-50"
            >
              <svg className="w-4 h-4 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100 2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
            
            {voiceState.isListening && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-100 text-black border border-gray-300 px-2 py-1 text-xs whitespace-nowrap">
                {getStatusText()}
              </div>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default VoiceAvatarComponent;
