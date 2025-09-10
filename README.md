# 🚀 MyBonzo AI Platform - Zaawansowana Platforma AI

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Bonzokoles/luc-de-zen-on)

![MyBonzo Platform](https://github.com/user-attachments/assets/b1b8ed1c-4575-452d-8420-36b0d46b31bb)

<!-- dash-content-start -->

**MyBonzo** to nowoczesna platforma AI zbudowana w Astro z integracją Cloudflare Workers, oferująca kompleksowy ekosystem narzędzi sztucznej inteligencji z panelem administracyjnym i systemem wildcards.

![Platform Features](https://github.com/user-attachments/assets/041b2062-094e-483e-b37c-ccca537eeddc)

## 🎯 Najważniejsze funkcje

### 🤖 **AI Ecosystem**
- ✅ **8 AI Workers**: OpenAI, Anthropic, DeepSeek, Perplexity, Google AI, HuggingFace, ElevenLabs
- ✅ **Multi-Modal AI**: Tekst, obraz, głos, analiza danych
- ✅ **Cloudflare AI Gateway**: Monitorowanie, cache'owanie, jednolity dostęp
- ✅ **Real-time Processing**: Natychmiastowe odpowiedzi AI

### 🎨 **Advanced Features**
- ✅ **Wildcards System**: Inteligentne rozszerzanie promptów (833+ style artystyczne)
- ✅ **Voice AI**: Bielik ENON, voice cloning, multi-lingual support
- ✅ **Image Generation**: Stable Diffusion, DALL-E, Midjourney integration
- ✅ **Data Analytics**: BigQuery, automated reporting, business intelligence

### 🛠️ **Developer Experience**
- ✅ **Astro 5.13+**: Najnowsza wersja z pełną integracją React/Svelte
- ✅ **TypeScript**: Pełne type safety i IntelliSense
- ✅ **Cloudflare Workers**: Serverless functions z KV storage
- ✅ **Streamline Icons**: SVG icons dla lepszej wydajności

### 🔒 **Security & Performance**
- ✅ **100/100 Lighthouse**: Optymalna wydajność i SEO
- ✅ **Cloudflare Protection**: DDoS, WAF, rate limiting
- ✅ **Automated Security Audits**: Regularne skanowanie luk bezpieczeństwa
- ✅ **Branch Protection**: GitHub workflow z automatycznymi testami

<!-- dash-content-end -->

## 📦 Instalacja i uruchomienie

Wszystkie polecenia uruchamiaj w katalogu głównym projektu:

### Wymagania systemowe
```bash
Node.js: v18+ lub wyższy
npm/pnpm: v8+ lub wyższy
Git: najnowsza wersja
Cloudflare Account: do deploymentu Workers
```

### Szybka instalacja
```bash
# 1. Zainstaluj zależności
pnpm install

# 2. Skonfiguruj środowisko (opcjonalne)
cp .env.example .env
# Uzupełnij klucze API w .env

# 3. Uruchom serwer deweloperski
pnpm dev

# 4. Otwórz w przeglądarce
# http://localhost:4321
```

### Budowanie i wdrażanie
```bash
# Build produkcyjny
pnpm build

# Podgląd lokalny
pnpm preview

# Wdrożenie na Cloudflare
pnpm deploy
```

## 🏗️ Architektura systemu

```
T:\LUC_de_ZEN_ON\LUCK_the_ZE_non_HUB\
├── src/
│   ├── pages/                      # Astro pages + API routes
│   │   ├── api/                   # API endpoints (/api/*)
│   │   │   ├── admin/            # Admin API
│   │   │   ├── enhance-prompt.ts # Wildcards API
│   │   │   ├── generate-image.ts # Image Generator
│   │   │   └── chat.ts           # Chat API
│   │   ├── admin.astro           # Admin Dashboard
│   │   ├── image-generator.astro # Image Generator UI
│   │   └── voice-avatar-new.astro # Voice AI Interface
│   ├── components/                # Reusable components
│   │   ├── admin/                # Admin React components
│   │   └── PromptEnhancerClean.tsx # Wildcards UI
│   ├── workers/                   # Cloudflare Workers
│   │   ├── ai-bot-worker.ts      # AI Bot Worker
│   │   ├── enhanced-ai-worker.ts # Enhanced AI Worker
│   │   └── deepseek-worker.ts    # DeepSeek Worker
│   └── layouts/                   # Astro layouts
├── Documentation/                 # Technical documentation
├── DOC_mentacja/                  # User guides & reports
├── Dodatki do strony/            # Additional features
└── .github/                       # GitHub workflows & config
```

## 🎮 Dostępne narzędzia AI

### **Chat & Conversation**
- **OpenAI GPT-4**: Zaawansowane rozmowy i rozumowanie
- **Anthropic Claude**: Bezpieczna i etyczna AI
- **DeepSeek**: Specjalista od kodowania i analizy technicznej

### **Voice & Audio**
- **Bielik ENON**: Polski model językowy
- **ElevenLabs**: Text-to-speech z klonowaniem głosu
- **Voice Cloning**: Tworzenie własnych avatarów głosowych

### **Image & Visual**
- **Stable Diffusion**: Generowanie obrazów
- **DALL-E**: Kreacja wizualna
- **Midjourney**: Artystyczne obrazy

### **Data & Analytics**
- **BigQuery**: Analiza danych biznesowych
- **Tavily**: Wyszukiwanie w czasie rzeczywistym
- **Kaggle**: Nauka danych i machine learning

## 🔧 Workflow developmentu

### **Branch Strategy**
```
main (produkcja)
├── develop (staging)
│   ├── feature/nazwa-funkcji
│   ├── hotfix/krytyczna-naprawa
│   └── bugfix/naprawa-błędu
```

### **GitHub Actions**
- ✅ **CI/CD Pipeline**: Automatyczne testy i deployment
- ✅ **Security Scanning**: Trivy vulnerability scanning
- ✅ **Branch Protection**: Wymagane reviews i testy
- ✅ **Preview Deployments**: Testowanie feature branchy

### **Quality Assurance**
- ✅ **ESLint + Prettier**: Code formatting i linting
- ✅ **TypeScript**: Type checking
- ✅ **Unit Tests**: Automated testing
- ✅ **Performance Monitoring**: Lighthouse CI

## 📚 Dokumentacja

### **Dla użytkowników**
- [Instrukcja uruchomienia](DOC_mentacja/QUICK_START_GUIDE.md)
- [Podręcznik użytkownika](DOC_mentacja/INSTRUKCJE_UZYTKOWNIKA.md)
- [FAQ](DOC_mentacja/FAQ.md)

### **Dla developerów**
- [Architektura systemu](Documentation/MYBONZO_COMPLETE_DOCUMENTATION.md)
- [AI Workers Ecosystem](Documentation/AI_WORKERS_ECOSYSTEM_DOCUMENTATION.md)
- [Workflow automatyzacji](Documentation/WORKFLOW_AUTOMATION_GUIDE.md)

### **Bezpieczeństwo**
- [Polityka bezpieczeństwa](SECURITY.md)
- [Konfiguracja Cloudflare Secrets](.github/CLOUDFLARE_SECRETS_SETUP.md)
- [Branch Protection Setup](.github/BRANCH_PROTECTION_SETUP.md)

## 🚀 Wdrożenie produkcyjne

### **Cloudflare Pages + Workers**
```bash
# Deploy strony
pnpm build && pnpm deploy

# Deploy workerów
npx wrangler deploy --config wrangler-*.toml
```

### **Environment Variables**
```bash
# Produkcja
CLOUDFLARE_API_TOKEN=your_prod_token
CLOUDFLARE_ACCOUNT_ID=your_prod_account

# Development
CLOUDFLARE_API_TOKEN=your_dev_token
CLOUDFLARE_ACCOUNT_ID=your_dev_account
```

## 🧞 Polecenia

| Polecenie                   | Akcja                                            |
| :-------------------------- | :----------------------------------------------- |
| `pnpm install`              | Instaluje zależności                            |
| `pnpm dev`                  | Uruchamia dev server na `localhost:4321`        |
| `pnpm build`                | Buduje wersję produkcyjną                       |
| `pnpm preview`              | Podgląd buildu lokalnie                         |
| `pnpm deploy`               | Wdrożenie na Cloudflare Pages                   |
| `pnpm cf-typegen`           | Generuje typy dla Cloudflare Workers            |
| `node scripts/test-all.js`  | Testuje wszystkie API endpoints                 |

## 📊 Status systemu

- ✅ **Astro 5.13+**: Najnowsza stabilna wersja
- ✅ **TypeScript 5.x**: Pełne type safety
- ✅ **Cloudflare Workers**: Serverless functions
- ✅ **8 AI Providers**: Kompletny ekosystem AI
- ✅ **Security Audits**: Automated scanning
- ✅ **Performance**: 100/100 Lighthouse score

## 🤝 Współpraca

Projekt jest otwarty na współpracę! Zobacz nasze:
- [CONTRIBUTING.md](CONTRIBUTING.md) - Jak współtworzyć
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Kodeks postępowania
- [Issues](https://github.com/Bonzokoles/luc-de-zen-on/issues) - Zgłaszanie problemów

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT - zobacz plik [LICENSE](LICENSE) po więcej szczegółów.

---

**MyBonzo AI Platform** - Przyszłość interakcji człowiek-AI 🤖✨
