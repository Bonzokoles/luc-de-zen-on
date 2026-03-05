/**
 * POST /api/narzedzia/asystent-email
 *
 * Dedykowany endpoint dla Asystenta Email.
 * Buduje core_prompt i wywołuje model bezpośrednio.
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface AsystentEmailBody {
  firma_id?: string;
  model?: string;
  company_prompt?: string;
  typ: string;              // oferta, przypomnienie, podziekowanie, reklamacja, followup
  ton: string;              // formalny, profesjonalny, swobodny
  jezyk?: string;
  odbiorca: string;
  kontekst: string;
  dodatkowe_punkty?: string[];
  temat?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as AsystentEmailBody;

    if (!body.kontekst) {
      return json({ error: 'Brak wymaganych pól: kontekst' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    const punktyText = body.dodatkowe_punkty?.length
      ? `\nDODATKOWE PUNKTY DO UWZGLĘDNIENIA:\n${body.dodatkowe_punkty.map(p => `- ${p}`).join('\n')}`
      : '';

    const corePrompt = `
Jesteś asystentem do pisania emaili biznesowych dla firm.

TYP EMAILA: ${body.typ}
ODBIORCA: ${body.odbiorca}
TON: ${body.ton}
KONKRET: ${body.kontekst}
${punktyText}

ZASADY:
- Polski standard korespondencji biznesowej.
- Krótko, konkretnie, uprzejmie.
- Zawsze dodaj wezwanie do odpowiedzi lub działania.
- Podpis na końcu zgodny z kontekstem firmy.

FORMAT:
${body.temat ? `Na początku: "Temat: ${body.temat}"\n` : ''}
Następnie pełna treść emaila gotowa do wklejenia (powitanie, treść, zakończenie, podpis).
`.trim();

    const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });

    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'openai', model_id: 'gpt-4o' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
      ekonomiczny: { provider: 'deepseek', model_id: 'deepseek-chat' },
    };

    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    const result = await callModel(
      modelConfig,
      { system: systemPrompt, user: JSON.stringify(body) },
      envKeys
    );

    return json({
      email: result.text,
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
      tokeny: result.tokens_used,
    });
  } catch (err: any) {
    console.error('[asystent-email]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
