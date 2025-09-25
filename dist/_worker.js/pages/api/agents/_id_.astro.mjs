globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_iO87Dm24.mjs';

const GET = async ({ params, locals }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Brak ID agenta" }), { status: 400 });
  }
  try {
    const kv = locals.runtime.env.KNOWLEDGE_BASE;
    const agentKey = `agent:${id}`;
    const agentData = await kv.get(agentKey);
    if (!agentData) {
      return new Response(JSON.stringify({ error: "Nie znaleziono agenta" }), { status: 404 });
    }
    return new Response(agentData, {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania agenta ${id}:`, error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
