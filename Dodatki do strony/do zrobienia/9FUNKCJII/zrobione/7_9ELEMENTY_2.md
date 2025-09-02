Oto kompletne pliki JSON workflow oraz skrypty deploymentu dla funkcji 7 (FAQ dynamiczny), 8 (Rekomendacje edukacyjne) i 9 (Obsługa zgłoszeń i ticketów) systemu mybonzo.

***

# 1. Pliki JSON Workflow do kopiowania

***

## 1) `flowise_faq_generator_workflow.json`

```json
{
  "nodes": [
    {
      "id": "trigger",
      "type": "schedule",
      "name": "Daily FAQ Generate",
      "config": {
        "expression": "0 3 * * *"
      }
    },
    {
      "id": "fetchKnowledge",
      "type": "httpRequest",
      "name": "Get Knowledge Base",
      "config": {
        "url": "https://api.mybonzo.com/api/knowledgebase",
        "method": "GET"
      }
    },
    {
      "id": "generateFAQ",
      "type": "httpRequest",
      "name": "Generate FAQ via OpenAI",
      "config": {
        "url": "https://api.mybonzo.com/api/faq/generate",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{\"knowledgeBase\":\"{{fetchKnowledge.body}}\"}"
      }
    },
    {
      "id": "updateFAQ",
      "type": "httpRequest",
      "name": "Update FAQ Database",
      "config": {
        "url": "https://api.mybonzo.com/api/faq/update",
        "method": "PUT",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{{generateFAQ.body}}"
      }
    }
  ],
  "connections": {
    "trigger": ["fetchKnowledge"],
    "fetchKnowledge": ["generateFAQ"],
    "generateFAQ": ["updateFAQ"]
  }
}
```

***

## 2) `activepieces_education_recommendations_workflow.json`

```json
{
  "trigger": {
    "type": "http",
    "endpoint": "/api/education/request-recs"
  },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.mybonzo.com/api/education/recommendations",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{{trigger.body}}"
      }
    },
    {
      "type": "sendEmail",
      "config": {
        "to": "{{trigger.body.email}}",
        "subject": "Twoje rekomendacje edukacyjne z mybonzo",
        "body": "Oto Twoje spersonalizowane rekomendacje:\n\n{{actions[0].response}}"
      }
    }
  ]
}
```

***

## 3) `activepieces_ticket_management_workflow.json`

```json
{
  "trigger": {
    "type": "webhook",
    "endpoint": "/api/ticket/new"
  },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.mybonzo.com/api/tickets/new",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer <OPENAI_API_KEY>"
        },
        "body": "{{trigger.body}}"
      }
    },
    {
      "type": "switch",
      "config": {
        "cases": [
          {
            "condition": "{{actions[0].classification}} == 'tech support'",
            "actions": [
              {
                "type": "httpRequest",
                "config": {
                  "url": "https://api.jira.com/assign",
                  "method": "POST",
                  "body": "{\"ticket_id\": \"{{trigger.body.ticketId}}\", \"team\": \"tech_support\"}"
                }
              }
            ]
          },
          {
            "condition": "{{actions[0].classification}} == 'billing'",
            "actions": [
              {
                "type": "httpRequest",
                "config": {
                  "url": "https://api.zendesk.com/assign",
                  "method": "POST",
                  "body": "{\"ticket_id\": \"{{trigger.body.ticketId}}\", \"team\": \"billing\"}"
                }
              }
            ]
          }
        ],
        "default": []
      }
    },
    {
      "type": "sendEmail",
      "config": {
        "to": "{{trigger.body.creatorEmail}}",
        "subject": "Status Twojego zgłoszenia",
        "body": "Twoje zgłoszenie zostało przypisane do zespołu: {{actions[0].classification}}"
      }
    }
  ]
}
```

***

# 2. Skrypt automatycznego deploymentu workflow – `deployWorkflowsMybonzo.js`

