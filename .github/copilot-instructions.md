# GitHub Copilot Instructions for ZENON_Biznes_HUB

## Project Overview

**ZENON_Biznes_HUB** (formerly "AI Biznes Start") is a comprehensive AI-powered business tools platform designed specifically for Polish-speaking beginning entrepreneurs, freelancers, and small businesses. The platform provides 8+ business tools with AI capabilities, all in Polish language without technical jargon.

**Key Characteristics:**
- **Target Audience**: Polish entrepreneurs with no technical background
- **Language**: All UI, documentation, and content in Polish
- **Focus**: Simple, effective, and user-friendly business tools
- **AI Integration**: Uses Google Generative AI (Gemini) for content generation

## Tech Stack

### Core Framework
- **Astro 4.15.12**: Static Site Generator with Server-Side Rendering
  - Output mode: `static` (for Cloudflare Pages deployment)
  - File-based routing in `src/pages/`
  
### Frontend
- **React 18.3.1**: For interactive components (all in `src/components/`)
- **TypeScript 5.9.3**: Strict typing throughout the project
- **Tailwind CSS 3.4.14**: Utility-first styling with custom business theme

### Key Libraries
- **Framer Motion**: Animations and transitions
- **Lucide React**: Icon library (preferred over other icon sets)
- **React Markdown**: For rendering AI-generated markdown content
- **jsPDF + jsPDF-autotable**: PDF generation for invoices/documents
- **XLSX**: Excel file generation
- **Recharts & D3**: Data visualization

### AI & APIs
- **@google/generative-ai**: Google Gemini API integration
- API endpoints in `src/pages/api/` using Astro's API routes

### Deployment
- **Cloudflare Pages**: Primary hosting platform
- **Wrangler**: CLI tool for Cloudflare deployment

## Project Structure

```
src/
├── pages/                    # File-based routing (Astro)
│   ├── index.astro          # Home page
│   ├── narzedzia/           # Tools pages
│   │   ├── index.astro      # Tools listing
│   │   ├── generator-tresci.astro
│   │   ├── asystent-email.astro
│   │   ├── organizer-zadan.astro
│   │   ├── kalkulator-biznesowy.astro
│   │   └── [other-tools].astro
│   └── api/                 # API endpoints (TypeScript)
│       ├── generate-content.ts
│       ├── generate-email.ts
│       └── [other-apis].ts
│
├── components/              # React components
│   ├── narzedzia/          # Tool components (main business logic)
│   ├── animations/         # Animation components
│   └── [shared-components].tsx
│
├── layouts/                # Page layouts
│   └── MainLayout.astro    # Main site layout with header/footer
│
├── styles/                 # Global styles
│   └── global.css         # Tailwind directives + custom CSS
│
└── utils/                  # Utility functions

public/                     # Static assets
├── apple-touch-icon.png   # App icon
├── favicon.ico
└── music/                 # MP3 files for music player

docs/                       # Documentation files
```

## Coding Conventions

### File Naming
- **Astro pages**: `kebab-case.astro` (e.g., `generator-tresci.astro`)
- **React components**: `PascalCase.tsx` (e.g., `GeneratorTresci.tsx`)
- **API routes**: `kebab-case.ts` (e.g., `generate-content.ts`)
- **Utilities**: `camelCase.ts`

### Language Guidelines
- **All UI text**: Polish language
- **Code comments**: English or Polish (Polish preferred for business logic)
- **Variable/function names**: English (standard programming convention)
- **Documentation**: Polish for user-facing, English for technical

### React Components
- Use **functional components** with hooks
- **TypeScript interfaces** for props (named `[ComponentName]Props` or inline)
- State management: `useState` for local state, consider adding stores in `src/store/` if needed
- Use **Framer Motion** for animations when appropriate
- Client directives in Astro: `client:load` for interactive components

Example structure:
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  title: string;
  optional?: boolean;
}

const MyComponent = ({ title, optional = false }: MyComponentProps) => {
  const [state, setState] = useState('');
  
  return (
    <motion.div className="card">
      {/* Component content */}
    </motion.div>
  );
};

export default MyComponent;
```

### Astro Pages
- Use frontmatter (`---`) for imports and logic
- Keep page-level logic minimal - delegate to components
- Use `MainLayout.astro` as the standard layout
- Always set proper `title` and optional `description` props

Example structure:
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import MyComponent from '../components/MyComponent';
---

<MainLayout title="Tytuł Strony" description="Opis strony">
  <MyComponent client:load />
</MainLayout>
```

### Styling with Tailwind

**Custom Theme Colors** (defined in `tailwind.config.mjs`):
- `primary-{50-900}`: Primary blue palette
- `business-dark`: #000000 (main background)
- `business-surface`: #0a0a0a (card backgrounds)
- `business-border`: #1a1a1a (borders)
- `business-text`: #e8eaf0 (main text)
- `business-text-dim`: #9ca3af (secondary text)
- `business-accent`: #00d9ff (cyan accent)
- `business-accent-soft`: #4ade80 (green accent)

