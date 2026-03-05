<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# rozpisz jeszcze raz ale ogólnie dla firm ,nie używaj meble pumo ,dodaj możliwość wpisania promptu systemowego dla narzędzi z opisem firmy, rozpisz jeszcze raz

Poniżej masz ogólną, „firmową” wersję rozpiski narzędzi – bez Meble Pumo – z możliwością podania własnego system promptu/opisu firmy dla każdego toola.

Załóżmy, że w UI przy każdym narzędziu masz dodatkowy panel:
**„Kontekst firmy (system prompt)”** – textarea, którego zawartość backend dokleja do system promptu.

***

## Wspólny wzorzec dla wszystkich narzędzi

### 1. Konfiguracja modeli

Dla każdego narzędzia przyjmij wspólny modelowy kontrakt:

- Pole `model` w request:
    - `"auto"` – backend sam wybiera,
    - `"gpt4o"`, `"gemini-flash"`, `"deepseek"` – konkretne modele (nazwy dopasujesz do dostępnych w Cloudflare).
- Pole `system_context` / `company_prompt`:
    - tekst opisujący firmę i zasady (wprowadzany z UI).

Wszystkie endpointy przyjmują:

```json
{
  "model": "auto",
  "company_prompt": "Krótki opis firmy, branża, grupa docelowa, ton komunikacji.",
  "payload": { ...specyficzne_dla_narzędzia... }
}
```

Na backendzie budujesz finalny system prompt jako:

```text
[CORE SYSTEM PROMPT NARZĘDZIA]

---
Kontekst firmy (od użytkownika):
{company_prompt}
```


***

## 2. Generator Treści (ogólnie dla firm)

### Endpoint

`POST /api/narzedzia/generator-tresci`

### Body (przykład)

```json
{
  "model": "auto",
  "company_prompt": "Jesteśmy polską firmą B2B, sprzedajemy oprogramowanie dla małych firm. Komunikacja: profesjonalna, ale przystępna.",
  "payload": {
    "cel": "post_social",
    "kanal": "linkedin",
    "ton": "profesjonalny",
    "dlugosc": "srednia",
    "jezyk": "pl",
    "opis": "Ogłoszenie nowej funkcji raportowania w aplikacji."
  }
}
```


### Core system prompt

```text
Jesteś polskim copywriterem marketingowym.

ZADANIE:
- Twórz treści marketingowe dla firm (B2B lub B2C).
- Kanały: social media, opisy ofert, opisy produktów/usług, newslettery, artykuły.

ZASADY:
- Zawsze pisz w języku określonym w wejściu (domyślnie polski).
- Dopasuj ton do kanału i ustawienia (formalny, neutralny, swobodny).
- Nie wymyślaj danych o firmie – opieraj się tylko na podanym kontekście firmy i opisie.

FORMAT:
- Zwróć gotowy tekst do użycia.
- Dla social media dodaj na końcu 3–5 sensownych hashtagów.
```


***

## 3. Generator Faktur (ogólnie dla firm)

### Endpoint

`POST /api/narzedzia/generator-faktur/opis-pozycji`

### Body

```json
{
  "model": "auto",
  "company_prompt": "Świadczymy usługi IT i konsulting biznesowy. Faktury generowane głównie dla firm w Polsce.",
  "payload": {
    "nazwa_skrócona": "Usługa konsultingowa",
    "kontekst": "Projekt doradczy dla klienta z sektora usług",
    "jezyk": "pl"
  }
}
```


### Core system prompt

```text
Jesteś asystentem księgowo-sprzedażowym.

ZADANIE:
- Uzupełniaj krótkie, czytelne opisy pozycji na fakturach i dokumentach sprzedażowych firm.

ZASADY:
- Opis ma być zrozumiały dla klienta i działu księgowości.
- Maksymalnie 1–2 zdania.
- Nie dodawaj interpretacji podatkowych ani porad prawnych.

FORMAT:
- Zwróć tylko opis pozycji (jeden ciąg tekstu).
```


***

## 4. Asystent Email (ogólnie dla firm)

### Endpoint

`POST /api/narzedzia/asystent-email`

### Body

```json
{
  "model": "auto",
  "company_prompt": "Polska firma usługowa, współpraca B2B i B2C, stawiamy na uprzejmą i konkretną komunikację.",
  "payload": {
    "typ": "oferta",
    "ton": "profesjonalny",
    "jezyk": "pl",
    "odbiorca": "Nowy potencjalny klient",
    "kontekst": "Chcemy zaproponować pierwsze spotkanie online i przedstawić ofertę usług.",
    "dodatkowe_punkty": [
      "Podkreśl indywidualne podejście",
      "Zaproponuj 30-minutowe spotkanie",
      "Dodaj delikatne wezwanie do odpowiedzi"
    ]
  }
}
```


### Core system prompt

```text
Jesteś asystentem do pisania emaili biznesowych po polsku.

ZADANIE:
- Twórz emaile dla firm: oferty, zapytania, follow-upy, reklamacje, przypomnienia, podziękowania.

ZASADY:
- Dopasuj ton (formalny/neutralny/swobodny) do wejścia i kontekstu firmy.
- Stosuj standardową strukturę korespondencji biznesowej (powitanie, treść, zakończenie, podpis).
- Zawsze dbaj o uprzejmy, ale konkretny styl.

FORMAT:
- Zwróć tylko treść emaila.
- Jeśli użytkownik podał „temat”, uwzględnij go na początku w formacie: "Temat: ...".
```


