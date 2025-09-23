<<<<<<< HEAD
import { createErrorResponse, createSuccessResponse } from './corsUtils'; import { createErrorResponse, createSuccessResponse } from './corsUtils';/**



export async function handleAPIRequest( * Enhanced API Utilities for MyBonzo Platform

  request: Request,

  handler: (req: Request) => Promise<Response>,export async function handleAPIRequest( * Centralized handling for API operations, rate limiting, caching, and monitoring

  errorContext?: string

): Promise<Response> {  request: Request, */

try {

    if (request.method === 'OPTIONS') {
        handler: (req: Request) => Promise<Response>,

      return new Response(null, {

            status: 200, errorContext?: stringexport interface APIRequest {

            headers: {

                'Access-Control-Allow-Origin': '*',): Promise < Response > {
                    method: string;

                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',

                    'Access-Control-Allow-Headers': 'Content-Type, Authorization', try {
                        url: string;

                    },

                }); if (request.method === 'OPTIONS') {
                    body ?: any;

                }

        return new Response(null, {
            headers?: Record<string, string>;

            return await handler(request);

        } catch (error) {
            status: 200, timestamp: number;

            console.error(`API Error${errorContext ? ` (${errorContext})` : ''}:`, error);

            headers: {
                userAgent ?: string;

                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

                'Access-Control-Allow-Origin': '*', ip ?: string;

                return createErrorResponse(

                    errorMessage, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',}

            500,

            {
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',

                context: errorContext,

                timestamp: new Date().toISOString()
            },export interface APIResponse {

            }

    );
        }); success: boolean;

    }

}    }    data ?: any;



export function validateRequiredFields(data: any, requiredFields: string[]): string | null {
    error ?: string;

    for (const field of requiredFields) {

        if (!data[field]) {
            return await handler(request); status: number;

            return `Missing required field: ${field}`;

        }
    } catch (error) {
        responseTime: number;

    }

    return null; console.error(`API Error${errorContext ? ` (${errorContext})` : ''}:`, error); cached ?: boolean;

}

    }

export function sanitizeInput(input: string, maxLength: number = 1000): string {

    if (typeof input !== 'string') return ''; const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return input.trim().slice(0, maxLength);

}    // Rate limiting store (in production, use Redis or Cloudflare KV)

return createErrorResponse(const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

errorMessage,

    500,/**

      { * Rate limiting configuration

        context: errorContext, */

    timestamp: new Date().toISOString()export const RATE_LIMITS = {

    }    DEFAULT: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute

    ); AUTH: { requests: 5, windowMs: 60 * 1000 }, // 5 login attempts per minute

  }    AI_CHAT: { requests: 20, windowMs: 60 * 1000 }, // 20 AI requests per minute

}    IMAGE_GEN: { requests: 10, windowMs: 60 * 1000 }, // 10 image generations per minute

ADMIN: { requests: 200, windowMs: 60 * 1000 }, // 200 admin requests per minute

export function validateRequiredFields(data: any, requiredFields: string[]): string | null { };

for (const field of requiredFields) {

    if (!data[field]) {/**

      return `Missing required field: ${field}`; * Check rate limit for a given key and endpoint type

    } */

    } export function checkRateLimit(

  return null; key: string,

} endpoint: keyof typeof RATE_LIMITS = 'DEFAULT'

): { allowed: boolean; remaining: number; resetTime: number } {

    export function sanitizeInput(input: string, maxLength: number = 1000): string {
        const limit = RATE_LIMITS[endpoint];

        if (typeof input !== 'string') return ''; const now = Date.now();

        return input.trim().slice(0, maxLength); const windowStart = now - limit.windowMs;

    }
    const current = rateLimitStore.get(key);

    if (!current || current.resetTime < windowStart) {
        // Reset window
        rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs });
        return { allowed: true, remaining: limit.requests - 1, resetTime: now + limit.windowMs };
    }

    if (current.count >= limit.requests) {
        return { allowed: false, remaining: 0, resetTime: current.resetTime };
    }

    // Increment count
    current.count++;
    return { allowed: true, remaining: limit.requests - current.count, resetTime: current.resetTime };
}

/**
 * Enhanced API handler with rate limiting, monitoring, and error handling
 */
