# 🧠 GEMINI CLI PROMPTS - MyBonzo AI Platform

## 📋 **CONTEXT PROMPTS**

### Project Overview

```text
You are an expert AI developer working on MyBonzo - a dual-repository Astro/Cloudflare Pages project with modular AI agents system. 

Key details:
- Development: luc-de-zen-on → luc-de-zen-on.pages.dev  
- Production: mybonzo-production → mybonzo.com
- Tech stack: Astro 5 SSR, Cloudflare Workers, React+Svelte, TypeScript
- APIs: Tavily (web search), DeepSeek, OpenAI, Workers AI (@cf/google/gemma-7b-it)
- Infrastructure: KV storage, R2 buckets, D1 database, Sentry monitoring
- Dual-repo workflow with deploy-to-production.ps1

Always consider Cloudflare runtime environment access pattern:
CORRECT: `const apiKey = (locals as any)?.runtime?.env?.API_KEY;`
WRONG: `const apiKey = import.meta.env.API_KEY;` (build-time only)
```

---

## 🚀 **DEVELOPMENT PROMPTS**

### 1. Bug Analysis & Debugging
```
Analyze this error from MyBonzo project and provide solution:

ERROR: [paste error here]

Context:
- Cloudflare Pages Functions environment
- Using Astro 5 SSR with TypeScript
- APIs: Tavily, DeepSeek, Workers AI
- Sentry error tracking enabled

Provide:
1. Root cause analysis
2. Specific fix with code
3. Prevention strategy
4. Test commands to verify fix
```

### 2. API Integration
```
Create a new API endpoint for MyBonzo with these requirements:

ENDPOINT: /api/[name]
FUNCTIONALITY: [describe what it should do]
EXTERNAL API: [if using external service]

Requirements:
- Follow MyBonzo patterns (src/pages/api/[name].ts)
- Use Cloudflare runtime env access
- Add Sentry error tracking
- Include proper TypeScript types
- Handle both GET/POST methods
- Add error fallback mechanisms
- Include configuration info endpoint
```

### 3. Component Development
```
Create a new agent component for MyBonzo following modular pattern:

AGENT NAME: [agent-XX-name]
FUNCTIONALITY: [what it does]
UI FRAMEWORK: [React/Svelte]

Structure needed:
- src/components/agents/agent-XX-name/index.astro (max 200 lines)
- src/components/agents/agent-XX-name/api.ts (max 150 lines) 
- src/components/agents/agent-XX-name/component.[jsx/svelte] (max 200 lines)
- src/components/agents/agent-XX-name/config.ts (max 50 lines)
- src/components/agents/agent-XX-name/README.md

Follow MyBonzo conventions and Polish language content.
```

### 4. Performance Optimization
```
Optimize this MyBonzo code for Cloudflare Pages performance:

CODE: [paste code here]

Focus on:
- Cloudflare Workers AI model efficiency
- KV storage optimization
- R2 bucket usage
- Edge caching strategies
- Bundle size reduction
- API response times
- Memory usage in Workers environment

Provide optimized code with performance impact analysis.
```

---

## 🔧 **INFRASTRUCTURE PROMPTS**

### 5. Wrangler Configuration
```
Update wrangler.toml for MyBonzo with new requirement:

CURRENT CONFIG: [paste relevant wrangler.toml section]
NEW REQUIREMENT: [describe what needs to be added/changed]

Consider:
- Production vs development environments
- KV namespaces, R2 buckets, D1 database bindings
- Environment variables and secrets
- Custom domains (mybonzo.com, www.mybonzo.com)
- Smart placement configuration
- Resource limits and performance optimization
```

### 6. Deployment Strategy
```
Create deployment plan for MyBonzo feature:

FEATURE: [describe feature]
CHANGES: [list file changes]
TESTING REQUIRED: [what needs testing]

Provide:
1. Pre-deployment checklist
2. Deployment commands (quick-sync.ps1, deploy-to-production.ps1)
3. Post-deployment verification
4. Rollback strategy if needed
5. Health check commands

Consider dual-repository workflow and production stability.
```

