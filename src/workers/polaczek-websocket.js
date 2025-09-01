// WebSocket Proxy Worker for POLACZEK_T Agent
// Handles WebSocket connections and forwards to Python agent

const WEBSOCKET_HEADERS = {
  "Upgrade": "websocket", 
  "Connection": "Upgrade",
  "Sec-WebSocket-Accept": "",
  "Sec-WebSocket-Version": "13"
};

// Store active connections
let connections = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle CORS for WebSocket upgrade requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Sec-WebSocket-Protocol",
        }
      });
    }

    // WebSocket upgrade request
    if (request.headers.get("Upgrade") === "websocket") {
      return handleWebSocket(request, env);
    }
    
    // Regular HTTP endpoints
    if (url.pathname === "/api/polaczek/status") {
      return handleStatus();
    }
    
    if (url.pathname === "/api/polaczek/connect") {
      return handleConnect(request);
    }

    return new Response("POLACZEK_T WebSocket Proxy Worker", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }
};

async function handleWebSocket(request, env) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  
  const clientId = crypto.randomUUID();
  connections.set(clientId, {
    socket: server,
    connected: true,
    lastActivity: Date.now()
  });

  server.accept();
  
  // Forward messages to Python agent
  server.addEventListener("message", async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received from client:", data);
      
      // Process different commands
      switch (data.command) {
        case "get_status":
          server.send(JSON.stringify({
            type: "status",
            status: "ready",
            tasks_completed: 0,
            connected_clients: connections.size,
            last_activity: new Date().toISOString()
          }));
          break;
          
        case "translate_text":
          // Simulate translation - in real implementation, forward to Python agent
          const result = await simulateTranslation(data.text, data.target_lang || "pl");
          server.send(JSON.stringify({
            type: "translation", 
            result: result,
            original: data.text,
            target_language: data.target_lang || "pl"
          }));
          break;
          
        case "ask_help":
          const answer = await simulateHelp(data.question);
          server.send(JSON.stringify({
            type: "answer",
            response: answer,
            question: data.question,
            timestamp: new Date().toISOString()
          }));
          break;
          
        case "get_system_info":
          server.send(JSON.stringify({
            type: "system_info",
            data: {
              agent_name: "POLACZEK_T",
              status: "ready",
              capabilities: ["translation", "context_qa", "function_help", "system_status", "ai_assistance"],
              platform_info: {
                name: "LUC DE ZEN ON AI Platform",
                version: "1.0.0", 
                framework: "Cloudflare Workers + WebSocket"
              }
            }
          }));
          break;
          
        default:
          server.send(JSON.stringify({
            type: "error",
            message: `Unknown command: ${data.command}`,
            available_commands: ["get_status", "translate_text", "ask_help", "get_system_info"]
          }));
      }
    } catch (error) {
      console.error("Error processing message:", error);
      server.send(JSON.stringify({
        type: "error",
        message: error.message || "Unknown error occurred"
      }));
    }
  });

  server.addEventListener("close", () => {
    connections.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });

  // Send welcome message
  server.send(JSON.stringify({
    type: "welcome",
    message: "Połączono z POLACZEK_T - AI Assistant (Cloudflare Workers)",
    capabilities: ["translation", "context_qa", "function_help", "system_status", "ai_assistance"],
    status: "ready"
  }));

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function simulateTranslation(text, targetLang) {
  // Simulate translation - replace with actual AI service call
  const translations = {
    "pl": `[PL Cloudflare]: ${text}`,
    "en": `[EN Cloudflare]: ${text}`, 
    "de": `[DE Cloudflare]: ${text}`,
    "fr": `[FR Cloudflare]: ${text}`,
    "es": `[ES Cloudflare]: ${text}`
  };
  return translations[targetLang] || `[${targetLang.toUpperCase()}]: ${text}`;
}

async function simulateHelp(question) {
  const responses = {
    "help": "Dostępne komendy: 'system status', 'ai workers', 'translation', 'agents'. Działa przez Cloudflare Workers!",
    "system status": `System aktywny przez Cloudflare Workers. Połączeni klienci: ${connections.size}`,
    "ai workers": "Workers: Generator Obrazów (Flux), Chatbot (GPT), Analytics, Kaggle, Search, Monitor - wszystko przez Cloudflare!",
    "translation": "Obsługuję tłumaczenia: pl, en, de, fr, es. Użyj komendy translate_text przez WebSocket.",
    "agents": "Dostępne agenty: POLACZEK_T (Translation), POLACZEK_AI (Art), POLACZEK_S1/S2 (Search) - działają przez Workers!"
  };
  
  const qNorm = question.toLowerCase().trim();
  for (const [key, response] of Object.entries(responses)) {
    if (key === qNorm || key.split(" ").some(word => qNorm.includes(word))) {
      return response;
    }
  }
  
  return `Pytanie: "${question}" - uczę się odpowiadać! Spróbuj: help, system status, ai workers, translation, agents.`;
}

async function handleStatus() {
  return new Response(JSON.stringify({
    status: "ready",
    agent: "POLACZEK_T", 
    platform: "Cloudflare Workers",
    connected_clients: connections.size,
    capabilities: ["translation", "context_qa", "function_help", "system_status", "ai_assistance"]
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

async function handleConnect(request) {
  return new Response(JSON.stringify({
    message: "Use WebSocket upgrade to connect",
    websocket_url: "wss://your-worker-domain.workers.dev",
    status: "ready"
  }), {
    headers: {
      "Content-Type": "application/json", 
      "Access-Control-Allow-Origin": "*"
    }
  });
}