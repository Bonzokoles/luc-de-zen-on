# Developer Technical Documentation - MyBonzo Platform v2.0

**Data**: 7 października 2025  
**Projekt**: MyBonzo Platform v2.0 - Kompletna dokumentacja techniczna dla programistów  
**Cel**: Pełna analiza 12 głównych okien AI i architektury systemu

---

## CZĘŚĆ 1: PRZEGLĄD ARCHITEKTURY - 12 GŁÓWNYCH OKIEN AI

### 1.1 Generator Obrazów AI 🎨

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/image-generator.astro`
- **Komponenty**: `src/components/ImageGeneratorWidget.svelte`, `src/components/StableDiffusionGenerator.jsx`
- **API**: `src/pages/api/generate-image.ts`, `src/pages/api/image-generator/generate.ts`
- **Funkcjonalność**:
  - Stable Diffusion XL integration
  - Flux-1 Schnell model support
  - Quick prompt input w głównym dashboard
  - Preview i download funkcjonalność
  - Background processing

**Funkcje otwierania:**

```javascript
// Z głównego dashboard (index.astro)
function openImageGenerator() {
  window.open("/image-generator", "_blank");
}
```

### 1.2 AI Chatbot 🧠

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/chatbot.astro`
- **Komponenty**: `src/components/Chatbot.svelte`, `src/components/MainChatWidget.svelte`, `src/components/AiHelpAssistant.svelte`
- **API**: `src/pages/api/chat.ts`, `src/pages/api/ai/advanced-chat.ts`
- **Funkcjonalność**:
  - 6 modeli AI (Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK)
  - Multi-language support (PL/EN)
  - Context awareness
  - Real-time typing indicator
  - Quick actions

**Funkcje otwierania:**

```javascript
function openChatbot() {
  window.open("/chatbot", "_blank");
}
```

### 1.3 BigQuery Analytics 📊

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/bigquery-analytics.astro`, `src/hub/functions/1.astro`
- **Komponenty**: `src/components/BigQueryWidget.svelte`
- **API**: `src/pages/api/bigquery/analytics.ts`
- **Utility**: `src/utils/bigQueryAPI.js`
- **Funkcjonalność**:
  - Google Cloud BigQuery integration
  - SQL query execution
  - AI-powered SQL generation
  - Real-time data insights
  - Analytics dashboards

**Funkcje otwierania:**

```javascript
function openBigQuery() {
  window.open("/bigquery", "_blank");
}
```

### 1.4 Kaggle Datasets 📈

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/kaggle-datasets.astro`, `src/pages/kaggle.astro`
- **API**: `src/pages/api/kaggle.ts`
- **Funkcjonalność**:
  - Kaggle API integration
  - Dataset search i analysis
  - Data exploration tools
  - Competition tracking

### 1.5 Tavily AI Search 🔍

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/tavily-search.astro`, `src/pages/tavily.astro`
- **API**: `src/pages/api/tavily/search.ts`
- **Test Interface**: `test-tavily.html`
- **Funkcjonalność**:
  - Advanced AI-powered web search
  - GET i POST endpoints
  - AI insights generation
  - Real-time search results
  - Fallback data handling

### 1.6 Voice AI Assistant 🔊

**Lokalizacja kodu:**

- **Główny komponent**: `src/components/GoogleVoiceAgent.svelte`
- **Konfiguracja**: `src/components/agents/modules/voice/config.ts`
- **API**: Google Cloud Speech API integration
- **Funkcjonalność**:
  - Speech-to-Text conversion
  - Text-to-Speech synthesis
  - Voice commands processing
  - Multi-language support (5 języków)
  - Voice avatar system

### 1.7 STATUS WORKERS 🔧

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/status-workers.astro`
- **Komponent**: `src/components/WorkersStatusDashboard.svelte`
- **Funkcjonalność**:
  - Real-time monitoring wszystkich Cloudflare Workers
  - System analytics i performance metrics
  - Health check endpoints

### 1.8 API Tests 🧪

**Lokalizacja kodu:**

- **Testing functions**: Wbudowane w `src/pages/index.astro` (linie 1089-1213)
- **Funkcjonalność**:
  - Testing wszystkich Workers API endpoints
  - Debug console dla API connections
  - Automated test suites

