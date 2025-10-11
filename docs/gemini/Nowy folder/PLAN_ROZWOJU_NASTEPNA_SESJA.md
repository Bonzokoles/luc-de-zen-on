
# 🚀 Plan Rozwoju i Weryfikacji - Następna Sesja

**Data:** 10.10.2025
**Cel:** Weryfikacja ostatnich zmian, dalsza rozbudowa funkcjonalności i ulepszenie interfejsu użytkownika.

---

## 1. 📋 Scenariusz Weryfikacji (Co sprawdzić na początku)

Celem tego scenariusza jest upewnienie się, że wszystkie zmiany wprowadzone w poprzedniej sesji działają zgodnie z oczekiwaniami.

1.  **Sprawdzenie Strony Głównej (`index.astro`):
    -   **Cel:** Weryfikacja, czy sekcja "ZAAWANSOWANE FUNKCJE AI" działa poprawnie.
    -   **Kroki:**
        1.  Otwórz stronę główną.
        2.  Kliknij na kilka kafelków w sekcji "ZAAWANSOWANE FUNKCJE AI".
        3.  **Oczekiwany rezultat:** Każdy kafelek powinien otwierać odpowiednią podstronę w nowej karcie.

2.  **Weryfikacja Asystenta Głosowego (`AiHelpAssistant`):
    -   **Cel:** Sprawdzenie globalnej i kontekstowej funkcjonalności asystenta.
    -   **Kroki:**
        1.  Na stronie głównej, otwórz asystenta `POLACZEK_T`.
        2.  Sprawdź, czy wyświetla się komunikat powitalny specyficzny dla strony głównej.
        3.  Użyj komendy głosowej, np. "pokaż status systemu".
        4.  Przejdź na stronę `Generatora Obrazów`.
        5.  Otwórz asystenta i sprawdź, czy komunikat powitalny jest dopasowany do generatora.
        6.  Użyj komendy głosowej, np. "wygeneruj obraz psa w kosmosie".
    -   **Oczekiwany rezultat:** Asystent powinien reagować na komendy i dostarczać kontekstowej pomocy na każdej ze zrefaktoryzowanych stron.

3.  **Test Integracji z Modelem "Bielik":
    -   **Cel:** Potwierdzenie, że aplikacja komunikuje się z prawdziwym modelem "Bielik" na Hugging Face.
    -   **Kroki:**
        1.  Przejdź na stronę `bielik-enon-dev.astro`.
        2.  Zadaj pytanie w języku polskim, np. "Jakie są największe wyzwania dla sztucznej inteligencji w Polsce?".
    -   **Oczekiwany rezultat:** Otrzymanie spójnej i merytorycznej odpowiedzi wygenerowanej przez model `speakleash/bielik-7b-instruct-v0.1`, a nie symulowanej odpowiedzi.

4.  **Sprawdzenie Nowych Stron Funkcyjnych:
    -   **Cel:** Weryfikacja działania stron dla Flowise i Activepieces.
    -   **Kroki:**
        1.  Przejdź na stronę `/flowise-ai`.
        2.  Wybierz jeden z workflow, wpisz przykładowe dane i kliknij "Uruchom Workflow".
        3.  Przejdź na stronę `/activepieces-ai` i powtórz proces.
    -   **Oczekiwany rezultat:** Obie strony powinny poprawnie wysyłać zapytania do swoich API i wyświetlać (nawet jeśli symulowane) wyniki.

---

## 2. 💡 Plan Rozwoju i Ulepszeń (Co można zrobić dalej)

### A. Pełna Integracja Langchain

-   **Cel:** Zastąpienie symulacji Langchain prawdziwą integracją.
-   **Kroki:**
    1.  **Instalacja biblioteki:** Dodaj `langchain` do zależności projektu (`package.json`).
    2.  **Refaktoryzacja API (`gemini-langchain.ts`):** Przepisz endpoint, aby dynamicznie tworzył i uruchamiał łańcuchy (chains) przy użyciu biblioteki Langchain. Zamiast `switch` na `chain_type`, użyj fabryki łańcuchów.
    3.  **Rozbudowa UI:** Dodaj w interfejsie `langchain-integration.astro` możliwość tworzenia własnych, niestandardowych łańcuchów poprzez łączenie dostępnych modeli i narzędzi (np. w formie wizualnych bloków).

### B. Rozbudowa Flowise i Activepieces

-   **Cel:** Uczynienie integracji bardziej interaktywną i użyteczną.
-   **Kroki:**
    1.  **Dynamiczne ładowanie workflow:** Zamiast statycznej listy, pobieraj dostępne workflow z `src/workflows/` i wyświetlaj je w dropdownie.
    2.  **Wizualizacja wyników:** Zamiast surowego JSONa, stwórz komponenty do wizualizacji wyników z poszczególnych workflow (np. w formie kart, tabel, powiadomień).
    3.  **Dodanie nowych workflow:** Stwórz i dodaj więcej predefiniowanych workflow dla typowych zadań biznesowych (np. automatyczne wysyłanie maili, generowanie raportów PDF).

### C. Urealnienie Symulacji MCP Servers

-   **Cel:** Zwiększenie realizmu symulacji zarządzania serwerami.
-   **Kroki:**
    1.  **Dynamiczne metryki:** W funkcji `listMCPServers` (`mcp-servers.ts`), zamiast statycznych wartości, generuj losowe, ale realistyczne dane dla `uptime`, `memory_usage` i `cpu_usage` przy każdym odświeżeniu.
    2.  **Interaktywne Wykresy:** W `mcp-servers-management.astro`, połącz wykresy Chart.js z danymi z API. Użyj `setInterval`, aby co kilka sekund odpytywać API o nowe dane i aktualizować wykresy, tworząc efekt monitoringu w czasie rzeczywistym.
    3.  **Logika Start/Stop:** Rozbuduj funkcje `startMCPServer` i `stopMCPServer`, aby symulowały proces uruchamiania (np. zmiana statusu na "starting" na kilka sekund, a dopiero potem na "running").

### D. Generalne Ulepszenia UI/UX

-   **Cel:** Poprawa ogólnego doświadczenia użytkownika.
-   **Kroki:**
    1.  **Loading States:** Dodaj wskaźniki ładowania (spinners, animacje) we wszystkich miejscach, gdzie aplikacja komunikuje się z API, a odpowiedź może zająć dłuższą chwilę.
    2.  **Tooltips:** Dodaj dymki z podpowiedziami (tooltips) do przycisków i ikon, aby wyjaśnić ich funkcje, zwłaszcza w bardziej zaawansowanych panelach.
    3.  **Puste stany:** Dla list (np. historia wyszukiwania, lista serwerów), zaimplementuj bardziej estetyczne komunikaty o braku danych, zamiast pustych kontenerów.

---

## 3. 🧪 Testowanie

-   **Cel:** Zapewnienie stabilności i niezawodności aplikacji.
-   **Kroki:**
    1.  **Testy manualne:** Po każdej większej zmianie, przeprowadź manualne testy kluczowych funkcjonalności, aby upewnić się, że nic nie zostało zepsute.
    2.  **Testy jednostkowe:** Rozważ dodanie testów jednostkowych dla kluczowych funkcji w `src/lib/api.ts` i innych krytycznych modułach.
    3.  **Testy E2E (End-to-End):** W przyszłości, zaimplementuj testy E2E (np. za pomocą Playwright lub Cypress) do automatycznego testowania całych przepływów użytkownika.
