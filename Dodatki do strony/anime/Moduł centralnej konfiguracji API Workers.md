// cloudflareApi.ts - centralny moduł do połączeń z Workerami

const WORKER_BASE_URL = import.meta.env.PUBLIC_WORKER_BASE_URL || "https://your-worker-domain.workers.dev";

async function fetchFromWorker(path: string, options: RequestInit = {}) {
  try {
    const url = `${WORKER_BASE_URL}${path}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker API error: ${response.status} - ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching from Worker:", error);
    // opcjonalnie fallback lub ponowna próba
    throw error;
  }
}

export { fetchFromWorker };
