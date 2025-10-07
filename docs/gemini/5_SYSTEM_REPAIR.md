# MyBonzo System Repair Template

## 🚨 CRITICAL SYSTEM REPAIR MISSION

### Użycie

```powershell
.\gemini-mybonzo.ps1 full-system-repair
# lub
gm-repair
```

### Cel

Kompleksowa naprawa całego systemu MyBonzo z integracją BigQuery, naprawą wszystkich API i weryfikacją funkcjonalności przycisków na wszystkich stronach.

## 📋 CHECKLIST NAPRAWY

### ✅ Phase 1: API Infrastructure

- [ ] Test wszystkich istniejących API endpoints
- [ ] Napraw błędy w `/api/test-tavily`
- [ ] Napraw błędy w `/api/test-deepseek`
- [ ] Napraw błędy w `/api/test-kaggle`
- [ ] Dodaj monitoring do każdego API
- [ ] Implementuj standardized error handling

### ✅ Phase 2: BigQuery Integration

- [ ] Setup Google Cloud credentials
- [ ] Create BigQuery dataset: `mybonzo_analytics`
- [ ] Create tables: `api_calls`, `search_queries`, `ai_interactions`
- [ ] Implement data sync from all APIs
- [ ] Create real-time dashboard
- [ ] Add backup & recovery

### ✅ Phase 3: Button Testing

- [ ] Test każdy przycisk na stronie głównej
- [ ] Test wszystkie przyciski w panelach agentów
- [ ] Sprawdź floating action buttons
- [ ] Zweryfikuj modal dialogs
- [ ] Test form submissions
- [ ] Sprawdź loading states i error handling

### ✅ Phase 4: Real Data Implementation

- [ ] Usuń wszystkie mock/fake data
- [ ] Podłącz prawdziwe API responses
- [ ] Implementuj live search results
- [ ] Dodaj real-time metrics
- [ ] Setup user interaction tracking

### ✅ Phase 5: Performance & Monitoring

- [ ] Implement health checks
- [ ] Add performance monitoring
- [ ] Create error tracking
- [ ] Setup alerts system
- [ ] Optimize response times

## 🔧 KLUCZOWE PLIKI DO NAPRAWY

### API Endpoints

```
src/pages/api/test-tavily.ts
src/pages/api/test-deepseek.ts
src/pages/api/test-kaggle.ts
src/pages/api/health-check.ts
src/pages/api/status-check.ts
```

### Frontend Components

```
src/components/agents/modules/agent-01-polaczek/
src/components/agents/modules/agent-02-tavily/
src/components/agents/modules/agent-03-deepseek/
src/components/agents/modules/agent-04-kaggle/
```

### Configuration Files

```
astro.config.mjs
wrangler-*.toml
package.json
tsconfig.json
```

## 🎯 SUCCESS METRICS

1. **API Health**: Wszystkie endpointy return 200 OK
2. **Button Functionality**: 100% przycisków działa poprawnie
3. **Real Data**: Zero fake/mock responses
4. **Performance**: Response time < 2s dla wszystkich API
5. **BigQuery**: Successful data sync z wszystkich źródeł
6. **Error Rate**: < 1% błędów w production

## ⚡ QUICK COMMANDS

```powershell
# Test API po naprawie
curl "http://localhost:4321/api/test-tavily"
curl "http://localhost:4321/api/health-check"

# Test przycisków w przeglądarce
Start-Process "http://localhost:4321"

# Deploy po naprawie
.\deploy-to-production.ps1
```

## 🚨 UWAGI BEZPIECZEŃSTWA

- Wszystkie API keys muszą być w Cloudflare secrets
- Environment variables nie mogą być hardcoded
- Error handling nie może ujawniać sensitive data
- BigQuery access tylko przez authenticated endpoints
- Rate limiting dla wszystkich public APIs

---

**PAMIĘTAJ**: To jest production system. Wszystkie zmiany muszą być dokładnie przetestowane przed deploymentem!