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
import { b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_DD_RavK2.mjs';
export { d as renderers } from '../../../chunks/vendor_QZhDtzeH.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { name, model, description, capabilities } = await request.json();
    const env = locals.runtime.env;
    if (!name || !model || !description || !capabilities) {
      return createErrorResponse("Missing required fields: name, model, description, capabilities", 400);
    }
    const agentId = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    try {
      const existingAgent = await env.AGENTS?.get(`agent_${agentId}`);
      if (existingAgent) {
        return createErrorResponse("Agent with this name already exists", 409);
      }
    } catch (error) {
      console.warn("Could not check existing agent:", error);
    }
    const agentConfig = {
      id: agentId,
      name,
      model,
      description,
      capabilities: Array.isArray(capabilities) ? capabilities : [capabilities],
      systemPrompt: `Jesteś ${name}. ${description}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      isCustom: true
    };
    try {
      await env.AGENTS?.put(`agent_${agentId}`, JSON.stringify(agentConfig));
      const initialStats = {
        messagesCount: 0,
        imagesGenerated: 0,
        tasksCompleted: 0,
        lastActivity: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await env.AI_AGENTS?.put(`agent_stats_${agentId}`, JSON.stringify(initialStats));
    } catch (error) {
      console.error("Could not save agent:", error);
      return createErrorResponse("Could not save agent configuration", 500);
    }
    return createSuccessResponse({
      success: true,
      agent: agentConfig,
      message: `Agent ${name} created successfully`,
      agentUrl: `/agents/${agentId}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Agent creation error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};
const GET = async ({ locals }) => {
  try {
    const env = locals.runtime.env;
    const defaultAgents = [
      {
        id: "mybonzo",
        name: "MyBonzo AI",
        description: "Główny agent cyberpunkowy z pełną funkcjonalnością",
        capabilities: ["chat", "images", "tasks", "analysis"],
        isCustom: false
      },
      {
        id: "polaczek",
        name: "Polaczek Agent",
        description: "Lokalny agent wspierający polskie zadania",
        capabilities: ["chat", "translation", "local-tasks"],
        isCustom: false
      },
      {
        id: "bielik",
        name: "Bielik AI",
        description: "Polski model językowy dla zadań w języku polskim",
        capabilities: ["chat", "polish-tasks", "analysis"],
        isCustom: false
      },
      {
        id: "assistant",
        name: "Universal Assistant",
        description: "Uniwersalny asystent do ogólnych zadań",
        capabilities: ["chat", "help", "general-tasks"],
        isCustom: false
      }
    ];
    let customAgents = [];
    try {
      const agentsList = await env.AGENTS?.list();
      if (agentsList) {
        for (const key of agentsList.keys) {
          if (key.name.startsWith("agent_")) {
            try {
              const agentData = await env.AGENTS.get(key.name);
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
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("List agents error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
