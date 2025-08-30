
Etap 1: Dynamiczna zmiana modeli AI
Krok 1: Przygotowanie struktury danych w Cloudflare KV
W panelu Cloudflare utwórz lub wykorzystaj istniejący namespace KV (np. AI_MODELS).

Zdefiniuj dane przechowujące konfiguracje modeli, np. w formacie JSON:

json
{
  "default_model": "gpt-4",
  "models": {
    "gpt-3.5": {
      "name": "GPT-3.5",
      "endpoint": "https://api.openai.com/v1/gpt-3.5-turbo",
      "parameters": { ... }
    },
    "gpt-4": {
      "name": "GPT-4",
      "endpoint": "https://api.openai.com/v1/gpt-4",
      "parameters": { ... }
    }
  }
}
Wgraj to JSON do KV pod kluczem np. models_config.

Krok 2: API do pobierania i ustawiania modelu
W Cloudflare Workers, w pliku obsługującym API, dodaj nowe endpointy:

GET /api/models — zwraca listę dostępnych modeli i obecnie wybrany model,

POST /api/models/select — ustawia wybrany model (przykładowo, w KV lub innym miejscu, w zależności od logiki).

Przykład (pseudokod Workers):

javascript
async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname === "/api/models" && request.method === "GET") {
    const modelsConfig = await AI_MODELS.get("models_config", { type: "json" });
    return new Response(JSON.stringify(modelsConfig), { headers: { "Content-Type": "application/json" } });
  }
  
  if (url.pathname === "/api/models/select" && request.method === "POST") {
    const reqBody = await request.json();
    const selectedModel = reqBody.model;
    
    const modelsConfig = await AI_MODELS.get("models_config", { type: "json" });
    
    if (!modelsConfig.models[selectedModel]) {
      return new Response(JSON.stringify({ error: "Model not found" }), { status: 400 });
    }
    
    // Zapisz wybrany model (np. pod kluczem "selected_model")
    await AI_MODELS.put("selected_model", selectedModel);
    
    return new Response(JSON.stringify({ success: true, selectedModel }), { headers: { "Content-Type": "application/json" } });
  }
  
  // inne endpointy...
}
Krok 3: Pobieranie wybranego modelu przy wywołaniu AI
W miejscu, gdzie wywołujesz model AI (np. zapytanie do OpenAI), pobierz z KV aktualnie ustawiony model:

javascript
const selectedModel = await AI_MODELS.get("selected_model") || "gpt-4";
const modelsConfig = await AI_MODELS.get("models_config", { type: "json" });
const modelInfo = modelsConfig.models[selectedModel];

// użyj modelInfo.endpoint i modelInfo.parameters do wywołania
Krok 4: Frontend - dodanie wyboru modelu
W panelu agentów dodaj element interfejsu (np. dropdown lub radio button) pokazujący dostępne modele pobrane z endpointu /api/models.

Po wybraniu modelu wywołaj API POST /api/models/select z wybraną wartością.

Odśwież lub powiadom użytkownika o zmianie wyboru.

Po wdrożeniu tej funkcji będzie można dynamicznie zmieniać modele AI bez konieczności redeployowania całej aplikacji.

