globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

async function GET() {
  const queries = [
    {
      id: 1,
      user: "Jan Kowalski",
      text: "Jak działa funkcja personalizowanych rekomendacji?",
      date: new Date(Date.now() - 3e5).toISOString(),
      status: "pending"
    },
    {
      id: 2,
      user: "Anna Nowak",
      text: "Problem z logowaniem do systemu AI",
      date: new Date(Date.now() - 6e5).toISOString(),
      status: "resolved"
    },
    {
      id: 3,
      user: "Piotr Wiśniewski",
      text: "Prośba o zwiększenie limitów API",
      date: new Date(Date.now() - 9e5).toISOString(),
      status: "in_progress"
    },
    {
      id: 4,
      user: "Maria Kowalczyk",
      text: "Błąd w generatorze treści marketingowych",
      date: new Date(Date.now() - 12e5).toISOString(),
      status: "pending"
    }
  ];
  return new Response(JSON.stringify(queries), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
