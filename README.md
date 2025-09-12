# MyBonzo - AI-Powered Hub

🚀 **Zaawansowana aplikacja AI hub z polskim wsparciem językowym**

[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-orange)](https://www.mybonzo.com)
[![Astro](https://img.shields.io/badge/Astro-5.x-purple)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

## 🎯 Opis Projektu

MyBonzo to kompleksowa aplikacja webowa zbudowana w Astro z integracją Cloudflare, która funkcjonuje jako hub AI oferujący:

- 🤖 **Multi-AI Chat**: Bielik (polski), OpenAI, Anthropic, Google AI
- 🎨 **Generowanie Obrazów**: Stable Diffusion z artist wildcards
- 🎙️ **Voice AI**: Real-time voice processing i avatars
- 🧠 **AI Agents**: System zarządzania agentami AI
- 💼 **Business Tools**: Automatyzacja i analytics

## ⚡ Quick Start

### Wymagania
- Node.js (latest LTS)
- npm lub pnpm
- Cloudflare account (dla deployment)

### Instalacja i Uruchomienie
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# (Edit .env with your API keys)

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:4321
```

### Production Deployment
```bash
# Build i deploy do Cloudflare Pages
npm run build
npm run deploy
```

## 🔧 Kluczowe Komendy

```bash
# Development
npm run dev                 # Local dev server
npm run build              # Production build
npm run preview            # Preview production build

# Deployment  
npm run deploy             # Deploy do Cloudflare Pages
npm run deploy:all         # Deploy z workers

# Utilities
npm run cf-typegen         # Generate Cloudflare types
npm run test:api-keys      # Validate API keys
npm run backup             # Create backup
```

## 🏗️ Architektura

### Frontend
- **Astro 5.x**: SSR framework
- **React 19**: Client-side components  
- **Svelte 5**: Reactive UI
- **Tailwind CSS 4.x**: Styling

### Backend & Cloud
- **Cloudflare Pages**: Static hosting
- **Cloudflare Workers**: Serverless functions
- **Cloudflare AI**: Direct AI model access
- **Multiple AI Providers**: OpenAI, Anthropic, HuggingFace

### Key Features
- **Polish AI Support**: Bielik model integration
- **Image Generation**: Stable Diffusion pipeline
- **Voice AI**: Real-time audio processing
- **Progressive Web App**: PWA capabilities

## 📁 Struktura Projektu

```
src/
├── components/     # UI components (Astro/React/Svelte)
├── layouts/        # Page layouts
├── pages/          # Routes i API endpoints
│   └── api/        # Backend API routes
├── workers/        # Cloudflare Workers
├── agents/         # AI agents logic
└── lib/            # Shared utilities

public/             # Static assets
wrangler.jsonc      # Cloudflare configuration
astro.config.mjs    # Astro configuration
```

## 🔐 Environment Variables

Aplikacja wymaga skonfigurowania API keys w pliku `.env`:

```bash
# Core AI
OPENAI_API_KEY=your-key-here
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_ACCOUNT_ID=your-account-id

# Polish AI (HuggingFace)
# Bielik model integration

# External Services
TAVILY_API_KEY=your-tavily-key
GITHUB_TOKEN=your-github-token

# See .env.example dla complete list (40+ variables)
```

## 🌐 Live Demo

**Production Site**: [https://www.mybonzo.com](https://www.mybonzo.com)

### Główne Funkcje
- **Chat AI**: `/` - Main chat interface z Bielik AI
- **Image Generator**: `/image-generator` - AI image creation
- **Voice AI**: `/voice-avatar-new` - Voice avatar interface  
- **Admin Panel**: `/admin` - System monitoring
- **AI Agents**: `/agents` - Agent management

## 🤖 AI Models

### Polski Język
- **Bielik**: HuggingFace Polish model
- **Polaczek**: Dedykowany assistant

### Międzynarodowe
- **OpenAI**: GPT models
- **Anthropic**: Claude models  
- **Google**: Gemini models
- **DeepSeek**: Advanced search AI

## 📊 Performance & Monitoring

### Built-in Monitoring
- **Health Check**: `/api/health`
- **Admin Status**: `/api/admin/status`  
- **Workers Status**: `/api/admin/workers-status`

### Performance Features
- Code splitting i lazy loading
- Image optimization
- Service worker caching
- Edge deployment (Cloudflare)

## 🛠️ Development

### Local Development
1. Setup environment variables
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Visit: `http://localhost:4321`

### Adding New Features
1. Create components w `src/components/`
2. Add pages w `src/pages/`
3. Configure API routes w `src/pages/api/`
4. Update workers w `src/workers/` (if needed)

## 🔒 Security

- Environment variables dla API keys
- CORS configuration
- Rate limiting (Cloudflare)
- Secure authentication flows

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

Internal project dla MyBonzo team.

## 📞 Support

For technical support, contact the development team.

---

**🌟 MyBonzo - Polskie AI na poziomie światowym!**
