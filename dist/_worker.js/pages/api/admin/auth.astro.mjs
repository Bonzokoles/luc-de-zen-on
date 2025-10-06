globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { password } = body;
    if (!password) {
      return createErrorResponse("Hasło jest wymagane", 400);
    }
    const adminPassword = locals.runtime?.env?.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "HAOS77";
    if (password === adminPassword) {
      const sessionToken = btoa(`admin-${Date.now()}-${Math.random()}`);
      return createSuccessResponse({
        authenticated: true,
        sessionToken,
        message: "Autoryzacja pomyślna"
      });
    } else {
      return createErrorResponse("Nieprawidłowe hasło", 401);
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return createErrorResponse("Błąd serwera", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
