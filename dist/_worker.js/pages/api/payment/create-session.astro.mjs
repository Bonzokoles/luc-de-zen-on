globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const POST = async ({ request }) => {
  try {
    const paymentData = await request.json();
    console.log("Payment session request:", paymentData);
    const sessionId = "session_" + Date.now() + Math.random().toString(36).substr(2, 9);
    const mockPaymentUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    if (request.headers.get("host")?.includes("localhost")) {
      return new Response(JSON.stringify({
        success: true,
        sessionId,
        paymentUrl: `/payment-simulator?session=${sessionId}&data=${encodeURIComponent(JSON.stringify(paymentData))}`,
        expiresAt: Date.now() + 30 * 60 * 1e3
        // 30 minut
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const paymentSession = await createStripeSession(paymentData);
    return new Response(JSON.stringify({
      success: true,
      sessionId: paymentSession.id,
      paymentUrl: paymentSession.url,
      expiresAt: paymentSession.expires_at
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Payment session error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to create payment session"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
async function createStripeSession(paymentData) {
  return {
    id: "cs_test_" + Date.now(),
    url: "https://checkout.stripe.com/test-session",
    expires_at: Date.now() + 30 * 60 * 1e3
  };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
