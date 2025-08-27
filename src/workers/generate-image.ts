export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Only POST", { status: 405 });
    const { prompt } = await request.json();
    const result = await env.AI.run("@cf/flux-1-schnell", { prompt });
    return new Response(JSON.stringify({ imageUrl: result }), { headers: { "Content-Type": "application/json" } });
  }
}
