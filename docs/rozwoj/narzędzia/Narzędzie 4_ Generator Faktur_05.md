<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Narzędzie 4: Generator Faktur

### Lokalny endpoint: `POST /api/narzedzia/generator-faktur`

Masz już logikę liczenia VAT i PDF. Dodajemy AI‑asystenta do:

- automatycznego uzupełniania opisów pozycji,
- walidacji faktury,
- sugestii kategorii kosztów.

```typescript
// src/api/narzedzia/generator-faktur.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      faktura: {
        sprzedawca: { nazwa: string; nip: string; adres: string; email: string; telefon?: string };
        nabywca: { nazwa: string; nip: string; adres: string; email?: string };
        pozycje: Array<{
          nazwa: string;
          ilosc: number;
          cena_jedn_netto: number;
          vat_stawka: number;
        }>;
        sposob_platnosci: string;
        nr_konta?: string;
        termin_platnosci?: string;
      };
      akcja: 'oblicz' | 'opisy_ai' | 'walidacja_ai';
    }>();

    if (body.akcja === 'oblicz') {
      // Twoja istniejąca logika liczenia VAT i sum
      const wynik = obliczFakture(body.faktura);
      return Response.json(wynik);
    }

    if (body.akcja === 'opisy_ai') {
      // AI‑asystent opisów pozycji
      return handleOpisyPozycjiAI(body, env);
    }

    if (body.akcja === 'walidacja_ai') {
      // Walidacja faktury
      return handleWalidacjaFakturyAI(body, env);
    }
  }
};
```


### 1. AI‑asystent opisów pozycji

**Funkcja `handleOpisyPozycjiAI`:**

```typescript
async function handleOpisyPozycjiAI(body: any, env: Env) {
  const corePrompt = `
Jesteś asystentem księgowo-sprzedażowym generującym OPISY POZYCJI FAKTURY.

ZADANIE:
Dla każdej pozycji stwórz krótki, czytelny opis (1–2 zdania) zrozumiały dla klienta i księgowego.

PRZYKŁADY WEJŚCIA:
- "Usługa IT" → "Świadczenie usług programistycznych (kodowanie i testy)"
- "Meble" → "Dostawa i montaż mebli biurowych (model XYZ)"

ZASADY:
- Nie dodawaj warunków handlowych ani cen.
- Używaj języka polskiego biznesowego.
- Nie interpretuj podatkowo (brak VAT, marż).

FORMAT JSON:
{
  "pozycje": [
    {
      "oryginal": "nazwa wejściowa",
      "sugerowany_opis": "czytelny opis pozycji"
    },
    ...
  ]
}
`;

  const payload = {
    firma_id: body.firma_id,
    narzedzie: 'generator_faktur_opisy',
    model: body.model,
    core_prompt: corePrompt,
    company_prompt: body.company_prompt,
    payload: {
      pozycje: body.faktura.pozycje.map((p: any) => p.nazwa),
      jezyk: 'pl'
    }
  };

  const aiResponse = await fetch(`${request.url.origin}/api/ai/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await aiResponse.json();
  return Response.json({
    opisy: JSON.parse(data.wynik).pozycje,
    model_uzyty: data.model_uzyty
  });
}
```


### 2. Walidacja faktury przez AI

**Funkcja `handleWalidacjaFakturyAI`:**

```typescript
async function handleWalidacjaFakturyAI(body: any, env: Env) {
  const corePrompt = `
Jesteś księgowym weryfikującym faktury. Przeanalizuj poprawność danych.

FAKTURA DO SPRAWDZENIA:
Sprzedawca: ${body.faktura.sprzedawca.nazwa} (${body.faktura.sprzedawca.nip})
Nabywca: ${body.faktura.nabywca.nazwa} (${body.faktura.nabywca.nip})

Pozycje (${body.faktura.pozycje.length} szt.):
${body.faktura.pozycje.map((p: any, i: number) => 
  `${i+1}. ${p.nazwa} x${p.ilosc} @ ${p.cena_jedn_netto}zł (${p.vat_stawka}%)`
).join('\n')}

Suma brutto: ${body.faktura.pozycje.reduce((sum: number, p: any) => sum + p.cena_jedn_netto * p.ilosc * (1 + p.vat_stawka/100), 0).toFixed(2)}zł

ZADANIE:
Sprawdź poprawność faktury i zasugeruj poprawki.

SPRAWDŹ:
1. Czy NIP‑y wyglądają poprawnie (10 cyfr)?
2. Czy stawki VAT są sensowne (0%, 5%, 8%, 23%)?
3. Czy nazwy pozycji są czytelne?
4. Czy suma się zgadza?

FORMAT JSON:
{
  "status": "OK" | "BŁĄD" | "OSTRZEŻENIE",
  "wyniki": [
    {
      "sprawdzane": "NIP sprzedawcy",
      "status": "OK" | "BŁĄD",
      "komentarz": "Poprawny format NIP"
    }
  ],
  "sugestie": ["Popraw nazwę pozycji 3", "Sprawdź stawkę VAT"],
  "zalecana_akcja": "zatwierdz" | "popraw" | "odrzuc"
}
`;

  // ... analogicznie jak wyżej, wysyła do /api/ai/execute
}
```


### 3. UI `GeneratorFaktur-7.tsx` – rozbudowa

W Twoim pliku masz już tabelę pozycji i PDF. Dodaj:

1. **Przy każdej pozycji przycisk „✏️ Opis AI”**:
```tsx
<button onClick={() => generateOpisPozycji(index)}>
  ✏️ Opis AI
</button>
```

2. **Przycisk „Sprawdź fakturę”** po tabeli:
```tsx
<button onClick={validateFaktura} className="btn-warning">
  ✅ Sprawdź fakturę AI
</button>
```

3. **Panel wyników walidacji** pod tabelą:
```tsx
{walidacja && (
  <div className={`p-4 rounded-lg ${walidacja.status === 'OK' ? 'bg-green-100' : 'bg-yellow-100'}`}>
    <h4>Sprawdzenie AI:</h4>
    {walidacja.wyniki.map((wynik, i) => (
      <div key={i} className={`flex items-center gap-2 ${wynik.status === 'BŁĄD' ? 'text-red-600' : ''}`}>
        {wynik.status}
        {wynik.komentarz}
      </div>
    ))}
  </div>
)}
```

4. **Selektor modelu dla AI‑asystenta** (opisy/walidacja):
```tsx
<select value={aiModel} onChange={e => setAiModel(e.target.value)}>
  <option value="auto">Auto</option>
  <option value="szybki">Szybki (Gemini)</option>
  <option value="dokladny">Dokładny (GPT-4o)</option>
</select>
```


***

**Co to daje Generatorowi Faktur:**

- ✅ Automatyczne opisy pozycji przez AI („Usługa IT” → „Świadczenie usług programistycznych (kodowanie i testy)”),
- ✅ Walidacja faktury (NIP, VAT, nazwy pozycji, sumy),
- ✅ Wspólny router `/api/ai/execute` + company_prompt,
- ✅ UI z przyciskami „Opis AI” i „Sprawdź fakturę”.

**Następne narzędzie:** Asystent Email?

