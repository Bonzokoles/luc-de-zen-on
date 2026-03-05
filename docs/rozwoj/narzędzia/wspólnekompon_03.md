<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Cloudflare Worker: `/api/ai/execute` – wspólny router modeli

To jest serce wszystkich narzędzi – jeden endpoint obsługuje **wszystkie** narzędzia z routingiem modeli i system promptami.

### 1. `wrangler.toml` (konfiguracja)

```toml
name = "mybonzo-ai-core"
main = "src/ai/execute.ts"
compatibility_date = "2026-03-05"

[[d1_databases]]
binding = "D1"
database_name = "mybonzo"
database_id = "twoj_d1_id"

[vars]
OPENAI_API_KEY = "sk-..."
GOOGLE_API_KEY = "AIza..."
DEEPSEEK_API_KEY = "sk-..."
```


### 2. Główny Worker (`src/ai/execute.ts`)

```typescript
// src/ai/execute.ts
interface Env {
  D1: D1Database;
  OPENAI_API_KEY: string;
  GOOGLE_API_KEY: string;
  DEEPSEEK_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Tylko POST', { status: 405 });
    }

    const body = await request.json<{
      firma_id: string;
      narzedzie: string;
      model: string; // "auto" | "domyslny" | "szybki" | konkretny model_id
      core_prompt: string;
      company_prompt?: string;
      payload: any;
    }>();

    // 1. Pobierz konfigurację firmy
    const firma = await env.D1.prepare(
      `SELECT nazwa, opis, jezyk_domyslny FROM firmy WHERE id = ?`
    ).bind(body.firma_id).first<{ nazwa: string; opis?: string; jezyk_domyslny: string }>();

    if (!firma) {
      return Response.json({ error: 'Firma nie istnieje' }, { status: 404 });
    }

    // 2. Pobierz modele AI dla firmy
    const modele = await env.D1.prepare(`
      SELECT nazwa_logiczna, provider, model_id 
      FROM firmy_modele_ai 
      WHERE firma_id = ? AND aktywny = 1 
      ORDER BY kolejnosc ASC
    `).bind(body.firma_id).all();

    if (modele.results.length === 0) {
      return Response.json({ error: 'Brak dostępnych modeli AI' }, { status: 500 });
    }

    // 3. Pobierz kontekst narzędzia dla firmy
    const kontekst = await env.D1.prepare(`
      SELECT system_prompt, ustawienia 
      FROM firmy_narzedzia_kontekst 
      WHERE firma_id = ? AND narzedzie = ?
    `).bind(body.firma_id, body.narzedzie).first();

    // 4. Wybierz model
    let wybranyModel = modele.results[0]; // domyślny
    if (body.model === 'szybki' && modele.results[1]) {
      wybranyModel = modele.results[1];
    } else if (body.model === 'ekonomiczny' && modele.results[2]) {
      wybranyModel = modele.results[2];
    } else if (body.model !== 'auto') {
      // konkretny model z nazwy logicznej
      wybranyModel = modele.results.find((m: any) => m.nazwa_logiczna === body.model);
      if (!wybranyModel) {
        return Response.json({ error: 'Model niedostępny' }, { status: 400 });
      }
    }

    // 5. Zbuduj system prompt
    const systemPromptParts: string[] = [body.core_prompt];

    if (firma.opis) {
      systemPromptParts.push(`\n---\n**Kontekst firmy:**\n${firma.opis}`);
    }

    if (kontekst?.system_prompt) {
      systemPromptParts.push(`\n---\n**Kontekst narzędzia:**\n${kontekst.system_prompt}`);
    }

    if (body.company_prompt) {
      systemPromptParts.push(`\n---\n**Dodatkowy kontekst:**\n${body.company_prompt}`);
    }

    const finalSystemPrompt = systemPromptParts.join('\n');

    // 6. Wywołaj model
    const result = await callModel(wybranyModel, {
      system: finalSystemPrompt,
      user: JSON.stringify(body.payload),
      model: (wybranyModel as any).model_id
    }, env);

    return Response.json({
      wynik: result.text,
      model_uzyty: wybranyModel,
      użyte_modele: modele.results.map((m: any) => m.nazwa_logiczna),
      czas: result.duration_ms,
      tokeny: result.tokens_used
    });
  }
};

// Helper - wywołanie konkretnego modelu
async function callModel(
  modelConfig: { provider: string; model_id: string },
  prompt: { system: string; user: string; model: string },
  env: Env
): Promise<{ text: string; duration_ms: number; tokens_used: { input: number; output: number } }> {
  const startTime = Date.now();

  switch (modelConfig.provider) {
    case 'openai':
      return await callOpenAI(prompt, env.OPENAI_API_KEY);
    case 'google':
      return await callGemini(prompt, env.GOOGLE_API_KEY);
    case 'deepseek':
      return await callDeepSeek(prompt, env.DEEPSEEK_API_KEY);
    case 'cloudflare':
      return await callWorkersAI(prompt);
    default:
      throw new Error(`Nieznany provider: ${modelConfig.provider}`);
  }
}

async function callOpenAI(prompt: any, apiKey: string): Promise<any> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: prompt.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })
  });

  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    duration_ms: Date.now() - (globalThis as any).startTime,
    tokens_used: {
      input: data.usage.prompt_tokens,
      output: data.usage.completion_tokens
    }
  };
}

async function callGemini(prompt: any, apiKey: string): Promise<any> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt.system },
            { text: '\n---\n' + prompt.user }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000
        }
      })
    }
  );

  const data = await res.json();
  return {
    text: data.candidates[0].content.parts[0].text,
    duration_ms: Date.now() - (globalThis as any).startTime,
    tokens_used: { input: 0, output: 0 } // Gemini nie zwraca tokenów
  };
}

async function callDeepSeek(prompt: any, apiKey: string): Promise<any> {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })
  });

  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    duration_ms: Date.now() - (globalThis as any).startTime,
    tokens_used: {
      input: data.usage.prompt_tokens,
      output: data.usage.completion_tokens
    }
  };
}

async function callWorkersAI(prompt: any): Promise<any> {
  // Cloudflare Workers AI - jeśli masz dostęp
  const res = await fetch('https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ]
    })
  });

  const data = await res.json();
  return {
    text: data.response,
    duration_ms: Date.now() - (globalThis as any).startTime,
    tokens_used: { input: 0, output: 0 }
  };
}
```


