/**
 * 🌟 Google ADK Agents - TypeScript Interfaces & Base Classes
 * Kompletne typy dla wszystkich agentów Google ADK
 */

export interface AgentConfig {
  agent_id: string;
  name: string;
  model: string;
  status: 'ready' | 'busy' | 'error' | 'offline';
  category: 'core' | 'specialized' | 'utility' | 'creative';
  icon: string;
  color: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description?: string;
}

export interface PerformanceMetrics {
  requests_processed: number;
  avg_response_time: number;
  success_rate: number;
  last_request_time?: string;
  total_uptime?: number;
}

export interface ConversationEntry {
  timestamp: string;
  type: 'input' | 'output' | 'system';
  content: string;
  response_time?: number;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  status: 'success' | 'error' | 'pending';
  response?: string;
  data?: any;
  error_message?: string;
  metadata?: {
    agent: string;
    model: string;
    response_time: number;
    timestamp: string;
    tools_used?: string[];
  };
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  function: (...args: any[]) => Promise<any> | any;
}

export interface AgentCapability {
  name: string;
  description: string;
  category: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  examples?: string[];
}

// Gemini Pro Agent Types
export interface TextAnalysisResult {
  word_count: number;
  char_count: number;
  sentiment: 'pozytywny' | 'negatywny' | 'neutralny';
  positive_indicators: number;
  negative_indicators: number;
  readability_score?: number;
  keywords?: string[];
}

export interface CodeAnalysisResult {
  language: string;
  lines_count: number;
  complexity: 'niska' | 'średnia' | 'wysoka';
  explanation: string;
  contains_functions?: boolean;
  contains_classes?: boolean;
  has_imports?: boolean;
  security_issues?: string[];
}

// Gemini Vision Agent Types
export interface ImageAnalysisResult {
  objects_detected: Array<{
    name: string;
    confidence: number;
    bounding_box?: { x: number; y: number; width: number; height: number };
  }>;
  scene_description: string;
  colors: string[];
  text_detected?: string[];
  faces_count?: number;
  image_quality: 'niska' | 'średnia' | 'wysoka';
}

export interface OCRResult {
  extracted_text: string;
  confidence: number;
  language: string;
  text_regions: Array<{
    text: string;
    bounding_box: { x: number; y: number; width: number; height: number };
  }>;
}

// Voice Command Agent Types
export interface VoiceCommand {
  command: string;
  description: string;
  action: string;
  parameters?: Record<string, any>;
  confidence_threshold?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  language: string;
  duration: number;
  recognized_command?: VoiceCommand;
}

export interface TTSOptions {
  voice: string;
  rate: number;
  volume: number;
  language: string;
  pitch?: number;
}

// Music Control Agent Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  file_path: string;
  genre?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  current_track: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface AudioState {
  is_playing: boolean;
  current_track?: Track;
  position: number;
  volume: number;
  duration: number;
  playlist?: Playlist;
}

// Weather & Time Agent Types
export interface WeatherInfo {
  location: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
  icon: string;
  timestamp: string;
}

export interface TimeInfo {
  current_time: string;
  timezone: string;
  utc_time: string;
  day_of_week: string;
  formatted_date: string;
}

// Base Agent Abstract Class
export abstract class BaseGoogleADKAgent {
  protected config: AgentConfig;
  protected performance_metrics: PerformanceMetrics;
  protected conversation_history: ConversationEntry[];
  protected tools: AgentTool[];
  protected capabilities: AgentCapability[];

  constructor(config: AgentConfig) {
    this.config = config;
    this.performance_metrics = {
      requests_processed: 0,
      avg_response_time: 0,
      success_rate: 1.0
    };
    this.conversation_history = [];
    this.tools = [];
    this.capabilities = [];
  }

  abstract processMessage(message: string): Promise<AgentResponse>;
  abstract initialize(): Promise<void>;

  getConfig(): AgentConfig {
    return this.config;
  }

  async getStatus(): Promise<AgentConfig & { performance: PerformanceMetrics }> {
    return {
      ...this.config,
      performance: this.performance_metrics
    };
  }

