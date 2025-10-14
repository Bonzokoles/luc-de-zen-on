import type { APIRoute } from "astro";
import { createSuccessResponse, createErrorResponse } from "@/utils/corsUtils";

const agentConfigs = {
  mybonzo: {
    name: "MyBonzo AI",
    model: "@cf/meta/llama-3.1-8b-instruct",
    capabilities: ["chat", "images", "tasks", "analysis"],
  },
  polaczek: {
    name: "Polaczek Agent",
    model: "@cf/meta/llama-3.1-8b-instruct",
    capabilities: ["chat", "translation", "local-tasks"],
  },
  bielik: {
    name: "Bielik AI",
    model: "@cf/huggingface/bielik-7b-instruct-v0.1",
    capabilities: ["chat", "polish-tasks", "analysis"],
  },
  assistant: {
    name: "Universal Assistant",
    model: "@cf/meta/llama-3.1-8b-instruct",
    capabilities: ["chat", "help", "general-tasks"],
  },
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { agentId } = params;
    const { task } = (await request.json()) as any;
    const env = (locals as any).runtime?.env;

    if (!agentId || !task) {
      return createErrorResponse("Missing agentId or task", 400);
    }

    const agentConfig = agentConfigs[agentId as keyof typeof agentConfigs];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }

    // Sprawdź czy agent może wykonywać zadania
    const taskCapabilities = [
      "tasks",
      "local-tasks",
      "polish-tasks",
      "general-tasks",
    ];
    const canExecuteTasks = agentConfig.capabilities.some((cap) =>
      taskCapabilities.includes(cap)
    );

    if (!canExecuteTasks) {
      return createErrorResponse("Agent does not support task execution", 400);
    }

    if (!env.AI) {
      return createErrorResponse("AI service not available", 503);
    }

    // Przygotuj prompt dla wykonania zadania
    const systemPrompt = `Jesteś ${agentConfig.name}. Wykonaj następujące zadanie dokładnie i zwróć konkretny wynik. Jeśli zadanie wymaga obliczeń, wykonaj je. Jeśli wymaga analizy, przeprowadź ją. Zwróć praktyczny, użyteczny wynik.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Zadanie do wykonania: ${task}` },
    ];

    // Wywołaj AI do wykonania zadania
    const response = await env?.AI?.run(agentConfig.model, {
      messages,
      max_tokens: 1024,
      temperature: 0.3, // Niższa temperatura dla bardziej precyzyjnych zadań
    });

    // Zapisz statystyki
    try {
      const statsKey = `agent_stats_${agentId}`;
      const stats = await env?.AI_AGENTS?.get(statsKey);
      const currentStats = stats
        ? JSON.parse(stats)
        : {
            messagesCount: 0,
            imagesGenerated: 0,
            tasksCompleted: 0,
            lastActivity: null,
          };

      currentStats.tasksCompleted += 1;
      currentStats.lastActivity = new Date().toISOString();

      await env?.AI_AGENTS?.put(statsKey, JSON.stringify(currentStats));
    } catch (statsError) {
      console.warn("Could not update stats:", statsError);
    }

    return createSuccessResponse({
      success: true,
      result: response.response,
      task,
      agentId,
      agentName: agentConfig.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Task execution error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
