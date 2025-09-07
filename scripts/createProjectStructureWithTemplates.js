// createProjectStructureWithTemplates.js
import fs from 'fs/promises';
import path from 'path';

const baseDir = 'T:/MY_LUC_ZEN_ON';

const folders = [
  'src/api',
  'src/components',
  'src/pages/backroom',
  'src/workflows/flowise',
  'src/workflows/activepieces',
  'Documentation'
];

const rulesContent = `# Reguły i standardy pracy nad projektem mybonzo

1. Każda funkcjonalność ma osobny folder lub pliki w katalogach:
   - Frontend: /src/components/
   - Backend API: /src/api/
   - Workflow: /src/workflows/flowise/ lub /src/workflows/activepieces/

2. Pliki workflow mają nazwy zgodne z nazwą funkcji np. "activepieces_reminders_workflow.json"

3. Dokumentacja znajduje się w folderze /Documentation/ w osobnych plikach .md

4. Każdy nowy moduł musi mieć powiązaną dokumentację (opis, lokalizację, API, zależności)

5. Używaj spójnego nazewnictwa plików i komponentów (np. ActivityDashboard.jsx)

6. Przed commitowaniem wykonuj testy lokalne z \`wrangler dev\` i buduj projekt \`npm run build\`

7. W pliku wrangler.toml konfigurować zmienne środowiskowe i ustawienia deploymentu

8. Wszystkie klucze API przechowuj tylko w plikach .env i nigdy nie commituj ich do repozytorium

9. Do importu workflow używaj gotowych JSON-ów w /src/workflows/ i skryptów deploymentu

10. Komunikacja i zadania dla Copilota opieraj na tej strukturze i regułach, aby zachować modularność
`;

const templates = [
  {
    filePath: 'src/api/activity.js',
    content: `const logs = [];

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
`
  },
  {
    filePath: 'src/components/ActivityDashboard.jsx',
    content: `import React, { useEffect, useState } from 'react';

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
`
  },
  {
    filePath: 'src/workflows/flowise/flowise_monitoring_workflow.json',
    content: `{
  "nodes": [
    { "id": "1", "type": "apiReceive", "name": "Get Logs", "config": { "endpoint": "/api/activity/log" } },
    { "id": "2", "type": "function", "name": "Parse Logs", "config": { "script": "return input.map(log => ({ ...log, level: log.message.includes('error') ? 'error' : 'info' }));" } },
    { "id": "3", "type": "function", "name": "Filter Errors", "config": { "script": "return input.filter(log => log.level === 'error');" } },
    { "id": "4", "type": "httpRequest", "name": "Send Alert", "config": { "url": "https://api.activepieces.com/trigger-alert", "method": "POST", "body": "{\\"message\\": \\"Error logs detected!\\"}", "headers": { "Content-Type": "application/json", "Authorization": "Bearer <API_KEY>" } } }
  ],
  "connections": { "1": ["2"], "2": ["3"], "3": ["4"] }
}`
  },
  {
    filePath: 'Documentation/Functionality_ActivityDashboard.md',
    content: `# ActivityDashboard

## Lokalizacja
- Frontend: /src/components/ActivityDashboard.jsx
- Backend API: /src/api/activity.js
- Workflow Flowise: /src/workflows/flowise/flowise_monitoring_workflow.json

## Opis
Panel dashboard monitorowania aktywności systemu. Zbiera i wyświetla logi oraz generuje alerty przy wykryciu błędów.

---
`
  }
];

async function createFolders() {
  for (const folder of folders) {
    const dir = path.join(baseDir, folder);
    await fs.mkdir(dir, { recursive: true });
    console.log(`Stworzono folder: ${dir}`);
  }
}

async function createRules() {
  const rulesPath = path.join(baseDir, 'rules.txt');
  await fs.writeFile(rulesPath, rulesContent, 'utf8');
  console.log(`Stworzono plik reguł: ${rulesPath}`);
}

async function createTemplates() {
  for (const file of templates) {
    const fullPath = path.join(baseDir, file.filePath);
    // upewniamy się, że folder istnieje
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file.content, 'utf8');
    console.log(`Dodano szablon pliku: ${fullPath}`);
  }
}

async function main() {
  try {
    await createFolders();
    await createRules();
    await createTemplates();
    console.log("Struktura projektu i szablony plików utworzone pomyślnie.");
  } catch (e) {
    console.error("Błąd podczas tworzenia struktury i plików:", e);
  }
}

main();
