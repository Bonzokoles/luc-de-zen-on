# 🚀 AI Biznes Start (My_LUCK_the_ZENON)

**Platforma narzędzi AI dla początkujących przedsiębiorców**

Kompletny zestaw prostych, efektywnych narzędzi biznesowych wspomaganych przez sztuczną inteligencję. Wszystko w 100% po polsku, bez skomplikowanej terminologii technicznej!

---

## 📋 Spis Treści

- [O Projekcie](#-o-projekcie)
- [Funkcje](#-funkcje)
- [Narzędzia](#-narzędzia)
- [Technologie](#-technologie)
- [Instalacja](#-instalacja)
- [Konfiguracja](#-konfiguracja)
- [Uruchomienie](#-uruchomienie)
- [Deployment](#-deployment)
- [Struktura Projektu](#-struktura-projektu)
- [Rozwój](#-rozwój)
- [Licencja](#-licencja)

---

## 🎯 O Projekcie

**AI Biznes Start** to platforma stworzona specjalnie dla:

- ✅ Początkujących przedsiębiorców
- ✅ Freelancerów
- ✅ Małych firm
- ✅ Osób bez wiedzy technicznej

### Dlaczego AI Biznes Start?

- **Proste** - Żadnych skomplikowanych ustawień
- **Efektywne** - Oszczędzaj czas dzięki AI
- **Po Polsku** - Wszystko w języku polskim
- **Darmowe** - Bez rejestracji i opłat
- **Nowoczesne** - Ładny interfejs + wizualizacje

---

## ✨ Funkcje

### Główne Możliwości

- 🤖 **AI Wsparcie** - OpenAI GPT-3.5 Turbo
- 💼 **8 Narzędzi Biznesowych** - Gotowe do użycia
- 📱 **Responsywny Design** - Działa na telefonie i komputerze
- 💾 **Lokalny Zapis** - Dane w przeglądarce (localStorage)
- 📰 **Newsy Biznesowe** - Aktualne wiadomości z branży
- 🎵 **Music Player** - Z wizualizatorem dźwięku

---

## 🛠️ Narzędzia

### 1. Generator Treści Marketingowych
Twórz profesjonalne posty, opisy produktów i ogłoszenia AI w sekundach.

**Funkcje:**
- Posty na Social Media (Facebook, Instagram, LinkedIn)
- Opisy produktów
- Newslettery
- Artykuły blogowe
- Wybór tonu (profesjonalny, przyjazny, entuzjastyczny...)
- Kontrola długości tekstu

### 2. Asystent Email Biznesowy
Pisz profesjonalne emaile z odpowiednią etykietą biznesową.

**Funkcje:**
- Gotowe szablony emaili
- Automatyczne formatowanie
- Wybór tonu wiadomości
- Wsparcie dla różnych typów emaili (oferty, zapytania, przypomnienia...)

### 3. Organizer Zadań Biznesowych
Zarządzaj zadaniami z priorytetami i terminami.

**Funkcje:**
- Priorytety (wysoki, średni, niski)
- Terminy wykonania
- Filtry (wszystkie, aktywne, ukończone)
- Auto-zapis w przeglądarce
- Statystyki

### 4. Kalkulator Biznesowy
Marże, VAT, ROI, zyski - wszystkie obliczenia w jednym miejscu.

**Kalkulatory:**
- 📊 **Marża** - Oblicz marżę i narzut
- 🧾 **VAT** - Kwota netto → brutto
- 💰 **ROI** - Zwrot z inwestycji
- 📈 **Zysk** - Przychód - koszty

### 5. Generator Social Media
Posty dla różnych platform z hashtagami.

### 6. Generator Dokumentów
Faktury, umowy, oferty - gotowe szablony biznesowe.

### 7. Asystent Pomysłów
Burza mózgów z AI - nowe produkty, usługi, strategie.

### 8. Analizator Tekstu
Sprawdź ton, czytelność, popraw błędy w tekstach.

---

## 🔧 Technologie

### Frontend
- **Astro 5.14.6** - Static Site Generator z SSR
- **React 18.3.1** - Interaktywne komponenty
- **TypeScript 5.9.2** - Typowanie
- **Tailwind CSS 3.4.17** - Style

### AI & APIs
- **OpenAI API** (GPT-3.5 Turbo)
- **AI SDK by Vercel** - AI integrations

### Deployment
- **Cloudflare Pages** - Hosting + Functions
- **Wrangler** - CLI tool

### State & Utils
- **Nanostores** - Lekki state management
- **React Markdown** - Renderowanie markdown
- **Lucide React** - Ikony

---

## 📦 Instalacja

### Wymagania

- Node.js 18+ (zalecane 20+)
- npm lub pnpm
- Konto OpenAI (dla AI functions)

### Kroki

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/Bonzokoles/My_LUCK_the_ZENON.git
cd My_LUCK_the_ZENON

# 2. Zainstaluj zależności
npm install

# 3. Skopiuj plik .env
cp .env.example .env

# 4. Edytuj .env i dodaj klucze API
nano .env
```

---

## ⚙️ Konfiguracja

### Plik `.env`

```env
# OpenAI API (wymagane dla narzędzi AI)
OPENAI_API_KEY=sk-your-openai-key-here

# Google API (opcjonalne - dla przyszłych funkcji)
GOOGLE_API_KEY=your-google-key-here

# Cloudflare (wymagane dla deployment)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Development
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:4321
```

### Jak uzyskać klucze API?

#### OpenAI API Key
1. Wejdź na [platform.openai.com](https://platform.openai.com)
2. Zaloguj się / Zarejestruj
3. Przejdź do **API Keys**
4. Kliknij **Create new secret key**
5. Skopiuj klucz i wklej do `.env`

⚠️ **UWAGA:** Nigdy nie commituj pliku `.env` do repozytorium!

---

## 🚀 Uruchomienie

### Development Mode

```bash
npm run dev
```

Aplikacja będzie dostępna na: `http://localhost:4321`

### Production Build

```bash
# Build
npm run build

# Preview
npm run preview
```

### Type Checking

```bash
npm run check
```

---

## 🌐 Deployment

### Cloudflare Pages (Zalecane)

#### 1. Przez Wrangler CLI

```bash
# Login do Cloudflare
npx wrangler login

# Deploy
npm run build
npx wrangler pages deploy dist
```

#### 2. Przez Dashboard

1. Wejdź na [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Pages** → **Create a project**
3. Połącz z GitHub/GitLab
4. Ustawienia:
   - **Build command:** `npm run build`
   - **Build output:** `dist`
   - **Root directory:** `/`

5. **Environment Variables** → Dodaj:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

6. Deploy!

### Inne Platformy

- **Vercel** - Zainstaluj `@astrojs/vercel` adapter
- **Netlify** - Zainstaluj `@astrojs/netlify` adapter
- **Node.js** - Zainstaluj `@astrojs/node` adapter

---

## 📁 Struktura Projektu

```
ai-biznes-start/
├── src/
│   ├── pages/                    # Routing (Astro)
│   │   ├── index.astro          # Strona główna
│   │   ├── narzedzia/           # Strony narzędzi
│   │   │   ├── index.astro      # Lista narzędzi
│   │   │   ├── generator-tresci.astro
│   │   │   ├── asystent-email.astro
│   │   │   ├── organizer-zadan.astro
│   │   │   └── kalkulator-biznesowy.astro
│   │   └── api/                 # API Endpoints
│   │       ├── generate-content.ts
│   │       └── generate-email.ts
│   │
│   ├── components/              # Komponenty React
│   │   ├── narzedzia/          # Komponenty narzędzi
│   │   │   ├── GeneratorTresci.tsx
│   │   │   ├── AsystentEmail.tsx
│   │   │   ├── OrganizerZadan.tsx
│   │   │   └── KalkulatorBiznesowy.tsx
│   │   ├── NewsBiznesowe.tsx
│   │   └── MusicPlayerVisualizer.tsx
│   │
│   ├── layouts/                 # Layouty stron
│   │   └── MainLayout.astro
│   │
│   └── styles/                  # Style globalne
│       └── global.css
│
├── public/                      # Statyczne pliki
│   ├── images/
│   ├── fonts/
│   └── music/                   # (dodaj pliki MP3)
│
├── docs/                        # Dokumentacja
│
├── astro.config.mjs            # Konfiguracja Astro
├── tailwind.config.mjs         # Konfiguracja Tailwind
├── tsconfig.json               # TypeScript config
├── package.json
└── README.md
```

---

## 🔨 Rozwój

### Dodawanie Agent Skills

Ten projekt obsługuje teraz instalację agent skills z repozytoriów takich jak `google-labs-code/stitch-skills`. Agent skills to wtyczki rozszerzające możliwości AI agentów w tworzeniu kodu.

#### Instalacja skill

```bash
# Lista dostępnych skills
npx add-skill google-labs-code/stitch-skills --list

# Instalacja konkretnego skill globalnie
npx add-skill google-labs-code/stitch-skills --skill react:components --global

# Instalacja lokalnie (w bieżącym katalogu)
npx add-skill google-labs-code/stitch-skills --skill design-md
```

#### Dostępne Skills z google-labs-code/stitch-skills

- **react:components** - Konwertuje projekty Stitch HTML/CSS do production-ready komponentów React używając metodologii Atomic Design
- **design-md** - Generuje dokumentację DESIGN.md z projektów Stitch
- **shadcn-ui** - Integracja z biblioteką komponentów shadcn/ui

#### Zainstalowane Skills

Skills zainstalowane globalnie znajdują się w `.github/agents/skills/` i są dostępne dla wszystkich AI agentów (GitHub Copilot, Claude Code, Cursor, itp.).

Plik `skills-manifest.json` zawiera listę wszystkich zainstalowanych skills.

### Dodawanie Nowych Narzędzi

#### 1. Stwórz komponent React

```tsx
// src/components/narzedzia/MojeNarzedzie.tsx
import { useState } from 'react';

const MojeNarzedzie = () => {
  return (
    <div className="card">
      {/* Twój kod */}
    </div>
  );
};

export default MojeNarzedzie;
```

#### 2. Stwórz stronę Astro

```astro
---
// src/pages/narzedzia/moje-narzedzie.astro
import MainLayout from '../../layouts/MainLayout.astro';
import MojeNarzedzie from '../../components/narzedzia/MojeNarzedzie';
---

<MainLayout title="Moje Narzędzie">
  <MojeNarzedzie client:load />
</MainLayout>
```

#### 3. Dodaj do listy narzędzi

Edytuj `src/pages/index.astro` i `src/pages/narzedzia/index.astro`

### Dodawanie API Endpoint

```typescript
// src/pages/api/moje-api.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  // Twoja logika

  return new Response(
    JSON.stringify({ result: 'OK' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

### Music Player - Dodawanie Muzyki

1. Dodaj pliki MP3 do `public/music/`
2. Edytuj `src/components/MusicPlayerVisualizer.tsx`:

```typescript
const tracks = [
  {
    title: 'Twój utwór',
    artist: 'Artysta',
    duration: '3:45',
    genre: 'Lo-fi',
    src: '/music/track1.mp3'  // ← Dodaj ścieżkę
  }
];
```

---

## 📚 Dokumentacja Użytkownika

### Jak Używać Narzędzi?

#### Generator Treści
1. Wybierz typ treści (post, opis produktu...)
2. Opisz czego potrzebujesz
3. Wybierz ton i długość
4. Kliknij "Wygeneruj"
5. Kopiuj gotową treść!

#### Asystent Email
1. Wypróbuj gotowe szablony LUB
2. Podaj do kogo piszesz
3. Opisz w jakiej sprawie
4. Wybierz ton
5. Wygeneruj i kopiuj!

#### Organizer Zadań
1. Dodaj nowe zadanie
2. Ustaw priorytet (🔴 wysoki, 🟡 średni, 🟢 niski)
3. Opcjonalnie ustaw termin
4. Zaznaczaj gdy zrobione ✅
5. Filtruj (wszystkie/aktywne/ukończone)

#### Kalkulator Biznesowy
1. Wybierz typ kalkulatora (Marża/VAT/ROI/Zysk)
2. Wpisz wartości
3. Kliknij "Oblicz"
4. Zobacz wyniki!

---

## 🐛 Rozwiązywanie Problemów

### API nie działa
- Sprawdź czy klucz API jest w `.env`
- Sprawdź czy masz credits w OpenAI
- Sprawdź console przeglądarki (F12)

### Błąd podczas build
```bash
# Usuń node_modules i zainstaluj ponownie
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Błąd TypeScript
```bash
npm run check
```

---

## 🤝 Współpraca

Chcesz pomóc w rozwoju? Super!

1. Fork repozytorium
2. Stwórz branch (`git checkout -b feature/super-funkcja`)
3. Commit (`git commit -m 'Dodaj super funkcję'`)
4. Push (`git push origin feature/super-funkcja`)
5. Otwórz Pull Request

---

## 📄 Licencja

MIT License - możesz używać tego projektu dowolnie!

---

## 📞 Kontakt

Masz pytania? Problemy? Sugestie?

- **GitHub Issues:** [Link do issues]
- **Email:** [twój email]

---

## 🙏 Podziękowania

- OpenAI za API
- Astro Team
- Cloudflare Pages
- Społeczność Open Source

---

**Stworzono z ❤️ dla polskich przedsiębiorców**

*AI Biznes Start - Twoje pierwsze kroki w świecie AI dla biznesu!*
