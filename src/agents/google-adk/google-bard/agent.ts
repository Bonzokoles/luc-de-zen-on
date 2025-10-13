// Google ADK Bard Agent
// AI agent for Google Bard integration and creative text generation

import type { AgentConfig, AgentResponse } from "../types";
import { BaseGoogleADKAgent } from "../types";

export interface BardRequest {
  prompt: string;
  context?: string;
  conversation_id?: string;
  temperature: number;
  max_tokens: number;
}

export interface BardResponse {
  response: string;
  conversation_id: string;
  choices?: string[];
  confidence: number;
  sources?: string[];
}

export interface CreativeTask {
  type: "story" | "poem" | "essay" | "script" | "song" | "article" | "blog";
  theme: string;
  style: string;
  length: "short" | "medium" | "long";
  tone: "formal" | "casual" | "creative" | "professional" | "humorous";
}

export class GoogleBardAgent extends BaseGoogleADKAgent {
  private bardEndpoint: string;
  private conversationHistory: Map<string, Record<string, unknown>[]>;
  private activeConversations: Set<string>;
  private maxConversationLength: number;

  constructor(config: AgentConfig) {
    super(config);
    this.bardEndpoint = "/api/google-bard";
    this.conversationHistory = new Map();
    this.activeConversations = new Set();
    this.maxConversationLength = 50; // Max messages per conversation
  }