### 1.9 Langchain AI 🔗

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/langchain-integration.astro`
- **Funkcjonalność**:
  - Framework dla LLM applications
  - Integration z multiple AI models
  - Agent orchestration system

### 1.10 MCP Servers ☁️

**Lokalizacja kodu:**

- **Główna strona**: `src/pages/mcp-servers-management.astro`
- **Funkcjonalność**:
  - Model Context Protocol servers management
  - Mikroserwisy orchestration
  - Cloud infrastructure monitoring

### 1.11 Flowise AI 🌊

**Lokalizacja kodu:**

- **Functions**: Wbudowane w `src/pages/index.astro` (linie 1298-1379)
- **Funkcjonalność**:
  - Visual tool do budowy LLM orchestration flow
  - AI agents visual builder
  - External integration z Flowise platform

### 1.12 Activepieces ⚡

**Lokalizacja kodu:**

- **Integration**: `src/components/sections/MainWorkersCardsSection.astro`
- **Funkcjonalność**:
  - Open-source automation platform
  - Workflow automation tools
  - External integration z Activepieces platform

---

## CZĘŚĆ 2: AGENTS SYSTEM - ARCHITEKTURA MODUŁOWA

### 2.1 Struktura Agents Modules

**Główny folder**: `src/components/agents/modules/`

**Dostępne moduły:**

- `database/` - Agent zarządzania bazami danych
- `file/` - File Manager Agent
- `security/` - Security Guardian Agent
- `system/` - System Monitor Agent
- `voice/` - Voice Command Agent

**Template system**: `src/components/agents/_templates/basic-agent/`

- `index.astro` - Strona agenta
- `api.ts` - Endpoint API
- `component.svelte` - UI komponent
- `config.ts` - Konfiguracja
- `README.md` - Dokumentacja

### 2.2 Agents Controller

**Plik**: `src/components/agents/AgentsController.js`

```javascript
class AgentsController {
  toggleAgent(agentType, manualClick = false) {
    // Logika włączania/wyłączania agentów
  }
}

// Globalne funkcje
window.toggleSecurityAgent = (manualClick) =>
  agentsController.toggleAgent("security", manualClick);
```

### 2.3 Agent Pages i Routing

**Dynamiczne routing**: `src/pages/agents/[agentId].astro`

```javascript
export function getStaticPaths() {
  return [
    { params: { agentId: "mybonzo" } },
    { params: { agentId: "polaczek" } },
    { params: { agentId: "bielik" } },
    // Module Agents
    { params: { agentId: "agent-10-analytics-prophet" } },
    { params: { agentId: "agent-09-webmaster" } },
    { params: { agentId: "agent-08-security-guard" } },
  ];
}
```

---

## CZĘŚĆ 3: API ENDPOINTS - BACKEND ARCHITECTURE

### 3.1 Core API Structure

**Główne kategorie API:**

```
src/pages/api/
├── agents/              # Agents management
├── ai/                  # AI model endpoints
├── bigquery/            # Google Cloud analytics
├── chat.ts              # Main chat API
├── generate-image.ts    # Image generation
├── kaggle.ts            # Kaggle integration
├── polaczek-chat.ts     # Polish AI model
└── tavily/              # Search API
```

### 3.2 AI Models Integration

**Chat API**: `src/pages/api/chat.ts`

```typescript
const modelId = body.model || "@cf/meta/llama-3.1-8b-instruct";
const response = await env.AI.run(modelId, {
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: body.prompt },
  ],
});
```

**Dostępne modele:**

- `@cf/meta/llama-3.1-8b-instruct`
- `@cf/google/gemma-3-12b-it`
- `@cf/qwen/qwen1.5-14b-chat-awq`
- `@cf/mistral/mistral-7b-instruct-v0.1`

### 3.3 BigQuery Analytics API

**Endpoint**: `src/pages/api/bigquery/analytics.ts`

```typescript
export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const aiHelp = url.searchParams.get("ai_help");

  if (aiHelp) {
    const aiResponse = await generateSQLWithAI(env, aiHelp);
    return new Response(JSON.stringify(aiResponse));
  }
}
```

**Funkcje:**

- SQL query execution
- AI-powered SQL generation
- Dataset management
- Analytics insights generation

---

## CZĘŚĆ 4: FRONTEND COMPONENTS - UI ARCHITECTURE

### 4.1 Svelte Components Structure

**Główne komponenty:**

```
src/components/
├── GoogleVoiceAgent.svelte      # Voice AI system
├── BigQueryWidget.svelte        # Analytics widget
├── Chatbot.svelte              # Chat interface
├── ImageGeneratorWidget.svelte  # Image generation
├── WorkersStatusDashboard.svelte # System monitoring
└── agents/                     # Agents components
```

### 4.2 Layout System

**Główne layouty:**

- `src/layouts/Layout.astro` - Base layout
- `src/layouts/MyBonzoLayout.astro` - Platform layout
- `src/layouts/BackroomInterface.astro` - Cyberpunk theme
- `src/layouts/UniversalPageLayout.astro` - Universal template

### 4.3 Sections i Navigation

**Sekcje główne:**

- `src/components/sections/MainWorkersCardsSection.astro` - 12 okien AI
- `src/components/AIWorkersNav.astro` - Navigation
- `src/components/sections/` - Pozostałe sekcje

**Navigation structure:**

```astro
<!-- BigQuery Analytics Card -->
<div class="worker-card" data-worker="bigquery">
  <h3 class="worker-title">BigQuery Analytics</h3>
  <p class="worker-description">
    Analizuj dane z Google BigQuery, wykonuj zapytania SQL
  </p>
  <div class="worker-features">
    <span class="feature-tag">Google Cloud</span>
    <span class="feature-tag">SQL Query</span>
    <span class="feature-tag">Analytics</span>
  </div>
