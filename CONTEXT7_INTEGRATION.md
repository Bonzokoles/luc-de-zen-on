## Context7 – Integracja i Użycie (Przyszłościowe Wzorce)

Ten dokument opisuje jak zintegrować i rozwijać obsługę Context7 (MCP – Model Context Protocol) w tym repozytorium, aby w przyszłości łatwo pozyskiwać świeże wzorce (patterns), fragmenty dokumentacji oraz stosować je w: 
`AI Workers`, `Astro API`, `Testach`, `Skryptach automatyzujących`.

---
## 1. Cele integracji
1. Automatyczne pobieranie najnowszych wzorców (routing, KV, AI modele, Tailwind utilities itd.).
2. Lokalne snapshoty (offline cache) – szybka nawigacja / code review.
3. Możliwość półautomatycznej refaktoryzacji (np. wykrycie przestarzałych API Workers / Astro endpoint patterns).
4. Wsparcie testów – generowanie asercji bazujących na aktualnej dokumentacji.
5. Podkład pod przyszłe narzędzia “lintujące semantycznie” (pattern drift detection).

---
## 2. Aktualny stan
W repo istnieje skrypt: `scripts/fetch-context7-patterns.js` który:
- Wykorzystuje tablicę `LIBRARIES` (astro, cloudflare-workers, tailwindcss)
- Próbuje użyć globalnego hooka: `globalThis.__CONTEXT7_FETCH__(libraryId, topic)`
- Tworzy strukturę: `docs/context7/<biblioteka>/{snapshot.json, README.md}` + `docs/context7/index.json`
- Przy braku mostu MCP – generuje placeholdery (nie psuje pipeline’u)

---
## 3. Architektura docelowa integracji
```
[Editor / MCP Host]
   └─ Context7 MCP Server (udostępnia API: resolve-library-id, get-library-docs)
        └─ Bridge (plugin / init script) → Injectuje globalThis.__CONTEXT7_FETCH__
                └─ Nasz skrypt fetch-context7-patterns.js (Node ESM)
                        └─ Generuje snapshoty + indeks
```

---
## 4. Implementacja hooka (__CONTEXT7_FETCH__)
Przykładowy adapter (może być uruchamiany w osobnym narzędziu, workerze developerskim albo bootstrapowany w testach):
```js
// scripts/context7-bootstrap.js
import { spawn } from 'node:child_process';

// Pseudokod – zakładamy, że istnieje CLI mcp-context7 lub API HTTP
globalThis.__CONTEXT7_FETCH__ = async function fetchContext7(libraryId, topic) {
  // 1. Resolve library (opcjonalnie caching)
  // 2. Pobierz dokumenty dla topicu
  // 3. Zwróć tekst scalony / skrócony
  // Placeholder implementacja:
  return `[context7:${libraryId}:${topic}] example snippet placeholder`;
};
```

Dodanie do wywołania fetchera (PowerShell):
```powershell
node -e "import('./scripts/context7-bootstrap.js'); import('./scripts/fetch-context7-patterns.js');"
```

Lub w package.json alternatywny wpis:
```jsonc
{
  "scripts": {
    "fetch:patterns:bridge": "node -e \"import('./scripts/context7-bootstrap.js'); import('./scripts/fetch-context7-patterns.js')\""
  }
}
```

---
## 5. Dodawanie nowych bibliotek / tematów
Edytuj w `scripts/fetch-context7-patterns.js` tablicę `LIBRARIES`:
```js
const LIBRARIES = [
  { id: 'astro', topics: ['routing', 'api endpoints', 'components', 'islands'] },
  { id: 'cloudflare-workers', topics: ['kv', 'ai', 'durable objects', 'cache api'] },
  { id: 'tailwindcss', topics: ['utilities', 'configuration', 'dark mode'] },
  { id: 'svelte', topics: ['stores', 'transitions', 'actions'] },
];
```

> Zasada: temat = semantyczny wycinek dokumentacji który jest użyteczny przy refaktoryzacji lub generowaniu kodu.

---
## 6. Integracja z testami
Można dodać test “drift”: jeśli np. w snapshotach pojawi się sekcja z nową rekomendacją, a w kodzie nadal stary pattern – zgłoś ostrzeżenie.

Szkic testu:
```js
// src/tests/pattern-drift.test.js
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

function assert(cond, msg) { if (!cond) throw new Error(msg); }

const snapshot = JSON.parse(readFileSync('docs/context7/astro/snapshot.json', 'utf8'));
const hasIslands = snapshot.entries.some(e => e.topic === 'islands' && e.doc && /island/i.test(e.doc));

if (hasIslands) {
  // Prosty heurystyczny przykład – sprawdź czy używamy patternu w kodzie
  const files = await glob('src/**/*.astro');
  let usage = 0;
  for (const f of files) {
    const txt = readFileSync(f, 'utf8');
    if (/client:idle|client:visible/.test(txt)) usage++;
  }
  assert(usage > 0, 'Brak implementacji islands mimo dokumentacji w snapshot');
}
```

> Ten test może być opcjonalny (uruchamiany w trybie CI cron, nie przy każdym buildzie).

