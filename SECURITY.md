# Polityka Bezpieczeństwa

## Wspierane Wersje

Aktywnie wspieramy następujące wersje z aktualizacjami bezpieczeństwa:

| Wersja | Wspierana          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :x:                |

## Zgłaszanie Luka Bezpieczeństwa

Jeśli odkryjesz lukę bezpieczeństwa w platformie MyBonzo, zgłoś ją do nas w następujący sposób:

### Informacje Kontaktowe

- **Email**: [security@mybonzo.com](mailto:security@mybonzo.com)
- **Czas Odpowiedzi**: Potwierdzimy otrzymanie zgłoszenia w ciągu 48 godzin
- **Aktualizacje**: Będziemy regularnie informować o postępach w sprawie

### Co Zawrzeć w Zgłoszeniu

Prosimy o dołączenie następujących informacji w zgłoszeniu:

- Jasny opis luki bezpieczeństwa
- Kroki do odtworzenia problemu
- Potencjalny wpływ i poziom zagrożenia
- Sugerowane poprawki lub środki zaradcze

### Nasz Proces

1. **Potwierdzenie**: Potwierdzimy otrzymanie w ciągu 48 godzin
2. **Badanie**: Zbadamy i zweryfikujemy lukę bezpieczeństwa
3. **Opracowanie Poprawki**: Opracujemy i przetestujemy poprawkę
4. **Ujawnienie**: Skonsultujemy ujawnienie z Tobą
5. **Rozwiązanie**: Wdrożymy poprawkę i zaktualizujemy wszystkie systemy dotknięte problemem

## Najlepsze Praktyki Bezpieczeństwa

### Dla Współtwórców

- Nigdy nie commituj sekretów lub wrażliwych danych
- Używaj zmiennych środowiskowych do konfiguracji
- Stosuj zasadę najmniejszych uprawnień
- Regularnie aktualizuj zależności
- Uruchamiaj skanowanie bezpieczeństwa przed merge

### Dla Użytkowników

- Trzymaj klucze API w bezpiecznym miejscu
- Używaj silnych, unikalnych haseł
- Włącz uwierzytelnianie dwuskładnikowe
- Regularnie aktualizuj aplikacje klienckie
- Zgłaszaj podejrzaną aktywność

## Funkcje Bezpieczeństwa

- **Ochrona Cloudflare**: Ochrona przed DDoS i WAF
- **Ograniczenie Stawu API**: Zapobiega nadużywaniu punktów końcowych API
- **Walidacja Danych Wejściowych**: Wszystkie dane wejściowe użytkowników są walidowane i sanityzowane
- **Tylko HTTPS**: Wszystkie komunikacje są szyfrowane
- **Regularne Audyty Bezpieczeństwa**: Kod jest regularnie skanowany pod kątem luk bezpieczeństwa

## Odpowiedzialne Ujawnianie

Prosimy o:

- Danie nam rozsądnego czasu na naprawę problemu przed publicznym ujawnieniem
- Unikanie dostępu lub modyfikacji danych użytkowników
- Nie wykonywanie ataków DoS lub degradacji wydajności usług
- Nie spamowanie naszych systemów zautomatyzowanymi skanerami luk bezpieczeństwa

Dziękujemy za pomoc w utrzymaniu bezpieczeństwa MyBonzo i naszych użytkowników!
