/**
 * COMPLETE VOICE AI ECOSYSTEM - REACT INTEGRATION
 * Przykład wykorzystania wszystkich zaawansowanych funkcji w React
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Cloudflare Agent Hook (simplified implementation)
interface AgentConfig {
  agent: string;
  name: string;
  onMessage: (event: MessageEvent) => void;
  onStateUpdate: (state: any) => void;
  onOpen: () => void;
  onClose: () => void;
  onError: (error: Error) => void;
}

interface Agent {
  send: (message: string) => void;
  close: () => void;
}

// Mock useAgent hook for demonstration
function useAgent(config: AgentConfig): Agent {
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // In production, this would connect to Cloudflare Agent
    const mockAgent = {
      send: (message: string) => {
        console.log('Sending to agent:', message);
        // Mock responses for demo
        setTimeout(() => {
          const parsed = JSON.parse(message);
          if (parsed.type === 'voice-input') {
            config.onMessage(new MessageEvent('message', {
              data: JSON.stringify({
                type: 'voice-response',
                messageId: crypto.randomUUID(),
                content: 'Mock voice response: I heard you say something.',
                voiceMetrics: {
                  volume: Math.random() * 100,
                  quality: 80 + Math.random() * 20,
                  latency: 20 + Math.random() * 30
                }
              })
            }));
          }
        }, 1000);
      },
      close: () => {
        console.log('Agent connection closed');
      }
    };
    
    // Simulate connection
    setTimeout(() => {
      config.onOpen();
      config.onMessage(new MessageEvent('message', {
        data: JSON.stringify({
          type: 'welcome',
          capabilities: ['voice', 'rag', 'browser', 'scheduling'],
          state: { isActive: true, connections: 1, messageCount: 0, activeWorkflows: 0 }
        })
      }));
    }, 100);
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [config]);
  
  return {
    send: (message: string) => {
      console.log('Mock agent send:', message);
    },
    close: () => {
      console.log('Mock agent close');
    }
  };
}

interface VoiceMetrics {
  volume: number;
  rms: number;
  peak: number;
  voiceActivity: boolean;
  latency: number;
  quality: number;
  clarity: number;
  backgroundNoise: number;
}

interface RAGResult {
  documents: Array<{
    id: string;
    content: string;
    score: number;
    metadata: any;
  }>;
  query: string;
  totalResults: number;
}

interface BrowserResult {
  success: boolean;
  data?: string;
  metadata?: {
    title?: string;
    url?: string;
    timestamp: Date;
    duration: number;
  };
}

interface ScheduledTask {
  id: string;
  type: string;
  scheduledFor: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export const AdvancedVoiceAIEcosystem: React.FC = () => {
  // State Management
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics>({
    volume: 0,
    rms: 0,
    peak: 0,
    voiceActivity: false,
    latency: 0,
    quality: 0,
    clarity: 0,
    backgroundNoise: 0
  });
  
  const [conversation, setConversation] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    voiceMetrics?: VoiceMetrics;
  }>>([]);
  
  const [ragResults, setRagResults] = useState<RAGResult | null>(null);
  const [browserResults, setBrowserResults] = useState<BrowserResult[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [agentStatus, setAgentStatus] = useState({
    isActive: false,
    connections: 0,
    messageCount: 0,
    activeWorkflows: 0
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<'hero' | 'compact' | 'floating'>('hero');
  const [useRAG, setUseRAG] = useState(true);
  const [useBrowser, setUseBrowser] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Agent Connection with useAgent hook
  const agent = useAgent({
    agent: "voice-agent",
    name: `user-${Date.now()}`, // Unique user identifier
    onMessage: handleAgentMessage,
    onStateUpdate: handleStateUpdate,
    onOpen: () => {
      console.log('🔗 Connected to Voice Agent');
      setAgentStatus(prev => ({ ...prev, isActive: true }));
    },
    onClose: () => {
      console.log('🔌 Disconnected from Voice Agent');
      setAgentStatus(prev => ({ ...prev, isActive: false }));
    },
    onError: (error) => {
      console.error('❌ Agent connection error:', error);
    }
  });

  // Message Handler
  function handleAgentMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'welcome':
          console.log('🎉 Agent capabilities:', message.capabilities);
          setAgentStatus(prev => ({ ...prev, ...message.state }));
          break;
          
        case 'voice-response':
          handleVoiceResponse(message);
          break;
          
        case 'text-response':
          handleTextResponse(message);
          break;
          
        case 'rag-response':
          handleRAGResponse(message);
          break;
          
        case 'browse-result':
          handleBrowserResult(message);
          break;
          
        case 'task-scheduled':
          handleTaskScheduled(message);
          break;
          
        case 'task-completed':
          handleTaskCompleted(message);
          break;
          
        case 'state-update':
          setAgentStatus(prev => ({ ...prev, ...message.state }));
          break;
          
        case 'audio-metrics':
          setVoiceMetrics(message.metrics);
          updateVisualization(message.metrics);
          break;
          
        case 'error':
          console.error('Agent error:', message.message);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse agent message:', error);
    }
  }

  // State Update Handler
  function handleStateUpdate(newState: any) {
    console.log('🔄 Agent state updated:', newState);
    setConversation(newState.messages || []);
    setVoiceMetrics(newState.voiceMetrics || voiceMetrics);
    setScheduledTasks(newState.scheduledTasks || []);
  }

  // Response Handlers
  function handleVoiceResponse(message: any) {
    const assistantMessage = {
      id: message.messageId,
      role: 'assistant' as const,
      content: message.content,
      timestamp: new Date(),
      voiceMetrics: message.voiceMetrics
    };
    
    setConversation(prev => [...prev, assistantMessage]);
    setVoiceMetrics(message.voiceMetrics);
    
    // Text-to-Speech (placeholder)
    speakText(message.content);
  }

  function handleTextResponse(message: any) {
    const assistantMessage = {
      id: message.messageId,
      role: 'assistant' as const,
      content: message.content,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, assistantMessage]);
  }

  function handleRAGResponse(message: any) {
    setRagResults({
      documents: message.sources.map((source: any) => ({
        id: source.id,
        content: `Score: ${source.score.toFixed(3)}`,
        score: source.score,
        metadata: source.metadata
      })),
      query: message.query,
      totalResults: message.sources.length
    });
    
    // Add RAG-enhanced response to conversation
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant' as const,
      content: `${message.response}\n\n📚 Based on ${message.sources.length} knowledge sources`,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, assistantMessage]);
  }

  function handleBrowserResult(message: any) {
    const result: BrowserResult = {
      success: message.result?.success || true,
      data: message.result?.data,
      metadata: {
        title: message.result?.title,
        url: message.url,
        timestamp: new Date(message.timestamp),
        duration: message.result?.duration || 0
      }
    };
    
    setBrowserResults(prev => [...prev, result]);
    
    // Add browser result to conversation
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant' as const,
      content: `🌐 Browser automation completed for ${message.url}\n\nAction: ${message.action}\nResult: ${result.success ? 'Success' : 'Failed'}`,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, assistantMessage]);
  }

  function handleTaskScheduled(message: any) {
    const task: ScheduledTask = {
      id: message.taskId,
      type: message.taskType,
      scheduledFor: new Date(message.scheduledFor),
      status: 'pending'
    };
    
    setScheduledTasks(prev => [...prev, task]);
    
    // Add confirmation to conversation
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant' as const,
      content: `⏰ Task scheduled: ${message.taskType}\nScheduled for: ${new Date(message.scheduledFor).toLocaleString()}\nTask ID: ${message.taskId}`,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, assistantMessage]);
  }

  function handleTaskCompleted(message: any) {
    setScheduledTasks(prev => 
      prev.map(task => 
        task.type === message.taskType 
          ? { ...task, status: 'completed' }
          : task
      )
    );
    
    // Add completion notification to conversation
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant' as const,
      content: `✅ Scheduled task completed: ${message.taskType}\nResult: ${message.result}`,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, assistantMessage]);
  }

  // Voice Recording Functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      
      // Start real-time audio analysis
      startAudioAnalysis(stream);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const startAudioAnalysis = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    microphone.connect(analyser);
    
    const analyze = () => {
      if (!isRecording) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate voice metrics
      const sum = dataArray.reduce((a, b) => a + b);
      const average = sum / bufferLength;
      const peak = Math.max(...dataArray);
      const rms = Math.sqrt(dataArray.reduce((acc, val) => acc + val * val, 0) / bufferLength);
      
      const metrics: VoiceMetrics = {
        volume: (average / 255) * 100,
        rms: (rms / 255) * 100,
        peak: (peak / 255) * 100,
        voiceActivity: average > 10,
        latency: Math.random() * 50 + 10, // Simulated
        quality: Math.max(0, 100 - (peak / 255) * 20),
        clarity: Math.random() * 20 + 80, // Simulated
        backgroundNoise: Math.random() * 10 // Simulated
      };
      
      setVoiceMetrics(metrics);
      updateVisualization(metrics);
      
      // Send metrics to agent
      agent.send(JSON.stringify({
        type: 'voice-metrics',
        data: metrics
      }));
      
      requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64 (simplified - in production use proper transcription)
      const reader = new FileReader();
      reader.onload = async () => {
        const audioData = reader.result as string;
        
        // Simulate transcription (in production, use speech-to-text service)
        const mockTranscription = "This is a mock transcription of the audio input.";
        
        // Send voice input to agent
        agent.send(JSON.stringify({
          type: 'voice-input',
          data: {
            audioData,
            voiceMetrics,
            transcription: mockTranscription,
            useRAG,
            useBrowser
          }
        }));
        
        // Add user message to conversation
        const userMessage = {
          id: crypto.randomUUID(),
          role: 'user' as const,
          content: mockTranscription,
          timestamp: new Date(),
          voiceMetrics
        };
        
        setConversation(prev => [...prev, userMessage]);
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (error) {
      console.error('Failed to process audio input:', error);
    }
  };

  // Text Input Handler
  const sendTextInput = async () => {
    if (!currentInput.trim()) return;
    
    const requestId = crypto.randomUUID();
    
    // Send text input to agent
    agent.send(JSON.stringify({
      type: 'text-input',
      data: {
        text: currentInput,
        requestId,
        useRAG,
        useBrowser
      }
    }));
    
    // Add user message to conversation
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: currentInput,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setCurrentInput('');
  };

  // RAG Search
  const performRAGSearch = async (query: string) => {
    agent.send(JSON.stringify({
      type: 'request-rag',
      data: {
        query,
        limit: 5,
        threshold: 0.7,
        includeContent: true
      }
    }));
  };

  // Browser Automation
  const browseWeb = async (url: string, action: string = 'text') => {
    agent.send(JSON.stringify({
      type: 'browse-web',
      data: {
        url,
        action,
        waitFor: 'networkidle'
      }
    }));
  };

  // Task Scheduling
  const scheduleTask = async (taskType: string, when: string, taskData: any) => {
    agent.send(JSON.stringify({
      type: 'schedule-task',
      data: {
        taskType,
        when,
        taskData
      }
    }));
  };

  // Visualization
  const updateVisualization = (metrics: VoiceMetrics) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw voice activity visualization
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.max(10, metrics.volume * 2);
    
    // Activity indicator
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = metrics.voiceActivity 
      ? `rgba(34, 197, 94, ${metrics.volume / 100})` 
      : 'rgba(156, 163, 175, 0.3)';
    ctx.fill();
    
    // Quality ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(59, 130, 246, ${metrics.quality / 100})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  // Text-to-Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        sendTextInput();
      } else if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, sendTextInput, startRecording, stopRecording]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🎙️ Advanced Voice AI Ecosystem
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Agent Status */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800/50">
                <div className={`w-2 h-2 rounded-full ${agentStatus.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm">{agentStatus.isActive ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              {/* Variant Selector */}
              <select 
                value={selectedVariant} 
                onChange={(e) => setSelectedVariant(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                title="Select voice interface variant"
                aria-label="Voice interface variant"
              >
                <option value="hero">Hero</option>
                <option value="compact">Compact</option>
                <option value="floating">Floating</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Voice Visualization */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">🎵 Voice Visualization</h3>
              
              <div className="flex items-center justify-center mb-4">
                <canvas 
                  ref={canvasRef} 
                  width="200" 
                  height="200" 
                  className="border border-gray-600 rounded-lg"
                />
              </div>
              
              {/* Voice Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Volume</div>
                  <div className="font-mono">{voiceMetrics.volume.toFixed(1)}%</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Quality</div>
                  <div className="font-mono">{voiceMetrics.quality.toFixed(1)}%</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Latency</div>
                  <div className="font-mono">{voiceMetrics.latency.toFixed(0)}ms</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Activity</div>
                  <div className={`font-mono ${voiceMetrics.voiceActivity ? 'text-green-400' : 'text-red-400'}`}>
                    {voiceMetrics.voiceActivity ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
              <div className="p-4 border-b border-gray-600">
                <h3 className="text-lg font-semibold">💬 Conversation</h3>
              </div>
              
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                        {message.voiceMetrics && (
                          <span className="ml-2">
                            🎤 Q:{message.voiceMetrics.quality.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t border-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={useRAG}
                      onChange={(e) => setUseRAG(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Use RAG</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={useBrowser}
                      onChange={(e) => setUseBrowser(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Web Browse</span>
                  </label>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendTextInput()}
                    placeholder="Type your message... (Ctrl+Enter to send, Ctrl+Space to record)"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={sendTextInput}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Send
                  </button>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-4 py-2 rounded text-white ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isRecording ? '⏹️ Stop' : '🎤 Record'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Agent Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">🤖 Agent Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Messages:</span>
                  <span className="font-mono">{agentStatus.messageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connections:</span>
                  <span className="font-mono">{agentStatus.connections}</span>
                </div>
                <div className="flex justify-between">
                  <span>Workflows:</span>
                  <span className="font-mono">{agentStatus.activeWorkflows}</span>
                </div>
              </div>
            </div>

            {/* RAG Results */}
            {ragResults && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">📚 RAG Results</h3>
                <div className="text-sm mb-2 text-gray-400">
                  Query: "{ragResults.query}"
                </div>
                <div className="space-y-2">
                  {ragResults.documents.slice(0, 3).map((doc, index) => (
                    <div key={doc.id} className="bg-gray-700/50 rounded p-2">
                      <div className="font-mono text-xs text-blue-400">
                        Score: {doc.score.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-300">
                        ID: {doc.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Browser Results */}
            {browserResults.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">🌐 Browser Results</h3>
                <div className="space-y-2 text-sm">
                  {browserResults.slice(-3).map((result, index) => (
                    <div key={index} className="bg-gray-700/50 rounded p-2">
                      <div className={`font-mono text-xs ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        {result.success ? '✅ Success' : '❌ Failed'}
                      </div>
                      <div className="text-xs text-gray-300">
                        {result.metadata?.title || result.metadata?.url}
                      </div>
                      <div className="text-xs text-gray-400">
                        {result.metadata?.duration}ms
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Tasks */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">⏰ Scheduled Tasks</h3>
              
              {/* Quick Task Scheduler */}
              <div className="mb-4 space-y-2">
                <button
                  onClick={() => scheduleTask('reminder', '300', { message: 'Check updates' })}
                  className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Reminder in 5min
                </button>
                <button
                  onClick={() => scheduleTask('research', '0 9 * * *', { topic: 'AI news' })}
                  className="w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                >
                  Daily Research
                </button>
                <button
                  onClick={() => browseWeb('https://news.ycombinator.com', 'text')}
                  className="w-full px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                >
                  Browse HN
                </button>
              </div>
              
              {/* Task List */}
              <div className="space-y-2 text-sm">
                {scheduledTasks.slice(-5).map((task) => (
                  <div key={task.id} className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{task.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'completed' ? 'bg-green-600' :
                        task.status === 'running' ? 'bg-blue-600' :
                        task.status === 'failed' ? 'bg-red-600' :
                        'bg-gray-600'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {task.scheduledFor.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => performRAGSearch('latest AI developments')}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  🔍 Search Knowledge Base
                </button>
                <button
                  onClick={() => browseWeb('https://example.com', 'screenshot')}
                  className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                >
                  📸 Take Screenshot
                </button>
                <button
                  onClick={() => agent.send(JSON.stringify({ type: 'get-status' }))}
                  className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                >
                  📊 Get Agent Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedVoiceAIEcosystem;
