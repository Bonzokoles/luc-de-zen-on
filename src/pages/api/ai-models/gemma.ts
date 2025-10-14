import type { APIRoute } from "astro";

// Conversation history tracking
const conversationHistory: Array<{
  id: string;
  messages: Array<{ role: string; content: string; timestamp: number }>;
  model: string;
  timestamp: number;
}> = [];

// AI Functions for Gemma
async function getGemmaInstructions() {
  return {
    title: "Gemma AI Model API - Kompletny przewodnik",
    description: "Darmowy model Gemma z Google dla konwersacji i analizy",
    sections: {
      "Dostępne modele": {
        "gemma-7b-it": "Gemma 7B Instruction Tuned - najlepszy do rozmów",
        "gemma-2b-it": "Gemma 2B Instruction Tuned - szybszy, mniejszy",
        "gemma-7b": "Gemma 7B Base - do dalszego trenowania",
        "gemma-2b": "Gemma 2B Base - kompaktowy model bazowy",
      },
      Funkcje: {
        chat: "Inteligentne rozmowy i asystent",
        analysis: "Analiza tekstu i danych",
        coding: "Pomoc w programowaniu",
        translation: "Tłumaczenie językowe",
        creative: "Twórczy content i historie",
      },
      "Parametry POST": {
        message: "string (wymagane) - wiadomość użytkownika",
        model: "string - model gemma (domyślnie gemma-7b-it)",
        temperature: "number - kreatywność 0.0-1.0",
        max_tokens: "number - maksymalna długość odpowiedzi",
        system_prompt: "string - instrukcje systemowe",
        conversation_id: "string - ID konwersacji (opcjonalne)",
      },
    },
    examples: {
      "Prosta rozmowa": '{"message": "Cześć! Jak się masz?"}',
      "Pomoc w kodzie":
        '{"message": "Napisz funkcję sortującą w Python", "system_prompt": "Jesteś ekspertem programowania"}',
      "Analiza tekstu":
        '{"message": "Przeanalizuj sentiment tego tekstu: [tekst]", "temperature": 0.3}',
      "Kontynuacja rozmowy":
        '{"message": "A co z tym pomysłem?", "conversation_id": "conv_123"}',
    },
    best_practices: {
      prompts: "Pisz jasne, konkretne pytania",
      context: "Podawaj kontekst w system_prompt",
      temperature: "Niższa temperatura = bardziej precyzyjne odpowiedzi",
      conversations: "Używaj conversation_id dla ciągłości rozmowy",
    },
  };
}

async function getGemmaAIHelp(env: any, question: string) {
  try {
    const prompt = `Jesteś ekspertem od modeli Gemma i AI. 
    Użytkownik pyta: "${question}"
    
    Pomóż użytkownikowi z:
    - Wyborem właściwego modelu Gemma
    - Optymalizacją promptów i parametrów
    - Rozwiązywaniem problemów technicznych
    - Najlepszymi praktykami używania Gemma
    
    Odpowiedz po polsku z konkretnymi wskazówkami.`;

    if (env.AI) {
      const response = await env.AI.run("@cf/google/gemma-7b-it-instruct", {
        messages: [{ role: "user", content: prompt }],
      });
      return response.response || "Nie udało się uzyskać odpowiedzi Gemma";
    }

    return "Model Gemma obecnie niedostępny. Sprawdź konfigurację Cloudflare AI.";
  } catch (error) {
    return `Błąd Gemma: ${
      error instanceof Error ? error.message : "Nieznany błąd"
    }`;
  }
}

