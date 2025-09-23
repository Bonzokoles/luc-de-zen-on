import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Brak ID agenta' }), { status: 400 });
  }

  try {
    const kv = locals.runtime.env.KNOWLEDGE_BASE;
    const agentKey = `agent:${id}`;

    const agentData = await kv.get(agentKey);

    if (!agentData) {
      return new Response(JSON.stringify({ error: 'Nie znaleziono agenta' }), { status: 404 });
    }

    return new Response(agentData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`Błąd podczas pobierania agenta ${id}:`, error);
    return new Response(JSON.stringify({ error: 'Wystąpił błąd serwera.' }), { status: 500 });
  }
};
