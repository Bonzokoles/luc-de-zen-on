globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { user_message, system_prompt, model } = body;
    if (!user_message || !system_prompt || !model) {
      return new Response(JSON.stringify({ error: "Brak wymaganych pól: user_message, system_prompt, model" }), {
        status: 400
      });
    }
    const ai = locals.runtime.env.AI;
    const messages = [
      { role: "system", content: system_prompt },
      { role: "user", content: user_message }
    ];
    const inputs = {
      messages
    };
    const response = await ai.run(model, inputs);
    return new Response(JSON.stringify({ answer: response.response }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Błąd w generic-chat API:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera podczas generowania odpowiedzi AI." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
