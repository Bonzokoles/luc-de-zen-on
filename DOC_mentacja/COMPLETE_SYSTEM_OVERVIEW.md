# Kompletny przegląd systemu mybonzo

**Data utworzenia:** 2025-09-02  
**Wersja:** 2.0  
**Status:** Produkcyjny system z nowymi funkcjami AI

---

# Spis treści

1. [Architektura systemu](#architektura-systemu)
2. [Narzędzia i technologie](#narzędzia-i-technologie)  
3. [Funkcje AI](#funkcje-ai)
4. [API Endpoints](#api-endpoints)
5. [Komponenty Frontend](#komponenty-frontend)
6. [Workflow i automatyzacje](#workflow-i-automatyzacje)
7. [Deployment i konfiguracja](#deployment-i-konfiguracja)
8. [Instrukcje użytkowania](#instrukcje-użytkowania)

---

# Architektura systemu

## Stack technologiczny
```
Frontend Layer:
├── Astro (Static Site Generator)
├── Svelte 5 (Components)
├── TypeScript (Type Safety)  
└── Custom CSS (Cyberpunk Design)

Backend Layer:
├── Cloudflare Workers (API Endpoints)
├── Cloudflare Pages (Static Hosting)
├── TypeScript (Server Logic)
└── OpenAI API (AI Services)

Integration Layer:
├── ActivePieces (Workflow Automation)
├── Flowise (AI Workflows)
├── BigQuery (Analytics)
├── Tavily (Search)
└── Kaggle (Data Science)
```

## Struktura projektu
```
T:\MY_LUC_ZEN_ON\
├── src/
│   ├── components/          # Svelte komponenty
│   ├── pages/              # Astro strony
│   │   └── api/            # API endpoints  
│   ├── workers/            # Cloudflare Workers
│   ├── utils/              # Narzędzia pomocnicze
│   └── styles/             # Style CSS
├── DOC_mentacja/           # Dokumentacja
├── workflows/              # Workflow definitions
├── scripts/                # Deployment scripts
└── public/                 # Static assets
```

---

# Narzędzia i technologie

## Frontend Technologies

### **Astro Framework**
- **Wersja:** Latest
- **Funkcja:** Static Site Generator z partial hydration
- **Pliki:** `astro.config.mjs`, `src/pages/*.astro`
- **Konfiguracja:** Svelte integration, Cloudflare adapter

### **Svelte 5** 
- **Funkcja:** Reactive UI components
- **Pliki:** `src/components/*.svelte`
- **Features:** Runes, enhanced reactivity, TypeScript support

### **TypeScript**
- **Konfiguracja:** `tsconfig.json`, `tsconfig.workers.json`  
- **Funkcja:** Type safety dla całego projektu
- **Coverage:** 95% typed code

## Backend Technologies

### **Cloudflare Workers**
- **Pliki:** `src/workers/*.ts`, `src/pages/api/*.ts`
- **Funkcja:** Serverless compute dla API
- **Konfiguracja:** Multiple wrangler.toml files

### **OpenAI Integration**
- **Model:** GPT-4o-mini
- **Funkcja:** AI-powered features
- **Authentication:** API key via environment variables

## Automation Tools

### **ActivePieces**
- **Funkcja:** Business process automation
- **Komponenty:** `src/components/*Button.astro`
- **Workflows:** `workflows/activepieces_*.json`

### **Flowise**  
- **Funkcja:** AI workflow builder
- **Integration:** Visual AI pipeline creation
- **API:** `src/pages/api/flowise.js`

## Analytics & Data

### **BigQuery**
- **Funkcja:** Data warehousing i analytics
- **Komponent:** `src/components/BigQueryWidget.svelte`
- **API:** `src/pages/api/bigquery.ts`

### **Tavily Search**
- **Funkcja:** Advanced web search
- **Komponent:** `src/components/TavilyWidget.svelte`
- **API:** `src/pages/api/tavi.ts`

### **Kaggle Integration**
- **Funkcja:** Data science workflows
- **Komponent:** `src/components/KaggleWidget.svelte`
- **API:** `src/pages/api/kaggle.ts`

---

# Funkcje AI

## 1. **🤖 Generator FAQ dynamiczny**
- **Endpoint:** `/api/faq`
- **Komponent:** `FAQGeneratorWidget.svelte`
- **Funkcja:** Automatyczne tworzenie FAQ z bazy wiedzy
- **Model AI:** OpenAI GPT-4o-mini
- **Input:** Knowledge base text
- **Output:** Structured FAQ in markdown

## 2. **🎓 System rekomendacji edukacyjnych**
- **Endpoint:** `/api/education-recommendations`
- **Komponent:** `EducationRecommendationsWidget.svelte`  
- **Funkcja:** Personalized learning recommendations
- **Input:** User profile (level, interests, goals, time, style, budget)
- **Output:** Detailed educational recommendations

## 3. **🎫 System zgłoszeń i ticketów**
- **Endpoints:** `/api/tickets` (POST, GET)
- **Komponent:** `TicketSubmissionWidget.svelte`
- **Funkcja:** Intelligent ticket management z AI classification
- **Features:** Auto-assignment, status tracking, AI summarization

## 4. **💬 Main Chat System**
- **Komponent:** `MainChatWidget.svelte`
- **Funkcja:** Multi-model chat interface
- **Models:** OpenAI, Claude, local models
- **Features:** Context memory, file uploads

## 5. **🖼️ Image Generation**  
- **Endpoint:** `/api/generate-image`
- **Worker:** `src/workers/generate-image.ts`
- **Komponent:** `ImageGeneratorWidget.svelte`
- **Funkcja:** AI image generation z multiple providers

## 6. **🤖 AI Workers Manager**
- **Komponent:** `AIWorkersManager.svelte`
- **Endpoint:** `/api/ai-workers`
- **Funkcja:** Multi-model AI orchestration
- **Features:** Load balancing, fallback models

---

# API Endpoints

## Core AI APIs
| Endpoint | Method | Funkcja | Model |
|----------|--------|---------|-------|
| `/api/chat` | POST | General chat | GPT-4o-mini |
| `/api/faq` | POST | FAQ generation | GPT-4o-mini |
| `/api/education-recommendations` | POST | Learning recommendations | GPT-4o-mini |
| `/api/tickets` | POST/GET | Ticket management | GPT-4o-mini |
| `/api/generate-image` | POST | Image generation | DALL-E |

## Data & Analytics APIs
| Endpoint | Method | Funkcja | Service |
|----------|--------|---------|---------|
| `/api/bigquery` | POST | Data analysis | Google BigQuery |
| `/api/kaggle` | GET | Dataset access | Kaggle API |
| `/api/tavi` | POST | Web search | Tavily API |
| `/api/usage-stats` | GET | Usage analytics | Internal |

## Business Functions APIs  
| Endpoint | Method | Funkcja | Model |
|----------|--------|---------|-------|
| `/api/generate-marketing-content` | POST | Marketing copy | GPT-4o-mini |
| `/api/get-recommendations` | POST | Product recommendations | GPT-4o-mini |
| `/api/qualify-lead` | POST | Lead scoring | GPT-4o-mini |
| `/api/activity-monitor` | GET/POST | Activity tracking | Internal |
| `/api/reminders` | GET/POST | Reminder system | Internal |

## Workflow APIs
| Endpoint | Method | Funkcja | Service |
|----------|--------|---------|---------|
| `/api/flowise` | POST | AI workflow trigger | Flowise |
| `/api/activepieces` | POST | Process automation | ActivePieces |

---

# Komponenty Frontend

## AI Function Widgets
```
src/components/
├── FAQGeneratorWidget.svelte
├── EducationRecommendationsWidget.svelte
├── TicketSubmissionWidget.svelte
├── MainChatWidget.svelte
├── ImageGeneratorWidget.svelte
├── AIWorkersManager.svelte
└── AiHelpAssistant.svelte
```

## Data & Analytics Widgets
```
src/components/
├── BigQueryWidget.svelte
├── KaggleWidget.svelte
├── TavilyWidget.svelte
├── ActivityDashboard.svelte
└── RemindersManager.svelte
```

## Business Function Widgets
```
src/components/
├── MarketingContentGenerator.svelte
├── RecommendationsWidget.svelte
├── LeadQualificationForm.svelte
├── ChatWidget.svelte
└── APIDemo.svelte
```

## Navigation & Layout
```
src/components/
├── AIWorkersNav.astro
├── AgentsPanel.astro
├── ActivePiecesButton.astro
├── FlowiseButton.astro
└── BgAnimation.svelte
```

---

# Workflow i automatyzacje

## ActivePieces Workflows
```
workflows/
├── activepieces_reminders_workflow.json
├── flowise_monitoring_workflow.json
└── flowise_faq_generation_workflow.json
```

### Features:
- **Reminder system** z email notifications
- **Monitoring workflows** dla system health
- **FAQ generation** z automatic trigger
- **Integration** z external APIs

## Flowise AI Workflows
- **Visual AI pipeline** creation
- **Multi-step AI processing**
- **Conditional logic** based on AI outputs
- **Integration** z multiple AI providers

## Deployment Automation
```
scripts/
├── deployMybonzo.js
├── deployWorkflows.js
└── createProjectStructureWithTemplates.js
```

### GitHub Actions
- **Automatic deployment** na Cloudflare
- **Testing pipeline** przed deployment  
- **Environment management** (dev/staging/prod)
- **Secrets management** dla API keys

---

# Deployment i konfiguracja

## Environment Variables
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Cloudflare  
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

# External APIs
TAVILY_API_KEY=...
KAGGLE_API_KEY=...
BIGQUERY_PROJECT_ID=...

# Workflow Services
FLOWISE_API_KEY=...
ACTIVEPIECES_API_KEY=...
```

## Wrangler Configuration
Multiple wrangler.toml files dla different services:
- `wrangler.toml` - Main application
- `wrangler-bielik.toml` - Bielik AI model
- `wrangler-generate-image.toml` - Image generation
- `wrangler-models-api.toml` - Models API
- `wrangler-multi-ai.toml` - Multi-AI orchestration
- `wrangler-polaczek.toml` - Polaczek agent

## Package.json Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build", 
    "preview": "astro preview",
    "deploy": "npm run build && wrangler pages deploy dist",
    "deploy:workers": "wrangler deploy",
    "test": "npm run test:api && npm run test:components"
  }
}
```

---

# Instrukcje użytkowania

## Development Workflow

### 1. Setup środowiska
```bash
# Clone repository
git clone https://github.com/Bonzokoles/luc-de-zen-on.git
cd luc-de-zen-on

# Install dependencies  
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys
```

### 2. Local development
```bash
# Start development server
npm run dev

# Server runs on http://localhost:4321
```

### 3. Testing
```bash
# Run all tests
npm test

# Test specific component
npm run test:components

# Test API endpoints
npm run test:api
```

### 4. Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Deploy Workers separately  
npm run deploy:workers
```

## Production Usage

### Accessing funkcje AI:
1. **FAQ Generator** - `/` → scroll to FAQ section
2. **Education Recommendations** - `/` → education widget
3. **Ticket System** - `/` → ticket submission form
4. **Chat Interface** - `/chatbot` lub main chat widget
5. **Image Generation** - AI Workers Manager
6. **Analytics** - BigQuery/Kaggle widgets

### Business Functions:
1. **Marketing Content** - `/zaawansowane-funkcje-ai`
2. **Lead Qualification** - Business functions page  
3. **Activity Monitoring** - `/funkcje-biznesowe-ai`
4. **Workflow Automation** - ActivePieces/Flowise buttons

## Monitoring & Maintenance

### Health Checks:
- Cloudflare Workers status
- API endpoint availability  
- AI model response times
- Error rates monitoring

### Regular Tasks:
- Review API usage i costs
- Update AI models when available
- Monitor user feedback
- Performance optimization
- Security updates

---

# Troubleshooting Guide

## Common Issues

### 1. API Authentication Errors
```
Error: Unauthorized - Invalid API key
```
**Solution:** 
- Check environment variables
- Verify API key permissions
- Check API quotas

### 2. Build Failures
```  
Error: Module not found
```
**Solution:**
- Run `npm install`
- Check import paths
- Verify file exists

### 3. Deployment Issues
```
Error: Wrangler deployment failed
```
**Solution:**
- Check wrangler.toml configuration
- Verify Cloudflare credentials
- Check resource limits

### 4. Styling Problems
```
Components not styled correctly
```
**Solution:**
- Verify CSS imports
- Check border-radius: 0px !important
- Validate color variables

###
