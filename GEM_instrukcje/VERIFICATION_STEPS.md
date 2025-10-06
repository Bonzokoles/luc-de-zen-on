# Weryfikacja Implementacji Systemu Agentów

Poniższe kroki pozwolą Ci uruchomić i zweryfikować działanie zaimplementowanego systemu agentów "POLACZEK" wraz z panelem administracyjnym.

---

### Krok 1: Uruchomienie Backendu

Backend (serwer API) jest odpowiedzialny za zarządzanie agentami w bazie danych. Musi być uruchomiony, aby panel administracyjny mógł działać.

1.  Otwórz nowy terminal.
2.  Uruchom serwer za pomocą następującego polecenia:
    ```bash
    npx ts-node "dodatki nieusuwac/agents/modules/gemini-pro/polaczek_agents_backend.ts"
    ```
3.  Po pomyślnym uruchomieniu, w konsoli powinien pojawić się komunikat `POLACZEK backend running on http://localhost:3000`.

**Uwaga:** Plik `polaczek_agents_backend.ts` znajduje się obecnie w tymczasowym katalogu `dodatki nieusuwac`. W docelowej architekturze projektu warto przenieść go do dedykowanego folderu, np. `src/server`.

---

### Krok 2: Uruchomienie Aplikacji Astro

Główna aplikacja Astro musi być uruchomiona, aby można było uzyskać dostęp do panelu w przeglądarce.

1.  Użyj głównego terminala projektu.
2.  Uruchom serwer deweloperski Astro poleceniem:
    ```bash
    npm run dev
    ```
3.  Astro poinformuje Cię, pod jakim adresem aplikacja jest dostępna (zazwyczaj `http://localhost:4321`).

---

### Krok 3: Otwarcie Panelu w Przeglądarce

Gdy oba serwery (backend i aplikacja Astro) są uruchomione, możesz otworzyć panel.

1.  Otwórz przeglądarkę internetową.
2.  Wejdź na adres, pod którym działa Twoja aplikacja Astro, dodając na końcu `/admin/dashboard`.
    *   **Przykład:** `http://localhost:4321/admin/dashboard`

Panel powinien się załadować, połączyć z backendem i wyświetlić listę agentów zdefiniowanych w `gemini-pro-core.js`. Będziesz mógł zarządzać agentami (dodawać, usuwać, zmieniać status) za pomocą interfejsu.
