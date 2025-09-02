
1. Flowise – dodatkowe automatyzacje
A. Automatyczne parsowanie i klasyfikacja logów
Opis: Po otrzymaniu logów AI parsuje wpisy, rozdziela błędy, ostrzeżenia i informacje, a następnie kieruje je do odpowiednich workflowów.

Korzyści: Szybsze wykrywanie problemów, automatyczna priorytetyzacja.

Przykładowy flow rozszerzony JSON
json
{
  "nodes": [
    {
      "id": "1",
      "type": "apiReceive",
      "name": "Get Logs",
      "config": { "endpoint": "/api/activity/log" }
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
        "body": "{ \"message\": \"Wykryto błędy w logach!\" }",
        "headers": { "Content-Type": "application/json", "Authorization": "Bearer <API_KEY>" }
      }
    }
  ],
  "connections": { "1": ["2"], "2": ["3"], "3": ["4"] }
}
B. Generowanie codziennych raportów aktywności
Automatyzacja uruchamiana codziennie o godz. 7:00.

Zbiera dane z logów, podsumowuje i formatuje raport tekstowy.

Wysyła raport do ActivePieces do dalszej dystrybucji.

2. ActivePieces – dodatkowe automatyzacje
A. Wielokanałowe powiadomienia o przypomnieniach
Rozsyłanie powiadomień przypomnień SMS, e-mail, push notification.

Logika wyboru kanału na podstawie preferencji użytkownika.

json
{
  "trigger": { "type": "schedule", "expression": "*/15 * * * *" },
  "actions": [
    {
      "type": "httpRequest",
      "config": { "url": "https://api.mybonzo.com/api/reminders", "method": "GET" }
    },
    {
      "type": "filter",
      "config": { "criteria": "reminder time matches now" }
    },
    {
      "type": "switch",
      "config": {
        "cases": [
          {
            "condition": "{{reminder.preferEmail}}",
            "actions": [
              {
                "type": "sendEmail",
                "config": {
                  "to": "{{reminder.email}}",
                  "subject": "Przypomnienie mybonzo",
                  "body": "Masz przypomnienie: {{reminder.text}}"
                }
              }
            ]
          },
          {
            "condition": "{{reminder.preferSMS}}",
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
B. Automatyczne przypisywanie ticketów i zgłoszeń
Po otrzymaniu zgłoszenia AI klasyfikuje kategorię.

Workflow kieruje zgłoszenie do odpowiedniego zespołu zgodnie z klasyfikacją.

Wysyłka powiadomienia o nowym zgłoszeniu.

3. Instrukcja dodawania i rozwijania automatyzacji
W Flowise i ActivePieces twórz workflowy zgodnie z JSON-ami, importując je w narzędziach.

Korzystaj z webhooków i API do integracji z backendem.

Ustawiaj wyzwalacze czasowe dla cyklicznych zadań.

Testuj każdą automatyzację osobno przed integracją.

Dokumentuj każdy proces, aby usprawnić przyszłą rozbudowę.

