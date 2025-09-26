// Service Worker for MyBonzo Advanced Cache Management
// Optimized for Cloudflare Pages environment

const CACHE_NAME = 'mybonzo-v2.0';
const STATIC_CACHE = 'mybonzo-static-v2.0';
const API_CACHE = 'mybonzo-api-v2.0';

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/api-dashboard',
  '/favicon.svg',
  '/apple-touch-icon.png',
  // Critical API endpoints for offline functionality
  '/api/health-check',
  '/api/status-check'
];

// API patterns that can be cached
const CACHEABLE_API_PATTERNS = [
  /^\/api\/health/,
  /^\/api\/status/,
  /^\/api\/workers-status/,
  /^\/api\/test-connections/
];

// Install event - Cache critical resources
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static resources...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Handle requests with caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.pathname.startsWith('/')) {
    return;
  }

  // API requests - Cache with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Static resources - Cache with cache-first strategy
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if API endpoint is cacheable
  const isCacheable = CACHEABLE_API_PATTERNS.some(pattern => 
    pattern.test(url.pathname)
  );

  if (!isCacheable) {
    return fetch(request);
  }

  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.warn('🌐 Network failed for API request, trying cache:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical endpoints
    if (url.pathname === '/api/health-check') {
      return new Response(JSON.stringify({
        status: 'offline',
        message: 'Service Worker: Offline mode active',
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For HTML requests, return cached index page
    if (request.headers.get('accept')?.includes('text/html')) {
      const indexCache = await cache.match('/');
      if (indexCache) {
        return indexCache;
      }
    }
    
    throw error;
  }
}

console.log('🚀 MyBonzo Service Worker v2.0 loaded successfully');
