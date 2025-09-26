/**
 * 🚀 Google ADK Agent Manager - Central Hub
 * Główny manager wszystkich agentów Google ADK
 */

import type { 
  AgentConfig, 
  AgentResponse, 
  PerformanceMetrics,
  BaseGoogleADKAgent 
} from './types';
import { VoiceCommandAgent } from './voice-command/agent';
import { MusicControlAgent } from './music-control/agent';
import { GeminiProAgent, createGeminiProAgent } from './gemini-pro/agent';
import { GeminiVisionAgent, createGeminiVisionAgent } from './gemini-vision/agent';
import { CodeBisonAgent, createCodeBisonAgent } from './code-bison/agent';
import { TextBisonAgent, createTextBisonAgent } from './text-bison/agent';
import { VertexAIAgent, createVertexAIAgent } from './vertex-ai/agent';
import { GoogleBardAgent, createGoogleBardAgent } from './google-bard/agent';
import { PaLMAPIAgent, createPaLMAPIAgent } from './palm-api/agent';

export interface RegisteredAgent {
  instance: BaseGoogleADKAgent;
  config: AgentConfig;
  lastUsed: Date;
}

export class GoogleADKManager {
  private static instance: GoogleADKManager | null = null;
  private agents: Map<string, RegisteredAgent> = new Map();
  private activeAgentId: string | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): GoogleADKManager {
    if (!GoogleADKManager.instance) {
      GoogleADKManager.instance = new GoogleADKManager();
    }
    return GoogleADKManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Inicjalizacja Google ADK Manager...');

      // Zainicjalizuj Voice Command Agent
      const voiceAgent = new VoiceCommandAgent();
      await voiceAgent.initialize();
      await this.registerAgent(voiceAgent);

      // Zainicjalizuj Music Control Agent  
      const musicAgent = new MusicControlAgent();
      await musicAgent.initialize();
      await this.registerAgent(musicAgent);

      // Zainicjalizuj Gemini Pro Agent
      const geminiProAgent = createGeminiProAgent();
      await geminiProAgent.initialize();
      await this.registerAgent(geminiProAgent);

      // Zainicjalizuj Gemini Vision Agent
      const geminiVisionAgent = createGeminiVisionAgent();
      await geminiVisionAgent.initialize();
      await this.registerAgent(geminiVisionAgent);

      // Zainicjalizuj Code Bison Agent
      const codeBisonAgent = createCodeBisonAgent();
      await codeBisonAgent.initialize();
      await this.registerAgent(codeBisonAgent);

      // Zainicjalizuj Text Bison Agent
      const textBisonAgent = createTextBisonAgent();
      await textBisonAgent.initialize();
      await this.registerAgent(textBisonAgent);

      // Zainicjalizuj Vertex AI Agent
      const vertexAIAgent = createVertexAIAgent();
      await vertexAIAgent.initialize();
      await this.registerAgent(vertexAIAgent);

      // Zainicjalizuj Google Bard Agent
      const googleBardAgent = createGoogleBardAgent();
      await googleBardAgent.initialize();
      await this.registerAgent(googleBardAgent);

      // Zainicjalizuj PaLM API Agent
      const palmAPIAgent = createPaLMAPIAgent();
      await palmAPIAgent.initialize();
      await this.registerAgent(palmAPIAgent);

      // Ustaw Voice Command jako domyślny aktywny agent
      this.setActiveAgent('voice_command_001');

      this.isInitialized = true;
      console.log('✅ Google ADK Manager zainicjalizowany');
      console.log(`📊 Załadowano ${this.agents.size} agentów Google ADK`);

      // Emituj event o gotowości
      this.dispatchEvent('adkManagerReady', { 
        agentCount: this.agents.size,
        activeAgent: this.activeAgentId
      });

    } catch (error) {
      console.error('❌ Błąd inicjalizacji ADK Manager:', error);
      throw error;
    }
  }

  async registerAgent(agent: BaseGoogleADKAgent): Promise<void> {
    const config = await agent.getStatus();
    
    const registeredAgent: RegisteredAgent = {
      instance: agent,
      config: config,
      lastUsed: new Date()
    };

    this.agents.set(config.agent_id, registeredAgent);
    console.log(`🔌 Zarejestrowano agent: ${config.name} (${config.agent_id})`);

    // Emituj event o rejestracji agenta
    this.dispatchEvent('agentRegistered', {
      agentId: config.agent_id,
      agentName: config.name,
      agentType: config.category
    });
  }

  async getAgent(agentId: string): Promise<BaseGoogleADKAgent | null> {
    const registered = this.agents.get(agentId);
    if (registered) {
      registered.lastUsed = new Date();
      return registered.instance;
    }
    return null;
  }

  async getAllAgents(): Promise<RegisteredAgent[]> {
    return Array.from(this.agents.values());
  }

  async getAgentStatus(agentId: string): Promise<(AgentConfig & { performance: PerformanceMetrics }) | null> {
    const agent = await this.getAgent(agentId);
    if (agent) {
      return await agent.getStatus();
    }
    return null;
  }

  setActiveAgent(agentId: string): boolean {
    if (this.agents.has(agentId)) {
     const previousAgent = this.activeAgentId;
      this.activeAgentId = agentId;
      console.log(`🎯 Aktywny agent: ${agentId}`);
      
      this.dispatchEvent('activeAgentChanged', {
        newActiveAgent: agentId,
       previousAgent
      });      
      return true;
    }
    return false;
  }

  getActiveAgent(): BaseGoogleADKAgent | null {
    if (this.activeAgentId) {
      const registered = this.agents.get(this.activeAgentId);
      return registered ? registered.instance : null;
    }
    return null;
  }

  getActiveAgentId(): string | null {
    return this.activeAgentId;
  }

  async processMessage(
    message: string, 
    agentId?: string,
    context?: Record<string, any>
  ): Promise<AgentResponse> {
    try {
      let targetAgent: BaseGoogleADKAgent | null = null;

      if (agentId) {
        targetAgent = await this.getAgent(agentId);
        if (!targetAgent) {
          return {
            status: 'error',
            error_message: `Agent ${agentId} nie został znaleziony`
          };
        }
      } else {
        targetAgent = this.getActiveAgent();
        if (!targetAgent) {
          return {
            status: 'error',
            error_message: 'Brak aktywnego agenta. Wybierz agent lub podaj ID agenta.'
          };
        }
      }

      // Zaktualizuj ostatnie użycie
      const registered = this.agents.get(await this.getAgentIdFromInstance(targetAgent));
      if (registered) {
        registered.lastUsed = new Date();
      }

      // Przetwórz wiadomość
      const response = await targetAgent.processMessage(message);
      
      // Emituj event o przetworzeniu wiadomości
      this.dispatchEvent('messageProcessed', {
        agentId: await this.getAgentIdFromInstance(targetAgent),
        message,
        response: response.status,
        timestamp: new Date().toISOString()
      });

      return response;

    } catch (error) {
      return {
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Metody pomocnicze dla Voice Command Agent
  async startVoiceListening(): Promise<boolean> {
    const voiceAgent = await this.getAgent('voice_command_001') as VoiceCommandAgent;
    if (voiceAgent && 'startListening' in voiceAgent) {
      return await voiceAgent.startListening();
    }
    return false;
  }

  async stopVoiceListening(): Promise<void> {
    const voiceAgent = await this.getAgent('voice_command_001') as VoiceCommandAgent;
    if (voiceAgent && 'stopListening' in voiceAgent) {
      await voiceAgent.stopListening();
    }
  }

  async speak(text: string): Promise<void> {
    const voiceAgent = await this.getAgent('voice_command_001') as VoiceCommandAgent;
    if (voiceAgent && 'speak' in voiceAgent) {
      await voiceAgent.speak(text);
    }
  }

  // Metody pomocnicze dla Music Control Agent
  async playMusic(): Promise<string> {
    const musicAgent = await this.getAgent('music_control_001') as MusicControlAgent;
    if (musicAgent && 'play' in musicAgent) {
      return await musicAgent.play();
    }
    return 'Music Control Agent nie jest dostępny';
  }

  async pauseMusic(): Promise<string> {
    const musicAgent = await this.getAgent('music_control_001') as MusicControlAgent;
    if (musicAgent && 'pause' in musicAgent) {
      return await musicAgent.pause();
    }
    return 'Music Control Agent nie jest dostępny';
  }

  async getMusicStatus(): Promise<string> {
    const musicAgent = await this.getAgent('music_control_001') as MusicControlAgent;
    if (musicAgent && 'getStatus' in musicAgent) {
      return await (musicAgent as any).getStatus();
    }
    return 'Music Control Agent nie jest dostępny';
  }

  // Zarządzanie agentami
  async resetAgent(agentId: string): Promise<boolean> {
    const agent = await this.getAgent(agentId);
    if (agent) {
      await agent.reset();
      console.log(`🔄 Zresetowano agent: ${agentId}`);
      
      this.dispatchEvent('agentReset', { agentId });
      return true;
    }
    return false;
  }

  async resetAllAgents(): Promise<void> {
    const resetPromises = Array.from(this.agents.keys()).map(agentId => 
      this.resetAgent(agentId)
    );
    
    await Promise.all(resetPromises);
    console.log('🔄 Zresetowano wszystkie agenty');
    
    this.dispatchEvent('allAgentsReset', { count: this.agents.size });
  }

  async getSystemStatus(): Promise<{
    manager: {
      initialized: boolean;
      agentCount: number;
      activeAgent: string | null;
    };
    agents: Array<AgentConfig & { performance: PerformanceMetrics; lastUsed: string }>;
  }> {
    const agentStatuses = [];
    
    for (const [agentId, registered] of this.agents) {
      const status = await registered.instance.getStatus();
      agentStatuses.push({
        ...status,
        lastUsed: registered.lastUsed.toISOString()
      });
    }

    return {
      manager: {
        initialized: this.isInitialized,
        agentCount: this.agents.size,
        activeAgent: this.activeAgentId
      },
      agents: agentStatuses
    };
  }

  // Event handling
  private setupEventListeners(): void {
    // Nasłuchuj requestów aktywacji agentów
    window.addEventListener('activateAgent', (event: Event) => {
      const customEvent = event as CustomEvent;
      const { agentId } = customEvent.detail;
      this.setActiveAgent(agentId);
    });

    // Nasłuchuj requestów komunikacji z agentami
    window.addEventListener('sendToAgent', async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { message, agentId } = customEvent.detail;
      
      const response = await this.processMessage(message, agentId);
      
      // Emituj odpowiedź
      this.dispatchEvent('agentResponse', {
        originalMessage: message,
        response,
        agentId: agentId || this.activeAgentId
      });
    });
  }

  private dispatchEvent(eventName: string, detail: any): void {
    window.dispatchEvent(new CustomEvent(`adk:${eventName}`, { detail }));
  }

  private async getAgentIdFromInstance(instance: BaseGoogleADKAgent): Promise<string> {
    const status = await instance.getStatus();
    return status.agent_id;
  }

  // Cleanup
  async shutdown(): Promise<void> {
    console.log('🛑 Zamykanie Google ADK Manager...');
    
    await this.resetAllAgents();
    this.agents.clear();
    this.activeAgentId = null;
    this.isInitialized = false;
    
    console.log('✅ Google ADK Manager zamknięty');
  }
}

// Singleton instance
export const adkManager = GoogleADKManager.getInstance();

// Global helper functions
export async function initializeADK(): Promise<void> {
  await adkManager.initialize();
}

export async function sendMessageToADK(
  message: string, 
  agentId?: string
): Promise<AgentResponse> {
  return await adkManager.processMessage(message, agentId);
}

export async function getADKStatus() {
  return await adkManager.getSystemStatus();
}

export function getActiveADKAgent(): BaseGoogleADKAgent | null {
  return adkManager.getActiveAgent();
}

export async function activateADKAgent(agentId: string): Promise<boolean> {
  return adkManager.setActiveAgent(agentId);
}

// Browser console integration
if (typeof window !== 'undefined') {
  (window as any).ADK = {
    manager: adkManager,
    initialize: initializeADK,
    sendMessage: sendMessageToADK,
    getStatus: getADKStatus,
    getActiveAgent: getActiveADKAgent,
    activateAgent: activateADKAgent
  };
  
  console.log('🌟 Google ADK API dostępne w window.ADK');
}