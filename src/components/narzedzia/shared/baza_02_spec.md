<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ok zacznij rozpisywac po kolei kazde z nerzedzi niech mają wspólną baze i uzywają tych samych modeli

Zrobimy z tego spójny „pakiet narzędzi firmowych”: wspólna baza, wspólny system prompt + router modeli, a każde narzędzie tylko dokłada swój „tryb”. Poniżej zaczynam od wspólnej bazy i core API, a potem pierwsze narzędzie; kolejne będziemy dodawać w tej samej konwencji.

***

## 1. Wspólna baza konfiguracji narzędzi (D1)

### Tabela `firmy`

```sql
CREATE TABLE IF NOT EXISTS firmy (
  id TEXT PRIMARY KEY,
  nazwa TEXT NOT NULL,
  opis TEXT,                       -- ogólny opis firmy (do promptów)
  branża TEXT,
  jezyk_domyslny TEXT DEFAULT 'pl',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```


### Tabela `firmy_modele_ai`

```sql
CREATE TABLE IF NOT EXISTS firmy_modele_ai (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  nazwa_logiczna TEXT NOT NULL,     -- 'domyslny', 'szybki', 'dokladny'
  provider TEXT NOT NULL,           -- 'openai', 'google', 'deepseek', 'cloudflare'
  model_id TEXT NOT NULL,           -- np. 'gpt-4o', 'gemini-2.5-flash', ...
  aktywny INTEGER DEFAULT 1,
  kolejnosc INTEGER DEFAULT 0,      -- priorytet przy model='auto'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(firma_id) REFERENCES firmy(id)
);
```


### Tabela `firmy_narzedzia_kontekst`

```sql
CREATE TABLE IF NOT EXISTS firmy_narzedzia_kontekst (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  narzedzie TEXT NOT NULL,          -- 'generator_tresci', 'asystent_email', ...
  system_prompt TEXT,               -- nadpisanie / rozszerzenie core promptu
  ustawienia JSON,                  -- np. preferowany model, ton, język
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(firma_id) REFERENCES firmy(id)
);
```

To pozwala wszystkim narzędziom korzystać z tych samych modeli i kontekstu firmy.

***

## 2. Wspólny router modeli i promptów (warstwa backend)

### Endpoint „core” – `POST /api/ai/execute`

To jest serce – wszystkie narzędzia wołają ten endpoint z:

```json
{
  "firma_id": "firma_123",
  "narzedzie": "generator_tresci",
  "model": "auto",
  "core_prompt": "tu wkładamy core prompt narzędzia",
  "company_prompt": "tu wkładamy opis firmy z UI",
  "payload": { "tryb": "...", "dane": {...} }
}
```

Router robi:

1. Pobiera z D1:
    - `firma` (żeby wiedzieć język, opis),
    - `firmy_modele_ai` (jakie modele są dostępne),
    - `firmy_narzedzia_kontekst` (czy jest custom system prompt dla narzędzia).
2. Składa finalny **system prompt**:
```text
[CORE PROMPT NARZĘDZIA]

---
Kontekst firmy:
{firma.opis}

Kontekst narzędzia (jeśli jest w bazie):
{narzedzie.system_prompt}

Kontekst użytkownika (company_prompt z UI):
{company_prompt}
```

3. Wybiera model:
    - jeśli `model != 'auto'` → bierze konkretny z `firmy_modele_ai` (po `nazwa_logiczna`),
    - jeśli `model == 'auto'` → bierze pierwszy `aktywny` w kolejności `kolejnosc`.
4. Woła odpowiednie API (OpenAI / Gemini / DeepSeek / Cloudflare AI) i zwraca wynik.

Dzięki temu każde narzędzie ma identyczny pattern: lokalny endpoint przygotowuje `core_prompt + payload` i wysyła do `/api/ai/execute`.

***

## 3. Narzędzie 1 – Generator Treści (wspólny pattern)

### Lokalne API: `POST /api/narzedzia/generator-tresci`

**Body, które przychodzi z frontu:**

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "company_prompt": "Opis firmy / marki od użytkownika",
  "typ": "post_social",
  "kanal": "linkedin",
  "ton": "profesjonalny",
  "dlugosc": "srednia",
  "jezyk": "pl",
  "opis": "Ogólne założenia kampanii / co chcemy zakomunikować."
}
```


### Core prompt dla Generatora Treści (na backendzie)

```text
Jesteś polskim copywriterem i marketerem pracującym dla firm.

ZADANIE:
- Twórz treści marketingowe na podstawie opisu (kampanie, posty, opisy ofert/produktów, newslettery, artykuły).
- Dostosuj treść do podanego typu (typ) i kanału (kanal).

ZASADY:
- Pisz w języku wskazanym w parametrach (jeśli brak – po polsku).
- Dopasuj ton (formalny, neutralny, swobodny) do parametru "ton".
- Nie wymyślaj polityk, promocji, cen ani danych, których nie ma w kontekście firmy lub opisie.
- Dla postów social (Facebook/Instagram/LinkedIn) dodaj na końcu 3–5 sensownych hashtagów.

