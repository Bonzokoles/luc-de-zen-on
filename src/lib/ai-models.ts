/**
 * MYBONZO AI — Wspólna warstwa wywołań modeli AI
 *
 * Obsługiwane providery:
 * - google    → Gemini 2.5 Flash / Pro / 2.0 Flash
 * - openai    → GPT-4o / GPT-4o-mini
 * - deepseek  → DeepSeek Chat / R1
 * - anthropic → Claude 3.5 Sonnet
 * - groq      → Llama 3.1 70B
 * - mistral   → Mistral Large
 * - xai       → Grok 4
 *
 * Używane przez /api/ai/execute (router) oraz per-narzędzie endpointy.
 */

// ─── Typy ───────────────────────────────────────────────
export interface AIModelConfig {
  provider: string;
  model_id: string;
  nazwa_logiczna?: string;
  temperature?: number;
  max_tokens?: number;
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
  ANTHROPIC_API_KEY?: string;
  GROQ_API_KEY?: string;
  MISTRAL_API_KEY?: string;
  XAI_API_KEY?: string;
}

// ─── Dispatcher ─────────────────────────────────────────
export async function callModel(
  config: AIModelConfig,
  prompt: AIPrompt,
  env: AIEnvKeys
): Promise<AIResult> {
  const start = Date.now();
  const temp = config.temperature ?? 0.4;
  const maxTok = config.max_tokens ?? 4096;

  switch (config.provider) {
    case 'google':
      return callGemini(config.model_id, prompt, env.GOOGLE_API_KEY!, start, temp, maxTok);
    case 'openai':
      return callOpenAI(config.model_id, prompt, env.OPENAI_API_KEY!, start, temp, maxTok);
    case 'deepseek':
      return callDeepSeek(config.model_id, prompt, env.DEEPSEEK_API_KEY!, start, temp, maxTok);
    case 'anthropic':
      return callAnthropic(config.model_id, prompt, env.ANTHROPIC_API_KEY!, start, temp, maxTok);
    case 'groq':
      return callGroq(config.model_id, prompt, env.GROQ_API_KEY!, start, temp, maxTok);
    case 'mistral':
      return callMistral(config.model_id, prompt, env.MISTRAL_API_KEY!, start, temp, maxTok);
    case 'xai':
      return callXAI(config.model_id, prompt, env.XAI_API_KEY!, start, temp, maxTok);
    default:
      throw new Error(`Nieznany provider: ${config.provider}`);
  }
}

// ─── Google Gemini ──────────────────────────────────────
async function callGemini(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number,
  temperature: number = 0.4,
  maxTokens: number = 4096
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
          temperature,
          maxOutputTokens: maxTokens,
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
  start: number,
  temperature: number = 0.4,
  maxTokens: number = 4096
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
      max_tokens: maxTokens,
      temperature,
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
  start: number,
  temperature: number = 0.4,
  maxTokens: number = 4096
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
      max_tokens: maxTokens,
      temperature,
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

// ─── Anthropic (Claude) ─────────────────────────────────
async function callAnthropic(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number,
  temperature: number = 0.4,
  maxTokens: number = 4096
): Promise<AIResult> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: maxTokens,
      temperature,
      system: prompt.system,
      messages: [
        { role: 'user', content: prompt.user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${modelId} error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const text = data.content?.find((c) => c.type === 'text')?.text ?? '';

  return {
    text,
    duration_ms: Date.now() - start,
    tokens_used: {
      input: data.usage?.input_tokens ?? 0,
      output: data.usage?.output_tokens ?? 0,
    },
  };
}

// ─── Groq (Llama) ───────────────────────────────────────
async function callGroq(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number,
  temperature: number = 0.4,
  maxTokens: number = 4096
): Promise<AIResult> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${modelId} error ${res.status}: ${err}`);
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

// ─── Mistral ────────────────────────────────────────────
async function callMistral(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number,
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<AIResult> {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
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
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mistral ${modelId} error ${res.status}: ${err}`);
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

// ─── xAI (Grok) ────────────────────────────────────────
async function callXAI(
  modelId: string,
  prompt: AIPrompt,
  apiKey: string,
  start: number,
  temperature: number = 0.3,
  maxTokens: number = 4096
): Promise<AIResult> {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
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
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`xAI ${modelId} error ${res.status}: ${err}`);
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
