// Google ADK PaLM API Agent
// AI agent for Google PaLM API integration and advanced language processing

import type { AgentConfig, AgentResponse } from '../types';
import { BaseGoogleADKAgent } from '../types';

export interface PaLMRequest {
  prompt: string;
  model: 'text-bison-001' | 'chat-bison-001' | 'code-bison-001';
  temperature: number;
  max_output_tokens: number;
  top_p: number;
  top_k: number;
  candidate_count?: number;
  stop_sequences?: string[];
}

export interface PaLMResponse {
  candidates: Array<{
    output: string;
    safety_ratings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  filters?: Array<{
    reason: string;
    message: string;
  }>;
  safety_feedback?: Array<{
    rating: {
      category: string;
      probability: string;
    };
    setting: {
      category: string;
      threshold: string;
    };
  }>;
}

export interface PaLMEmbeddingRequest {
  text: string;
  model: 'embedding-gecko-001';
}

export interface SafetySettings {
  category: 'HARM_CATEGORY_DEROGATORY' | 'HARM_CATEGORY_TOXICITY' | 'HARM_CATEGORY_VIOLENCE' | 'HARM_CATEGORY_SEXUAL' | 'HARM_CATEGORY_MEDICAL' | 'HARM_CATEGORY_DANGEROUS';
  threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE';
}

export class PaLMAPIAgent extends BaseGoogleADKAgent {
  private palmEndpoint: string;
  private apiKey: string;
  private availableModels: string[];
  private safetySettings: SafetySettings[];
  private maxRetries: number;

  constructor(config: AgentConfig) {
    super(config);
    this.palmEndpoint = '/api/palm';
    this.apiKey = process.env.PALM_API_KEY || '';
    this.availableModels = [
      'text-bison-001',
      'chat-bison-001', 
      'code-bison-001',
      'embedding-gecko-001'
    ];
    this.safetySettings = [
      { category: 'HARM_CATEGORY_DEROGATORY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_TOXICITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_VIOLENCE', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUAL', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_MEDICAL', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ];
    this.maxRetries = 3;
  }

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing PaLM API Agent...');
      this.config.status = 'ready';
      
      // Test connection to PaLM API
      const testResponse = await this.testConnection();
      if (testResponse.status !== 'success') {
        throw new Error('Failed to connect to PaLM API');
      }

      console.log('✅ PaLM API Agent initialized successfully');
      console.log(`🤖 Available models: ${this.availableModels.join(', ')}`);
      
    } catch (error) {
      console.error('PaLM API initialization failed:', error);
      this.config.status = 'error';
      throw error;
    }
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const startTime = new Date();
    
