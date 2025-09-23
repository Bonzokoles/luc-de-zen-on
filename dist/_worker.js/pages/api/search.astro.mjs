globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createOPTIONSHandler, a as createSuccessResponse } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
import { c as createOPTIONSHandler, a as createSuccessResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const GET = async () => {
  return createSuccessResponse({
    message: "Search API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { query: "search terms" }'
  });
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const POST = async ({ request }) => {
  const { query } = await request.json();
  const mockResults = [
    { url: "#", title: `Wynik 1 dla zapytania: "${query}"` },
    { url: "#", title: `Wynik 2: Jak Bielik może pomóc z "${query}"` },
    { url: "#", title: `Wynik 3: Zaawansowane techniki dotyczące "${query}"` }
  ];
  await new Promise((res) => setTimeout(res, 500));
  return new Response(JSON.stringify(mockResults), {
    headers: { "Content-Type": "application/json" }
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