***

## 5. Kreator Dokumentów (ogólnie dla firm)

### Endpoint

`POST /api/narzedzia/kreator-dokumentow`

### Body

```json
{
  "model": "auto",
  "company_prompt": "Mała spółka z o.o. z branży usługowej, działająca na rynku polskim. Potrzebujemy prostych, zrozumiałych umów.",
  "payload": {
    "rodzaj": "umowa_uslug",
    "poziom_szczegolowosci": "sredni",
    "jezyk": "pl",
    "dane": {
      "strona_A": "Firma XYZ Sp. z o.o.",
      "strona_B": "Klient biznesowy",
      "przedmiot": "świadczenie usług marketingowych",
      "okres": "12 miesięcy",
      "wynagrodzenie": "abonament miesięczny",
      "miejsce": "Polska"
    }
  }
}
```


### Core system prompt

```text
Jesteś asystentem prawnym generującym SZABLONY dokumentów biznesowych.

ZADANIE:
- Twórz szkice umów, regulaminów, ofert i pism biznesowych dla firm.
- Dokumenty mają być punktem wyjścia, nie gotową poradą prawną.

ZASADY:
- Używaj klasycznej struktury: Strony, Przedmiot, Wynagrodzenie, Obowiązki, Odpowiedzialność, Postanowienia końcowe.
- Jeśli brakuje ważnych danych, wstaw [UZUPEŁNIJ: ...].
- Dodaj na początku krótkie ostrzeżenie, że dokument wymaga weryfikacji przez prawnika.

FORMAT:
- Zwróć pełny tekst dokumentu z paragrafami i numeracją.
```


***

## 6. Kalkulator Biznesowy (interpretacja wyników dla firm)

### Endpoint

`POST /api/narzedzia/kalkulator-biznesowy/analiza`

### Body

```json
{
  "model": "auto",
  "company_prompt": "Firma świadcząca usługi abonamentowe dla małych firm. Zależy nam na stabilnych marżach i rozsądnych inwestycjach.",
  "payload": {
    "tryb": "roi",
    "dane": {
      "inwestycja": 10000,
      "zysk_roczny": 3000,
      "roi_percent": 30,
      "payback_months": 40
    }
  }
}
```


### Core system prompt

```text
Jesteś doradcą biznesowym dla firm.

ZADANIE:
- Interpretuj wyniki kalkulatorów finansowych (marża, VAT, ROI, zysk).
- Dla właścicieli i menedżerów małych i średnich firm.

ZASADY:
- Najpierw 2–3 zdania podsumowania („co to znaczy dla firmy”).
- Następnie 2–4 praktyczne rekomendacje.
- Nie dawaj porad podatkowych – mów ogólnie („warto skonsultować...”).

FORMAT:
- Prosty tekst:
  1. Podsumowanie
  2. Rekomendacje (lista wypunktowana)
```


***

## 7. Organizer Zadań (planowanie dla firm)

### Endpoint

`POST /api/narzedzia/organizer-zadan/plan`

### Body

```json
{
  "model": "auto",
  "company_prompt": "Mały software house, zespół 5 osób, typowe zadania: klienci, rozwój produktu, marketing.",
  "payload": {
    "opis": "W tym tygodniu musimy dokończyć wdrożenie dla kluczowego klienta, przygotować ofertę dla dwóch leadów i zaplanować kampanię na kwiecień.",
    "ramy_czasowe": "ten tydzień"
  }
}
```


### Core system prompt

```text
Jesteś asystentem produktywności dla firm.

ZADANIE:
- Na podstawie opisu zaproponuj listę zadań do organizera.

ZASADY:
- Każde zadanie: krótki tytuł, priorytet (wysoki/średni/niski), opcjonalny termin.
- Nie wymyślaj zadań spoza opisu – tylko rozbij i doprecyzuj.
- Ułatw priorytetyzację (projekty kluczowe > reszta).

FORMAT JSON:
[
  {
    "title": "Zadanie 1",
    "priority": "wysoki",
    "dueDate": "2026-03-10"
  },
  ...
]
```


***

## 8. Ogólny pattern dla UI – system prompt firmy

W każdym narzędziu dodaj w UI panel:

- Tytuł: **Kontekst firmy / system prompt**
- Textarea z placeholderem:
    - „Opisz w 1–4 zdaniach: czym zajmuje się Twoja firma, jaka jest grupa docelowa, styl komunikacji, ważne ograniczenia.”
- Checkbox „Zapisz kontekst jako domyślny dla tej firmy” (na przyszłość do multi‑tenant).

Backend:

- Jeśli `company_prompt` pusty → użyj tylko core system promptu.
- Jeśli niepusty → doklej go pod linią `---` do core promptu.

Dzięki temu każde narzędzie jest ogólne, a zarazem może działać „po firmowemu” bez twardego kodowania branży.

Jeśli chcesz, w kolejnym kroku mogę rozpisać konkretny przykład jednego endpointu (np. `/api/narzedzia/generator-tresci`) jako kod (schemat ciała request → wybór modelu → złożenie system promptu z `company_prompt`).

