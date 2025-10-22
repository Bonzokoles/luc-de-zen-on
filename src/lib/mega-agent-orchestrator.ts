// Mega Agent Orchestrator - Core Implementation
// Bielik 11B v2.6 jako główny koordynator systemu AI

export interface TaskAnalysis {
  taskType: 'coding' | 'creative' | 'analytical' | 'conversational' | 'automation' | 'safety';
  complexity: 'simple' | 'medium' | 'complex' | 'expert';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  language: 'pl' | 'en' | 'mixed';
  estimatedTokens: number;
  requiresSpecialist: boolean;
}

export interface AgentCapability {
  id: AgentType;
  name: string;
  strengths: string[];
  weaknesses: string[];
  maxTokens: number;
  avgResponseTime: number;
  costPerToken: number;
  availability: boolean;
}

export interface MegaAgentRequest {
  task: string;
  priority: 'speed' | 'quality' | 'balanced' | 'cost-effective';
  context?: string;
  requireSpecialist?: AgentType;
  maxAgents?: number;
  userId?: string;
  sessionId?: string;
}

export interface AgentResult {
  agentId: AgentType;
  response: string;
  confidence: number;
  executionTime: number;
  tokenUsage: number;
  error?: string;
}

export interface MegaAgentResponse {
  orchestratorDecision: {
    selectedAgents: AgentType[];
    reasoning: string;
    estimatedTime: number;
    estimatedCost: number;
    strategy: 'parallel' | 'sequential' | 'hybrid';
  };
  results: AgentResult[];
  finalAnswer: string;
  aggregationMethod: 'consensus' | 'best-quality' | 'fastest' | 'weighted';
  confidence: number;
  totalExecutionTime: number;
  totalCost: number;
}

export type AgentType = 
  | 'bielik-orchestrator'
  | 'gemma-3-12b'
  | 'llama-3.3-70b' 
  | 'claude-sonnet-4.5'
  | 'gpt-4'
  | 'deepseek-coder'
  | 'mistral-7b'
  | 'polaczek-agent'
  | 'bielik-guard';

export class MegaAgentOrchestrator {
  private agentCapabilities: Map<AgentType, AgentCapability> = new Map();
  private bielikModel: string = 'speakleash/Bielik-11B-v2.6-Instruct';
  
  constructor() {
    this.initializeAgentCapabilities();
  }

