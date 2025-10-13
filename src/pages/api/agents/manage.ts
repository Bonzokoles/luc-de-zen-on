import type { APIRoute } from "astro";
import { createSuccessResponse, createErrorResponse } from "@/utils/corsUtils";

type KVNamespace = any;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { name, model, description, capabilities } =
      (await request.json()) as any;
    const env = locals.runtime.env;

    if (!name || !model || !description || !capabilities) {
      return createErrorResponse(
        "Missing required fields: name, model, description, capabilities",
        400
      );
    }

    // Generuj agentId na podstawie nazwy
    const agentId = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Sprawdź czy agent już istnieje
    try {
      const existingAgent = await (env.AGENTS as KVNamespace)?.get(
        `agent_${agentId}`
      );
      if (existingAgent) {
        return createErrorResponse("Agent with this name already exists", 409);
      }
    } catch (error) {
      console.warn("Could not check existing agent:", error);
    }

    // Stwórz konfigurację agenta
    const agentConfig = {
      id: agentId,
      name,
      model,
      description,
      capabilities: Array.isArray(capabilities) ? capabilities : [capabilities],
      systemPrompt: `Jesteś ${name}. ${description}`,
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    // Zapisz agenta do KV
    try {
      await (env.AGENTS as KVNamespace)?.put(
        `agent_${agentId}`,
        JSON.stringify(agentConfig)
      );

      // Inicjalizuj statystyki
      const initialStats = {
        messagesCount: 0,
        imagesGenerated: 0,
        tasksCompleted: 0,
        lastActivity: null,
        createdAt: new Date().toISOString(),
      };

      await (env.AI_AGENTS as KVNamespace)?.put(
        `agent_stats_${agentId}`,
        JSON.stringify(initialStats)
      );
    } catch (error) {
      console.error("Could not save agent:", error);
      return createErrorResponse("Could not save agent configuration", 500);
    }

    return createSuccessResponse({
      success: true,
      agent: agentConfig,
      message: `Agent ${name} created successfully`,
      agentUrl: `/agents/${agentId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agent creation error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime.env;

    // Pobierz listę wszystkich agentów
    const defaultAgents = [
      {
        id: "mybonzo",
        name: "MyBonzo AI",
        description: "Główny agent cyberpunkowy z pełną funkcjonalnością",
        capabilities: ["chat", "images", "tasks", "analysis"],
        isCustom: false,
      },
      {
        id: "polaczek",
        name: "Polaczek Agent",
        description: "Lokalny agent wspierający polskie zadania",
        capabilities: ["chat", "translation", "local-tasks"],
        isCustom: false,
      },
      {
        id: "bielik",
        name: "Bielik AI",
        description: "Polski model językowy dla zadań w języku polskim",
        capabilities: ["chat", "polish-tasks", "analysis"],
        isCustom: false,
      },
      {
        id: "assistant",
        name: "Universal Assistant",
        description: "Uniwersalny asystent do ogólnych zadań",
        capabilities: ["chat", "help", "general-tasks"],
        isCustom: false,
      },
    ];

    let customAgents = [];

    // Pobierz niestandardowych agentów z KV
    try {
      const agentsList = await (env.AGENTS as KVNamespace)?.list();
      if (agentsList) {
        for (const key of agentsList.keys) {
          if (key.name.startsWith("agent_")) {
            try {
              const agentData = await (env.AGENTS as KVNamespace).get(key.name);
              if (agentData) {
                customAgents.push(JSON.parse(agentData));
              }
            } catch (error) {
              console.warn(`Could not load agent ${key.name}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Could not fetch custom agents:", error);
    }

    return createSuccessResponse({
      success: true,
      agents: [...defaultAgents, ...customAgents],
      totalAgents: defaultAgents.length + customAgents.length,
      defaultCount: defaultAgents.length,
      customCount: customAgents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("List agents error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
