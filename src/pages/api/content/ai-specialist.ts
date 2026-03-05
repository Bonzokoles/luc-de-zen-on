/**
 * POST /api/content/ai-specialist
 *
 * Content AI Specialist — Mistral Large
 * Opisy produktów, blog posts, SEO copy, A/B variants
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface ContentSpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  produkt_id?: string;
  firma_id: string;
  company_prompt?: string;
  tone?: 'formalny' | 'swobodny' | 'sprzedazowy';
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const TONE_MAP: Record<string, string> = {
  formalny: 'formalny, profesjonalny, B2B',
  swobodny: 'swobodny, przyjazny, konwersacyjny',
  sprzedazowy: 'sprzedażowy, perswazyjny, benefit-focused',
};

const CORE_PROMPT = `JESTEŚ **CONTENT_SPECIALIST** – NAJLEPSZYM COPYWRITEREM E-COMMERCE I BLOGOWYM.

**TWOJA SPECJALIZACJA:**
• Opisy produktów (SEO optimized, 200-400 słów)
• Blog posts (1000+ słów, struktura H2-H3)
• Title + meta descriptions (perfekcyjne SEO)
• Bullet points benefits/features
• Call-to-action phrases
• A/B test variants

**INSTRUKCJE:**
- SEO: główne keyword 1-2% density, LSI keywords
- Struktura: H1, H2, p, ul/li, strong
- Benefits > features (dla produktów)
- CTA na końcu każdego bloku
- Unikalność 100%, naturalny język

**FORMAT ODPOWIEDZI (JSON):**
{
  "glowny_tytul": "...",
  "meta_description": "... (150 znaków)",
  "glowny_content": "pełny markdown tekst",
  "keywords_optymalne": ["kw1", "kw2", "longtail"],
  "bullet_points": ["• Korzyść 1", "• Korzyść 2"],
  "cta_buttons": ["KUP TERAZ", "DOWIEDZ SIĘ WIĘCEJ"],
  "ton_analiza": "dlaczego ten tone działa",
  "seo_score": "0-100"
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'mistral',
  model_id: 'mistral-large-latest',
  nazwa_logiczna: 'CONTENT_SPECIALIST',
  temperature: 0.7,
  max_tokens: 4000,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as ContentSpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      MISTRAL_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'MISTRAL_API_KEY'),
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ─── Pobranie kontekstu z D1 ───────────────────────────
    let contextData = '';
    if (d1) {
      try {
        if (body.produkt_id) {
          const produkt = await d1
            .prepare('SELECT * FROM produkty WHERE id = ? AND firma_id = ?')
            .bind(body.produkt_id, body.firma_id)
            .first();
          if (produkt) contextData += `\nProdukt: ${JSON.stringify(produkt)}`;

          const opisy = await d1
            .prepare('SELECT * FROM opisy_produktow WHERE produkt_id = ? ORDER BY created_at DESC LIMIT 5')
            .bind(body.produkt_id)
            .all();
          if (opisy.results?.length) {
            contextData += `\nIstniejące opisy: ${JSON.stringify(opisy.results)}`;
          }
        } else {
          const produkty = await d1
            .prepare('SELECT * FROM produkty WHERE firma_id = ? LIMIT 50')
            .bind(body.firma_id)
            .all();
          if (produkty.results?.length) {
            contextData += `\nProdukty (${produkty.results.length}): ${JSON.stringify(produkty.results)}`;
          }
        }
      } catch (dbErr) {
        console.warn('[content/ai-specialist] D1 query failed:', dbErr);
      }
    }

    // ─── Budowanie promptu z tone ───────────────────────────
    const toneDesc = TONE_MAP[body.tone || 'sprzedazowy'] || TONE_MAP.sprzedazowy;
    const fullPrompt = `${CORE_PROMPT}\n\n**TONE OF VOICE:** ${toneDesc}`;

    const systemPrompt = buildSystemPrompt({
      corePrompt: fullPrompt,
      kontekstNarzedzia: contextData || undefined,
      companyPrompt: body.company_prompt,
    });

    const userPrompt = JSON.stringify({
      zadanie: body.zadanie,
      kontekst: body.kontekst || {},
      produkt_id: body.produkt_id,
      tone: body.tone || 'sprzedazowy',
    });

    // ─── Fallback: jeśli brak klucza Mistral, użyj Google ──
    let modelConfig = MODEL_CONFIG;
    if (!envKeys.MISTRAL_API_KEY) {
      modelConfig = { ...MODEL_CONFIG, provider: 'google', model_id: 'gemini-2.5-flash' };
    }

    const result = await callModel(modelConfig, { system: systemPrompt, user: userPrompt }, envKeys);

    // ─── Zapis opisu do D1 ──────────────────────────────────
    if (d1 && body.produkt_id) {
      try {
        await d1
          .prepare('INSERT INTO opisy_produktow (produkt_id, firma_id, jezyk, tresc, tytul, tone, ai_model) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(body.produkt_id, body.firma_id, 'pl', result.text, body.zadanie, body.tone || 'sprzedazowy', modelConfig.model_id)
          .run();
      } catch (saveErr) {
        console.warn('[content/ai-specialist] Save failed:', saveErr);
      }
    }

    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback */ }

    return json({
      specialist: 'CONTENT_AI_SPECIALIST',
      model_used: modelConfig.model_id,
      result: parsedResult,
      raw_ai: result.text,
      content_context: !!contextData,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[content/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'CONTENT_AI_SPECIALIST' }, 500);
  }
};
