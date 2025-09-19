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
export { d as renderers } from '../../../../chunks/vendor_BHZTJLV0.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { agent_name, action } = body;
    if (!agent_name || !action) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields",
        message: "agent_name and action are required",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const validActions = ["start", "stop", "restart", "kill"];
    if (!validActions.includes(action)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid action",
        message: `Action must be one of: ${validActions.join(", ")}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const result = await controlAgent(agent_name, action);
    if (result.success) {
      console.log(`[AGENT CONTROL] ${action.toUpperCase()} ${agent_name} - ${result.message}`);
      return new Response(JSON.stringify({
        success: true,
        agent_name,
        action,
        message: result.message,
        new_status: result.new_status,
        pid: result.pid,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error,
        message: result.message,
        agent_name,
        action,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error("Error controlling agent:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
async function controlAgent(agentName, action) {
  const agentConfigs = {
    "Polaczek_A1": {
      type: "monitor",
      port: 3007,
      script: "polaczek_A1_monitor.py",
      description: "System monitoring agent"
    },
    "Polaczek_D": {
      type: "dashboard",
      port: 3002,
      script: "polaczek_D_dashboard.py",
      description: "Dashboard integration agent"
    },
    "Polaczek_T1": {
      type: "translator",
      port: 3008,
      script: "polaczek_T1_translator.py",
      description: "Language translation agent"
    },
    "Polaczek_S1": {
      type: "searcher",
      port: 3009,
      script: "polaczek_S1_searcher.py",
      description: "Information search agent"
    },
    "Polaczek_ART": {
      type: "artist",
      port: 3010,
      script: "polaczek_ART_AI_discovery.py",
      description: "AI art generation agent"
    }
  };
  const agentConfig = agentConfigs[agentName];
  if (!agentConfig) {
    return {
      success: false,
      error: "Agent not found",
      message: `Agent ${agentName} is not registered in the system`
    };
  }
  switch (action) {
    case "start":
      const startSuccess = Math.random() > 0.1;
      if (startSuccess) {
        const mockPid = Math.floor(Math.random() * 9e3) + 1e3;
        return {
          success: true,
          message: `Agent ${agentName} started successfully on port ${agentConfig.port}`,
          new_status: "running",
          pid: mockPid
        };
      } else {
        return {
          success: false,
          error: "Start failed",
          message: `Failed to start agent ${agentName}. Port ${agentConfig.port} may be in use.`,
          new_status: "error"
        };
      }
    case "stop":
      const stopSuccess = Math.random() > 0.05;
      if (stopSuccess) {
        return {
          success: true,
          message: `Agent ${agentName} stopped gracefully`,
          new_status: "stopped",
          pid: null
        };
      } else {
        return {
          success: false,
          error: "Stop failed",
          message: `Agent ${agentName} did not respond to stop signal`,
          new_status: "error"
        };
      }
    case "restart":
      const restartSuccess = Math.random() > 0.15;
      if (restartSuccess) {
        const mockPid = Math.floor(Math.random() * 9e3) + 1e3;
        return {
          success: true,
          message: `Agent ${agentName} restarted successfully`,
          new_status: "running",
          pid: mockPid
        };
      } else {
        return {
          success: false,
          error: "Restart failed",
          message: `Failed to restart agent ${agentName}. Check logs for details.`,
          new_status: "error"
        };
      }
    case "kill":
      return {
        success: true,
        message: `Agent ${agentName} forcefully terminated`,
        new_status: "stopped",
        pid: null
      };
    default:
      return {
        success: false,
        error: "Invalid action",
        message: `Action ${action} is not supported`
      };
  }
}
const PUT = async ({ request }) => {
  try {
    const body = await request.json();
    const { agents, action } = body;
    if (!agents || !Array.isArray(agents) || agents.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid agents list",
        message: "agents must be a non-empty array",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const results = [];
    for (const agentName of agents) {
      try {
        const result = await controlAgent(agentName, action);
        results.push({
          agent: agentName,
          ...result
        });
      } catch (error) {
        results.push({
          agent: agentName,
          success: false,
          error: "Control failed",
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;
    return new Response(JSON.stringify({
      success: failureCount === 0,
      message: `Bulk ${action}: ${successCount} succeeded, ${failureCount} failed`,
      results,
      summary: {
        total: results.length,
        succeeded: successCount,
        failed: failureCount
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error in bulk agent control:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Bulk operation failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
