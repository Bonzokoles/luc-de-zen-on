1. Przykładowe Endpointy API (Cloudflare Workers)
monitorowanie (funkcja 4)
javascript
// src/api/activity.js
import { verifyAuth } from './auth.js'; // Załóżmy moduł do weryfikacji

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const logs = [];

async function handleRequest(request) {
  if (!verifyAuth(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/activity/log') {
    const data = await request.json();
    logs.push({ ...data, timestamp: Date.now() });
    return new Response(JSON.stringify({ status: 'logged' }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (request.method === 'GET' && new URL(request.url).pathname === '/api/activity/report') {
    return new Response(JSON.stringify(logs), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('Not Found', { status: 404 });
}
harmonogramowanie (funkcja 6)
javascript
// src/api/reminders.js
const reminders = new Map();

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/reminders/create') {
    const data = await request.json();
    const id = crypto.randomUUID();
    reminders.set(id, { ...data, id });
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (request.method === 'GET' && new URL(request.url).pathname === '/api/reminders') {
    return new Response(JSON.stringify(Array.from(reminders.values())), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('Not Found', { status: 404 });
}
FAQ dynamiczny (funkcja 7)
javascript
// src/api/faq.js
import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/faq/generate') {
    const { knowledgeBase } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Jesteś AI do generowania FAQ na podstawie bazy wiedzy.' },
        { role: 'user', content: `Na podstawie bazy: ${knowledgeBase} wygeneruj listę pytań i odpowiedzi.` }
      ],
      max_tokens: 1000,
    });

    return new Response(JSON.stringify({ faq: response.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response('Not Found', { status: 404 });
}
2. Przykładowe Frontendowe Komponenty (Astro + React)
Dashboard monitorowania (funkcja 4)
jsx
import React, { useEffect, useState } from 'react';

export default function ActivityDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch('/api/activity/report');
      const data = await res.json();
      setLogs(data);
    }
    fetchLogs();
  }, []);

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300 overflow-auto max-h-[600px]">
      <h2 className="font-bold text-2xl mb-4">Dashboard aktywności</h2>
      {logs.length === 0 && <p>Brak danych.</p>}
      <ul>
        {logs.map((log, i) => (
          <li key={i} className="mb-2 border-b border-cyan-500 pb-2">
            <div><strong>Czas:</strong> {new Date(log.timestamp).toLocaleString()}</div>
            <div><strong>Akcja:</strong> {log.action}</div>
            <div><strong>Szczegóły:</strong> {JSON.stringify(log.details)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
Przypomnienia i harmonogram (funkcja 6)
jsx
import React, { useState, useEffect } from 'react';

export default function RemindersManager() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ text: '', date: '' });

  useEffect(() => {
    async function fetchReminders() {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      setReminders(data);
    }
    fetchReminders();
  }, []);

  async function handleAddReminder() {
    if (!newReminder.text || !newReminder.date) return;
    await fetch('/api/reminders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReminder),
    });
    setNewReminder({ text: '', date: '' });
    const res = await fetch('/api/reminders');
    const data = await res.json();
    setReminders(data);
  }

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300">
      <h2 className="font-bold text-2xl mb-4">Harmonogram i przypomnienia</h2>

      <input
        type="text"
        placeholder="Treść przypomnienia"
        value={newReminder.text}
        onChange={e => setNewReminder({ ...newReminder, text: e.target.value })}
        className="mb-3 p-2 rounded bg-gray-900 w-full"
      />
      <input
        type="datetime-local"
        value={newReminder.date}
        onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
        className="mb-3 p-2 rounded bg-gray-900 w-full"
      />
      <button
        onClick={handleAddReminder}
        className="bg-cyan-700 px-4 py-2 rounded hover:bg-cyan-900"
      >
        Dodaj przypomnienie
      </button>

      <ul className="mt-6">
        {reminders.map(r => (
          <li key={r.id} className="mb-2 border-b border-cyan-500 pb-2">
            <div><strong>Treść:</strong> {r.text}</div>
            <div><strong>Termin:</strong> {new Date(r.date).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
Widget FAQ dynamicznego (funkcja 7)
jsx
import React, { useState } from 'react';

export default function FAQWidget() {
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [faq, setFaq] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateFAQ() {
    setLoading(true);
    const res = await fetch('/api/faq/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ knowledgeBase }),
    });
    const data = await res.json();
    setFaq(data.faq);
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
        {loading ? 'Generuję...' : 'Generuj FAQ'}
      </button>

      {faq && (
        <pre className="mt-6 p-4 bg-gray-800 rounded whitespace-pre-wrap">{faq}</pre>
      )}
    </div>
  );
}
3. Konfiguracja workflow (schemat pracy)
Funkcja 4:

Dane logów wysyłane POSTem do endpointu /api/activity/log.

Flowise uruchamia agregacje danych, wykrywa anomalie.

ActivePieces wysyła mail/SMS, gdy wykryte zostaną poważne alerty.

Dashboard pobiera dane GETem /api/activity/report, wizualizuje.

Funkcja 6:

UI przesyła przypomnienia POSTem do /api/reminders/create.

ActivePieces wykonuje rozsyłanie powiadomień według harmonogramu.

Integracja AI w workflow analizuje i rekomenduje terminy.

Funkcja 7:

UI wysyła do API /api/faq/generate tekst bazy wiedzy.

OpenAI generuje FAQ w odpowiedzi.

Korekta i ponowne uruchomienie możliwe przez panel.

4. Plik task VSCode (tasks.json)
json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Deploy Cloudflare Workers",
      "type": "shell",
      "command": "wrangler publish",
      "group": "build",
      "problemMatcher": [],
      "detail": "Publikuje workers do Cloudflare z konfiguracją wrangler.toml"
    },
    {
      "label": "Run Dev Server",
      "type": "shell",
      "command": "wrangler dev",
      "group": "build",
      "problemMatcher": [],
      "detail": "Uruchamia lokalny serwer developerski Cloudflare Workers"
    },
    {
      "label": "Build Astro Project",
      "type": "shell",
      "command": "npm run build",
      "group": "build",
      "problemMatcher": ["$tsc"],
      "detail": "Buduje projekt Astro dla deploymentu"
    },
    {
      "label": "Install Dependencies",
      "type": "shell",
      "command": "npm install",
      "problemMatcher": [],
      "detail": "Instaluje brakujące pakiety npm"
    }
  ]
}
