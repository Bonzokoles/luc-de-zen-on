globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const GET = async ({ request }) => {
  try {
    const mockAgents = [
      {
        name: "Polaczek_A1",
        type: "monitor",
        status: "running",
        description: "Agent monitorujący system i alarmujący o problemach",
        last_activity: (/* @__PURE__ */ new Date()).toISOString(),
        cpu_usage: 15.2,
        memory_usage: 128.5,
        messages_processed: 1247,
        errors_count: 2,
        pid: 1234,
        port: 3007,
        uptime: 36e5,
        // 1 hour in milliseconds
        capabilities: ["system_monitoring", "alerting", "performance_tracking"]
      },
      {
        name: "Polaczek_D",
        type: "dashboard",
        status: "running",
        description: "Agent zarządzający integracją z dashboard",
        last_activity: (/* @__PURE__ */ new Date()).toISOString(),
        cpu_usage: 8.7,
        memory_usage: 96.3,
        messages_processed: 856,
        errors_count: 0,
        pid: 1235,
        port: 3002,
        uptime: 24e5,
        // 40 minutes
        capabilities: ["dashboard_integration", "agent_management", "status_monitoring"]
      },
      {
        name: "Polaczek_T1",
        type: "translator",
        status: "stopped",
        description: "Agent tłumaczący języki",
        last_activity: new Date(Date.now() - 3e5).toISOString(),
        // 5 minutes ago
        cpu_usage: 0,
        memory_usage: 0,
        messages_processed: 423,
        errors_count: 1,
        pid: null,
        port: 3008,
        uptime: 0,
        capabilities: ["language_translation", "text_processing", "multi_language_support"]
      },
      {
        name: "Polaczek_S1",
        type: "searcher",
        status: "running",
        description: "Agent wyszukujący informacje",
        last_activity: (/* @__PURE__ */ new Date()).toISOString(),
        cpu_usage: 22.1,
        memory_usage: 156.8,
        messages_processed: 2341,
        errors_count: 5,
        pid: 1236,
        port: 3009,
        uptime: 72e5,
        // 2 hours
        capabilities: ["web_search", "data_retrieval", "content_analysis", "api_integration"]
      },
      {
        name: "Polaczek_ART",
        type: "artist",
        status: "error",
        description: "Agent generujący obrazy i sztukę",
        last_activity: new Date(Date.now() - 6e5).toISOString(),
        // 10 minutes ago
        cpu_usage: 0,
        memory_usage: 45.2,
        messages_processed: 89,
        errors_count: 12,
        pid: null,
        port: 3010,
        uptime: 0,
        capabilities: ["image_generation", "art_creation", "visual_ai", "prompt_processing"]
      }
    ];
    const systemStats = {
      total_agents: mockAgents.length,
      active_agents: mockAgents.filter((agent) => agent.status === "running").length,
      stopped_agents: mockAgents.filter((agent) => agent.status === "stopped").length,
      error_agents: mockAgents.filter((agent) => agent.status === "error").length,
      total_messages: mockAgents.reduce((sum, agent) => sum + agent.messages_processed, 0),
      total_errors: mockAgents.reduce((sum, agent) => sum + agent.errors_count, 0),
      system_health: calculateSystemHealth(mockAgents),
      pending_tasks: Math.floor(Math.random() * 10),
      // Mock pending tasks
      average_cpu: calculateAverageCPU(mockAgents),
      total_memory: calculateTotalMemory(mockAgents),
      uptime: Math.max(...mockAgents.map((a) => a.uptime)),
      last_updated: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify({
      success: true,
      agents: mockAgents,
      system_stats: systemStats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Error fetching agents list:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch agents list",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
function calculateSystemHealth(agents) {
  if (agents.length === 0) return 0;
  const runningAgents = agents.filter((a) => a.status === "running").length;
  const errorAgents = agents.filter((a) => a.status === "error").length;
  const totalErrors = agents.reduce((sum, a) => sum + a.errors_count, 0);
  let healthScore = 100;
  healthScore -= (agents.length - runningAgents) * 15;
  healthScore -= errorAgents * 25;
  if (totalErrors > 0) {
    const totalMessages = agents.reduce((sum, a) => sum + a.messages_processed, 0);
    const errorRate = totalMessages > 0 ? totalErrors / totalMessages * 100 : 0;
    healthScore -= errorRate * 10;
  }
  return Math.max(0, Math.min(100, Math.round(healthScore)));
}
function calculateAverageCPU(agents) {
  const runningAgents = agents.filter((a) => a.status === "running");
  if (runningAgents.length === 0) return 0;
  const totalCPU = runningAgents.reduce((sum, a) => sum + (a.cpu_usage || 0), 0);
  return Math.round(totalCPU / runningAgents.length * 100) / 100;
}
function calculateTotalMemory(agents) {
  return Math.round(agents.reduce((sum, a) => sum + (a.memory_usage || 0), 0) * 100) / 100;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
