# 🤖 System Automatyzacji i Deployment - MyBonzo

## 📋 Przegląd Systemu

System automatyzacji MyBonzo zapewnia pełne zarządzanie workflow, deployment i integrację z platformami Flowise i ActivePieces dla funkcji biznesowych AI.

**Data utworzenia:** 2 września 2025  
**Wersja:** 1.0.0  
**Status:** Production Ready ✅

---

## 🏗️ Architektura Systemu

### 🔑 Zarządzanie Kluczami API
- **Plik:** `src/utils/loadEnv.js`
- **Funkcja:** Centralny system zarządzania kluczami API
- **Obsługuje:** OpenAI, Flowise, ActivePieces, Cloudflare, Email, SMS

### 📦 Workflow JSON
- **Lokalizacja:** `workflows/`
- **Formaty:** Flowise i ActivePieces JSON
- **Funkcje:** Monitoring, Reminders, FAQ Generation

### 🚀 Deployment Scripts
- **Plik:** `scripts/deployWorkflows.js`
- **Funkcja:** Automatyczne wdrażanie workflow
- **Obsługuje:** Flowise i ActivePieces API

### ⚙️ CI/CD Pipeline
- **Plik:** `.github/workflows/deploy-mybonzo-automation.yml`
- **Platformy:** GitHub Actions
- **Funkcje:** Walidacja, Deploy, Weryfikacja

---

## 🔧 Komponenty Systemu

### 1. 📊 System Zarządzania Kluczami API

#### Plik: `src/utils/loadEnv.js`

**Funkcje:**
- Automatyczne wczytywanie zmiennych środowiskowych
- Walidacja wymaganych kluczy API
- Bezpieczny dostęp do konfiguracji
- Kompatybilność wsteczna

**Obsługiwane klucze:**
```javascript
- OPENAI_API_KEY
- FLOWISE_API_TOKEN  
- ACTIVEPIECES_API_KEY
- CLOUDFLARE_API_TOKEN
- EMAIL_API_KEY
- SMS_API_KEY
- GITHUB_TOKEN
- WEBHOOK_SECRET
```

**Przykład użycia:**
```javascript
import { API_KEYS, getApiKey } from './src/utils/loadEnv.js';
const openaiKey = getApiKey('OPENAI_API_KEY');
```

### 2. 🔄 Workflow JSON Templates

#### A. Flowise Monitoring (`workflows/flowise_monitoring_workflow.json`)

**Funkcje:**
- Odbieranie logów aktywności
- Klasyfikacja błędów (error/warning/info)
- Filtrowanie krytycznych błędów
- Alerty do ActivePieces

**Triggers:**
- Webhook: `/api/activity/log`
- Schedule: Co 30 minut

#### B. ActivePieces Reminders (`workflows/activepieces_reminders_workflow.json`)

**Funkcje:**
- Sprawdzanie przypomnień co 15 minut
- Wielokanałowe powiadomienia (Email, SMS, Push)
- Filtrowanie według preferencji użytkownika
- Cyberpunk styling w emailach

**Notifications:**
- 📧 Email z HTML template
- 📱 SMS z skróconym formatem
- 🔔 Push notifications z metadata

#### C. Flowise FAQ Generation (`workflows/flowise_faq_generation_workflow.json`)

**Funkcje:**
- Codzienne generowanie FAQ o 3:00
- Pobieranie bazy wiedzy
- AI generation z OpenAI GPT-4o-mini
- Automatyczne kategoryzowanie
- Zapisywanie do bazy danych

**AI Prompt:**
- Język: Polski
- Styl: Cyberpunk/futurystyczny
- Kategorie: General, Technical, Billing, Support
- Format: Strukturalny JSON

### 3. 🚀 Deployment Script

#### Plik: `scripts/deployWorkflows.js`

**Funkcje główne:**
- Automatyczne podmiana placeholderów API keys
- Deploy do Flowise i ActivePieces
- Error handling i retry logic
- Szczegółowe logi deployment

**Proces deployment:**
1. Wczytanie workflow JSON
2. Podmiana placeholderów `<API_KEY>`
3. HTTP POST do platform APIs
4. Weryfikacja i logging wyników

**Przykład uruchomienia:**
```bash
node scripts/deployWorkflows.js
```

### 4. ⚙️ CI/CD GitHub Actions

#### Plik: `.github/workflows/deploy-mybonzo-automation.yml`

**Jobs:**
1. **Validate** - Walidacja JSON i środowiska
2. **Deploy Workers** - Cloudflare Workers deployment
3. **Deploy Workflows** - Flowise/ActivePieces deployment
4. **Notify & Verify** - Powiadomienia i weryfikacja
5. **Cleanup** - Czyszczenie i metryki

**Triggers:**
- Push do `main` branch
- Pull request
- Manual dispatch z opcjami

