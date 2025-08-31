interface PromptRequest {
  prompt: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Only POST is allowed', { status: 405 });
    }
    try {
      const { prompt } = await request.json<PromptRequest>();

      const answer = `Odpowiedź na Twoje pytanie: '${prompt}'`;

      return new Response(JSON.stringify({ answer }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      const error = e as Error;
      return new Response('Error: ' + error.message, { status: 500 });
    }
  }
}