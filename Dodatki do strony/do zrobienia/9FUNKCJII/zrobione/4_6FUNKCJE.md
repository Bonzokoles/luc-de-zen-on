Oto rozbudowany task do implementacji funkcji 4, 6 i 7 systemu mybonzo, zgodny z obecnym stylem, stackiem Cloudflare Workers + Astro + AI orchestration, uwzględniający UX i wymagania biznesowe:

TASK: Implementacja funkcji 4, 6 i 7 (Astro / Cloudflare Workers / AI orchestration)
4. Monitorowanie i raportowanie aktywności
Cel
Zapewnić moduł monitorujący i raportujący aktywność użytkowników i działania systemu z automatycznym wykrywaniem anomalii i wysyłką alertów.

Wymagania funkcjonalne
Mechanizm zbierania logów i zdarzeń z AI oraz frontendu (np. wywołania API, błędy, statystyki użytkowania).

Workflow w Flowise do agregacji i analizy danych pod kątem wykrywania anomalii lub nietypowych aktywności.

Dashboard w Astro przedstawiający: liczbę aktywnych użytkowników, liczbę wygenerowanych treści, błędy, trendy itp.

Generowanie raportów PDF lub e-mail wysyłanych w ustalonych interwałach (np. codziennie, co tydzień).

Alerty mailingowe lub SMS na zdarzenia krytyczne (np. spadek aktywności, błędy serwera).

Dostęp do dashboardu ograniczony autoryzacją (np. login, token).

Technologie i narzędzia
Backend: Cloudflare Workers API do zbierania logów.

Workflow: Flowise do analizy i ActivePieces do wysyłania raportów i alertów.

Frontend: Astro + React na dashboard, biblioteki wykresów typu Chart.js lub Recharts.

Bezpieczeństwo: Autoryzacja dostępu do dashboardu.

6. Harmonogramowanie i przypomnienia
Cel
Umożliwić użytkownikom tworzenie i zarządzanie przypomnieniami oraz integrację z kalendarzami z powiadomieniami push, e-mail i SMS.

Wymagania funkcjonalne
Interaktywny UI do tworzenia, edycji i usuwania przypomnień oraz zadań (formularze, kalendarz).

Backend (Cloudflare Workers + ActivePieces) do obsługi logiki przypomnień i powiadomień.

Integracje z Google Calendar oraz Outlook Calendar (API do synchronizacji wydarzeń).

Możliwość ręcznej i automatycznej synchronizacji.

AI w workflow do analizy harmonogramu i rekomendacji optymalnych terminów zadań.

Powiadomienia push, e-mail i SMS zgodnie z ustawieniami użytkownika, wysyłane przez ActivePieces.

Technologie i narzędzia
Backend: Cloudflare Workers API, ActivePieces do powiadomień.

Integracje API: Google Calendar API, Microsoft Graph API.

Frontend: Astro + React dla kalendarza/przypomnień, responsywny design ze spójnym stylem.

7. Generator FAQ dynamiczny
Cel
Tworzyć dynamiczne FAQ generowane przez AI na podstawie istniejącej bazy wiedzy i treści strony, z aktualizacją w czasie rzeczywistym.

Wymagania funkcjonalne
AI generujący pytania i odpowiedzi na podstawie treści strony i zgromadzonej bazy wiedzy.

Automatyczna aktualizacja FAQ na stronie, dostępność w widżecie chatowym.

Analiza najczęściej zadawanych pytań od użytkowników i dynamiczne rozbudowywanie bazy FAQ.

Panel edycyjny (opcjonalny) do ręcznej korekty i zatwierdzenia pytań.

Integracja widżetu chatowego kierującego do FAQ w razie potrzeby.

Technologie i narzędzia
Backend: Cloudflare Workers API do obsługi AI i aktualizacji FAQ.

AI: OpenAI GPT-4 jako generator zapytań i odpowiedzi.

Frontend: Astro + React dla widżetu FAQ i ewentualnego panelu edycyjnego.

Workflow: Flowise do monitorowania i triggerowania aktualizacji FAQ.

Styl i UX dla wszystkich funkcji
Utrzymać ciemny motyw z neonowymi, niebieskimi/cyan akcentami.

Responsywny layout i wysokoksotrawne czcionki.

Przyciski i elementy interaktywne z efektami hover/focus.

Łatwe do zrozumienia komunikaty i czytelne wykresy i formularze.

Przyciski i dashboardy wyraźne, pogrubione napisy.

Przykładowe pliki i foldery
/src/pages/dashboard/activity.astro — dashboard monitorowania aktywności.

/src/pages/reminders.astro — interfejs do harmonogramów i przypomnień.

/src/components/FAQWidget.tsx — dynamiczny widget FAQ.

/src/api/activity.js — API worker do zbierania i pobierania danych aktywności.

/src/api/reminders.js — API worker do obsługi przypomnień i synchronizacji kalendarza.

/src/api/faq.js — API worker do generowania i pobierania FAQ.