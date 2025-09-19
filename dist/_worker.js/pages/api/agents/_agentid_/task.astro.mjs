if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
import { b as createErrorResponse, a as createSuccessResponse } from '../../../../chunks/corsUtils_DD_RavK2.mjs';
export { d as renderers } from '../../../../chunks/vendor_BHZTJLV0.mjs';

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
const POST = async ({ params, request, locals }) => {
  try {
    const { agentId } = params;
    const { task } = await request.json();
    const env = locals.runtime.env;
    if (!agentId || !task) {
      return createErrorResponse("Missing agentId or task", 400);
    }
    const agentConfig = agentConfigs[agentId];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }
    const taskCapabilities = ["tasks", "local-tasks", "polish-tasks", "general-tasks"];
    const canExecuteTasks = agentConfig.capabilities.some((cap) => taskCapabilities.includes(cap));
    if (!canExecuteTasks) {
      return createErrorResponse("Agent does not support task execution", 400);
    }
    if (!env.AI) {
      return createErrorResponse("AI service not available", 503);
    }
    const systemPrompt = `Jesteś ${agentConfig.name}. Wykonaj następujące zadanie dokładnie i zwróć konkretny wynik. Jeśli zadanie wymaga obliczeń, wykonaj je. Jeśli wymaga analizy, przeprowadź ją. Zwróć praktyczny, użyteczny wynik.`;
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Zadanie do wykonania: ${task}` }
    ];
    const response = await env.AI.run(agentConfig.model, {
      messages,
      max_tokens: 1024,
      temperature: 0.3
      // Niższa temperatura dla bardziej precyzyjnych zadań
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
      currentStats.tasksCompleted += 1;
      currentStats.lastActivity = (/* @__PURE__ */ new Date()).toISOString();
      await env.AI_AGENTS?.put(statsKey, JSON.stringify(currentStats));
    } catch (statsError) {
      console.warn("Could not update stats:", statsError);
    }
    return createSuccessResponse({
      success: true,
      result: response.response,
      task,
      agentId,
      agentName: agentConfig.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Task execution error:", error);
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
