import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  interface CreateAgentRequest {
    name: string;
    prompt: string;
    model: string;
  }

  interface Env {
    KNOWLEDGE_BASE: KVNamespace;
  }

  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: "Brak autoryzacji" }), {
      status: 401,
    });
  }

  try {
    const { name, prompt, model } = await request.json() as CreateAgentRequest;

    if (!name || !prompt || !model) {
      return new Response(
        JSON.stringify({
          error: "Brak wszystkich wymaganych pól: name, prompt, model",
        }),
        {
          status: 400,
        }
      );
    }

    const env = (locals as any).runtime?.env as Env;
    const kv = env?.KNOWLEDGE_BASE;

    if (!kv) {
        return new Response(JSON.stringify({ error: "KNOWLEDGE_BASE not configured" }), { status: 500 });
    }

    const agentKey = `agent:${name.replace(/\s+/g, "-").toLowerCase()}`;

    const existingAgent = await kv.get(agentKey);
    if (existingAgent) {
      return new Response(
        JSON.stringify({ error: `Agent o nazwie \"${name}\" już istnieje.` }),
        {
          status: 409, // Conflict
        }
      );
    }

    const agentConfig = {
      name,
      prompt,
      model,
      createdAt: new Date().toISOString(),
    };

    await kv.put(agentKey, JSON.stringify(agentConfig));

    return new Response(JSON.stringify({ success: true, agentKey }), {
      status: 201,
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia agenta:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera." }), {
      status: 500,
    });
  }
};
