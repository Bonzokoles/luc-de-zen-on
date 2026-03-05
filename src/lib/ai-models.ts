/**
 * MYBONZO AI — Wspólna warstwa wywołań modeli AI
 *
 * Obsługiwane providery:
 * - google   → Gemini 2.5 Flash / Pro
 * - openai   → GPT-4o / GPT-4o-mini
 * - deepseek → DeepSeek Chat
 *
 * Używane przez /api/ai/execute (router) oraz per-narzędzie endpointy.
 */

// ─── Typy ───────────────────────────────────────────────
export interface AIModelConfig {
  provider: string;
  model_id: string;
  nazwa_logiczna?: string;
}

export interface AIPrompt {
  system: string;
  user: string;
}

export interface AIResult {
  text: string;
  duration_ms: number;
  tokens_used: { input: number; output: number };
}

export interface AIEnvKeys {
  GOOGLE_API_KEY?: string;
  OPENAI_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
}

// ─── Dispatcher ─────────────────────────────────────────
export async function callModel(
  config: AIModelConfig,
  prompt: AIPrompt,
  env: AIEnvKeys
): Promise<AIResult> {
  const start = Date.now();

  switch (config.provider) {
    case 'google':
      return callGemini(config.model_id, prompt, env.GOOGLE_API_KEY!, start);
    case 'openai':
      return callOpenAI(config.model_id, prompt, env.OPENAI_API_KEY!, start);
    case 'deepseek':
      return callDeepSeek(config.model_id, prompt, env.DEEPSEEK_API_KEY!, start);
    default:
      throw new Error(`Nieznany provider: ${config.provider}`);
  }
}

// ─── Google Gemini ──────────────────────────────────────
async function callGemini(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number
): Promise<AIResult> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt.system },
              { text: '\n---\n' + prompt.user },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4096,
          topP: 0.9,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${modelId} error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const usage = data.usageMetadata;

  return {
    text,
    duration_ms: Date.now() - start,
    tokens_used: {
      input: usage?.promptTokenCount ?? 0,
      output: usage?.candidatesTokenCount ?? 0,
    },
  };
}

// ─── OpenAI ─────────────────────────────────────────────
async function callOpenAI(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number
): Promise<AIResult> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      max_tokens: 4096,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${modelId} error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  return {
    text: data.choices?.[0]?.message?.content ?? '',
    duration_ms: Date.now() - start,
    tokens_used: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
  };
}

// ─── DeepSeek ───────────────────────────────────────────
async function callDeepSeek(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number
): Promise<AIResult> {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      max_tokens: 4096,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek ${modelId} error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  return {
    text: data.choices?.[0]?.message?.content ?? '',
    duration_ms: Date.now() - start,
    tokens_used: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
  };
}

// ─── Helper: pobieranie kluczy z Cloudflare env ─────────
export function getEnvKey(
  env: Record<string, string | undefined>,
  key: string
): string | undefined {
  return (
    env[key] ??
    env[` ${key}`] ??
    Object.entries(env).find(([k]) => k.trim() === key)?.[1]
  );
}
