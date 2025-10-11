
# Dokumentacja Architektury: System Multi-Tenant

**Cel:** Umożliwienie platformie MyBonzo obsługi wielu odizolowanych klientów (tenantów), gdzie każdy ma dostęp do własnego zestawu funkcji i danych.

---

## 1. Struktura Bazy Danych (Cloudflare D1)

Sercem systemu jest relacyjna baza danych `mybonzo-analytics` w usłudze Cloudflare D1. Została ona zaprojektowana w celu zarządzania klientami, użytkownikami, ich uprawnieniami oraz logami użycia.

### Tabela: `Clients`
Przechowuje informacje o kontach głównych (firmach).

```sql
CREATE TABLE Clients (
  id TEXT PRIMARY KEY,      -- Unikalny identyfikator klienta (np. client_166549...)
  name TEXT NOT NULL,         -- Pełna nazwa klienta/firmy
  created_at TEXT NOT NULL  -- Data utworzenia konta
);
```

### Tabela: `Users`
Przechowuje dane logowania poszczególnych użytkowników i przypisuje ich do konkretnego klienta.

```sql
CREATE TABLE Users (
  id TEXT PRIMARY KEY,              -- Unikalny identyfikator użytkownika
  email TEXT NOT NULL UNIQUE,       -- Adres e-mail (login)
  password_hash TEXT NOT NULL,      -- Hash hasła (obecnie symulowany)
  client_id TEXT NOT NULL,          -- Klucz obcy wskazujący na tabelę Clients
  FOREIGN KEY (client_id) REFERENCES Clients(id)
);
```

### Tabela: `ClientFeatures`
Dynamicznie zarządza dostępem do funkcji dla każdego klienta.

```sql
CREATE TABLE ClientFeatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,          -- Klucz obcy do tabeli Clients
  feature_id TEXT NOT NULL,         -- Identyfikator funkcji (np. 'image_generator')
  is_enabled INTEGER DEFAULT 1,     -- Flaga włączenia/wyłączenia (1 lub 0)
  FOREIGN KEY (client_id) REFERENCES Clients(id)
);
```

### Tabela: `UsageLogs`
Rejestruje użycie poszczególnych funkcji, stanowiąc podstawę dla systemu "pay-as-you-go".

```sql
CREATE TABLE UsageLogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,          -- Klucz obcy do tabeli Clients
  feature_id TEXT NOT NULL,         -- Identyfikator użytej funkcji
  timestamp TEXT NOT NULL,          -- Dokładny czas użycia
  cost REAL                         -- Koszt operacji (np. na podstawie zużycia tokenów AI)
);
```

---

## 2. Przepływ Uwierzytelniania i Autoryzacji

System opiera się na tokenach sesji (symulacja JWT) do weryfikacji tożsamości i uprawnień.

1.  **Logowanie:**
    -   Użytkownik wysyła `email` i `password` do endpointu `/api/auth/login`.
    -   Serwer weryfikuje dane w tabeli `Users`.
    -   Jeśli dane są poprawne, serwer generuje **token sesji** zawierający zaszyfrowane (w symulacji - zakodowane w Base64) `userId` i `clientId`.

2.  **Ochrona API (Middleware):**
    -   Plik `src/middleware.ts` działa jako "strażnik" dla wszystkich zapytań do API (z wyjątkiem publicznych, jak `/login`).
    -   Przy każdym zapytaniu, middleware odczytuje token z nagłówka `Authorization`.
    -   Waliduje token i odkodowuje z niego `userId` oraz `clientId`.
    -   Dane te są przekazywane do kontekstu (`context.locals.auth`), dzięki czemu każdy endpoint API wie, który użytkownik i klient wykonuje zapytanie.
    -   Jeśli token jest nieprawidłowy lub go brakuje, dostęp jest blokowany (status 401).

3.  **Dostęp do Danych:**
    -   Każdy endpoint API, który operuje na danych (np. pobiera historię, zapisuje pliki), **musi** użyć `clientId` z kontekstu do filtrowania zapytań do bazy danych.
    -   Przykład: `SELECT * FROM MojaTabela WHERE client_id = ?`.
    -   To gwarantuje ścisłą **izolację danych** - klienci widzą tylko swoje zasoby.

---

## 3. Logika Biznesowa

- **Zarządzanie Funkcjami:** Główny administrator może zarządzać wpisami w tabeli `ClientFeatures`, aby włączać i wyłączać moduły dla poszczególnych klientów bez konieczności modyfikacji kodu aplikacji.
- **Elastyczne UI:** Interfejs użytkownika, po zalogowaniu, odpytuje endpoint `/api/my-features`, który na podstawie `clientId` zwraca listę aktywnych `feature_id`. Na tej podstawie UI dynamicznie renderuje dostępne opcje.
- **Monetyzacja:** Tabela `UsageLogs` pozwala na precyzyjne śledzenie zużycia zasobów, co jest fundamentem do wdrożenia dowolnego modelu rozliczeń, w tym "pay-as-you-go" z naliczaniem marży.
