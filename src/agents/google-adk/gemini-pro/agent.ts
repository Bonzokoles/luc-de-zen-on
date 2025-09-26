// Google ADK Gemini Pro Agent
// Advanced conversational AI agent using Gemini Pro model

import type { AgentConfig, AgentResponse } from '../types';
import { BaseGoogleADKAgent } from '../types';

export interface ConversationContext {
  messages: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: string;
  conversationHistory: string[];
}

export class GeminiProAgent extends BaseGoogleADKAgent {
  private temperature: number;
  private maxTokens: number;
  private topP: number;
  private topK: number;
  private conversationContext: ConversationContext;
  private apiEndpoint: string;

  constructor(config: AgentConfig) {
    super(config);
    this.temperature = 0.7;
    this.maxTokens = 2048;
    this.topP = 0.8;
    this.topK = 40;
    this.apiEndpoint = '/api/gemini-pro';
    
    this.conversationContext = {
      messages: [],
      conversationHistory: [],
      systemInstruction: 'Jesteś pomocnym asystentem AI wykorzystującym model Gemini Pro. Odpowiadaj profesjonalnie i pomocnie w języku polskim.'
    };
  }

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Gemini Pro Agent...');
      this.config.status = 'ready';
      
      // Test connection to Gemini Pro API
      const testResponse = await this.testConnection();
      if (testResponse.status !== 'success') {
        throw new Error('Failed to connect to Gemini Pro API');
      }

      console.log('✅ Gemini Pro Agent initialized successfully');
      
    } catch (error) {
      console.error('Gemini Pro initialization failed:', error);
      this.config.status = 'error';
      throw error;
    }
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const startTime = new Date();
    
    try {
      this.config.status = 'busy';
      
      // Add user message to conversation context
      this.conversationContext.messages.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const requestBody = {
        contents: this.conversationContext.messages,
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
          topP: this.topP,
          topK: this.topK
        },
        systemInstruction: this.conversationContext.systemInstruction
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini Pro API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Przepraszam, nie mogę przetworzyć tej wiadomości.';

      // Add assistant response to conversation context
      this.conversationContext.messages.push({
        role: 'model',
        parts: [{ text: assistantMessage }]
      });

      // Keep conversation history manageable (last 20 exchanges)
      if (this.conversationContext.messages.length > 20) {
        this.conversationContext.messages = this.conversationContext.messages.slice(-20);
      }

      this.config.status = 'ready';
      
      // Update metrics and history
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, true);
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'input',
        content: message,
        response_time: responseTime
      });
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'output',
        content: assistantMessage,
        response_time: responseTime
      });
      
      return {
        status: 'success',
        response: assistantMessage,
        data: {
          model: this.config.model,
          tokensUsed: data.usageMetadata?.totalTokenCount || 0,
          conversationLength: this.conversationContext.messages.length
        },
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: responseTime,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      this.config.status = 'error';
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, false);
      
      return {
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: responseTime,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async testConnection(): Promise<AgentResponse> {
    try {
      const testMessage = 'Test connection';
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: testMessage }]
          }],
          generationConfig: {
            maxOutputTokens: 50
          }
        })
      });

      return {
        status: response.ok ? 'success' : 'error',
        data: response.ok ? { connected: true } : null,
        error_message: response.ok ? undefined : `Connection failed: ${response.status}`,
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: 0,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Connection test failed',
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: 0,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  getConversationHistory(): ConversationContext {
    return this.conversationContext;
  }

  clearConversation(): void {
    this.conversationContext.messages = [];
    this.conversationContext.conversationHistory = [];
  }

  setSystemInstruction(instruction: string): void {
    this.conversationContext.systemInstruction = instruction;
  }

  updateTemperature(temperature: number): void {
    this.temperature = Math.max(0, Math.min(1, temperature));
  }

  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down Gemini Pro Agent...');
    this.config.status = 'offline';
    this.clearConversation();
    console.log('✅ Gemini Pro Agent shutdown complete');
  }
}

// Export default instance creator
export function createGeminiProAgent(config?: Partial<AgentConfig>): GeminiProAgent {
  const defaultConfig: AgentConfig = {
    agent_id: 'gemini-pro',
    name: 'Gemini Pro Agent',
    model: 'gemini-pro',
    status: 'offline',
    category: 'core',
    icon: '🤖',
    color: '#4285f4',
    priority: 'HIGH',
    description: 'Advanced conversational AI powered by Google Gemini Pro'
  };

  return new GeminiProAgent({ ...defaultConfig, ...config });
}