export async function handleAPIRequest(
    request: Request,
    handler: (request: Request) => Promise<Response>,
    endpoint: keyof typeof RATE_LIMITS = 'DEFAULT'
): Promise<Response> {
    const startTime = Date.now();
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For') ||
        'unknown';

    try {
        // Rate limiting
        const rateLimitKey = `${clientIP}:${url.pathname}`;
        const rateLimit = checkRateLimit(rateLimitKey, endpoint);

        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({
                    error: 'Rate limit exceeded',
                    retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
                        'X-RateLimit-Limit': RATE_LIMITS[endpoint].requests.toString(),
                        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
                        ...getCORSHeaders()
                    }
                }
            );
        }

        // Execute handler
        const response = await handler(request);
        const responseTime = Date.now() - startTime;

        // Add rate limit headers to response
        const enhancedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...Object.fromEntries(response.headers.entries()),
                'X-RateLimit-Limit': RATE_LIMITS[endpoint].requests.toString(),
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
                'X-Response-Time': `${responseTime}ms`,
            }
        });

        // Log successful request
        logAPIRequest({
            method: request.method,
            url: url.pathname,
            body: request.method !== 'GET' ? await request.clone().text() : undefined,
            headers: Object.fromEntries(request.headers.entries()),
            timestamp: startTime,
            userAgent: request.headers.get('User-Agent') || undefined,
            ip: clientIP
        }, {
            success: true,
            status: response.status,
            responseTime,
            cached: response.headers.get('X-Cache-Status') === 'HIT'
        });

        return enhancedResponse;

    } catch (error: any) {
        const responseTime = Date.now() - startTime;

        // Log error
        logAPIRequest({
            method: request.method,
            url: url.pathname,
            timestamp: startTime,
            ip: clientIP
        }, {
            success: false,
            error: error.message,
            status: 500,
            responseTime
        });

        return createErrorResponse('Internal server error', 500, {
            requestId: generateRequestId(),
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Simple caching implementation (in production, use Cloudflare KV or Cache API)
 */
const responseCache = new Map<string, { data: any; expires: number }>();

export function getCachedResponse(key: string): any | null {
    const cached = responseCache.get(key);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }
    if (cached) {
        responseCache.delete(key);
    }
    return null;
}

export function setCachedResponse(key: string, data: any, ttlMs: number = 300000): void {
    responseCache.set(key, {
        data,
        expires: Date.now() + ttlMs
    });
}

/**
 * Generate unique request ID for tracking
 */
export function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * API request logging (in production, send to analytics service)
 */
export function logAPIRequest(request: APIRequest, response: APIResponse): void {
    const logEntry = {
        ...request,
        ...response,
        timestamp: new Date().toISOString()
    };

    // Console logging for development
    if (response.success) {
        console.log(`✅ API ${request.method} ${request.url} - ${response.status} (${response.responseTime}ms)`);
    } else {
        console.error(`❌ API ${request.method} ${request.url} - ${response.status} (${response.responseTime}ms): ${response.error}`);
    }

    // Store in memory for admin dashboard (in production, use proper analytics)
    storeAPIMetrics(logEntry);
}

// API metrics storage (simplified for demo)
const apiMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    errorRequests: 0,
    averageResponseTime: 0,
    recentRequests: [] as any[]
};

function storeAPIMetrics(logEntry: any): void {
    apiMetrics.totalRequests++;
    if (logEntry.success) {
        apiMetrics.successfulRequests++;
    } else {
        apiMetrics.errorRequests++;
    }

    // Update average response time
    apiMetrics.averageResponseTime =
        (apiMetrics.averageResponseTime * (apiMetrics.totalRequests - 1) + logEntry.responseTime) /
        apiMetrics.totalRequests;

    // Keep last 100 requests
    apiMetrics.recentRequests.unshift(logEntry);
    if (apiMetrics.recentRequests.length > 100) {
        apiMetrics.recentRequests.pop();
    }
}

export function getAPIMetrics() {
    return { ...apiMetrics };
}

// Import existing utilities
import { getCORSHeaders, createErrorResponse, createSuccessResponse } from './corsUtils';

export { getCORSHeaders, createErrorResponse, createSuccessResponse };
=======
/**
 * Standard CORS OPTIONS handler for all API endpoints
 * Provides consistent CORS policy across the application
 */
export const createOPTIONSHandler = (allowedMethods: string[] = ['GET', 'POST', 'OPTIONS']) => {
  return async () => {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': allowedMethods.join(', '),
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false',
      },
    });
  };
};

/**
 * Standard CORS headers for all API responses
 */
export const getCORSHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
});

/**
 * Add CORS headers to any response
 */
export const addCORSHeaders = (response: Response): Response => {
  const corsHeaders = getCORSHeaders();
  
  // Clone response to modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      ...corsHeaders,
    },
  });
  
  return newResponse;
};

/**
 * Create a standardized error response with CORS headers
 */
export const createErrorResponse = (message: string, status: number = 400, extra?: Record<string, any>) => {
  const body = { error: message, ...(extra ?? {}) };
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders(),
      },
    }
  );
};

/**
 * Create a standardized success response with CORS headers
 */
export const createSuccessResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders(),
      },
    }
  );
};
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
