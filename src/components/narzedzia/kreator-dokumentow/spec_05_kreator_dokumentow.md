<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Narzędzie 3: Kreator Dokumentów

### Lokalny endpoint: `POST /api/narzedzia/kreator-dokumentow`

```typescript
// src/api/narzedzia/kreator-dokumentow.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      rodzaj: string;              // umowa_uslug, umowa_sprzedazy, regulamin, polityka_prywatnosci
      poziom_szczegolowosci: string; // prosty, sredni, pelny
      jezyk: string;
      dane: {
        strona_A?: string;
        strona_B?: string;
        przedmiot: string;
        okres?: string;
        wynagrodzenie?: string;
        miejsce?: string;
        inne_punkty?: string[];
      };
    }>();

    // 1. Core prompt dla Kreatora Dokumentów
    const corePrompt = `
Jesteś asystentem prawnym generującym SZABLONY dokumentów biznesowych.

RODZAJ DOKUMENTU: ${body.rodzaj}
POZIOM SZCZEGÓŁOWOŚCI: ${body.poziom_szczegolowosci}

DANE:
${JSON.stringify(body.dane, null, 2)}

ZASADY:
- Twórz SZABLONY do dalszej edycji, NIE gotowe dokumenty prawne.
- Na początku dodaj OSTRZEŻENIE: "Ten dokument jest szablonem wygenerowanym przez AI. Przed użyciem skonsultuj z prawnikiem."
- Struktura: Strony, Przedmiot, Wynagrodzenie/Cena, Obowiązki stron, Termin, Odpowiedzialność, Postanowienia końcowe.
- Gdzie brakuje danych: wstaw [UZUPEŁNIJ: ...].
- Język: ${body.jezyk} (polski standard biznesowy).

FORMAT:
Zwróć pełny tekst dokumentu z paragrafami i numeracją §1, §2 itd.
Bez dodatkowych komentarzy poza ostrzeżeniem na górze.
`;

    // 2. Wyślij do routera AI
    const aiResponse = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'kreator_dokumentow',
        model: body.model,  // GPT-4o dobry na precyzję prawniczą
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: body
      })
    });

    const data = await aiResponse.json();

    return Response.json({
      dokument: data.wynik,
      model_uzyty: data.model_uzyty,
      czas: data.czas,
      ostrzezenie: "Ten dokument jest szablonem AI. Skonsultuj z prawnikiem przed użyciem."
    });
  }
};
```


### UI `KreatorDokumentow.tsx` – rozbudowa

W Twoim pliku masz już podstawę. Dodaj:

1. **Selektor typu dokumentu:**
```tsx
<select value={rodzaj} onChange={e => setRodzaj(e.target.value)}>
  <option value="umowa_uslug">Umowa o świadczenie usług</option>
  <option value="umowa_sprzedazy">Umowa sprzedaży</option>
  <option value="umowa_zlecenia">Umowa zlecenia</option>
  <option value="regulamin">Regulamin serwisu/sklepu</option>
  <option value="polityka_prywatnosci">Polityka prywatności</option>
  <option value="oferta">Oferta handlowa</option>
</select>
```

2. **Selektor poziomu szczegółowości:**
```tsx
<select value={poziom_szczegolowosci} onChange={e => setPoziom(e.target.value)}>
  <option value="prosty">Szkic prosty (szybki)</option>
  <option value="sredni">Średni (standardowy)</option>
  <option value="pelny">Pełny dokument (dokładny)</option>
</select>
```

3. **Panel „Kontekst firmy” (system prompt):**
```tsx
<div className="form-group">
  <label>Kontekst firmy / dodatkowe instrukcje:</label>
  <textarea 
    value={companyPrompt} 
    onChange={e => setCompanyPrompt(e.target.value)}
    placeholder="Np. 'Jesteśmy firmą IT z Polski, tworzymy umowy z programistami zdalnymi. Zawsze dodawaj klauzulę o poufności.'"
    rows={3}
  />
</textarea>
```

4. **Formularz danych dokumentu (dynamiczny na podstawie `rodzaj`):**
```tsx
// Na podstawie typu dokumentu pokazuj różne pola
{rodzaj === 'umowa_uslug' && (
  <>
    <input placeholder="Przedmiot usługi (np. 'tworzenie strony www')" />
    <input placeholder="Okres świadczenia (np. '12 miesięcy')" />
    <input placeholder="Wynagrodzenie (np. '5000 PLN netto miesięcznie')" />
  </>
)}
{rodzaj === 'umowa_sprzedazy' && (
  <>
    <input placeholder="Przedmiot sprzedaży" />
    <input placeholder="Cena netto" />
    <input placeholder="Warunki dostawy" />
  </>
)}
```

5. **Przycisk generowania + wynik:**
```tsx
<button onClick={generateDocument}>Generuj dokument</button>

{generatedDocument && (
  <div className="document-preview">
    <div className="warning bg-yellow-100 p-3 rounded mb-4">
      ⚠️ Dokument wygenerowany przez AI. Skonsultuj z prawnikiem przed użyciem.
    </div>
    <div 
      className="document-content prose max-w-none"
      dangerouslySetInnerHTML={{ __html: generatedDocument }}
    />
    <div className="mt-4">
      <button onClick={copyToClipboard}>Kopiuj do schowka</button>
      <button onClick={downloadPdf}>Pobierz PDF</button>
      <button onClick={generateAlternative}>Inny model</button>
    </div>
  </div>
)}
```


### 6. Obsługa „Inny model”

```tsx
const generateAlternative = async () => {
  const res = await fetch('/api/narzedzia/kreator-dokumentow', {
    method: 'POST',
    body: JSON.stringify({
      ...currentRequest,
      model: currentModel === 'auto' ? 'szybki' : 'auto'  // przełącz
    })
  });
  
  const data = await res.json();
  setAlternativeDocument(data.dokument);
};
```


***

**Co to daje:**

- ✅ Jeden endpoint `/api/ai/execute` dla wszystkich narzędzi (już masz),
- ✅ Kreator Dokumentów ma swój `core_prompt` + `company_prompt` od użytkownika,
- ✅ Automatyczne ostrzeżenie prawne,
- ✅ Przełączanie modeli („Inny model”),
- ✅ UI z selektorami typu dokumentu i szczegółowości,
- ✅ Zapis do `/dokumenty_finansowe` (jeśli chcesz integrację z modułem Dokumenty).

**Następne narzędzie:** Generator Faktur?

