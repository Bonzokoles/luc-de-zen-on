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
export { d as renderers } from '../../../../chunks/vendor_CYa9XZjz.mjs';

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
const POST = async ({ params, request, locals }) => {
  try {
    const { agentId } = params;
    const { message } = await request.json();
    const env = locals.runtime.env;
    if (!agentId || !message) {
      return createErrorResponse("Missing agentId or message", 400);
    }
    const agentConfig = agentConfigs[agentId];
    if (!agentConfig) {
      return createErrorResponse("Agent not found", 404);
    }
    if (!agentConfig.capabilities.includes("chat")) {
      return createErrorResponse("Agent does not support chat", 400);
    }
    if (!env.AI) {
      return createErrorResponse("AI service not available", 503);
    }
    const messages = [
      { role: "system", content: agentConfig.systemPrompt },
      { role: "user", content: message }
    ];
    const response = await env.AI.run(agentConfig.model, {
      messages,
      max_tokens: 512,
      temperature: 0.7
    });
    try {
      const statsKey = `agent_stats_${agentId}`;
      const stats = await env.AI_AGENTS?.get(statsKey);
      const currentStats = stats ? JSON.parse(stats) : { messagesCount: 0, lastActivity: null };
      currentStats.messagesCount += 1;
      currentStats.lastActivity = (/* @__PURE__ */ new Date()).toISOString();
      await env.AI_AGENTS?.put(statsKey, JSON.stringify(currentStats));
    } catch (statsError) {
      console.warn("Could not update stats:", statsError);
    }
    return createSuccessResponse({
      success: true,
      response: response.response,
      agentId,
      agentName: agentConfig.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Chat error:", error);
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
