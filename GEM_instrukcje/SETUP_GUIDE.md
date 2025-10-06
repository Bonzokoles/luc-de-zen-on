# Przewodnik Konfiguracji API Google Cloud

Aby w pełni wykorzystać możliwości integracji, postępuj zgodnie z poniższymi krokami w celu uzyskania niezbędnych kluczy i ID z Twojego projektu Google Cloud.

---

### Krok 1: Utworzenie i Konfiguracja Projektu Google Cloud

1.  **Zaloguj się** do [Google Cloud Console](https://console.cloud.google.com/).
2.  **Stwórz nowy projekt** (lub wybierz istniejący). Zanotuj jego **Project ID** - będzie potrzebne.
3.  Upewnij się, że dla projektu włączone jest **fakturowanie (billing)**. Niektóre API, nawet w darmowym limicie, wymagają włączonego fakturowania.

---

### Krok 2: Włączenie Wymaganych API

1.  W menu nawigacyjnym przejdź do **APIs & Services > Library**.
2.  Wyszukaj i włącz (**Enable**) następujące API dla swojego projektu:
    *   `Gmail API`
    *   `Google Calendar API`
    *   `Google Sheets API`
    *   `Google Drive API`
    *   `Vertex AI API` (lub `Generative Language API`)
    *   `Cloud Logging API`
    *   `BigQuery API`
    *   `Analytics Hub API`

---

### Krok 3: Utworzenie Konta Serwisowego (Service Account)

Konto serwisowe to specjalny typ konta Google przeznaczony do uwierzytelniania aplikacji.

1.  Przejdź do **IAM & Admin > Service Accounts**.
2.  Kliknij **+ CREATE SERVICE ACCOUNT**.
3.  **Nazwij konto** (np. `mybonzo-worker-account`) i nadaj mu unikalne ID.
4.  **Nadaj uprawnienia (role):** Aby zapewnić działanie wszystkich funkcji, nadaj temu kontu rolę `Editor`. W środowisku produkcyjnym zaleca się stosowanie bardziej granularnych uprawnień.
5.  Kliknij **Done**.

---

### Krok 4: Wygenerowanie Klucza JSON

1.  Na liście kont serwisowych znajdź to, które właśnie utworzyłeś.
2.  Kliknij na nie, a następnie przejdź do zakładki **KEYS**.
3.  Kliknij **ADD KEY > Create new key**.
4.  Wybierz typ **JSON** i kliknij **CREATE**.
5.  Plik `.json` z kluczem zostanie pobrany na Twój komputer. **Traktuj ten plik jak hasło - jest bardzo poufny.**
6.  **Zawartość tego pliku** należy wkleić w pole "Klucz Konta Serwisowego (JSON)" w panelu konfiguracyjnym.

---

### Krok 5: Konfiguracja Kalendarza i Arkuszy Google

Aby aplikacja mogła zarządzać Twoim kalendarzem i arkuszem CRM, musisz udostępnić je kontu serwisowemu.

1.  **Znajdź adres e-mail konta serwisowego:** Znajdziesz go w szczegółach konta serwisowego w Google Cloud Console. Będzie wyglądał podobnie do `mybonzo-worker-account@twoj-projekt.iam.gserviceaccount.com`.
2.  **Udostępnij Google Calendar:**
    *   Otwórz swój [Google Calendar](https://calendar.google.com/).
    *   W ustawieniach kalendarza, który chcesz zintegrować, znajdź sekcję "Share with specific people or groups".
    *   Dodaj adres e-mail swojego konta serwisowego i nadaj mu uprawnienia **"Make changes to events"**.
    *   W ustawieniach kalendarza znajdź jego **Calendar ID**. Dla głównego kalendarza jest to zazwyczaj Twój adres e-mail. Wklej to ID w panelu konfiguracyjnym.
3.  **Udostępnij Google Sheet (dla CRM):**
    *   Stwórz nowy [Arkusz Google](https://sheets.google.com/).
    *   Kliknij przycisk **"Share"** w prawym górnym rogu.
    *   Dodaj adres e-mail swojego konta serwisowego i nadaj mu rolę **"Editor"**.
    *   Skopiuj **ID Arkusza** z jego adresu URL (`https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`) i wklej je w panelu konfiguracyjnym.

Po wykonaniu tych kroków, będziesz miał wszystkie niezbędne dane do wklejenia w panelu konfiguracyjnym i wygenerowania komend `wrangler`.
