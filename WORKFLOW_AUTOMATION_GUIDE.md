# MyBonzo Workflow Automation - Configuration Guide

## 🚀 Przegląd systemu

System MyBonzo wykorzystuje następujące narzędzia automatyzacji:
- **Flowise**: Wizualne tworzenie workflow AI
- **ActivePieces**: Zaawansowana automatyzacja procesów  
- **Cloudflare Workers**: Backend dla AI funkcji
- **Local APIs**: Monitoring, przypomnienia, FAQ, BIELIK

## 📋 Wymagane klucze API

```env
# .env configuration
FLOWISE_API_TOKEN=your_flowise_token_here
ACTIVEPIECES_API_KEY=your_activepieces_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# URLs (opcjonalne - domyślne)
FLOWISE_API_URL=https://api.flowise.com/api/v1
ACTIVEPIECES_API_URL=https://api.activepieces.com/api/v1
```

## 🛠️ Dostępne skrypty

### 1. Deployment workflow
```bash
node scripts/deployWorkflows.js
```
- Wdraża wszystkie workflow do Flowise i ActivePieces
- Automatycznie podstawia klucze API
- Weryfikuje poprawność konfiguracji

### 2. Monitoring systemu  
```bash
node scripts/monitorWorkflows.js
```
- Sprawdza status wszystkich API endpoints
- Testuje Cloudflare Workers
- Generuje raporty monitoringu

### 3. Test workflow (development)
```bash
npm run test:workflows
```
- Uruchamia testy jednostkowe workflow
- Symuluje przepływ danych
- Weryfikuje integracje

## 📊 Zaimplementowane workflow

### Flowise Workflows
1. **Activity Monitor - Error Detection**
   - Plik: `workflows/flowise/flowise_monitoring_workflow.json`
   - Funkcja: Monitorowanie błędów i alerty
   - API: `/api/activity-monitor`

2. **Automated FAQ Generation**
   - Plik: `workflows/flowise/flowise_faq_generation_workflow.json` 
   - Funkcja: Automatyczne generowanie FAQ z AI
   - API: `/api/faq-generator`

### ActivePieces Workflows
1. **Smart Reminders Notification**
   - Plik: `workflows/activepieces/activepieces_reminders_workflow.json`
   - Funkcja: Wielokanałowe powiadomienia
   - API: `/api/reminders`

2. **AI Ticket Assignment System**
   - Plik: `workflows/activepieces/activepieces_ticket_assignment_workflow.json`
   - Funkcja: Automatyczne przypisywanie zgłoszeń
   - Integration: z systemem FAQ i monitoring

## 🔗 Istniejące API Endpoints

### Local Development (localhost:4321)
- `GET /api/activity-monitor` - Status aktywności
- `POST /api/reminders` - Zarządzanie przypomnieniami  
- `POST /api/faq-generator` - Generowanie FAQ
- `POST /api/bielik-chat` - Chat z AI BIELIK

### Production (mybonzo.pl)
- Wszystkie powyższe endpoints dostępne w produkcji

### Cloudflare Workers
- `POST https://bielik-worker.stolarnia-ams.workers.dev/api/chat` - BIELIK AI

## 🎯 Komponenty frontend

### Svelte Components (src/components/)
- `ActivityDashboard.svelte` - Dashboard aktywności
- `RemindersManager.svelte` - Menedżer przypomnień
- `FAQGeneratorWidget.svelte` - Widget FAQ

### Astro Pages (src/pages/)  
- `index.astro` - Główna strona z "ZAAWANSOWANE FUNKCJE AI"
- `bielik-enon-dev.astro` - Interface deweloperski BIELIK

## 🚨 Troubleshooting

### Problemy z deployment
1. Sprawdź klucze API w `.env`
2. Uruchom `node scripts/monitorWorkflows.js`
3. Sprawdź logi w `monitoring/reports/`

### Błędy workflow
1. Zweryfikuj JSON pliki w `workflows/`
2. Sprawdź connectivity do platform
3. Sprawdź limity API rate

### Problemy z API
1. Upewnij się że dev server działa (`npm run dev`)
2. Sprawdź CORS configuration
3. Zweryfikuj Cloudflare Workers deployment

## 📈 Monitoring

System automatycznie generuje raporty:
- `monitoring/reports/check-[timestamp].json` - Szczegółowe raporty
- Logi w konsoli podczas uruchamiania skryptów
- Error tracking przez Activity Monitor API

## 🔄 Następne kroki

1. **Skonfiguruj klucze API** w pliku `.env`
2. **Uruchom deployment**: `node scripts/deployWorkflows.js`
3. **Sprawdź status**: `node scripts/monitorWorkflows.js`
4. **Przetestuj funkcje** na stronie głównej
5. **Monitoruj działanie** przez dashboard aktywności

## 📞 Support

W przypadku problemów:
1. Sprawdź logi w `monitoring/reports/`
2. Uruchom testy workflow
3. Sprawdź dokumentację platform (Flowise/ActivePieces)
4. Zweryfikuj konfigurację Cloudflare Workers
