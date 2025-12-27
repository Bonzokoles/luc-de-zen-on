# 🗄️ Cloudflare D1 + Gemini API Setup

## Krok 1: Utwórz D1 Database

```bash
# Zaloguj się do Cloudflare
npx wrangler login

# Utwórz nową bazę D1
npx wrangler d1 create mybonzo_database
```

Po utworzeniu dostaniesz output:
```
✅ Successfully created DB 'mybonzo_database'

[[d1_databases]]
binding = "DB"
database_name = "mybonzo_database"
database_id = "xxxx-xxxx-xxxx-xxxx" # <-- SKOPIUJ TO!
```

## Krok 2: Zaktualizuj wrangler.toml

W pliku `wrangler.toml` zamień:
```toml
database_id = "PLACEHOLDER_ID"
```
Na:
```toml
database_id = "xxxx-xxxx-xxxx-xxxx"  # Twój ID z kroku 1
```

## Krok 3: Inicjalizuj schema w D1

```bash
# Wykonaj migrację schema
npx wrangler d1 execute mybonzo_database --file=./schema.sql
```

Lub lokalnie (dev):
```bash
npx wrangler d1 execute mybonzo_database --local --file=./schema.sql
```

## Krok 4: Dodaj Gemini API Key do Cloudflare

### Metoda 1: Przez Dashboard
1. Wejdź: https://dash.cloudflare.com
2. Workers & Pages → mybonzo-new (lub luc-de-zen-on)
3. Settings → Variables and Secrets
4. Dodaj:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** [Twój klucz z https://aistudio.google.com/apikey]
   - **Type:** Encrypted (Secret)

### Metoda 2: Przez CLI
```bash
npx wrangler pages secret put GEMINI_API_KEY
# Wklej klucz gdy zostaniesz poproszony
```

## Krok 5: Dodaj GEMINI_API_KEY do GitHub Secrets

1. https://github.com/Bonzokoles/luc-de-zen-on/settings/secrets/actions
2. New repository secret:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** [Twój Gemini API key]

## Krok 6: Testowanie lokalnie

```bash
# Uruchom dev server z D1
npm run dev

# Lub z wrangler
npx wrangler pages dev dist --d1=DB:mybonzo_database
```

## 📊 Schema Overview

**Tabele:**
- `users` - Sesje użytkowników
- `calculations` - Historia kalkulacji
- `generated_content` - Treści z AI
- `tasks` - Zadania z Organizera
- `invoices` - Faktury VAT
- `chat_messages` - Historia czatu z AI

## 🔌 API Endpoints (do utworzenia)

- `POST /api/db/calculations` - Zapisz kalkulację
- `GET /api/db/calculations?user_id=X` - Pobierz historię
- `POST /api/gemini/generate` - Generuj treść z Gemini
- `POST /api/db/tasks` - Zapisz zadanie
- `GET /api/db/tasks?user_id=X` - Pobierz zadania

## ✅ Verification

Po zakończeniu setup:
1. Sprawdź czy baza jest widoczna: `npx wrangler d1 list`
2. Zrób test query: `npx wrangler d1 execute mybonzo_database --command="SELECT * FROM users LIMIT 1"`
3. Deploy: `npm run build && npx wrangler pages deploy dist`

## 🔧 Troubleshooting

**Problem:** Database not found
- **Fix:** Upewnij się że `database_id` w `wrangler.toml` jest poprawne

**Problem:** GEMINI_API_KEY undefined
- **Fix:** Dodaj secret do Cloudflare Pages (nie tylko do GitHub)

**Problem:** Schema nie został wykonany
- **Fix:** Uruchom `npx wrangler d1 execute mybonzo_database --file=./schema.sql --remote`
