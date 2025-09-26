// Google ADK Vertex AI Agent  
// Advanced AI agent for Google Cloud Vertex AI services integration

import type { AgentConfig, AgentResponse } from '../types';
import { BaseGoogleADKAgent } from '../types';

export interface VertexAIRequest {
  modelName: string;
  prompt: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
    topK: number;
  };
  endpoint?: string;
}

export interface ModelDeployment {
  id: string;
  name: string;
  model: string;
  status: 'deployed' | 'deploying' | 'failed' | 'offline';
  endpoint: string;
  region: string;
}

export interface PredictionResult {
  predictions: Record<string, unknown>[];
  metadata: {
    model: string;
    version: string;
    latency: number;
    tokens_used: number;
  };
}

export class VertexAIAgent extends BaseGoogleADKAgent {
  private vertexEndpoint: string;
  private projectId: string;
  private region: string;
  private availableModels: string[];
  private deployedModels: ModelDeployment[];

  constructor(config: AgentConfig) {
    super(config);
    const endpointBase = process.env.VERTEX_AI_API_BASE?.trim();
    if (endpointBase) {
      if (!/^https?:\/\//.test(endpointBase)) {
        throw new Error('VERTEX_AI_API_BASE (absolute URL) must be configured for Vertex AI requests');
      }
      this.vertexEndpoint = endpointBase.replace(/\/$/, '');
    } else {
      this.vertexEndpoint = '/api/vertex-ai';
    }
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || 'my-bonzo-zen-com';
    this.region = process.env.VERTEX_AI_REGION || 'us-central1';
    this.availableModels = [
      'text-bison',
      'text-bison-32k',
      'code-bison',
      'code-bison-32k',
      'codechat-bison',
      'chat-bison',
      'chat-bison-32k',
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'claude-3-sonnet',
      'claude-3-haiku',
      'llama2-70b-chat'
    ];
    this.deployedModels = [];
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
        case 'predict':
          result = await this.makePrediction(message);
          responseText = this.formatPredictionResult(result);
          toolsUsed = ['vertex_ai_prediction'];
          break;
        case 'chat':
          result = await this.chatWithModel(message);
          responseText = result.response;
          toolsUsed = ['vertex_ai_chat'];
          break;
        case 'generate_code':
          result = await this.generateCode(message);
          responseText = result.code;
          toolsUsed = ['vertex_ai_code_generation'];
          break;
        case 'analyze_image':
          result = await this.analyzeImage(message);
          responseText = this.formatImageAnalysisResult(result);
          toolsUsed = ['vertex_ai_vision'];
          break;
        case 'deploy_model':
          result = await this.deployModel(message);
          responseText = this.formatDeploymentResult(result);
          toolsUsed = ['vertex_ai_deployment'];
          break;
        case 'list_models':
          result = await this.listAvailableModels();
          responseText = this.formatModelsList(result);
          toolsUsed = ['vertex_ai_models'];
          break;
        case 'batch_predict':
          result = await this.batchPredict(message);
          responseText = this.formatBatchResult(result);
          toolsUsed = ['vertex_ai_batch'];
          break;
        default:
          result = await this.handleGeneralQuery(message);
          responseText = result.response;
          toolsUsed = ['vertex_ai_general'];
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

  private determineRequestType(message: string): 'predict' | 'chat' | 'generate_code' | 'analyze_image' | 'deploy_model' | 'list_models' | 'batch_predict' | 'general' {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('przewiduj') || lowerMessage.includes('predict') || 
        lowerMessage.includes('inference') || lowerMessage.includes('model prediction')) {
      return 'predict';
    }
    
    if (lowerMessage.includes('chat') || lowerMessage.includes('rozmowa') ||
        lowerMessage.includes('konwersacja') || lowerMessage.includes('odpowiedz')) {
      return 'chat';
    }
    
    if (lowerMessage.includes('generuj kod') || lowerMessage.includes('generate code') ||
        lowerMessage.includes('napisz kod') || lowerMessage.includes('stwórz funkcję')) {
      return 'generate_code';
    }
    
    if (lowerMessage.includes('analizuj obraz') || lowerMessage.includes('analyze image') ||
        lowerMessage.includes('rozpoznaj') || lowerMessage.includes('vision')) {
      return 'analyze_image';
    }
    
    if (lowerMessage.includes('wdróż model') || lowerMessage.includes('deploy model') ||
        lowerMessage.includes('deployment') || lowerMessage.includes('uruchom model')) {
      return 'deploy_model';
    }
    
    if (lowerMessage.includes('lista modeli') || lowerMessage.includes('list models') ||
        lowerMessage.includes('dostępne modele') || lowerMessage.includes('available models')) {
      return 'list_models';
    }
    
    if (lowerMessage.includes('batch') || lowerMessage.includes('wsadowo') ||
        lowerMessage.includes('masowo') || lowerMessage.includes('wiele predykcji')) {
      return 'batch_predict';
    }
    
    return 'general';
  }

