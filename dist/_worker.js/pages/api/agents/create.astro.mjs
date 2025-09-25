globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { name, prompt, model } = body;
    if (!name || !prompt || !model) {
      return new Response(JSON.stringify({ error: "Brak wszystkich wymaganych pól: name, prompt, model" }), {
        status: 400
      });
    }
    const kv = locals.runtime.env.KNOWLEDGE_BASE;
    const agentKey = `agent:${name.replace(/\s+/g, "-").toLowerCase()}`;
    const existingAgent = await kv.get(agentKey);
    if (existingAgent) {
      return new Response(JSON.stringify({ error: `Agent o nazwie "${name}" już istnieje.` }), {
        status: 409
        // Conflict
      });
    }
    const agentConfig = {
      name,
      prompt,
      model,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await kv.put(agentKey, JSON.stringify(agentConfig));
    return new Response(JSON.stringify({ success: true, agentKey }), { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia agenta:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
