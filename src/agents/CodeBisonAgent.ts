
import { BaseAgent } from './BaseAgent';

export interface CodeBisonConfig {
  apiKey: string;
  projectId: string;
  location?: string;
}

export class CodeBisonAgent extends BaseAgent {
  protected config: CodeBisonConfig;
  private apiEndpoint: string;

  constructor(config: CodeBisonConfig) {
    super({
      id: 'code_bison_agent',
      name: 'Code Bison',
      model: 'code-bison',
      category: 'specialized',
      icon: '💻',
      color: '#00d4aa',
      priority: 'HIGH',
      description: 'Advanced code generation and programming assistance',
      capabilities: ['Code Generation', 'Code Review', 'Debugging', 'Refactoring', 'Documentation']
    });

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
      
      const prompt = `Wygeneruj kod w języku ${language} na podstawie opisu: ${description}
      
Wymagania:
- Kod powinien być czytelny i dobrze skomentowany
- Użyj najlepszych praktyk dla ${language}
- Dodaj obsługę błędów gdzie to konieczne
- Kod powinien być gotowy do użycia`;

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
    const prompt = `Przejrzyj następujący kod ${language} i podaj szczegółową analizę:

\`\`\`${language}
${code}
\`\`\`

Sprawdź:
- Jakość kodu i czytelność
- Potencjalne błędy i problemy
- Sugestie optymalizacji
- Zgodność z najlepszymi praktykami
- Bezpieczeństwo kodu`;

    return this.generateCode(prompt, language);
  }

  async debugCode(code: string, error: string, language: string = 'typescript'): Promise<string> {
    const prompt = `Pomóż debugować kod ${language}:

Kod:
\`\`\`${language}
${code}
\`\`\`

Błąd: ${error}

Znajdź przyczynę błędu i zaproponuj poprawkę.`;

    return this.generateCode(prompt, language);
  }

  async refactorCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = `Refactor this ${language} code to improve:
- Readability
- Performance
- Maintainability
- Best practices

Original code:
\`\`\`${language}
${code}
\`\`\`

Provide the refactored version with explanations of changes:`;

    return this.generateCode(prompt, language);
  }

  async generateDocumentation(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = `Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
- Function/class descriptions
- Parameter explanations
- Return value descriptions
- Usage examples
- JSDoc/TSDoc format`;

    return this.generateCode(prompt, language);
  }

  async explainCode(code: string, language: string = 'typescript'): Promise<string> {
    const prompt = `Explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide:
- Step-by-step explanation
- Purpose of each part
- How it works
- Potential improvements`;

    return this.generateCode(prompt, language);
  }
}
