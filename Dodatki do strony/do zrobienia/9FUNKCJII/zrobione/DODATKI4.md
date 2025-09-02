Poniżej jest przygotowany „kode space” w formie kopii gotowych plików JSON do łatwego tworzenia/edycji workflow w Flowise i ActivePieces. Wystarczy skopiować i wkleić zawartość do plików JSON o wskazanych nazwach, by później importować do narzędzi i edytować.

Kode space: Pliki JSON workflow do kopiowania i modyfikacji
1. Plik: flowise_monitoring_workflow.json
json
{
  "nodes": [
    {
      "id": "1",
      "type": "apiReceive",
      "name": "Get Logs",
      "config": {
        "endpoint": "/api/activity/log"
      }
    },
    {
      "id": "2",
      "type": "function",
      "name": "Parse Logs",
      "config": {
        "script": "return input.map(log => ({ ...log, level: log.message.includes('error') ? 'error' : 'info' }));"
      }
    },
    {
      "id": "3",
      "type": "function",
      "name": "Filter Errors",
      "config": {
        "script": "return input.filter(log => log.level === 'error');"
      }
    },
    {
      "id": "4",
      "type": "httpRequest",
      "name": "Alert Errors",
      "config": {
        "url": "https://api.activepieces.com/trigger-alert",
        "method": "POST",
        "body": "{\"message\": \"Wykryto błędy w logach!\"}",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer <API_KEY>"
        }
      }
    }
  ],
  "connections": {
    "1": ["2"],
    "2": ["3"],
    "3": ["4"]
  }
}
2. Plik: activepieces_reminders_workflow.json
json
{
  "trigger": {
    "type": "schedule",
    "expression": "*/15 * * * *"
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
        "criteria": "reminder time matches current time"
      }
    },
    {
      "type": "switch",
      "config": {
        "cases": [
          {
            "condition": "{{reminder.preferEmail}} === true",
            "actions": [
              {
                "type": "sendEmail",
                "config": {
                  "to": "{{reminder.email}}",
                  "subject": "Przypomnienie z mybonzo",
                  "body": "Masz przypomnienie: {{reminder.text}}"
                }
              }
            ]
          },
          {
            "condition": "{{reminder.preferSMS}} === true",
            "actions": [
              {
                "type": "sendSMS",
                "config": {
                  "to": "{{reminder.phone}}",
                  "message": "Przypomnienie: {{reminder.text}}"
                }
              }
            ]
          }
        ],
        "default": []
      }
    }
  ]
}
3. Plik: activepieces_ticket_assignment_workflow.json
json
{
  "trigger": {
    "type": "webhook",
    "endpoint": "/api/ticket/new"
  },
  "actions": [
    {
      "type": "httpRequest",
      "config": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer <OPENAI_API_KEY>",
          "Content-Type": "application/json"
        },
        "body": "{\"model\": \"gpt-4\", \"messages\": [{\"role\": \"system\", \"content\": \"Klasyfikuj kategorię ticketu.\"}, {\"role\": \"user\", \"content\": \"{ticket_description}\"}]}"
      }
    },
    {
      "type": "conditional",
      "config": {
        "mode": "switch",
        "cases": [
          {
            "condition": "{{classification}} === 'tech support'",
            "actions": [
              {
                "type": "httpRequest",
                "config": {
                  "url": "https://api.jira.com/assign",
                  "method": "POST",
                  "body": "{\"ticket_id\":\"{{ticket_id}}\", \"team\":\"tech_support\"}"
                }
              }
            ]
          },
          {
            "condition": "{{classification}} === 'billing'",
            "actions": [
              {
                "type": "httpRequest",
                "config": {
                  "url": "https://api.zendesk.com/assign",
                  "method": "POST",
                  "body": "{\"ticket_id\":\"{{ticket_id}}\", \"team\":\"billing\"}"
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
        "to": "{{creator_email}}",
        "subject": "Status Twojego zgłoszenia",
        "body": "Twoje zgłoszenie zostało przydzielone do zespołu: {{classification}}"
      }
    }
  ]
}
Jak korzystać z tego kodu
Stwórz w projekcie pliki .json i wklej do nich powyższe odpowiednie treści:

flowise_monitoring_workflow.json

activepieces_reminders_workflow.json

activepieces_ticket_assignment_workflow.json

Załaduj te pliki do narzędzi Flowise i ActivePieces za pomocą funkcji importu workflow.

Zamień placeholdery <API_KEY>, <OPENAI_API_KEY> i adresy URL API na odpowiednie Twojemu środowisku.

Modyfikuj zapytania, wiadomości i logikę według potrzeb projektu.

Testuj każdą automatyzację osobno zanim zintegrujesz z systemem produkcyjnym.