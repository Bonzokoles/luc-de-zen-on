# 📋 ADMIN DASHBOARD - MAPOWANIE FUNKCJI I PLIKÓW

**Status**: ✅ KOMPLETNY  
**Wersja**: 2.1.0  
**Ostatnia aktualizacja**: 10.10.2025

---

## 🗂️ MAPA STRUKTURY ADMIN DASHBOARD

### 📁 **Komponenty React/Svelte** `/src/components/admin/`

| Plik                           | Linie | Funkcja                              | Status     |
| ------------------------------ | ----- | ------------------------------------ | ---------- |
| `AdminDashboard.tsx`           | 898   | Główny dashboard z uwierzytelnianiem | ✅ AKTYWNY |
| `PolaczekDyrektorPanel.svelte` | 150   | Panel zarządzania agentami POLACZEK  | ✅ AKTYWNY |
| `ConfigurationManager.svelte`  | ~200  | Zarządzanie konfiguracją systemu     | ✅ AKTYWNY |
| `WorkersStatusDashboard.tsx`   | ~300  | Dashboard statusu Cloudflare Workers | ✅ AKTYWNY |
| `MCPServersPanel.tsx`          | ~250  | Panel serwerów MCP                   | ✅ AKTYWNY |
| `PanelStats.tsx`               | ~150  | Statystyki i metryki panelu          | ✅ AKTYWNY |
| `StatusBox.tsx`                | ~100  | Real-time status systemu             | ✅ AKTYWNY |
| `TrafficChart.tsx`             | ~200  | Wykresy ruchu i analytics            | ✅ AKTYWNY |
| `TicketsTable.tsx`             | ~180  | Tabela zgłoszeń/ticketów             | ✅ AKTYWNY |
| `UsersTable.tsx`               | ~220  | Zarządzanie użytkownikami            | ✅ AKTYWNY |

### 📁 **Strony Administracyjne** `/src/pages/admin/`

| Plik                          | Funkcja                        | URL                            | Status     |
| ----------------------------- | ------------------------------ | ------------------------------ | ---------- |
| `index.astro`                 | Centrum administracyjne (hub)  | `/admin/`                      | ✅ AKTYWNY |
| `dashboard.astro`             | Główny dashboard               | `/admin/dashboard`             | ✅ AKTYWNY |
| `login.astro`                 | Panel logowania admin          | `/admin/login`                 | ✅ AKTYWNY |
| `polish-mega-pro-admin.astro` | Rozszerzony panel admin PL     | `/admin/polish-mega-pro-admin` | ✅ AKTYWNY |
| `workers-status-panel.astro`  | Status Cloudflare Workers      | `/admin/workers-status-panel`  | ✅ AKTYWNY |
| `api-tests-panel.astro`       | Panel testowania API endpoints | `/admin/api-tests-panel`       | ✅ AKTYWNY |
| `monitoring.astro`            | Monitorowanie systemu          | `/admin/monitoring`            | ✅ AKTYWNY |
| `users.astro`                 | Zarządzanie użytkownikami      | `/admin/users`                 | ✅ AKTYWNY |
| `security.astro`              | Panel bezpieczeństwa           | `/admin/security`              | ✅ AKTYWNY |
| `configuration.astro`         | Konfiguracja systemu           | `/admin/configuration`         | ✅ AKTYWNY |
| `ai-models.astro`             | Zarządzanie modelami AI        | `/admin/ai-models`             | ✅ AKTYWNY |
| `ai-search-panel.astro`       | Panel wyszukiwania AI          | `/admin/ai-search-panel`       | ✅ AKTYWNY |
| `sales-dashboard.astro`       | Dashboard sprzedaży            | `/admin/sales-dashboard`       | ✅ AKTYWNY |
| `polaczek-management.astro`   | Zarządzanie POLACZEK           | `/admin/polaczek-management`   | ✅ AKTYWNY |

### 📁 **API Endpoints** `/src/pages/api/admin/`

