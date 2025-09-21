# 🔧 Konfiguracja Cloudflare AI dla MyBonzo Development

## 📋 Wymagane kroki

### 1. 🔑 Uzyskanie kluczy Cloudflare

#### A. API Token
1. Przejdź do: https://dash.cloudflare.com/profile/api-tokens
2. Kliknij "Create Token"
3. Wybierz "Custom token"
4. Ustaw permissions:
   - **Account** - Cloudflare Workers:Edit
   - **Zone** - Zone:Read (opcjonalne, jeśli masz domenę)
   - **Account** - Account:Read
5. Skopiuj wygenerowany token

#### B. Account ID
1. Przejdź do: https://dash.cloudflare.com/
2. W prawym sidebarz znajdź "Account ID"
3. Skopiuj Account ID

### 2. 📝 Aktualizacja .env.local

Otwórz plik `.env.local` i zastąp placeholder'y rzeczywistymi wartościami:

```bash
# CLOUDFLARE CONFIGURATION
CLOUDFLARE_API_TOKEN=your-actual-cloudflare-api-token-here
CLOUDFLARE_ACCOUNT_ID=your-actual-cloudflare-account-id-here
```

### 3. 🚀 Uruchomienie z AI

Użyj nowego skryptu dev z Cloudflare AI:

```bash
npm run dev:ai
```

Lub tradycyjnie:

```bash
npm run dev
```

### 4. ✅ Testowanie AI endpoints

Po uruchomieniu, przetestuj:

```bash
# Test health check
curl http://localhost:3006/api/health

# Test image generation
curl -X POST http://localhost:3006/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test image"}'

# Test POLACZEK chat
curl -X POST http://localhost:3006/api/polaczek-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Cześć, co to jest MyBonzo?"}'
```

## 🔧 Konfiguracja została automatycznie zaktualizowana

✅ **wrangler.jsonc** - Dodano AI binding i KV namespace  
✅ **.env.local** - Dodano placeholders dla kluczy Cloudflare  
✅ **wrangler-dev.toml** - Utworzono konfigurację dev  
✅ **dev-with-ai.mjs** - Skrypt uruchamiający z AI  
✅ **package.json** - Dodano `npm run dev:ai`

## 🚨 Troubleshooting

### Problem: "AI binding not available"
- Sprawdź czy masz rzeczywiste klucze API w `.env.local`
- Upewnij się, że masz dostęp do Cloudflare Workers AI w swoim planie

### Problem: "Invalid binding AI"
- Sprawdź czy `wrangler.jsonc` ma poprawną konfigurację AI binding
- Uruchom `npx wrangler login` aby uwierzytelnić się

### Problem: "Port already in use"
- Zmień port w `astro.config.mjs` server.port
- Lub zabij proces na porcie 3006

## 📊 Co jest teraz dostępne

- 🤖 **Cloudflare Workers AI** - Wszystkie modele AI
- 🗄️ **KV Storage** - Session management  
- 🔄 **Platform Proxy** - Lokalny development z cloud features
- 🎯 **AI Endpoints** - Generator obrazów, POLACZEK, etc.

**Status:** ✅ Konfiguracja gotowa - wymagane tylko uzupełnienie kluczy API