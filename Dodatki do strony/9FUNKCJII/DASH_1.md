Oto kompleksowy task (specyfikacja) na zaprojektowanie i implementację panelu administracyjnego systemu mybonzo – wersja pod Astro/React, zgodna ze stylem “cyber/neo”, z logowaniem na hasło **HAOS77**.

***
w dashboard wstaw w górnej części cytat :

 I've seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. I watched C-beams glitter in the dark near the Tannhäuser Gate. All those moments will be lost in time, like tears in rain.  


# TASK: Panel Administracyjny – MyBonzo (Astro/React)

## Cel  
Stworzyć rozbudowany panel administracyjny do zarządzania i monitoringu systemu, dostępny po zalogowaniu przez uprawnioną osobę.

***

## Funkcje panelu administratora

- **Logowanie:**  
  - Wyłącznie pole na login (np. “admin” lub dowolny user), hasło: **HAOS77** (pole input z maską).
  - Po pomyślnym zalogowaniu pokazuje cały panel dashboardu.

- **Monitoring i wizualizacja danych:**
  - Statystyki liczby odwiedzających (w czasie rzeczywistym i historycznie).
  - Liczba zapytań do AI/ticket systemu, liczba otwartych/załatwionych zgłoszeń.
  - Aktualna lista użytkowników i szybki podgląd ich statusów (aktywni/ostatnia aktywność).
  - Panel stanu “czy rozwiązania użytkowników działają” (np. tabela ze statusem wdrożonych rozwiązań u klientów).
  - Podgląd najnowszych  zapytań/ticketów – treść, status, przypisany support.
  - Statystyki finansowe: podsumowanie przychodów, koszty, płatności online – tabele i wykresy z podziałem na okresy.
  - Monitoring płynności działania serwisu: uptime, szybkość odpowiedzi, status workerów/API, ostatnie awarie.
  - Tabele z kluczowymi danymi, sortowane i z filtrowaniem (np. przez typ zgłoszenia, użytkownika czy datę).
  - Interaktywne wykresy (np. ruchu na stronie, trendów rozwiązań, rozkład geograficzny klientów).
  - Alarmy i alerty systemowe – wyświetlenie najważniejszych problemów/warningów na górze panelu.

- **Inne rekomendowane elementy:**
  - Szybkie “skrótowe akcje” – np. przycisk do masowego resetu hasła, restartu workerów, eksportu raportu.
  - Sekcja z ostatnimi aktualizacjami i changelogi systemu/AI.
  - Podsumowanie efektywności zespołu support (średni czas odpowiedzi, skuteczność).
  - Historia logów systemowych oraz logowania administratorów.

***

## Wygląd/UI

- Tło: Ciemne/cyber, neonowe akcenty, prostokątne boxy i kafelki jak na Twoich screenach.
- Główna sekcja: Podzielona na boxy/kafelki z danymi (użyj gridu).
- Tabele stylowane, z hoverami i filtrowaniem.
- Wykresy: Chart.js, Recharts albo inny nowoczesny (kolorystyka: cyan, róż, żółty).
- Widoczny od razu przycisk “Wyloguj się”.

***

## Technologie

- **Frontend:** Astro + React (komponenty gridów, wykresów, tabelek).
- **Backend:** API Workers na Cloudflare – endpointy do pobierania statystyk, statusów, zgłoszeń, płatności i logów.
- **Autoryzacja:** Prosty JWT lub sesja w przeglądarce po podaniu hasła HAOS77.
- **Styling:** Tailwind lub niestandardowy CSS zgodny ze stylem systemu.
- **Workflow/Automatyzacje:** Flowise i ActivePieces do obsługi automatycznych alarmów i synchronizacji danych.

***

## Przykładowa architektura kodu:

- `/src/pages/admin.jsx` – główny dashboard (formularz login, warunkowe renderowanie panelu, wylogowanie).
- `/src/components/Admin/PanelStats.jsx` – statystyki i info ogólne.
- `/src/components/Admin/TrafficChart.jsx` – wykres ruchu.
- `/src/components/Admin/UsersTable.jsx` – tabelka użytkowników.
- `/src/components/Admin/TicketsTable.jsx` – zgłoszenia/tickety.
- `/src/components/Admin/Finances.jsx` – przychody/koszty.
- `/src/components/Admin/StatusBox.jsx` – health API i workerów.
- `/src/api/admin/*.js` – endpointy do obsługi i pobierania danych.
- `/src/components/Admin/AlertsBar.jsx` – pas alertów na górze.

***

## Algorytm logowania (fragment)

```jsx
// ... pseudo-React login logic
const [login, setLogin] = useState("");
const [password, setPassword] = useState("");
const [auth, setAuth] = useState(false);

function handleLogin() {
  if (password === "HAOS77") setAuth(true);
}
```

***

## Rozszerzenia

- Trzymanie historii wyświetleń panelu w DOC_mentacja.
- Notyfikacje push dla ważnych alertów.
- Exporte do PDF/Excel raportów miesięcznych i dziennych.

***

**przeczytaj specyfikacje specyfikację do wygenerowania gotowych komponentów, endpointów i stylów! JA rozwinę od razu przykładowy kod wybranych komponentów lub endpointów .wstawie je w DASH_2.md**

