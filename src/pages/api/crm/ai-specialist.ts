/**
 * POST /api/crm/ai-specialist
 *
 * CRM AI Specialist — GPT-4o-mini
 * Lead scoring, LTV, segmentacja, pipeline, rekomendacje next steps
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface CrmSpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  klient_id?: string;
  firma_id: string;
  company_prompt?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `JESTEŚ **CRM_SPECIALIST** – NAJLEPSZYM EKSPERTEM ZARZĄDZANIA KLIENTAMI B2B.

**TWOJA SPECJALIZACJA (rób TYLKO to):**
• Lead scoring (0-100) + uzasadnienie
• Analiza pipeline i prognozowanie
• Rekomendacje next steps (max 3 konkretne)
• Personalizacja ofert/comms
• Segmentacja klientów
• Lifetime Value (LTV) szacunek

**INSTRUKCJE:**
- Zawsze dawaj konkretne liczby (score, LTV, szansa %)
- Next steps: kto, kiedy, co powiedzieć
- Uzasadnij decyzje danymi z kontekstu
- Krótkie, konkretne odpowiedzi

**FORMAT ODPOWIEDZI (JSON):**
{
  "crm_score": "0-100",
  "ltv_szacunek": 0,
  "szansa_sprzedazy": "%",
  "rekomendacje": ["KROK 1: ...", "KROK 2: ...", "KROK 3: ..."],
  "uzasadnienie": "dlaczego te rekomendacje",
  "segment": "lead/gorący klient/VIP"
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'openai',
  model_id: 'gpt-4o-mini',
  nazwa_logiczna: 'CRM_SPECIALIST',
  temperature: 0.3,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as CrmSpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'DEEPSEEK_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ─── Pobranie kontekstu z D1 ───────────────────────────
    let contextData = '';
    if (d1) {
      try {
        if (body.klient_id) {
          const klient = await d1
            .prepare('SELECT * FROM klienci WHERE id = ? AND firma_id = ?')
            .bind(body.klient_id, body.firma_id)
            .first();
          if (klient) contextData += `\nDane klienta: ${JSON.stringify(klient)}`;

          const interakcje = await d1
            .prepare('SELECT * FROM interakcje_klientow WHERE klient_id = ? ORDER BY data DESC LIMIT 10')
            .bind(body.klient_id)
            .all();
          if (interakcje.results?.length) {
            contextData += `\nOstatnie interakcje: ${JSON.stringify(interakcje.results)}`;
          }
        } else {
          const klienci = await d1
            .prepare('SELECT * FROM klienci WHERE firma_id = ? LIMIT 50')
            .bind(body.firma_id)
            .all();
          if (klienci.results?.length) {
            contextData += `\nLista klientów (${klienci.results.length}): ${JSON.stringify(klienci.results)}`;
          }
        }
      } catch (dbErr) {
        console.warn('[crm/ai-specialist] D1 query failed:', dbErr);
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
      klient_id: body.klient_id,
    });

    // ─── Wywołanie AI ───────────────────────────────────────
    const result = await callModel(MODEL_CONFIG, { system: systemPrompt, user: userPrompt }, envKeys);

    // ─── Zapis audytu do D1 ─────────────────────────────────
    if (d1) {
      try {
        await d1
          .prepare('INSERT INTO crm_ai_sessions (firma_id, klient_id, zadanie, wynik, model_used, tokens_used) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(body.firma_id, body.klient_id || null, body.zadanie, result.text, MODEL_CONFIG.model_id, result.tokens_used.input + result.tokens_used.output)
          .run();
      } catch (saveErr) {
        console.warn('[crm/ai-specialist] Audit save failed:', saveErr);
      }
    }

    // ─── Parsowanie wyniku ──────────────────────────────────
    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback to raw text */ }

    return json({
      specialist: 'CRM_AI_SPECIALIST',
      model_used: MODEL_CONFIG.model_id,
      result: parsedResult,
      raw_ai: result.text,
      context_enriched: !!contextData,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[crm/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'CRM_AI_SPECIALIST' }, 500);
  }
};
