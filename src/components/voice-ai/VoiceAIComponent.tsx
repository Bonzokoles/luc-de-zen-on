import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloudflareVoiceAI } from '../../lib/cloudflare-voice-ai';

interface VoiceMetrics {
  volume: number;
  rms: number;
  peak: number;
  voiceActive: boolean;
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  timestamp: number;
}

interface VoiceAIComponentProps {
  variant?: 'hero' | 'compact' | 'floating';
  className?: string;
}

export function VoiceAIComponent({ variant = 'hero', className = '' }: VoiceAIComponentProps) {
  // Voice AI State
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics>({
    volume: 0,
    rms: 0,
    peak: 0,
    voiceActive: false,
    latency: 0,
    quality: 'excellent',
    timestamp: 0
  });
  
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const voiceAIRef = useRef<CloudflareVoiceAI | null>(null);
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'py-20 my-10',
          wrapper: 'max-w-6xl mx-auto border-x border-gray-800 bg-black/50 backdrop-blur-sm',
          content: 'container mx-auto text-center px-8',
          title: 'text-4xl font-bold mb-4 text-white/85',
          description: 'text-lg mb-8 max-w-2xl mx-auto text-gray-300'
        };
      case 'compact':
        return {
          container: 'py-8 my-4',
          wrapper: 'max-w-4xl mx-auto border border-gray-700 bg-black/30 backdrop-blur-sm rounded-lg',
          content: 'p-6 text-center',
          title: 'text-2xl font-bold mb-3 text-white/85',
          description: 'text-sm mb-4 text-gray-400'
        };
      default:
        return getVariantStyles(); // fallback to hero
    }
  };

  const styles = getVariantStyles();

  // Initialize Voice AI
  const initializeVoiceAI = async () => {
    try {
      if (voiceAIRef.current) {
        voiceAIRef.current.disconnect();
      }

      const voiceAI = new CloudflareVoiceAI({
        model: '@cf/deepgram/nova-3',
        voice: '@cf/deepgram/aura-1',
        language: 'pl',
        enableRealtime: true
      });

      // Setup event handlers
      voiceAI.onConnectionChange = (connected) => {
        setIsConnected(connected);
        setConnectionError(connected ? null : 'Połączenie przerwane');
      };

      voiceAI.onTranscription = (text) => {
        setTranscriptions(prev => [...prev.slice(-4), text]);
      };

      voiceAI.onMetricsUpdate = (metrics) => {
        setVoiceMetrics(metrics);
      };

      voiceAI.onError = (error) => {
        setConnectionError(error);
        console.error('Voice AI Error:', error);
      };

      await voiceAI.initialize();
      voiceAIRef.current = voiceAI;
      
    } catch (error) {
      setConnectionError(`Nie udało się połączyć: ${error}`);
      console.error('Failed to initialize Voice AI:', error);
    }
  };

  // Audio visualization
  useEffect(() => {
    if (!visualizerRef.current) return;

    const canvas = visualizerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrame: number;

    const draw = () => {
      animationFrame = requestAnimationFrame(draw);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barCount = variant === 'compact' ? 16 : 32;
      const barWidth = canvas.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const intensity = voiceMetrics.voiceActive ? 
          voiceMetrics.volume * (0.5 + 0.5 * Math.sin(Date.now() * 0.01 + i * 0.3)) :
          voiceMetrics.volume * 0.1;
          
        const barHeight = (intensity / 100) * canvas.height;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        if (voiceMetrics.voiceActive && isRecording) {
          gradient.addColorStop(0, 'hsl(120, 70%, 50%)');
          gradient.addColorStop(1, 'hsl(160, 70%, 70%)');
        } else {
          gradient.addColorStop(0, 'hsl(220, 50%, 40%)');
          gradient.addColorStop(1, 'hsl(260, 50%, 60%)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }
    };
    
    draw();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [voiceMetrics, isRecording, variant]);

  // Toggle recording
  const toggleRecording = async () => {
    if (!voiceAIRef.current) {
      await initializeVoiceAI();
      return;
    }

    try {
      if (isRecording) {
        voiceAIRef.current.stopRecording();
        setIsRecording(false);
      } else {
        await voiceAIRef.current.startRecording();
        setIsRecording(true);
      }
    } catch (error) {
      setConnectionError(`Błąd nagrywania: ${error}`);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceAIRef.current) {
        voiceAIRef.current.disconnect();
      }
    };
  }, []);

  const canvasHeight = variant === 'compact' ? 60 : 120;

  return (
    <section id="voice-ai-section" className={`${styles.container} ${className}`}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {/* Highlight line */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mb-6"></div>
          
          <h2 className={styles.title}>
            Voice AI Assistant
          </h2>
          <p className={styles.description}>
            Rozmawiaj z AI za pomocą głosu. Kliknij i zacznij mówić.
          </p>

          {/* Audio Visualizer */}
          <div className="mb-6">
            <canvas
              ref={visualizerRef}
              width={variant === 'compact' ? 300 : 600}
              height={canvasHeight}
              className="w-full max-w-lg mx-auto border border-gray-700 rounded bg-gray-900/50"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              onClick={toggleRecording}
              disabled={!isConnected && !!connectionError}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                ${isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }
                ${(!isConnected && !!connectionError) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-white/70'}`} />
              {isRecording ? 'Zatrzymaj' : 'Rozpocznij rozmowę'}
            </button>

            {/* Connection Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                {isConnected ? 'Połączono' : 'Rozłączono'}
              </span>
            </div>
          </div>

          {/* Voice Metrics */}
          {isConnected && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-400 mb-6">
              <div className="text-center">
                <div className="text-white font-medium">{voiceMetrics.volume.toFixed(0)}%</div>
                <div>Głośność</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium">{voiceMetrics.latency}ms</div>
                <div>Opóźnienie</div>
              </div>
              <div className="text-center">
                <div className={`font-medium ${voiceMetrics.voiceActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {voiceMetrics.voiceActive ? 'TAK' : 'NIE'}
                </div>
                <div>Głos aktywny</div>
              </div>
              <div className="text-center">
                <div className={`font-medium ${
                  voiceMetrics.quality === 'excellent' ? 'text-green-400' :
                  voiceMetrics.quality === 'good' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {voiceMetrics.quality}
                </div>
                <div>Jakość</div>
              </div>
            </div>
          )}

          {/* Recent Transcriptions */}
          {transcriptions.length > 0 && (
            <div className="max-w-lg mx-auto">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Ostatnie transkrypcje:</h3>
              <div className="space-y-1 text-sm text-gray-300">
                {transcriptions.slice(-3).map((text, index) => (
                  <div key={index} className="p-2 bg-gray-800/50 rounded">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {connectionError && (
            <div className="max-w-lg mx-auto p-3 bg-red-900/50 border border-red-600 rounded text-red-300 text-sm">
              {connectionError}
              <button 
                onClick={initializeVoiceAI}
                className="ml-2 underline hover:no-underline"
              >
                Spróbuj ponownie
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
