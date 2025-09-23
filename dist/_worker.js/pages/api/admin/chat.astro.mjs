globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, a as renderTemplate } from '../../../chunks/astro/server_BDhFni3J.mjs';
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro = createAstro("https://mybonzo.com");
const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request, locals }) => {
  try {
    const { message, model, mode, history } = await request.json();
    if (!message || !model) {
      return createErrorResponse("Brak wymaganych parametr\u0102\u0142w: message, model", 400);
    }
    const adminMode = mode || "general";
    const systemPrompt = ADMIN_SYSTEM_PROMPTS[adminMode] || ADMIN_SYSTEM_PROMPTS.general;
    const ai = locals.runtime.env.AI;
    if (!ai) {
      return createErrorResponse("AI binding nie jest dost\xC4\u2122pne", 500);
    }
    const messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      messages.push(...recentHistory);
    }
    messages.push({
      role: "user",
      content: message
    });
    const response = await ai.run(model, {
      messages,
      temperature: 0.7,
      max_tokens: 2e3
    });
    if (!response || !response.response) {
      return createErrorResponse("Brak odpowiedzi z modelu AI", 500);
    }
    return createSuccessResponse({
      response: response.response,
      model,
      mode: adminMode,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Admin Chat API Error:", error);
    if (error.message?.includes("model")) {
      return createErrorResponse(`B\u0139\u201A\xC4\u2026d modelu AI: ${error.message}`, 422);
    }
    if (error.message?.includes("rate limit")) {
      return createErrorResponse("Przekroczono limit zapyta\u0139\u201E. Spr\u0102\u0142buj ponownie za chwil\xC4\u2122.", 429);
    }
    return createErrorResponse(`B\u0139\u201A\xC4\u2026d wewn\xC4\u2122trzny: ${error.message}`, 500);
  }
};
const $$Chat = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Chat;
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api/admin/chat.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api/admin/chat.astro";
const $$url = "/api/admin/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
    POST,
    default: $$Chat,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
