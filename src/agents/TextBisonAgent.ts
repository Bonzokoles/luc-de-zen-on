import { BaseAgent, type AgentConfig } from './BaseAgent';

export interface TextBisonAgentConfig extends AgentConfig {
  apiKey: string;
  projectId: string;
  location?: string;
}

export class TextBisonAgent extends BaseAgent {
  protected config: TextBisonAgentConfig;
  private apiEndpoint: string;

  constructor(config: TextBisonAgentConfig) {
    super(config);

    this.config = config;
    this.apiEndpoint = `https://${config.location || 'us-central1'}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${config.location || 'us-central1'}/publishers/google/models/text-bison:predict`;
  }

  async generateText(prompt: string, maxTokens: number = 512): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: prompt
          }],
          parameters: {
            temperature: 0.7,
            maxOutputTokens: maxTokens,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Text Bison API error: ${response.status}`);
      }

      const data: { predictions: { content: string }[] } = await response.json();
      const result = data.predictions?.[0]?.content || 'Nie udało się wygenerować tekstu';
      
      this.updateStatus('ready');
      this.addToHistory({ type: 'text_generation', input: prompt, output: result });
      
      return result;
    } catch (error) {
      this.updateStatus('error');
      console.error('📝 Text Bison error:', error);
      throw error;
    }
  }

  async chat(message: string, context?: any): Promise<string> {
    return this.generateText(message);
  }

  async generateCode(prompt: string, language?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async analyzeImage(imageData: string | File, prompt?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async summarize(text: string): Promise<string> {
    const prompt = 'Podsumuj następujący tekst w sposób zwięzły i treściwy:\n\n' +
      text + '\n\n' +
      'Podsumowanie:';
    
    return this.generateText(prompt, 256);
  }

  async translate(text: string, targetLanguage: string = 'polski'): Promise<string> {
    const prompt = 'Przetłumacz następujący tekst na język ' + targetLanguage + ':\n\n' +
      text + '\n\n' +
      'Tłumaczenie:';
    
    return this.generateText(prompt, 512);
  }
}