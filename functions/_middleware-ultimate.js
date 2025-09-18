// Cloudflare Pages Functions Middleware - Ultimate Performance Optimization
// Enhanced with R2 storage, memory management, and advanced caching strategies

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // Memory management - cleanup old responses
  if (typeof gc === 'function') {
    gc();
  }
  
  // Performance optimizations with R2 and KV storage
  const optimizedResponse = await handleUltimatePerformanceOptimizations(request, url, next, env, context);
  
  return optimizedResponse;
}

async function handleUltimatePerformanceOptimizations(request, url, next, env, context) {
  const pathname = url.pathname;
  
  // Skip middleware for certain static assets
  if (shouldSkipMiddleware(pathname)) {
    return next();
  }

  // Try KV cache first for edge caching
  if (env.EDGE_CACHE) {
    const cacheKey = `cache:${url.pathname}:${url.search}`;
    const cachedContent = await env.EDGE_CACHE.get(cacheKey);
    
    if (cachedContent) {
      const response = new Response(cachedContent, {
        headers: {
          'Content-Type': 'text/html',
          'X-Cache': 'HIT-KV',
          'X-Cache-Source': 'edge',
          'Cache-Control': 'public, max-age=3600'
        }
      });
      return response;
    }
  }

  // Try R2 cache storage for larger content
  if (env.CACHE_STORAGE && shouldUseR2Cache(pathname)) {
    const r2Key = `cache/${pathname.replace(/\//g, '_')}`;
    try {
      const cachedObject = await env.CACHE_STORAGE.get(r2Key);
      if (cachedObject) {
        const content = await cachedObject.text();
        const response = new Response(content, {
          headers: {
            'Content-Type': getContentType(pathname),
            'X-Cache': 'HIT-R2',
            'X-Cache-Source': 'storage',
            'Cache-Control': 'public, max-age=7200'
          }
        });
        return response;
      }
    } catch (error) {
      console.warn('R2 cache read error:', error);
    }
  }

  // Default Cloudflare cache
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), {
    method: 'GET',
    headers: {
      'CF-Cache-Key': url.pathname + url.search
    }
  });

  let cachedResponse = await cache.match(cacheKey);
  
  if (cachedResponse) {
    cachedResponse = new Response(cachedResponse.body, cachedResponse);
    cachedResponse.headers.set('X-Cache', 'HIT-CF');
    cachedResponse.headers.set('X-Cache-Source', 'cloudflare');
    return cachedResponse;
  }

  // Get response from origin
  let response = await next();
  
  // Clone for caching before processing
  const responseToCache = response.clone();
  const responseForR2 = response.clone();
  const responseForKV = response.clone();
  
  // Apply advanced caching strategy
  response = await applyAdvancedCachingStrategy(request, response, url, env);
  
  // Store in appropriate cache based on content size and type
  if (shouldCacheResponse(response, url)) {
    // Store in Cloudflare cache
    context.waitUntil(cache.put(cacheKey, responseToCache));
    
    // Store in R2 for large content
    if (shouldUseR2Cache(pathname)) {
      const r2Key = `cache/${pathname.replace(/\//g, '_')}`;
      const content = await responseForR2.text();
      
      context.waitUntil(
        env.CACHE_STORAGE?.put(r2Key, content, {
          httpMetadata: {
            contentType: getContentType(pathname),
            cacheControl: 'max-age=7200'
          },
          customMetadata: {
            'cached-at': new Date().toISOString(),
            'cache-type': 'r2-storage'
          }
        }).catch(error => console.warn('R2 cache write error:', error))
      );
    }
    
    // Store in KV for fast edge access
    if (env.EDGE_CACHE && shouldUseKVCache(pathname, response)) {
      const cacheKey = `cache:${url.pathname}:${url.search}`;
      const content = await responseForKV.text();
      
      context.waitUntil(
        env.EDGE_CACHE.put(cacheKey, content, {
          expirationTtl: 3600,
          metadata: {
            'cached-at': new Date().toISOString(),
            'content-type': getContentType(pathname)
          }
        }).catch(error => console.warn('KV cache write error:', error))
      );
    }
  }

  return response;
}

function shouldSkipMiddleware(pathname) {
  const skipPatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|pdf|zip)$/,
    /^\/api\/admin\/(?:login|auth|session)/,
    /^\/admin\/login/,
    /^\/favicon\.ico$/,
    /^\/robots\.txt$/,
    /^\/sitemap\.xml$/
  ];
  
  return skipPatterns.some(pattern => pattern.test(pathname));
}