```js
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const baseDir = 'T:/MY_LUC_ZEN_ON';
const flowiseUrl = 'https://api.flowise.ai/v1/workflows/import';
const activepiecesUrl = 'https://api.activepieces.com/api/workflows/import';

async function deployFlowise() {
  const filePath = path.join(baseDir, 'src/workflows/flowise/flowise_faq_generator_workflow.json');
  let content = await fs.readFile(filePath, 'utf8');
  // Replace keys if needed (none here)
  const res = await fetch(flowiseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLOWISE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: content,
  });
  if (!res.ok) throw new Error(`Flowise deploy failed: ${res.statusText}`);
  console.log('Flowise FAQ workflow deployed successfully.');
}

async function deployActivePieces(fileName) {
  const filePath = path.join(baseDir, 'src/workflows/activepieces', fileName);
  let content = await fs.readFile(filePath, 'utf8');

  // Replace placeholders for keys if present
  content = content.replace(/<OPENAI_API_KEY>/g, process.env.OPENAI_API_KEY);

  const res = await fetch(activepiecesUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ACTIVEPIECES_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: content,
  });
  if (!res.ok) throw new Error(`ActivePieces deploy failed for ${fileName}: ${res.statusText}`);
  console.log(`ActivePieces workflow ${fileName} deployed successfully.`);
}

async function main() {
  try {
    await deployFlowise();
    await deployActivePieces('activepieces_education_recommendations_workflow.json');
    await deployActivePieces('activepieces_ticket_management_workflow.json');
    console.log('All workflows deployed successfully.');
  } catch (err) {
    console.error('Error during deployment:', err);
    process.exit(1);
  }
}

main();
```

***

# 3. Instrukcja wdrożenia

1. Umieść pliki JSON workflow w podanych ścieżkach w workspace `T:\MY_LUC_ZEN_ON`.
2. Dodaj plik `deployWorkflowsMybonzo.js` do katalogu głównego `T:\MY_LUC_ZEN_ON`.
3. Stwórz plik `.env` w katalogu głównym z zmiennymi:

```
FLOWISE_API_TOKEN=twój_klucz_flowise
ACTIVEPIECES_API_KEY=twój_klucz_activepieces
OPENAI_API_KEY=twój_klucz_openai
```

4. Zainstaluj zależności w projekcie (jeśli jeszcze nie):

```bash
npm install node-fetch dotenv
```

5. Uruchom deployment workflow:

```bash
node deployWorkflowsMybonzo.js
```

***

Ten komplet plików i skryptów pozwoli na szybkie wdrożenie kluczowych workflow dla funkcji FAQ, edukacji i ticketów w systemie mybonzo.

W razie potrzeby mogę pomóc dopisać workflow dla innych funkcji lub automatyzować więcej kroków.Oto kompletne pliki JSON workflow oraz skrypt automatycznego deploymentu dla funkcji 7 (FAQ dynamiczny), 8 (Rekomendacje edukacyjne) i 9 (Obsługa ticketów) systemu mybonzo, wraz z instrukcją wdrożenia:

***

# 1. Workflow JSON do kopiowania

## 1) flowise_faq_generator_workflow.json

```json
{
  "nodes": [
    {
      "id": "trigger",
      "type": "schedule",
      "name": "Daily FAQ Generate",
      "config": { "expression": "0 3 * * *" }
    },
    {
      "id": "fetchKnowledge",
      "type": "httpRequest",
      "name": "Get Knowledge Base",
      "config": { "url": "https://api.mybonzo.com/api/knowledgebase", "method": "GET" }
    },
    {
      "id": "generateFAQ",
      "type": "httpRequest",
      "name": "Generate FAQ via OpenAI",
      "config": {
        "url": "https://api.mybonzo.com/api/faq/generate",
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body": "{\"knowledgeBase\":\"{{fetchKnowledge.body}}\"}"
      }
    },
    {
      "id": "updateFAQ",
      "type": "httpRequest",
      "name": "Update FAQ Database",
      "config": {
        "url": "https://api.mybonzo.com/api/faq/update",
        "method": "PUT",
        "headers": { "Content-Type": "application/json" },
        "body": "{{generateFAQ.body}}"
      }
    }
  ],
  "connections": {
    "trigger": ["fetchKnowledge"],
    "fetchKnowledge": ["generateFAQ"],
    "generateFAQ": ["updateFAQ"]
  }
}
```

## 2) activepieces_education_recommendations_workflow.json

```json
{
  "trigger": { "type": "http", "endpoint": "/api/education/request-recs" },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.mybonzo.com/api/education/recommendations",
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body": "{{trigger.body}}"
      }
    },
    {
      "type": "sendEmail",
      "config": {
        "to": "{{trigger.body.email}}",
        "subject": "Twoje rekomendacje edukacyjne z mybonzo",
        "body": "Oto Twoje spersonalizowane rekomendacje:\n\n{{actions[0].response}}"
      }
    }
  ]
}
```

