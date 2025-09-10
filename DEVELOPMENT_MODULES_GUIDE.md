# Modular Development Guide

This project is organized by functional verticals ("modules") that map to user-facing capabilities and deploy units (Astro API endpoints, Workers, UI pages/components).

## Module Taxonomy
| Module | Scope | Key Paths |
|--------|-------|----------|
| Image Generation | PNG generation via Cloudflare AI | `src/pages/api/generate-image.ts`, `src/utils/imageGeneration.ts`, `src/pages/image-generator.astro` |
| Chat / LLM | Text chat endpoints | `src/pages/api/chat.ts`, other `/api/*` LLM routes |
| Music / Audio Visualizer | Background audio + analyser | `src/components/BackgroundMusicPlayerSimple.svelte` + visualizer components |
| Agents | KV-backed agent configs | `src/workers/agents-api.ts`, KV namespaces |
| Voice / Realtime | Voice synthesis, streaming | `wrangler-voice-*.toml`, associated Workers |

## Lifecycle for a Change
1. Design: update related markdown (or add a short comment) BEFORE coding if behavior changes externally.
2. Implement: touch only module-owned files + shared utils.
3. Test: add/extend a test in `src/tests/<module>-*.test.js`.
4. Document: update module doc (`IMAGE_GENERATOR.md`, etc.).
5. Commit: use conventional commit prefix.
6. Deploy: run `pnpm build` → `pnpm deploy` (or targeted Worker deploy).

## Conventional Commit Prefixes
| Type | Meaning | Example |
|------|---------|---------|
| feat | New user-visible capability | `feat(image-gen): add upscale param` |
| fix | Bug resolution | `fix(music): prevent double context resume` |
| refactor | Internal restructuring | `refactor(agents): KV key normalization` |
| chore | Tooling / scripts | `chore(tests): add homepage probe` |
| docs | Documentation only | `docs(modules): clarify deploy flow` |

## Testing Strategy
- Fast API tests (no bundler): Node `fetch` scripts under `src/tests`.
- Keep each test independent & idempotent.
- For new endpoint: create `<endpoint>.test.js` covering:
  - Success path (status 200 / expected content-type).
  - Validation error path.
  - Edge / boundary (timeouts, fallback model, etc.).

## Image Generation Rules
- Output: Always `image/png`.
- Model selection: central in `imageGeneration.ts`.
- Any new model → update allowed list + tests.

## Music Module Rules
- Maintain `window.MUSIC.getAnalyser()` contract.
- Only one analyser allocated; reuse context.

## Deployment Flow (Pages)
```
pnpm install
pnpm test:all   # must pass
pnpm build
pnpm deploy
```

## Worker Deployment (Targeted)
```
npx wrangler deploy --config wrangler-<worker>.toml
```

## Rollback Procedure
1. Identify last known good commit hash.
2. Create hotfix branch: `git checkout -b hotfix/<date>-<issue> <hash>`.
3. Cherry-pick any critical forward fixes.
4. Deploy and tag.

## Observability TODOs (Future)
- Add lightweight `/api/health` returning status of core modules.
- Introduce structured logs for AI generation latency.

---
Last updated: 2025-09-10
