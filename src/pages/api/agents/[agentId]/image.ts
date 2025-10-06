import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse } from '@/utils/corsUtils';

const agentConfigs = {
  mybonzo: {
    name: "MyBonzo AI",
    capabilities: ["chat", "images", "tasks", "analysis"]
  },
  polaczek: {
    name: "Polaczek Agent", 
    capabilities: ["chat", "translation", "local-tasks"]
  },
  bielik: {
    name: "Bielik AI",
    capabilities: ["chat", "polish-tasks", "analysis"]
  },
  assistant: {
    name: "Universal Assistant",
    capabilities: ["chat", "help", "general-tasks"]
  }
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { agentId } = params;
    const { prompt } = await request.json();
    const env = locals.runtime.env;

    if (!agentId || !prompt) {
      return createErrorResponse("Missing agentId or prompt", 400);
    }

    const agentConfig = agentConfigs[agentId as keyof typeof agentConfigs];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }

    // Sprawdź czy agent może generować obrazy
    if (!agentConfig.capabilities.includes("images")) {
      return createErrorResponse("Agent does not support image generation", 400);
    }

    if (!env.AI) {
      return createErrorResponse("AI service not available", 503);
    }

    // Generuj obraz używając Cloudflare Workers AI
    const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt: prompt,
      num_steps: 4
    });

    // Zapisz statystyki
    try {
      const statsKey = `agent_stats_${agentId}`;
      const stats = await env.AI_AGENTS?.get(statsKey);
      const currentStats = stats ? JSON.parse(stats) : { 
        messagesCount: 0, 
        imagesGenerated: 0, 
        tasksCompleted: 0, 
        lastActivity: null 
      };
      
      currentStats.imagesGenerated += 1;
      currentStats.lastActivity = new Date().toISOString();
      
      await env.AI_AGENTS?.put(statsKey, JSON.stringify(currentStats));
    } catch (statsError) {
      console.warn("Could not update stats:", statsError);
    }

    // Konwertuj na data URL
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(response as ArrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return createSuccessResponse({
      success: true,
      imageUrl,
      prompt,
      agentId,
      agentName: agentConfig.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Image generation error:", error);
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