  /**
   * Main orchestration method - Bielik analyzes and coordinates
   */
  async processRequest(request: MegaAgentRequest): Promise<MegaAgentResponse> {
    try {
      console.log(`🧠 Bielik Orchestrator: Analyzing task - "${request.task.substring(0, 100)}..."`);
      
      // 1. Bielik analizuje zadanie
      const analysis = await this.analyzeTaskWithBielik(request.task, request.context);
      
      // 2. Bielik wybiera strategię i agentów
      const orchestrationPlan = await this.createOrchestrationPlan(analysis, request);
      
      // 3. Wykonanie zgodnie z planem
      const results = await this.executeOrchestrationPlan(orchestrationPlan, request);
      
      // 4. Bielik agreguje wyniki
      const finalAnswer = await this.aggregateResultsWithBielik(results, request.task);
      
      // 5. Zwróć kompleksową odpowiedź
      return {
        orchestratorDecision: {
          selectedAgents: orchestrationPlan.selectedAgents,
          reasoning: orchestrationPlan.reasoning,
          estimatedTime: orchestrationPlan.estimatedTime,
          estimatedCost: orchestrationPlan.estimatedCost,
          strategy: orchestrationPlan.strategy
        },
        results,
        finalAnswer,
        aggregationMethod: orchestrationPlan.aggregationMethod,
        confidence: this.calculateOverallConfidence(results),
        totalExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
        totalCost: results.reduce((sum, r) => sum + r.tokenUsage * this.getAgentCostPerToken(r.agentId), 0)
      };
      
    } catch (error: any) {
      console.error('❌ Orchestration failed:', error);
      throw new Error(`Orchestration failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Bielik analizuje zadanie i określa wymagania
   */
  private async analyzeTaskWithBielik(task: string, context?: string): Promise<TaskAnalysis> {
    const analysisPrompt = `
Jako Bielik, ekspert w analizie zadań AI, przeanalizuj następujące zadanie:

ZADANIE: "${task}"
${context ? `KONTEKST: "${context}"` : ''}

Określ:
1. Typ zadania (coding/creative/analytical/conversational/automation/safety)
2. Złożoność (simple/medium/complex/expert)  
3. Pilność (low/medium/high/critical)
4. Język (pl/en/mixed)
5. Szacowana liczba tokenów
6. Czy wymaga specjalisty?

Odpowiedz w formacie JSON.
`;

    const bielikResponse = await this.callBielikAPI(analysisPrompt);
    
    // Parse response lub fallback do heurystyk
    try {
      return JSON.parse(bielikResponse);
    } catch {
      return this.heuristicTaskAnalysis(task);
    }
  }

  /**
   * Bielik tworzy plan orkiestracji
   */
  private async createOrchestrationPlan(analysis: TaskAnalysis, request: MegaAgentRequest) {
    const planningPrompt = `
Jako Bielik Orchestrator, stwórz plan wykonania dla zadania:

ANALIZA ZADANIA:
- Typ: ${analysis.taskType}
- Złożoność: ${analysis.complexity}
- Pilność: ${analysis.urgency}
- Priorytet użytkownika: ${request.priority}

DOSTĘPNI AGENCI:
${Array.from(this.agentCapabilities.entries()).map(([id, cap]) => 
  `- ${id}: ${cap.strengths.join(', ')} (${cap.avgResponseTime}ms)`
).join('\n')}

Wybierz:
1. Lista agentów (max ${request.maxAgents || 3})
2. Strategia wykonania (parallel/sequential/hybrid)
3. Uzasadnienie wyboru
4. Metoda agregacji wyników

Odpowiedz w formacie JSON.
`;

    const planResponse = await this.callBielikAPI(planningPrompt);
    
    try {
      const plan = JSON.parse(planResponse);
      return {
        selectedAgents: plan.agents || this.fallbackAgentSelection(analysis),
        strategy: plan.strategy || 'parallel',
        reasoning: plan.reasoning || 'Automatyczny wybór na podstawie analizy',
        aggregationMethod: plan.aggregationMethod || 'best-quality',
        estimatedTime: this.estimateExecutionTime(plan.agents, analysis),
        estimatedCost: this.estimateCost(plan.agents, analysis)
      };
    } catch {
      return this.fallbackOrchestrationPlan(analysis, request);
    }
  }

  /**
   * Wykonuje plan - koordynuje sub-agentów
   */
  private async executeOrchestrationPlan(plan: any, request: MegaAgentRequest): Promise<AgentResult[]> {
    const { selectedAgents, strategy } = plan;
    
    console.log(`🎯 Executing with strategy: ${strategy}, agents: ${selectedAgents.join(', ')}`);
    
    if (strategy === 'parallel') {
      return await this.executeParallel(selectedAgents, request);
    } else if (strategy === 'sequential') {
      return await this.executeSequential(selectedAgents, request);
    } else {
      return await this.executeHybrid(selectedAgents, request);
    }
  }

  /**
   * Równoległe wykonanie agentów
   */
  private async executeParallel(agents: AgentType[], request: MegaAgentRequest): Promise<AgentResult[]> {
    const promises = agents.map(agentId => this.callAgent(agentId, request));
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          agentId: agents[index],
          response: '',
          confidence: 0,
          executionTime: 0,
          tokenUsage: 0,
          error: result.reason.message
        };
      }
    });
  }

  /**
   * Sekwencyjne wykonanie agentów
   */
  private async executeSequential(agents: AgentType[], request: MegaAgentRequest): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    let enhancedRequest = { ...request };
    
    for (const agentId of agents) {
      const result = await this.callAgent(agentId, enhancedRequest);
      results.push(result);
      
      // Dodaj poprzednie wyniki do kontekstu dla następnego agenta
      enhancedRequest.context = `${enhancedRequest.context || ''}\n\nPRZEDNI WYNIK (${agentId}):\n${result.response}`;
    }
    
    return results;
  }

  /**
   * Hybrydowe wykonanie - najlepszy agent + weryfikator
   */
  private async executeHybrid(agents: AgentType[], request: MegaAgentRequest): Promise<AgentResult[]> {
    // Pierwszy agent (najlepszy do zadania)
    const primaryAgent = agents[0];
    const primaryResult = await this.callAgent(primaryAgent, request);
    
    // Weryfikacja przez drugiego agenta jeśli confidence < 0.8
    if (primaryResult.confidence < 0.8 && agents.length > 1) {
      const verificationRequest = {
        ...request,
        task: `Zweryfikuj i popraw tę odpowiedź:\n\nORYGINAL: ${request.task}\n\nODPOWIEDŹ: ${primaryResult.response}`,
      };
      
      const verificationResult = await this.callAgent(agents[1], verificationRequest);
      return [primaryResult, verificationResult];
    }
    
    return [primaryResult];
  }

  /**
   * Wywołanie konkretnego agenta
   */
  private async callAgent(agentId: AgentType, request: MegaAgentRequest): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      let response: string;
      
      switch (agentId) {
        case 'gemma-3-12b':
          response = await this.callGemmaAPI(request.task);
          break;
        case 'llama-3.3-70b':
          response = await this.callLlamaAPI(request.task);
          break;
        case 'claude-sonnet-4.5':
          response = await this.callClaudeAPI(request.task);
          break;
        case 'gpt-4':
          response = await this.callGPT4API(request.task);
          break;
        case 'deepseek-coder':
          response = await this.callDeepSeekAPI(request.task);
          break;
        case 'mistral-7b':
          response = await this.callMistralAPI(request.task);
          break;
        case 'polaczek-agent':
          response = await this.callPolaczekAPI(request.task);
          break;
        case 'bielik-guard':
          response = await this.callBielikGuardAPI(request.task);
          break;
        default:
          throw new Error(`Unknown agent: ${agentId}`);
      }
      
      const executionTime = Date.now() - startTime;
      
      return {
        agentId,
        response,
        confidence: this.calculateConfidence(response, agentId),
        executionTime,
        tokenUsage: this.estimateTokenUsage(response),
        error: undefined
      };
      
    } catch (error: any) {
      return {
        agentId,
        response: '',
        confidence: 0,
        executionTime: Date.now() - startTime,
        tokenUsage: 0,
        error: error?.message || 'Unknown error'
      };
    }
  }

  /**
   * Bielik agreguje wyniki wszystkich agentów
   */
  private async aggregateResultsWithBielik(results: AgentResult[], originalTask: string): Promise<string> {
    const validResults = results.filter(r => !r.error && r.response.trim());
    
    if (validResults.length === 0) {
      return 'Przepraszam, nie udało się uzyskać odpowiedzi od żadnego z agentów.';
    }
    
    if (validResults.length === 1) {
      return validResults[0].response;
    }
    
    // Bielik agreguje multiple responses
    const aggregationPrompt = `
Jako Bielik, ekspert w agregacji odpowiedzi AI, połącz te odpowiedzi w jedną najlepszą:

ORYGINALNE ZADANIE: "${originalTask}"

ODPOWIEDZI AGENTÓW:
${validResults.map((result, i) => 
  `AGENT ${i+1} (${result.agentId}, confidence: ${result.confidence}):\n${result.response}\n\n---\n`
).join('')}

Stwórz najlepszą, spójną odpowiedź łączącą mocne strony każdej z nich.
`;

    try {
      return await this.callBielikAPI(aggregationPrompt);
    } catch {
      // Fallback - wybierz odpowiedź z najwyższą confidence
      const bestResult = validResults.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );
      return bestResult.response;
    }
  }

  /**
   * Wywołanie Bielik API
   */
  private async callBielikAPI(prompt: string): Promise<string> {
    const response = await fetch('https://api-inference.huggingface.co/models/speakleash/Bielik-11B-v2.6-Instruct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Bielik API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data[0]?.generated_text || '';
  }

  // Implementacje API calls dla sub-agentów
  private async callGemmaAPI(task: string): Promise<string> {
    // Integracja z istniejącym API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: task, model: 'gemma-3-12b' })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callLlamaAPI(task: string): Promise<string> {
    // Cloudflare Workers AI - Llama
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: task, model: 'llama-3.3-70b' })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callClaudeAPI(task: string): Promise<string> {
    // OpenRouter - Claude
    const response = await fetch('/api/chat', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: task, model: 'claude-sonnet-4.5' })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callGPT4API(task: string): Promise<string> {
    // OpenRouter - GPT-4
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: task, model: 'gpt-4' })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callDeepSeekAPI(task: string): Promise<string> {
    // DeepSeek Coder API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: task, model: 'deepseek-coder' })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callMistralAPI(task: string): Promise<string> {
    // Mistral API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: task, model: 'mistral-7b' })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callPolaczekAPI(task: string): Promise<string> {
    // POLACZEK Agent - browser automation
    const response = await fetch('/api/polaczek-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });
    const data: any = await response.json();
    return data.response;
  }

  private async callBielikGuardAPI(task: string): Promise<string> {
    // Bielik Guard - safety check
    const response = await fetch('https://api-inference.huggingface.co/models/speakleash/Bielik-Guard-0.1B-v1.0', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: task }),
    });
    const data: any = await response.json();
    return data[0]?.label || 'SAFE';
  }

  // Utility methods
  private initializeAgentCapabilities() {
    this.agentCapabilities = new Map([
      ['gemma-3-12b', {
        id: 'gemma-3-12b',
        name: 'Gemma 3 12B',
        strengths: ['fast response', 'general tasks', 'multilingual'],
        weaknesses: ['complex reasoning', 'code generation'],
        maxTokens: 8192,
        avgResponseTime: 1500,
        costPerToken: 0.00001,
        availability: true
      }],
      ['llama-3.3-70b', {
        id: 'llama-3.3-70b', 
        name: 'Llama 3.3 70B',
        strengths: ['advanced reasoning', 'complex analysis', 'large context'],
        weaknesses: ['slower response', 'higher cost'],
        maxTokens: 128000,
        avgResponseTime: 5000,
        costPerToken: 0.0001,
        availability: true
      }],
      ['claude-sonnet-4.5', {
        id: 'claude-sonnet-4.5',
        name: 'Claude Sonnet 4.5',
        strengths: ['creative writing', 'analysis', 'safety'],
        weaknesses: ['coding tasks', 'factual queries'],
        maxTokens: 200000,
        avgResponseTime: 3000,
        costPerToken: 0.0003,
        availability: true
      }],
      ['gpt-4', {
        id: 'gpt-4',
        name: 'GPT-4',
        strengths: ['highest quality', 'versatile', 'reliable'],
        weaknesses: ['highest cost', 'slower'],
        maxTokens: 128000,
        avgResponseTime: 4000,
        costPerToken: 0.0006,
        availability: true
      }],
      ['deepseek-coder', {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        strengths: ['code generation', 'debugging', 'technical'],
        weaknesses: ['non-technical tasks', 'creative writing'],
        maxTokens: 16384,
        avgResponseTime: 2000,
        costPerToken: 0.00002,
        availability: true
      }],
      ['mistral-7b', {
        id: 'mistral-7b',
        name: 'Mistral 7B',
        strengths: ['speed', 'efficiency', 'lightweight'],
        weaknesses: ['complex tasks', 'limited context'],
        maxTokens: 8192,
        avgResponseTime: 800,
        costPerToken: 0.000005,
        availability: true
      }],
      ['polaczek-agent', {
        id: 'polaczek-agent',
        name: 'POLACZEK Agent',
        strengths: ['browser automation', 'web scraping', 'tasks'],
        weaknesses: ['text generation', 'analysis'],
        maxTokens: 4096,
        avgResponseTime: 10000,
        costPerToken: 0.00001,
        availability: true
      }],
      ['bielik-guard', {
        id: 'bielik-guard',
        name: 'Bielik Guard',
        strengths: ['safety check', 'content moderation', 'Polish'],
        weaknesses: ['not generative', 'limited scope'],
        maxTokens: 512,
        avgResponseTime: 500,
        costPerToken: 0.000001,
        availability: true
      }]
    ]);
  }

  private heuristicTaskAnalysis(task: string): TaskAnalysis {
    // Fallback heuristics when Bielik analysis fails
    const lowerTask = task.toLowerCase();
    
    let taskType: TaskAnalysis['taskType'] = 'conversational';
    if (lowerTask.includes('kod') || lowerTask.includes('code') || lowerTask.includes('programuj')) {
      taskType = 'coding';
    } else if (lowerTask.includes('kreatyw') || lowerTask.includes('creative') || lowerTask.includes('pisz')) {
      taskType = 'creative'; 
    } else if (lowerTask.includes('analiza') || lowerTask.includes('analyze') || lowerTask.includes('przeanalizuj')) {
      taskType = 'analytical';
    } else if (lowerTask.includes('automatyza') || lowerTask.includes('scrap') || lowerTask.includes('bot')) {
      taskType = 'automation';
    }

    return {
      taskType,
      complexity: task.length > 500 ? 'complex' : task.length > 200 ? 'medium' : 'simple',
      urgency: 'medium',
      language: lowerTask.includes('polish') || /[ąćęłńóśźż]/.test(task) ? 'pl' : 'en',
      estimatedTokens: Math.max(100, Math.floor(task.length * 1.5)),
      requiresSpecialist: taskType === 'coding' || taskType === 'automation'
    };
  }

  private fallbackAgentSelection(analysis: TaskAnalysis): AgentType[] {
    switch (analysis.taskType) {
      case 'coding':
        return ['deepseek-coder', 'gpt-4'];
      case 'creative':
        return ['claude-sonnet-4.5', 'gpt-4'];
      case 'analytical':
        return ['llama-3.3-70b', 'gpt-4'];
      case 'automation':
        return ['polaczek-agent', 'deepseek-coder'];
      case 'safety':
        return ['bielik-guard', 'claude-sonnet-4.5'];
      default:
        return ['gemma-3-12b', 'llama-3.3-70b'];
    }
  }

  private fallbackOrchestrationPlan(analysis: TaskAnalysis, request: MegaAgentRequest) {
    const agents = this.fallbackAgentSelection(analysis);
    return {
      selectedAgents: agents.slice(0, request.maxAgents || 2),
      strategy: 'parallel' as const,
      reasoning: 'Fallback selection based on task type',
      aggregationMethod: 'best-quality' as const,
      estimatedTime: this.estimateExecutionTime(agents, analysis),
      estimatedCost: this.estimateCost(agents, analysis)
    };
  }

  private estimateExecutionTime(agents: AgentType[], analysis: TaskAnalysis): number {
    const avgTime = agents.reduce((sum, agentId) => {
      const capability = this.agentCapabilities.get(agentId);
      return sum + (capability?.avgResponseTime || 3000);
    }, 0) / agents.length;
    
    const complexityMultiplier = {
      'simple': 1,
      'medium': 1.5, 
      'complex': 2.5,
      'expert': 4
    };
    
    return avgTime * complexityMultiplier[analysis.complexity];
  }

  private estimateCost(agents: AgentType[], analysis: TaskAnalysis): number {
    return agents.reduce((sum, agentId) => {
      const capability = this.agentCapabilities.get(agentId);
      const costPerToken = capability?.costPerToken || 0.00001;
      return sum + (analysis.estimatedTokens * costPerToken);
    }, 0);
  }

  private calculateConfidence(response: string, agentId: AgentType): number {
    // Simple heuristic for confidence calculation
    let confidence = 0.7; // base confidence
    
    // Response length factor
    if (response.length > 200) confidence += 0.1;
    if (response.length < 50) confidence -= 0.2;
    
    // Agent-specific adjustments
    const capability = this.agentCapabilities.get(agentId);
    if (capability) {
      // Higher confidence for agents in their strength areas
      confidence += 0.1;
    }
    
    // Error indicators
    if (response.includes('nie wiem') || response.includes("I don't know")) {
      confidence -= 0.3;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  private calculateOverallConfidence(results: AgentResult[]): number {
    const validResults = results.filter(r => !r.error);
    if (validResults.length === 0) return 0;
    
    const avgConfidence = validResults.reduce((sum, r) => sum + r.confidence, 0) / validResults.length;
    
    // Bonus for consensus among multiple agents
    if (validResults.length > 1) {
      return Math.min(1, avgConfidence + 0.1);
    }
    
    return avgConfidence;
  }

  private estimateTokenUsage(response: string): number {
    // Rough estimation: 1 token ≈ 0.75 words
    return Math.floor(response.split(' ').length / 0.75);
  }

  private getAgentCostPerToken(agentId: AgentType): number {
    return this.agentCapabilities.get(agentId)?.costPerToken || 0.00001;
  }
}

// Export singleton instance
export const megaAgentOrchestrator = new MegaAgentOrchestrator();