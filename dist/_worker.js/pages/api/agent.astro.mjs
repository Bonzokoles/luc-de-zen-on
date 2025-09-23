globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const GET = async ({ url, locals }) => {
  try {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Agent ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const env = locals.runtime.env;
    if (!env.AGENTS) {
      return new Response(JSON.stringify({ error: "KV storage not available" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const agentData = await env.AGENTS.get(id);
    if (!agentData) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(agentData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Agent Fetch API Error:", error);
    return new Response(JSON.stringify({ error: "Agent not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const env = locals.runtime.env;
    if (!env.AGENTS) {
      return new Response(JSON.stringify({ error: "KV storage not available" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!body.id) {
      return new Response(JSON.stringify({ error: "Agent ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.AGENTS.put(body.id, JSON.stringify(body));
    return new Response(JSON.stringify({ success: true, agent: body }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Agent Save API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to save agent" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
