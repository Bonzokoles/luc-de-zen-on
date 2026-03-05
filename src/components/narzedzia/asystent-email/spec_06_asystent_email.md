<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Narzędzie 5: Asystent Email

### Lokalny endpoint: `POST /api/narzedzia/asystent-email`

```typescript
// src/api/narzedzia/asystent-email.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      typ: string;              // oferta, przypomnienie, podziekowanie, reklamacja
      ton: string;              // formalny, profesjonalny, swobodny
      jezyk: string;
      odbiorca: string;
      kontekst: string;
      dodatkowe_punkty?: string[];
      temat?: string;
    }>();

    // 1. Core prompt dla Asystenta Email
    const corePrompt = `
Jesteś asystentem do pisania emaili biznesowych dla firm.

TYP EMAILA: ${body.typ}
ODBIORCA: ${body.odbiorca}
TON: ${body.ton}
KONKRET: ${body.kontekst}

${body.dodatkowe_punkty?.length ? `DODATKOWE PUNKTY DO UWZGLĘDNIENIA:\n${body.dodatkowe_punkty.join('\n')}` : ''}

ZASADY:
- Polski standard korespondencji biznesowej.
- Krótko, konkretnie, uprzejmie.
- Zawsze dodaj wezwanie do odpowiedzi lub działania.
- Podpis na końcu zgodny z kontekstem firmy.

FORMAT:
${body.temat ? 'Na początku: "Temat: ' + body.temat + '"\n' : ''}
Następnie pełna treść emaila gotowa do wklejenia (powitanie, treść, zakończenie, podpis).
`;

    // 2. Wyślij do routera AI
    const aiResponse = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'asystent_email',
        model: body.model,
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: body
      })
    });

    const data = await aiResponse.json();

    return Response.json({
      email: data.wynik,
      model_uzyty: data.model_uzyty,
      czas: data.czas,
      tokeny: data.tokeny
    });
  }
};
```


### UI `AsystentEmail-6.tsx` – rozbudowa

W Twoim pliku masz już generator. Dodaj:

1. **Selektory na górze:**
```tsx
<div className="config-panel mb-6 p-4 bg-gray-50 rounded-lg">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div>
      <label>Typ emaila:</label>
      <select value={typ} onChange={e => setTyp(e.target.value)}>
        <option value="oferta">Oferta handlowa</option>
        <option value="przypomnienie">Przypomnienie płatności</option>
        <option value="podziekowanie">Podziękowanie</option>
        <option value="reklamacja">Reklamacja</option>
        <option value="followup">Follow-up</option>
        <option value="zaproszenie">Zaproszenie na spotkanie</option>
      </select>
    </div>
    
    <div>
      <label>Ton:</label>
      <select value={ton} onChange={e => setTon(e.target.value)}>
        <option value="formalny">Formalny</option>
        <option value="profesjonalny">Profesjonalny</option>
        <option value="swobodny">Swobodny</option>
      </select>
    </div>
    
    <div>
      <label>Odbiorca:</label>
      <input 
        value={odbiorca} 
        onChange={e => setOdbiorca(e.target.value)}
        placeholder="Dyrektor zakupów, klient VIP, partner biznesowy..."
      />
    </div>
    
    <div>
      <label>Model AI:</label>
      <select value={model} onChange={e => setModel(e.target.value)}>
        <option value="auto">Auto (najlepszy dostępny)</option>
        <option value="szybki">Szybki (Gemini)</option>
        <option value="dokladny">Dokładny (GPT-4o)</option>
      </select>
    </div>
  </div>
</div>
```

2. **Główne pole input + dodatkowe punkty:**
```tsx
<div className="mb-6">
  <label>Krótki opis sytuacji / główny cel emaila:</label>
  <textarea 
    value={kontekst} 
    onChange={e => setKontekst(e.target.value)}
    rows={4}
    placeholder="Np. 'Chcemy zaproponować pierwsze spotkanie i przedstawić ofertę usług. Klient pytał o wdrożenie CRM.'"
  />
</textarea>
  
<div className="mt-4">
  <label>Dodatkowe punkty do uwzględnienia (opcjonalnie):</label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {dodatkowe_punkty.map((punkt, index) => (
      <div key={index} className="flex gap-2">
        <input 
          value={punkt} 
          onChange={e => updatePunkt(index, e.target.value)}
          className="flex-1 input-field"
          placeholder={`Punkt ${index+1}`}
        />
        <button onClick={() => usunPunkt(index)} className="btn-danger">×</button>
      </div>
    ))}
    <button onClick={dodajPunkt} className="btn-secondary">+ Dodaj punkt</button>
  </div>
</div>
```

3. **Przycisk generowania + wynik:**
```tsx
<button onClick={generateEmail} className="btn-primary w-full mb-6">
  📧 Wygeneruj email
</button>

{generatedEmail && (
  <div className="email-preview p-6 bg-white border rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h3>📧 Wygenerowany email</h3>
      <div className="flex gap-2">
        <button onClick={copyEmail} className="btn-secondary">📋 Kopiuj</button>
        <button onClick={generateAlternative} className="btn-accent">
          🔄 Inna wersja
        </button>
      </div>
    </div>
    
    <div 
      className="prose max-w-none whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: generatedEmail }}
    />
    
    {usedModel && (
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        Użyto modelu: {usedModel.nazwa_logiczna} ({usedModel.provider})
      </div>
    )}
  </div>
)}
```

4. **Funkcja `generateAlternative`:**
```tsx
const generateAlternative = async () => {
  setAlternativeMode(!alternativeMode);
  // Przełącza model z 'auto' na 'szybki' lub odwrotnie
  const nextModel = model === 'auto' ? 'szybki' : 'auto';
  // ponowne wywołanie z tym samym kontekstem
};
```

**Co to daje Asystentowi Email:**

- ✅ Selektory typu i tonu,
- ✅ Lista „dodatkowych punktów” do uwzględnienia,
- ✅ Przełączanie modeli („Inna wersja”),
- ✅ Wspólny router `/api/ai/execute` + company_prompt,
- ✅ Gotowy do kopiowania email.

**Następne narzędzie:** Kalkulator Biznesowy?

