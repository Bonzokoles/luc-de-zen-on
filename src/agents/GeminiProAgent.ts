import { BaseAgent } from './BaseAgent'; import type { AgentConfig } from './BaseAgent';

export interface GeminiProAgentConfig extends AgentConfig {
  apiKey: string;
  projectId: string;
  location?: string;
  model: string;
}

export class GeminiProAgent extends BaseAgent {
  protected config: GeminiProAgentConfig;
  private apiEndpoint: string;

  constructor(config: GeminiProAgentConfig) {
    super(config);

    this.config = config;
    this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro'}:generateContent`;
  }

  async chat(message: string, context?: any): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const response = await fetch(this.apiEndpoint + `?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: { candidates: { content: { parts: { text: string }[] } }[] } = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Brak odpowiedzi';
      
      this.updateStatus('ready');
      this.addToHistory({ type: 'chat', input: message, output: result });
      
      return result;
    } catch (error) {
      this.updateStatus('error');
      console.error('🤖 Gemini Pro error:', error);
      throw error;
    }
  }

  async generateCode(prompt: string, language?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async analyzeImage(imageData: string | File, prompt?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async analyzeCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = 'Przeanalizuj następujący kod ' + language + ' i podaj szczegółową ocenę:\n\n' +
      '```' + language + '\n' +
      code + '\n' +
      '```' + '\n\n' +
      'Oceń:\n' +
      '1. Jakość kodu\n' +
      '2. Potencjalne problemy\n' + 
      '3. Sugestie ulepszeń\n' +
      '4. Bezpieczeństwo\n' +
      '5. Wydajność';

    return this.chat(prompt);
  }

  async generateText(prompt: string, style: string = 'professional'): Promise<string> {
    const styledPrompt = 'Napisz tekst w stylu ' + style + ' na temat: ' + prompt;
    return this.chat(styledPrompt);
  }
}
