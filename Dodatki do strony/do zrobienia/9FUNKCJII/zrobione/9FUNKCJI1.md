Oto przykładowy task w formacie markdown, gotowy do przekazania Copilotowi we frameworku Astro z przestrzeni backroom. Wskazane są wszystkie zmiany UX/UI oraz podstawowe przykłady kodów, które można skopiować do repozytorium projektu. Strukturę możesz swobodnie rozwijać z VS Code Copilot.

***

# TASK: Przebudowa sekcji System Management na 9 nowych funkcji (Astro/backroom)

## Wymagania ogólne

- Zamień obecne kafelki **System Management** na 9 nowych funkcji zgodnie z plikiem `9FUNKCJI.md` (oprócz funkcji 1 i 5, które już istnieją)
- Cały interface w kolorystyce pierwotnej strony: dominująca czerń, niebieskie akcenty, zachowaj styl ikon jak na screenach
- Tylko **Panel Administracyjny** zostaje jako osobny przycisk (patrz poniżej)
- Panel Administracyjny przeniesiony na sam dół po prawej stronie (vis ref: `D92DBAE2-0DDC-48CD-B924-FB0C7DC7381C.jpg`)

## Zmiana głównego napisu i układu

- Powiększ i pogrub napis informacyjny na górze strony głównej:  
  `SYSTEM ZAAWANSOWANEJ AUTOMATYZACJI AI`
- Po prawej stronie napisu (lub w osobnej sekcji poniżej — do ustalenia wg UX), dodaj kontener z 3 przyciskami (każdy do innego dashboardu)
- Po kliknięciu w przycisk otwiera się nowy dashboard po autoryzacji loginem (`HAOS77` – bez hasła)

## Przyciski dashboardów

- `KLIENCI_DSH_BON` – zestaw aktywnych klientów
- `AKYW_STATYSTIC` – aktywność i statystyki strony
- `PRIV_STAFF` – zamówienia, finanse, wiadomości
- Autoryzacja: Wymagany jest **tylko login** (pole input), po wpisaniu `HAOS77` pokazują się przyciski do dashboardów.

### Przykład komponentu (Astro + JSX/React - możliwa adaptacja do czystego Astro):

```jsx
---
// DashboardButtons.astro/tsx
import { useState } from "react";
const [login, setLogin] = useState("");
const [access, setAccess] = useState(false);
---

{!access ? (
  <div class="bg-black p-6 rounded-xl flex flex-col items-center gap-2">
      <input
        type="text"
        maxlength="16"
        placeholder="Podaj login"
        value={login}
        onInput={e => setLogin(e.target.value)}
        class="bg-gray-800 p-2 rounded text-cyan-200 border-b"
      />
      <button onClick={() => login === "HAOS77" && setAccess(true)}
        class="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-800">
        Zaloguj się
      </button>
  </div>
) : (
  <div class="flex flex-col gap-3 bg-black p-6 rounded-xl">
    <a href="/dashboard/klienci" class="dashboard-btn">KLIENCI_DSH_BON</a>
    <a href="/dashboard/statystyki" class="dashboard-btn">AKYW_STATYSTIC</a>
    <a href="/dashboard/prywatne" class="dashboard-btn">PRIV_STAFF</a>
  </div>
)}
```

**Styl do dashboard-btn (na końcu głównego css/layoutu):**

```css
.dashboard-btn {
  background-color: #164e63;
  color: white;
  padding: 14px 24px;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 10px;
  box-shadow: 0 2px 18px #00d9ff33;
  transition: background .2s;
}
.dashboard-btn:hover {
  background-color: #1be1ff;
}
```

## Przycisk Panel Administracyjny (bottom-right, zawsze widoczny)

```astro
<!-- W layoucie Astro -->
<div style="position: fixed; bottom: 28px; right: 30px; z-index: 100;">
  <a href="/admin"
     class="bg-gray-900 text-cyan-400 py-3 px-6 rounded-xl shadow-lg hover:bg-cyan-700 text-xl">
    Panel Administracyjny
  </a>
</div>
```

## Zamiana kafelków SYSTEM MANAGEMENT

1. Każdy kafelek odpowiada jednej z 9 funkcji z pliku `9FUNKCJI.md` – zaimportuj tytuł i opis oraz ikonę pasującą do tematu.
2. Wszystkie kafelki tylko na czarnym tle z niebieską ikoną/gradientem (akcent koloru możesz podejrzeć ze starych kafelków/kodu)
3. Przykładowy kafelek (Astro lub JSX):

```astro
<div class="feature-tile">
  <div class="feature-icon"><!-- svg lub ikona (np. wand, book, reminder) --></div>
  <div class="feature-title">Automatyczne generowanie treści marketingowych</div>
  <div class="feature-desc">Generowanie i publikacja treści marketingowych przez AI.</div>
</div>
```

**Feature-tile styl:**

```css
.feature-tile {
  background: #131e28;
  border-radius: 1.3rem;
  box-shadow: 0 1px 26px #14d7e633;
  padding: 34px 24px 24px 24px;
  margin: 14px;
  text-align: left;
  min-width: 270px;
}
.feature-title {
  color: #00d7ef;
  font-weight: 700;
  font-size: 1.24rem;
  margin-bottom: 0.46em;
}
.feature-desc {
  color: #94aec4;
  font-size: 1.09rem;
}
.feature-icon {
  font-size: 2.7rem;
  margin-bottom: 14px;
  color: #1be1ff;
}
```

## Wskazówki dla Copilota

- Utrzymuj cały layout na ciemnym tle z jasnymi akcentami, wzorując się na obecnych screenach
- Przyciski i informacje MUSZĄ być wyraźne/pogrubione – używaj `font-bold` i większych rozmiarów headerów
- Dashboardy i Panel Admin nie muszą mieć jeszcze zaimplementowanej logiki — wystarczą linki/placeholdery

***

Możesz podać ścieżkę `/src/pages/backroom/` lub `/components/` dla przykładowych plików. Każdy z powyższych fragmentów jest od razu gotowy do wklejenia do kodu Astro — Copilot uzupełni ich logikę, layout, a Ty dostosujesz zawartość funkcji według pliku `9FUNKCJI.md` i stylów strony.[1][2]

[