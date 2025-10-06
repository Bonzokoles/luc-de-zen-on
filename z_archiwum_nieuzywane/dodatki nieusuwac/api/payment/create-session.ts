import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const paymentData = await request.json();
    
    console.log('Payment session request:', paymentData);

    // Symulacja integracji z Stripe lub PayU
    const sessionId = 'session_' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // W prawdziwej implementacji tutaj byłoby:
    // - Stripe.checkout.sessions.create() lub
    // - PayU API call
    
    const mockPaymentUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    
    // Dla development - zwracamy lokalny URL
    if (request.headers.get('host')?.includes('localhost')) {
      return new Response(JSON.stringify({
        success: true,
        sessionId: sessionId,
        paymentUrl: `/payment-simulator?session=${sessionId}&data=${encodeURIComponent(JSON.stringify(paymentData))}`,
        expiresAt: Date.now() + (30 * 60 * 1000) // 30 minut
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Production payment integration
    const paymentSession = await createStripeSession(paymentData);
    
    return new Response(JSON.stringify({
      success: true,
      sessionId: paymentSession.id,
      paymentUrl: paymentSession.url,
      expiresAt: paymentSession.expires_at
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Payment session error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create payment session'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

async function createStripeSession(paymentData: any) {
  // Mock Stripe integration
  // W prawdziwej implementacji:
  /*
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: paymentData.package?.currency || 'pln',
        product_data: {
          name: paymentData.package?.name || paymentData.worker?.name,
          description: getPaymentDescription(paymentData)
        },
        unit_amount: (paymentData.package?.price || paymentData.totalAmount) * 100
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: paymentData.redirectUrl,
    cancel_url: paymentData.cancelUrl,
    metadata: {
      userId: paymentData.userId,
      type: paymentData.mode,
      workerType: paymentData.worker?.type || '',
      packageType: paymentData.package?.type || ''
    }
  });
  
  return session;
  */
  
  return {
    id: 'cs_test_' + Date.now(),
    url: 'https://checkout.stripe.com/test-session',
    expires_at: Date.now() + (30 * 60 * 1000)
  };
}

function getPaymentDescription(paymentData: any): string {
  if (paymentData.mode === 'package-purchase') {
    const tokens = Object.entries(paymentData.package.tokens)
      .map(([key, value]) => `${value} ${key}`)
      .join(', ');
    return `Token package: ${tokens}`;
  } else if (paymentData.mode === 'worker-tokens') {
    return `Tokens for ${paymentData.worker.name}`;
  } else {
    return 'AI Workers Platform purchase';
  }
}
