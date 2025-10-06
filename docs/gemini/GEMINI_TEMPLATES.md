# 📋 Ready-to-Use Gemini Prompts for MyBonzo

## Copy-Paste These Prompts Directly to Gemini CLI

---

### 🐛 Bug Fixes

```
You are an expert AI developer working on MyBonzo - a dual-repository Astro/Cloudflare Pages project with Astro 5 SSR, TypeScript, Cloudflare Workers, and APIs like Tavily/DeepSeek. 

Fix this MyBonzo error: [PASTE ERROR HERE]

Context: Cloudflare Pages Functions environment using (locals as any)?.runtime?.env pattern for env vars.

Provide: 1) Root cause 2) Specific fix 3) Prevention strategy 4) Test commands
```

---

### 🚀 API Creation

```
You are an expert AI developer working on MyBonzo - a dual-repository Astro/Cloudflare Pages project with modular architecture.

Create MyBonzo API endpoint:
- Path: /api/[NAME]
- Function: [DESCRIBE WHAT IT SHOULD DO]
- External API: [IF USING EXTERNAL SERVICE]

Requirements:
- Follow src/pages/api/[name].ts pattern
- Use const apiKey = (locals as any)?.runtime?.env?.API_KEY pattern
- Add Sentry error tracking with captureException
- Include both GET/POST methods
- Add proper TypeScript types
- Handle errors with fallback mechanisms
- Include configuration info when no params provided
```

---

### ⚛️ Component Development

```
You are an expert AI developer working on MyBonzo - modular AI agents system with React+Svelte components.

Create MyBonzo agent component:
- Name: agent-[NAME]
- Framework: [React/Svelte]
- Function: [DESCRIBE FUNCTIONALITY]

Structure needed:
- src/components/agents/agent-[name]/index.astro (max 200 lines)
- src/components/agents/agent-[name]/api.ts (max 150 lines)
- src/components/agents/agent-[name]/component.[jsx/svelte] (max 200 lines)
- src/components/agents/agent-[name]/config.ts (max 50 lines)
- src/components/agents/agent-[name]/README.md

Use Polish language content and MyBonzo architectural patterns.
```

---

### ⚡ Performance Optimization

```
You are an expert AI developer working on MyBonzo - Astro 5 SSR project deployed on Cloudflare Pages.

Optimize this MyBonzo code for Cloudflare Pages performance:

CODE: [PASTE CODE HERE]

Focus on:
- Cloudflare Workers AI model efficiency (@cf/google/gemma-7b-it)
- KV storage optimization and caching
- R2 bucket usage patterns
- Edge caching strategies
- Bundle size reduction
- API response times (Tavily, DeepSeek)
- Memory usage in Workers environment
- Smart placement configuration

Provide optimized code with performance impact analysis.
```

---

### 🐞 Debugging

```
You are an expert AI developer working on MyBonzo - Cloudflare Pages project with Astro 5 SSR and complex API integrations.

Debug this MyBonzo issue:
- Problem: [DESCRIBE ISSUE]
- File: [FILE PATH IF KNOWN]
- Error: [ERROR MESSAGE IF ANY]

Context:
- Cloudflare Pages Functions environment
- APIs: Tavily (web search), DeepSeek, Workers AI
- Sentry error tracking enabled
- Dual-repo deployment workflow

Provide:
1. Root cause analysis
2. Step-by-step debugging approach
3. Specific solution with code
4. Prevention measures
5. Test commands to verify fix
```

---

### 🇵🇱 Polish Content

```
You are an expert AI developer and native Polish speaker creating content for MyBonzo - Polish AI platform.

Generate Polish content for MyBonzo:
- Type: [UI text/error messages/documentation/etc.]
- Context: [WHERE IT WILL BE USED]
- Technical level: [USER-FRIENDLY/TECHNICAL/MIXED]

Requirements:
- Native Polish language (perfect grammar and style)
- Technical accuracy for AI/development terms
- User-friendly and clear explanations
- Consistent with existing MyBonzo terminology
- Follow POLACZEK_* file conventions
- Natural Polish expressions, not literal translations
```

