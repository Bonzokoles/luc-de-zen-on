/**
 * CHUCK Proxy - Cloudflare Worker
 * 
 * Secure bridge to CHUCK tunnel with:
 * - Email authentication via Supabase
 * - Rate limiting using KV storage
 * - Proxy to CHUCK tunnel (cloudflared)
 */

// Environment bindings (configured in wrangler.toml)
// - SUPABASE_URL: Supabase project URL
// - SUPABASE_ANON_KEY: Supabase anonymous key
// - CHUCK_RATE_LIMIT: KV namespace for rate limiting
// - CHUCK_TUNNEL_URL: Cloudflared tunnel URL (REQUIRED - must be set in production)

const RATE_LIMIT_WINDOW = 60; // 60 seconds
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per user

/**
 * CORS headers
 */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * Verify email authentication via Supabase
 */
async function verifyAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.substring(7);

  try {
    // Verify JWT with Supabase
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': env.SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      return { valid: false, error: 'Invalid authentication token' };
    }

    const user = await response.json();
    
    if (!user.email) {
      return { valid: false, error: 'User email not found' };
    }

    return { 
      valid: true, 
      email: user.email,
      userId: user.id,
    };
  } catch (error) {
    return { 
      valid: false, 
      error: `Authentication error: ${error.message}` 
    };
  }
}

/**
 * Check and update rate limit
 * 
 * NOTE: This implementation stores all request timestamps in an array.
 * For high-traffic scenarios (>1000 req/min per user), consider using:
 * - A simple counter with TTL (less precise but more efficient)
 * - Durable Objects for distributed rate limiting
 * - Token bucket algorithm with atomic operations
 */
async function checkRateLimit(userId, env) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Get current request count from KV
  const key = `rate_limit:${userId}`;
  const data = await env.CHUCK_RATE_LIMIT.get(key, { type: 'json' });
  
  let requests = [];
  
  if (data && data.requests) {
    // Filter out old requests outside the window
    requests = data.requests.filter(timestamp => timestamp > windowStart);
  }
  
  // Check if limit exceeded
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestRequest = Math.min(...requests);
    const retryAfter = RATE_LIMIT_WINDOW - (now - oldestRequest);
    
    return {
      allowed: false,
      retryAfter,
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: 0,
    };
  }
  
  // Add current request
  requests.push(now);
  
  // Store updated count
  await env.CHUCK_RATE_LIMIT.put(
    key,
    JSON.stringify({ requests }),
    { expirationTtl: RATE_LIMIT_WINDOW * 2 }
  );
  
  return {
    allowed: true,
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining: RATE_LIMIT_MAX_REQUESTS - requests.length,
    reset: now + RATE_LIMIT_WINDOW,
  };
}

/**
 * Proxy request to CHUCK tunnel
 */
async function proxyToChuck(request, env) {
  const url = new URL(request.url);
  
  // CHUCK_TUNNEL_URL is required in production (Workers cannot access localhost)
  if (!env.CHUCK_TUNNEL_URL) {
    throw new Error('CHUCK_TUNNEL_URL environment variable is required');
  }
  
  const chuckUrl = env.CHUCK_TUNNEL_URL;
  
  // Forward to CHUCK API
  const targetUrl = `${chuckUrl}/api/exec`;
  
  try {
    const body = await request.text();
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || 'unknown',
        'X-Forwarded-Proto': url.protocol.replace(':', ''),
        'X-Original-URL': request.url,
      },
      body: body || undefined,
    });

    // Clone response with CORS headers
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders()).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'CHUCK tunnel error',
        message: error.message,
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({ 
          status: 'healthy', 
          service: 'chuck-proxy',
          version: '1.0.0',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // CHUCK execution endpoint
    if (url.pathname === '/chuck/exec' && request.method === 'POST') {
      // Verify authentication
      const auth = await verifyAuth(request, env);
      
      if (!auth.valid) {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication failed',
            message: auth.error,
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(),
            },
          }
        );
      }

      // Check rate limit
      const rateLimit = await checkRateLimit(auth.userId, env);
      
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            limit: rateLimit.limit,
            retryAfter: rateLimit.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(rateLimit.retryAfter),
              'X-RateLimit-Limit': String(rateLimit.limit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(rateLimit.reset),
              ...corsHeaders(),
            },
          }
        );
      }

      // Proxy to CHUCK
      const response = await proxyToChuck(request, env);
      
      // Add rate limit headers to successful responses
      const headers = new Headers(response.headers);
      headers.set('X-RateLimit-Limit', String(rateLimit.limit));
      headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
      headers.set('X-RateLimit-Reset', String(rateLimit.reset));
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  },
};
