# Dokumentacja funkcji AI - Nowe komponenty systemu

**Data utworzenia:** 2025-09-02  
**Wersja:** 1.0  
**Status:** Produkcyjna implementacja

---

## Przegląd nowych funkcji AI

System został rozszerzony o trzy zaawansowane funkcje AI:

1. **🤖 Generator FAQ dynamiczny** - Automatyczne tworzenie FAQ z bazy wiedzy
2. **🎓 System rekomendacji edukacyjnych** - Spersonalizowane rekomendacje kursów i ścieżek rozwoju
3. **🎫 System zgłoszeń i ticketów** - Inteligentne zarządzanie zgłoszeniami z klasyfikacją AI

---

# 1. Generator FAQ dynamiczny

## Opis funkcji
Automatyczne generowanie FAQ (Frequently Asked Questions) na podstawie dostarczonej bazy wiedzy z wykorzystaniem OpenAI GPT-4o-mini.

## API Endpoint
- **URL:** `/api/faq`
- **Metoda:** POST
- **Content-Type:** `application/json`

### Request Body:
```json
{
  "knowledgeBase": "Tekst bazy wiedzy, dokumentacja, instrukcje..."
}
```

### Response Success:
```json
{
  "faq": "Wygenerowane FAQ w formacie markdown"
}
```

### Response Error:
```json
{
  "error": "Opis błędu"
}
```

## Komponent Frontend
- **Plik:** `src/components/FAQGeneratorWidget.svelte`
- **Klasa CSS:** `faq-widget-container`

### Funkcje komponentu:
- Textarea do wprowadzania bazy wiedzy
- Przyciski "Generuj FAQ" i "Wyczyść"  
- Wyświetlanie wygenerowanego FAQ
- Kopiowanie do schowka
- Obsługa błędów i stanów ładowania

## Przypadki użycia:
- Generowanie FAQ dla produktów
- Tworzenie dokumentacji pomocy
- Automatyzacja obsługi klienta
- Przygotowanie materiałów szkoleniowych

---

# 2. System rekomendacji edukacyjnych  

## Opis funkcji
Spersonalizowane rekomendacje edukacyjne na podstawie profilu użytkownika, poziomu umiejętności, zainteresowań i celów zawodowych.

## API Endpoint
- **URL:** `/api/education-recommendations`
- **Metoda:** POST
- **Content-Type:** `application/json`

### Request Body:
```json
{
  "userProfile": {
    "currentLevel": "początkujący|średnio-zaawansowany|zaawansowany|ekspert",
    "interests": "Lista zainteresowań i dziedzin",
    "careerGoals": "Cele zawodowe użytkownika",
    "availableTime": "1-2 godziny dziennie|3-5 godzin dziennie|weekend tylko|intensywny kurs",
    "learningStyle": "wideo i interaktywne|książki i dokumentacja|praktyczne projekty|mentoring i grupy|mieszany",
    "budget": "darmowe|do 500 zł|do 1500 zł|do 5000 zł|bez ograniczeń"
  }
}
```

### Response Success:
```json
{
  "recommendations": "Szczegółowe spersonalizowane rekomendacje edukacyjne"
}
```

### Response Error:
```json
{
  "error": "Opis błędu"
}
```

## Komponent Frontend
- **Plik:** `src/components/EducationRecommendationsWidget.svelte`
- **Klasa CSS:** `education-widget-container`

### Funkcje komponentu:
- Formularz profilu użytkownika (6 pól)
- Walidacja wymaganych pól
- Wyświetlanie spersonalizowanych rekomendacji
- Kopiowanie rekomendacji do schowka
- Responsywny design z grid layout

## Przypadki użycia:
- Personalizacja ścieżek rozwoju pracowników
- Rekomendacje kursów dla klientów
- Planowanie rozwoju zawodowego
- Matching użytkowników z odpowiednimi programami szkoleniowymi

---

# 3. System zgłoszeń i ticketów

## Opis funkcji
Inteligentny system zarządzania zgłoszeniami z automatyczną klasyfikacją AI, przypisywaniem do zespołów i śledzeniem statusu.

## API Endpoints

### Tworzenie zgłoszenia
- **URL:** `/api/tickets`
- **Metoda:** POST
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "description": "Opis problemu",
  "email": "email@example.com",
  "priority": "low|medium|high|critical",
  "category": "bug|feature-request|question|billing|integration|performance|other"
}
```

#### Response Success:
```json
{
  "ticketId": "TICK-2025-001",
  "status": "created",
  "classification": {
    "team": "tech-support|billing|sales|other",
    "priority": "low|medium|high|critical",
    "summary": "Podsumowanie AI problemu"
  }
}
```

### Sprawdzanie statusu
- **URL:** `/api/tickets?id={ticketId}`
- **Metoda:** GET

#### Response Success:
```json
{
  "ticketId": "TICK-2025-001",
  "status": "open|in-progress|resolved|closed",
  "team": "tech-support",
  "lastUpdate": "2025-09-02T14:30:00Z",
  "updates": [
    {
      "timestamp": "2025-09-02T14:30:00Z",
      "message": "Zgłoszenie otrzymane i przypisane"
    }
  ]
}
```

## Komponent Frontend
- **Plik:** `src/components/TicketSubmissionWidget.svelte`
- **Klasa CSS:** `ticket-widget-container`

### Funkcje komponentu:
- Formularz zgłoszenia (email, priorytet, kategoria, opis)
- Automatyczna klasyfikacja AI po wysłaniu
- Wyświetlanie informacji o utworzonym tickecie
- Sprawdzanie statusu zgłoszenia
- Kopiowanie ID zgłoszenia do schowka
- Historia aktualizacji

## Przypadki użycia:
- Obsługa zgłoszeń technicznych
- Zarządzanie prośbami o funkcje
- Tracking problemów klientów
- Automatyzacja przepływu pracy support

---

# Architektura techniczna

## Stack technologiczny:
- **Frontend:** Svelte 5 + Astro
- **Backend:** Cloudflare Workers + TypeScript
- **AI:** OpenAI GPT-4o-mini
- **Styling:** Custom CSS z cyberpunk design
- **Deployment:** Cloudflare Pages + Workers

## Struktura plików:

```
src/
├── components/
│   ├── FAQGeneratorWidget.svelte
│   ├── EducationRecommendationsWidget.svelte
│   └── TicketSubmissionWidget.svelte
├── pages/
│   └── api/
│       ├── faq.ts
│       ├── education-recommendations.ts
│       └── tickets.ts
└── utils/
    └── loadEnv.js
