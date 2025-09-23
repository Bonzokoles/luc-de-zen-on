globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

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
const GET = () => {
  const bielikStats = {
    total_requests: 2847,
    requests_last_24h: 156,
    requests_last_7d: 892,
    avg_response_time: 1243,
    success_rate: 98.7,
    model_versions: {
      "bielik-7b-instruct": { requests: 1825, avg_tokens: 342 },
      "bielik-13b-instruct": { requests: 721, avg_tokens: 487 },
      "bielik-70b-instruct": { requests: 301, avg_tokens: 612 }
    },
    top_use_cases: [
      { name: "Odpowiedzi na pytania", count: 1247, percentage: 43.8 },
      { name: "Tłumaczenia", count: 542, percentage: 19 },
      { name: "Analiza tekstu", count: 398, percentage: 14 },
      { name: "Zadania programistyczne", count: 287, percentage: 10.1 },
      { name: "Kreatywne pisanie", count: 189, percentage: 6.6 },
      { name: "Inne", count: 184, percentage: 6.5 }
    ],
    language_stats: {
      polish: 89.3,
      english: 8.7,
      mixed: 2
    },
    total_tokens: 1247832,
    tokens_last_24h: 67234,
    error_rate: 1.3,
    active_users_24h: 89,
    worker_status: "active",
    last_updated: (/* @__PURE__ */ new Date()).toISOString()
  };
  return new Response(JSON.stringify(bielikStats), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
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
