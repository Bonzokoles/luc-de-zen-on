import { BaseAgent, type AgentConfig } from './BaseAgent';

export interface GeminiVisionAgentConfig extends AgentConfig {
  apiKey: string;
  projectId: string;
  location?: string;
}

export class GeminiVisionAgent extends BaseAgent {
  protected config: GeminiVisionAgentConfig;
  private apiEndpoint: string;

  constructor(config: GeminiVisionAgentConfig) {
    super(config);

    this.config = config;
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
  }

  async chat(message: string, context?: any): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async generateCode(prompt: string, language?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async analyzeImage(imageData: string, prompt: string = "Opisz co widzisz na tym obrazie"): Promise<string> {
    try {
      this.updateStatus('processing');

      const response = await fetch(`${this.apiEndpoint}?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini Vision API error: ${response.status}`);
      }

      const data: { candidates: { content: { parts: { text: string }[] } }[] } = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nie udało się przeanalizować obrazu';

      this.updateStatus('ready');
      this.addToHistory({ type: 'image_analysis', input: prompt, output: result });

      return result;
    } catch (error) {
      this.updateStatus('error');
      console.error(' Gemini Vision error:', error);
      throw error;
    }
  }

  async extractText(imageData: string): Promise<string> {
    return this.analyzeImage(imageData, "Wyciągnij cały tekst z tego obrazu. Zachowaj formatowanie i strukturę.");
  }

  async identifyObjects(imageData: string): Promise<string> {
    return this.analyzeImage(imageData, "Zidentyfikuj wszystkie obiekty na tym obrazie i opisz ich lokalizację.");
  }
}