function generateConversationId(): string {
  return (
    "conv_" + Date.now().toString(36) + Math.random().toString(36).substr(2)
  );
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const instructions = url.searchParams.get("instructions");
    const aiHelp = url.searchParams.get("ai_help");
    const conversationId = url.searchParams.get("conversation_id");

    const env = (globalThis as any).cloudflareEnv || {};

    // Handle instructions request
    if (instructions) {
      const gemmaInstructions = await getGemmaInstructions();
      return new Response(
        JSON.stringify({
          success: true,
          service: "Gemma AI Model - Instrukcje",
          instructions: gemmaInstructions,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getGemmaAIHelp(env, aiHelp);
      return new Response(
        JSON.stringify({
          success: true,
          service: "Gemma AI Assistant",
          question: aiHelp,
          ai_response: aiResponse,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get conversation history
    if (conversationId) {
      const conversation = conversationHistory.find(
        (c) => c.id === conversationId
      );
      return new Response(
        JSON.stringify({
          success: true,
          service: "Gemma Conversation History",
          conversation_id: conversationId,
          conversation: conversation || null,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Default help response
    return new Response(
      JSON.stringify({
        success: true,
        service: "Gemma AI Model API - Darmowy Google AI",
        help: {
          description: "Zaawansowany model Gemma do rozmów i analizy",
          models: ["gemma-7b-it", "gemma-2b-it", "gemma-7b", "gemma-2b"],
          methods: {
            GET: "Instrukcje, pomoc AI i historia rozmów",
            POST: "Rozmowy z modelami Gemma",
          },
          parameters: {
            instructions: "Szczegółowe instrukcje API",
            ai_help: "Zadaj pytanie o modele Gemma",
            conversation_id: "Pobierz historię konwersacji",
          },
          examples: {
            help: "?ai_help=Który model Gemma wybrać do analizy kodu?",
            instructions: "?instructions=true",
            history: "?conversation_id=conv_123abc",
          },
        },
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        service: "Gemma AI Model",
        error: error instanceof Error ? error.message : "Nieznany błąd",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = (await request.json()) as any;
    const {
      message,
      model = "gemma-7b-it",
      temperature = 0.7,
      max_tokens = 2048,
      system_prompt = "",
      conversation_id,
    } = data;

    const env = (locals as any)?.runtime?.env;

    if (!message) {
      return new Response(
        JSON.stringify({
          success: false,
          service: "Gemma AI Chat",
          error: "Brak wiadomości",
          message: "Wymagana jest wiadomość do rozmowy",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const startTime = Date.now();

    // Find or create conversation
    let conversation = conversation_id
      ? conversationHistory.find((c) => c.id === conversation_id)
      : null;

    if (!conversation) {
      conversation = {
        id: conversation_id || generateConversationId(),
        messages: [],
        model,
        timestamp: Date.now(),
      };
      conversationHistory.unshift(conversation);
    }

    // Add system prompt if provided
    if (system_prompt && conversation.messages.length === 0) {
      conversation.messages.push({
        role: "system",
        content: system_prompt,
        timestamp: Date.now(),
      });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    let aiResponse = "";

    // Generate response with Gemma
    if (env?.AI) {
      try {
        // Map model names to Cloudflare AI model IDs
        const modelMap: Record<string, string> = {
          "gemma-7b-it": "@cf/google/gemma-7b-it-instruct",
          "gemma-2b-it": "@cf/google/gemma-2b-it-instruct",
          "gemma-7b": "@cf/google/gemma-7b-it-instruct", // fallback to instruct
          "gemma-2b": "@cf/google/gemma-2b-it-instruct", // fallback to instruct
        };

        const cfModel = modelMap[model] || "@cf/google/gemma-7b-it-instruct";

        const systemMessage = conversation.messages.find(
          (msg) => msg.role === "system"
        );
        const recentMessages = conversation.messages
          .filter((msg) => msg.role !== "system")
          .slice(-10);
        const contextMessages = systemMessage
          ? [systemMessage, ...recentMessages]
          : recentMessages;

        const response = await env.AI.run(cfModel, {
          messages: contextMessages, // Keep system prompt and last 10 exchanges
          temperature,
          max_tokens,
        });
        aiResponse = response.response || "Brak odpowiedzi z modelu Gemma";
      } catch (error) {
        aiResponse = `Błąd modelu Gemma: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`;
      }
    } else {
      aiResponse =
        "Model Gemma obecnie niedostępny - brak konfiguracji Cloudflare AI";
    }

    // Add AI response to conversation
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: Date.now(),
    });

    const executionTime = Date.now() - startTime;
    if (conversation.messages.length > 100) {
      const systemMessage = conversation.messages.find(
        (msg) => msg.role === "system"
      );
      const nonSystemMessages = conversation.messages.filter(
        (msg) => msg.role !== "system"
      );
      const retainCount = systemMessage ? 49 : 50;
      const recentMessages = nonSystemMessages.slice(-retainCount);
      conversation.messages = systemMessage
        ? [systemMessage, ...recentMessages]
        : recentMessages;
    }

    return new Response(
      JSON.stringify({
        success: true,
        service: "Gemma AI Chat",
        model: model,
        conversation_id: conversation.id,
        user_message: message,
        ai_response: aiResponse,
        conversation_length: conversation.messages.length,
        execution_time_ms: executionTime,
        parameters: {
          model,
          temperature,
          max_tokens,
          system_prompt: system_prompt ? "Ustawiony" : "Brak",
        },
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        service: "Gemma AI Chat",
        error: error instanceof Error ? error.message : "Nieznany błąd rozmowy",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
