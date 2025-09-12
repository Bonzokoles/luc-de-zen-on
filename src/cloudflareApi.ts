/**
 * Centralny moduł do komunikacji z Cloudflare Workers API
 * Zapewnia jednolity sposób fetch z obsługą błędów
 */

const WORKER_BASE_URL = import.meta.env.PUBLIC_WORKER_BASE_URL || "https://luc-de-zen-on.stolarnia-ams.workers.dev";

/**
 * Główna funkcja do komunikacji z Workers API
 * @param path - ścieżka endpoint (np. "/api/chat")
 * @param options - opcje fetch
 * @returns Promise z odpowiedzią JSON
 */
export async function fetchFromWorker(path: string, options: RequestInit = {}) {
  try {
    const url = `${WORKER_BASE_URL}${path}`;
    console.log(`🌐 Wywołanie Worker API: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Worker API błąd: ${response.status} - ${errorText}`);
      throw new Error(`Worker API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Worker API sukces:`, data);
    return data;
  } catch (error) {
    console.error("🚨 Błąd Worker API:", error);
    throw error;
  }
}

/**
 * Funkcja POST do Workers API
 */
export async function postToWorker(path: string, payload: any) {
  return fetchFromWorker(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Funkcja GET do Workers API
 */
export async function getFromWorker(path: string, params?: Record<string, string>) {
  let url = path;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  return fetchFromWorker(url, { method: 'GET' });
}