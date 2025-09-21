globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createErrorResponse, a as createSuccessResponse } from '../../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const agentConfigs = {
  mybonzo: {
    name: "MyBonzo AI",
    model: "@cf/meta/llama-3.1-8b-instruct",
    capabilities: ["chat", "images", "tasks", "analysis"]
  },
  polaczek: {
    name: "Polaczek Agent",
    model: "@cf/meta/llama-3.1-8b-instruct",
    capabilities: ["chat", "translation", "local-tasks"]
  },
  bielik: {
    name: "Bielik AI",
    model: "@cf/huggingface/bielik-7b-instruct-v0.1",
    capabilities: ["chat", "polish-tasks", "analysis"]
  },
  assistant: {
    name: "Universal Assistant",
    model: "@cf/meta/llama-3.1-8b-instruct",
    capabilities: ["chat", "help", "general-tasks"]
  }
};
const GET = async ({ params, locals }) => {
  try {
    const { agentId } = params;
    const env = locals.runtime.env;
    if (!agentId) {
      return createErrorResponse("Missing agentId", 400);
    }
    const agentConfig = agentConfigs[agentId];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }
    let stats = { messagesCount: 0, imagesGenerated: 0, tasksCompleted: 0, lastActivity: null };
    try {
      const statsKey = `agent_stats_${agentId}`;
      const savedStats = await env.AI_AGENTS?.get(statsKey);
      if (savedStats) {
        stats = { ...stats, ...JSON.parse(savedStats) };
      }
    } catch (error) {
      console.warn("Could not fetch stats:", error);
    }
    return createSuccessResponse({
      success: true,
      agentId,
      agent: {
        name: agentConfig.name,
        model: agentConfig.model,
        capabilities: agentConfig.capabilities,
        status: "active"
      },
      stats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Status error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
