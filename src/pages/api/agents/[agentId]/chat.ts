import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse } from '../../../../utils/corsUtils';

// Konfiguracja agentów
const agentConfigs = {
  mybonzo: {
    name: "MyBonzo AI",
    model: "@cf/meta/llama-3.1-8b-instruct",
    systemPrompt: "Jesteś MyBonzo AI - cyberpunkowy asystent. Odpowiadaj w stylu futurystycznym, ale pomocnym.",
    capabilities: ["chat", "images", "tasks", "analysis"]
  },
  polaczek: {
    name: "Polaczek Agent", 
    model: "@cf/meta/llama-3.1-8b-instruct",
    systemPrompt: "Jesteś Polaczek - polski asystent AI. Pomagasz w lokalnych zadaniach i tłumaczeniach.",
    capabilities: ["chat", "translation", "local-tasks"]
  },
  bielik: {
    name: "Bielik AI",
    model: "@cf/huggingface/bielik-7b-instruct-v0.1", 
    systemPrompt: "Jesteś Bielik - polski model językowy. Specjalizujesz się w zadaniach w języku polskim.",
    capabilities: ["chat", "polish-tasks", "analysis"]
  },
  assistant: {
    name: "Universal Assistant",
    model: "@cf/meta/llama-3.1-8b-instruct",
    systemPrompt: "Jesteś uniwersalnym asystentem AI. Pomagasz w różnych zadaniach.",
    capabilities: ["chat", "help", "general-tasks"]
  }
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { agentId } = params;
    const { message } = await request.json();
    const env = locals.runtime.env;

    if (!agentId || !message) {
      return createErrorResponse("Missing agentId or message", 400);
    }

    const agentConfig = agentConfigs[agentId as keyof typeof agentConfigs];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }

    // Sprawdź czy agent ma możliwość chatu
    if (!agentConfig.capabilities.includes("chat")) {
      return createErrorResponse("Agent does not support chat", 400);
    }

    if (!env.AI) {
      return createErrorResponse("AI service not available", 503);
    }

    // Przygotuj wiadomości dla AI
    const messages = [
      { role: "system", content: agentConfig.systemPrompt },
      { role: "user", content: message }
    ];

    // Wywołaj Cloudflare Workers AI
    const response = await env.AI.run(agentConfig.model, {
      messages,
      max_tokens: 512,
      temperature: 0.7
    });

    // Zapisz statystyki do KV (opcjonalnie)
    try {
      const statsKey = `agent_stats_${agentId}`;
      const stats = await env.AI_AGENTS?.get(statsKey);
      const currentStats = stats ? JSON.parse(stats) : { messagesCount: 0, lastActivity: null };
      
      currentStats.messagesCount += 1;
      currentStats.lastActivity = new Date().toISOString();
      
      await env.AI_AGENTS?.put(statsKey, JSON.stringify(currentStats));
    } catch (statsError) {
      console.warn("Could not update stats:", statsError);
    }

    return createSuccessResponse({
      success: true,
      response: response.response,
      agentId,
      agentName: agentConfig.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chat error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