```

## Konfiguracja API:
Wszystkie funkcje wykorzystują `getApiKey()` z `src/utils/loadEnv.js` dla bezpiecznego dostępu do OpenAI API.

---

# Design System

Wszystkie komponenty wykorzystują jednolity design system:

## Kolory:
- **Primary:** #00d7ef (cyan)
- **Borders:** rgba(0, 217, 255, 0.3)
- **Background:** rgba(0, 0, 0, 0.5)
- **Text:** #94aec4
- **Error:** #fca5a5

## Zasady designu:
- **Zero rounded corners:** `border-radius: 0px !important`
- **Cyberpunk aesthetic** z glow effects
- **Hover animations** z transform i box-shadow
- **Responsive design** z mobile-first approach
- **Consistent spacing** i typography

## CSS Classes:
- `widget-input` - Wszystkie pola input
- `widget-select` - Dropdown lists
- `widget-textarea` - Text areas  
- `action-btn primary/secondary` - Przyciski akcji
- `result-container` - Kontenery wyników
- `error-container` - Kontenery błędów

---

# Instrukcje użytkowania

## 1. Generator FAQ

### Krok po kroku:
1. Wklej bazę wiedzy w textarea (dokumentacja, instrukcje, itp.)
2. Kliknij "Generuj FAQ"
3. Poczekaj na wygenerowanie (5-15 sekund)
4. Skopiuj wynik przyciskiem "Skopiuj do schowka"

### Najlepsze praktyki:
- Używaj strukturalnej bazy wiedzy
- Im więcej szczegółów, tym lepsze FAQ
- Sprawdź wynik przed publikacją

## 2. Rekomendacje edukacyjne

### Krok po kroku:
1. Wypełnij poziom umiejętności (wymagane)
2. Podaj zainteresowania i dziedziny (wymagane)
3. Opcjonalnie uzupełnij pozostałe pola
4. Kliknij "Pobierz rekomendacje"
5. Otrzymaj spersonalizowane rekomendacje

### Najlepsze praktyki:
- Podaj dokładne cele zawodowe
- Wybierz realistyczny dostępny czas
- Im więcej informacji, tym lepsze rekomendacje

## 3. System ticketów

### Tworzenie zgłoszenia:
1. Podaj email kontaktowy (wymagane)
2. Wybierz priorytet problemu
3. Opcjonalnie wybierz kategorię
4. Opisz szczegółowo problem (wymagane)
5. Kliknij "Wyślij zgłoszenie"

### Śledzenie zgłoszenia:
1. Zapisz numer zgłoszenia (TICK-YYYY-XXX)
2. Kliknij "Sprawdź status"
3. Zobacz aktualne informacje i historię

### Najlepsze praktyki:
- Podaj dokładny opis problemu
- Wybierz odpowiedni priorytet
- Zachowaj numer zgłoszenia

---

# Testowanie i debugowanie

## Testowanie lokalne:

1. **Uruchomienie aplikacji:**
```bash
npm run dev
```

2. **Testowanie API endpoints:**
```bash
curl -X POST http://localhost:4321/api/faq \
  -H "Content-Type: application/json" \
  -d '{"knowledgeBase": "Test knowledge base"}'
```

## Logi i debugging:
- Wszystkie błędy API są logowane w console
- Frontend errors w developer tools
- API responses z detailed error messages

---

# Deployment i konfiguracja

## Wymagane zmienne środowiskowe:

```env
OPENAI_API_KEY=sk-...
```

## Deployment pipeline:

1. **Local development:**
```bash
npm run dev
```

2. **Build:**
```bash
npm run build
```

3. **Deploy to Cloudflare:**
```bash
npm run deploy
```

## Wrangler konfiguracja:
Sprawdź `wrangler.toml` dla konfiguracji Workers.

---

# Troubleshooting

## Częste problemy:

### 1. API Key errors:
- Sprawdź `OPENAI_API_KEY` w zmiennych środowiskowych
- Upewnij się, że key ma odpowiednie uprawnienia
- Sprawdź limity API w OpenAI dashboard

### 2. Styling issues:
- Wszystkie komponenty używają `border-radius: 0px !important`
- CSS jest scoped per component
- Sprawdź czy importy CSS są poprawne

### 3. Form validation:
- FAQ: wymaga niepustego knowledgeBase
- Education: wymaga currentLevel i interests  
- Tickets: wymaga description i email

---

# Kolejne kroki rozwoju

## Planowane ulepszenia:
1. **Integracja z bazą danych** dla persistencji ticketów
2. **Email notifications** dla statusu zgłoszeń
3. **Advanced analytics** dla wszystkich funkcji
4. **Multi-language support**
5. **API rate limiting** i caching

## Metryki do śledzenia:
- Usage statistics per function
- Response times API
- User satisfaction scores
- Error rates i debugging info

---

**Ostatnia aktualizacja:** 2025-09-02  
**Autor:** AI Development Team  
**Następny review:** 2025-09-09
