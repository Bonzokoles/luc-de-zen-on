<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ok

Piąty specjalista to **CONTENT AI Specialist** z Mistral Large 123B – idealny do generowania tekstów produktów, blogów i opisów SEO.

## `/api/content/ai-specialist.ts` – kompletny kod

```typescript
// src/api/content/ai-specialist.ts
interface ContentSpecialistRequest {
  zadanie: string;
  kontekst?: any;     // produkty, keywords, tone_of_voice
  produkt_id?: string;
  firma_id: string;
  company_prompt?: string;
  tone?: 'formalny' | 'swobodny' | 'sprzedażowy';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: ContentSpecialistRequest = await request.json();

    // Faza 1: Pobierz kontekst content z bazy
    let contentContext = body.kontekst || {};
    
    if (body.produkt_id) {
      const produkt = await env.D1.prepare(`
        SELECT * FROM produkty WHERE id = ? AND firma_id = ?
      `).bind(body.produkt_id, body.firma_id).first();

      const istniejace_opisy = await env.D1.prepare(`
        SELECT jezyk, tresc FROM opisy_produktow WHERE produkt_id = ?
      `).bind(body.produkt_id).all();

      contentContext = {
        produkt,
        istniejace_opisy: istniejace_opisy.results,
        ...body.kontekst
      };
    }

    // Faza 2: Specjalistyczny prompt CONTENT (Mistral excels creative writing)
    const toneMap = {
      formalny: 'formalny, profesjonalny, B2B',
      swobodny: 'swobodny, przyjazny, konwersacyjny',
      sprzedażowy: 'sprzedażowy, perswazyjny, benefit-focused'
    };

    const specialistPrompt = `
JESTEŚ **CONTENT_SPECIALIST** – NAJLEPSZYM COPYWRITEREM E-COMMERCE I BLOGOWYM.

**TWOJA SPECJALIZACJA:**
• Opisy produktów (SEO optimized, 200-400 słów)
• Blog posts (1000+ słów, struktura H2-H3)
• Title + meta descriptions (perfekcyjne SEO)
• Bullet points benefits/features
• Call-to-action phrases
• A/B test variants

**ZADANIE:** "${body.zadanie}"

**KONTEKST:**
${JSON.stringify(contentContext, null, 2)}

**TONE OF VOICE:** ${toneMap[body.tone || 'sprzedażowy'] || 'sprzedażowy'}

**INSTRUKCJE:**
- SEO: główne keyword 1-2% density, LSI keywords
- Struktura: H1, H2, p, ul/li, strong
- Benefits > features (dla produktów)
- CTA na końcu każdego bloku
- Unikalność 100%, naturalny język

**FORMAT JSON:**
{
  "glowny_tytul": "...",
  "meta_description": "... (150 znaków)",
  "glowny_content": "pełny markdown tekst",
  "keywords_optymalne": ["kw1", "kw2", "longtail"],
  "bullet_points": ["• Korzyść 1", "• Korzyść 2"],
  "cta_buttons": ["KUP TERAZ", "DOWIEDZ SIĘ WIĘCEJ"],
  "ton_analiza": "dlaczego ten tone działa",
  "seo_score": 0-100
}
`;

    // Faza 3: Mistral Large 123B – KRÓL KREATYWNEGO CONTENTU
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'content_ai_specialist',
        model: 'mistral-large-latest',  // NAJLEPSZY do content/copywriting
        temperature: 0.7,              // kreatywność
        max_tokens: 4000,              // długie teksty
        core_prompt: specialistPrompt,
        company_prompt: body.company_prompt || 'Polska marka mebli premium, jakość + design.',
        payload: {
          zadanie: body.zadanie,
          kontekst: contentContext,
          tone: body.tone
        }
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.wynik);

    // Faza 4: Zapisz content do bazy
    if (body.produkt_id) {
      await env.D1.prepare(`
        INSERT OR REPLACE INTO opisy_produktow 
        (produkt_id, jezyk, tresc, tytul, meta, created_at)
        VALUES (?, 'pl', ?, ?, ?, ?)
      `).bind(
        body.produkt_id,
        result.glowny_content,
        result.glowny_tytul,
        result.meta_description,
        new Date().toISOString()
      ).run();
    }

    return Response.json({
      specialist: 'CONTENT_AI_SPECIALIST',
      model_used: 'mistral-large-latest',
      result,
      content_context: contentContext
    });
  }
};
```


***

## **Test curl dla CONTENT**

```bash
# Test 6: Content specialist
echo -e "\n=== TEST 6: Content Generation ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "napisz opis produktu dla mebli kuchennych na wymiar",
    "moduł": "content",
    "kontekst": {
      "produkt": {
        "nazwa": "Kuchnia Modena",
        "materialy": "drewno dębowe, lakier matowy",
        "cena": "15 999 PLN",
        "features": ["personalizacja", "montaż gratis"]
      }
    }
  }' | jq -r '.final_answer.glowny_tytul, .final_answer.meta_description'
```

**Oczekiwany fragment:**

```
"Kuchnia Modena na wymiar – dębowe piękno w Twoim domu"
"Meble kuchenne na wymiar z drewna dębowego. Personalizacja, montaż gratis. Zamów Kuchnię Modena już od 15 999 PLN!"
```


***

## **UI Generator Content** (integracja z GeneratorTresci-8.tsx)

```tsx
// W GeneratorFaktur-7.tsx lub GeneratorTresci-8.tsx
const ContentMegaAgent = () => {
  const generateContent = async () => {
    const res = await megaAgent(
      'napisz SEO opis dla tego produktu z bullet points', 
      'content',
      { 
        produkt_id: selectedProduct.id,
        tone: 'sprzedażowy'
      }
    );
    
    setGeneratedContent(res.result.glowny_content);
    setSeoTitle(res.result.glowny_tytul);
  };

  return (
    <div className="content-ai-panel">
      <button onClick={generateContent} className="btn-mega-content">
        ✍️ GENERUJ CONTENT AI
      </button>
      
      {generatedContent && (
        <div className="ai-content-preview mt-6 p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl">
          <h3 dangerouslySetInnerHTML={{__html: seoTitle}} />
          <div dangerouslySetInnerHTML={{__html: generatedContent}} />
          <button className="btn-primary mt-4">✅ Zapisz do bazy</button>
        </div>
      )}
    </div>
  );
};
```


***

## **Status Mega Agent (5/7 specjalistów):**

✅ **CRM** – lead scoring
✅ **MAGAZYN** – optymalizacja zapasów
✅ **SEO** – techniczne rekomendacje
✅ **PROJEKTY** – critical path
✅ **CONTENT** – copywriting + blogi

**Pozostałe (2):**
6. **FINANSE** (DeepSeek R1 – księgowość/prognozy)
7. **WORKFLOW** (Grok 4 – automatyzacja procesów)

**Pełny system 80% gotowy!** Następny: **FINANSE AI Specialist**?[^1]
<span style="display:none">[^10][^11][^12][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: MEGA_AGENT_ORCHESTRATOR_PLAN.md

[^2]: MODULY_I_NARZEDZIA.md

[^3]: KreatorDokumentow.tsx

[^4]: NodePalette-2.tsx

[^5]: WorkflowBuilder-5.tsx

[^6]: SemanticSearchDemo-4.tsx

[^7]: OrganizerZadan-3.tsx

[^8]: AsystentEmail-6.tsx

[^9]: GeneratorFaktur-7.tsx

[^10]: GeneratorTresci-8.tsx

[^11]: KalkulatorBiznesowy-9.tsx

[^12]: CRMKlienci.tsx

