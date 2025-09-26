// Google ADK Code Bison Agent
// AI agent specialized in code generation, analysis, and programming assistance

import type { AgentConfig, AgentResponse, CodeAnalysisResult } from '../types';
import { BaseGoogleADKAgent } from '../types';

export interface CodeGenerationRequest {
  prompt: string;
  language: string;
  style?: 'functional' | 'object-oriented' | 'procedural';
  complexity?: 'simple' | 'intermediate' | 'advanced';
  includeComments?: boolean;
  includeTests?: boolean;
}

export interface CodeReviewRequest {
  code: string;
  language: string;
  checkSecurity?: boolean;
  checkPerformance?: boolean;
  checkBestPractices?: boolean;
}

export class CodeBisonAgent extends BaseGoogleADKAgent {
  private apiEndpoint: string;
  private supportedLanguages: string[];
  private maxCodeLength: number;

  constructor(config: AgentConfig) {
    super(config);
    this.apiEndpoint = '/api/code-bison';
    this.supportedLanguages = [
      'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
      'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala',
      'html', 'css', 'sql', 'bash', 'powershell', 'yaml', 'json'
    ];
    this.maxCodeLength = 10000; // 10k characters
  }

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Code Bison Agent...');
      this.config.status = 'ready';
      
      // Test connection to Code Bison API
      const testResponse = await this.testConnection();
      if (testResponse.status !== 'success') {
        throw new Error('Failed to connect to Code Bison API');
      }