  async getCapabilities(): Promise<AgentCapability[]> {
    return this.capabilities;
  }

  async getTools(): Promise<AgentTool[]> {
    return this.tools;
  }

  async getHistory(limit: number = 50): Promise<ConversationEntry[]> {
    return this.conversation_history.slice(-limit);
  }

  async clearHistory(): Promise<void> {
    this.conversation_history = [];
  }

  async reset(): Promise<void> {
    this.conversation_history = [];
    this.performance_metrics = {
      requests_processed: 0,
      avg_response_time: 0,
      success_rate: 1.0
    };
    this.config.status = 'ready';
  }

  protected addToHistory(entry: ConversationEntry): void {
    this.conversation_history.push(entry);
    
    // Zachowaj tylko ostatnie 1000 wpisów
    if (this.conversation_history.length > 1000) {
      this.conversation_history = this.conversation_history.slice(-1000);
    }
  }

  protected updateMetrics(response_time: number, success: boolean): void {
    this.performance_metrics.requests_processed++;
    
    // Oblicz średni czas odpowiedzi
    const prev_avg = this.performance_metrics.avg_response_time;
    const count = this.performance_metrics.requests_processed;
    this.performance_metrics.avg_response_time = 
      (prev_avg * (count - 1) + response_time) / count;
    
    // Aktualizuj success rate
    const prev_success_rate = this.performance_metrics.success_rate;
    this.performance_metrics.success_rate = 
      (prev_success_rate * (count - 1) + (success ? 1 : 0)) / count;
  }
}

// Agent Manager Class
export class GoogleADKAgentManager {
  private agents: Map<string, BaseGoogleADKAgent>;
  private active_agent: string | null;

  constructor() {
    this.agents = new Map();
    this.active_agent = null;
  }

  registerAgent(agent: BaseGoogleADKAgent): void {
    const config = agent.getConfig();
    this.agents.set(config.agent_id, agent);
  }

  async getAgent(agent_id: string): Promise<BaseGoogleADKAgent | undefined> {
    return this.agents.get(agent_id);
  }

  async getAllAgents(): Promise<Array<AgentConfig & { performance: PerformanceMetrics }>> {
    const agent_statuses = [];
    for (const agent of this.agents.values()) {
      agent_statuses.push(await agent.getStatus());
    }
    return agent_statuses;
  }

  async setActiveAgent(agent_id: string): Promise<boolean> {
    if (this.agents.has(agent_id)) {
      this.active_agent = agent_id;
      return true;
    }
    return false;
  }

  async getActiveAgent(): Promise<BaseGoogleADKAgent | null> {
    if (this.active_agent && this.agents.has(this.active_agent)) {
      return this.agents.get(this.active_agent)!;
    }
    return null;
  }

  async processMessage(message: string, agent_id?: string): Promise<AgentResponse> {
    let agent: BaseGoogleADKAgent | undefined;
    
    if (agent_id) {
      agent = this.agents.get(agent_id);
    } else if (this.active_agent) {
      agent = this.agents.get(this.active_agent);
    }
    
    if (!agent) {
      return {
        status: 'error',
        error_message: 'Nie znaleziono agenta lub nie wybrano aktywnego agenta'
      };
    }
    
    return await agent.processMessage(message);
  }

  async resetAgent(agent_id: string): Promise<boolean> {
    const agent = this.agents.get(agent_id);
    if (agent) {
      await agent.reset();
      return true;
    }
    return false;
  }

  async resetAllAgents(): Promise<void> {
    for (const agent of this.agents.values()) {
      await agent.reset();
    }
  }
}

// Utility Functions
export function formatResponse(response: AgentResponse): string {
  if (response.status === 'success') {
    return response.response || JSON.stringify(response.data, null, 2);
  } else {
    return `Błąd: ${response.error_message}`;
  }
}

export function calculateResponseTime(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / 1000;
}

export function generateAgentId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}`;
}

// Export all types and interfaces
export * from './voice-command/agent';
export * from './music-control/agent';