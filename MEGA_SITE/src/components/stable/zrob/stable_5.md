Oto szczegółowy plan integracji zaawansowanego modułu Stable Diffusion z MyBonzo, wraz z dodatkiem **wildcards** do promptów oraz automatycznym tłumaczem promptów z polskiego na angielski.

***

## Cele integracji

- Moduł generowania obrazów Stable Diffusion w MyBonzo z pełną kontrolą promptów
- Rozszerzenie funkcji o **wildcards** – dynamiczne zamienniki w promptach
- Automatyczne tłumaczenie promptów z polskiego na angielski przed wysłaniem do Stable Diffusion API
- Pełna integracja UX/UI według stylu MyBonzo

***

# Szczegóły integracji

## 1. Wildcards w promptach

### Idea

- Pozwoli użytkownikowi wpisywać w promptach specjalne znaczniki (np. `{miejsce}`, `{postac}`, `{styl}`)
- System zastąpi wildcardy dynamicznymi, randomowymi lub zapamiętanymi wartościami z bazy
- Przykład: prompt `"Piękny {postac} w stylu {styl}"` → `"Piękny smok w stylu cyberpunk"`

### Implementacja

- W backendzie/app obsłuż wildcardy jako prostą funkcję zastępowania:

```js
const wildcards = {
  postac: ['smok', 'rycerz', 'elf', 'robot'],
  styl: ['cyberpunk', 'renesans', 'retro', 'futurystyczny'],
  miejsce: ['miejska ulica', 'górski szczyt', 'kosmiczna stacja', 'jaskinia'],
}

function replaceWildcards(prompt) {
  return prompt.replace(/\{(\w+)\}/g, (match, key) => {
    if (wildcards[key]) {
      const options = wildcards[key]
      return options[Math.floor(Math.random() * options.length)]
    }
    return match // jeśli brak wildcarda w słowniku, pozostaw oryginał
  })
}
```

- Ta funkcja wykonuje się po stronie frontend lub backend przed tłumaczeniem i wysłaniem promptu.

***

## 2. Tłumaczenie promptów (PL → EN)

### Cel

- Użytkownik wpisuje prompt po polsku
- Prompt jest automatycznie tłumaczony na angielski (wymagane, bo modele SD działają na tekstach angielskojęzycznych)
- Tłumaczenie odbywa się na backendzie lub w workerze, wykorzystując zewnętrzne API (np. Google Translate API, DeepL API, albo otwarte modele tłumaczeniowe)

### Przykładowa funkcja tłumaczenia (z wykorzystaniem Google Translate API)

```js
import fetch from 'node-fetch'

async function translatePromptToEnglish(promptPL) {
  const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: promptPL,
      source: 'pl',
      target: 'en',
      format: 'text',
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    }),
  })

  const data = await response.json()
  return data.data.translations[0].translatedText
}
```

- W workflow przetwarzania promptu wywołaj najpierw `replaceWildcards()`, potem `translatePromptToEnglish()`, i dopiero wyślij tłumaczenie do Stable Diffusion API.

***

## 3. Schemat przepływu danych i integracja

```mermaid
flowchart TD
  User[Użytkownik MyBonzo] -->|wpisuje prompt PL z wildcardami| Frontend
  Frontend -->|wysyła prompt z wildcards| Backend/Worker
  Backend -->|replaceWildcards(prompt)| promptWithValues
  Backend -->|translatePromptToEnglish(promptWithValues)| promptENG
  Backend -->|wywołuje Stable Diffusion API z promptENG| SD_API
  SD_API -->|generuje obraz| Backend
  Backend -->|zwraca URL obrazu| Frontend
  Frontend -->|wyświetla obraz| User
```

***

## 4. Integracja w MyBonzo (praktyczne uwagi)

- Frontend MyBonzo rozszerz o komponent prompt input z podpowiedziami wildcardów (tooltip, auto-complete)
- Wszystkie zapytania o obrazy idą na endpoint API (lub Cloudflare Worker) obsługujący wildcardy i tłumaczenie
- Możliwość zapisywania i ponownego wykorzystywania promptów z wildcardami i ich wariantów
- Dla wydajności rozważ cache wyników wg promptu i wildcardów
- Zapewnij obsługę błędów i komunikaty zwrotne użytkownikowi (np. „Tłumaczenie w toku”, „Generowanie obrazu”, „Błąd API”)

***

## 5. Przykład kodu backendowego kombinującego wildcardy i tłumaczenie (Node.js / Worker)

```js
async function processPrompt(promptPL) {
  const replacedPrompt = replaceWildcards(promptPL)
  const translatedPrompt = await translatePromptToEnglish(replacedPrompt)

  // Tutaj wywołaj Stable Diffusion API z translatedPrompt
  // ...
  return translatedPrompt
}
```

***

i dalej do stable_6.md
