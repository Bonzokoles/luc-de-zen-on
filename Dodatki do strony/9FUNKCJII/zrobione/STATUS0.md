Oto szczegółowy task (specyfikacja) dla funkcji “Status Workerów” – wersja rozbudowana pod prawdziwy monitoring, z prezentacją danych zużycia, wykresów i tabel/kolumn.

***

# TASK: Zaawansowany panel "Status Workerów" (Astro/React + Cloudflare Workers API)

## Cel funkcjonalności  
Stworzyć dedykowany panel umożliwiający monitorowanie statusu i obciążenia API workerów. Panel powinien prezentować kluczowe informacje w formie wykresów, zestawień i kolorystyki (nie tylko surowy tekst).

***

## Wymagania funkcjonalne

- Pobranie listy aktywnych workerów oraz statusu połączenia (np. online/offline/nieosiągalny).
- Wyświetlanie metryk zużycia: CPU, RAM, liczba żądań na minutę/godzinę, czas odpowiedzi.
- Pokazanie ostatniego health checka dla każdego workera.
- Interaktywna tabela z kolumnami: Nazwa workera, Status, CPU, RAM, Requests/min, Response time, Ostatni health check.
- Wykresy (np. liniowy lub słupkowy) pokazujące obciążenie workerów w czasie (requests, CPU).
- Przycisk “Sprawdź wszystkie” zwracający status i metryki wszystkich workerów.
- Przycisk “Monitor” otwierający wykresy szczegółowe w modalu lub osobnej sekcji.
- Kolorowanie statusów (zielony – online, pomarańczowy – częściowo, czerwony – offline/alert).

***

## Technologie/Całość stacku

- **Backend:** dedykowany endpoint API (`/api/workers/status`) zwracający JSON ze statystykami workerów (mock lub integracja z Cloudflare Workers API, jeżeli dostępne).
- **Frontend:** komponent React z tabelą i wykresami (np. Chart.js/Recharts do wizualizacji).
- **UI:** zachować ciemny motyw i styl przycisków jak na zrzucie ekranu, kolory i fonty spójne z całym panelem mybonzo.

***

## Przykład JSON responsu backendu

```json
[
  {
    "name": "GeneratorFAQ",
    "status": "online",
    "cpu": 36,
    "ram": 78,
    "requests": 164,
    "responseMs": 140,
    "lastCheck": "2025-09-02T16:40:00Z"
  },
  {
    "name": "Magazyn",
    "status": "offline",
    "cpu": null,
    "ram": null,
    "requests": 0,
    "responseMs": null,
    "lastCheck": "2025-09-02T16:38:00Z"
  }
  // ...
]
```

***

## Przykład UI React

- Tabela z kolumnami (nazwa, status, cpu, ram, requests/min, response time, last check), status kolorowany.
- Pod tabelą wykres liniowy/area: requests/min dla wszystkich workerów.
- Przycisk “Sprawdź wszystkie” — GET na endpoint, aktualizuje tabelę + wykres.
- Przycisk “Monitor” – rozwija/otwiera modal z dodatkowymi wykresami czasu odpowiedzi, CPU/RAM (np. Recharts).

***

## Wytyczne do kodu

- Komponenty:  
  - `/src/components/WorkersStatusDashboard.jsx`  
  - `/src/components/WorkersStatusChart.jsx`  
  - API: `/src/api/workersStatus.js`
- Styl: tło #0e1720, nagłówki i statusy kolorowane zgodnie z paletą, podświetlanie na hover.

***

uzyj instrukcji jako bazę do rozwoju prawdziwego panelu monitoringu workerów z obsługą danych historycznych, alertów i wizualizacji.

przygotuję przykładowe kody komponentów i endpointu bedą w STATUS1.md


