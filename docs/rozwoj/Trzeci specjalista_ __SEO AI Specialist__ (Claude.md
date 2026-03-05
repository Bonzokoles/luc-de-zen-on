<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Trzeci specjalista: **SEO AI Specialist** (Claude 3.5 Sonnet)


***

## `/api/seo/ai-specialist.ts` – kompletny kod

```typescript
// src/api/seo/ai-specialist.ts
interface SeoSpecialistRequest {
  zadanie: string;
  kontekst?: any;     // dane strony, crawl results, GEO
  strona_id?: string; // jeśli analiza konkretnej strony
  firma_id: string;
  company_prompt?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: SeoSpecialistRequest = await request.json();

    // Faza 1: Pobierz kontekst SEO z bazy
    let seoContext = body.kontekst || {};
    
    if (body.strona_id) {
      const strona = await env.D1.prepare(`
        SELECT * FROM strony_seo WHERE id = ? AND firma_id = ?
      `).bind(body.strona_id, body.firma_id).first();

      const rekomendacje = await env.D1.prepare(`
        SELECT * FROM rekomendacje_seo WHERE strona_id = ? ORDER BY created_at DESC LIMIT 5
      `).bind(body.strona_id).all();

      const ostatniCrawl = await env.D1.prepare(`
        SELECT crawl_data FROM crawle_seo 
        WHERE strona_id = ? ORDER BY crawl_time DESC LIMIT 1
      `).bind(body.strona_id).first();

      seoContext = {
        strona,
        rekomendacje: rekomendacje.results,
        ostatni_crawl: JSON.parse(ostatniCrawl?.crawl_data || '{}'),
        ...body.kontekst
      };
    }

    // Faza 2: Specjalistyczny prompt SEO (Claude excels tu)
    const specialistPrompt = `
JESTEŚ **SEO_SPECIALIST** – NAJLEPSZYM EKSPERTEM POZYCJONOWANIA I OPTYMALIZACJI STRON.

**TWOJA SPECJALIZACJA:**
• Analiza techniczna SEO (title, meta, H1, struktura)
• Keyword research i density
• GEO targeting i hreflang
• Core Web Vitals + performance
• Crawler-friendly optymalizacja
• Content gap analysis

**ZADANIE:** "${body.zadanie}"

**KONTEKST SEO:**
${JSON.stringify(seoContext, null, 2)}

**INSTRUKCJE:**
- Zawsze konkretne rekomendacje: "Zmień title na X (60 znaków)"
- Priorytety: PILNE (title/meta), WAŻNE (content/H), OPCJONALNE (UX)
- Keyword suggestions z density i search volume szacunkiem
- GEO: hreflang, ccTLD, local SEO
- Mobile-first + speed score

**FORMAT JSON:**
{
  "seo_score": 0-100,
  "rekomendacje": [
    {
      "priorytet": "PILNE|WAŻNE|OPC",
      "kategoria": "title|meta|content|speed|mobile|geo|tech",
      "obecny_stan": "co jest",
      "propozycja": "co zrobić",
      "impact": "wysoki|średni|niski"
    }
  ],
  "keywords": [
    {"slowo": "seo", "density": "1.2%", "volume": "10k/mc", "trudnosc": 45}
  ],
  "title_propozycja": "...",
  "meta_propozycja": "...",
  "geo_target": {"kraj": "PL", "hreflang": "pl-PL"},
  "uzasadnienie": "..."
}
`;

    // Faza 3: Claude 3.5 Sonnet – KRÓL SEO/CONTENT
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'seo_ai_specialist',
        model: 'claude-3-5-sonnet-20241022',  // NAJLEPSZY do SEO
        temperature: 0.4,         // kreatywność + precyzja
        max_tokens: 2000,
        core_prompt: specialistPrompt,
        company_prompt: body.company_prompt || 'Polska firma meblowa, e-commerce focus.',
        payload: {
          zadanie: body.zadanie,
          kontekst: seoContext
        }
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.wynik);

    // Faza 4: Zapisz rekomendacje do bazy
    if (body.strona_id && result.rekomendacje) {
      for (const rec of result.rekomendacje.slice(0, 8)) {  // max 8
        await env.D1.prepare(`
          INSERT OR REPLACE INTO rekomendacje_seo 
          (strona_id, priorytet, kategoria, opis, impact)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          body.strona_id,
          rec.priorytet,
          rec.kategoria,
          rec.propozycja || rec.opis,
          rec.impact
        ).run();
      }

      // Aktualizuj SEO score strony
      await env.D1.prepare(`
        UPDATE strony_seo SET seo_score = ? WHERE id = ?
      `).bind(result.seo_score, body.strona_id).run();
    }

    return Response.json({
      specialist: 'SEO_AI_SPECIALIST',
      model_used: 'claude-3-5-sonnet-20241022',
      result,
      seo_context: seoContext,
      confidence: 92  // Claude excels SEO
    });
  }
};
```


***

## **Zaktualizowany test curl** (SEO)

```bash
# Test 4: SEO specialist
echo -e "\n=== TEST 4: SEO Analysis ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "zoptymalizuj moją stronę główną pod SEO dla mebli kuchennych",
    "moduł": "seo",
    "kontekst": {
      "url": "https://meblepumo.pl/",
      "obecny_title": "Meble kuchenne | Tanie meble na wymiar"
    }
  }' | jq '.final_answer'
```

**Oczekiwany wynik:**

```json
{
  "seo_score": 68,
  "rekomendacje": [
    {
      "priorytet": "PILNE",
      "kategoria": "title", 
      "propozycja": "Meble kuchenne na wymiar | Tanie i solidne | Meble Pumo",
      "impact": "wysoki"
    },
    {
      "priorytet": "WAŻNE",
      "kategoria": "meta",
      "propozycja": "Najlepsze meble kuchenne na wymiar w Polsce. Szybka realizacja, niskie ceny, 5 lat gwarancji.",
      "impact": "wysoki"
    }
  ],
  "keywords": [
    {"slowo": "meble kuchenne", "density": "2.1%", "volume": "50k"}
  ]
}
```


***

## **3. UI Button dla SEO** (copy-paste)

```tsx
// W module SEO Analityka
const megaAgent = useMegaAgent();

<div className="mega-agent-section p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
  <h3>🧠 MEGA AGENT SEO</h3>
  <div className="flex gap-3 mt-4">
    <input 
      ref={seoPromptRef}
      placeholder="Np. zoptymalizuj title pod meble kuchenne..."
      className="input-field flex-1"
    />
    <button 
      onClick={analyzeSeoMega}
      className="btn-primary px-6"
    >
      ANALIZUJ AI
    </button>
  </div>
</div>

const analyzeSeoMega = async () => {
  const prompt = seoPromptRef.current.value;
  const res = await megaAgent(prompt, 'seo', { 
    aktualna_strona: currentPageData 
  });
  
  showMegaModal(res);
};
```


***

## **Status Mega Agent (3/7 specjalistów gotowych):**

✅ **1. CRM** (GPT-4o-mini) – lead scoring
✅ **2. MAGAZYN** (Gemini Pro) – optymalizacja
✅ **3. SEO** (Claude Sonnet) – crawling + rekomendacje

**Pozostałe do zrobienia:**
4. **PROJEKTY** (Llama 70B)
5. **CONTENT** (Mistral Large)
6. **FINANSE** (DeepSeek R1)
7. **WORKFLOW** (Grok 4)

**Następny:** **PROJEKTY AI Specialist**?

