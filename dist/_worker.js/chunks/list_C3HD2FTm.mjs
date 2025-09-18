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
import { a as createSuccessResponse, b as createErrorResponse } from './corsUtils_DD_RavK2.mjs';

const createdAgents = /* @__PURE__ */ new Map();
if (createdAgents.size === 0) {
  createdAgents.set("polaczek_system_monitor", {
    name: "polaczek_system_monitor",
    type: "monitor",
    description: "System monitoring agent",
    status: "running",
    cpu_usage: 8,
    memory_usage: 145,
    messages_processed: 234,
    errors_count: 0,
    created_at: new Date(Date.now() - 864e5).toISOString(),
    // 1 day ago
    last_activity: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0",
    port: 3001
  });
  createdAgents.set("polaczek_translator", {
    name: "polaczek_translator",
    type: "translator",
    description: "Multi-language translation agent",
    status: "running",
    cpu_usage: 12,
    memory_usage: 198,
    messages_processed: 67,
    errors_count: 1,
    created_at: new Date(Date.now() - 432e5).toISOString(),
    // 12 hours ago
    last_activity: new Date(Date.now() - 36e5).toISOString(),
    // 1 hour ago
    version: "1.0.0",
    port: 3002
  });
  createdAgents.set("polaczek_chatbot", {
    name: "polaczek_chatbot",
    type: "chatbot",
    description: "General purpose conversation agent",
    status: "stopped",
    cpu_usage: 0,
    memory_usage: 0,
    messages_processed: 456,
    errors_count: 3,
    created_at: new Date(Date.now() - 216e5).toISOString(),
    // 6 hours ago
    last_activity: new Date(Date.now() - 18e5).toISOString(),
    // 30 minutes ago
    version: "1.0.0",
    port: 3003
  });
}
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let agents = Array.from(createdAgents.values());
    if (status) {
      agents = agents.filter((agent) => agent.status === status);
    }
    if (type) {
      agents = agents.filter((agent) => agent.type === type);
    }
    agents.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());
    const total = agents.length;
    const paginatedAgents = agents.slice(offset, offset + limit);
    const stats = {
      total,
      active: agents.filter((a) => a.status === "running").length,
      stopped: agents.filter((a) => a.status === "stopped").length,
      error: agents.filter((a) => a.status === "error").length,
      total_messages: agents.reduce((sum, a) => sum + a.messages_processed, 0),
      total_errors: agents.reduce((sum, a) => sum + a.errors_count, 0),
      types: [...new Set(agents.map((a) => a.type))],
      avg_cpu: agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.cpu_usage, 0) / agents.length) : 0,
      avg_memory: agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.memory_usage, 0) / agents.length) : 0
    };
    console.log(`[AGENTS LIST] Retrieved ${paginatedAgents.length}/${total} agents`);
    return createSuccessResponse({
      agents: paginatedAgents,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total
      },
      statistics: stats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return createErrorResponse("Failed to fetch agents list", 500);
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    if (body.action === "refresh") {
      for (const [key, agent] of createdAgents) {
        if (Math.random() > 0.9) {
          agent.last_activity = (/* @__PURE__ */ new Date()).toISOString();
          agent.messages_processed += Math.floor(Math.random() * 5);
        }
        if (agent.status === "running") {
          agent.cpu_usage = Math.max(1, Math.min(30, agent.cpu_usage + (Math.random() - 0.5) * 4));
          agent.memory_usage = Math.max(50, Math.min(500, agent.memory_usage + (Math.random() - 0.5) * 20));
        }
      }
      return createSuccessResponse({
        message: "Agent statuses refreshed",
        refreshed_count: createdAgents.size,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return createErrorResponse("Invalid action", 400);
  } catch (error) {
    console.error("Error in agents list POST:", error);
    return createErrorResponse("Failed to process request", 500);
  }
};
function addAgentToList(agentData) {
  const agent = {
    name: agentData.name,
    type: agentData.type,
    description: agentData.description,
    status: "stopped",
    // New agents start stopped
    cpu_usage: 0,
    memory_usage: 0,
    messages_processed: 0,
    errors_count: 0,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    last_activity: (/* @__PURE__ */ new Date()).toISOString(),
    version: agentData.version || "1.0.0",
    port: agentData.port || 3e3,
    model: agentData.model,
    language: agentData.language || "pl",
    activity_level: agentData.activity_level || "medium",
    instructions: agentData.instructions
  };
  createdAgents.set(agentData.name, agent);
  console.log(`[AGENTS LIST] Added new agent: ${agentData.name}`);
  return agent;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    addAgentToList
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, addAgentToList as a };
