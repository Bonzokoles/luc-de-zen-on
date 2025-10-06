// Adapter do wywołania modelu Gemma AI (Cloudflare AI/ARM)
export async function callGemmaModel(prompt: string, options: any = {}) {
  const GEMMA_API_URL = "https://cloudflare-ai.yourdomain.com/v1/gemma";
  const response = await fetch(GEMMA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...options })
  });
  if (!response.ok) throw new Error(`Gemma Model error: ${response.status}`);
  return await response.json();
}

// Przykład użycia:
// const result = await callGemmaModel("Analizuj sentyment tekstu...", { temperature: 0.1 });