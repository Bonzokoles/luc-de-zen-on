/**
 * POST /api/magazyn/ai-specialist
 *
 * Magazyn AI Specialist — Gemini 1.5 Pro
 * Stany magazynowe, reorder points, ABC analiza, optymalizacja zapasów
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface MagazynSpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  firma_id: string;
  company_prompt?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `JESTEŚ **MAGAZYN_SPECIALIST** – NAJLEPSZYM EKSPERTEM LOGISTYKI I ZARZĄDZANIA ZAPASAMI.

**TWOJA SPECJALIZACJA:**
• Analiza stanów magazynowych i alertów
• Obliczanie reorder points i ilości domówień
• ABC analiza (top produkty do kontroli)
• Optymalizacja rotacji zapasów
• Planowanie zakupów grupowych

**INSTRUKCJE:**
- Zawsze konkretne liczby: ile domówić, kiedy, od kogo
- ABC analiza: A (top 20% wartości), B, C
- Reorder point = średnie dzienne zużycie × lead time
- Priorytetyzuj alerty (najbliżej zera)

**FORMAT ODPOWIEDZI (JSON):**
{
  "alerty_priorytet": [{"produkt": "nazwa", "do_doomowic": 50, "dostawca": "X"}],
  "abc_analiza": {"A": ["prod1"], "B": ["..."], "C": ["..."]},
  "reorder_plan": {"caly_koszt": 12500, "rekomendacja": "zamów w poniedziałek"},
  "rekomendacje": ["1. Zamów X", "2. Zoptymalizuj Y"],
  "uzasadnienie": "..."
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'google',
  model_id: 'gemini-1.5-pro',
  nazwa_logiczna: 'MAGAZYN_SPECIALIST',
  temperature: 0.2,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as MagazynSpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ─── Pobranie kontekstu z D1 ───────────────────────────
    let contextData = '';
    if (d1) {
      try {
        const produkty = await d1
          .prepare('SELECT * FROM produkty_magazyn WHERE firma_id = ? LIMIT 100')
          .bind(body.firma_id)
          .all();
        if (produkty.results?.length) {
          contextData += `\nProdukty magazynowe (${produkty.results.length}): ${JSON.stringify(produkty.results)}`;
        }

        const ruchy = await d1
          .prepare('SELECT * FROM ruchy_magazynowe WHERE firma_id = ? ORDER BY data DESC LIMIT 50')
          .bind(body.firma_id)
          .all();
        if (ruchy.results?.length) {
          contextData += `\nOstatnie ruchy magazynowe: ${JSON.stringify(ruchy.results)}`;
        }
      } catch (dbErr) {
        console.warn('[magazyn/ai-specialist] D1 query failed:', dbErr);
      }
    }

    // ─── Budowanie promptu ──────────────────────────────────
    const systemPrompt = buildSystemPrompt({
      corePrompt: CORE_PROMPT,
      kontekstNarzedzia: contextData || undefined,
      companyPrompt: body.company_prompt,
    });

    const userPrompt = JSON.stringify({
      zadanie: body.zadanie,
      kontekst: body.kontekst || {},
    });

    // ─── Wywołanie AI ───────────────────────────────────────
    const result = await callModel(MODEL_CONFIG, { system: systemPrompt, user: userPrompt }, envKeys);

    // ─── Zapis audytu ───────────────────────────────────────
    if (d1) {
      try {
        await d1
          .prepare('INSERT INTO magazyn_ai_sessions (firma_id, zadanie, wynik, model_used, tokens_used) VALUES (?, ?, ?, ?, ?)')
          .bind(body.firma_id, body.zadanie, result.text, MODEL_CONFIG.model_id, result.tokens_used.input + result.tokens_used.output)
          .run();
      } catch (saveErr) {
        console.warn('[magazyn/ai-specialist] Audit save failed:', saveErr);
      }
    }

    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback */ }

    return json({
      specialist: 'MAGAZYN_AI_SPECIALIST',
      model_used: MODEL_CONFIG.model_id,
      result: parsedResult,
      raw_ai: result.text,
      magazyn_context: !!contextData,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[magazyn/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'MAGAZYN_AI_SPECIALIST' }, 500);
  }
};
