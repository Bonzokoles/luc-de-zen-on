<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Narzędzie 6: Kalkulator Biznesowy (interpretacja wyników)

### Lokalny endpoint: `POST /api/narzedzia/kalkulator-biznesowy/analiza`

```typescript
// src/api/narzedzia/kalkulator-biznesowy/analiza.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      tryb: string;  // margin, vat, roi, profit
      dane: {
        // Zależnie od trybu różne pola
        costPrice?: number;
        sellPrice?: number;
        profitAmount?: number;
        marginPercent?: number;
        vatRate?: number;
        investment?: number;
        zysk_roczny?: number;
        przychod?: number;
        koszty?: number;
      };
    }>();

    // 1. Core prompt dla doradcy biznesowego
    const tryby: Record<string, string> = {
      margin: 'Analizuj marżę i narzut. Oceń czy cena jest konkurencyjna.',
      vat: 'Sprawdź poprawność VAT i zasugeruj optymalizację.',
      roi: 'Oceń zwrot z inwestycji i czas zwrotu. Porównaj z rynkiem.',
      profit: 'Analizuj strukturę kosztów i przychodów.'
    };

    const corePrompt = `
Jesteś doradcą biznesowym i finansowym dla firm.

TRYB ANALIZY: ${body.tryb.toUpperCase()}
DANE DO ANALIZY:
${JSON.stringify(body.dane, null, 2)}

${tryby[body.tryb]}

ZASADY:
- 2–3 zdania podsumowania (co to znaczy dla firmy).
- 2–4 praktyczne rekomendacje (co zrobić).
- Odnieś się do realiów polskiego rynku MŚP.
- Nie dawaj porad podatkowych ani prawnych.

FORMAT:
1. **PODSUMOWANIE** (2–3 zdania)
2. **REKOMENDACJE** (lista wypunktowana •)
`;

    // 2. Wyślij do routera AI
    const aiResponse = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'kalkulator_biznesowy',
        model: body.model,
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: body
      })
    });

    const data = await aiResponse.json();

    return Response.json({
      analiza: data.wynik,
      model_uzyty: data.model_uzyty,
      czas: data.czas
    });
  }
};
```


### UI `KalkulatorBiznesowy-9.tsx` – rozbudowa

Masz już kalkulatory (marża, VAT, ROI, zysk). Dodaj:

1. **Panel konfiguracji AI na górze (obok przycisków trybu):**
```tsx
<div className="config-ai mb-6 p-4 bg-blue-50 rounded-lg">
  <label>Interpretacja AI:</label>
  <div className="flex gap-3 mt-2">
    <select value={aiModel} onChange={e => setAiModel(e.target.value)}>
      <option value="auto">Auto</option>
      <option value="szybki">Szybka analiza</option>
      <option value="dokladny">Szczegółowa analiza</option>
    </select>
    
    <textarea 
      value={companyPrompt} 
      onChange={e => setCompanyPrompt(e.target.value)}
      placeholder="Kontekst firmy (opcjonalnie): 'Jesteśmy usługodawcą IT, zależy nam na marży >40% i szybkim zwrocie inwestycji.'"
      rows={2}
      className="flex-1"
    />
    
    <button onClick={analyzeWithAI} className="btn-primary px-6">
      🤖 Analizuj AI
    </button>
  </div>
</div>
```

2. **Po każdym obliczeniu pokaż przycisk „Analizuj AI”** (np. pod wynikami marży):
```tsx
{ marginResult && (
  <div className="analysis-section mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
    <button 
      onClick={() => analyze('margin')}
      className="btn-accent mb-3 w-full"
    >
      🤖 Poproś AI o interpretację
    </button>
    
    {aiAnalysis && (
      <div className="ai-response prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
      </div>
    )}
  </div>
)}
```

3. **Funkcja `analyzeWithAI`:**
```tsx
const analyzeWithAI = async (tryb: string) => {
  const dane = getCurrentResults(tryb); // helper pobierający aktualne wyniki kalkulatora
  
  const res = await fetch('/api/narzedzia/kalkulator-biznesowy/analiza', {
    method: 'POST',
    body: JSON.stringify({
      firma_id: 'firma_123',
      model: aiModel,
      company_prompt: companyPrompt,
      tryb: tryb,
      dane: dane
    })
  });
  
  const data = await res.json();
  setAiAnalysis(data.analiza);
};
```

**Przykład analizy AI (co zwróci):**

```
**PODSUMOWANIE**
Twoja marża brutto wynosi 33,3%, co jest średnim wynikiem dla usług IT. Narzut 50% sugeruje rozsądną strukturę kosztów, ale jest miejsce na optymalizację.

**REKOMENDACJE**
• Rozważ podniesienie ceny do 170zł – marża wzrośnie do 41% bez utraty konkurencyjności.
• Sprawdź koszty zakupu – czy można negocjować rabaty ilościowe?
• Przeprowadź analizę konkurencji – średnia marża w branży IT to 35–45%.
```


***

**Co to daje Kalkulatorowi Biznesowemu:**

- ✅ 4 tryby (marża, VAT, ROI, zysk) + interpretacja AI dla każdego,
- ✅ Kontekst firmy w analizie,
- ✅ Przełączanie modeli (szybka vs szczegółowa analiza),
- ✅ Prosty przycisk „Analizuj AI” po każdym obliczeniu.

**Następne narzędzie:** Organizer Zadań?

