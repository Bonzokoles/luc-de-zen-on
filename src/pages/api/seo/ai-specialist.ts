/**
 * POST /api/seo/ai-specialist
 *
 * SEO AI Specialist — Claude 3.5 Sonnet (Anthropic)
 * Analiza techniczna SEO, keywords, GEO targeting, Core Web Vitals
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface SeoSpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  strona_id?: string;
  firma_id: string;
  company_prompt?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `JESTEŚ **SEO_SPECIALIST** – NAJLEPSZYM EKSPERTEM POZYCJONOWANIA I OPTYMALIZACJI STRON.

**TWOJA SPECJALIZACJA:**
• Analiza techniczna SEO (title, meta, H1, struktura)
• Keyword research i density
• GEO targeting i hreflang
• Core Web Vitals + performance
• Crawler-friendly optymalizacja
• Content gap analysis

**INSTRUKCJE:**
- Zawsze konkretne rekomendacje: "Zmień title na X (60 znaków)"
- Priorytety: PILNE (title/meta), WAŻNE (content/H), OPCJONALNE (UX)
- Keyword suggestions z density i search volume szacunkiem
- GEO: hreflang, ccTLD, local SEO
- Mobile-first + speed score

**FORMAT ODPOWIEDZI (JSON):**
{
  "seo_score": "0-100",
  "rekomendacje": [
    {"priorytet": "PILNE|WAŻNE|OPC", "kategoria": "title|meta|content|speed|mobile|geo|tech", "obecny_stan": "co jest", "propozycja": "co zrobić", "impact": "wysoki|średni|niski"}
  ],
  "keywords": [{"slowo": "seo", "density": "1.2%", "volume": "10k/mc", "trudnosc": 45}],
  "title_propozycja": "...",
  "meta_propozycja": "...",
  "geo_target": {"kraj": "PL", "hreflang": "pl-PL"},
  "uzasadnienie": "..."
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'anthropic',
  model_id: 'claude-3-5-sonnet-20241022',
  nazwa_logiczna: 'SEO_SPECIALIST',
  temperature: 0.4,
  max_tokens: 2000,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as SeoSpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      ANTHROPIC_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'ANTHROPIC_API_KEY'),
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ─── Pobranie kontekstu z D1 ───────────────────────────
    let contextData = '';
    if (d1) {
      try {
        if (body.strona_id) {
          const strona = await d1
            .prepare('SELECT * FROM strony_seo WHERE id = ? AND firma_id = ?')
            .bind(body.strona_id, body.firma_id)
            .first();
          if (strona) contextData += `\nDane strony: ${JSON.stringify(strona)}`;

          const rekom = await d1
            .prepare('SELECT * FROM rekomendacje_seo WHERE strona_id = ? ORDER BY created_at DESC LIMIT 20')
            .bind(body.strona_id)
            .all();
          if (rekom.results?.length) {
            contextData += `\nRekomendacje: ${JSON.stringify(rekom.results)}`;
          }

          const crawle = await d1
            .prepare('SELECT * FROM crawle_seo WHERE strona_id = ? ORDER BY crawl_time DESC LIMIT 5')
            .bind(body.strona_id)
            .all();
          if (crawle.results?.length) {
            contextData += `\nHistoria crawli: ${JSON.stringify(crawle.results)}`;
          }
        } else {
          const strony = await d1
            .prepare('SELECT * FROM strony_seo WHERE firma_id = ? LIMIT 50')
            .bind(body.firma_id)
            .all();
          if (strony.results?.length) {
            contextData += `\nStrony SEO (${strony.results.length}): ${JSON.stringify(strony.results)}`;
          }
        }
      } catch (dbErr) {
        console.warn('[seo/ai-specialist] D1 query failed:', dbErr);
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
      strona_id: body.strona_id,
    });

    // ─── Fallback: jeśli brak klucza Anthropic, użyj Google ──
    let modelConfig = MODEL_CONFIG;
    if (!envKeys.ANTHROPIC_API_KEY) {
      modelConfig = { ...MODEL_CONFIG, provider: 'google', model_id: 'gemini-2.5-flash' };
    }

    const result = await callModel(modelConfig, { system: systemPrompt, user: userPrompt }, envKeys);

    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback */ }

    return json({
      specialist: 'SEO_AI_SPECIALIST',
      model_used: modelConfig.model_id,
      result: parsedResult,
      raw_ai: result.text,
      seo_context: !!contextData,
      confidence: 92,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[seo/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'SEO_AI_SPECIALIST' }, 500);
  }
};
