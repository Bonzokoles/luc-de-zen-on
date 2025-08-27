export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/agents") {
      const keys = await env.AGENTS.list();
      const agents = await Promise.all(keys.keys.map(async (key: any) => {
        const value = await env.AGENTS.get(key.name);
        return value ? JSON.parse(value) : null;
      }));
      return new Response(JSON.stringify(agents.filter(Boolean)), { headers: { "Content-Type": "application/json" } });
    }
    if (request.method === "POST" && url.pathname === "/api/agent") {
      const data: any = await request.json();
      await env.AGENTS.put(data.id, JSON.stringify(data));
      return new Response("OK");
    }
    return new Response("Not found", { status: 404 });
  }
}