| Endpoint               | HTTP                | Funkcja                                  | Status     |
| ---------------------- | ------------------- | ---------------------------------------- | ---------- |
| `control.ts`           | GET/POST            | Główne API kontroli systemu (600+ linii) | ✅ AKTYWNY |
| `auth.ts`              | POST                | Uwierzytelnianie administratorów         | ✅ AKTYWNY |
| `monitoring.ts`        | GET                 | Monitorowanie systemu i metryki          | ✅ AKTYWNY |
| `workers-status.ts`    | GET/POST            | Status i zarządzanie Workers             | ✅ AKTYWNY |
| `users.ts`             | GET/POST/PUT/DELETE | Zarządzanie użytkownikami                | ✅ AKTYWNY |
| `stats.ts`             | GET                 | Statystyki systemu                       | ✅ AKTYWNY |
| `backup.ts`            | POST                | System backupów                          | ✅ AKTYWNY |
| `deploy.ts`            | POST                | Zarządzanie deploymentami                | ✅ AKTYWNY |
| `analytics.ts`         | GET                 | Analityka i metryki                      | ✅ AKTYWNY |
| `alerts.ts`            | GET/POST            | System alertów                           | ✅ AKTYWNY |
| `logs.ts`              | GET                 | Zarządzanie logami                       | ✅ AKTYWNY |
| `queries.ts`           | POST                | Zapytania do bazy danych                 | ✅ AKTYWNY |
| `chat.ts`              | POST                | Chat administracyjny                     | ✅ AKTYWNY |
| `workers.ts`           | GET/POST            | Zarządzanie Workers                      | ✅ AKTYWNY |
| `tickets.ts`           | GET/POST/PUT        | System ticketów/zgłoszeń                 | ✅ AKTYWNY |
| `sales-data-import.ts` | POST                | Import danych sprzedaży                  | ✅ AKTYWNY |

---

## 🔗 **MAPOWANIE FUNKCJI → PLIKI**

### 🔐 **Uwierzytelnianie i Autoryzacja**

```
Login Flow:
/admin/login.astro → /api/admin/auth.ts → AuthService (utils/auth.ts)
Dashboard Security: AdminDashboard.tsx → AuthService verification
Session Management: localStorage + JWT tokens
```

### 📊 **Dashboard i Monitoring**

```
Main Dashboard:
/admin/dashboard.astro → PolaczekDyrektorPanel.svelte
Real-time Stats: PanelStats.tsx + StatusBox.tsx
System Health: /api/admin/monitoring.ts → TrafficChart.tsx
```

### 🤖 **Zarządzanie Agentami POLACZEK**

```
Agent Management:
PolaczekDyrektorPanel.svelte → /api/polaczek-agents
Agent Configuration: ConfigurationManager.svelte
Status Monitoring: /api/admin/stats.ts
```

### ⚙️ **Workers Management**

```
Workers Dashboard:
/admin/workers-status-panel.astro → WorkersStatusDashboard.tsx
Workers API: /api/admin/workers-status.ts
Deploy Control: /api/admin/deploy.ts
```

### 🛡️ **Bezpieczeństwo**

```
Security Panel:
/admin/security.astro → /api/admin/monitoring.ts
Threat Detection: /api/admin/alerts.ts
Audit Logs: /api/admin/logs.ts
```

### 📈 **Analityka i Raporty**

```
Analytics Dashboard:
/admin/sales-dashboard.astro → /api/admin/analytics.ts
Data Import: /api/admin/sales-data-import.ts
Traffic Analysis: TrafficChart.tsx → /api/admin/stats.ts
```

---

## 🎯 **KLUCZOWE FUNKCJONALNOŚCI**

### **1. System Uwierzytelniania**

- **Pliki**: `AdminDashboard.tsx`, `/api/admin/auth.ts`, `utils/auth.ts`
- **Funkcje**: JWT tokens, role-based access, session management
- **Security**: Password hashing, token expiration, activity tracking

### **2. Real-time Monitoring**

