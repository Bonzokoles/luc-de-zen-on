/**
 * API Proxy do pobierania plików przez URL (zastępuje lokalne Python serwery CORS proxy).
 * Działa jako Cloudflare Worker — brak ograniczeń CORS.
 * 
 * GET /api/fetch-url?url=https://example.com/feed.xml
 */

import type { APIRoute } from 'astro';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_CONTENT_TYPES = [
  'text/', 'application/xml', 'application/json', 'application/yaml',
  'application/x-yaml', 'application/csv', 'application/rss+xml',
  'application/atom+xml', 'application/xhtml+xml',
];

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Brak parametru url' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Walidacja URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Tylko HTTP/HTTPS');
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Nieprawidłowy URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Blokuj localhost / wewnętrzne adresy
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.endsWith('.local')
  ) {
    return new Response(JSON.stringify({ error: 'Dostęp do adresów wewnętrznych zabroniony' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AI-Biznes-ERP-Konwerter/1.0',
        'Accept': '*/*',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Serwer zwrócił ${response.status}: ${response.statusText}` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sprawdź rozmiar
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: `Plik zbyt duży (${(parseInt(contentLength) / 1024 / 1024).toFixed(1)} MB). Limit: 10 MB` }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = await response.text();

    if (text.length > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: `Plik zbyt duży (${(text.length / 1024 / 1024).toFixed(1)} MB). Limit: 10 MB` }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType = response.headers.get('content-type') || 'text/plain';

    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'X-Original-Content-Type': contentType,
        'X-Original-URL': targetUrl,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: 'Timeout — serwer nie odpowiedział w ciągu 15s' }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Błąd pobierania: ${err.message || 'Nieznany błąd'}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
