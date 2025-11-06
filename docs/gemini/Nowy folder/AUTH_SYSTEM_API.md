
# Dokumentacja API: System Uwierzytelniania (Logowanie i Rejestracja)

**Cel:** Zapewnienie mechanizmów do rejestracji, logowania i autoryzacji użytkowników w architekturze multi-tenant.

---

## 1. Endpoint Rejestracji (Narzędzie Deweloperskie)

- **Ścieżka:** `/api/auth/register.ts`
- **Metoda:** `POST`
- **Cel:** Umożliwia szybkie tworzenie nowych klientów (firm) i przypisanych do nich użytkowników na potrzeby testów i demonstracji. W środowisku produkcyjnym ten endpoint powinien być usunięty lub silnie zabezpieczony.

### Struktura Zapytania (Request Body)

```json
{
  "clientName": "Nowa Firma Testowa",
  "userEmail": "test@firma.com",
  "userPassword": "bardzo_silne_haslo"
}
```

### Proces Działania

1.  Tworzy nowy wpis w tabeli `Clients` z unikalnym `clientId`.
2.  Tworzy nowy wpis w tabeli `Users`, przypisując go do nowo utworzonego klienta.
3.  **Symuluje hashowanie hasła** (w obecnej implementacji dodaje prefiks `hashed_`).
4.  Automatycznie przypisuje nowemu klientowi domyślny zestaw włączonych funkcji w tabeli `ClientFeatures`.

### Struktura Odpowiedzi (Success)

```json
{
  "success": true,
  "data": {
    "message": "Klient i użytkownik zostali pomyślnie utworzeni.",
    "clientId": "client_166549...",
    "userId": "user_166549...",
    "userEmail": "test@firma.com"
  }
}
```

---

## 2. Endpoint Logowania

- **Ścieżka:** `/api/auth/login.ts`
- **Metoda:** `POST`
- **Cel:** Główny endpoint do weryfikacji tożsamości użytkownika i generowania tokena sesji.

### Struktura Zapytania (Request Body)

```json
{
  "email": "test@firma.com",
  "password": "bardzo_silne_haslo"
}
```

### Proces Działania

1.  Wyszukuje użytkownika w tabeli `Users` na podstawie podanego adresu e-mail.
2.  **Porównuje hasło (symulacja):** Sprawdza, czy hasło z zapytania (po dodaniu prefiksu `hashed_`) jest identyczne z `password_hash` w bazie danych.
3.  **Generuje token sesji (symulacja JWT):** Jeśli dane są poprawne, tworzy obiekt (payload) zawierający `userId`, `clientId`, `email` oraz datę wygaśnięcia (8 godzin).
4.  Koduje nagłówek i payload tokena za pomocą Base64, tworząc strukturę przypominającą JWT, ale **bez kryptograficznego podpisu**.
5.  Zwraca token do klienta.

### Struktura Odpowiedzi (Success)

```json
{
  "success": true,
  "data": {
    "message": "Logowanie pomyślne!",
    "token": "eyJhbGciOiAiTk9ORSIsICJ0eXAiOiAiSldUIn0=.eyJ1c2VySWQiOiJ1c2VyX...",
  }
}
```

---

## 3. Ważne Uwagi Dotyczące Bezpieczeństwa (Symulacja vs Produkcja)

Obecna implementacja jest **prototypem** i zawiera uproszczenia, które **muszą** zostać zastąpione w środowisku produkcyjnym.

### A. Hashowanie Haseł
- **Obecnie:** Prosta konkatenacja (`'hashed_' + password`).
- **Wymagane na produkcji:** Należy zaimplementować silny, jednokierunkowy algorytm hashujący, taki jak **bcrypt**. Przed zapisem do bazy hasło powinno być hashowane, a podczas logowania porównywane za pomocą funkcji `bcrypt.compare()`.

### B. Tokeny Sesji (JWT)
- **Obecnie:** Obiekt JSON zakodowany w Base64, bez podpisu. Jest to **niezabezpieczone**, ponieważ każda strona może odkodować i odczytać zawartość tokena, a nawet go zmodyfikować.
- **Wymagane na produkcji:** Należy użyć biblioteki takiej jak `jose`, aby tworzyć i weryfikować **podpisane cyfrowo tokeny JWT**. Podpis (wygenerowany z użyciem tajnego klucza znanego tylko serwerowi) gwarantuje, że token nie został zmieniony przez klienta.

---

## 4. Integracja z Middleware

Nowo utworzony plik `src/middleware.ts` jest kluczowym elementem tego systemu. Przechwytuje on wszystkie zapytania do API, odkodowuje (symulowany) token i udostępnia `clientId` oraz `userId` w `context.locals.auth`. Dzięki temu wszystkie pozostałe części aplikacji mogą bezpiecznie operować w kontekście zalogowanego klienta.