- **Pliki**: `StatusBox.tsx`, `PanelStats.tsx`, `/api/admin/monitoring.ts`
- **Funkcje**: System health, performance metrics, alert system
- **Data**: CPU/RAM usage, API response times, error rates

### **3. Workers Management**

- **Pliki**: `WorkersStatusDashboard.tsx`, `/api/admin/workers-status.ts`
- **Funkcje**: Deploy control, status monitoring, log analysis
- **Integration**: Cloudflare Workers API, deployment pipelines

### **4. POLACZEK Agents**

- **Pliki**: `PolaczekDyrektorPanel.svelte`, `/api/polaczek-agents`
- **Funkcje**: Agent CRUD, status control, performance tracking
- **Types**: T(Tłumacz), M(Music), D(Dashboard), B(Bibliotekarz)

### **5. User Management**

- **Pliki**: `UsersTable.tsx`, `/api/admin/users.ts`
- **Funkcje**: User CRUD, role assignment, activity tracking
- **Permissions**: Admin, moderator, user role hierarchy

---

## 🚀 **FLOW DZIAŁANIA SYSTEMU**

### **Startup Sequence**

```
1. AdminDashboard.tsx mount → Check localStorage token
2. AuthService.verifyToken() → Validate JWT
3. Load user permissions → Render appropriate UI
4. Initialize real-time monitoring → StatusBox.tsx
5. Fetch system stats → PanelStats.tsx
```

### **Admin Login Flow**

```
1. /admin/login.astro → Login form
2. POST /api/admin/auth.ts → Validate credentials
3. Generate JWT token → Store in localStorage
4. Redirect to /admin/dashboard → Load AdminDashboard.tsx
5. Initialize admin panels → Load user-specific UI
```

### **System Monitoring Flow**

```
1. StatusBox.tsx → Fetch /api/admin/monitoring.ts
2. Real-time updates every 30s → Update UI indicators
3. Alert detection → Trigger /api/admin/alerts.ts
4. Critical issues → Send notifications
5. Log all events → /api/admin/logs.ts
```

---

## 🔧 **KONFIGURACJA I DEPLOYMENT**

### **Environment Variables**

```typescript
ADMIN_SECRET_KEY; // JWT signing key
ADMIN_DEFAULT_PASSWORD; // Default admin password
WORKERS_API_TOKEN; // Cloudflare Workers API
MONITORING_INTERVAL; // Stats refresh interval (default: 30s)
MAX_LOGIN_ATTEMPTS; // Rate limiting (default: 5)
SESSION_TIMEOUT; // Token expiration (default: 8h)
```

### **Build Dependencies**

```json
{
  "react": "^18.0.0",
  "svelte": "^4.0.0",
  "astro": "^5.0.0",
  "@types/jsonwebtoken": "^9.0.0",
  "tailwindcss": "^3.0.0"
}
```

### **Deployment Checklist**

- [ ] Update admin credentials
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Verify Workers connectivity
- [ ] Setup monitoring alerts
- [ ] Configure backup schedules

---

## 📝 **DOKUMENTACJA DODATKOWA**

### **Dla Developerów**

- `M1_ADMIN_DASHBOARD_SYSTEM.md` - Kompletna dokumentacja techniczna
- `GEMINI_ADMIN_PROMPT_STARTOWY.md` - Prompt dla AI assistant
- Component README files w każdym folderze

### **Dla Administratorów**

- `/admin/` - Dashboard z quick start guide
- `INSTRUKCJE_UZYTKOWNIKA.md` - Instrukcje użytkowania
- Built-in help system w każdym panelu

### **API Documentation**

- OpenAPI specs dla wszystkich endpoints
- Postman collection dla testowania
- Error codes i troubleshooting guide

---

**🎯 UWAGA**: Ta mapa jest żywym dokumentem aktualizowanym przy każdej zmianie w systemie. Wszystkie nowe komponenty i funkcjonalności powinny być dodane do tej mapy.
