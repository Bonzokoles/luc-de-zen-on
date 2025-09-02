Oto gotowe pliki do kopiowania oraz skrypty automatycznego deploymentu workflow dla funkcji 4 (monitorowanie), 6 (harmonogramowanie) i 7 (dynamiczny FAQ) w systemie mybonzo.

1. Pliki Backend API (gotowe do kopiowania)
src/api/activity.js
javascript
const logs = [];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (request.method === 'POST' && url.pathname === '/api/activity/log') {
    const data = await request.json();
    logs.push({ ...data, timestamp: Date.now() });
    return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (request.method === 'GET' && url.pathname === '/api/activity/report') {
    return new Response(JSON.stringify(logs), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('Not found', { status: 404 });
}
src/api/reminders.js
javascript
const reminders = new Map();

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (request.method === 'POST' && url.pathname === '/api/reminders/create') {
    const data = await request.json();
    const id = crypto.randomUUID();
    reminders.set(id, { ...data, id });
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (request.method === 'GET' && url.pathname === '/api/reminders') {
    return new Response(JSON.stringify(Array.from(reminders.values())), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('Not found', { status: 404 });
}
src/api/faq.js
javascript
import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'POST' && url.pathname === '/api/faq/generate') {
    const { knowledgeBase } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Jesteś AI generującym FAQ na podstawie bazy wiedzy.' },
        { role: 'user', content: `Na podstawie bazy wiedzy: ${knowledgeBase} wygeneruj listę pytań i odpowiedzi.` }
      ],
      max_tokens: 1000,
    });

    return new Response(JSON.stringify({ faq: response.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404 });
}
2. Frontendowe komponenty (gotowe do kopiowania)
src/components/ActivityDashboard.jsx
jsx
import React, { useEffect, useState } from 'react';

export default function ActivityDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/activity/report')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div className="bg-black p-6 rounded-xl text-cyan-300 overflow-auto max-h-[600px]">
      <h2 className="font-bold text-2xl mb-4">Dashboard aktywności</h2>
      {!logs.length ? (
        <p>Brak danych.</p>
      ) : (
        <ul>
          {logs.map((log, i) => (
            <li key={i} className="mb-2 border-b border-cyan-500 pb-2">
              <div><strong>Czas:</strong> {new Date(log.timestamp).toLocaleString()}</div>
              <div><strong>Akcja:</strong> {log.action}</div>
              <div><strong>Szczegóły:</strong> {JSON.stringify(log.details)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
src/components/RemindersManager.jsx
jsx
import React, { useEffect, useState } from 'react';

export default function RemindersManager() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ text: '', date: '' });

  useEffect(() => {
    fetch('/api/reminders')
      .then(res => res.json())
      .then(data => setReminders(data));
  }, []);

  const addReminder = async () => {
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
  };

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
      <button onClick={addReminder} className="bg-cyan-700 px-4 py-2 rounded hover:bg-cyan-900">
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
src/components/FAQWidget.jsx
jsx
import React, { useState } from 'react';

export default function FAQWidget() {
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [faq, setFaq] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFAQ = async () => {
    setLoading(true);
    const res = await fetch('/api/faq/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ knowledgeBase }),
    });
    const data = await res.json();
    setFaq(data.faq);
    setLoading(false);
  };

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
      {faq && <pre className="mt-6 p-4 bg-gray-800 rounded whitespace-pre-wrap">{faq}</pre>}
    </div>
  );
}
3. Skrypty do automatycznego deploymentu workflow
Automatyczny deployment Flowise
Załóżmy lokalny plik workflow_flowise.json z zawartością workflow Flowise (np. jak w przykładzie do funkcji 4):

json
{
  "nodes": [
    {"id":"1","type":"apiReceive","name":"Receive logs","config":{"endpoint":"/api/activity/log"}},
    {"id":"2","type":"function","name":"Detect errors","config":{"script":"const logs= input; return logs.filter(x => x.type === 'error').length > 3;"}},
    {"id":"3","type":"httpRequest","name":"Trigger ActivePieces","config":{"url":"https://api.activepieces.com/trigger-alert","method":"POST","body":"{\"message\":\"Anomalie w logach!\"}","headers":{"Content-Type":"application/json","Authorization":"Bearer <API_KEY>"}}}
  ],
  "connections": {"1":["2"],"2":["3"]}
}
Skrypt deployment (w terminalu)
bash
curl -X POST https://api.flowise.ai/v1/workflows/import \
  -H "Authorization: Bearer <YOUR_FLOWISE_API_TOKEN>" \
  -H "Content-Type: application/json" \
  -d @workflow_flowise.json
Automatyczny deployment ActivePieces
Umieść plik workflow_activepieces.json z przykładową konfiguracją (np. funkcja 6 powiadomień):

json
{
  "trigger": {
    "type": "schedule",
    "expression": "0 * * * *"
  },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.mybonzo.com/api/reminders",
        "method": "GET"
      }
    },
    {
      "type": "filter",
      "config": {
        "criteria": "check if reminder.time within next hour"
      }
    },
    {
      "type": "sendEmail",
      "config": {
        "to": "{{reminder.userEmail}}",
        "subject": "Przypomnienie z mybonzo",
        "body": "Masz nadchodzące zadanie: {{reminder.text}}"
      }
    }
  ]
}
Skrypt deployment (w terminalu)
bash
curl -X POST https://api.activepieces.com/api/workflows/import \
  -H "Authorization: Bearer <YOUR_ACTIVEPIECES_API_KEY>" \
  -H "Content-Type: application/json" \
  -d @workflow_activepieces.json
4. Podsumowanie
Skopiuj pliki backend i frontend do swojego repozytorium.

Zmień placeholdery <YOUR_FLOWISE_API_TOKEN>, <YOUR_ACTIVEPIECES_API_KEY> i <API_KEY> na właściwe klucze.

Użyj podanych skryptów w terminalu do importów workflow do Flowise i ActivePieces.

Zweryfikuj prawidłowość działania lokalnie przez wrangler dev i frontend.

Następnie opublikuj produkcyjnie przez wrangler publish.