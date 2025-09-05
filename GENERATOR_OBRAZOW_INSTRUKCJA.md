# 🎨 GENERATOR OBRAZÓW AI - WERSJA 2.0

## ✨ Nowe funkcje (na podstawie dokumentacji Cloudflare)

Generator został zmodernizowany zgodnie z najnowszymi best practices Cloudflare:

### 🚀 Nowe modele AI

- **Flux-1 Schnell** - najszybszy, wysokiej jakości (domyślny)
- **Flux-1 Dev** - zaawansowany model deweloperski
- **Stable Diffusion XL** - uniwersalny, fotorealistyczny  
- **DreamShaper** - artystyczny, kreatywny

### 💾 R2 Storage

- **Automatyczne przechowywanie** obrazów w chmurze
- **Stałe URL** zamiast base64
- **Metadane** - prompt, model, wymiary, data
- **Cache** - szybsze ładowanie

### 🛠️ Function Calling

- **Zaawansowane AI** z @cloudflare/ai-utils
- **Narzędzia** - tłumaczenie, czas, generowanie
- **Itty-router** - nowoczesny routing

## ✅ Rozwiązanie - Konfiguracja Cloudflare AI

### Krok 1: Uzyskaj klucze Cloudflare

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do **Account ID** (prawy górny róg) - skopiuj ten ID
3. Przejdź do **My Profile** → **API Tokens**
4. Kliknij **Create Token** → **Custom token**
5. Ustaw uprawnienia:
   - **Account** → **Cloudflare Workers:Edit**
   - **Zone** → **Zone:Read** (jeśli używasz domeny)

### Krok 2: Dodaj klucze do .env

```bash
# Skopiuj plik przykładowy
cp .env.example .env

# Edytuj plik .env i dodaj:
CLOUDFLARE_ACCOUNT_ID=twój_account_id_tutaj
CLOUDFLARE_API_TOKEN=twój_api_token_tutaj
```

### Krok 3: Restart serwera

```bash
npm run dev
```

## 🌐 Funkcja tłumaczenia

Generator obrazów ma wbudowaną funkcję **automatycznego tłumaczenia** z polskiego na angielski:

- ✅ **Polskie prompty** są automatycznie tłumaczone na angielski
- ✅ **Obsługa polskich znaków** - działa z "samochód", "słońce", "góra" itp.
- ✅ **Obsługa bez polskich znaków** - działa też z "samochod", "slonce", "gora"
- ✅ **Lepsze rezultaty** dzięki tłumaczeniu
- ✅ **Historia** zachowuje oba prompty (oryginalny i przetłumaczony)

## 🔧 Przykłady działania

**Polskie prompty:**

- "piękny zachód słońca nad górami" → "beautiful sunset over mountains"
- "futurystyczne miasto nocą" → "futuristic city at night"  
- "kot w stylu cyberpunk" → "cat in cyberpunk style"
- "samochód sportowy" → "car sports"
- "czerwony słoń" → "red elephant"

**Bez polskich znaków też działa:**

- "futurystyczny samochod" → "futuristic car"
- "piekny zachod slonca" → "beautiful sunset sun"
- "czarny kot w lesie" → "black cat in forest"

## 🚀 Dostępne modele AI

1. **Stable Diffusion XL** - uniwersalny, fotorealistyczny
2. **DreamShaper** - artystyczny, kreatywny
3. **Flux-1 Schnell** - szybki, wysokiej jakości

## 📞 Pomoc

Jeśli nadal masz problemy:

1. Sprawdź czy klucze API są prawidłowe
2. Sprawdź konsolę przeglądarki (F12) pod kątem błędów
3. Sprawdź czy Cloudflare Workers AI jest włączone na Twoim koncie
4. Upewnij się że masz kredyty na koncie Cloudflare

## 🎯 Status tłumaczenia

Po wpisaniu polskiego promptu zobaczysz:

```text
🌐 Tłumaczenie automatyczne: twój prompt → przetłumaczony prompt
```

To oznacza że system działa prawidłowo!
