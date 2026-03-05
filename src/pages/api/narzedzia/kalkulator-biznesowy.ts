/**
 * POST /api/narzedzia/kalkulator-biznesowy
 *
 * Dedykowany endpoint – AI interpretacja wyników kalkulatora.
 * Tryby: margin, vat, roi, profit
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface KalkulatorBody {
  firma_id?: string;
  model?: string;
  company_prompt?: string;
  tryb: string;  // margin, vat, roi, profit
  dane: Record<string, number>;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as KalkulatorBody;

    if (!body.tryb || !body.dane) {
      return json({ error: 'Brak wymaganych pól: tryb, dane' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    const tryby: Record<string, string> = {
      margin: 'Analizuj marżę i narzut. Oceń czy cena jest konkurencyjna.',
      vat: 'Sprawdź poprawność VAT i zasugeruj optymalizację.',
      roi: 'Oceń zwrot z inwestycji i czas zwrotu. Porównaj z rynkiem.',
      profit: 'Analizuj strukturę kosztów i przychodów.',
    };

    const corePrompt = `
Jesteś doradcą biznesowym i finansowym dla firm.

TRYB ANALIZY: ${body.tryb.toUpperCase()}
DANE DO ANALIZY:
${JSON.stringify(body.dane, null, 2)}

${tryby[body.tryb] || 'Zinterpretuj wyniki.'}

ZASADY:
- 2–3 zdania podsumowania (co to znaczy dla firmy).
- 2–4 praktyczne rekomendacje (co zrobić).
- Odnieś się do realiów polskiego rynku MŚP.
- Nie dawaj porad podatkowych ani prawnych.

FORMAT:
1. **PODSUMOWANIE** (2–3 zdania)
2. **REKOMENDACJE** (lista wypunktowana •)
`.trim();

    const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });

    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
      ekonomiczny: { provider: 'deepseek', model_id: 'deepseek-chat' },
    };
    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    const result = await callModel(
      modelConfig,
      { system: systemPrompt, user: `Tryb: ${body.tryb}, dane: ${JSON.stringify(body.dane)}` },
      envKeys
    );

    return json({
      analiza: result.text,
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
      tokeny: result.tokens_used,
    });
  } catch (err: any) {
    console.error('[kalkulator-biznesowy]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