---
## 7. Aktualizacja w pipeline / CI
Scenariusz:
1. Raz na dobę (GitHub Actions cron) uruchom: `pnpm fetch:patterns`.
2. Jeśli `git diff` wykazuje realną zmianę w `docs/context7/` → commit z tagiem `[ci:patterns]`.
3. (Opcja) Otwórz PR z changelogiem wzorców → łatwa recenzja.

Przykładowy fragment workflow (YAML – szkic):
```yaml
jobs:
  context7:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm fetch:patterns
      - name: Commit changes
        run: |
          if git diff --quiet docs/context7; then
            echo "No pattern updates";
          else
            git config user.name "context7-bot"
            git config user.email "context7-bot@example"
            git add docs/context7
            git commit -m "chore(context7): update pattern snapshots"
            git push origin HEAD:FINAL_mybonzo
          fi
```

---
## 8. Wykorzystanie w kodzie (runtime hints)
Możesz podczas developmentu załadować snapshot i pokazywać “advisory banners” w konsoli kiedy używany jest przestarzały pattern.

Przykład (w pliku dev-only):
```js
if (process.env.NODE_ENV === 'development') {
  try {
    const astroSnap = JSON.parse(readFileSync('docs/context7/astro/snapshot.json', 'utf8'));
    const routingEntry = astroSnap.entries.find(e => e.topic === 'routing');
    if (routingEntry && /deprecated/i.test(routingEntry.doc || '')) {
      console.warn('[Context7 Advisory] Routing pattern ma sekcje oznaczone jako deprecated – sprawdź aktualizacje.');
    }
  } catch (_) {}
}
```

---
## 9. Strategia wersjonowania snapshotów
Propozycja: przechowywać tylko ostatni snapshot (obecne rozwiązanie). Jeśli potrzebujesz historii:
- Zmień nazwę pliku na `snapshot-YYYYMMDD.json`.
- Dodaj symlink/alias `latest.json`.
- Rotacja: zachowaj np. 7 ostatnich.

---
## 10. Potencjalne rozszerzenia
| Rozszerzenie | Opis | Priorytet |
|--------------|------|-----------|
| Semantyczny diff | Podświetlanie tylko nowych sekcji w README.md | średni |
| Pattern lint | ESLint rule / AST scan– wykrywa legacy API | wysoki |
| Telemetria użycia | Zliczanie które patterns są czytane | niski |
| Interaktywne UI | Strona /patterns z filtrowaniem | średni |
| Auto-refactor hints | Generowanie PR z proponowanymi migracjami | niski |

---
## 11. Workflow ręczny (skrót)
```powershell
# 1. (Opcjonalnie) załaduj most MCP
node -e "import('./scripts/context7-bootstrap.js');"

# 2. Pobierz wzorce
pnpm fetch:patterns

# 3. Przejrzyj zmiany
git diff docs/context7

# 4. Commit jeśli sensowne
git add docs/context7
git commit -m "chore(context7): refresh snapshots"
git push
```

---
## 12. FAQ
**Q: Co jeśli brak mostu MCP?**  
Zostanie wygenerowany placeholder – brak blokady pipeline’u.

**Q: Czy można odfiltrować zbyt duże fragmenty?**  
Tak – aktualnie tniemy >5000 znaków. Możesz parametryzować flagą CLI np. `--limit=10000`.

**Q: Jak dodać integrację dla frameworka X?**  
Dodaj do `LIBRARIES` + ewentualny translator topiców.

**Q: Czy to wymaga nowych zależności NPM?**  
Nie – tylko Node built-ins.

---
## 13. Checklista wdrożenia (minimal)
- [x] Skrypt fetch (`scripts/fetch-context7-patterns.js`)
- [x] Wpis w `package.json` → `fetch:patterns`
- [ ] (Opcja) Most MCP runtime (`context7-bootstrap.js`)
- [ ] (Opcja) Test drift (`pattern-drift.test.js`)
- [ ] (Opcja) Cron CI workflow

---
## 14. Podsumowanie
Ta warstwa integracyjna jest “bezpiecznym adapterem”: działa w trybie degradacji (placeholders), ale przygotowuje grunt pod pełną automatyzację refaktoryzacji i audytu wzorców. Nie blokuje buildów ani testów, a w każdej chwili można ją rozszerzyć.

W razie potrzeby mogę dorzucić gotowy plik bootstrap mostu lub test drift – daj znać.

### 14.1 Aktualizacja – realny bridge wdrożony
Dodano plik `scripts/context7-bootstrap.js`, który ustawia `globalThis.__CONTEXT7_FETCH__` i wspiera caching. 
Skrypt `fetch-context7-patterns.js` wspiera teraz zmienną środowiskową `CONTEXT7_LIBS` (JSON) do dynamicznego nadpisania listy bibliotek. 
Uruchomienie “live” (jeśli środowisko wstrzykuje `__MCP_CONTEXT7__`):
```powershell
node -e "import('./scripts/context7-bootstrap.js'); import('./scripts/fetch-context7-patterns.js');"
```
Lub z override:
```powershell
$env:CONTEXT7_LIBS='[{"id":"/withastro/astro","topics":["routing","components"]}]'
node -e "import('./scripts/context7-bootstrap.js'); import('./scripts/fetch-context7-patterns.js');"
```

---
_Opracowano: automatyczna asysta – Context7 enablement plan._
