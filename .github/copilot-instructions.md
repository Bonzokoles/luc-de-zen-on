# MyBonzo AI Agent Instructions

## Project Overview

This is a dual-repository Astro/Cloudflare Pages project with modular AI agents system. Development happens in `luc-de-zen-on`, production deploys to `mybonzo.com` via separate repo.

## Architecture Patterns

### Dual Repository Strategy

- **Development**: `luc-de-zen-on` → `luc-de-zen-on.pages.dev`
- **Production**: `mybonzo-production` → `mybonzo.com` (deployed via `deploy-to-production.ps1`)
- Never commit directly to production - always use deployment scripts

### Cloudflare Runtime Environment Access

```javascript
// CORRECT - Cloudflare Pages Functions runtime
const apiKey = (locals as any)?.runtime?.env?.DEEPSEEK_API_KEY;

// WRONG - Build-time only, won't work in production
const apiKey = import.meta.env.DEEPSEEK_API_KEY;
```

### Modular Agents System

Each agent follows standardized structure in `src/components/agents/`:

```
agent-XX-name/
├── index.astro     # Page component (max 200 lines)
├── api.ts          # API endpoint (max 150 lines)
├── component.svelte # UI component (max 200 lines)
├── config.ts       # Configuration (max 50 lines)
└── README.md       # Documentation
```

## Critical Workflows

### Build & Deploy Commands

```bash
pnpm dev              # Development server
pnpm build            # Production build (277 modules expected)
wrangler dev          # Local Cloudflare Pages testing
.\deploy-to-production.ps1  # Production deployment
.\quick-sync.ps1      # Build validation only
```

### Development Practice

1. All changes in `luc-de-zen-on` repo first
2. Test on `luc-de-zen-on.pages.dev`
3. Use `quick-sync.ps1` for build validation
4. Deploy to production only when stable

## Tech Stack Specifics

### Core Framework

- Astro 5+ with SSR (`output: 'server'`)
- Cloudflare adapter with platform proxy enabled
- React + Svelte integrations
- Tailwind CSS styling

### API Integration Pattern

Monitor endpoints at `/api/health-check`, `/api/status-check`, `/api/test-connections`. All external APIs (DeepSeek, Kaggle, Tavily) must handle Cloudflare runtime environment properly.

### Key Configuration Files

- `astro.config.mjs` - SSR with Cloudflare adapter
- `wrangler-*.toml` - Cloudflare configuration variants
- `package.json` - pnpm workspace with 40+ dependencies

## Project Conventions

### File Organization

- Agents in `src/components/agents/modules/`
- API routes in `src/pages/api/`
- Polish language content preferred (`POLACZEK_*` files)
- Comprehensive documentation in project root

### Monitoring & Health Checks

System includes built-in monitoring at `/api/health-check` with endpoint testing. Production deployment includes automatic health verification.

## Essential Files to Reference

- `AGENT_BRIEFING.md` - Complete project context
- `DEVELOPMENT_WORKFLOW_GUIDE.md` - Dual-repo workflow
- `src/components/agents/AGENTS_DOCUMENTATION.md` - Agent architecture
- `deploy-to-production.ps1` - Production deployment process

Focus on stability, proper environment variable access, and maintaining the dual-repository workflow when making changes.
