import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  // Check for authorization (placeholder)
  // In a real app, you'd verify a JWT or session cookie.
  const isAuthenticated = true; // Replace with real auth check

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, prompt, model } = body;

    if (!name || !prompt || !model) {
      return new Response(JSON.stringify({ error: 'Brak wszystkich wymaganych pól: name, prompt, model' }), {
        status: 400,
      });
    }

    // Access the KV store via Astro's locals
    const kv = locals.runtime.env.KNOWLEDGE_BASE;
    
    // The key for the agent in the KV store
    const agentKey = `agent:${name.replace(/\s+/g, '-').toLowerCase()}`;

    // Check if agent already exists
    const existingAgent = await kv.get(agentKey);
    if (existingAgent) {
        return new Response(JSON.stringify({ error: `Agent o nazwie \"${name}\" już istnieje.` }), {
            status: 409, // Conflict
        });
    }

    const agentConfig = {
      name,
      prompt,
      model,
      createdAt: new Date().toISOString(),
    };

    // Save the agent configuration to the KV store
    await kv.put(agentKey, JSON.stringify(agentConfig));

    return new Response(JSON.stringify({ success: true, agentKey }), { status: 201 });

  } catch (error) {
    console.error('Błąd podczas tworzenia agenta:', error);
    return new Response(JSON.stringify({ error: 'Wystąpił błąd serwera.' }), { status: 500 });
  }
};
