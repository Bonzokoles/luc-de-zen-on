Poniżej znajduje się biblioteka gotowych, kopiowalnych skryptów JSON do Flowise i ActivePieces, które można łatwo wkleić i edytować pod potrzeby systemu mybonzo. Zestaw zawiera różnorodne automatyzacje z różnych obszarów, by ułatwić szybkie tworzenie i rozbudowę workflowów.

***

# Biblioteka gotowych workflowów JSON do kopiowania i edycji

***

## 1. Flowise – Monitorowanie błędów i alerty

```json
{
  "nodes": [
    { "id": "1", "type": "apiReceive", "name": "Get Logs", "config": { "endpoint": "/api/activity/log" } },
    { "id": "2", "type": "function", "name": "Parse Logs", "config": { "script": "return input.map(log => ({ ...log, level: log.message.includes('error') ? 'error' : 'info' }));" } },
    { "id": "3", "type": "function", "name": "Filter Errors", "config": { "script": "return input.filter(log => log.level === 'error');" } },
    { "id": "4", "type": "httpRequest", "name": "Send Alert", "config": { "url": "https://api.activepieces.com/trigger-alert", "method": "POST", "body": "{\"message\": \"Error logs detected!\"}", "headers": { "Content-Type": "application/json", "Authorization": "Bearer <API_KEY>" } } }
  ],
  "connections": { "1": ["2"], "2": ["3"], "3": ["4"] }
}
```

***

## 2. Flowise – Tworzenie codziennych raportów dla administratora

```json
{
  "nodes": [
    { "id": "start", "type": "schedule", "name": "Daily trigger", "config": { "expression": "0 7 * * *" } },
    { "id": "fetchData", "type": "httpRequest", "name": "Fetch Activity Logs", "config": { "url": "https://api.mybonzo.com/api/activity/report", "method": "GET" } },
    { "id": "generateReport", "type": "function", "name": "Generate Report", "config": { "script": "return `Report:\nTotal logs: ${input.length}`; }" } },
    { "id": "sendToActivePieces", "type": "httpRequest", "name": "Send Report", "config": { "url": "https://api.activepieces.com/trigger-report", "method": "POST", "headers": { "Content-Type": "application/json", "Authorization": "Bearer <API_KEY>" }, "body": "{\"report\": \"${generateReport}\"}" } }
  ],
  "connections": { "start": ["fetchData"], "fetchData": ["generateReport"], "generateReport": ["sendToActivePieces"] }
}
```

***

## 3. ActivePieces – Powiadomienia wielokanałowe dla przypomnień

```json
{
  "trigger": { "type": "schedule", "expression": "*/15 * * * *" },
  "actions": [
    { "type": "httpRequest", "config": { "url": "https://api.mybonzo.com/api/reminders", "method": "GET" } },
    { "type": "filter", "config": { "criteria": "reminder time matches now" } },
    {
      "type": "switch",
      "config": {
        "cases": [
          {
            "condition": "{{reminder.preferEmail}} === true",
            "actions": [{ "type": "sendEmail", "config": { "to": "{{reminder.email}}", "subject": "Przypomnienie mybonzo", "body": "{{reminder.text}}" } }]
          },
          {
            "condition": "{{reminder.preferSMS}} === true",
            "actions": [{ "type": "sendSMS", "config": { "to": "{{reminder.phone}}", "message": "{{reminder.text}}" } }]
          }
        ],
        "default": []
      }
    }
  ]
}
```

***

## 4. ActivePieces – Kategoryzacja ticketów i przypisywanie do zespołów

```json
{
  "trigger": { "type": "webhook", "endpoint": "/api/tickets/new" },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": { "Authorization": "Bearer <OPENAI_API_KEY>", "Content-Type": "application/json" },
        "body": "{\"model\":\"gpt-4\",\"messages\":[{\"role\":\"system\",\"content\":\"Klasyfikuj ticket.\"},{\"role\":\"user\",\"content\":\"{ticket_description}\"}]}"
      }
    },
    {
      "type": "switch",
      "config": {
        "cases": [
          {
            "condition": "{{classification}} === 'tech'",
            "actions": [{ "type": "httpRequest", "config": { "url": "https://api.jira.com/assign", "method": "POST", "body": "{\"ticket_id\":\"{{ticket_id}}\",\"team\":\"tech\"}" } }]
          },
          {
            "condition": "{{classification}} === 'billing'",
            "actions": [{ "type": "httpRequest", "config": { "url": "https://api.zendesk.com/assign", "method": "POST", "body": "{\"ticket_id\":\"{{ticket_id}}\",\"team\":\"billing\"}" } }]
          }
        ],
        "default": []
      }
    },
    { "type": "sendEmail", "config": { "to": "{{creator_email}}", "subject": "Status zgłoszenia", "body": "Ticket przypisany do zespołu: {{classification}}" } }
  ]
}
```

***

## 5. Flowise – Automatyczne generowanie treści FAQ według harmonogramu

```json
{
  "nodes": [
    { "id": "trigger", "type": "schedule", "name": "Daily FAQ Generate", "config": { "expression": "0 3 * * *" } },
    { "id": "fetchKnowledge", "type": "httpRequest", "name": "Get Knowledge Base", "config": { "url": "https://api.mybonzo.com/api/knowledgebase", "method": "GET" } },
    {
      "id": "generateFAQ",
      "type": "httpRequest",
      "name": "Generate FAQ via OpenAI",
      "config": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": { "Authorization": "Bearer <OPENAI_API_KEY>", "Content-Type": "application/json" },
        "body": "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"Generuj FAQ pytania i odpowiedzi.\"},{\"role\":\"user\",\"content\":\"{fetchKnowledge}\"}]}"
      }
    },
    { "id": "updateFAQ", "type": "httpRequest", "name": "Update FAQ Database", "config": { "url": "https://api.mybonzo.com/api/faq/update", "method": "PUT", "body": "{generateFAQ}", "headers": { "Content-Type": "application/json" } } }
  ],
  "connections": { "trigger": ["fetchKnowledge"], "fetchKnowledge": ["generateFAQ"], "generateFAQ": ["updateFAQ"] }
}
```

***

# Jak korzystać z biblioteki

1. Utwórz nowe pliki `.json` w swoim środowisku z powyższą zawartością.
2. Zamień placeholdery `<API_KEY>`, `<OPENAI_API_KEY>` oraz adresy URL na rzeczywiste.
3. Zaimportuj pliki do Flowise lub ActivePieces przez funkcję importu workflow.
4. Wybierz lub utwórz powiązane endpointy backend API.
5. Modyfikuj i rozwijaj według potrzeb projektu.

***

