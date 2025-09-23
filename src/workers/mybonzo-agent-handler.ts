import { getAgentByName, routeAgentRequest } from "agents";
import MyBonzoAgent from "./mybonzo-agent-working";

export default {
  async fetch(request: Request, env: Cloudflare.Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Automatyczne routowanie Cloudflare Agents
      if (url.pathname.startsWith("/agents/")) {
        const agentResponse = await routeAgentRequest(request, env);
        if (agentResponse) {
          // Dodaj CORS headers
          Object.entries(corsHeaders).forEach(([key, value]) => {
            agentResponse.headers.set(key, value);
          });
          return agentResponse;
        }
      }

      // 2. API endpoint dla bezpośredniego dostępu do agenta
      if (url.pathname === "/api/mybonzo-chat" && request.method === "POST") {
        const { agentId, message, model } = await request.json();
        
        // Pobierz lub stwórz agenta
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        // Wywołaj metodę chat
        const response = await agent.chat(message, model);
        
        return Response.json(response, { headers: corsHeaders });
      }

      // 3. Status agenta
      if (url.pathname === "/api/mybonzo-status" && request.method === "GET") {
        const agentId = url.searchParams.get("id") || "default";
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId);
        const agent = await agentStub;
        
        const status = await agent.getStatus();
        return Response.json(status, { headers: corsHeaders });
      }

      // 4. Generowanie obrazów
      if (url.pathname === "/api/mybonzo-image" && request.method === "POST") {
        const { agentId, prompt, style } = await request.json();
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        const result = await agent.generateImage(prompt, style);
        return Response.json(result, { headers: corsHeaders });
      }

      // 5. Wykonanie zadania
      if (url.pathname === "/api/mybonzo-task" && request.method === "POST") {
        const { agentId, taskType, taskData } = await request.json();
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        const result = await agent.executeTask(taskType, taskData);
        return Response.json(result, { headers: corsHeaders });
      }

      // 6. Analiza tekstu
      if (url.pathname === "/api/mybonzo-analyze" && request.method === "POST") {
        const { agentId, text } = await request.json();
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        const result = await agent.analyzeText(text);
        return Response.json(result, { headers: corsHeaders });
      }

      // 7. Ustawienia agenta
      if (url.pathname === "/api/mybonzo-preferences" && request.method === "POST") {
        const { agentId, preferences } = await request.json();
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        const result = await agent.updatePreferences(preferences);
        return Response.json(result, { headers: corsHeaders });
      }

      // 8. Wyczyść historię
      if (url.pathname === "/api/mybonzo-clear" && request.method === "POST") {
        const { agentId } = await request.json();
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        const result = await agent.clearHistory();
        return Response.json(result, { headers: corsHeaders });
      }

      // 9. Zapisz agenta
      if (url.pathname === "/api/mybonzo-save" && request.method === "POST") {
        const { agentId } = await request.json();
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId || "default");
        const agent = await agentStub;
        
        const result = await agent.saveToKV();
        return Response.json(result, { headers: corsHeaders });
      }

      // 10. Dokumentacja API
      if (url.pathname === "/api/mybonzo-docs" || url.pathname === "/") {
        const docs = {
          name: "MyBonzo Agent API",
          version: "1.0.0",
          description: "🤖 Cloudflare Agents API dla MyBonzo Assistant",
          endpoints: {
            "POST /api/mybonzo-chat": "Rozmowa z agentem",
            "GET /api/mybonzo-status": "Status agenta",
            "POST /api/mybonzo-image": "Generowanie obrazów",
            "POST /api/mybonzo-task": "Wykonanie zadania",
            "POST /api/mybonzo-analyze": "Analiza tekstu",
            "POST /api/mybonzo-preferences": "Ustawienia agenta",
            "POST /api/mybonzo-clear": "Wyczyść historię",
            "POST /api/mybonzo-save": "Zapisz agenta"
          },
          agentClient: "/agents/mybonzo-agent/{agentId}",
          timestamp: new Date().toISOString()
        };
        
        return Response.json(docs, { headers: corsHeaders });
      }

      return Response.json(
        { error: "Endpoint not found" }, 
        { status: 404, headers: corsHeaders }
      );

    } catch (error) {
      console.error("Worker error:", error);
      return Response.json(
        { error: "Internal server error", details: String(error) },
        { status: 500, headers: corsHeaders }
      );
    }
  }
} satisfies ExportedHandler<Cloudflare.Env>;
