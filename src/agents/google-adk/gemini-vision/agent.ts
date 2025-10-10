// Google ADK Gemini Vision Agent
// AI agent for image analysis and computer vision tasks

import type { AgentConfig, AgentResponse, ImageAnalysisResult, OCRResult } from '../types';
import { BaseGoogleADKAgent } from '../types';

export interface ImageProcessingOptions {
  analyzeObjects: boolean;
  extractText: boolean;
  detectFaces: boolean;
  analyzeScene: boolean;
  maxImageSize: number;
}

export class GeminiVisionAgent extends BaseGoogleADKAgent {
  private apiEndpoint: string;
  private supportedFormats: string[];
  private maxImageSize: number;

  constructor(config: AgentConfig) {
    super(config);
    this.apiEndpoint = '/api/gemini-vision';
    this.supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    this.maxImageSize = 4 * 1024 * 1024; // 4MB
  }

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Gemini Vision Agent...');
      this.config.status = 'ready';
      
      // Test connection to Gemini Vision API
      const testResponse = await this.testConnection();
      if (testResponse.status !== 'success') {
        throw new Error('Failed to connect to Gemini Vision API');
      }

      console.log('✅ Gemini Vision Agent initialized successfully');
      
    } catch (error) {
      console.error('Gemini Vision initialization failed:', error);
      this.config.status = 'error';
      throw error;
    }
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const startTime = new Date();
    
    try {
      this.config.status = 'busy';
      
      // Check if message contains image data or URL
      const imageData = this.extractImageFromMessage(message);
      if (!imageData) {
        this.config.status = 'ready';
        return {
          status: 'error',
          error_message: 'Nie znaleziono obrazu do analizy. Prześlij obraz lub podaj URL.',
          metadata: {
            agent: this.config.agent_id,
            model: this.config.model,
            response_time: 0,
            timestamp: new Date().toISOString()
          }
        };
      }

      const analysisResult = await this.analyzeImage(imageData, {
        analyzeObjects: true,
        extractText: true,
        detectFaces: true,
        analyzeScene: true,
        maxImageSize: this.maxImageSize
      });

      this.config.status = 'ready';
      
      // Update metrics and history
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, true);
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'input',
        content: 'Analiza obrazu',
        response_time: responseTime,
        metadata: { imageSize: imageData.size }
      });
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'output',
        content: this.formatAnalysisResult(analysisResult),
        response_time: responseTime
      });
      
      return {
        status: 'success',
        response: this.formatAnalysisResult(analysisResult),
        data: analysisResult,
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: responseTime,
          timestamp: new Date().toISOString(),
          tools_used: ['image_analysis', 'object_detection', 'ocr']
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

  private extractImageFromMessage(message: string): { data: string; size: number; type: string } | null {
    try {
      // Check for base64 image data
      const base64Regex = /data:image\/(jpeg|jpg|png|webp|gif);base64,([A-Za-z0-9+/=]+)/;
      const match = message.match(base64Regex);
      
      if (match) {
        const [, type, data] = match;
        return {
          data: data,
          size: (data.length * 3) / 4, // Approximate size
          type: type
        };
      }

      // Check for image URL
      const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif))/i;
      const urlMatch = message.match(urlRegex);
      
      if (urlMatch) {
        return {
          data: urlMatch[1],
          size: 0, // Unknown size for URLs
          type: 'url'
        };
      }

      return null;
    } catch (error) {
      console.error('Error extracting image from message:', error);
      return null;
    }
  }

  private async analyzeImage(imageData: { data: string; size: number; type: string }, options: ImageProcessingOptions): Promise<ImageAnalysisResult> {
    try {
      // Validate image size
      if (imageData.size > options.maxImageSize) {
        throw new Error(`Obraz jest za duży. Maksymalny rozmiar: ${options.maxImageSize / 1024 / 1024}MB`);
      }

      const requestBody = {
        image: imageData.data,
        imageType: imageData.type,
        options: options
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini Vision API error: ${response.status}`);
      }

      const data: { objects: any[]; description: string; colors: string[]; text: string[]; faces: any[]; quality: 'niska' | 'średnia' | 'wysoka' } = await response.json();
      
      return {
        objects_detected: data.objects || [],
        scene_description: data.description || 'Nie można opisać sceny',
        colors: data.colors || [],
        text_detected: data.text || [],
        faces_count: data.faces?.length || 0,
        image_quality: data.quality || 'średnia'
      };

    } catch (error) {
      throw new Error(`Błąd analizy obrazu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private formatAnalysisResult(result: ImageAnalysisResult): string {
    let output = '🖼️ **Analiza obrazu:**\n\n';
    
    output += `📝 **Opis sceny:** ${result.scene_description}\n\n`;
    
    if (result.objects_detected.length > 0) {
      output += '🔍 **Wykryte obiekty:**\n';
      result.objects_detected.forEach(obj => {
        output += `• ${obj.name} (pewność: ${Math.round(obj.confidence * 100)}%)\n`;
      });
      output += '\n';
    }
    
    if (result.text_detected && result.text_detected.length > 0) {
      output += '📖 **Wykryty tekst:**\n';
      result.text_detected.forEach(text => {
        output += `• "${text}"\n`;
      });
      output += '\n';
    }
    
    if (result.faces_count && result.faces_count > 0) {
      output += `👥 **Liczba wykrytych twarzy:** ${result.faces_count}\n\n`;
    }
    
    if (result.colors.length > 0) {
      output += `🎨 **Dominujące kolory:** ${result.colors.join(', ')}\n\n`;
    }
    
    output += `⭐ **Jakość obrazu:** ${result.image_quality}`;
    
    return output;
  }

  async extractTextFromImage(imageData: string): Promise<OCRResult> {
    try {
      const response = await fetch(`${this.apiEndpoint}/ocr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      });

      if (!response.ok) {
        throw new Error(`OCR API error: ${response.status}`);
      }

      const data: { text: string; confidence: number; language: string; regions: any[] } = await response.json();
      
      return {
        extracted_text: data.text || '',
        confidence: data.confidence || 0,
        language: data.language || 'unknown',
        text_regions: data.regions || []
      };

    } catch (error) {
      throw new Error(`Błąd OCR: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  async testConnection(): Promise<AgentResponse> {
    try {
      const response = await fetch(`${this.apiEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
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

  getSupportedFormats(): string[] {
    return [...this.supportedFormats];
  }

  getMaxImageSize(): number {
    return this.maxImageSize;
  }

  setMaxImageSize(size: number): void {
    this.maxImageSize = Math.max(1024 * 1024, Math.min(10 * 1024 * 1024, size)); // 1MB - 10MB
  }

  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down Gemini Vision Agent...');
    this.config.status = 'offline';
    console.log('✅ Gemini Vision Agent shutdown complete');
  }
}

// Export default instance creator
export function createGeminiVisionAgent(config?: Partial<AgentConfig>): GeminiVisionAgent {
  const defaultConfig: AgentConfig = {
    agent_id: 'gemini-vision',
    name: 'Gemini Vision Agent',
    model: 'gemini-pro-vision',
    status: 'offline',
    category: 'specialized',
    icon: '👁️',
    color: '#34a853',
    priority: 'HIGH',
    description: 'Advanced computer vision AI for image analysis and OCR'
  };

  return new GeminiVisionAgent({ ...defaultConfig, ...config });
}