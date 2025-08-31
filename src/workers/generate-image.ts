interface PromptRequest {
  prompt: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if(request.method !== "POST") return new Response("Only POST", {status:405});
    const { prompt } = await request.json<PromptRequest>();

    // Wywołanie Workers AI modelu generującego obraz
    const result = await env.AI.run(env.IMAGE_MODEL, { prompt });

    // Zwróć wygenerowany obraz (lub URL)
    return new Response(JSON.stringify({ imageUrl: result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}