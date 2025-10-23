import { BaseAgent } from './BaseAgent'; import type { AgentConfig } from './BaseAgent';

export interface CodeBisonAgentConfig extends AgentConfig {
  apiKey: string;
  projectId: string;
  location?: string;
}

export class CodeBisonAgent extends BaseAgent {
  protected config: CodeBisonAgentConfig;
  private apiEndpoint: string;

  constructor(config: CodeBisonAgentConfig) {
    super(config);

    this.config = config;
    this.apiEndpoint = `https://${config.location || 'us-central1'}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${config.location || 'us-central1'}/publishers/google/models/code-bison:predict`;
  }

  async chat(message: string, context?: any): Promise<string> {
    return this.generateCode(message);
  }

  async analyzeImage(imageData: string | File, prompt?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async generateCode(description: string, language: string = 'typescript'): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const prompt = "Wygeneruj kod w języku " + language + " na podstawie opisu: " + description + "\n      \n\nWymagania:\n- Kod powinien być czytelny i dobrze skomentowany\n- Użyj najlepszych praktyk dla " + language + "\n- Dodaj obsługę błędów gdzie to konieczne\n- Kod powinien być gotowy do użycia";

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prefix: prompt
          }],
          parameters: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            candidateCount: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Code Bison API error: ${response.status}`);
      }

      const data: { predictions: { content: string }[] } = await response.json();
      const result = data.predictions?.[0]?.content || 'Nie udało się wygenerować kodu';
      
      this.updateStatus('ready');
      this.addToHistory({ type: 'code_generation', input: description, output: result });
      
      return result;
    } catch (error) {
      this.updateStatus('error');
      console.error('💻 Code Bison error:', error);
      throw error;
    }
  }

  async reviewCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = "Przejrzyj następujący kod " + language + " i podaj szczegółową analizę:\n\n" +
      "```" + language + "\n" +
      code + "\n" +
      "```" + "\n\n" +
      "Sprawdź:\n" +
      "- Jakość kodu i czytelność\n" +
      "- Potencjalne błędy i problemy\n" +
      "- Sugestie optymalizacji\n" +
      "- Zgodność z najlepszymi praktykami\n" +
      "- Bezpieczeństwo kodu";

    return this.generateCode(prompt, language);
  }

  async debugCode(code: string, error: string, language: string = 'typescript'): Promise<string> {
    const prompt = "Pomóż debugować kod " + language + ":\n\n" +
      "Kod:\n" +
      "```" + language + "\n" +
      code + "\n" +
      "```" + "\n\n" +
      "Błąd: " + error + "\n\n" +
      "Znajdź przyczynę błędu i zaproponuj poprawkę.";

    return this.generateCode(prompt, language);
  }

  async refactorCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = "Refactor this " + language + " code to improve:\n" +
      "- Readability\n" +
      "- Performance\n" +
      "- Maintainability\n" +
      "- Best practices\n\n" +
      "Original code:\n" +
      "```" + language + "\n" +
      code + "\n" +
      "```" + "\n\n" +
      "Provide the refactored version with explanations of changes:";

    return this.generateCode(prompt, language);
  }

  async generateDocumentation(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = "Generate comprehensive documentation for this " + language + " code:\n\n" +
      "```" + language + "\n" +
      code + "\n" +
      "```" + "\n\n" +
      "Include:\n" +
      "- Function/class descriptions\n" +
      "- Parameter explanations\n" +
      "- Return value descriptions\n" +
      "- Usage examples\n" +
      "- JSDoc/TSDoc format";

    return this.generateCode(prompt, language);
  }

  async explainCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = "Explain this " + language + " code in detail:\n\n" +
      "```" + language + "\n" +
      code + "\n" +
      "```" + "\n\n" +
      "Provide:\n" +
      "- Step-by-step explanation\n" +
      "- Purpose of each part\n" +
      "- How it works\n" +
      "- Potential improvements";

    return this.generateCode(prompt, language);
  }
}