### 3. Przykład użycia z narzędzia – Generator Treści

**W `GeneratorTresci.tsx`:**

```tsx
const sendRequest = async () => {
  const response = await fetch('/api/ai/execute', {
    method: 'POST',
    body: JSON.stringify({
      firma_id: 'firma_123',
      narzedzie: 'generator_tresci',
      model: 'auto', // lub 'szybki'
      core_prompt: `Jesteś copywriterem. Twórz posty social dla firm. Typ: ${typ}, Kanał: ${kanal}...`,
      company_prompt: userCompanyPrompt, // z textarea w UI
      payload: {
        typ: selectedType,
        kanal: selectedChannel,
        ton: selectedTone,
        opis: userInput
      }
    })
  });

  const data = await response.json();
  setGeneratedText(data.wynik);
  setUsedModel(data.model_uzyty.nazwa_logiczna);
};
```

**Wynik:**

```json
{
  "wynik": "Twój wygenerowany post LinkedIn...",
  "model_uzyty": { "nazwa_logiczna": "domyslny", "provider": "openai", "model_id": "gpt-4o-mini" },
  "użyte_modele": ["domyslny", "szybki", "ekonomiczny"],
  "czas": 1200,
  "tokeny": { "input": 847, "output": 234 }
}
```


***

**Teraz masz:**

- ✅ Jeden endpoint `/api/ai/execute` dla **wszystkich** narzędzi,
- ✅ Automatyczny routing modeli z D1 (`auto` → najlepszy dostępny),
- ✅ Łączenie core prompt + company prompt + narzędzie context,
- ✅ Wsparcie OpenAI + Gemini + DeepSeek + Cloudflare AI,
- ✅ Śledzenie użycia modeli i czasów odpowiedzi.

**Następne narzędzie?** Które chcesz rozpisać jako pierwsze lokalny endpoint (`POST /api/narzedzia/generator-tresci`)?

