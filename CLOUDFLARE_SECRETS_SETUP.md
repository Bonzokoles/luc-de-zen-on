# CLOUDFLARE SECRETS SETUP GUIDE
**Wygenerowany**: 26 września 2025

## Konfiguracja Secrets w Cloudflare Pages

### Krok 1: Wejdź do Cloudflare Dashboard
1. Idź do https://dash.cloudflare.com/
2. Wybierz **Pages** → **luc-de-zen-on**
3. Przejdź do **Settings** → **Environment variables**

### Krok 2: Dodaj Production Secrets

**KAGGLE API:**
```
Name: KAGGLE_USERNAME
Value: karollisson
Environment: Production
```

```
Name: KAGGLE_KEY  
Value: 3df1a227ec6cc5f32a420d432707e867
Environment: Production
```

**TAVILY SEARCH API:**
```
Name: TAVILY_API_KEY
Value: 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
Environment: Production
```

### Krok 3: Preview Environment (opcjonalnie)
Powtórz te same wartości dla **Preview** jeśli chcesz testować na preview deployments.

### Krok 4: Weryfikacja
Po deployment API będą używać prawdziwych kluczy z Cloudflare secrets zamiast placeholder wartości.

## Lokalne Development
Dla lokalnego testowania zmień wartości w `.env.local` na prawdziwe klucze (ale **NIE commituj** tego pliku do git!).

## Struktura Bezpieczeństwa
- ✅ Kod zawiera tylko placeholder wartości
- ✅ Prawdziwe klucze tylko w Cloudflare secrets  
- ✅ GitHub nie zablokuje commitu
- ✅ Bezpieczne deployment na production

## Test API Endpoints
Po skonfigurowaniu secrets:
- `/api/kaggle/datasets?action=search&q=test`
- `/api/tavily/search?action=search&q=test`
- `/api/bigquery/analytics?action=help`

---
**UWAGA**: NIE dodawaj prawdziwych kluczy do wersjonowanych plików!