## 3) activepieces_ticket_management_workflow.json

```json
{
  "trigger": { "type": "webhook", "endpoint": "/api/ticket/new" },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.mybonzo.com/api/tickets/new",
        "method": "POST",
        "headers": { "Content-Type": "application/json", "Authorization": "Bearer <OPENAI_API_KEY>" },
        "body": "{{trigger.body}}"
      }
    },
    {
      "type": "switch",
      "config": {
        "cases": [
          {
            "condition": "{{actions[0].classification}} == 'tech support'",
            "actions": [
              {
                "type": "httpRequest",
                "config": {
                  "url": "https://api.jira.com/assign",
                  "method": "POST",
                  "body": "{\"ticket_id\": \"{{trigger.body.ticketId}}\", \"team\": \"tech_support\"}"
                }
              }
            ]
          },
          {
            "condition": "{{actions[0].classification}} == 'billing'",
            "actions": [
              {
                "type": "httpRequest",
                "config": {
                  "url": "https://api.zendesk.com/assign",
                  "method": "POST",
                  "body": "{\"ticket_id\": \"{{trigger.body.ticketId}}\", \"team\": \"billing\"}"
                }
              }
            ]
          }
        ],
        "default": []
      }
    },
    {
      "type": "sendEmail",
      "config": {
        "to": "{{trigger.body.creatorEmail}}",
        "subject": "Status Twojego zgłoszenia",
        "body": "Twoje zgłoszenie zostało przypisane do zespołu: {{actions[0].classification}}"
      }
    }
  ]
}
```

***

# 2. Skrypt automatycznego deploymentu workflow – deployWorkflowsMybonzo.js

```js
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const baseDir = 'T:/MY_LUC_ZEN_ON';
const flowiseUrl = 'https://api.flowise.ai/v1/workflows/import';
const activepiecesUrl = 'https://api.activepieces.com/api/workflows/import';

async function deployFlowise() {
  const filePath = path.join(baseDir, 'src/workflows/flowise/flowise_faq_generator_workflow.json');
  let content = await fs.readFile(filePath, 'utf8');
  const res = await fetch(flowiseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLOWISE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: content,
  });
  if (!res.ok) throw new Error(`Flowise deploy failed: ${res.statusText}`);
  console.log('Flowise FAQ workflow deployed successfully.');
}

async function deployActivePieces(fileName) {
  const filePath = path.join(baseDir, 'src/workflows/activepieces', fileName);
  let content = await fs.readFile(filePath, 'utf8');
  content = content.replace(/<OPENAI_API_KEY>/g, process.env.OPENAI_API_KEY);
  const res = await fetch(activepiecesUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ACTIVEPIECES_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: content,
  });
  if (!res.ok) throw new Error(`ActivePieces deploy failed for ${fileName}: ${res.statusText}`);
  console.log(`ActivePieces workflow ${fileName} deployed successfully.`);
}

async function main() {
  try {
    await deployFlowise();
    await deployActivePieces('activepieces_education_recommendations_workflow.json');
    await deployActivePieces('activepieces_ticket_management_workflow.json');
    console.log('All workflows deployed successfully.');
  } catch (err) {
    console.error('Error during deployment:', err);
    process.exit(1);
  }
}

main();
```

***

# 3. Instrukcja wdrożenia

- Umieść powyższe pliki JSON w katalogu `T:/MY_LUC_ZEN_ON/src/workflows/flowise` i `.../activepieces`.
- Dodaj `deployWorkflowsMybonzo.js` do katalogu głównego.
- Przygotuj plik `.env` z:

```
FLOWISE_API_TOKEN=twój_klucz_flowise
ACTIVEPIECES_API_KEY=twój_klucz_activepieces
OPENAI_API_KEY=twój_klucz_openai
```

- Zainstaluj zależności:

```bash
npm install node-fetch dotenv
```

- Uruchom skrypt deploymentu:

```bash
node deployWorkflowsMybonzo.js
```

To kompletny zestaw pozwalający szybkie wdrożenie i aktualizację workflow dla funkcji 7, 8 i 9 systemu mybonzo. sprawdz następny task gdzie znajdziesz  pozostałe funkcje i rozszerzyć automatyzacje.