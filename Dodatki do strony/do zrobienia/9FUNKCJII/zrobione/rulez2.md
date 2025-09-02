Oto gotowy skrypt w Node.js, który automatycznie tworzy proponowaną strukturę folderów wraz z przykładowym plikiem rules.txt na dysku T:\MY_LUC_ZEN_ON. Skrypt można uruchomić jednorazowo na lokalnym komputerze, a następnie Copilot lub Ty możecie go użyć do szybkiego odbudowania struktury podczas pracy.

Skrypt automatycznego tworzenia folderów i pliku rules.txt
js
// createProjectStructure.js
import fs from 'fs/promises';
import path from 'path';

const baseDir = 'T:/MY_LUC_ZEN_ON';

const folders = [
  'src/api',
  'src/components',
  'src/pages/backroom',
  'src/workflows/flowise',
  'src/workflows/activepieces',
  'Documentation'
];

const rulesContent = `# Reguły i standardy pracy nad projektem mybonzo

1. Każda funkcjonalność ma osobny folder lub pliki w katalogach:
   - Frontend: /src/components/
   - Backend API: /src/api/
   - Workflow: /src/workflows/flowise/ lub /src/workflows/activepieces/

2. Pliki workflow mają nazwy zgodne z nazwą funkcji np. "activepieces_reminders_workflow.json"

3. Dokumentacja znajduje się w folderze /Documentation/ w osobnych plikach .md

4. Każdy nowy moduł musi mieć powiązaną dokumentację (opis, lokalizację, API, zależności)

5. Używaj spójnego nazewnictwa plików i komponentów (np. ActivityDashboard.jsx)

6. Przed commitowaniem wykonuj testy lokalne z \`wrangler dev\` i buduj projekt \`npm run build\`

7. W pliku wrangler.toml konfigurować zmienne środowiskowe i ustawienia deploymentu

8. Wszystkie klucze API przechowuj tylko w plikach .env i nigdy nie commituj ich do repozytorium

9. Do importu workflow używaj gotowych JSON-ów w /src/workflows/ i skryptów deploymentu

10. Komunikacja i zadania dla Copilota opieraj na tej strukturze i regułach, aby zachować modularność

---

# Przykładowa komenda do uruchomienia developerskiego:

wrangler dev

---

# Przykład komendy do deploy’u:

wrangler publish
`;

async function createDirs() {
  for (const folder of folders) {
    const dirPath = path.join(baseDir, folder);
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Stworzono folder: ${dirPath}`);
  }
}

async function createRulesFile() {
  const filePath = path.join(baseDir, 'rules.txt');
  await fs.writeFile(filePath, rulesContent, 'utf8');
  console.log(`Stworzono plik: ${filePath}`);
}

async function main() {
  try {
    await createDirs();
    await createRulesFile();
    console.log('Struktura folderów i plik rules.txt zostały stworzone.');
  } catch (e) {
    console.error('Błąd podczas tworzenia struktury:', e);
  }
}

main();
Instrukcja uruchomienia
Zapisz powyższy skrypt jako createProjectStructure.js na lokalnym komputerze, np. w folderze roboczym.

Upewnij się, że masz zainstalowane Node.js (wersja 14+).

W konsoli uruchom:

bash
node createProjectStructure.js
Po wykonaniu skryptu w katalogu T:\MY_LUC_ZEN_ON zostanie utworzona kompletną strukturę folderów oraz plik rules.txt.

Skrypt można uruchomić ponownie, by odbudować strukturę, lub zmodyfikować według potrzeb.

Po dodaniu tego skryptu do repozytorium i zdefiniowaniu w dokumentacji, Copilot będzie mógł korzystać z jasnej plastycznej struktury workspace do generowania i rozwijania poszczególnych modułów z pełną świadomością lokalizacji plików.   następnie sprawdz STARTER_1.md i utworzymy plik startujący całą aplikacje