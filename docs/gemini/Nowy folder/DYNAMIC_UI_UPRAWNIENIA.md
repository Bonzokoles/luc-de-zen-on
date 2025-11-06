
# Dokumentacja Funkcji: Dynamiczny Interfejs Użytkownika (UI) oparty na Uprawnieniach

**Cel:** Automatyczne dostosowywanie interfejsu użytkownika na stronie głównej (`index.astro`) w zależności od funkcji i usług, do których dany klient ma wykupiony dostęp.

---

## 1. Kluczowe Komponenty

- **Strona Główna (`src/pages/index.astro`):** Centralny punkt, w którym logika jest implementowana.
- **API Uprawnień (`/api/my-features.ts`):** Endpoint dostarczający listę włączonych funkcji dla zalogowanego klienta.
- **Atrybut `data-feature-id`:** Specjalny atrybut HTML dodany do każdego kafelka funkcji, umożliwiający jego identyfikację przez skrypt (np. `data-feature-id="image_generator"`).

---

## 2. Przepływ Działania

Logika jest uruchamiana po pełnym załadowaniu strony (`DOMContentLoaded`) i przebiega następująco:

1.  **Sprawdzenie Sesji:** Skrypt najpierw szuka w `localStorage` zapisanego tokena sesji (`mcp_jwt_token`).
    -   **Jeśli token nie istnieje:** Użytkownik jest natychmiast przekierowywany na stronę logowania (`/login`).
    -   **Jeśli token istnieje:** Kontynuuje do następnego kroku.

2.  **Pobranie Uprawnień:**
    -   Wykonywane jest zapytanie `GET` do endpointu `/api/my-features` z dołączonym tokenem w nagłówku `Authorization`.
    -   Backend (chroniony przez middleware) weryfikuje token i zwraca listę identyfikatorów funkcji, które są aktywne dla danego klienta (np. `["chatbot", "image_generator"]`).
    -   W przypadku nieważnego tokena, API zwraca status `401`, a skrypt front-endowy usuwa token i również przekierowuje na stronę logowania.

3.  **Dynamiczna Modyfikacja UI:**
    -   Skrypt pobiera z dokumentu HTML wszystkie elementy posiadające atrybut `data-feature-id`.
    -   Dla każdego kafelka sprawdza, czy jego `feature_id` znajduje się na liście pobranych, aktywnych funkcji.
    -   **Jeśli funkcja jest AKTYWNA:** Kafelek pozostaje bez zmian, w pełni interaktywny.
    -   **Jeśli funkcja jest NIEAKTYWNA:**
        -   Do kafelka dodawana jest klasa `feature-disabled`.
        -   Jego wygląd jest zmieniany (np. przez `opacity: 0.5` i `filter: grayscale(80%)`), aby wizualnie zasygnalizować brak dostępności.
        -   Oryginalne zdarzenie `click` (przekierowanie) jest blokowane.
        -   Do kafelka dodawany jest **nowy event listener**.

4.  **Informacja o Rozszerzeniu Planu:**
    -   Kliknięcie w nieaktywny (wyszarzony) kafelek uruchamia nowy event listener.
    -   Wyświetla on użytkownikowi komunikat `alert()` z informacją, że funkcja jest niedostępna w jego obecnym planie i sugeruje kontakt w celu rozszerzenia subskrypcji. Wskazuje również na stronę `klf-sheed-shop.astro` jako miejsce z cennikiem.

---

## 3. Przykładowy Kod (Fragment skryptu z `index.astro`)

```javascript
// ... (po pobraniu tokena i uprawnień)

// Pobierz listę włączonych funkcji, np. ["chatbot", "tavily"]
const enabledFeatures = data.data.enabledFeatures;

// Znajdź wszystkie kafelki na stronie
const allFeatureTiles = document.querySelectorAll('[data-feature-id]');

allFeatureTiles.forEach(tile => {
  const featureId = tile.getAttribute('data-feature-id');

  if (enabledFeatures.includes(featureId)) {
    // Funkcja włączona - nic nie rób, pozostaw kafelek aktywny
    tile.classList.remove('feature-disabled');
  } else {
    // Funkcja wyłączona - zablokuj ją
    tile.classList.add('feature-disabled');
    tile.style.opacity = '0.5';
    tile.style.filter = 'grayscale(80%)';
    tile.style.cursor = 'not-allowed';

    const link = tile.closest('a');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Zablokuj oryginalny link
            alert('Ta funkcja nie jest dostępna w Twoim planie... ');
        });
    }
  }
});
```

---

## 4. Korzyści z Takiego Podejścia

-   **Bezpieczeństwo:** Logika uprawnień jest weryfikowana po stronie serwera. Frontend tylko wyświetla wynik.
-   **Elastyczność:** Możesz włączać i wyłączać funkcje dla klientów w czasie rzeczywistym, bez konieczności modyfikacji kodu frontendu.
-   **Doświadczenie Użytkownika (UX):** Klient widzi pełną ofertę platformy, co naturalnie zachęca do rozszerzania planu, zamiast ukrywać przed nim niedostępne opcje.
-   **Centralizacja Logiki:** Cała logika uprawnień jest zarządzana w jednym miejscu (skrypt w `index.astro`), co ułatwia jej utrzymanie i rozwój.