function shouldUseR2Cache(pathname) {
  // Use R2 for larger content like pages, API responses, generated content
  return pathname.startsWith('/api/') || 
         pathname.includes('/blog/') || 
         pathname.includes('/docs/') ||
         pathname.includes('/ai-functions/') ||
         pathname === '/';
}

function shouldUseKVCache(pathname, response) {
  // Use KV for small, frequently accessed content
  const contentLength = response.headers.get('content-length');
  const size = contentLength ? parseInt(contentLength) : 0;
  
  return size < 25 * 1024 && ( // Less than 25KB
    pathname.startsWith('/api/stats') ||
    pathname.includes('/manifest.json') ||
    pathname.includes('/config')
  );
}

async function applyAdvancedCachingStrategy(request, response, url, env) {
  const pathname = url.pathname;
  const newResponse = new Response(response.body, response);
  
  // Enhanced caching strategies based on content type and route
  if (pathname.startsWith('/api/')) {
    // API Routes - Smart caching based on endpoint
    if (pathname.includes('/stats') || pathname.includes('/monitoring')) {
      // Stats and monitoring - short cache with frequent updates
      newResponse.headers.set('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');
      newResponse.headers.set('X-Cache-Strategy', 'api-stats');
    } else if (pathname.includes('/chat') || pathname.includes('/ai-')) {
      // AI endpoints - medium cache with revalidation
      newResponse.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=1800');
      newResponse.headers.set('X-Cache-Strategy', 'api-ai');
    } else {
      // General API - balanced caching
      newResponse.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
      newResponse.headers.set('X-Cache-Strategy', 'api-general');
    }
  } else if (pathname === '/' || pathname.startsWith('/blog') || pathname.startsWith('/about')) {
    // Main pages - longer cache with stale-while-revalidate
    newResponse.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
    newResponse.headers.set('X-Cache-Strategy', 'static-long');
  } else if (pathname.startsWith('/ai-functions/')) {
    // AI Functions - medium cache with background refresh
    newResponse.headers.set('Cache-Control', 'public, max-age=900, s-maxage=1800, stale-while-revalidate=7200');
    newResponse.headers.set('X-Cache-Strategy', 'ai-functions');
  } else if (pathname.startsWith('/admin/')) {
    // Admin pages - no cache for security
    newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    newResponse.headers.set('Pragma', 'no-cache');
    newResponse.headers.set('Expires', '0');
    newResponse.headers.set('X-Cache-Strategy', 'admin-no-cache');
  } else {
    // Default pages - moderate caching
    newResponse.headers.set('Cache-Control', 'public, max-age=600, s-maxage=1200, stale-while-revalidate=3600');
    newResponse.headers.set('X-Cache-Strategy', 'default');
  }

  // Enhanced security headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Performance headers
  newResponse.headers.set('X-Served-By', 'Cloudflare-Pages-Ultimate');
  newResponse.headers.set('X-Cache', 'MISS');
  newResponse.headers.set('X-Cache-Status', 'generated');
  newResponse.headers.set('X-Response-Time', Date.now().toString());

  // Compression hints
  if (pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.html')) {
    newResponse.headers.set('Vary', 'Accept-Encoding');
  }

  return newResponse;
}

function shouldCacheResponse(response, url) {
  const pathname = url.pathname;
  
  // Don't cache error responses
  if (response.status >= 400) {
    return false;
  }
  
  // Don't cache admin routes
  if (pathname.startsWith('/admin/') && !pathname.includes('/assets/')) {
    return false;
  }
  
  // Don't cache authentication endpoints
  if (pathname.includes('/auth/') || pathname.includes('/login')) {
    return false;
  }
  
  // Don't cache if explicitly marked as no-cache
  const cacheControl = response.headers.get('Cache-Control');
  if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('no-store'))) {
    return false;
  }
  
  // Don't cache very large responses in KV (let R2 handle them)
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // > 10MB
    return false;
  }
  
  return true;
}

function getContentType(pathname) {
  const extension = pathname.split('.').pop();
  
  const mimeTypes = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'txt': 'text/plain',
    'svg': 'image/svg+xml',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject'
  };
  
  return mimeTypes[extension] || 'text/html; charset=utf-8';
}
