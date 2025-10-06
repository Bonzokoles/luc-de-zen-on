Oto struktura folderów, którą można zbudować w workspace na dysku T:\MY_LUC_ZEN_ON, wraz z folderem dokumentacji DOC_mentacja oraz plikiem rules, który będzie służył jako zbiór reguł dla dalszej pracy. 

***

# Proponowana struktura folderów dla workspace T:\MY_LUC_ZEN_ON

```
T:\MY_LUC_ZEN_ON
│
├── src
│   ├── api
│   │   ├── activity.js
│   │   ├── reminders.js
│   │   ├── faq.js
│   │   └── ... (inne funkcje backend)
│   │
│   ├── components
│   │   ├── ActivityDashboard.jsx
│   │   ├── RemindersManager.jsx
│   │   ├── FAQWidget.jsx
│   │   └── ... (inne komponenty frontend)
│   │
│   ├── pages
│   │   ├── backroom
│   │   │   ├── dashboard.astro
│   │   │   ├── reminders.astro
│   │   │   └── faq.astro
│   │   └── ... (inne strony)
│   │
│   └── workflows
│       ├── flowise
│       │   ├── flowise_monitoring_workflow.json
│       │   └── ... (inne workflow Flowise)
│       └── activepieces
│           ├── activepieces_reminders_workflow.json
│           ├── activepieces_ticket_assignment_workflow.json
│           └── ... (inne workflow ActivePieces)
│
├── Documentation
│   ├── README.md
│   ├── Functionality_ActivityDashboard.md
│   ├── Functionality_RemindersManager.md
│   ├── Functionality_FAQWidget.md
│   └── ... (inne opisy modułów)
│
├── rules.txt
├── wrangler.toml
├── package.json
└── ... (inne pliki konfiguracyjne)
```

***

# Przykładowa zawartość pliku `rules.txt`

```
# Reguły i standardy pracy nad projektem mybonzo

1. Każda funkcjonalność ma osobny folder lub pliki w katalogach:
   - Frontend: /src/components/
   - Backend API: /src/api/
   - Workflow: /src/workflows/flowise/ lub /src/workflows/activepieces/

2. Pliki workflow mają nazwy zgodne z nazwą funkcji np. "activepieces_reminders_workflow.json"

3. Dokumentacja znajduje się w folderze /Documentation/ w osobnych plikach .md

4. Każdy nowy moduł musi mieć powiązaną dokumentację (opis, lokalizację, API, zależności)

5. Używaj spójnego nazewnictwa plików i komponentów (np. ActivityDashboard.jsx)

6. Przed commitowaniem wykonuj testy lokalne z `wrangler dev` i buduj projekt `npm run build`

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
```

***

w rulez2.md znajdziesz  automatyczny skrypt i instrukcję, która stworzy tę strukturę folderów i plik rules.txt
