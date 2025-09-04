Oto szczegółowy task z rozbudowanym kodem workflow dla ActivePieces i Flowise oraz dalszym dopasowaniem frontendów i backendów do funkcji 4, 6 i 7 systemu mybonzo:

***

# TASK: Szczegółowy plan integracji ActivePieces, Flowise i dopasowanie frontend/backend (funkcje 4, 6, 7)

***

## 1. Funkcja 4 – Monitorowanie i raportowanie aktywności

### Workflow Flowise (logika)

- **Wejście:** webhook lub API odbierający logi aktywności (POST na `/api/activity/log`).
- **Analiza:** krok detekcji anomalii (np. wysoka liczba błędów, niestandardowe aktywności).
- **Filtr reguł:** sprawdzanie progów alertów.
- **Wyjście:** wyzwolenie akcji ActivePieces do wysyłki alertu.

### Workflow ActivePieces (automatyzacja)

- **Akcja:** wysyłka e-mail / SMS do administratora przy wykryciu anomalii lub w ustalonym harmonogramie (raporty).
- **Wyzwalacz:** webhook z Flowise lub harmonogram czasowy (cron daily).
- **Parametry:** zawartość raportu, odbiorcy.

### Fragment przykładowego flow JSON (Flowise):

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "apiReceive",
      "name": "Receive logs",
      "config": {
        "endpoint": "/api/activity/log"
      }
    },
    {
      "id": "2",
      "type": "function",
      "name": "Detect anomalies",
      "config": {
        "script": "const logs = input; const errors = logs.filter(x => x.type === 'error'); return errors.length > threshold;"
      }
    },
    {
      "id": "3",
      "type": "function",
      "name": "Check threshold",
      "config": {
        "script": "return input === true;"
      }
    },
    {
      "id": "4",
      "type": "httpRequest",
      "name": "Trigger ActivePieces Alert",
      "config": {
        "url": "https://api.activepieces.com/trigger-alert",
        "method": "POST",
        "body": "{ \"message\": \"Alert: Wykryto anomalie w logach!\" }",
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
```

***

## 2. Funkcja 6 – Harmonogramowanie i przypomnienia

### Workflow ActivePieces (powiadomienia)

- **Wyzwalacz:** harmonogram powiadomień (cron, np. co godzinę).
- **Akcja:** odczyt przypomnień z bazy lub API przypomnień.
- **Filtr:** porównanie bieżącego czasu z terminami przypomnień.
- **Powiadomienia:** wysyłka e-mail/SMS do użytkownika.

### Integracja API kalendarzy (Google, Outlook)

- Synchronizacja dwukierunkowa przez OAuth i API Google Calendar oraz Microsoft Graph.
- Aktualizacja wpisów zgodnie z przypomnieniami z systemu.

### Przykładowa struktura ActivePieces (JSON):

```json
{
  "trigger": {
    "type": "schedule",
    "expression": "0 * * * *" // co godzinę
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
        "criteria": "check if reminder time is within next hour"
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
```

***

## 3. Funkcja 7 – Generator FAQ dynamiczny

### Workflow Flowise (generowanie FAQ)

- **Wejście:** trigger ręczny lub harmonogram (np. codzienna aktualizacja).
- **Akcja:** wywołanie endpointu z tekstem bazy wiedzy (`/api/faq/generate`).
- **Wyjście:** aktualizacja bazy FAQ w systemie (API PATCH/PUT).

### Frontend i backend

- Endpoint API zwraca aktualną listę FAQ w JSON.
- Widżet w Astro/React pobiera FAQ i prezentuje w formie interaktywnej.
- Panel admina może wywoływać ręczną aktualizację FAQ.

***

## 4. Dopasowanie frontendów i backendów

- Frontendy dedykowane do każdej funkcji (dashboard/logi, przypomnienia, FAQ) z responsywnym UI i ciemnym motywem.
- Backend w Cloudflare Workers do udostępniania API i proxy do AI.
- Wbudowana autoryzacja (np. token JWT) na endpointach administracyjnych.
- Integracja logowania zdarzeń aplikacji do systemu monitorowania.

***

## 5. Plik task VSCode (tasks.json)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build Astro",
      "type": "shell",
      "command": "npm run build",
      "group": "build",
      "problemMatcher": ["$tsc"],
      "detail": "Budowanie frontend Astro"
    },
    {
      "label": "Run Wrangler Dev",
      "type": "shell",
      "command": "wrangler dev",
      "group": "build",
      "detail": "Uruchomienie lokalnego serwera Cloudflare Workers"
    },
    {
      "label": "Deploy Wrangler",
      "type": "shell",
      "command": "wrangler publish",
      "group": "build",
      "detail": "Publikacja Cloudflare Workers"
    },
    {
      "label": "Install Dependencies",
      "type": "shell",
      "command": "npm install",
      "detail": "Instalacja zależności npm"
    }
  ]
}
```

***

