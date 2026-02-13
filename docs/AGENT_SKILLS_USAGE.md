# Agent Skills - Instrukcja Użycia

## Przegląd

Ten projekt obsługuje teraz instalację **agent skills** - specjalistycznych wtyczek rozszerzających możliwości AI agentów (GitHub Copilot, Claude Code, Cursor, itp.) podczas tworzenia kodu.

## Instalacja

### Polecenia CLI

```bash
# Wyświetl pomoc
npx add-skill --help

# Wyświetl dostępne skills
npx add-skill google-labs-code/stitch-skills --list

# Zainstaluj skill globalnie (w .github/agents/skills/)
npx add-skill google-labs-code/stitch-skills --skill react:components --global

# Zainstaluj skill lokalnie (w .skills/ w bieżącym katalogu)
npx add-skill google-labs-code/stitch-skills --skill design-md
```

## Dostępne Skills z google-labs-code/stitch-skills

### react:components
**Opis:** Konwertuje projekty Stitch HTML/CSS do production-ready komponentów React używając metodologii Atomic Design

**Funkcje:**
- Automatyczna konwersja UI screens do TypeScript React components
- Pipeline pięciostopniowy: Retrieval → Mapping → Generation → Validation → Audit
- Struktura Atomic Design (atoms, molecules, organisms, templates, pages)
- Strict typing i design token consistency
- Production-ready quality code

**Kiedy używać:**
- Gdy generujesz UI design używając Stitch (przez text prompt lub Figma)
- Gdy potrzebujesz szybko przekonwertować design do kodu React
- Gdy chcesz zachować spójność design tokens

### design-md
**Opis:** Generuje kompletną dokumentację DESIGN.md z projektów Stitch

**Funkcje:**
- Ekstrahuje decyzje designerskie i uzasadnienia
- Dokumentuje hierarchie komponentów
- Opisuje użycie design tokens
- Tworzy wizualną dokumentację

**Kiedy używać:**
- Po zakończeniu projektu Stitch, aby wygenerować dokumentację
- Gdy zespół potrzebuje zrozumieć system design

### shadcn-ui
**Opis:** Integracja z biblioteką komponentów shadcn/ui

**Funkcje:**
- Mapuje komponenty Stitch do odpowiedników shadcn/ui
- Zachowuje spójny styling
- Wykorzystuje istniejące wzorce komponentów

**Kiedy używać:**
- W projektach używających shadcn/ui
- Dla zapewnienia kompatybilności i spójności

## Lokalizacje Plików

### Instalacja Globalna (--global)
Skills instalowane globalnie znajdują się w:
```
.github/agents/skills/
├── react-components.md
├── design-md.md
├── shadcn-ui.md
└── skills-manifest.json
```

### Instalacja Lokalna
Skills instalowane lokalnie znajdują się w:
```
.skills/
├── react-components.md
└── skills-manifest.json
```

## Manifest Skills

Plik `skills-manifest.json` zawiera listę wszystkich zainstalowanych skills:

```json
{
  "skills": [
    {
      "name": "react:components",
      "repository": "google-labs-code/stitch-skills",
      "installedAt": "2026-02-10T19:09:47.745Z",
      "description": "Converts Stitch HTML/CSS designs into production-ready React components..."
    }
  ]
}
```

## Integracja z AI Agentami

Zainstalowane skills są automatycznie dostępne dla:
- ✅ GitHub Copilot
- ✅ Claude Code
- ✅ Cursor
- ✅ Gemini CLI
- ✅ Antigravity

Agenty AI mogą teraz wykorzystywać te skills podczas:
- Generowania nowego kodu
- Refaktoryzacji istniejącego kodu
- Konwersji designów do kodu
- Tworzenia dokumentacji

## Testowanie

Uruchom testy CLI:
```bash
npm run test:add-skill
```

## Rozwiązywanie Problemów

### Skill nie jest rozpoznawany
- Upewnij się, że skill jest zainstalowany: sprawdź `skills-manifest.json`
- Sprawdź, czy plik skill (np. `react-components.md`) istnieje w katalogu skills

### Brak uprawnień do instalacji
- Upewnij się, że masz uprawnienia do zapisu w katalogu projektu
- Sprawdź, czy katalog `.github/agents/` istnieje i ma odpowiednie uprawnienia

### Nieznany skill
- Użyj `--list` aby zobaczyć dostępne skills
- Sprawdź poprawność nazwy skill (wielkość liter ma znaczenie)

## Przykłady Użycia

### Szybki Start
```bash
# 1. Zobacz dostępne skills
npx add-skill google-labs-code/stitch-skills --list

# 2. Zainstaluj react:components
npx add-skill google-labs-code/stitch-skills --skill react:components --global

# 3. Sprawdź zainstalowane skills
cat .github/agents/skills/skills-manifest.json
```

### Workflow z React Components
```bash
# 1. Zainstaluj skill
npx add-skill google-labs-code/stitch-skills --skill react:components --global

# 2. Stwórz design w Stitch lub Figma
# 3. AI agent automatycznie użyje skill podczas konwersji do React
# 4. Otrzymasz production-ready komponenty React z TypeScript
```

### Dodawanie Wielu Skills
```bash
# Zainstaluj wszystkie potrzebne skills
npx add-skill google-labs-code/stitch-skills --skill react:components --global
npx add-skill google-labs-code/stitch-skills --skill design-md --global
npx add-skill google-labs-code/stitch-skills --skill shadcn-ui --global
```

## Więcej Informacji

- Dokumentacja w README.md (sekcja "🔨 Rozwój")
- Kod źródłowy: `bin/add-skill.js`
- Testy: `test/add-skill.test.js`
