import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Real logic: return current system time as status
    return new Response(JSON.stringify({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
      agent: 'POLACZEK_D1'
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
