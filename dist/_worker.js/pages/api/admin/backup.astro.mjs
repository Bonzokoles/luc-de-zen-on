globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const inMemoryBackups = [];
const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return createSuccessResponse({ backups: inMemoryBackups, demoAuth: false });
    }
    return createSuccessResponse({ backups: inMemoryBackups, demoAuth: token === "HAOS77" });
  } catch (e) {
    console.error("backup GET error", e);
    return createErrorResponse("Failed to list backups", 500);
  }
};
const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== "HAOS77") {
      return createErrorResponse("Unauthorized", 401);
    }
    const { action, reason } = await request.json();
    if (action !== "create") {
      return createErrorResponse("Invalid action", 400);
    }
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const name = `backup_${stamp}${reason ? "_" + reason : ""}.zip`;
    const entry = { name, date: (/* @__PURE__ */ new Date()).toISOString(), age: "Active" };
    inMemoryBackups.unshift(entry);
    if (inMemoryBackups.length > 5) inMemoryBackups.pop();
    return createSuccessResponse({ status: "created", backup: entry });
  } catch (e) {
    console.error("backup POST error", e);
    return createErrorResponse("Failed to create backup", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
