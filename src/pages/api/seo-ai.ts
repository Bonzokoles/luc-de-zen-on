import type { APIContext } from "astro";
export const prerender = false;

async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2500
    })
  });
  if (!res.ok) throw new Error("OpenAI " + res.status + ": " + await res.text());
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content || "{}";
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json", maxOutputTokens: 2500 }
      })
    }
  );
  if (!res.ok) throw new Error("Gemini " + res.status + ": " + await res.text());
  const data = await res.json() as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}

async function callDeepSeek(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2500
    })
  });
  if (!res.ok) throw new Error("DeepSeek " + res.status + ": " + await res.text());
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content || "{}";
}

function parseJSON(raw: string): any {
  const clean = raw.replace(/\r?\n/g, "").trim();
  return JSON.parse(clean);
}

async function crawlUrl(url: string): Promise<string> {
  const jinaUrl = "https://r.jina.ai/" + url;
  const res = await fetch(jinaUrl, {
    headers: { "Accept": "text/plain", "X-Return-Format": "markdown" },
    signal: AbortSignal.timeout(15000)
  });
  const text = await res.text();
  return text.slice(0, 5000);
}

export async function POST({ request, locals }: APIContext) {
  const env = (locals as any).runtime?.env || {};
  const body = await request.json() as any;
  const { action, query, url, model = "gpt-4o" } = body;

  const callAI = (prompt: string): Promise<string> => {
    if (model === "gemini") return callGemini(env.GEMINI_API_KEY || "", prompt);
    if (model === "deepseek") return callDeepSeek(env.DEEPSEEK_API_KEY || "", prompt);
    return callOpenAI(env.OPENAI_API_KEY || "", model, prompt);
  };

  try {
    // ---- KEYWORDS ACTION ----
    if (action === "keywords") {
      const prompt = `You are a Polish SEO expert. Research keywords for the Polish market for query: ${JSON.stringify(query)}. Return ONLY valid JSON with this structure: { "keywords": [ { "keyword": string, "volume": number, "difficulty": number (0-100), "cpc": number (PLN), "trend": "up"|"down"|"stable", "intent": "informational"|"commercial"|"transactional", "aiInsight": string (tip in Polish) } ], "topInsight": string (in Polish), "marketAnalysis": string (in Polish), "competitorStrategy": string (in Polish) }. Generate 10-12 keyword variations (long-tail, questions, brand+keyword, location-based). Volume and CPC should be realistic for Poland. All text in Polish.`;
      const raw = await callAI(prompt);
      const result = parseJSON(raw);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ---- CRAWL ACTION ----
    if (action === "crawl") {
      const pageContent = await crawlUrl(url);
      const prompt = `You are a Polish SEO expert. Analyze this webpage for SEO. URL: ${url}. Content: ${pageContent}. Return ONLY valid JSON: { "scores": { "overall": number, "title": number, "description": number, "headings": number, "content": number, "performance": number }, "detectedKeywords": [ { "keyword": string, "count": number, "density": number } ], "issues": [ { "severity": "error"|"warning"|"info", "title": string, "description": string, "fix": string } ], "strengths": [string], "recommendations": [string], "contentSummary": string, "estimatedRank": string }. All text fields in Polish.`;
      const raw = await callAI(prompt);
      const result = parseJSON(raw);
      return new Response(JSON.stringify({ ...result, crawledUrl: url, model }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ---- ONPAGE ACTION ----
    if (action === "onpage") {
      const pageContent = await crawlUrl(url);
      const prompt = `Analyze on-page SEO for URL: ${url}. Content: ${pageContent}. Return ONLY valid JSON: { "title": { "value": string, "score": number, "issue": string }, "description": { "value": string, "score": number, "issue": string }, "h1": { "value": string, "score": number }, "wordCount": number, "readabilityScore": number, "internalLinks": number, "externalLinks": number, "images": { "total": number, "withAlt": number }, "structuredData": boolean, "overallScore": number, "quickWins": [string], "priorityFixes": [string] }. All text in Polish.`;
      const raw = await callAI(prompt);
      const result = parseJSON(raw);
      return new Response(JSON.stringify({ ...result, url, model }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
