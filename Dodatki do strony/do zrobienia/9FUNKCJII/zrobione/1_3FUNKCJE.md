Oto rozszerzony task na wdrożenie funkcjonalności pierwszych trzech narzędzi z pliku 9FUNKCJI.md wraz z utrzymaniem spójnego stylu interfejsu.

***

# TASK: Implementacja funkcjonalności 3 pierwszych narzędzi i zachowanie stylu interfejsu (Astro/backroom)

## Cel
Wdrożyć pełną funkcjonalność narzędzi:
1. Automatyczne generowanie treści marketingowych
2. Personalizowane rekomendacje produktów/usług
3. Automatyzacja obsługi klienta i leadów

Przy zachowaniu jednolitego, ciemnego, nowoczesnego stylu interfejsu obecnego w projekcie.

***

## Wymagania funkcjonalne

### 1. Automatyczne generowanie treści marketingowych

- Endpoint API wywołujący model językowy do generowania różnych typów treści marketingowych na podstawie krótkiego promptu.
- UI: formularz umożliwiający użytkownikowi wpisanie tematu i wyboru rodzaju treści (np. post na social media, e-mail, opis produktu).
- Możliwość wygenerowania treści w czasie rzeczywistym po kliknięciu przycisku “Generuj”.
- Możliwość podglądu wygenerowanej treści oraz jej zapisania.
- (Opcjonalnie) Integracja z ActivePieces do automatycznej publikacji na platformach social media.

### 2. Personalizowane rekomendacje produktów/usług

- Model rankingowy/rekomendacyjny bazujący na danych użytkownika (preferencje, historia interakcji).
- Workflow w Flowise wykonujący analizę danych i generujący propozycje rekomendacji.
- Interaktywny widget na froncie, który dynamicznie aktualizuje rekomendacje.
- (Opcjonalnie) Integracja z ActivePieces do wysyłki rekomendacji e-mail/SMS.

### 3. Automatyzacja obsługi klienta i leadów

- Formularz kontaktowy zintegrowany z AI do kwalifikacji leadów.
- Workflow ActivePieces do automatycznego zapisu danych i wysyłki odpowiedzi.
- Integracja z wybranym CRM (np. HubSpot, Salesforce).
- Podgląd i raportowanie wyników kampanii w interfejsie dashboardu.

***

## Wymagania wizualne i UX

- Zachować obecny styl ciemnego tła (#000000 lub zbliżony), z akcentami kolorów cyan/niebieskiego typowych dla interfejsu.
- Używać zaokrąglonych ramek i buttonów z gradientami oraz cieniem zgodnie z obecnym CSS.
- Czcionki o wysokim kontraście, wyraźne nagłówki i czytelne pola formularzy.
- Wszystkie komponenty responsywne i estetycznie ułożone, zgodne z obecnym układem strony/backroom.
- Aktywne elementy (np. buttony) podświetlane efektami hover/focus z kolorystyką cyan.
- W oknie generowania i rekomendacji dodać wyraźne etykiety i instrukcje dla użytkownika.

***

## Przykładowe komponenty i ich zachowanie

### Formularz generowania treści marketingowych

- TextArea na temat / prompt
- Dropdown do wyboru typu treści
- Button “Generuj” blokujący UI do czasu odpowiedzi
- Pole tekstowe do wyświetlania wygenerowanego tekstu z opcją kopiowania

### Widget rekomendacji

- Lista kart proponowanych produktów/usług z nazwą, opisem i ewentualnie linkiem
- Odświeżanie listy po analizie AI
- Przycisk do ręcznego odświeżenia rekomendacji

### Formularz kontaktowy leadów

- Pola na podstawowe dane kontaktowe
- Pole na wiadomość/opis potrzeb
- Button “Wyślij” blokujący do potwierdzenia wysłania
- Informacja zwrotna po wysłaniu

***

## Technologie i narzędzia

- Backend: Astro server API routes do endpointów AI
- Frontend: Astro + React lub inna integracja JSX dla interaktywnych widgetów
- Workflow AI: Flowise i ActivePieces do orkiestracji procesów
- Style: TailwindCSS oraz niestandardowy CSS zgodny z obecną paletą barw i stylizacją

***

## Dodatkowe uwagi

- Wykorzystać obecny system ikon i akcentów wizualnych
- Utrzymać spójność UI w całej aplikacji, by narzędzia wyglądały jak integralna część systemu
- Przygotować łatwą do rozbudowy architekturę kodu, aby w przyszłości dodać pozostałe 6 funkcji
- Testować każdą funkcję na różnych rozdzielczościach i urządzeniach

***

Ten rozszerzony task zapewnia kompletną bazę pracy dla implementacji trzech kluczowych narzędzi z zachowaniem stylistyki i UX Twojego projektu.[1][2][3]

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/92027992/3fd1bbdb-2c6d-482c-a6fe-9362f9c08ae0/9FUNKCJI.md)
[2](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/92027992/fa6bc879-a808-421b-bc3d-60611ca564c4/D92DBAE2-0DDC-48CD-B924-FB0C7DC7381C.jpg)
[3](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/92027992/d915feb7-0d34-40d2-8d86-06577e07ecc8/84AE8381-32F0-4ACF-88F4-2A0EE8748F09.jpg)