**Environment Variables wymagane:**
```yaml
OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
FLOWISE_API_TOKEN: ${{ secrets.FLOWISE_API_TOKEN }}
ACTIVEPIECES_API_KEY: ${{ secrets.ACTIVEPIECES_API_KEY }}
CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 🚀 Instrukcja Wdrożenia

### 📋 Wymagania Wstępne

1. **Node.js 18+**
2. **npm lub yarn**
3. **Git repository z GitHub**
4. **Konta na platformach:**
   - OpenAI (API Key)
   - Flowise (API Token)
   - ActivePieces (API Key)
   - Cloudflare (API Token)

### 🔧 Konfiguracja Lokalna

1. **Skopiuj zmienne środowiskowe:**
```bash
cp .env.example .env
```

2. **Uzupełnij klucze API w `.env`:**
```bash
OPENAI_API_KEY=sk-...
FLOWISE_API_TOKEN=fl-...
ACTIVEPIECES_API_KEY=ap-...
CLOUDFLARE_API_TOKEN=cf-...
```

3. **Zainstaluj dependencies:**
```bash
npm install
npm install node-fetch dotenv
```

4. **Testuj system zarządzania kluczami:**
```bash
node -e "import('./src/utils/loadEnv.js').then(m => console.log('✅ API Keys loaded'))"
```

### 🚀 Deployment Lokalny

1. **Deploy wszystkich workflow:**
```bash
node scripts/deployWorkflows.js
```

2. **Deploy pojedynczego workflow:**
```bash
node -e "
import('./scripts/deployWorkflows.js').then(m => 
  m.deployWorkflow({
    file: 'flowise_monitoring_workflow.json',
    platform: 'flowise',
    name: 'Test Deploy'
  })
)"
```

### ☁️ CI/CD Deployment

1. **Skonfiguruj GitHub Secrets:**
   - `OPENAI_API_KEY`
   - `FLOWISE_API_TOKEN`
   - `ACTIVEPIECES_API_KEY`
   - `CLOUDFLARE_API_TOKEN`
   - `DISCORD_WEBHOOK_URL` (opcjonalnie)

2. **Push do main branch:**
```bash
git add .
git commit -m "feat: deploy automation system"
git push origin main
```

3. **Manual deployment:**
   - Idź do GitHub Actions
   - Wybierz "MyBonzo Automation Deployment"
   - Kliknij "Run workflow"
   - Wybierz opcje deployment

---

## 🔍 Monitoring i Debugging

### 📊 Logi i Metryki

**Deployment logs:**
- GitHub Actions: Szczegółowe logi każdego kroku
- Local deployment: Console output z kolorowym formatowaniem

**Verification endpoints:**
- `https://api.mybonzo.com/api/activity-monitor` - Activity monitoring
- `https://api.mybonzo.com/api/reminders` - Reminders system
- `https://api.mybonzo.com/api/faq-generator` - FAQ generation

### 🐛 Typowe Problemy

#### 1. Błędy kluczy API
```
❌ Błąd: Klucz API 'OPENAI_API_KEY' nie został skonfigurowany
```
**Rozwiązanie:** Sprawdź `.env` i GitHub Secrets

#### 2. Błędy network timeout
```
❌ Flowise deployment: HTTP timeout
```
**Rozwiązanie:** Sprawdź connectivity i zwiększ timeout

#### 3. Błędy JSON validation
```
❌ workflows/file.json is invalid JSON
```
**Rozwiązanie:** Waliduj JSON za pomocą `jsonlint` lub IDE

#### 4. Błędy platformy API
```
❌ HTTP 401: Unauthorized  
```
**Rozwiązanie:** Sprawdź poprawność API keys i endpoints

---

## 🔧 Customizacja i Rozszerzenia

### 🎨 Dodawanie Nowych Workflow

1. **Stwórz JSON file w `workflows/`:**
```json
{
  "name": "New Workflow",
  "version": "1.0.0",
  "nodes": [...],
  "connections": {...}
}
```

2. **Dodaj do listy w `scripts/deployWorkflows.js`:**
```javascript
const WORKFLOWS = [
  // existing workflows...
  {
    file: 'new_workflow.json',
    platform: 'flowise', // lub 'activepieces'
    name: 'New Workflow',
    description: 'Opis nowego workflow'
  }
];
```

### 🔌 Dodawanie Nowych Platform

1. **Rozszerz `DEPLOYMENT_CONFIG` w `scripts/deployWorkflows.js`**
2. **Dodaj funkcję deployment dla nowej platformy**
3. **Aktualizuj CI/CD workflow**

### 📧 Customizacja Powiadomień

**Email templates w ActivePieces:**
```html
<div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
           padding: 20px; border-radius: 10px; color: white;'>
  <h2 style='color: #00ffff;'>📅 MyBonzo Notification</h2>
  <!-- Custom content -->
</div>
```

**Discord webhooks:**
- Skonfiguruj `DISCORD_WEBHOOK_URL` w GitHub Secrets
- Format: Rich embeds z kolorami i polami

---

## 📈 Roadmap i Przyszłe Funkcje

### 🎯 Wersja 1.1.0
- [ ] Dashboard zarządzania workflow
- [ ] Realtime monitoring
- [ ] Advanced retry logic
- [ ] Metrics collection

### 🎯 Wersja 1.2.0
- [ ] Slack integration
- [ ] Teams integration
- [ ] A/B testing workflow
- [ ] Performance analytics

### 🎯 Wersja 2.0.0
- [ ] Web UI dla zarządzania
- [ ] Database persistence
- [ ] User management
- [ ] Advanced security

---

## 🆘 Support i Troubleshooting

### 📞 Kontakt
- **GitHub Issues:** Dla bugów i feature requests
- **Discord:** Community support
- **Email:** admin@mybonzo.com

### 🔧 Debug Commands

**Test API connectivity:**
```bash
curl -H "Authorization: Bearer $FLOWISE_API_TOKEN" \
     https://api.flowise.com/api/v1/chatflows
```

**Validate JSON:**
```bash
for file in workflows/*.json; do
  echo "Validating $file"
  cat "$file" | jq empty
done
```

**Test local deployment:**
```bash
DEBUG=true node scripts/deployWorkflows.js
```

---

## 📜 Historia Zmian

### v1.0.0 (2 września 2025)
- ✅ Inicjalna implementacja systemu
- ✅ Flowise monitoring workflow
- ✅ ActivePieces reminders system
- ✅ FAQ generation z AI
- ✅ GitHub Actions CI/CD
- ✅ Kompletna dokumentacja

---

**Status:** Production Ready ✅  
**Autor:** MyBonzo Development Team  
**Ostatnia aktualizacja:** 2 września 2025
