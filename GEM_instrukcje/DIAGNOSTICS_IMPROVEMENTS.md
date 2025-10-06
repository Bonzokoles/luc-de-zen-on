# Instrukcje Ulepszeń na Podstawie Diagnostyki

Na podstawie przeprowadzonej diagnostyki, poniżej znajdują się dalsze propozycje ulepszeń.

---

### 1. Refaktoryzacja i Zabezpieczenie Logiki Agentów

*   **Obserwacja:** W katalogu `public/components/agents/modules/` znaleziono pliki JavaScript (`ai-functions.js`, `voice-functions.js`, etc.), które prawdopodobnie zawierają kluczową logikę agentów.
*   **Ryzyko:** Umieszczanie logiki biznesowej w publicznie dostępnym katalogu `public` jest ryzykowne. Może to ułatwić analizę i potencjalne wykorzystanie wrażliwych części aplikacji przez osoby nieupoważnione.
*   **Proponowane Ulepszenie:** Przenieś pliki JavaScript z `public/components/agents/modules/` do `src/components/agents/modules/`.
    *   **Działanie:**
        1.  Przenieś pliki `.js` z `public/` do `src/`.
        2.  Zaktualizuj wszystkie odwołania do tych plików w kodzie.
        3.  Wykorzystaj mechanizmy Astro do budowania i serwowania tych skryptów jako zasoby (assets), zamiast trzymać je w `public`.
    *   **Korzyść:** Lepsza organizacja kodu, większe bezpieczeństwo i wykorzystanie standardowych praktyk budowania aplikacji webowych.

---

### 2. Wprowadzenie Zmiennych Środowiskowych dla Kluczy API

*   **Obserwacja:** W poprzedniej analizie zaproponowano integrację z API Google/Gemini. Obecna diagnostyka nie wykazała jeszcze użycia zewnętrznych API.
*   **Proponowane Ulepszenie:** Przygotowanie do bezpiecznej integracji z API poprzez użycie zmiennych środowiskowych.
    *   **Działanie:**
        1.  Stwórz plik `.env` (na podstawie `.env.example`), w którym będą przechowywane klucze API (np. `GEMINI_API_KEY`).
        2.  W konfiguracji Astro (`astro.config.mjs`) lub bezpośrednio w kodzie backendowym (np. w plikach `api.ts`), używaj `import.meta.env.GEMINI_API_KEY` do odczytywania kluczy.
        3.  Nigdy nie umieszczaj kluczy API bezpośrednio w kodzie, zwłaszcza w części klienckiej.
    *   **Korzyść:** Bezpieczne zarządzanie sekretami i kluczami API, co jest kluczowe przy integracji z zewnętrznymi usługami.

---

### 3. Modularne Eksporty i Importy

*   **Obserwacja:** Wyszukiwanie `export` w plikach `.ts` i `.js` nie zwróciło wyników, co może wskazywać na brak jawnych eksportów w niektórych plikach lub ograniczenia narzędzia `grep`.
*   **Proponowane Ulepszenie:** Upewnij się, że wszystkie moduły (`core.js`, `api.ts`) mają jasno zdefiniowane interfejsy poprzez `export`.
    *   **Działanie:** Przejrzyj pliki w `src/components/agents/modules/` i upewnij się, że funkcje i zmienne, które mają być dostępne na zewnątrz, są eksportowane. Używaj `import` do wczytywania zależności między modułami.
    *   **Korzyść:** Lepsza czytelność kodu, łatwiejsze testowanie i reużywalność komponentów.
