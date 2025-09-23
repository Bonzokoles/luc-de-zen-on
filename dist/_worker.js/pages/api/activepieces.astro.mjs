globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

async function POST({ request, locals }) {
  try {
    const inputData = await request.json();
    
    // Dostęp do sekretów Cloudflare przez locals.runtime.env
    const env = locals.runtime.env;
    const ACTIVEPIECES_API_URL = env.ACTIVEPIECES_API_URL || 'https://your-activepieces-instance.com/api/v1/flows/your-flow-id/run';
    const ACTIVEPIECES_API_TOKEN = env.ACTIVEPIECES_API_TOKEN;

    // Sprawdzamy czy mamy wymagane credentiale
    if (!ACTIVEPIECES_API_TOKEN) {
      console.warn('ActivePieces: Brak API token - używam fallback response');
      return createSuccessResponse({
        success: true,
        message: 'ActivePieces workflow simulation - token not configured',
        data: {
          flowId: 'demo-flow',
          status: 'simulated',
          result: 'Workflow would execute here with proper credentials',
          timestamp: new Date().toISOString(),
          inputReceived: inputData
        }
      });
    }

    const response = await fetch(ACTIVEPIECES_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACTIVEPIECES_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ActivePieces API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return createSuccessResponse({
      success: true,
      data: data,
      message: 'ActivePieces workflow executed successfully'
    });

  } catch (error) {
    console.error('ActivePieces API Error:', error);
    return createErrorResponse(error.message, 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
