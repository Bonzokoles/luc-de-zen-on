globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const GET = async ({ locals }) => {
  try {
    const env = locals.runtime.env;
    if (!env.AGENTS) {
      return new Response(JSON.stringify({
        error: "KV storage AGENTS nie jest dostępny",
        agents: []
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const keys = await env.AGENTS.list();
    const agents = await Promise.all(keys.keys.map(async (key) => {
      const value = await env.AGENTS.get(key.name);
      return value ? JSON.parse(value) : null;
    }));
    return new Response(JSON.stringify(agents.filter(Boolean)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Agents API Error:", error);
    return new Response(JSON.stringify({
      error: "Nie można pobrać agentów",
      agents: []
    }), {
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
