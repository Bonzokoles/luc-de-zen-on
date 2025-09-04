Oto przygotowane szczegółowe taski, przykładowe kody backend, frontend oraz schematy workflow dla funkcji 7, 8 i 9 systemu mybonzo, zgodne z dotychczasowym stylem i stackiem:

***

# TASK: Implementacja funkcji 7, 8 i 9 (Astro / Cloudflare Workers / AI / Workflow)

***

## 7. Personalizowany generator pytań i odpowiedzi (FAQ dynamiczny)

### Backend API (Cloudflare Worker) – `src/api/faq.js`

```js
import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname === "/api/faq/generate") {
    const { knowledgeBase } = await request.json();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Generuj pytania i odpowiedzi FAQ na podstawie bazy wiedzy." },
        { role: "user", content: `Baza wiedzy: ${knowledgeBase}` },
      ],
      max_tokens: 1000,
    });
    return new Response(
      JSON.stringify({ faq: response.choices[0].message.content }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response("Not Found", { status: 404 });
}
```

### Frontend React – `src/components/FAQWidget.jsx`

```jsx
import React, { useState } from "react";

export default function FAQWidget() {
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [faq, setFaq] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateFAQ() {
    setLoading(true);
    const res = await fetch("/api/faq/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ knowledgeBase }),
    });
    const json = await res.json();
    setFaq(json.faq);
    setLoading(false);
  }

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300">
      <h2 className="font-bold text-2xl mb-4">Generator FAQ dynamiczny</h2>
      <textarea
        rows={6}
        value={knowledgeBase}
        onChange={e => setKnowledgeBase(e.target.value)}
        placeholder="Wklej treść bazy wiedzy"
        className="w-full p-2 mb-3 bg-gray-900 rounded"
      />
      <button onClick={generateFAQ} disabled={loading} className="bg-cyan-700 px-4 py-2 rounded">
        {loading ? "Generuję..." : "Generuj FAQ"}
      </button>
      {faq && <pre className="mt-6 p-4 bg-gray-800 rounded whitespace-pre-wrap">{faq}</pre>}
    </div>
  );
}
```

### Workflow Flowise (przykładowy)

- Trigger: harmonogram codzienny
- Akcja: pobranie bazy wiedzy (GET `/api/knowledgebase`)
- Akcja: wywołanie endpointu FAQ generującego
- Akcja: zapis aktualizacji FAQ (PUT `/api/faq/update`)

***

## 8. System rekomendacji treści edukacyjnych i kursów

### Backend API – `src/api/educationRecommendations.js`

```js
import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "POST" && new URL(request.url).pathname === "/api/education/recommendations") {
    const { userProfile } = await request.json();
    const prompt = `Rekomenduj kursy i materiały edukacyjne dla użytkownika o profilu: ${JSON.stringify(userProfile)}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });
    return new Response(JSON.stringify({ recommendations: response.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not Found", { status: 404 });
}
```

### Frontend React – `src/components/EducationRecommendationsWidget.jsx`

```jsx
import React, { useState, useEffect } from "react";

export default function EducationRecommendationsWidget({ userProfile }) {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      const res = await fetch("/api/education/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
      });
      const json = await res.json();
      setRecommendations(json.recommendations);
      setLoading(false);
    }
    fetchRecommendations();
  }, [userProfile]);

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300">
      <h2 className="font-bold text-2xl mb-4">Rekomendacje edukacyjne</h2>
      {loading ? <p>Ładowanie rekomendacji...</p> : <pre>{recommendations}</pre>}
    </div>
  );
}
```

### Workflow Flowise (opis)

- Trigger: event wywołany zmianą profilu lub harmonogram
- Akcja: analiza userProfile i generowanie rekomendacji
- Akcja: wysyłka powiadomień ActivePieces o nowych materiałach

***

## 9. Automatyzacja obsługi zgłoszeń i ticketów

### Backend API – `src/api/ticketHandler.js`

```js
import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "POST" && new URL(request.url).pathname === "/api/tickets/new") {
    const { description, ticketId, creatorEmail } = await request.json();

    // Klasyfikacja ticketu przez AI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Klasyfikuj zgłoszenia do zespołów: tech support, billing lub inne." },
        { role: "user", content: `Ticket ID: ${ticketId}, Opis: ${description}` },
      ],
      max_tokens: 100,
    });

    const classification = response.choices[0].message.content.trim();

    // Tutaj można wywołać API Jira/Zendesk do przypisania (po stronie workflow)

    return new Response(
      JSON.stringify({ ticketId, classification }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response("Not Found", { status: 404 });
}
```

### Frontend React – `src/components/TicketSubmissionForm.jsx`

```jsx
import React, { useState } from "react";

export default function TicketSubmissionForm() {
  const [form, setForm] = useState({ description: "", email: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submitTicket() {
    setLoading(true);
    const res = await fetch("/api/tickets/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300">
      <h2 className="font-bold text-2xl mb-4">Zgłoś ticket</h2>
      <textarea
        placeholder="Opis problemu"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="w-full p-2 mb-3 bg-gray-900 rounded"
        rows={4}
      />
      <input
        type="email"
        placeholder="Twój e-mail"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 mb-3 bg-gray-900 rounded"
      />
      <button onClick={submitTicket} disabled={loading} className="bg-cyan-700 px-4 py-2 rounded hover:bg-cyan-900">
        {loading ? "Wysyłanie..." : "Wyślij"}
      </button>
      {result && (
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <p>Ticket ID: {result.ticketId}</p>
          <p>Przypisany do zespołu: {result.classification}</p>
        </div>
      )}
    </div>
  );
}
```

### Workflow ActivePieces (opis)

- Trigger: webhook wyzwalany po nowym zgłoszeniu
- Akcja: wywołanie API klasyfikacji ticketu
- Akcja: przypisanie ticketu w systemie (Jira/Zendesk)
- Akcja: powiadomienie mailowe użytkownika i zespołu

***



To baza kompletna, modularna i spójna ze stylem całego projektu mybonzo. W  następnym task 7_9ELEMENTY_2 wkleje  kompletne pliki JSON workflow dla tych funkcji i skrypty deploymentu.