</div>
```

---

## CZĘŚĆ 5: CLOUDFLARE WORKERS & RUNTIME

### 5.1 Cloudflare Integration

**Konfiguracja**: `astro.config.mjs`

```javascript
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
```

**Environment Variables**: `.dev.vars`

```bash
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_PRIVATE_KEY="base64-encoded-key"
TAVILY_API_KEY="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"
DEEPSEEK_API_KEY="your-deepseek-key"
KAGGLE_API_KEY="your-kaggle-key"
```

### 5.2 Runtime Environment Access

**Proper access pattern:**

```typescript
export async function POST({ request, locals }: APIContext) {
  // CORRECT - Runtime environment access
  const apiKey = (locals as any)?.runtime?.env?.DEEPSEEK_API_KEY;

  // WRONG - Build-time only
  // const apiKey = import.meta.env.DEEPSEEK_API_KEY;
}
```

### 5.3 Workers AI Integration

**AI Model execution:**

```typescript
const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuery },
  ],
});
```

---

## CZĘŚĆ 6: DEPLOYMENT & MAINTENANCE

### 6.1 Build & Deploy Process

**Development commands:**

```bash
pnpm dev              # Dev server (port 5000)
pnpm build            # Production build (277 modules expected)
wrangler dev          # Cloudflare Pages local testing
```

**Production deployment:**

```powershell
.\deploy-to-production.ps1    # Full production deploy
.\quick-sync.ps1             # Build validation only
```

### 6.2 Dual Repository Strategy

**Development workflow:**

- `luc-de-zen-on` → `luc-de-zen-on.pages.dev` (development)
- `mybonzo-production` → `mybonzo.com` (production via deployment script)

**Critical rule:** NEVER commit directly to production repo

### 6.3 Health Monitoring

**Health check endpoints:**

- `/api/health-check` - System health
- `/api/status-check` - Service status
- `/api/test-connections` - API connectivity
- `test-tavily.html` - Interactive API testing

### 6.4 File Structure Summary

```
MyBonzo Platform v2.0/
├── src/
│   ├── pages/                    # 12 głównych okien AI
│   │   ├── image-generator.astro
│   │   ├── chatbot.astro
│   │   ├── bigquery-analytics.astro
│   │   ├── kaggle.astro
│   │   ├── tavily-search.astro
│   │   └── api/                  # Backend endpoints
│   ├── components/
│   │   ├── agents/               # Modular agents system
│   │   │   ├── modules/          # Agent implementations
│   │   │   └── _templates/       # Agent templates
│   │   ├── GoogleVoiceAgent.svelte
│   │   ├── BigQueryWidget.svelte
│   │   └── sections/             # UI sections
│   └── layouts/                  # Layout templates
├── docs/                         # Documentation
├── .dev.vars                     # Environment variables
├── astro.config.mjs             # Astro configuration
├── deploy-to-production.ps1      # Production deployment
└── quick-sync.ps1               # Build validation
```

---

## Maintenance Guidelines

### Code Quality Standards

- TypeScript strict typing for all API endpoints
- Svelte components with proper lifecycle management
- Astro SSR with Cloudflare Workers compatibility
- Environment variable security through runtime access

### Performance Optimization

- API responses: ~2-3 seconds average
- Build output: 277 modules expected
- Memory usage: monitored through health checks
- CDN optimization: Cloudflare Pages integration

### Security Practices

- All API keys through environment variables
- Runtime environment access only (never build-time)
- CORS handling in all endpoints
- Error handling with proper status codes

### Future Development

- Agent system expandable through template structure
- API endpoints modular and independently deployable
- UI components reusable across different themes
- Documentation auto-generated from code comments

---

**Status**: 🟢 COMPLETE - Ready for production development

_Dokumentacja techniczna wygenerowana na podstawie analizy pełnej struktury aplikacji MyBonzo Platform v2.0_
