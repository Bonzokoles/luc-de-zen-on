
import { BaseAgent } from './BaseAgent';

export interface GeminiProConfig {
  apiKey: string;
  projectId: string;
  location?: string;
  model?: string;
}

export class GeminiProAgent extends BaseAgent {
  private config: GeminiProConfig;
  private apiEndpoint: string;

  constructor(config: GeminiProConfig) {
    super({
      id: 'gemini_pro_agent',
      name: 'Gemini Pro',
      model: 'gemini-pro',
      category: 'core',
      icon: '🤖',
      color: '#4285f4',
      priority: 'HIGH',
      description: 'Advanced conversational AI with reasoning capabilities',
      capabilities: ['Chat', 'Reasoning', 'Analysis', 'Code Review', 'Writing']
    });

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

      const data = await response.json();
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

  async analyzeCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = `Przeanalizuj następujący kod ${language} i podaj szczegółową ocenę:

\`\`\`${language}
${code}
\`\`\`

Oceń:
1. Jakość kodu
2. Potencjalne problemy
3. Sugestie ulepszeń
4. Bezpieczeństwo
5. Wydajność`;

    return this.chat(prompt);
  }

  async generateText(prompt: string, style: string = 'professional'): Promise<string> {
    const styledPrompt = `Napisz tekst w stylu ${style} na temat: ${prompt}`;
    return this.chat(styledPrompt);
  }
}
