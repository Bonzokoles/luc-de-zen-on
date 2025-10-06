globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

async function GET() {
  return new Response(JSON.stringify({
    status: "online",
    workers: {
      "ai-bot": "active",
      "image-generator": "active",
      "agents-api": "active"
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  HEAD
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
