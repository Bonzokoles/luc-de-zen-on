// Adapter do modelu POLACZEK_B (Cloudflare/ARM, fallback do Bielik)
export async function callPolaczekBModel(prompt: string, options: any = {}) {
  const POLACZEK_API_URL = "https://cloudflare-ai.yourdomain.com/v1/polaczek-b";
  try {
    const response = await fetch(POLACZEK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...options })
    });
    if (!response.ok) throw new Error("POLACZEK_B API error");
    return await response.json();
  } catch (err) {
    // Fallback do Bielik
    return await callBielikModel(prompt, options);
  }
}

// Przykład użycia:
// const output = await callPolaczekBModel("Wykonaj analizę danych...");