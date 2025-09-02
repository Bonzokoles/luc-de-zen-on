Oto rozszerzony task z konkretnymi narzędziami, modelami AI, wskazaniem dodatkowych zasobów do pobrania oraz przykładami kodu i rozbudowanymi promptami wraz ze stylem i formą pisania dla trzech pierwszych funkcji.

***

# TASK: Implementacja pierwszych 3 funkcji z narzędziami, modelami AI, promptami i przykładami kodu (Astro/backroom)

## 1. Automatyczne generowanie treści marketingowych

### Narzędzia AI i biblioteki

- Model AI: OpenAI GPT-4 lub GPT-3.5-Turbo (wersja modelu umożliwiająca tworzenie kreatywnych, zgodnych ze stylem treści)
- API interfejs: Astro server API route korzystający z OpenAI SDK (`openai` npm package)
- UI: formularz React/JSX w Astro
- Dodatkowe: biblioteka do formatowania tekstu jak `marked` lub `react-markdown` do podglądu formatowanego tekstu

### Pobranie dodatkowych zasobów

- Zainstaluj pakiet openai:  
```
npm install openai
```
- Opcjonalnie biblioteki do renderingu markdown:
```
npm install react-markdown
```

### Przykład endpointu API w Astro:

```ts
import { OpenAI } from "openai";

export async function post(req) {
  const { prompt, contentType } = await req.json();
  const openai = new OpenAI();

  const systemMessage = {
    role: "system",
    content: "Jesteś ekspertem marketingu tworzącym angażujące teksty w stylu nowoczesnym i profesjonalnym."
  };

  const userMessage = {
    role: "user",
    content: `Napisz ${contentType} na temat: ${prompt}. Użyj stylu: dynamiczny, przystępny, z CTA zachęcającym do działania.`
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [systemMessage, userMessage],
    max_tokens: 500,
  });

  return new Response(JSON.stringify({ text: response.choices[0].message.content }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
```

### Przykład formularza frontend:

```jsx
import React, { useState } from "react";

export default function MarketingContentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("post na social media");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/generate-marketing-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, contentType }),
    });
    const json = await res.json();
    setOutput(json.text);
    setLoading(false);
  }

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300">
      <textarea
        rows={4}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Wpisz temat"
        className="w-full p-2 mb-3 bg-gray-900 rounded"
      />
      <select value={contentType} onChange={e => setContentType(e.target.value)} className="mb-3 p-2 bg-gray-900 rounded w-full">
        <option>post na social media</option>
        <option>e-mail marketingowy</option>
        <option>opis produktu</option>
      </select>
      <button className="px-4 py-2 bg-cyan-700 rounded" onClick={generate} disabled={loading}>
        {loading ? "Generuję..." : "Generuj"}
      </button>
      {output && (
        <div className="mt-4 p-4 bg-gray-800 rounded whitespace-pre-wrap">{output}</div>
      )}
    </div>
  );
}
```

***

## 2. Personalizowane rekomendacje produktów/usług

### Narzędzia AI i integracje

