# Rekonstrukcja Agentów z Usuniętego Katalogu ADK

Wyjaśnienie: Katalog `Q:\ADK_AGEN_ts_zEN` nie istniał fizycznie na dysku. Był on **symulowany** w kodzie (`src/utils/ADKAdapter.ts`) na potrzeby dewelopmentu w środowisku przeglądarki. Poniżej odtworzyłem definicje i funkcje tych agentów na podstawie analizy tego pliku.

---

### 1. Agent: `voice_assistant_pl` (Asystent Głosowy PL)

*   **Opis:** Agent przeznaczony do prowadzenia konwersacji i wykonywania zadań w języku polskim.
*   **System Prompt:** `Jesteś asystentem głosowym mówiącym po polsku. Pomagasz użytkownikom w codziennych zadaniach.`
*   **Zdolności (Capabilities):**
    *   `voice_recognition` (rozpoznawanie mowy)
    *   `polish_language` (obsługa języka polskiego)
    *   `conversation` (prowadzenie rozmowy)

---

### 2. Agent: `music_controller` (Kontroler Muzyki)

*   **Opis:** Agent specjalizujący się w zarządzaniu odtwarzaniem muzyki.
*   **System Prompt:** `Jesteś kontrolerem muzyki. Zarządzasz odtwarzaniem, playlistami i ustawieniami audio.`
*   **Zdolności (Capabilities):**
    *   `music_playback` (odtwarzanie muzyki)
    *   `playlist_management` (zarządzanie playlistami)
    *   `audio_control` (kontrola audio, np. głośność)

---

### 3. Agent: `ai_helper` (Pomocnik AI)

*   **Opis:** Ogólny asystent AI do rozwiązywania problemów i wyszukiwania informacji.
*   **System Prompt:** `Jesteś asystentem AI. Pomagasz rozwiązywać problemy i znajdować informacje.`
*   **Zdolności (Capabilities):**
    *   `ai_assistance` (wsparcie AI)
    *   `problem_solving` (rozwiązywanie problemów)
    *   `information_lookup` (wyszukiwanie informacji)

---

### 4. Agent: `system_navigator` (Nawigator Systemowy)

*   **Opis:** Agent do zarządzania systemem plików i nawigacji.
*   **System Prompt:** `Jesteś nawigatortem systemowym. Pomagasz w poruszaniu się po systemie i zarządzaniu plikami.`
*   **Zdolności (Capabilities):**
    *   `system_control` (kontrola systemu)
    *   `navigation` (nawigacja)
    *   `file_management` (zarządzanie plikami)

Te definicje są podstawą, na której `ADKAdapter.ts` buduje obiekty agentów w formacie "POLACZEK Agent System", integrując je z Google Dialogflow CX.
