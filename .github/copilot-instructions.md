# MyBonzo AI System - Copilot Instructions

## Project Overview

MyBonzo is a comprehensive AI-powered web application built with Astro, React, and Svelte, deployed on Cloudflare Pages. This is the **development repository** (`luc-de-zen-on`) for testing and experimentation before production deployment.

**Key Information:**
- **Framework**: Astro ^5.14.6 with SSR (Server-Side Rendering)
- **UI Libraries**: React ^18.3.1, Svelte ^5.22.1, Tailwind CSS ^3.4.17
- **Deployment**: Cloudflare Pages with Workers runtime
- **Package Manager**: npm (used in scripts), pnpm also supported
- **Languages**: TypeScript ^5.9.2, JavaScript (ES Modules)

## Project Structure

```
luc-de-zen-on/
├── src/
│   ├── pages/              # Astro pages and API routes
│   ├── components/         # React/Svelte/Astro components
│   │   └── agents/         # AI agent components
│   ├── layouts/            # Page layouts
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── .github/
│   ├── copilot-instructions.md  # This file
│   └── instructions/       # Additional instruction files (e.g., codacy)
├── astro.config.mjs        # Main Astro configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── wrangler.toml           # Cloudflare Workers configuration
```

## Build and Development

### Prerequisites
- Node.js 18+ or 20+
- npm (primary package manager) or pnpm
- Cloudflare account (for deployment)

### Setup
```bash
# Install dependencies
npm install

# Start development server (includes agent build)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Key Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build agents and Astro project for production
- `npm run build:agents` - Build agent components separately
- `npm run check` - Type-check and build the project
- `npm run deploy` - Deploy to Cloudflare Pages using Wrangler

### Agent System
The project uses a custom agent build system via Rollup:
```bash
# Build agents (automatic with dev/build)
npm run build:agents

# Watch mode for agent development
npm run build:agents:watch
```

## Testing

### Available Tests
```bash
# Test all components
npm run test:all

# Test specific features
npm run test:images      # Image generation
npm run test:homepage    # Homepage audio features
npm run test:api-keys    # Validate API key configuration
```

### Running Tests
- Tests are located in `src/tests/` directory
- Some tests may require API keys in `.env` or Cloudflare secrets
- Development tests run against `luc-de-zen-on.pages.dev`

## Code Style and Conventions

### TypeScript
- Use TypeScript for new files when possible
- TypeScript ^5.9.2 with strict mode (extends `astro/tsconfigs/strict`)
- Path alias: `@/*` maps to `src/*`
- JSX configured for React (`"jsx": "react-jsx"`)

### Component Guidelines
- **Astro components**: Use `.astro` extension for page-level components
- **React components**: Use `.jsx` or `.tsx` for interactive UI components
- **Svelte components**: Use `.svelte` for reactive components with minimal overhead

### File Naming
- Components: PascalCase (e.g., `ImageGenerator.jsx`)
- Utilities: camelCase (e.g., `loadEnv.js`)
- Pages: kebab-case (e.g., `api-test-panel.astro`)
- Configuration: lowercase with extensions (e.g., `astro.config.mjs`)

### Styling
- Use Tailwind CSS utility classes
- Tailwind config is in `tailwind.config.mjs`
- Custom styles can be added to component files
- Prefer composition over custom CSS

## Environment and Secrets

### Cloudflare Pages Runtime Pattern
**Important**: Secrets must be accessed through the Cloudflare runtime context, not build-time environment variables.

```javascript
// ✅ CORRECT - Runtime access in API routes
export async function POST({ locals }) {
  const apiKey = locals.runtime?.env?.DEEPSEEK_API_KEY;
}

// ❌ INCORRECT - Build-time only
const apiKey = import.meta.env.DEEPSEEK_API_KEY;
```

### API Integrations
The project integrates with multiple AI services:
- **DeepSeek**: Chat and AI completions
- **Google Vertex AI**: Advanced AI models
- **Kaggle**: Dataset access
- **Tavily**: AI-powered search
- **OpenAI**: GPT models
- **Gemini**: Google's AI models

All API keys should be configured in Cloudflare Pages secrets.

## Deployment Workflow

### Development to Production Flow
1. **All changes** start in `luc-de-zen-on` (this repo)
2. **Test** on `luc-de-zen-on.pages.dev`
3. **Validate** using monitoring endpoints:
   - `/api/health-check` - Internal API status
   - `/api/test-connections` - External API testing
   - `/api/api-list` - API catalog
4. **Deploy to production** only through deployment scripts (when stable)

### Deployment Commands
```bash
# Validate build
pnpm build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name="luc-de-zen-on"
```

## Common Tasks

### Adding New Dependencies
```bash
npm install <package-name>           # Production dependency
npm install -D <package-name>        # Development dependency
```

After adding dependencies:
1. Run `npm run build` to ensure compatibility
2. Check if any Vite SSR externals need updating in `astro.config.mjs`
3. Test on development environment before deploying

### Creating New API Endpoints
1. Create file in `src/pages/api/` directory
2. Export `GET`, `POST`, etc. functions
3. Add to `PUBLIC_PATHS` in middleware if needed
4. Access secrets via `locals.runtime.env`
5. Test with curl or Postman

### Adding New UI Components
1. Choose appropriate framework (Astro/React/Svelte)
2. Place in `src/components/` with descriptive subdirectory
3. Follow existing component patterns
4. Use Tailwind for styling
5. Export components properly for reuse

## Troubleshooting

### Build Issues
- Clear `.astro` cache: `rm -rf .astro`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Check for SSR compatibility of new packages

### Runtime Errors
- Verify secrets are set in Cloudflare Pages dashboard
- Check Cloudflare Pages Functions logs
- Ensure Node.js built-ins are externalized in Vite SSR config
- Test locally with `wrangler dev`

### Type Errors
- Run `npm run check` to see all type issues
- Generate Cloudflare types: `npm run cf-typegen` (runs `wrangler types`)
- Ensure TypeScript version is compatible (^5.9.2)

## Important Notes

### Production Safety
- **NEVER** commit directly to production repository
- **ALWAYS** test on development before production
- **ONLY** working features go to production
- **BACKUP** - production is always the last stable version

### File Modifications
- Don't delete or modify working components without understanding their dependencies
- Check for usage with search before removing files
- Update documentation when making significant changes

### Documentation
Key documentation files:
- `AGENT_BRIEFING.md` - Complete project context and architecture
- `DEVELOPMENT_WORKFLOW_GUIDE.md` - Team development workflow
- `src/components/agents/AGENTS_DOCUMENTATION.md` - Agent system docs

## Getting Help

If you encounter issues:
1. Check `AGENT_BRIEFING.md` for project context
2. Review recent deployment status files
3. Check Cloudflare Pages dashboard for runtime logs
4. Test API endpoints using `/api/test-connections`
5. Consult team documentation in project root

---

**Last Updated**: November 2025
**Deployment URL**: https://70b5b004.luc-de-zen-on.pages.dev
**Status**: Active Development
