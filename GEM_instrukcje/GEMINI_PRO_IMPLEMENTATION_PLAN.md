# Pełny Scenariusz Implementacji Agentów Gemini Pro

Poniżej znajduje się szczegółowy plan wdrożenia systemu agentów "POLACZEK" z agentem Gemini Pro jako orchestratorem. Plan ten bazuje na analizie plików z folderu `gemini-pro` i omija warstwę ADK, która jest jedynie symulacją, na rzecz bardziej bezpośredniej implementacji.

---

### Krok 1: Uruchomienie Backendu Agentów

Backend jest kluczowy, ponieważ zarządza stanem agentów w bazie danych.

1.  **Przygotowanie Środowiska:**
    *   Upewnij się, że masz zainstalowany Node.js i npm/pnpm.
    *   Zainstaluj zależności dla serwera Express i bazy danych:
        ```bash
        npm install express better-sqlite3
        ```
2.  **Uruchomienie Serwera:**
    *   Użyj `ts-node` lub skompiluj `polaczek_agents_backend.ts` do JavaScript.
    *   Uruchom serwer poleceniem:
        ```bash
        npx ts-node "dodatki nieusuwac/agents/modules/gemini-pro/polaczek_agents_backend.ts"
        ```
    *   Po uruchomieniu, serwer API będzie działał na `http://localhost:3000` i automatycznie stworzy plik bazy danych `agents.db`.

---

### Krok 2: Konsolidacja i Implementacja Logiki `core.js`

W folderze `gemini-pro` znajdują się zduplikowane lub niekompletne wersje `core.js`. Należy je połączyć w jeden spójny plik.

1.  **Stworzenie Pliku Głównego:**
    *   Stwórz nowy plik `src/components/agents/modules/gemini-pro/gemini-pro-core.js`.
2.  **Połączenie Logiki:**
    *   Skopiuj i połącz klasy `GeminiProAgentFunctions` z plików `core.js` i `core.ts.txt`.
    *   Usuń duplikaty i wybierz lepsze implementacje (np. wersja z `core.ts.txt` ma bardziej rozbudowany rejestr agentów i lepsze reguły delegacji).
    *   Upewnij się, że finalna klasa zawiera:
        *   Rejestr agentów (`agentsRegistry`).
        *   Funkcję delegowania zadań (`delegateToAgent`).
        *   Funkcję inteligentnego routingu (`processGeminiConversation`).
        *   Funkcje do zarządzania agentami (`getAgentsOverview`, `registerAgent`, etc.).
3.  **Finalny Kod `gemini-pro-core.js`:**
    *   Zapiszę finalną, połączoną wersję kodu w tym pliku.

---

### Krok 3: Implementacja API dla Pod-Agentów

System `Gemini Pro` deleguje zadania do endpointów (`/api/polaczek-t`, etc.). Musimy stworzyć te endpointy.

1.  **Struktura API w Astro:**
    *   W Astro, pliki w `src/pages/api/` stają się endpointami API.
2.  **Stworzenie Plików API:**
    *   Stwórz pliki dla każdego agenta z rejestru, np.:
        *   `src/pages/api/polaczek-t.ts` (dla tłumacza)
        *   `src/pages/api/polaczek-m1.ts` (dla muzyki)
3.  **Przykładowa Implementacja (`polaczek-t.ts`):**
    ```typescript
    import type { APIRoute } from 'astro';

    export const POST: APIRoute = async ({ request }) => {
      const body = await request.json();
      const textToTranslate = body.text;

      // Tutaj logika tłumaczenia (np. wywołanie Google Translate API)
      const translatedText = `Przetłumaczono: "${textToTranslate}"`;

      return new Response(JSON.stringify({ response: translatedText }));
    }
    ```
    *   Stworzę podobne, placeholderowe implementacje dla pozostałych agentów.

---

### Krok 4: Integracja z Panelem "POLACZEK Dyrektor"

Panel administracyjny jest kluczem do zarządzania systemem.

1.  **Przeniesienie Komponentu:**
    *   Przenieś kod z `PolaczekDyrektorPanel.svelte.txt` do nowego pliku `.svelte`, np. `src/components/admin/PolaczekDyrektorPanel.svelte`.
2.  **Integracja z Astro:**
    *   Stwórz nową stronę w Astro, np. `src/pages/admin/dashboard.astro`.
    *   Zaimportuj i umieść komponent Svelte na tej stronie.
        ```astro
        ---
        import PolaczekDyrektorPanel from '../../components/admin/PolaczekDyrektorPanel.svelte';
        ---
        <html lang="pl">
          <head>
            <title>Panel Dyrektora</title>
          </head>
          <body>
            <PolaczekDyrektorPanel client:load />
          </body>
        </html>
        ```
3.  **Weryfikacja:**
    *   Po uruchomieniu aplikacji dewelopersko (`npm run dev`), panel powinien być dostępny pod adresem `/admin/dashboard` i komunikować się z backendem na `localhost:3000`.

---

Ten scenariusz zapewnia pełne, odseparowane od ADK wdrożenie systemu agentów Gemini Pro. Czy mam przystąpić do realizacji tego planu, zaczynając od stworzenia skonsolidowanej wersji `core.js`?