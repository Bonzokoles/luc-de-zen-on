globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createSuccessResponse, b as createErrorResponse } from '../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const GET = async ({ locals }) => {
  try {
    const env = locals.runtime.env;
    const agentIds = ["mybonzo", "polaczek", "bielik", "assistant"];
    let totalMessages = 0;
    let totalImages = 0;
    let totalTasks = 0;
    for (const agentId of agentIds) {
      try {
        const statsKey = `agent_stats_${agentId}`;
        const stats = await env.AI_AGENTS?.get(statsKey);
        if (stats) {
          const agentStats = JSON.parse(stats);
          totalMessages += agentStats.messagesCount || 0;
          totalImages += agentStats.imagesGenerated || 0;
          totalTasks += agentStats.tasksCompleted || 0;
        }
      } catch (error) {
        console.warn(`Could not fetch stats for ${agentId}:`, error);
      }
    }
    return createSuccessResponse({
      success: true,
      totalMessages,
      imagesGenerated: totalImages,
      tasksCompleted: totalTasks,
      activeAgents: agentIds.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Stats error:", error);
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