- Model AI: OpenAI GPT-4 lub GPT-3.5-Turbo do generowania rekomendacji na podstawie danych wejściowych
- Workflow: Flowise do przepływu rekomendacji (można pobrać Flowise z [flowise.ai](https://flowise.ai) i zainstalować lokalnie)
- Backend: Astro API routes do pobierania danych użytkownika i wywoływania modelu
- Frontend: React widget dynamicznie aktualizujący rekomendacje

### Pobranie dodatkowych zasobów

- Flowise: Pobierz i skonfiguruj lokalny lub chmurowy workflow analizy danych
- OpenAI SDK npm (jeśli nie zainstalowany z poprzedniego)

### Przykład promptu do rekomendacji (rozszerzony)

```
Jesteś ekspertem rekomendacji produktów, bazując na preferencjach użytkownika i historii zakupów. Użytkownik preferuje: {preferencje}, jego historia zakupów to: {historia}. Zaproponuj 3 produkty lub usługi wraz z krótkim opisem dlaczego.

Napisz w stylu przyjaznym, lekkim, zachęcającym do zakupu, podkreślając korzyści i unikalne cechy.
```

### Przykładowy komponent frontend:

```jsx
import React, { useEffect, useState } from "react";

export default function RecommendationsWidget({ userPreferences, userHistory }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecs() {
      setLoading(true);
      const res = await fetch("/api/get-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: userPreferences, history: userHistory }),
      });
      const json = await res.json();
      setRecs(json.recommendations);
      setLoading(false);
    }
    fetchRecs();
  }, [userPreferences, userHistory]);

  if (loading) return <div className="text-cyan-400">Ładowanie rekomendacji...</div>;
  if (!recs.length) return <div className="text-gray-500">Brak rekomendacji.</div>;

  return (
    <div className="bg-black p-4 rounded-lg space-y-3">
      {recs.map((rec, idx) => (
        <div key={idx} className="bg-gray-900 p-3 rounded-lg border border-cyan-500 shadow-md">
          <h3 className="text-cyan-300 font-semibold">{rec.title}</h3>
          <p className="text-gray-400">{rec.description}</p>
        </div>
      ))}
    </div>
  );
}
```

***

## 3. Automatyzacja obsługi klienta i leadów

### Narzędzia AI i integracje

- AI: OpenAI GPT-4 do automatycznej kwalifikacji leadów na podstawie formularza
- Workflow: ActivePieces do zapisów i automatycznych odpowiedzi e-mail/SMS
- Integracja CRM: HubSpot, Salesforce (wymaga konfiguracji API, dokumentację podać w repozytorium)
- Backend: Endpoint Astro do odbioru formularza i wywołania AI

### Pobranie dodatkowych zasobów

- ActivePieces: zarejestruj i skonfiguruj workflowy automatyzacji
- OpenAI SDK (jeśli nie jest już zainstalowane)

### Przykład promptu dla AI kwalifikującego lead:

```
Jesteś asystentem AI do kwalifikacji leadów. Na podstawie danych: {dane_leada}, oceń wartość leadu, zasugeruj priorytet (wysoki, średni, niski) i zaproponuj krótką odpowiedź powitalną, która zachęci klienta do dalszej rozmowy.

Napisz odpowiedź w profesjonalnym, ale serdecznym tonie, maksymalnie do 150 słów.
```

### Przykładowy formularz React:

```jsx
import React, { useState } from "react";

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/qualify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setResponse(json.reply);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-black p-6 rounded-lg space-y-4 text-cyan-300">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Imię i nazwisko" required className="w-full p-2 rounded bg-gray-900" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" type="email" required className="w-full p-2 rounded bg-gray-900" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Twoja wiadomość" required rows={4} className="w-full p-2 rounded bg-gray-900"></textarea>
      <button type="submit" disabled={loading} className="bg-cyan-700 px-4 py-2 rounded hover:bg-cyan-900">
        {loading ? "Wysyłanie..." : "Wyślij"}
      </button>
      {response && <div className="mt-4 bg-gray-800 p-4 rounded">{response}</div>}
    </form>
  );
}
```

***

## Podsumowanie

| Funkcja                                | Model AI                         | Dodatki do pobrania                  | Funkcjonalność frontend                             |
|---------------------------------------|---------------------------------|------------------------------------|----------------------------------------------------|
| 1. Generowanie treści marketingowych  | OpenAI GPT-4/GPT-3.5-Turbo      | `openai` + `react-markdown`        | Formularz prompt, wybór typu, generowanie i podgląd|
| 2. Rekomendacje produktów/usług       | OpenAI GPT-4/GPT-3.5-Turbo      | Flowise (workflow), openai         | Widget rekomendacji dynamicznie aktualizowany      |
| 3. Obsługa klienta i leadów           | OpenAI GPT-4                    | ActivePieces, openai                | Formularz kwalifikacji, automatyczna odpowiedź AI  |

Ten opis można przekazać Copilotowi jako wytyczne lub implementować etapami, korzystając z podanego kodu i promptów jako wzorców.[1][2][3]

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/92027992/3fd1bbdb-2c6d-482c-a6fe-9362f9c08ae0/9FUNKCJI.md)
[2](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/92027992/fa6bc879-a808-421b-bc3d-60611ca564c4/D92DBAE2-0DDC-48CD-B924-FB0C7DC7381C.jpg)
[3](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/92027992/d915feb7-0d34-40d2-8d86-06577e07ecc8/84AE8381-32F0-4ACF-88F4-2A0EE8748F09.jpg)