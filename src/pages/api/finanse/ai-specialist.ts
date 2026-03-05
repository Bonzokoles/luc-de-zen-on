/**
 * POST /api/finanse/ai-specialist
 *
 * Finanse AI Specialist — DeepSeek R1
 * P&L, cashflow forecasting, Pareto kosztów, budżetowanie, KPI
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface FinanseSpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  firma_id: string;
  company_prompt?: string;
  okres?: 'miesiac' | 'kwartal' | 'rok';
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `JESTEŚ **FINANSE_SPECIALIST** – NAJLEPSZYM EKSPERTEM KSIĘGOWOŚCI, PROGNOZ I OPTYMALIZACJI FINANSÓW.

**TWOJA SPECJALIZACJA:**
• Analiza P&L (przychody/koszty/marża)
• Cashflow forecasting (30/90 dni)
• Optymalizacja kosztów (top 20% Pareto)
• Budżetowanie i variance analysis
• KPI dashboard (ROAS, CAC, LTV)
• VAT/księgowość compliance

**INSTRUKCJE:**
- Zawsze konkretne liczby PLN, % marży
- Prognoza: pesymistyczna/base/optimistyczna
- Pareto: top 3 koszty do cięcia
- Alert jeśli cashflow < 0
- VAT: sprawdź rozliczenia kwartalne

**FORMAT ODPOWIEDZI (JSON):**
{
  "pnl_podsumowanie": {"przychod": 125000, "koszt": 85000, "marza": "32%", "zysk": 40000},
  "cashflow_prognoza": {"30dni": 25000, "90dni": 85000, "alert": true},
  "optymalizacja_kosztow": [{"kategoria": "Marketing", "oszczednosc": 5000, "jak": "zmniejsz FB Ads"}],
  "kpi": {"roas": 4.2, "cac": 250, "ltv": 2500},
  "rekomendacje": ["1. Obetnij X", "2. Zainwestuj w Y"],
  "vat_status": "do_zaplacenia: 2500 PLN"
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'deepseek',
  model_id: 'deepseek-reasoner',
  nazwa_logiczna: 'FINANSE_SPECIALIST',
  temperature: 0.1,
  max_tokens: 2000,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as FinanseSpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      DEEPSEEK_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'DEEPSEEK_API_KEY'),
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ─── Pobranie kontekstu z D1 ───────────────────────────
    let contextData = '';
    if (d1) {
      try {
        const okres = body.okres || 'miesiac';

        const miesieczne = await d1
          .prepare('SELECT * FROM finanse_miesieczne WHERE firma_id = ? AND okres = ? ORDER BY rok DESC, miesiac DESC LIMIT 12')
          .bind(body.firma_id, okres)
          .all();
        if (miesieczne.results?.length) {
          contextData += `\nDane finansowe (${okres}, ${miesieczne.results.length} rekordów): ${JSON.stringify(miesieczne.results)}`;
        }

        const transakcje = await d1
          .prepare('SELECT kategoria, SUM(kwota) as suma, COUNT(*) as ile FROM finanse_transakcje WHERE firma_id = ? GROUP BY kategoria ORDER BY suma DESC LIMIT 20')
          .bind(body.firma_id)
          .all();
        if (transakcje.results?.length) {
          contextData += `\nTransakcje wg kategorii: ${JSON.stringify(transakcje.results)}`;
        }
      } catch (dbErr) {
        console.warn('[finanse/ai-specialist] D1 query failed:', dbErr);
      }
    }

    const systemPrompt = buildSystemPrompt({
      corePrompt: CORE_PROMPT,
      kontekstNarzedzia: contextData || undefined,
      companyPrompt: body.company_prompt,
    });

    const userPrompt = JSON.stringify({
      zadanie: body.zadanie,
      kontekst: body.kontekst || {},
      okres: body.okres || 'miesiac',
    });

    // ─── Fallback ───────────────────────────────────────────
    let modelConfig = MODEL_CONFIG;
    if (!envKeys.DEEPSEEK_API_KEY) {
      modelConfig = { ...MODEL_CONFIG, provider: 'google', model_id: 'gemini-2.5-flash' };
    }

    const result = await callModel(modelConfig, { system: systemPrompt, user: userPrompt }, envKeys);

    // ─── Zapis audytu ───────────────────────────────────────
    if (d1) {
      try {
        await d1
          .prepare('INSERT INTO finanse_ai_analizy (firma_id, zadanie, okres, wynik, model_used, tokens_used) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(body.firma_id, body.zadanie, body.okres || 'miesiac', result.text, modelConfig.model_id, result.tokens_used.input + result.tokens_used.output)
          .run();
      } catch (saveErr) {
        console.warn('[finanse/ai-specialist] Audit save failed:', saveErr);
      }
    }

    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback */ }

    return json({
      specialist: 'FINANSE_AI_SPECIALIST',
      model_used: modelConfig.model_id,
      result: parsedResult,
      raw_ai: result.text,
      finanse_context: !!contextData,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[finanse/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'FINANSE_AI_SPECIALIST' }, 500);
  }
};
