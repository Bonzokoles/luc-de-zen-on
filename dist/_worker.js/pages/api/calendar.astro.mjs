globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const env = false ? process.env : locals?.runtime?.env || {};
    const cloudFunctionUrl = env.GCP_CALENDAR_URL || "https://your-region-your-project.cloudfunctions.net/calendar";
    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GCP_FUNCTION_TOKEN || ""}`
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`Cloud function error: ${response.status}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Calendar service unavailable",
      fallback: true
    }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
