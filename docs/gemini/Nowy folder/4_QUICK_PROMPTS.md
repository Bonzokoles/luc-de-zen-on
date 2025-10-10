# 🧠 Gemini CLI - MyBonzo Prompts

## 🚀 Quick Commands

### Development
- **Bug Fix**: `gemini "Fix MyBonzo error: [error message]"`
- **API Create**: `gemini "Create /api/weather endpoint for MyBonzo using OpenWeatherMap"`
- **Component**: `gemini "Create agent-weather component for MyBonzo in Svelte"`

### Optimization  
- **Performance**: `gemini "Optimize MyBonzo Tavily API for faster response times"`
- **Build**: `gemini "Fix MyBonzo build error: [error]"`
- **Config**: `gemini "Update wrangler.toml for MyBonzo with new KV namespace"`

### Content
- **Polish**: `gemini "Generate Polish UI text for MyBonzo weather component"`
- **Docs**: `gemini "Write README for MyBonzo agent-weather component"`

---

## 📋 Master Context Prompt

```text
You are an expert AI developer working on MyBonzo - a dual-repository Astro/Cloudflare Pages project.

TECH STACK:
- Astro 5 SSR, TypeScript, Cloudflare Workers
- React + Svelte components
- APIs: Tavily, DeepSeek, Workers AI (@cf/google/gemma-7b-it)
- Storage: KV, R2 buckets, D1 database
- Monitoring: Sentry error tracking

ARCHITECTURE:
- Development: luc-de-zen-on → luc-de-zen-on.pages.dev
- Production: mybonzo-production → mybonzo.com
- Modular agents: src/components/agents/agent-XX-name/
- Dual-repo deployment with deploy-to-production.ps1

CRITICAL PATTERN:
✅ CORRECT: const apiKey = (locals as any)?.runtime?.env?.API_KEY;
❌ WRONG: const apiKey = import.meta.env.API_KEY; (build-time only)

Always follow MyBonzo patterns, use Polish language for content, consider Cloudflare Workers environment.
```

---

## 🛠 Specialized Prompts

### API Development
```text
Create MyBonzo API endpoint:
- Path: /api/[name]
- Function: [describe]
- External API: [if any]
- Follow src/pages/api/[name].ts pattern
- Use Cloudflare runtime env access
- Add Sentry error tracking
- Include GET/POST methods
- Add proper TypeScript types
```

### Component Creation
```text
Create MyBonzo agent component:
- Name: agent-XX-[name]
- Framework: [React/Svelte]  
- Structure:
  * index.astro (max 200 lines)
  * api.ts (max 150 lines)
  * component.[jsx/svelte] (max 200 lines)
  * config.ts (max 50 lines)
  * README.md
- Polish language content
```

### Performance Optimization
```text
Optimize MyBonzo code for Cloudflare Pages:
- Focus: Workers AI efficiency, KV storage, edge caching
- Bundle size reduction, API response times
- Memory usage optimization
- Provide performance impact analysis
```

### Deployment & Config
```text
Update MyBonzo deployment:
- Modify wrangler.toml configuration
- Consider production vs development environments
- Include KV, R2, D1 bindings
- Smart placement, resource limits
- Custom domains (mybonzo.com, www.mybonzo.com)
```

### Error Debugging
```text
Debug MyBonzo issue:
- Error: [paste error]
- File: [file path]
- Context: Cloudflare Pages Functions, Astro 5 SSR
- Provide root cause, fix, prevention strategy
- Include test commands
```

### Polish Content
```text
Generate Polish content for MyBonzo:
- Type: [UI text/docs/error messages]
- Context: [where used]
- Native Polish level, technical accuracy
- Follow POLACZEK_* conventions
```

---

## 🎯 Example Usage

```bash
# Quick fixes
gemini "Fix MyBonzo TypeScript error: Property 'AI' does not exist"
gemini "Debug MyBonzo API endpoint /api/tavi returning 500"

# Feature development
gemini "Create weather widget for MyBonzo using OpenWeatherMap API"
gemini "Add image generation to MyBonzo using Stability AI"

# Optimization
gemini "Optimize MyBonzo bundle size and loading speed"
gemini "Improve MyBonzo error handling with better Sentry integration"

# Content
gemini "Write Polish error messages for MyBonzo authentication system"
gemini "Create documentation for MyBonzo agent system in Polish"
```

---

## 📝 Tips

- Always mention "MyBonzo" for proper context
- Include specific error messages and file paths
- Specify React vs Svelte for components
- Request Polish language when needed
- Consider dual-repository workflow
- Focus on Cloudflare Workers specifics