      console.log('✅ Code Bison Agent initialized successfully');
      
    } catch (error) {
      console.error('Code Bison initialization failed:', error);
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
        case 'generate':
          result = await this.generateCode(message);
          responseText = this.formatCodeGenerationResult(result);
          toolsUsed = ['code_generation'];
          break;
        case 'analyze':
          result = await this.analyzeCode(message);
          responseText = this.formatCodeAnalysisResult(result);
          toolsUsed = ['code_analysis'];
          break;
        case 'review':
          result = await this.reviewCode(message);
          responseText = this.formatCodeReviewResult(result);
          toolsUsed = ['code_review'];
          break;
        case 'explain':
          result = await this.explainCode(message);
          responseText = result.explanation;
          toolsUsed = ['code_explanation'];
          break;
        default:
          result = await this.handleGeneralQuery(message);
          responseText = result.response;
          toolsUsed = ['general_assistance'];
      }

      this.config.status = 'ready';
      
      // Update metrics and history
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, true);
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'input',
        content: message,
        response_time: responseTime,
        metadata: { requestType, toolsUsed }
      });
      
      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: 'output',
        content: responseText,
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

  private determineRequestType(message: string): 'generate' | 'analyze' | 'review' | 'explain' | 'general' {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('napisz kod') || lowerMessage.includes('wygeneruj') || 
        lowerMessage.includes('stwórz funkcję') || lowerMessage.includes('implement')) {
      return 'generate';
    }
    
    if (lowerMessage.includes('przeanalizuj') || lowerMessage.includes('analyze') ||
        lowerMessage.includes('sprawdź kod') || lowerMessage.includes('co robi ten kod')) {
      return 'analyze';
    }
    
    if (lowerMessage.includes('przeglądnij') || lowerMessage.includes('review') ||
        lowerMessage.includes('zoptymalizuj') || lowerMessage.includes('poprawa kodu')) {
      return 'review';
    }
    
    if (lowerMessage.includes('wyjaśnij') || lowerMessage.includes('explain') ||
        lowerMessage.includes('jak działa') || lowerMessage.includes('opisz kod')) {
      return 'explain';
    }
    
    return 'general';
  }

  private async generateCode(prompt: string): Promise<any> {
    try {
      // Extract language from prompt
      const language = this.extractLanguageFromPrompt(prompt);
      
      const requestBody: CodeGenerationRequest = {
        prompt: prompt,
        language: language,
        style: 'functional',
        complexity: 'intermediate',
        includeComments: true,
        includeTests: false
      };

      const response = await fetch(`${this.apiEndpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Code generation API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        code: data.code || 'Nie udało się wygenerować kodu',
        language: language,
        explanation: data.explanation || '',
        suggestions: data.suggestions || []
      };

    } catch (error) {
      throw new Error(`Błąd generowania kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async analyzeCode(message: string): Promise<CodeAnalysisResult> {
    try {
      // Extract code from message
      const codeBlock = this.extractCodeFromMessage(message);
      if (!codeBlock) {
        throw new Error('Nie znaleziono kodu do analizy w wiadomości');
      }

      const requestBody = {
        code: codeBlock.code,
        language: codeBlock.language
      };

      const response = await fetch(`${this.apiEndpoint}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Code analysis API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        language: codeBlock.language,
        lines_count: codeBlock.code.split('\n').length,
        complexity: data.complexity || 'średnia',
        explanation: data.explanation || 'Analiza niedostępna',
        contains_functions: data.contains_functions || false,
        contains_classes: data.contains_classes || false,
        has_imports: data.has_imports || false,
        security_issues: data.security_issues || []
      };

    } catch (error) {
      throw new Error(`Błąd analizy kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async reviewCode(message: string): Promise<any> {
    try {
      const codeBlock = this.extractCodeFromMessage(message);
      if (!codeBlock) {
        throw new Error('Nie znaleziono kodu do przeglądu w wiadomości');
      }

      const requestBody: CodeReviewRequest = {
        code: codeBlock.code,
        language: codeBlock.language,
        checkSecurity: true,
        checkPerformance: true,
        checkBestPractices: true
      };

      const response = await fetch(`${this.apiEndpoint}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Code review API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        overall_rating: data.rating || 'średnia',
        issues: data.issues || [],
        suggestions: data.suggestions || [],
        security_score: data.security_score || 75,
        performance_score: data.performance_score || 75,
        maintainability_score: data.maintainability_score || 75
      };

    } catch (error) {
      throw new Error(`Błąd przeglądu kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async explainCode(message: string): Promise<any> {
    try {
      const codeBlock = this.extractCodeFromMessage(message);
      if (!codeBlock) {
        throw new Error('Nie znaleziono kodu do wyjaśnienia w wiadomości');
      }

      const requestBody = {
        code: codeBlock.code,
        language: codeBlock.language,
        detail_level: 'medium'
      };

      const response = await fetch(`${this.apiEndpoint}/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Code explanation API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        explanation: data.explanation || 'Nie udało się wyjaśnić kodu',
        step_by_step: data.steps || [],
        key_concepts: data.concepts || []
      };

    } catch (error) {
      throw new Error(`Błąd wyjaśniania kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private async handleGeneralQuery(message: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiEndpoint}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`General query API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response || 'Nie mogę odpowiedzieć na to pytanie'
      };

    } catch (error) {
      throw new Error(`Błąd przetwarzania zapytania: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  }

  private extractLanguageFromPrompt(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const lang of this.supportedLanguages) {
      if (lowerPrompt.includes(lang)) {
        return lang;
      }
    }
    
    // Default fallbacks
    if (lowerPrompt.includes('js') || lowerPrompt.includes('node')) return 'javascript';
    if (lowerPrompt.includes('ts')) return 'typescript';
    if (lowerPrompt.includes('py')) return 'python';
    if (lowerPrompt.includes('c++') || lowerPrompt.includes('cpp')) return 'cpp';
    if (lowerPrompt.includes('c#')) return 'csharp';
    
    return 'javascript'; // Default
  }

  private extractCodeFromMessage(message: string): { code: string; language: string } | null {
    // Look for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/;
    const match = message.match(codeBlockRegex);
    
    if (match) {
      const [, language, code] = match;
      return {
        code: code.trim(),
        language: language || 'javascript'
      };
    }
    
    // Look for inline code
    const inlineCodeRegex = /`([^`]+)`/;
    const inlineMatch = message.match(inlineCodeRegex);
    
    if (inlineMatch) {
      return {
        code: inlineMatch[1],
        language: 'javascript'
      };
    }
    
    return null;
  }

  private formatCodeGenerationResult(result: any): string {
    let output = '💻 **Wygenerowany kod:**\n\n';
    output += `\`\`\`${result.language}\n${result.code}\n\`\`\`\n\n`;
    
    if (result.explanation) {
      output += `📝 **Wyjaśnienie:**\n${result.explanation}\n\n`;
    }
    
    if (result.suggestions && result.suggestions.length > 0) {
      output += '💡 **Sugestie:**\n';
      result.suggestions.forEach((suggestion: string) => {
        output += `• ${suggestion}\n`;
      });
    }
    
    return output;
  }

  private formatCodeAnalysisResult(result: CodeAnalysisResult): string {
    let output = '🔍 **Analiza kodu:**\n\n';
    output += `📊 **Język:** ${result.language}\n`;
    output += `📏 **Liczba linii:** ${result.lines_count}\n`;
    output += `⚡ **Złożoność:** ${result.complexity}\n\n`;
    
    output += `📝 **Opis:** ${result.explanation}\n\n`;
    
    const features = [];
    if (result.contains_functions) features.push('Funkcje');
    if (result.contains_classes) features.push('Klasy');
    if (result.has_imports) features.push('Importy');
    
    if (features.length > 0) {
      output += `🔧 **Zawiera:** ${features.join(', ')}\n\n`;
    }
    
    if (result.security_issues && result.security_issues.length > 0) {
      output += '⚠️ **Problemy bezpieczeństwa:**\n';
      result.security_issues.forEach(issue => {
        output += `• ${issue}\n`;
      });
    }
    
    return output;
  }

  private formatCodeReviewResult(result: any): string {
    let output = '👨‍💻 **Przegląd kodu:**\n\n';
    output += `⭐ **Ocena ogólna:** ${result.overall_rating}\n\n`;
    
    output += '📊 **Wyniki:**\n';
    output += `🔒 Bezpieczeństwo: ${result.security_score}/100\n`;
    output += `⚡ Wydajność: ${result.performance_score}/100\n`;
    output += `🔧 Czytelność: ${result.maintainability_score}/100\n\n`;
    
    if (result.issues && result.issues.length > 0) {
      output += '⚠️ **Problemy:**\n';
      result.issues.forEach((issue: string) => {
        output += `• ${issue}\n`;
      });
      output += '\n';
    }
    
    if (result.suggestions && result.suggestions.length > 0) {
      output += '💡 **Sugestie ulepszeń:**\n';
      result.suggestions.forEach((suggestion: string) => {
        output += `• ${suggestion}\n`;
      });
    }
    
    return output;
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
        data: response.ok ? { connected: true, supportedLanguages: this.supportedLanguages } : null,
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

  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down Code Bison Agent...');
    this.config.status = 'offline';
    console.log('✅ Code Bison Agent shutdown complete');
  }
}

// Export default instance creator
export function createCodeBisonAgent(config?: Partial<AgentConfig>): CodeBisonAgent {
  const defaultConfig: AgentConfig = {
    agent_id: 'code-bison',
    name: 'Code Bison Agent',
    model: 'code-bison',
    status: 'offline',
    category: 'specialized',
    icon: '👨‍💻',
    color: '#ff6d00',
    priority: 'HIGH',
    description: 'AI programming assistant for code generation, analysis, and review'
  };

  return new CodeBisonAgent({ ...defaultConfig, ...config });
}