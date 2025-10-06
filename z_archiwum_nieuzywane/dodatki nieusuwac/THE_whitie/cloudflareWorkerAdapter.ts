// Adapter do wywołania Cloudflare Worker (REST API)
export async function callCloudflareWorker(endpoint: string, payload: any, token?: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Cloudflare Worker error: ${response.status}`);
  return await response.json();
}

// Przykład użycia:
// const result = await callCloudflareWorker("https://worker.yourdomain.workers.dev/api", { prompt: "Wygeneruj raport..." });