---

## 🎯 **SPECIALIZED PROMPTS**

### 7. AI Model Integration
```
Integrate new AI model into MyBonzo platform:

MODEL: [model name/provider]
USE CASE: [what it will be used for]
INTEGRATION POINT: [where in the app]

Requirements:
- Use Cloudflare Workers AI binding when possible
- Add fallback mechanisms
- Implement proper error handling with Sentry
- Follow MyBonzo API patterns
- Add cost optimization
- Include usage monitoring
```

### 8. Security & Monitoring
```
Enhance MyBonzo security for this component:

COMPONENT: [specify component/API]
SECURITY CONCERNS: [list concerns]

Implement:
- Proper secret management (Cloudflare dashboard secrets)
- Rate limiting strategies
- Input validation and sanitization
- Sentry error tracking and alerting
- CORS configuration if needed
- Authentication/authorization if required
```

### 9. Polish Content Generation
```
Generate Polish content for MyBonzo:

CONTENT TYPE: [interface text/documentation/error messages]
CONTEXT: [where it will be used]
TONE: [formal/casual/technical]

Requirements:
- Natural Polish language (native speaker level)
- Consistent with existing MyBonzo terminology
- Technical accuracy for AI/development terms
- User-friendly and clear
- Follow POLACZEK_* file conventions
```

### 10. Testing & Validation
```
Create comprehensive test suite for MyBonzo component:

COMPONENT: [specify what to test]
TEST TYPES: [unit/integration/e2e]

Include:
- Cloudflare Workers environment testing
- API endpoint testing with various inputs
- Error handling validation
- Performance benchmarks
- Production environment validation
- Cross-browser compatibility if UI component
```

---

## 🛠 **QUICK FIXES**

### TypeScript Errors
```
Fix TypeScript errors in MyBonzo:
ERROR: [paste error]
FILE: [file path]
LINE: [line number]

Provide quick fix maintaining type safety and MyBonzo patterns.
```

### Build Issues
```
Resolve MyBonzo build issue:
BUILD ERROR: [paste error]
COMMAND: [build command that failed]

Consider Astro 5 SSR configuration and Cloudflare adapter requirements.
```

### API Debugging
```
Debug API issue in MyBonzo:
ENDPOINT: [API endpoint]
PROBLEM: [describe issue]
REQUEST: [example request]
RESPONSE: [current response]

Analyze and fix with proper error handling and logging.
```

---

## 📊 **ANALYSIS PROMPTS**

### Code Review
```
Review this MyBonzo code for best practices:

CODE: [paste code]

Check for:
- MyBonzo architectural patterns
- Cloudflare Workers compatibility
- TypeScript best practices
- Performance optimization
- Security considerations
- Error handling completeness
- Polish language content quality
```

### Architecture Planning
```
Plan architecture for new MyBonzo feature:

FEATURE: [feature description]
REQUIREMENTS: [list requirements]
CONSTRAINTS: [list constraints]

Consider:
- Dual-repository workflow
- Cloudflare Pages/Workers limitations
- Existing agent system integration
- Performance and scalability
- Maintenance and deployment
```

---

## 🎯 **USAGE EXAMPLES**

```bash
# Quick bug fix
gemini "Fix TypeScript error in MyBonzo: Property 'AI' does not exist on type 'Env'"

# Feature development
gemini "Create weather API endpoint for MyBonzo using OpenWeatherMap API"

# Performance optimization
gemini "Optimize Tavily API integration in MyBonzo for better response times"

# Content generation
gemini "Generate Polish error messages for MyBonzo AI agent system"
```

---

## 📝 **NOTES**

- Always specify "MyBonzo" in prompts for proper context
- Include relevant file paths and error messages
- Mention specific technologies (Astro, Cloudflare, TypeScript)
- Request Polish language content when needed
- Consider dual-repository deployment workflow
- Focus on Cloudflare Workers environment specifics