---

### 🚢 Deployment Planning

```
You are an expert AI developer managing MyBonzo - dual-repository deployment workflow.

Create deployment plan for MyBonzo:
- Changes: [LIST CHANGES MADE]
- Files modified: [LIST FILES]
- New features: [DESCRIBE NEW FEATURES]

MyBonzo deployment context:
- Development: luc-de-zen-on → luc-de-zen-on.pages.dev
- Production: deploy-to-production.ps1 → mybonzo.com
- Build validation: quick-sync.ps1

Provide:
1. Pre-deployment checklist
2. Exact deployment commands
3. Post-deployment verification steps
4. Health check URLs and commands
5. Rollback strategy if needed
6. Monitoring points to watch
```

---

### ⚙️ Configuration Updates

```
You are an expert AI developer working on MyBonzo - Cloudflare Pages project with complex wrangler.toml configuration.

Update MyBonzo wrangler.toml for:
- Requirement: [DESCRIBE WHAT NEEDS TO BE ADDED/CHANGED]
- Environment: [production/development/both]

Current MyBonzo setup:
- KV namespaces for sessions and caching
- R2 buckets for storage and assets
- D1 database for persistent data
- AI binding for Workers AI (@cf/google/gemma-7b-it)
- Custom domains: mybonzo.com, www.mybonzo.com
- Smart placement mode enabled
- Environment variables for API keys

Consider production vs development differences and resource limits.
```

---

### 📝 Code Review

```
You are an expert AI developer reviewing MyBonzo code - Astro 5 SSR project with Cloudflare Workers integration.

Review this MyBonzo code:

FILE: [FILE PATH]
CODE:
[PASTE CODE HERE]

Check for:
- MyBonzo architectural patterns compliance
- Cloudflare Workers compatibility
- Proper env variable access: (locals as any)?.runtime?.env pattern
- TypeScript best practices and type safety
- Performance optimization opportunities
- Security considerations and input validation
- Error handling completeness with Sentry integration
- Polish language content quality
- API integration patterns (Tavily, DeepSeek, Workers AI)

Provide specific improvements with code examples.
```

---

### 🔍 Error Analysis

```
You are an expert AI developer troubleshooting MyBonzo - complex Cloudflare Pages project.

Analyze this MyBonzo error:

ERROR MESSAGE:
[PASTE FULL ERROR HERE]

CONTEXT:
- File: [FILE PATH]
- Line: [LINE NUMBER IF KNOWN]
- Operation: [WHAT WAS BEING DONE]
- Environment: [dev/production]

MyBonzo tech stack:
- Astro 5 SSR with TypeScript
- Cloudflare Workers and Pages Functions
- APIs: Tavily, DeepSeek, Workers AI
- Storage: KV, R2, D1 database
- Monitoring: Sentry

Provide:
1. Detailed error explanation
2. Root cause identification
3. Step-by-step fix
4. Code examples
5. Testing approach
6. Prevention strategy for future
```

---

## 🎯 Usage Tips

1. **Replace placeholders** in [BRACKETS] with your specific details
2. **Include error messages** exactly as they appear
3. **Specify file paths** when relevant
4. **Mention specific frameworks** (React vs Svelte)
5. **Request Polish content** when needed for UI
6. **Include context** about what you were trying to do

## 📱 Quick Reference

- **Bug**: Use Bug Fixes template + exact error message
- **New API**: Use API Creation template + describe functionality  
- **New Component**: Use Component Development template + specify React/Svelte
- **Slow code**: Use Performance Optimization template + paste code
- **Polish text**: Use Polish Content template + specify context
- **Deploy**: Use Deployment Planning template + list changes
- **Config**: Use Configuration Updates template + describe need