FORMAT:
- Zwróć gotowy tekst do użycia, bez dodatkowych komentarzy.
```


### Co robi endpoint `POST /api/narzedzia/generator-tresci`

- Buduje obiekt:

```json
{
  "firma_id": "firma_123",
  "narzedzie": "generator_tresci",
  "model": "auto",
  "core_prompt": "[powyższy core prompt]",
  "company_prompt": "Opis firmy / marki od użytkownika",
  "payload": {
    "typ": "post_social",
    "kanal": "linkedin",
    "ton": "profesjonalny",
    "dlugosc": "srednia",
    "jezyk": "pl",
    "opis": "Ogólne założenia kampanii..."
  }
}
```

- Wysyła to do `/api/ai/execute`,
- Zwraca tylko wygenerowany tekst (i opcjonalnie metadane: użyty model, tokeny, czas).

Front (GeneratorTresci.tsx) tylko wysyła dane, nie musi znać modeli.

***

## 4. Narzędzie 2 – Asystent Email (ten sam pattern)

### Lokalne API: `POST /api/narzedzia/asystent-email`

Body z frontu:

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "company_prompt": "Jak się komunikujemy jako firma (styl, formalność, grupy docelowe).",
  "typ": "oferta",
  "ton": "profesjonalny",
  "jezyk": "pl",
  "konkret": {
    "do_kogo": "Dyrektor zakupów w firmie średniej wielkości",
    "cel": "zaproponować spotkanie i wstępną ofertę",
    "kluczowe_punkty": [
      "podkreśl doświadczenie firmy",
      "zaproponuj termin spotkania",
      "zachęć do odpowiedzi"
    ]
  }
}
```


### Core prompt Asystenta Email

```text
Jesteś asystentem do pisania emaili biznesowych dla firm.

ZADANIE:
- Twórz emaile: oferty, zapytania, follow-upy, przypomnienia, reklamacje, podziękowania.
- Adresatami są klienci, partnerzy, dostawcy lub współpracownicy firmy.

ZASADY:
- Stosuj standardowy polski styl korespondencji biznesowej (powitanie, wstęp, sedno, zakończenie, podpis).
- Ton dopasuj do parametru ("formalny", "neutralny", "swobodny").
- Bądź konkretny, unikaj ogólników.
- Nie obiecuj niczego, czego nie ma w danych wejściowych.

FORMAT:
- Zwróć treść emaila gotową do wklejenia.
- Jeśli użytkownik podał prośbę o temat, dodaj na początku linię "Temat: ...".
```

Endpoint składa:

- `core_prompt` = powyższy,
- `company_prompt` = opis firmy,
- `payload` = typ, ton, jezyk, konkret
i woła `/api/ai/execute`.

***

## 5. Narzędzie 3 – Kreator Dokumentów (core + shared models)

### Lokalne API: `POST /api/narzedzia/kreator-dokumentow`

Body:

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "company_prompt": "Krótki opis działalności i typowych umów (np. usługi IT dla firm).",
  "rodzaj": "umowa_uslug",
  "poziom_szczegolowosci": "sredni",
  "jezyk": "pl",
  "dane": {
    "strona_A": "Firma XYZ Sp. z o.o.",
    "strona_B": "Klient biznesowy",
    "przedmiot": "świadczenie usług IT",
    "okres": "12 miesięcy",
    "wynagrodzenie": "abonament miesięczny",
    "miejsce": "Polska"
  }
}
```

Core prompt (jak wcześniej, w wersji ogólnej):

- Asystent prawny,
- Szablony (nie porady prawne),
- Paragrafy i numeracja,
- Wstawianie `[UZUPEŁNIJ: ...]` tam, gdzie brakuje danych,
- Dodanie ostrzeżenia o konieczności weryfikacji przez prawnika.

Reszta tak samo: endpoint buduje payload i puszcza do `/api/ai/execute`.

***

## 6. Narzędzie 4 – Kalkulator Biznesowy (interpretacja)

### Lokalne API: `POST /api/narzedzia/kalkulator-biznesowy/analiza`

Body:

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "company_prompt": "Profil firmy, na czym jej zależy (np. wysoka marża, szybki zwrot z inwestycji).",
  "tryb": "margin",
  "dane": {
    "costPrice": 100,
    "sellPrice": 150,
    "profitAmount": 50,
    "marginPercent": 33.33,
    "markupPercent": 50
  }
}
```

Core prompt – doradca biznesowy (jak wcześniej), ale bez żadnych nazw firm.

***

## 7. Narzędzie 5 – Organizer Zadań

### Lokalne API: `POST /api/narzedzia/organizer-zadan/plan`

Body:

```json
{
  "firma_id": "firma_123",
  "model": "auto",
  "company_prompt": "Typowy dzień firmy, rodzaj zadań (sprzedaż, projekty, obsługa klienta).",
  "opis": "Ogólne cele tygodnia, projekty do domknięcia, spotkania itd.",
  "ramy_czasowe": "ten tydzień"
}
```

Core prompt – asystent produktywności (jak wcześniej), z wyjściem JSON.

***

## 8. Wspólne modele w praktyce

W D1 dodajesz domyślnie dla każdej firmy:

```sql
INSERT INTO firmy_modele_ai (id, firma_id, nazwa_logiczna, provider, model_id, kolejnosc)
VALUES
('m1', 'firma_123', 'domyslny', 'openai', 'gpt-4o', 0),
('m2', 'firma_123', 'szybki', 'google', 'gemini-2.5-flash', 1),
('m3', 'firma_123', 'ekonomiczny', 'deepseek', 'deepseek-chat', 2);
```

W UI możesz potem:

- pozwolić wybrać „profil modelu” (Domyślny / Szybki / Ekonomiczny),
- a backend tylko mapuje `model` → wpis z tej tabeli i woła odpowiednie API.

***

Jeśli chcesz, następny krok to konkretny przykład implementacji `/api/ai/execute` (Cloudflare Worker), który:

- czyta `firma_id`, `model`, `core_prompt`, `company_prompt`,
- pobiera konfigurację modeli i kontekstu z D1,
- wybiera model,
- składa finalny prompt
- i woła np. OpenAI lub Gemini.