  async initialize(): Promise<void> {
    try {
      console.log("🚀 Initializing Google Bard Agent...");
      this.config.status = "ready";

      // Test connection to Bard API
      const testResponse = await this.testConnection();
      if (testResponse.status !== "success") {
        throw new Error("Failed to connect to Google Bard API");
      }

      console.log("✅ Google Bard Agent initialized successfully");
    } catch (error) {
      console.error("Google Bard initialization failed:", error);
      this.config.status = "error";
      throw error;
    }
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const startTime = new Date();

    try {
      this.config.status = "busy";

      // Determine the type of request
      const requestType = this.determineRequestType(message);
      let result: any;
      let responseText: string;
      let toolsUsed: string[] = [];

      switch (requestType) {
        case "creative_writing":
          result = await this.generateCreativeContent(message);
          responseText = result.content;
          toolsUsed = ["bard_creative_writing"];
          break;
        case "conversation":
          result = await this.continueConversation(message);
          responseText = result.response;
          toolsUsed = ["bard_conversation"];
          break;
        case "research":
          result = await this.performResearch(message);
          responseText = this.formatResearchResult(result);
          toolsUsed = ["bard_research"];
          break;
        case "brainstorm":
          result = await this.brainstormIdeas(message);
          responseText = this.formatBrainstormResult(result);
          toolsUsed = ["bard_brainstorming"];
          break;
        case "explain":
          result = await this.explainConcept(message);
          responseText = result.explanation;
          toolsUsed = ["bard_explanation"];
          break;
        case "compare":
          result = await this.compareOptions(message);
          responseText = this.formatComparisonResult(result);
          toolsUsed = ["bard_comparison"];
          break;
        case "plan":
          result = await this.createPlan(message);
          responseText = this.formatPlanResult(result);
          toolsUsed = ["bard_planning"];
          break;
        default:
          result = await this.handleGeneralQuery(message);
          responseText = result.response;
          toolsUsed = ["bard_general"];
      }

      this.config.status = "ready";

      // Update metrics and history
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, true);

      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: "input",
        content: message.substring(0, 500), // Limit stored content
        response_time: responseTime,
        metadata: { requestType, toolsUsed },
      });

      this.addToHistory({
        timestamp: new Date().toISOString(),
        type: "output",
        content: responseText.substring(0, 500),
        response_time: responseTime,
      });

      return {
        status: "success",
        response: responseText,
        data: result,
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: responseTime,
          timestamp: new Date().toISOString(),
          tools_used: toolsUsed,
        },
      };
    } catch (error) {
      this.config.status = "error";
      const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
      this.updateMetrics(responseTime, false);

      return {
        status: "error",
        error_message:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: responseTime,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  private determineRequestType(
    message: string
  ):
    | "creative_writing"
    | "conversation"
    | "research"
    | "brainstorm"
    | "explain"
    | "compare"
    | "plan"
    | "general" {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("napisz") ||
      lowerMessage.includes("stwórz") ||
      lowerMessage.includes("opowiadanie") ||
      lowerMessage.includes("wiersz") ||
      lowerMessage.includes("write") ||
      lowerMessage.includes("create story") ||
      lowerMessage.includes("poem") ||
      lowerMessage.includes("essay")
    ) {
      return "creative_writing";
    }

    if (
      lowerMessage.includes("rozmowa") ||
      lowerMessage.includes("kontynuuj") ||
      lowerMessage.includes("conversation") ||
      lowerMessage.includes("chat")
    ) {
      return "conversation";
    }

    if (
      lowerMessage.includes("zbadaj") ||
      lowerMessage.includes("research") ||
      lowerMessage.includes("znajdź informacje") ||
      lowerMessage.includes("investigate")
    ) {
      return "research";
    }

    if (
      lowerMessage.includes("burza mózgów") ||
      lowerMessage.includes("brainstorm") ||
      lowerMessage.includes("pomysły") ||
      lowerMessage.includes("ideas")
    ) {
      return "brainstorm";
    }

    if (
      lowerMessage.includes("wyjaśnij") ||
      lowerMessage.includes("explain") ||
      lowerMessage.includes("co to znaczy") ||
      lowerMessage.includes("what does")
    ) {
      return "explain";
    }

    if (
      lowerMessage.includes("porównaj") ||
      lowerMessage.includes("compare") ||
      lowerMessage.includes("różnice") ||
      lowerMessage.includes("vs") ||
      lowerMessage.includes("differences")
    ) {
      return "compare";
    }

    if (
      lowerMessage.includes("plan") ||
      lowerMessage.includes("zaplanuj") ||
      lowerMessage.includes("strategia") ||
      lowerMessage.includes("schedule")
    ) {
      return "plan";
    }

    return "general";
  }

  private async generateCreativeContent(message: string): Promise<any> {
    try {
      const creativeTask = this.parseCreativeTask(message);

      const requestBody: BardRequest = {
        prompt: `${message}\n\nTask details: ${JSON.stringify(creativeTask)}`,
        temperature: 0.9, // High creativity
        max_tokens: 3000,
      };

      const response = await fetch(`${this.bardEndpoint}/creative`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard creative API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        content: data.response || "Nie udało się stworzyć treści kreatywnej",
        type: creativeTask.type,
        style: creativeTask.style,
        wordCount: data.response ? data.response.split(" ").length : 0,
        alternatives: data.choices || [],
      };
    } catch (error) {
      throw new Error(
        `Błąd tworzenia treści kreatywnej: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async continueConversation(message: string): Promise<BardResponse> {
    try {
      const conversationId = this.getOrCreateConversationId();
      const history = this.conversationHistory.get(conversationId) || [];

      const requestBody: BardRequest = {
        prompt: message,
        context: this.buildConversationContext(history),
        conversation_id: conversationId,
        temperature: 0.7,
        max_tokens: 2000,
      };

      const response = await fetch(`${this.bardEndpoint}/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard conversation API error: ${response.status}`);
      }

      const data = (await response.json()) as any;

      // Update conversation history
      history.push(
        { role: "user", content: message, timestamp: new Date().toISOString() },
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        }
      );

      // Limit conversation length
      if (history.length > this.maxConversationLength) {
        history.splice(0, 2); // Remove oldest pair
      }

      this.conversationHistory.set(conversationId, history);

      return {
        response: data.response || "Nie mogę kontynuować rozmowy",
        conversation_id: conversationId,
        choices: data.choices || [],
        confidence: data.confidence || 0.8,
        sources: data.sources || [],
      };
    } catch (error) {
      throw new Error(
        `Błąd rozmowy z Bard: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async performResearch(message: string): Promise<any> {
    try {
      const researchQuery = this.extractResearchQuery(message);

      const requestBody = {
        query: researchQuery,
        include_sources: true,
        max_results: 10,
      };

      const response = await fetch(`${this.bardEndpoint}/research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard research API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        findings: data.findings || "Nie znaleziono informacji",
        sources: data.sources || [],
        summary: data.summary || "",
        related_topics: data.related_topics || [],
        confidence: data.confidence || 0.7,
      };
    } catch (error) {
      throw new Error(
        `Błąd badania: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async brainstormIdeas(message: string): Promise<any> {
    try {
      const topic = this.extractBrainstormTopic(message);

      const requestBody = {
        topic: topic,
        idea_count: 10,
        creativity_level: "high",
        categories: ["practical", "innovative", "creative", "technical"],
      };

      const response = await fetch(`${this.bardEndpoint}/brainstorm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard brainstorm API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        ideas: data.ideas || [],
        categorized_ideas: data.categorized_ideas || {},
        topic: topic,
        total_ideas: data.ideas ? data.ideas.length : 0,
      };
    } catch (error) {
      throw new Error(
        `Błąd burzy mózgów: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async explainConcept(message: string): Promise<any> {
    try {
      const concept = this.extractConceptToExplain(message);

      const requestBody = {
        concept: concept,
        explanation_level: "detailed",
        include_examples: true,
        target_audience: "general",
      };

      const response = await fetch(`${this.bardEndpoint}/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard explanation API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        explanation: data.explanation || "Nie mogę wyjaśnić tego pojęcia",
        examples: data.examples || [],
        related_concepts: data.related_concepts || [],
        difficulty_level: data.difficulty_level || "medium",
      };
    } catch (error) {
      throw new Error(
        `Błąd wyjaśniania: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async compareOptions(message: string): Promise<any> {
    try {
      const options = this.extractOptionsToCompare(message);

      const requestBody = {
        options: options,
        criteria: ["advantages", "disadvantages", "cost", "time", "complexity"],
        comparison_type: "comprehensive",
      };

      const response = await fetch(`${this.bardEndpoint}/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard comparison API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        comparison_table: data.comparison_table || {},
        recommendation: data.recommendation || "",
        summary: data.summary || "",
        options: options,
      };
    } catch (error) {
      throw new Error(
        `Błąd porównania: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async createPlan(message: string): Promise<any> {
    try {
      const planRequest = this.extractPlanRequest(message);

      const requestBody = {
        goal: planRequest.goal,
        timeframe: planRequest.timeframe,
        complexity: planRequest.complexity,
        include_milestones: true,
        include_resources: true,
      };

      const response = await fetch(`${this.bardEndpoint}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard planning API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        plan: data.plan || {},
        milestones: data.milestones || [],
        resources: data.resources || [],
        timeline: data.timeline || "",
        estimated_duration: data.estimated_duration || "",
      };
    } catch (error) {
      throw new Error(
        `Błąd planowania: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async handleGeneralQuery(message: string): Promise<any> {
    try {
      const requestBody: BardRequest = {
        prompt: message,
        temperature: 0.7,
        max_tokens: 2000,
      };

      const response = await fetch(`${this.bardEndpoint}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Bard general API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        response: data.response || "Nie mogę odpowiedzieć na to pytanie",
        confidence: data.confidence || 0.7,
      };
    } catch (error) {
      throw new Error(
        `Błąd zapytania Bard: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private parseCreativeTask(message: string): CreativeTask {
    const lowerMessage = message.toLowerCase();

    let type: CreativeTask["type"] = "article";
    if (lowerMessage.includes("opowiadanie") || lowerMessage.includes("story"))
      type = "story";
    if (lowerMessage.includes("wiersz") || lowerMessage.includes("poem"))
      type = "poem";
    if (lowerMessage.includes("esej") || lowerMessage.includes("essay"))
      type = "essay";
    if (lowerMessage.includes("scenariusz") || lowerMessage.includes("script"))
      type = "script";
    if (lowerMessage.includes("piosenka") || lowerMessage.includes("song"))
      type = "song";
    if (lowerMessage.includes("blog")) type = "blog";

    const theme = this.extractTheme(message);
    const style = this.extractStyle(message);
    const length = this.extractLength(message);
    const tone = this.extractTone(message);

    return { type, theme, style, length, tone };
  }

  private extractTheme(message: string): string {
    // Extract theme/topic from message
    return message.replace(/^(napisz|stwórz|write|create)\s+/i, "").trim();
  }

  private extractStyle(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("klasyczny")) return "klasyczny";
    if (lowerMessage.includes("nowoczesny")) return "nowoczesny";
    if (lowerMessage.includes("romantyczny")) return "romantyczny";
    if (lowerMessage.includes("humorystyczny")) return "humorystyczny";
    if (lowerMessage.includes("dramatyczny")) return "dramatyczny";

    return "uniwersalny";
  }

  private extractLength(message: string): CreativeTask["length"] {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("krótki") || lowerMessage.includes("short"))
      return "short";
    if (lowerMessage.includes("długi") || lowerMessage.includes("long"))
      return "long";

    return "medium";
  }

  private extractTone(message: string): CreativeTask["tone"] {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("formal")) return "formal";
    if (lowerMessage.includes("profesjonalny")) return "professional";
    if (
      lowerMessage.includes("humorystyczny") ||
      lowerMessage.includes("funny")
    )
      return "humorous";
    if (lowerMessage.includes("kreatywny")) return "creative";

    return "casual";
  }

  private getOrCreateConversationId(): string {
    const existingIds = Array.from(this.activeConversations);
    if (existingIds.length > 0) {
      return existingIds[0]; // Use most recent conversation
    }

    const newId = `conv_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    this.activeConversations.add(newId);
    return newId;
  }

  private buildConversationContext(history: Record<string, unknown>[]): string {
    return history
      .slice(-10) // Last 10 messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
  }

  private extractResearchQuery(message: string): string {
    return message
      .replace(/^(zbadaj|research|znajdź informacje o)\s*/i, "")
      .trim();
  }

  private extractBrainstormTopic(message: string): string {
    return message
      .replace(/^(burza mózgów|brainstorm|pomysły na)\s*/i, "")
      .trim();
  }

  private extractConceptToExplain(message: string): string {
    return message.replace(/^(wyjaśnij|explain|co to znaczy)\s*/i, "").trim();
  }

  private extractOptionsToCompare(message: string): string[] {
    const text = message.replace(/^(porównaj|compare)\s*/i, "").trim();

    // Split by common separators
    return text
      .split(/\s+(?:vs|versus|z|and|i)\s+/i)
      .map((option) => option.trim())
      .filter((option) => option.length > 0);
  }

  private extractPlanRequest(message: string): {
    goal: string;
    timeframe: string;
    complexity: string;
  } {
    const goal = message.replace(/^(plan|zaplanuj|strategia)\s*/i, "").trim();

    return {
      goal,
      timeframe: this.extractTimeframe(message),
      complexity: this.extractComplexity(message),
    };
  }

  private extractTimeframe(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("dzień") || lowerMessage.includes("day"))
      return "daily";
    if (lowerMessage.includes("tydzień") || lowerMessage.includes("week"))
      return "weekly";
    if (lowerMessage.includes("miesiąc") || lowerMessage.includes("month"))
      return "monthly";
    if (lowerMessage.includes("rok") || lowerMessage.includes("year"))
      return "yearly";

    return "medium-term";
  }

  private extractComplexity(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("prosty") || lowerMessage.includes("simple"))
      return "simple";
    if (
      lowerMessage.includes("skomplikowany") ||
      lowerMessage.includes("complex")
    )
      return "complex";

    return "medium";
  }

  private formatResearchResult(result: any): string {
    let output = "🔍 **Wyniki badania:**\n\n";
    output += `📄 **Podsumowanie:** ${result.summary}\n\n`;
    output += `📊 **Główne ustalenia:**\n${result.findings}\n\n`;

    if (result.sources.length > 0) {
      output += "📚 **Źródła:**\n";
      result.sources.slice(0, 5).forEach((source: string, idx: number) => {
        output += `${idx + 1}. ${source}\n`;
      });
    }

    if (result.related_topics.length > 0) {
      output += `\n🔗 **Powiązane tematy:** ${result.related_topics.join(
        ", "
      )}`;
    }

    return output;
  }

  private formatBrainstormResult(result: any): string {
    let output = "💡 **Burza mózgów:**\n\n";
    output += `🎯 **Temat:** ${result.topic}\n`;
    output += `📊 **Łączna liczba pomysłów:** ${result.total_ideas}\n\n`;

    if (result.ideas.length > 0) {
      output += "**Pomysły:**\n";
      result.ideas.slice(0, 8).forEach((idea: string, idx: number) => {
        output += `${idx + 1}. ${idea}\n`;
      });
    }

    return output;
  }

  private formatComparisonResult(result: any): string {
    let output = "⚖️ **Porównanie opcji:**\n\n";

    if (result.recommendation) {
      output += `🎯 **Rekomendacja:** ${result.recommendation}\n\n`;
    }

    if (result.summary) {
      output += `📝 **Podsumowanie:** ${result.summary}\n\n`;
    }

    if (
      result.comparison_table &&
      Object.keys(result.comparison_table).length > 0
    ) {
      output += "📊 **Tabela porównawcza:**\n";
      Object.entries(result.comparison_table).forEach(([key, value]) => {
        output += `• **${key}:** ${value}\n`;
      });
    }

    return output;
  }

  private formatPlanResult(result: any): string {
    let output = "📋 **Plan działania:**\n\n";

    if (result.timeline) {
      output += `⏱️ **Harmonogram:** ${result.timeline}\n`;
    }

    if (result.estimated_duration) {
      output += `📅 **Szacowany czas:** ${result.estimated_duration}\n\n`;
    }

    if (result.milestones.length > 0) {
      output += "🎯 **Kamienie milowe:**\n";
      result.milestones.forEach((milestone: string, idx: number) => {
        output += `${idx + 1}. ${milestone}\n`;
      });
      output += "\n";
    }

    if (result.resources.length > 0) {
      output += "📦 **Potrzebne zasoby:**\n";
      result.resources.forEach((resource: string) => {
        output += `• ${resource}\n`;
      });
    }

    return output;
  }

  async testConnection(): Promise<AgentResponse> {
    try {
      const response = await fetch(`${this.bardEndpoint}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        status: response.ok ? "success" : "error",
        data: response.ok
          ? {
              connected: true,
              active_conversations: this.activeConversations.size,
              features: [
                "creative_writing",
                "conversation",
                "research",
                "brainstorming",
              ],
            }
          : null,
        error_message: response.ok
          ? undefined
          : `Connection failed: ${response.status}`,
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: 0,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: "error",
        error_message:
          error instanceof Error ? error.message : "Connection test failed",
        metadata: {
          agent: this.config.agent_id,
          model: this.config.model,
          response_time: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  clearConversation(conversationId?: string): void {
    if (conversationId) {
      this.conversationHistory.delete(conversationId);
      this.activeConversations.delete(conversationId);
    } else {
      this.conversationHistory.clear();
      this.activeConversations.clear();
    }
  }

  async shutdown(): Promise<void> {
    console.log("🔄 Shutting down Google Bard Agent...");
    this.conversationHistory.clear();
    this.activeConversations.clear();
    this.config.status = "offline";
    console.log("✅ Google Bard Agent shutdown complete");
  }
}

// Export default instance creator
export function createGoogleBardAgent(
  config?: Partial<AgentConfig>
): GoogleBardAgent {
  const defaultConfig: AgentConfig = {
    agent_id: "google-bard",
    name: "Google Bard Agent",
    model: "bard",
    status: "offline",
    category: "core",
    icon: "🎨",
    color: "#ea4335",
    priority: "HIGH",
    description:
      "Google Bard AI for creative writing, conversation, and research",
  };

  return new GoogleBardAgent({ ...defaultConfig, ...config });
}
