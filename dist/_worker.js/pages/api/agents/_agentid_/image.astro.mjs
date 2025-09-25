globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createErrorResponse, a as createSuccessResponse } from '../../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_iO87Dm24.mjs';

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
const POST = async ({ params, request, locals }) => {
  try {
    const { agentId } = params;
    const { prompt } = await request.json();
    const env = locals.runtime.env;
    if (!agentId || !prompt) {
      return createErrorResponse("Missing agentId or prompt", 400);
    }
    const agentConfig = agentConfigs[agentId];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }
    if (!agentConfig.capabilities.includes("images")) {
      return createErrorResponse("Agent does not support image generation", 400);
    }
    if (!env.AI) {
      return createErrorResponse("AI service not available", 503);
    }
    const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt,
      num_steps: 4
    });
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
      currentStats.lastActivity = (/* @__PURE__ */ new Date()).toISOString();
      await env.AI_AGENTS?.put(statsKey, JSON.stringify(currentStats));
    } catch (statsError) {
      console.warn("Could not update stats:", statsError);
    }
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(response)));
    const imageUrl = `data:image/png;base64,${base64Image}`;
    return createSuccessResponse({
      success: true,
      imageUrl,
      prompt,
      agentId,
      agentName: agentConfig.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
