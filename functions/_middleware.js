// Cloudflare Pages Functions Middleware - Performance Optimized
// This middleware runs before all requests and implements comprehensive caching strategies

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // Performance optimizations based on route
  const optimizedResponse = await handlePerformanceOptimizations(request, url, next, env);
  
  return optimizedResponse;
}

async function handlePerformanceOptimizations(request, url, next, env) {
  // Skip middleware for certain static assets that should use Cloudflare's default caching
  if (shouldSkipMiddleware(url.pathname)) {
    return next();
  }

  // Get cache instance
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);

  // Check cache first
  let cachedResponse = await cache.match(cacheKey);
  
  if (cachedResponse) {
    // Add cache hit header
    cachedResponse = new Response(cachedResponse.body, cachedResponse);
    cachedResponse.headers.set('X-Cache', 'HIT');
    cachedResponse.headers.set('X-Cache-Status', 'cached');
    return cachedResponse;
  }

  // If not cached, get response from origin
  let response = await next();
  
  // Clone response for caching
  const responseToCache = response.clone();
  
  // Apply caching strategy based on content type and route
  response = await applyCachingStrategy(request, response, url);
  
  // Cache the response if it's cacheable
  if (shouldCacheResponse(response, url)) {
    // Don't await cache.put to avoid blocking the response
    context.waitUntil(cache.put(cacheKey, responseToCache));
  }

  return response;
}

function shouldSkipMiddleware(pathname) {
  const skipPatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$/,
    /^\/api\/admin\//,
    /^\/admin\/login/,
    /^\/favicon\.ico$/
  ];
  
  return skipPatterns.some(pattern => pattern.test(pathname));
}

async function applyCachingStrategy(request, response, url) {
  const pathname = url.pathname;
  const newResponse = new Response(response.body, response);
  
  // API Routes - Short cache with revalidation
  if (pathname.startsWith('/api/')) {
    newResponse.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
    newResponse.headers.set('X-Cache-Strategy', 'api-short');
  }
  // Static pages - Longer cache with revalidation
  else if (pathname === '/' || pathname.startsWith('/blog') || pathname.startsWith('/about')) {
    newResponse.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
    newResponse.headers.set('X-Cache-Strategy', 'static-long');
  }
  // AI Functions - Medium cache
  else if (pathname.startsWith('/ai-functions/')) {
    newResponse.headers.set('Cache-Control', 'public, max-age=900, s-maxage=1800, stale-while-revalidate=7200');
    newResponse.headers.set('X-Cache-Strategy', 'ai-medium');
  }
  // Admin pages - No cache
  else if (pathname.startsWith('/admin/')) {
    newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    newResponse.headers.set('X-Cache-Strategy', 'admin-no-cache');
  }
  // Default caching for other pages
  else {
    newResponse.headers.set('Cache-Control', 'public, max-age=600, s-maxage=1200, stale-while-revalidate=3600');
    newResponse.headers.set('X-Cache-Strategy', 'default');
  }

  // Security headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  newResponse.headers.set('X-Served-By', 'Cloudflare-Pages');
  newResponse.headers.set('X-Cache', 'MISS');
  newResponse.headers.set('X-Cache-Status', 'generated');

  return newResponse;
}

function shouldCacheResponse(response, url) {
  // Don't cache error responses
  if (response.status >= 400) {
    return false;
  }
  
  // Don't cache admin routes
  if (url.pathname.startsWith('/admin/')) {
    return false;
  }
  
  // Don't cache if explicitly marked as no-cache
  const cacheControl = response.headers.get('Cache-Control');
  if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('no-store'))) {
    return false;
  }
  
  return true;
}