  private async makePrediction(message: string): Promise<PredictionResult> {
    try {
      const modelName = this.extractModelFromMessage(message) || 'gemini-pro';
      const prompt = this.extractPromptFromMessage(message);
      
      const requestBody: VertexAIRequest = {
        modelName: modelName,
        prompt: prompt,
        parameters: {
          temperature: 0.7,
          maxTokens: 1000,
          topP: 0.95,
          topK: 40
        }
      };

      const response = await fetch(`${this.vertexEndpoint}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI prediction error: ${response.status}`);
      }

      const data = await response.json();
      return {
        predictions: data.predictions || [],
        metadata: {
          model: modelName,
          version: data.model_version || '1.0',
          latency: data.latency || 0,
          tokens_used: data.tokens_used || 0
        }
      };

    } catch (error) {
      throw new Error(`Błąd przewidywania Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async chatWithModel(message: string): Promise<any> {
    try {
      const modelName = this.extractModelFromMessage(message) || 'chat-bison';
      const chatMessage = this.extractPromptFromMessage(message);
      
      const requestBody = {
        model: modelName,
        messages: [
          {
            role: 'user',
            content: chatMessage
          }
        ],
        parameters: {
          temperature: 0.7,
          maxTokens: 2000
        }
      };

      const response = await fetch(`${this.vertexEndpoint}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI chat error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response || 'Nie otrzymano odpowiedzi z modelu',
        model: modelName,
        tokens: data.tokens_used || 0
      };

    } catch (error) {
      throw new Error(`Błąd czatu Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async generateCode(message: string): Promise<any> {
    try {
      const codePrompt = this.extractPromptFromMessage(message);
      const language = this.extractLanguageFromMessage(message);
      
      const requestBody = {
        model: 'code-bison',
        prompt: codePrompt,
        language: language,
        parameters: {
          temperature: 0.2,
          maxTokens: 2000
        }
      };

      const response = await fetch(`${this.vertexEndpoint}/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI code generation error: ${response.status}`);
      }

      const data = await response.json();
      return {
        code: data.code || '// Nie udało się wygenerować kodu',
        language: language,
        explanation: data.explanation || ''
      };

    } catch (error) {
      throw new Error(`Błąd generowania kodu Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async analyzeImage(message: string): Promise<any> {
    try {
      const imageUrl = this.extractImageFromMessage(message);
      if (!imageUrl) {
        throw new Error('Nie znaleziono obrazu do analizy');
      }

      const requestBody = {
        model: 'gemini-pro-vision',
        image_url: imageUrl,
        prompt: 'Przeanalizuj ten obraz i opisz co widzisz'
      };

      const response = await fetch(`${this.vertexEndpoint}/vision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI vision error: ${response.status}`);
      }

      const data = await response.json();
      return {
        description: data.description || 'Nie udało się przeanalizować obrazu',
        objects: data.objects || [],
        text: data.text || '',
        confidence: data.confidence || 0
      };

    } catch (error) {
      throw new Error(`Błąd analizy obrazu Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async deployModel(message: string): Promise<any> {
    try {
      const modelName = this.extractModelFromMessage(message);
      if (!modelName) {
        throw new Error('Nie określono modelu do wdrożenia');
      }

      const requestBody = {
        model: modelName,
        deployment_name: `${modelName}-deployment-${Date.now()}`,
        machine_type: 'n1-standard-4',
        min_replicas: 1,
        max_replicas: 3
      };

      const response = await fetch(`${this.vertexEndpoint}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI deployment error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add to deployed models
      const newDeployment: ModelDeployment = {
        id: data.deployment_id,
        name: requestBody.deployment_name,
        model: modelName,
        status: 'deploying',
        endpoint: data.endpoint_url || '',
        region: this.region
      };
      
      this.deployedModels.push(newDeployment);

      return {
        deployment_id: data.deployment_id,
        endpoint: data.endpoint_url,
        status: 'deploying',
        estimated_time: '5-10 minut'
      };

    } catch (error) {
      throw new Error(`Błąd wdrażania modelu Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async listAvailableModels(): Promise<any> {
    return {
      available: this.availableModels,
      deployed: this.deployedModels,
      total_available: this.availableModels.length,
      total_deployed: this.deployedModels.length
    };
  }

  private async batchPredict(message: string): Promise<any> {
    try {
      const modelName = this.extractModelFromMessage(message) || 'gemini-pro';
      const inputData = this.extractBatchDataFromMessage(message);
      
      const requestBody = {
        model: modelName,
        instances: inputData,
        batch_size: 10
      };

      const response = await fetch(`${this.vertexEndpoint}/batch-predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI batch prediction error: ${response.status}`);
      }

      const data = await response.json();
      return {
        job_id: data.job_id,
        status: 'running',
        total_instances: inputData.length,
        estimated_completion: data.estimated_completion || '10-30 minut'
      };

    } catch (error) {
      throw new Error(`Błąd batch prediction Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async handleGeneralQuery(message: string): Promise<any> {
    try {
      const response = await fetch(`${this.vertexEndpoint}/general`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message })
      });

      if (!response.ok) {
        throw new Error(`Vertex AI general query error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response || 'Nie mogę odpowiedzieć na to pytanie'
      };

    } catch (error) {
      throw new Error(`Błąd zapytania Vertex AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async refreshDeployedModels(): Promise<void> {
    try {
      const response = await fetch(`${this.vertexEndpoint}/deployments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.deployedModels = data.deployments || [];
      }
    } catch (error) {
      console.warn('Could not refresh deployed models:', error);
    }
  }

  private extractModelFromMessage(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    for (const model of this.availableModels) {
      if (lowerMessage.includes(model.toLowerCase())) {
        return model;
      }
    }
    
    return null;
  }

  private extractPromptFromMessage(message: string): string {
    // Remove model references and commands
    return message
      .replace(/model:\s*[\w-]+/gi, '')
      .replace(/^(przewiduj|predict|chat|generuj|analyze|wdróż|deploy|lista|list)\s*/i, '')
      .trim();
  }

  private extractLanguageFromMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('python')) return 'python';
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) return 'javascript';
    if (lowerMessage.includes('typescript') || lowerMessage.includes('ts')) return 'typescript';
    if (lowerMessage.includes('java')) return 'java';
    if (lowerMessage.includes('c++') || lowerMessage.includes('cpp')) return 'cpp';
    if (lowerMessage.includes('c#') || lowerMessage.includes('csharp')) return 'csharp';
    if (lowerMessage.includes('go') || lowerMessage.includes('golang')) return 'go';
    if (lowerMessage.includes('rust')) return 'rust';
    if (lowerMessage.includes('php')) return 'php';
    if (lowerMessage.includes('ruby')) return 'ruby';
    
    return 'python'; // Default
  }

  private extractImageFromMessage(message: string): string | null {
    const urlMatch = message.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i);
    return urlMatch ? urlMatch[1] : null;
  }

  private extractBatchDataFromMessage(message: string): Record<string, unknown>[] {
    const jsonSnippet = message.match(/```json([\s\S]+?)```/i);
    if (jsonSnippet) {
      try {
        const payload = JSON.parse(jsonSnippet[1].trim());
        if (Array.isArray(payload)) {
          return payload;
        }
      } catch {
        throw new Error('Batch prediction payload could not be parsed as JSON.');
      }
    }
    throw new Error('Batch prediction payload not provided. Please include a JSON array of instances.');
  }

  private formatPredictionResult(result: PredictionResult): string {
    let output = '🔮 **Vertex AI Prediction:**\n\n';
    output += `📊 **Model:** ${result.metadata.model}\n`;
    output += `⚡ **Latency:** ${result.metadata.latency}ms\n`;
    output += `🎯 **Tokens Used:** ${result.metadata.tokens_used}\n\n`;
    
    if (result.predictions.length > 0) {
      output += '**Predictions:**\n';
      result.predictions.slice(0, 3).forEach((pred, idx) => {
        output += `${idx + 1}. ${JSON.stringify(pred).substring(0, 200)}...\n`;
      });
    }
    
    return output;
  }

  private formatImageAnalysisResult(result: any): string {
    let output = '🖼️ **Analiza obrazu:**\n\n';
    output += `📝 **Opis:** ${result.description}\n\n`;
    
    if (result.objects.length > 0) {
      output += `🎯 **Wykryte obiekty:** ${result.objects.join(', ')}\n\n`;
    }
    
    if (result.text) {
      output += `📄 **Tekst na obrazie:** ${result.text}\n\n`;
    }
    
    output += `🎯 **Pewność:** ${(result.confidence * 100).toFixed(1)}%`;
    
    return output;
  }

  private formatDeploymentResult(result: any): string {
    let output = '🚀 **Model Deployment:**\n\n';
    output += `🆔 **ID:** ${result.deployment_id}\n`;
    output += `🌐 **Endpoint:** ${result.endpoint}\n`;
    output += `📊 **Status:** ${result.status}\n`;
    output += `⏱️ **Czas wdrożenia:** ${result.estimated_time}`;
    
    return output;
  }

  private formatModelsList(result: any): string {
    let output = '📋 **Dostępne modele Vertex AI:**\n\n';
    output += `📊 **Łącznie dostępnych:** ${result.total_available}\n`;
    output += `🚀 **Wdrożonych:** ${result.total_deployed}\n\n`;
    
    output += '**Dostępne modele:**\n';
    result.available.slice(0, 10).forEach((model: string) => {
      output += `• ${model}\n`;
    });
    
    if (result.deployed.length > 0) {
      output += '\n**Wdrożone modele:**\n';
      result.deployed.forEach((deployment: ModelDeployment) => {
        output += `• ${deployment.name} (${deployment.status})\n`;
      });
    }
    
    return output;
  }

  private formatBatchResult(result: any): string {
    let output = '📦 **Batch Prediction:**\n\n';
    output += `🆔 **Job ID:** ${result.job_id}\n`;
    output += `📊 **Status:** ${result.status}\n`;
    output += `📈 **Instances:** ${result.total_instances}\n`;
    output += `⏱️ **Szacowany czas:** ${result.estimated_completion}`;
    
    return output;
  }

  async testConnection(): Promise<AgentResponse> {
    try {
      const response = await fetch(`${this.vertexEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return {
        status: response.ok ? 'success' : 'error',
        data: response.ok ? { 
          connected: true,
          project: this.projectId,
          region: this.region,
          models: this.availableModels.length 
        } : null,
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

  getAvailableModels(): string[] {
    return [...this.availableModels];
  }

  getDeployedModels(): ModelDeployment[] {
    return [...this.deployedModels];
  }

  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down Vertex AI Agent...');
    this.config.status = 'offline';
    console.log('✅ Vertex AI Agent shutdown complete');
  }
}

// Export default instance creator
export function createVertexAIAgent(config?: Partial<AgentConfig>): VertexAIAgent {
  const defaultConfig: AgentConfig = {
    agent_id: 'vertex-ai',
    name: 'Vertex AI Agent',
    model: 'vertex-ai',
    status: 'offline',
    category: 'core',
    icon: '🔮',
    color: '#4285f4',
    priority: 'HIGH',
    description: 'Advanced Google Cloud Vertex AI services integration'
  };

  return new VertexAIAgent({ ...defaultConfig, ...config });
}