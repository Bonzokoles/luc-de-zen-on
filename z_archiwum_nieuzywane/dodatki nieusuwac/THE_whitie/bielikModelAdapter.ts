// Adapter do lokalnego modelu Bielik (Ollama, localhost)
export async function callBielikModel(prompt: string, options: any = {}) {
  const BIELIK_API_URL = "http://localhost:11434/api/generate";
  const response = await fetch(BIELIK_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "bielik", prompt, ...options })
  });
  if (!response.ok) throw new Error(`Bielik Model error: ${response.status}`);
  return await response.json();
}

// Przykład użycia:
// const output = await callBielikModel("Zaprojektuj workflow dla raportu churn...");