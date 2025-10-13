// Google ADK Text Bison Agent
// AI agent for text generation, analysis, and language processing tasks

import type { AgentConfig, AgentResponse, TextAnalysisResult } from "../types";
import { BaseGoogleADKAgent } from "../types";

export interface TextGenerationRequest {
  prompt: string;
  maxLength: number;
  temperature: number;
  style: "formal" | "casual" | "creative" | "technical" | "academic";
  format: "paragraph" | "bullet_points" | "essay" | "summary" | "article";
}

export interface TextTranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  preserveFormatting: boolean;
}

export interface TextSummaryRequest {
  text: string;
  maxLength: number;
  style: "brief" | "detailed" | "key_points";
}

export class TextBisonAgent extends BaseGoogleADKAgent {
  private apiEndpoint: string;
  private supportedLanguages: string[];
  private maxTextLength: number;

  constructor(config: AgentConfig) {
    super(config);
    this.apiEndpoint = "/api/text-bison";
    this.supportedLanguages = [
      "pl",
      "en",
      "es",
      "fr",
      "de",
      "it",
      "pt",
      "ru",
      "ja",
      "ko",
      "zh",
      "ar",
      "hi",
      "tr",
      "nl",
      "sv",
      "da",
      "no",
      "fi",
      "cs",
      "sk",
      "hu",
      "ro",
      "bg",
      "hr",
      "sl",
      "et",
      "lv",
      "lt",
    ];
    this.maxTextLength = 15000; // 15k characters
  }