    try {
      this.config.status = 'busy';
      
      // Determine the type of request
      const requestType = this.determineRequestType(message);
      let result: any;
      let responseText: string;
      let toolsUsed: string[] = [];

      switch (requestType) {
        case 'text_generation':
          result = await this.generateText(message);
          responseText = this.formatGenerationResult(result);
          toolsUsed = ['palm_text_generation'];
          break;
        case 'chat':
          result = await this.chatCompletion(message);
          responseText = result.response;
          toolsUsed = ['palm_chat'];
          break;
        case 'code_generation':
          result = await this.generateCode(message);
          responseText = this.formatCodeResult(result);
          toolsUsed = ['palm_code_generation'];
          break;
        case 'embedding':
          result = await this.generateEmbedding(message);
          responseText = this.formatEmbeddingResult(result);
          toolsUsed = ['palm_embedding'];
          break;
        case 'text_completion':
          result = await this.completeText(message);
          responseText = result.completion;
          toolsUsed = ['palm_text_completion'];
          break;
        case 'summarization':
          result = await this.summarizeText(message);
          responseText = result.summary;
          toolsUsed = ['palm_summarization'];
          break;
        case 'translation':
          result = await this.translateText(message);
          responseText = this.formatTranslationResult(result);
          toolsUsed = ['palm_translation'];
          break;
        default:
          result = await this.handleGeneralQuery(message);
          responseText = result.response;
          toolsUsed = ['palm_general'];
      }

      this.config.status = 'ready';
      
      // Update metrics and history
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, true);
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'input',
        content: message.substring(0, 500), // Limit stored content
        response_time: responseTime,
        metadata: { requestType, toolsUsed }
      });
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'output',
        content: responseText.substring(0, 500),
        response_time: responseTime
      });
      
      return {
        status: 'success',
        response: responseText,
        data: result,
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: responseTime,
          timestamp: new Date().toISOString(),
          tools_used: toolsUsed
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

  private determineRequestType(message: string): 'text_generation' | 'chat' | 'code_generation' | 'embedding' | 'text_completion' | 'summarization' | 'translation' | 'general' {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('wygeneruj tekst') || lowerMessage.includes('napisz') ||
        lowerMessage.includes('generate text') || lowerMessage.includes('stwórz artykuł')) {
      return 'text_generation';
    }
    
    if (lowerMessage.includes('chat') || lowerMessage.includes('rozmowa') ||
        lowerMessage.includes('porozmawiaj') || lowerMessage.includes('odpowiedz')) {
      return 'chat';
    }
    
    if (lowerMessage.includes('kod') || lowerMessage.includes('code') ||
        lowerMessage.includes('funkcja') || lowerMessage.includes('program')) {
      return 'code_generation';
    }
    
    if (lowerMessage.includes('embedding') || lowerMessage.includes('wektor') ||
        lowerMessage.includes('reprezentacja') || lowerMessage.includes('podobieństwo')) {
      return 'embedding';
    }
    
    if (lowerMessage.includes('dokończ') || lowerMessage.includes('complete') ||
        lowerMessage.includes('kontynuuj tekst') || lowerMessage.includes('finish')) {
      return 'text_completion';
    }
    
    if (lowerMessage.includes('podsumuj') || lowerMessage.includes('summarize') ||
        lowerMessage.includes('streszczenie') || lowerMessage.includes('skróć')) {
      return 'summarization';
    }
    
    if (lowerMessage.includes('przetłumacz') || lowerMessage.includes('translate') ||
        lowerMessage.includes('tłumaczenie') || lowerMessage.includes('na język')) {
      return 'translation';
    }
    
    return 'general';
  }

  private async generateText(message: string): Promise<any> {
    try {
      const prompt = this.extractPromptFromMessage(message);
      const requestBody: PaLMRequest = {
        prompt: prompt,
        model: 'text-bison-001',
        temperature: 0.7,
        max_output_tokens: 1000,
        top_p: 0.95,
        top_k: 40,
        candidate_count: 1
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          text: response.candidates[0].output,
          safety_ratings: response.candidates[0].safety_ratings || [],
          model_used: 'text-bison-001',
          prompt: prompt
        };
      } else {
        throw new Error('Brak odpowiedzi z PaLM API');
      }

    } catch (error) {
      throw new Error(`Błąd generowania tekstu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async chatCompletion(message: string): Promise<any> {
    try {
      const requestBody: PaLMRequest = {
        prompt: message,
        model: 'chat-bison-001',
        temperature: 0.7,
        max_output_tokens: 1000,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          response: response.candidates[0].output,
          safety_ratings: response.candidates[0].safety_ratings || [],
          model_used: 'chat-bison-001'
        };
      } else {
        throw new Error('Brak odpowiedzi z PaLM Chat API');
      }

    } catch (error) {
      throw new Error(`Błąd czatu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async generateCode(message: string): Promise<any> {
    try {
      const codePrompt = this.extractCodePromptFromMessage(message);
      const language = this.extractLanguageFromMessage(message);
      
      const requestBody: PaLMRequest = {
        prompt: `Language: ${language}\nTask: ${codePrompt}`,
        model: 'code-bison-001',
        temperature: 0.2, // Lower temperature for more consistent code
        max_output_tokens: 2000,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          code: response.candidates[0].output,
          language: language,
          explanation: this.extractExplanationFromCode(response.candidates[0].output),
          model_used: 'code-bison-001'
        };
      } else {
        throw new Error('Brak odpowiedzi z PaLM Code API');
      }

    } catch (error) {
      throw new Error(`Błąd generowania kodu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async generateEmbedding(message: string): Promise<any> {
    try {
      const text = this.extractTextForEmbedding(message);
      
      const requestBody: PaLMEmbeddingRequest = {
        text: text,
        model: 'embedding-gecko-001'
      };

      const response = await this.makeAPIRequest('embedText', requestBody);
      
      return {
        embedding: response.embedding?.value || [],
        text: text,
        model_used: 'embedding-gecko-001',
        dimensions: response.embedding?.value?.length || 0
      };

    } catch (error) {
      throw new Error(`Błąd generowania embeddingu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async completeText(message: string): Promise<any> {
    try {
      const textToComplete = this.extractTextToComplete(message);
      
      const requestBody: PaLMRequest = {
        prompt: `Complete the following text:\n\n${textToComplete}`,
        model: 'text-bison-001',
        temperature: 0.8,
        max_output_tokens: 1000,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          completion: response.candidates[0].output,
          original_text: textToComplete,
          model_used: 'text-bison-001'
        };
      } else {
        throw new Error('Nie udało się dokończyć tekstu');
      }

    } catch (error) {
      throw new Error(`Błąd dokończenia tekstu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async summarizeText(message: string): Promise<any> {
    try {
      const textToSummarize = this.extractTextToSummarize(message);
      
      const requestBody: PaLMRequest = {
        prompt: `Please provide a concise summary of the following text:\n\n${textToSummarize}`,
        model: 'text-bison-001',
        temperature: 0.3, // Lower temperature for more consistent summaries
        max_output_tokens: 500,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          summary: response.candidates[0].output,
          original_length: textToSummarize.length,
          summary_length: response.candidates[0].output.length,
          compression_ratio: ((textToSummarize.length - response.candidates[0].output.length) / textToSummarize.length * 100).toFixed(1)
        };
      } else {
        throw new Error('Nie udało się podsumować tekstu');
      }

    } catch (error) {
      throw new Error(`Błąd podsumowania tekstu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async translateText(message: string): Promise<any> {
    try {
      const textToTranslate = this.extractTextToTranslate(message);
      const targetLanguage = this.extractTargetLanguage(message);
      
      const requestBody: PaLMRequest = {
        prompt: `Translate the following text to ${targetLanguage}:\n\n${textToTranslate}`,
        model: 'text-bison-001',
        temperature: 0.3,
        max_output_tokens: 1000,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          translated_text: response.candidates[0].output,
          original_text: textToTranslate,
          target_language: targetLanguage,
          model_used: 'text-bison-001'
        };
      } else {
        throw new Error('Nie udało się przetłumaczyć tekstu');
      }

    } catch (error) {
      throw new Error(`Błąd tłumaczenia tekstu PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async handleGeneralQuery(message: string): Promise<any> {
    try {
      const requestBody: PaLMRequest = {
        prompt: message,
        model: 'text-bison-001',
        temperature: 0.7,
        max_output_tokens: 1000,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.makeAPIRequest('generateText', requestBody);
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          response: response.candidates[0].output,
          model_used: 'text-bison-001'
        };
      } else {
        throw new Error('Nie mogę odpowiedzieć na to pytanie');
      }

    } catch (error) {
      throw new Error(`Błąd zapytania PaLM: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async makeAPIRequest(endpoint: string, requestBody: any): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.palmEndpoint}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            ...requestBody,
            safetySettings: this.safetySettings
          })
        });

        if (!response.ok) {
          throw new Error(`PaLM API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // Check for API-level errors
        if (data.error) {
          throw new Error(`PaLM API error: ${data.error.message}`);
        }
        
        // Check for content filters
        if (data.filters && data.filters.length > 0) {
          console.warn('Content filtered:', data.filters);
        }
        
        return data;

      } catch (error) {
        lastError = error as Error;
        
        // If it's a rate limit error, wait before retrying
        if (error instanceof Error && error.message.includes('429')) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // For other errors, don't retry
        throw error;
      }
    }
    
    throw lastError || new Error('API request failed after all retries');
  }

  private extractPromptFromMessage(message: string): string {
    return message
      .replace(/^(wygeneruj tekst|generate text|napisz)\s*/i, '')
      .trim();
  }

  private extractCodePromptFromMessage(message: string): string {
    return message
      .replace(/^(wygeneruj kod|generate code|napisz kod|kod)\s*/i, '')
      .trim();
  }

  private extractLanguageFromMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('python')) return 'Python';
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) return 'JavaScript';
    if (lowerMessage.includes('typescript') || lowerMessage.includes('ts')) return 'TypeScript';
    if (lowerMessage.includes('java')) return 'Java';
    if (lowerMessage.includes('c++') || lowerMessage.includes('cpp')) return 'C++';
    if (lowerMessage.includes('c#') || lowerMessage.includes('csharp')) return 'C#';
    if (lowerMessage.includes('go') || lowerMessage.includes('golang')) return 'Go';
    if (lowerMessage.includes('rust')) return 'Rust';
    if (lowerMessage.includes('php')) return 'PHP';
    if (lowerMessage.includes('ruby')) return 'Ruby';
    
    return 'Python'; // Default
  }

  private extractTextForEmbedding(message: string): string {
    return message
      .replace(/^(embedding|wektor|reprezentacja)\s*/i, '')
      .trim();
  }

  private extractTextToComplete(message: string): string {
    return message
      .replace(/^(dokończ|complete|kontynuuj tekst)\s*/i, '')
      .trim();
  }

  private extractTextToSummarize(message: string): string {
    return message
      .replace(/^(podsumuj|summarize|streszczenie)\s*/i, '')
      .trim();
  }

  private extractTextToTranslate(message: string): string {
    const match = message.match(/przetłumacz\s+"([^"]+)"/i) || 
                  message.match(/translate\s+"([^"]+)"/i);
    
    if (match) {
      return match[1];
    }
    
    return message
      .replace(/^(przetłumacz|translate)\s*/i, '')
      .replace(/\s+(na|to)\s+\w+.*$/i, '')
      .trim();
  }

  private extractTargetLanguage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('na polski') || lowerMessage.includes('to polish')) return 'Polish';
    if (lowerMessage.includes('na angielski') || lowerMessage.includes('to english')) return 'English';
    if (lowerMessage.includes('na niemiecki') || lowerMessage.includes('to german')) return 'German';
    if (lowerMessage.includes('na francuski') || lowerMessage.includes('to french')) return 'French';
    if (lowerMessage.includes('na hiszpański') || lowerMessage.includes('to spanish')) return 'Spanish';
    if (lowerMessage.includes('na włoski') || lowerMessage.includes('to italian')) return 'Italian';
    
    return 'English'; // Default
  }

  private extractExplanationFromCode(code: string): string {
    // Extract comments from code as explanation
    const comments = code.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || 
                    code.match(/#.*$/gm) || 
                    code.match(/'''[\s\S]*?'''|"""[\s\S]*?"""/gm) || [];
    
    return comments.join(' ').trim() || 'Brak wyjaśnienia w kodzie';
  }

  private formatGenerationResult(result: any): string {
    let output = '📝 **Wygenerowany tekst:**\n\n';
    output += result.text;
    
    if (result.safety_ratings && result.safety_ratings.length > 0) {
      output += '\n\n🛡️ **Ocena bezpieczeństwa:**\n';
      result.safety_ratings.forEach((rating: any) => {
        output += `• ${rating.category}: ${rating.probability}\n`;
      });
    }
    
    return output;
  }

  private formatCodeResult(result: any): string {
    let output = '💻 **Wygenerowany kod:**\n\n';
    output += `**Język:** ${result.language}\n\n`;
    output += '```' + result.language.toLowerCase() + '\n';
    output += result.code;
    output += '\n```\n\n';
    
    if (result.explanation && result.explanation !== 'Brak wyjaśnienia w kodzie') {
      output += `📝 **Wyjaśnienie:** ${result.explanation}`;
    }
    
    return output;
  }

  private formatEmbeddingResult(result: any): string {
    let output = '🔢 **Embedding wektora:**\n\n';
    output += `📊 **Wymiary:** ${result.dimensions}\n`;
    output += `📄 **Tekst:** ${result.text.substring(0, 100)}${result.text.length > 100 ? '...' : ''}\n`;
    output += `🤖 **Model:** ${result.model_used}\n\n`;
    
    if (result.embedding.length > 0) {
      output += `🔢 **Wektor (pierwsze 5 wartości):** [${result.embedding.slice(0, 5).map((v: number) => v.toFixed(4)).join(', ')}...]`;
    }
    
    return output;
  }

  private formatTranslationResult(result: any): string {
    let output = '🌍 **Tłumaczenie:**\n\n';
    output += `🎯 **Język docelowy:** ${result.target_language}\n\n`;
    output += `**Oryginał:**\n${result.original_text}\n\n`;
    output += `**Tłumaczenie:**\n${result.translated_text}`;
    
    return output;
  }

  async testConnection(): Promise<AgentResponse> {
    try {
      const testRequest: PaLMRequest = {
        prompt: 'Test connection',
        model: 'text-bison-001',
        temperature: 0.1,
        max_output_tokens: 10,
        top_p: 0.1,
        top_k: 1
      };

      const response = await this.makeAPIRequest('generateText', testRequest);

      return {
        status: 'success',
        data: { 
          connected: true,
          models: this.availableModels,
          safety_settings: this.safetySettings.length
        },
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

  getAvailableModels(): string[] {
    return [...this.availableModels];
  }

  getSafetySettings(): SafetySettings[] {
    return [...this.safetySettings];
  }

  updateSafetySettings(settings: SafetySettings[]): void {
    this.safetySettings = [...settings];
  }

  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down PaLM API Agent...');
    this.config.status = 'offline';
    console.log('✅ PaLM API Agent shutdown complete');
  }
}

// Export default instance creator
export function createPaLMAPIAgent(config?: Partial<AgentConfig>): PaLMAPIAgent {
  const defaultConfig: AgentConfig = {
    agent_id: 'palm-api',
    name: 'PaLM API Agent',
    model: 'palm-api',
    status: 'offline',
    category: 'core',
    icon: '🌴',
    color: '#fbbc04',
    priority: 'HIGH',
    description: 'Google PaLM API for advanced language processing and generation'
  };

  return new PaLMAPIAgent({ ...defaultConfig, ...config });
}