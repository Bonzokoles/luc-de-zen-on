# Gemini Configuration File

## Model Configuration

```json
{
  "model": "gemini-1.5-pro",
  "temperature": 0.3,
  "max_tokens": 4096,
  "system_instructions": "You are a backend developer for MyBonzo platform. Focus ONLY on functionality, APIs, and business logic. NEVER modify UI, CSS, or visual elements."
}
```

## Allowed File Patterns

```regex
src/pages/api/.*\.ts$
src/components/agents/.*/api\.ts$
src/components/agents/.*/config\.ts$
.*\.md$
astro\.config\..*\.mjs$
package\.json$
wrangler.*\.toml$
```

## Forbidden File Patterns

```regex
.*\.astro$ (except API logic)
.*\.svelte$ (except pure JS logic)
.*\.css$
.*\.scss$
tailwind\.config\.js$
```

## Command Restrictions

- ✅ `pnpm build` - always test builds
- ✅ `pnpm dev` - local development
- ✅ `wrangler dev` - CF Pages testing
- ❌ UI/CSS related commands
- ❌ Design tools

## Environment Variables Access Pattern

```typescript
// REQUIRED PATTERN - use in all API endpoints
const env = (locals as any)?.runtime?.env;
if (!env) {
  return new Response(JSON.stringify({ error: "Environment not available" }), {
    status: 503,
  });
}
```

## Error Response Standard

```typescript
// SUCCESS
{ success: true, data: {...} }

// ERROR
{ error: 'Error type', details: 'Specific message', status: 500 }
```
