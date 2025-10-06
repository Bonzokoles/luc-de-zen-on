# Dokumentacja Implementacji - Customer Automation (Rozbudowa)

Ten dokument opisuje proces rozbudowy systemu do automatyzacji obsługi klienta o dwie kluczowe integracje: automatyczne wysyłanie e-maili (przez Gmail) i zapisywanie danych w CRM (przez Google Sheets).

---

### 1. Analiza

*   **Cel:** Pełna automatyzacja procesu obsługi nowego leada, od kwalifikacji przez AI, po automatyczną odpowiedź i zapis w systemie CRM.
*   **Stan Początkowy:** Istniał komponent UI (`LeadQualificationForm.svelte`) oraz endpoint API (`/api/qualify-lead.ts`), który używał AI do samej kwalifikacji leada.
*   **Wniosek:** Należało rozbudować istniejący endpoint o kolejne kroki, wykorzystując dostępne i włączone API Google (Gmail i Google Sheets).

---

### 2. Plan i Implementacja

1.  **Przebudowa API (`/api/qualify-lead.ts`):**
    *   **Integracja z Gmailem:**
        *   Do endpointu dodano funkcję `sendEmail`, która używa biblioteki `googleapis` do uwierzytelnienia się w API Gmaila za pomocą klucza konta serwisowego.
        *   Po tym, jak AI wygeneruje treść odpowiedzi dla klienta (`reply`), funkcja `sendEmail` jest wywoływana, aby automatycznie wysłać tę wiadomość na adres e-mail podany w formularzu.
    *   **Integracja z Google Sheets (CRM):**
        *   Dodano funkcję `saveToSheet`, która również używa `googleapis` do komunikacji z API Arkuszy Google.
        *   Po zakwalifikowaniu leada, wszystkie jego dane (wraz z oceną od AI) są formatowane jako nowy wiersz i dopisywane na końcu skonfigurowanego Arkusza Google, który pełni rolę prostego CRM.
        *   ID arkusza jest pobierane z sekretów (`GOOGLE_SHEET_ID`).
    *   **Równoległe Wykonywanie:** Operacje wysyłki e-maila i zapisu do arkusza są uruchamiane równolegle (`Promise.allSettled`), aby nie blokować odpowiedzi do użytkownika. Ewentualne błędy tych operacji są logowane na serwerze, ale nie przerywają głównego procesu.

2.  **Konfiguracja:**
    *   Stworzono stronę `/admin/configuration` oraz przewodnik `SETUP_GUIDE.md`, aby umożliwić użytkownikowi łatwe skonfigurowanie wszystkich niezbędnych kluczy i ID (konta serwisowego, ID arkusza, ID kalendarza).

### 3. Wynik

*   Stworzono w pełni zautomatyzowany pipeline do obsługi leadów. Nowe zapytanie od klienta jest teraz nie tylko analizowane i kwalifikowane przez AI, ale system automatycznie wysyła do niego spersonalizowaną odpowiedź i zapisuje jego dane w CRM (Arkuszu Google) do dalszego przetwarzania przez zespół sprzedaży. To kompletne rozwiązanie "od A do Z".
