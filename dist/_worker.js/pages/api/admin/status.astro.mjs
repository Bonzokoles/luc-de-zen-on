globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
export { r as renderers } from '../../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

async function GET({ request }) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.includes("HAOS77")) {
    return json({ services: [], system: { mode: "demo" } });
  }
  const services = [
    { name: "API Gateway", status: "online", responseTime: 42 },
    { name: "Workers Manager", status: "online", responseTime: 57 },
    { name: "Image Service", status: "degraded", responseTime: 180 }
  ];
  const system = {
    env: "local",
    version: "1.0.0",
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  return json({ services, system });
}
function json(body, init) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
    ...init
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
