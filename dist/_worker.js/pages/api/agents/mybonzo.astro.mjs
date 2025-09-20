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
export { d as renderers } from '../../../chunks/vendor_DlPT8CWO.mjs';

const POST = async ({ request, locals, url }) => {
  try {
    const env = locals.runtime?.env;
    const body = await request.json();
    const endpoint = body.endpoint || "chat";
    const mockResponses = {
      chat: {
        success: true,
        response: `🤖 MyBonzo Agent (Local Mock): Received message "${body.message}". This is a mock response for local development.`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        agentId: body.agentId || "default"
      },
      status: {
        success: true,
        status: "online (mock)",
        lastActivity: (/* @__PURE__ */ new Date()).toISOString(),
        stats: {
          messagesCount: 5,
          imagesGenerated: 2,
          tasksCompleted: 3
        },
        conversationLength: 5
      },
      task: {
        success: true,
        result: `🎯 Task "${body.taskType}" completed (mock). In production, this would execute: ${JSON.stringify(body.taskData)}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      image: {
        success: true,
        response: `🖼️ Image generation (mock) for prompt: "${body.prompt}". In production, this would generate an actual image.`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      analyze: {
        success: true,
        response: `📊 Text analysis (mock) completed. In production, this would analyze: "${body.text}"`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      clear: {
        success: true,
        message: "🧹 History cleared (mock)",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const mockResponse = mockResponses[endpoint] || mockResponses.chat;
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("MyBonzo Agent API Error:", error);
    return new Response(JSON.stringify({
      error: "Failed to process agent request",
      success: false,
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const GET = async ({ locals, url }) => {
  try {
    console.log("GET request to mybonzo agent");
    console.log("locals:", typeof locals, Object.keys(locals || {}));
    console.log("locals.runtime:", typeof locals?.runtime, Object.keys(locals?.runtime || {}));
    console.log("locals.runtime.env:", typeof locals?.runtime?.env, Object.keys(locals?.runtime?.env || {}));
    const action = url.searchParams.get("action");
    const agentId = url.searchParams.get("id") || "default";
    if (action === "status") {
      return new Response(JSON.stringify({
        success: true,
        status: "online (mock)",
        lastActivity: (/* @__PURE__ */ new Date()).toISOString(),
        stats: {
          messagesCount: 5,
          imagesGenerated: 2,
          tasksCompleted: 3
        },
        conversationLength: 5
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "🤖 MyBonzo Agent API (Mock)",
      status: "online (mock)",
      endpoints: ["chat", "status", "task", "image"],
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: "cloudflare_pages_mock",
      debug: {
        hasLocals: !!locals,
        hasRuntime: !!locals?.runtime,
        hasEnv: !!locals?.runtime?.env,
        localsKeys: Object.keys(locals || {}),
        runtimeKeys: Object.keys(locals?.runtime || {}),
        envKeys: Object.keys(locals?.runtime?.env || {})
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    const err = error;
    console.error("MyBonzo Agent GET Error:", error);
    console.error("Error details:", {
      message: err?.message,
      stack: err?.stack,
      type: typeof error
    });
    return new Response(JSON.stringify({
      error: "Agent GET request failed",
      status: "error",
      success: false,
      debug: {
        errorMessage: err?.message,
        errorType: typeof error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = () => {
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
