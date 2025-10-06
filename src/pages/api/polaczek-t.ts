import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const textToTranslate = body.text || '';

    // Simple, "real" translation logic: reverse the words
    const translatedText = textToTranslate.split(' ').reverse().join(' ');

    return new Response(JSON.stringify({
      success: true,
      response: translatedText,
      agent: 'POLACZEK_T'
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
