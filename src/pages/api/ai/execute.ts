/**
 * MYBONZO AI — Centralny router modeli AI
 *
 * POST /api/ai/execute
 *
 * Wspólny endpoint dla wszystkich narzędzi:
 * 1. Pobiera konfigurację firmy + modeli z D1
 * 2. Składa system prompt (core + firma + kontekst + company_prompt)
 * 3. Wybiera model (auto/domyslny/szybki/dokladny/ekonomiczny)
 * 4. Wywołuje odpowiedni provider (Google/OpenAI/DeepSeek)
 * 5. Zwraca wynik + metadata
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { CORE_PROMPTS, buildSystemPrompt, type NarzedzieType } from '../../../lib/ai-prompts';

interface ExecuteBody {
  firma_id?: string;
  narzedzie: string;
  model?: string;            // 'auto' | 'domyslny' | 'szybki' | 'dokladny' | 'ekonomiczny'
  core_prompt?: string;       // opcjonalne nadpisanie core promptu
  company_prompt?: string;    // kontekst firmy od użytkownika (textarea)
  payload: Record<string, unknown>;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as ExecuteBody;

    // ─── Walidacja ────────────────────────────────────────
    if (!body.narzedzie || !body.payload) {
      return json({ error: 'Brak wymaganych pól: narzedzie, payload' }, 400);
    }

    // ─── Env keys ─────────────────────────────────────────
    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'DEEPSEEK_API_KEY'),
      ANTHROPIC_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'ANTHROPIC_API_KEY'),
      GROQ_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GROQ_API_KEY'),
      MISTRAL_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'MISTRAL_API_KEY'),
      XAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'XAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;
    const firmaId = body.firma_id || (cfEnv as Record<string, string | undefined>).TENANT_ID || 'meblepumo';

    // ─── Pobranie danych z D1 (jeśli dostępne) ───────────
    let firmaOpis: string | null = null;
    let kontekstNarzedzia: string | null = null;
    let modeleAI: AIModelConfig[] = [];

    if (d1) {
      try {
        // Firma
        const firma = await d1
          .prepare('SELECT opis FROM firmy WHERE id = ?')
          .bind(firmaId)
          .first<{ opis: string | null }>();
        firmaOpis = firma?.opis ?? null;

        // Modele AI
        const modeleResult = await d1
          .prepare(
            `SELECT nazwa_logiczna, provider, model_id FROM firmy_modele_ai 
             WHERE firma_id = ? AND aktywny = 1 ORDER BY kolejnosc ASC`
          )
          .bind(firmaId)
          .all<{ nazwa_logiczna: string; provider: string; model_id: string }>();
        modeleAI = modeleResult.results ?? [];

        // Kontekst narzędzia
        const kontekst = await d1
          .prepare(
            'SELECT system_prompt FROM firmy_narzedzia_kontekst WHERE firma_id = ? AND narzedzie = ?'
          )
          .bind(firmaId, body.narzedzie)
          .first<{ system_prompt: string | null }>();
        kontekstNarzedzia = kontekst?.system_prompt ?? null;
      } catch (dbErr) {
        console.warn('[ai/execute] D1 query failed, using fallback:', dbErr);
      }
    }

    // ─── Fallback modeli (jeśli D1 puste lub niedostępne) ─
    if (modeleAI.length === 0) {
      modeleAI = buildFallbackModels(envKeys);
    }

    if (modeleAI.length === 0) {
      return json({ error: 'Brak dostępnych modeli AI — sprawdź klucze API' }, 500);
    }

    // ─── Wybór modelu ─────────────────────────────────────
    const requestedModel = body.model || 'auto';
    let selectedModel: AIModelConfig;

    if (requestedModel === 'auto') {
      selectedModel = modeleAI[0];
    } else {
      const found = modeleAI.find((m) => m.nazwa_logiczna === requestedModel);
      selectedModel = found || modeleAI[0];
    }

    // Sprawdź czy mamy klucz API dla wybranego providera
    const providerKey = getProviderKey(selectedModel.provider, envKeys);
    if (!providerKey) {
      // Fallback na inny dostępny model
      const fallback = modeleAI.find((m) => getProviderKey(m.provider, envKeys));
      if (!fallback) {
        return json({ error: `Brak klucza API dla modelu ${selectedModel.provider}` }, 500);
      }
      selectedModel = fallback;
    }

    // ─── Budowanie promptu ────────────────────────────────
    const corePrompt =
      body.core_prompt ||
      CORE_PROMPTS[body.narzedzie as NarzedzieType] ||
      'Jesteś pomocnym asystentem AI. Odpowiadaj po polsku.';

    const systemPrompt = buildSystemPrompt({
      corePrompt,
      firmaOpis,
      kontekstNarzedzia,
      companyPrompt: body.company_prompt,
    });

    // ─── Wywołanie modelu ─────────────────────────────────
    const result = await callModel(
      selectedModel,
      {
        system: systemPrompt,
        user: JSON.stringify(body.payload),
      },
      envKeys
    );

    return json({
      wynik: result.text,
      model_uzyty: {
        nazwa_logiczna: selectedModel.nazwa_logiczna || selectedModel.provider,
        provider: selectedModel.provider,
        model_id: selectedModel.model_id,
      },
      czas_ms: result.duration_ms,
      tokeny: result.tokens_used,
    });
  } catch (err) {
    console.error('[ai/execute] Error:', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json(
      {
        error: 'Błąd generowania AI',
        details: message,
        czas_ms: Date.now() - startTime,
      },
      500
    );
  }
};

// ─── Pomocnicze ─────────────────────────────────────────

function getProviderKey(provider: string, keys: AIEnvKeys): string | undefined {
  switch (provider) {
    case 'google':
      return keys.GOOGLE_API_KEY;
    case 'openai':
      return keys.OPENAI_API_KEY;
    case 'deepseek':
      return keys.DEEPSEEK_API_KEY;
    case 'anthropic':
      return keys.ANTHROPIC_API_KEY;
    case 'groq':
      return keys.GROQ_API_KEY;
    case 'mistral':
      return keys.MISTRAL_API_KEY;
    case 'xai':
      return keys.XAI_API_KEY;
    default:
      return undefined;
  }
}

function buildFallbackModels(keys: AIEnvKeys): AIModelConfig[] {
  const models: AIModelConfig[] = [];
  if (keys.GOOGLE_API_KEY) {
    models.push({ nazwa_logiczna: 'domyslny', provider: 'google', model_id: 'gemini-2.5-flash' });
  }
  if (keys.OPENAI_API_KEY) {
    models.push({ nazwa_logiczna: 'dokladny', provider: 'openai', model_id: 'gpt-4o' });
  }
  if (keys.DEEPSEEK_API_KEY) {
    models.push({ nazwa_logiczna: 'ekonomiczny', provider: 'deepseek', model_id: 'deepseek-chat' });
  }
  if (keys.ANTHROPIC_API_KEY) {
    models.push({ nazwa_logiczna: 'claude', provider: 'anthropic', model_id: 'claude-3-5-sonnet-20241022' });
  }
  if (keys.GROQ_API_KEY) {
    models.push({ nazwa_logiczna: 'szybki_llama', provider: 'groq', model_id: 'llama-3.1-70b-versatile' });
  }
  if (keys.MISTRAL_API_KEY) {
    models.push({ nazwa_logiczna: 'mistral', provider: 'mistral', model_id: 'mistral-large-latest' });
  }
  if (keys.XAI_API_KEY) {
    models.push({ nazwa_logiczna: 'grok', provider: 'xai', model_id: 'grok-4' });
  }
  return models;
}