  async initialize(): Promise<void> {
    try {
      console.log("🚀 Initializing Text Bison Agent...");
      this.config.status = "ready";

      // Test connection to Text Bison API
      const testResponse = await this.testConnection();
      if (testResponse.status !== "success") {
        throw new Error("Failed to connect to Text Bison API");
      }

      console.log("✅ Text Bison Agent initialized successfully");
    } catch (error) {
      console.error("Text Bison initialization failed:", error);
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
        case "generate":
          result = await this.generateText(message);
          responseText = result.text;
          toolsUsed = ["text_generation"];
          break;
        case "analyze":
          result = await this.analyzeText(message);
          responseText = this.formatTextAnalysisResult(result);
          toolsUsed = ["text_analysis"];
          break;
        case "summarize":
          result = await this.summarizeText(message);
          responseText = result.summary;
          toolsUsed = ["text_summarization"];
          break;
        case "translate":
          result = await this.translateText(message);
          responseText = result.translatedText;
          toolsUsed = ["text_translation"];
          break;
        case "improve":
          result = await this.improveText(message);
          responseText = result.improvedText;
          toolsUsed = ["text_improvement"];
          break;
        case "rewrite":
          result = await this.rewriteText(message);
          responseText = result.rewrittenText;
          toolsUsed = ["text_rewriting"];
          break;
        default:
          result = await this.handleGeneralQuery(message);
          responseText = result.response;
          toolsUsed = ["general_text_assistance"];
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
    | "generate"
    | "analyze"
    | "summarize"
    | "translate"
    | "improve"
    | "rewrite"
    | "general" {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("napisz") ||
      lowerMessage.includes("wygeneruj tekst") ||
      lowerMessage.includes("stwórz artykuł") ||
      lowerMessage.includes("generate text")
    ) {
      return "generate";
    }

    if (
      lowerMessage.includes("przeanalizuj tekst") ||
      lowerMessage.includes("analiza tekstu") ||
      lowerMessage.includes("analyze text") ||
      lowerMessage.includes("sentiment")
    ) {
      return "analyze";
    }

    if (
      lowerMessage.includes("podsumuj") ||
      lowerMessage.includes("streszczenie") ||
      lowerMessage.includes("summarize") ||
      lowerMessage.includes("skróć tekst")
    ) {
      return "summarize";
    }

    if (
      lowerMessage.includes("przetłumacz") ||
      lowerMessage.includes("translate") ||
      lowerMessage.includes("tłumaczenie") ||
      lowerMessage.includes("na język")
    ) {
      return "translate";
    }

    if (
      lowerMessage.includes("popraw tekst") ||
      lowerMessage.includes("improve") ||
      lowerMessage.includes("korekta") ||
      lowerMessage.includes("gramatyka")
    ) {
      return "improve";
    }

    if (
      lowerMessage.includes("przepisz") ||
      lowerMessage.includes("rewrite") ||
      lowerMessage.includes("parafrazuj") ||
      lowerMessage.includes("rephrase")
    ) {
      return "rewrite";
    }

    return "general";
  }

  private async generateText(prompt: string): Promise<any> {
    try {
      // Extract parameters from prompt
      const style = this.extractStyleFromPrompt(prompt);
      const format = this.extractFormatFromPrompt(prompt);

      const requestBody: TextGenerationRequest = {
        prompt: prompt,
        maxLength: 2000,
        temperature: 0.7,
        style: style,
        format: format,
      };

      const response = await fetch(`${this.apiEndpoint}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Text generation API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        text: data.text || "Nie udało się wygenerować tekstu",
        wordCount: data.text ? data.text.split(" ").length : 0,
        style: style,
        format: format,
      };
    } catch (error) {
      throw new Error(
        `Błąd generowania tekstu: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async analyzeText(message: string): Promise<TextAnalysisResult> {
    try {
      const textToAnalyze = this.extractTextFromMessage(message);
      if (!textToAnalyze) {
        throw new Error("Nie znaleziono tekstu do analizy w wiadomości");
      }

      const requestBody = {
        text: textToAnalyze,
      };

      const response = await fetch(`${this.apiEndpoint}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Text analysis API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        word_count: textToAnalyze.split(" ").length,
        char_count: textToAnalyze.length,
        sentiment: data.sentiment || "neutralny",
        positive_indicators: data.positive_indicators || 0,
        negative_indicators: data.negative_indicators || 0,
        readability_score: data.readability_score || 50,
        keywords: data.keywords || [],
      };
    } catch (error) {
      throw new Error(
        `Błąd analizy tekstu: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async summarizeText(message: string): Promise<any> {
    try {
      const textToSummarize = this.extractTextFromMessage(message);
      if (!textToSummarize) {
        throw new Error("Nie znaleziono tekstu do podsumowania w wiadomości");
      }

      const requestBody: TextSummaryRequest = {
        text: textToSummarize,
        maxLength: Math.max(100, Math.floor(textToSummarize.length / 4)),
        style: "detailed",
      };

      const response = await fetch(`${this.apiEndpoint}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Text summarization API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        summary: data.summary || "Nie udało się podsumować tekstu",
        originalLength: textToSummarize.length,
        summaryLength: data.summary ? data.summary.length : 0,
        compressionRatio: data.summary
          ? ((data.summary.length / textToSummarize.length) * 100).toFixed(1)
          : 0,
      };
    } catch (error) {
      throw new Error(
        `Błąd podsumowania tekstu: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async translateText(message: string): Promise<any> {
    try {
      const textToTranslate = this.extractTextFromMessage(message);
      if (!textToTranslate) {
        throw new Error("Nie znaleziono tekstu do tłumaczenia w wiadomości");
      }

      // Extract target language from message
      const targetLanguage = this.extractTargetLanguage(message);

      const requestBody: TextTranslationRequest = {
        text: textToTranslate,
        fromLanguage: "auto",
        toLanguage: targetLanguage,
        preserveFormatting: true,
      };

      const response = await fetch(`${this.apiEndpoint}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        translatedText:
          data.translatedText || "Nie udało się przetłumaczyć tekstu",
        fromLanguage: data.detectedLanguage || "nieznany",
        toLanguage: targetLanguage,
        confidence: data.confidence || 0.9,
      };
    } catch (error) {
      throw new Error(
        `Błąd tłumaczenia tekstu: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async improveText(message: string): Promise<any> {
    try {
      const textToImprove = this.extractTextFromMessage(message);
      if (!textToImprove) {
        throw new Error("Nie znaleziono tekstu do poprawy w wiadomości");
      }

      const requestBody = {
        text: textToImprove,
        improvementType: "grammar_and_style",
      };

      const response = await fetch(`${this.apiEndpoint}/improve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Text improvement API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        improvedText: data.improvedText || textToImprove,
        corrections: data.corrections || [],
        suggestions: data.suggestions || [],
      };
    } catch (error) {
      throw new Error(
        `Błąd poprawy tekstu: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async rewriteText(message: string): Promise<any> {
    try {
      const textToRewrite = this.extractTextFromMessage(message);
      if (!textToRewrite) {
        throw new Error("Nie znaleziono tekstu do przepisania w wiadomości");
      }

      const requestBody = {
        text: textToRewrite,
        style: this.extractStyleFromPrompt(message),
      };

      const response = await fetch(`${this.apiEndpoint}/rewrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Text rewriting API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        rewrittenText: data.rewrittenText || textToRewrite,
        style: requestBody.style,
      };
    } catch (error) {
      throw new Error(
        `Błąd przepisania tekstu: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private async handleGeneralQuery(message: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiEndpoint}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`General query API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        response: data.response || "Nie mogę odpowiedzieć na to pytanie",
      };
    } catch (error) {
      throw new Error(
        `Błąd przetwarzania zapytania: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }
  }

  private extractTextFromMessage(message: string): string | null {
    // Remove commands and extract main text
    const cleaned = message
      .replace(
        /^(napisz|przeanalizuj|podsumuj|przetłumacz|popraw|przepisz)\s*/i,
        ""
      )
      .replace(/^\w+:\s*/, "") // Remove prefixes like "tekst:", "content:"
      .trim();

    return cleaned.length > 10 ? cleaned : null;
  }

  private extractStyleFromPrompt(
    prompt: string
  ): "formal" | "casual" | "creative" | "technical" | "academic" {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("formal") || lowerPrompt.includes("oficjalny"))
      return "formal";
    if (lowerPrompt.includes("casual") || lowerPrompt.includes("nieformalny"))
      return "casual";
    if (lowerPrompt.includes("creative") || lowerPrompt.includes("kreatywny"))
      return "creative";
    if (lowerPrompt.includes("technical") || lowerPrompt.includes("techniczny"))
      return "technical";
    if (lowerPrompt.includes("academic") || lowerPrompt.includes("akademicki"))
      return "academic";

    return "casual";
  }

  private extractFormatFromPrompt(
    prompt: string
  ): "paragraph" | "bullet_points" | "essay" | "summary" | "article" {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("bullet") || lowerPrompt.includes("lista"))
      return "bullet_points";
    if (lowerPrompt.includes("essay") || lowerPrompt.includes("esej"))
      return "essay";
    if (lowerPrompt.includes("summary") || lowerPrompt.includes("streszczenie"))
      return "summary";
    if (lowerPrompt.includes("article") || lowerPrompt.includes("artykuł"))
      return "article";

    return "paragraph";
  }

  private extractTargetLanguage(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Polish language patterns
    if (
      lowerMessage.includes("na polski") ||
      lowerMessage.includes("po polsku")
    )
      return "pl";
    if (
      lowerMessage.includes("na angielski") ||
      lowerMessage.includes("po angielsku")
    )
      return "en";
    if (
      lowerMessage.includes("na niemiecki") ||
      lowerMessage.includes("po niemiecku")
    )
      return "de";
    if (
      lowerMessage.includes("na francuski") ||
      lowerMessage.includes("po francusku")
    )
      return "fr";
    if (
      lowerMessage.includes("na hiszpański") ||
      lowerMessage.includes("po hiszpańsku")
    )
      return "es";
    if (
      lowerMessage.includes("na włoski") ||
      lowerMessage.includes("po włosku")
    )
      return "it";
    if (
      lowerMessage.includes("na rosyjski") ||
      lowerMessage.includes("po rosyjsku")
    )
      return "ru";

    // English patterns
    if (lowerMessage.includes("to english")) return "en";
    if (lowerMessage.includes("to german")) return "de";
    if (lowerMessage.includes("to french")) return "fr";
    if (lowerMessage.includes("to spanish")) return "es";
    if (lowerMessage.includes("to italian")) return "it";
    if (lowerMessage.includes("to russian")) return "ru";

    return "en"; // Default to English
  }

  private formatTextAnalysisResult(result: TextAnalysisResult): string {
    let output = "📊 **Analiza tekstu:**\n\n";
    output += `📝 **Liczba słów:** ${result.word_count}\n`;
    output += `🔤 **Liczba znaków:** ${result.char_count}\n`;
    output += `😊 **Sentiment:** ${result.sentiment}\n`;
    output += `📈 **Czytelność:** ${result.readability_score}/100\n\n`;

    if (result.keywords && result.keywords.length > 0) {
      output += `🏷️ **Słowa kluczowe:** ${result.keywords.join(", ")}\n\n`;
    }

    output += `👍 **Pozytywne wskaźniki:** ${result.positive_indicators}\n`;
    output += `👎 **Negatywne wskaźniki:** ${result.negative_indicators}`;

    return output;
  }

  async testConnection(): Promise<AgentResponse> {
    try {
      const response = await fetch(`${this.apiEndpoint}/health`, {
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
              supportedLanguages: this.supportedLanguages.length,
              maxTextLength: this.maxTextLength,
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

  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  async shutdown(): Promise<void> {
    console.log("🔄 Shutting down Text Bison Agent...");
    this.config.status = "offline";
    console.log("✅ Text Bison Agent shutdown complete");
  }
}

// Export default instance creator
export function createTextBisonAgent(
  config?: Partial<AgentConfig>
): TextBisonAgent {
  const defaultConfig: AgentConfig = {
    agent_id: "text-bison",
    name: "Text Bison Agent",
    model: "text-bison",
    status: "offline",
    category: "core",
    icon: "📝",
    color: "#1976d2",
    priority: "HIGH",
    description:
      "Advanced text processing AI for generation, analysis, and language tasks",
  };

  return new TextBisonAgent({ ...defaultConfig, ...config });
}
