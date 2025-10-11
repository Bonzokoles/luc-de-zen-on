# MYBONZO PROJECT - AGENT BRIEFING
**INSTRUKCJA DLA AI AGENTA - PRZECZYTAJ TO PIERWSZE!**

## 🏗️ ARCHITEKTURA PROJEKTU

### Repozytoria i Środowiska
```
DEVELOPMENT REPO: luc-de-zen-on
├── GitHub: Bonzokoles/luc-de-zen-on
├── Domain: luc-de-zen-on.pages.dev
├── Latest Deploy: https://70b5b004.luc-de-zen-on.pages.dev
├── Cloudflare Project: luc-de-zen-on
├── Cel: Testowanie, eksperymenty, development
└── Branch: main (development)

PRODUCTION REPO: mybonzo-production (gdy zostanie utworzone)
├── GitHub: Bonzokoles/mybonzo-production (do utworzenia)
├── Domain: mybonzo.com, www.mybonzo.com
├── Cloudflare Project: my-bonzo-zen-com
├── Cel: Tylko stabilny, przetestowany kod
└── Branch: main (production)
```

### Kluczowe Ścieżki
- **Development**: `Q:\mybonzo\luc-de-zen-on\` (obecny workspace)
- **Production**: `Q:\mybonzo\mybonzo-production\` (do utworzenia)
- **Dokumentacja**: `Q:\mybonzo\DOCUMENTATION\`

## 🚀 WORKFLOW DEPLOYMENT

### 1. Development (Codzienne)
```bash
cd Q:\mybonzo\luc-de-zen-on
# Praca, testy, eksperymenty
pnpm dev
git commit & push
# Test na luc-de-zen-on.pages.dev
```

### 2. Production Deploy (Tylko sprawdzone!)
```powershell
# W development repo:
.\deploy-to-production.ps1

# Lub:
.\quick-sync.ps1  # tylko build check
```

### 3. Cloudflare Projekty
- **luc-de-zen-on**: Development auto-deploy z GitHub
- **my-bonzo-zen-com**: Production manual deploy ze skryptu

## ⚡ RECENT COMPLETION (26.09.2025)

### ✅ Wykonane Dzisiaj
1. **DEEPSEEK_API_KEY** dodany do my-bonzo-zen-com secrets
2. **Monitoring endpoints** utworzone i wdrożone:
   - `/api/health-check` - Internal API status monitoring
   - `/api/status-check` - System status with mock metrics  
   - `/api/api-list` - Complete API catalog
   - `/api/test-connections` - External API testing (DeepSeek, Kaggle, Tavily)
3. **Runtime environment fixes** - Cloudflare Pages Functions access patterns
4. **Enhanced admin dashboard** - Integrated with monitoring
5. **Production branch** poprawiony z backup-total-25-09-2025 na main
6. **Deployment pipeline** działający na mybonzo.com

### 🛠️ Tech Stack
- **Frontend**: Astro + React/JSX + Tailwind CSS
- **Backend**: Cloudflare Pages Functions (Node.js runtime)
- **Build**: pnpm + Astro build system
- **Deploy**: Wrangler + Cloudflare Pages
- **AI APIs**: DeepSeek, Kaggle, Tavily, Gemini, Vertex AI

## 🔧 CRITICAL FILES & PATTERNS

### Deployment Scripts
- `deploy-to-production.ps1` - Full production deployment
- `quick-sync.ps1` - Build validation before deploy
- `DEVELOPMENT_WORKFLOW_GUIDE.md` - Team documentation

### Environment Access Pattern
```javascript
// Cloudflare Pages Functions runtime secrets
const apiKey = (locals as any)?.runtime?.env?.DEEPSEEK_API_KEY;
// NOT: import.meta.env.DEEPSEEK_API_KEY (build-time only)
```

### Build Commands
```bash
pnpm build      # Full build
pnpm dev        # Development server
wrangler dev    # Local Cloudflare Pages testing
```

## 🚨 IMPORTANT RULES

### Production Safety
- **NIGDY** nie commit bezpośrednio do production repo
- **ZAWSZE** test na development przed production
- **TYLKO** działające funkcje idą na production
- **BACKUP** - production to zawsze ostatnia stabilna wersja

### Development Practice
- Wszystkie zmiany w `luc-de-zen-on`
- Test na `luc-de-zen-on.pages.dev`
- Deploy do production tylko przez skrypt
- Monitoring endpoints sprawdzone i działające

## 🎯 IMMEDIATE STATUS

**WSZYSTKO DZIAŁA POPRAWNIE!**
- ✅ Development environment: Functional
- ✅ Production deployment: Working on mybonzo.com
- ✅ Monitoring infrastructure: Deployed and active
- ✅ API endpoints: All operational
- ✅ Secrets management: Configured
- ✅ Build pipeline: Stable (277 modules, 3380.46 KiB)

## 📋 NEXT ACTIONS

Gdy user pyta o kolejne kroki:
1. Testuj nowe funkcje na development
2. Używaj `.\quick-sync.ps1` do walidacji
3. Deploy do production tylko gdy pewny
4. Monitoruj przez dashboard na mybonzo.com/admin

## 🎉 LAST DEPLOYMENT STATUS - 12.10.2025

✅ **SUKCES DEPLOYMENT!**
- **URL**: https://70b5b004.luc-de-zen-on.pages.dev
- **Build**: 277 modułów, 405 plików (4159.56 KiB)
- **Status**: Wszystkie API działają poprawnie

### Naprawione funkcjonalności:
- ✅ **Generator obrazów**: Dodano sekcję wyników z display obszarem
- ✅ **DeepSeek API**: Nowy klucz sk-5d380c2069644993956391547baa96d4, konto zasilone
- ✅ **API Endpoints**: Wszystkie dodane do PUBLIC_PATHS w middleware 
- ✅ **Zmienne środowiskowe**: Naprawiono ładowanie z .dev.vars w Cloudflare Pages
- ✅ **Tavily/Kaggle API**: Potwierdzono działanie na produkcji

### Test production API:
```bash
curl -X POST "https://70b5b004.luc-de-zen-on.pages.dev/api/test-connections" \
  -H "Content-Type: application/json" -d "{}"
# Wynik: DeepSeek ✅, Kaggle ✅, Tavily ✅
```

**AGENT: Użyj tej instrukcji jako kompletnego kontekstu. Nie pytaj o podstawy - działaj na bazie tego briefingu!**
