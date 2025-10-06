import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const musicRequest = body.request || 'unknown';

    // Real logic: confirm the action
    return new Response(JSON.stringify({
      success: true,
      status: 'acknowledged',
      message: `Music command '${musicRequest}' received and is being processed.`,
      agent: 'POLACZEK_M1'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