**Common CSS Classes** (from `global.css`):
- `.card`: Standard card container with gradient border
- `.btn-primary`: Primary action button
- `.btn-secondary`: Secondary button
- `.card-gradient`: Card with gradient background
- `.glass-effect`: Glassmorphism effect

**Animation Classes**:
- `animate-float`: Floating animation
- `shadow-glow`: Glowing shadow effect
- `shadow-glow-soft`: Soft glow effect

### API Routes

API routes follow Astro's API route pattern:
- Located in `src/pages/api/`
- Export HTTP method handlers: `POST`, `GET`, etc.
- Return `Response` objects with proper headers
- Handle errors gracefully with Polish error messages

Example structure:
```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Your logic here
    
    return new Response(
      JSON.stringify({ result: 'success' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Błąd serwera' }),
      { status: 500 }
    );
  }
};
```

## Building and Testing

### Development
```bash
npm run dev          # Start dev server at http://localhost:4321
npm run start        # Alias for dev
```

### Building
```bash
npm run build        # Type check + build
npm run build:fast   # Build without type check
npm run preview      # Preview production build
```

### Type Checking
```bash
npm run astro check  # Check TypeScript types
```

### Deployment
```bash
npm run deploy       # Build and deploy to Cloudflare Pages
```

**Note**: The project may have existing build errors unrelated to new changes. Focus on ensuring your changes don't introduce new errors.

## Environment Variables

Required environment variables (in `.env` - never commit this file):
- `OPENAI_API_KEY`: OpenAI API key (legacy, may not be used)
- `GOOGLE_API_KEY`: Google Generative AI (Gemini) API key (primary AI backend)
- `CLOUDFLARE_ACCOUNT_ID`: For deployment
- `CLOUDFLARE_API_TOKEN`: For deployment

## Common Patterns

### Adding a New Tool
1. Create component in `src/components/narzedzia/MyTool.tsx`
2. Create page in `src/pages/narzedzia/my-tool.astro`
3. If AI needed, create API endpoint in `src/pages/api/my-tool.ts`
4. Add tool to listings in `index.astro` and `narzedzia/index.astro`
5. Use appropriate icons from Lucide React
6. Ensure all text is in Polish

### AI Integration Pattern
- Use Google Generative AI (Gemini) via `@google/generative-ai`
- API calls go through API routes (not directly from components)
- Show loading states during AI generation
- Handle errors gracefully with Polish error messages
- Display generated content using `ReactMarkdown`

### Form Handling
- Use controlled components with `useState`
- Validate inputs before submission
- Show clear Polish error messages
- Disable submit button during loading
- Provide visual feedback (loading spinners, success messages)

### Data Persistence
- Use `localStorage` for client-side data persistence
- Store as JSON with proper error handling
- Consider data migration strategies when updating schemas

## Icons and Assets

### Icons
- **Primary**: Lucide React icons
- Use `IconWrapper` component for consistent icon rendering
- Standard size: 20-24px
- Colors: Match Tailwind theme (business-accent, primary-500, etc.)

### Images
- Logo: `/apple-touch-icon.png`
- Favicon: `/favicon.ico`
- Store static assets in `public/` directory

## Important Notes

### What to Change
- Add new features and tools as requested
- Fix bugs related to your changes
- Update documentation when adding features
- Improve user experience with Polish language focus

### What NOT to Change
- **Do not** remove existing working functionality
- **Do not** fix unrelated bugs or broken tests
- **Do not** change the core tech stack without explicit request
- **Do not** modify `.env` files (they're gitignored)
- **Do not** commit `node_modules/` or `dist/` (they're gitignored)
- **Do not** add new dependencies unless necessary and explicitly requested

### Security Considerations
- Never commit API keys or secrets
- Validate all user inputs
- Sanitize data before displaying
- Use proper CORS settings for API routes
- Keep dependencies updated for security patches

## Testing Guidelines

Currently, the project does not have automated tests. When adding tests:
- Focus on critical business logic
- Test API endpoints thoroughly
- Consider E2E tests for main user flows
- Test with Polish language content

## Accessibility

- Use semantic HTML elements
- Ensure proper heading hierarchy
- Add ARIA labels where appropriate
- Maintain good color contrast
- Support keyboard navigation

## Performance Considerations

- Keep bundle sizes small (code splitting already configured in `astro.config.mjs`)
- Optimize images (consider using Astro's Image component)
- Lazy load heavy components
- Minimize API calls
- Use React's `useMemo` and `useCallback` when appropriate

## Git Workflow

- Keep commits focused and atomic
- Write clear commit messages in English or Polish
- Test changes locally before committing
- Ensure build passes before pushing

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Google Generative AI Documentation](https://ai.google.dev)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)

---

**Remember**: This platform serves Polish entrepreneurs who may not be tech-savvy. Prioritize simplicity, clarity, and user-friendliness in all changes. All user-facing text must be in Polish.
