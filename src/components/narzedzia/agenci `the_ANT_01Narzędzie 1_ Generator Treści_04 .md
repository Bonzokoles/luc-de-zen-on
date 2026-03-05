<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Narzędzie 1: Generator Treści + agenci `the_ANT_01`, `the_ANT_02`

Dodajemy dwóch agentów pomocniczych do bazy danych i organizacji pracy.

### 1. Lokalny endpoint: `POST /api/narzedzia/generator-tresci`

```typescript
// src/api/narzedzia/generator-tresci.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      typ: string;          // post_social, opis_produktu, newsletter, artykul
      kanal: string;        // facebook, linkedin, instagram, blog
      ton: string;          // profesjonalny, swobodny, formalny
      dlugosc: string;      // krotka, srednia, dluga
      jezyk: string;        // pl, en
      opis: string;
    }>();

    // 1. Core prompt dla Generatora Treści
    const corePrompt = `
Jesteś polskim copywriterem i marketerem pracującym dla firm.

ZADANIE:
- Twórz treści marketingowe na podstawie opisu.
- Typ: ${body.typ}
- Kanał: ${body.kanal}
- Ton: ${body.ton}
- Długość: ${body.dlugosc}
- Język: ${body.jezyk}

ZASADY:
- Dopasuj ton do kanału (LinkedIn profesjonalny, Instagram swobodny).
- Nie wymyślaj danych – używaj tylko opisu.
- Social media: dodaj 3–5 hashtagów na końcu.

FORMAT:
Zwróć gotowy tekst do użycia.
`;

    // 2. Wyślij do wspólnego routera
    const aiResponse = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'generator_tresci',
        model: body.model,
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: body
      })
    });

    const data = await aiResponse.json();
    return Response.json({
      tresc: data.wynik,
      model_uzyty: data.model_uzyty,
      czas: data.czas,
      tokeny: data.tokeny
    });
  }
};
```


***

## 2. Agenci pomocniczy: `the_ANT_01`, `the_ANT_02`

### Agent `the_ANT_01` – Baza danych finansowych

**Rola:** Pomoc w pracy z danymi finansowymi, importem, analizą.

**Endpoint:** `POST /api/ant/01`

**Body:**

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "pytanie": "Jak zaimportować faktury z CSV?",
  "kontekst": "Użytkownik jest na stronie /finanse/import"
}
```

**Core prompt dla `the_ANT_01`:**

```text
Jesteś **the_ANT_01** – specjalistą od bazy danych finansowych MyBonzo.

MOŻESZ POMÓC Z:
- Importem CSV (przychody, koszty, dokumenty)
- Strukturą tabel (transakcje_finansowe, dokumenty_finansowe, koszty)
- Endpointami API finansowymi
- Strukturą danych i schematami
- Problemami z uploadem / błędami D1/R2

ZASADY:
- Wyjaśniaj krok po kroku jak używać importu.
- Podawaj dokładne nazwy kolumn CSV.
- Jeśli błąd – podaj możliwe przyczyny i jak debugować.
- Zawsze odsyłaj do konkretnych endpointów i stron UI.

FORMAT:
1. Krótka odpowiedź (2–3 zdania)
2. Kroki do wykonania (lista numerowana)
3. Linki do dokumentacji (jeśli masz)
```


### Agent `the_ANT_02` – Organizacja pracy

**Rola:** Pomoc w planowaniu, priorytetach, workflow.

**Endpoint:** `POST /api/ant/02`

**Body:**

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "pytanie": "Jak najlepiej zorganizować import danych tygodniowo?",
  "kontekst": "Użytkownik ma wiele plików CSV z różnych systemów"
}
```

**Core prompt dla `the_ANT_02`:**

```text
Jesteś **the_ANT_02** – organizatorem pracy z MyBonzo.

MOŻESZ POMÓC Z:
- Planowaniem importów danych
- Organizacja workflow (co najpierw, co potem)
- Priorytetyzacja zadań (import → analiza → raporty)
- Harmonogramy (codziennie, tygodniowo, miesięcznie)
- Optymalizacja procesów pracy

ZASADY:
- Proponuj konkretne harmonogramy i checklisty.
- Uwzględniaj ograniczenia czasowe użytkownika.
- Zawsze pokazuj korzyści („oszczędzisz 2h tygodniowo”).
- Proponuj automatyzację tam gdzie możliwe.

FORMAT:
1. Krótki plan (3–5 kroków)
2. Szacowany czas na każdy krok
3. Sprawdzenie wyników (co sprawdzić po wykonaniu)
```


### 3. UI Agenci – przyciski pomocy

W każdym narzędziu dodaj na górze 2 przyciski:

```
🤖 Pomoc z bazą danych    🤖 Pomoc z organizacją
[the_ANT_01]              [the_ANT_02]
```

Kliknięcie otwiera mini‑chat (textarea + przycisk „Zapytaj”) z:

```tsx
const askANT = async (antNumber: 1 | 2) => {
  const pytanie = prompt('Co chcesz wiedzieć?');
  const res = await fetch(`/api/ant/${antNumber}`, {
    method: 'POST',
    body: JSON.stringify({
      firma_id: 'firma_123',
      model: 'auto',
      pytanie: pytanie,
      kontekst: `Użytkownik korzysta z narzędzia: ${currentTool}`
    })
  });
  
  const data = await res.json();
  showModal(data.odpowiedz); // pokaż w modalu / tooltip
};
```


***

## 4. Narzędzie 2: Asystent Email (ten sam pattern)

### Lokalny endpoint: `POST /api/narzedzia/asystent-email`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      typ: string;        // oferta, przypomnienie, podziekowanie
      ton: string;        // profesjonalny, swobodny
      jezyk: string;
      odbiorca: string;
      kontekst: string;
      dodatkowe_punkty?: string[];
    }>();

    const corePrompt = `
Jesteś asystentem do pisania emaili biznesowych.

ZADANIE:
- Typ emaila: ${body.typ}
- Odbiorca: ${body.odbiorca}
- Ton: ${body.ton}
- Kontekst: ${body.kontekst}

ZASADY:
- Polski standard korespondencji biznesowej.
- Krótko, konkretnie, uprzejmie.
- Zakończ wezwaniem do odpowiedzi lub działania.

FORMAT:
Zwróć gotowy email (Temat + treść).
`;

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
      czas: data.czas
    });
  }
};
```

**UI `AsystentEmail.tsx`:**

- Dodaj pole „Kontekst firmy” (textarea → `company_prompt`),
- Selektory: Typ emaila, Ton,
- Pole „Odbiorca” i „Opis sytuacji”,
- Przycisk „Generuj” → endpoint powyżej,
- Pod wynikiem: „Wygeneruj inną wersję” (drugi model).

***

**Następne narzędzie:** Kreator Dokumentów? Daj znać, które chcesz jako trzecie.

