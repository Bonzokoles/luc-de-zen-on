/**
 * POST /api/projekty/ai-specialist
 *
 * Projekty AI Specialist — Llama 3.1 70B (Groq)
 * CPM, alokacja zasobów, risk analysis, sprint planning, Gantt
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface ProjektySpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  projekt_id?: string;
  firma_id: string;
  company_prompt?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `JESTEŚ **PROJEKTY_SPECIALIST** – NAJLEPSZYM EKSPERTEM ZARZĄDZANIA PROJEKTAMI I TEAMOWYM WORKFLOW.

**TWOJA SPECJALIZACJA:**
• Priorytetyzacja zadań (Critical Path Method)
• Alokacja zasobów (pracownicy → zadania)
• Prognozowanie opóźnień (risk analysis)
• Sprint planning i velocity
• Bottleneck detection
• Gantt chart recommendations

**INSTRUKCJE:**
- Zawsze konkretne: "Przypisz Jan do ZadaniaX (poniedziałek)"
- Critical Path: najważniejsze zadania najpierw
- Obciążenie pracowników: max 80% capacity
- Risk score (0-100) dla deadline
- Proste Gantt: tydzień 1, tydzień 2...

**FORMAT ODPOWIEDZI (JSON):**
{
  "risk_score": "0-100",
  "critical_path": ["zad1", "zad2", "zad3"],
  "alokacja": [{"pracownik": "Jan", "zadanie": "X", "start": "2026-03-10", "godziny": 12}],
  "bottlenecks": ["brak zasobów na frontend"],
  "rekomendacje": ["1. Przyspiesz zadanie X (dodaj pracownika)", "2. Przenieś Y na przyszły tydzień"],
  "gantt_simple": {"tydzien1": ["zad1", "zad2"], "tydzien2": ["zad3"]},
  "uzasadnienie": "..."
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'groq',
  model_id: 'llama-3.1-70b-versatile',
  nazwa_logiczna: 'PROJEKTY_SPECIALIST',
  temperature: 0.1,
  max_tokens: 2500,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as ProjektySpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      GROQ_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GROQ_API_KEY'),
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ─── Pobranie kontekstu z D1 ───────────────────────────
    let contextData = '';
    if (d1) {
      try {
        if (body.projekt_id) {
          const projekt = await d1
            .prepare('SELECT * FROM projekty WHERE id = ? AND firma_id = ?')
            .bind(body.projekt_id, body.firma_id)
            .first();
          if (projekt) contextData += `\nProjekt: ${JSON.stringify(projekt)}`;

          const zadania = await d1
            .prepare('SELECT * FROM zadania_projektow WHERE projekt_id = ? ORDER BY priorytet ASC')
            .bind(body.projekt_id)
            .all();
          if (zadania.results?.length) {
            contextData += `\nZadania (${zadania.results.length}): ${JSON.stringify(zadania.results)}`;
          }
        } else {
          const projekty = await d1
            .prepare("SELECT * FROM projekty WHERE firma_id = ? AND status != 'zakonczony' LIMIT 20")
            .bind(body.firma_id)
            .all();
          if (projekty.results?.length) {
            contextData += `\nAktywne projekty (${projekty.results.length}): ${JSON.stringify(projekty.results)}`;
          }
        }

        const pracownicy = await d1
          .prepare('SELECT * FROM uzytkownicy WHERE firma_id = ? AND aktywny = 1')
          .bind(body.firma_id)
          .all();
        if (pracownicy.results?.length) {
          contextData += `\nPracownicy: ${JSON.stringify(pracownicy.results)}`;
        }
      } catch (dbErr) {
        console.warn('[projekty/ai-specialist] D1 query failed:', dbErr);
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
      projekt_id: body.projekt_id,
    });

    // ─── Fallback: jeśli brak klucza Groq, użyj Google ─────
    let modelConfig = MODEL_CONFIG;
    if (!envKeys.GROQ_API_KEY) {
      modelConfig = { ...MODEL_CONFIG, provider: 'google', model_id: 'gemini-2.5-flash' };
    }

    const result = await callModel(modelConfig, { system: systemPrompt, user: userPrompt }, envKeys);

    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback */ }

    return json({
      specialist: 'PROJEKTY_AI_SPECIALIST',
      model_used: modelConfig.model_id,
      result: parsedResult,
      raw_ai: result.text,
      projekty_context: !!contextData,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[projekty/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'PROJEKTY_AI_SPECIALIST' }, 500);
  }
};
