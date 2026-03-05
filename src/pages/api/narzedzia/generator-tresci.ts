/**
 * POST /api/narzedzia/generator-tresci
 *
 * Dedykowany endpoint dla Generatora Treści.
 * Buduje core_prompt i deleguje do /api/ai/execute.
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { CORE_PROMPTS, buildSystemPrompt } from '../../../lib/ai-prompts';

interface GeneratorTresciBody {
  firma_id?: string;
  model?: string;
  company_prompt?: string;
  typ: string;          // post_social, opis_produktu, newsletter, artykul
  kanal: string;        // facebook, linkedin, instagram, blog
  ton: string;          // profesjonalny, swobodny, formalny
  dlugosc: string;      // krotka, srednia, dluga
  jezyk?: string;       // pl, en
  opis: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as GeneratorTresciBody;

    if (!body.opis) {
      return json({ error: 'Brak wymaganych pól: opis' }, 400);
    }

    // ─── Env keys ─────────────────────────────────────────
    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    // ─── Core prompt specyficzny dla Generatora Treści ────
    const corePrompt = `
Jesteś polskim copywriterem i marketerem pracującym dla firm.

ZADANIE:
- Twórz treści marketingowe na podstawie opisu.
- Typ: ${body.typ}
- Kanał: ${body.kanal}
- Ton: ${body.ton}
- Długość: ${body.dlugosc}
- Język: ${body.jezyk || 'pl'}

ZASADY:
- Dopasuj ton do kanału (LinkedIn profesjonalny, Instagram swobodny).
- Nie wymyślaj danych – używaj tylko opisu.
- Social media: dodaj 3–5 hashtagów na końcu.

FORMAT:
Zwróć gotowy tekst do użycia.
`.trim();

    // ─── Buduj system prompt ──────────────────────────────
    const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });

    // ─── Wybierz model ────────────────────────────────────
    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
      ekonomiczny: { provider: 'deepseek', model_id: 'deepseek-chat' },
    };

    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    // ─── Wywołaj model ────────────────────────────────────
    const userMessage = JSON.stringify({
      typ: body.typ,
      kanal: body.kanal,
      ton: body.ton,
      dlugosc: body.dlugosc,
      opis: body.opis,
    });

    const result = await callModel(
      modelConfig,
      { system: systemPrompt, user: userMessage },
      envKeys
    );

    return json({
      tresc: result.text,
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
      tokeny: result.tokens_used,
    });
  } catch (err: any) {
    console.error('[generator-tresci]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
