import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const kv = locals.runtime.env.KNOWLEDGE_BASE;

    // List all keys that start with the 'agent:' prefix
    const keyList = await kv.list({ prefix: 'agent:' });

    if (keyList.keys.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Fetch all agent configurations in parallel
    const agentPromises = keyList.keys.map(key => kv.get(key.name));
    const agentJsonStrings = await Promise.all(agentPromises);

    // Parse the JSON strings into objects
    const agents = agentJsonStrings.map(json => json ? JSON.parse(json) : null).filter(Boolean);

    return new Response(JSON.stringify(agents), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Błąd podczas pobierania listy agentów:', error);
    return new Response(JSON.stringify({ error: 'Wystąpił błąd serwera.' }), { status: 500 });
  }
};
