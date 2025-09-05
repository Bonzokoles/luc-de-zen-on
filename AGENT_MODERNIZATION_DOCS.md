# 🤖 MyBonzo AI Agent - Dokumentacja Modernizacji

## 📋 Przegląd

MyBonzo AI Agent to zaawansowany system AI oparty na Cloudflare Agents SDK, który zapewnia:

- **Real-time WebSocket communication** - streaming responses
- **Persistent conversation memory** - historia zachowywana w Durable Objects
- **Multi-model AI support** - OpenAI GPT-4 + Cloudflare Workers AI
- **Integrated tools** - generowanie obrazów, tłumaczenie, scheduled tasks
- **Enterprise-grade architecture** - skalowalne, bezpieczne, wydajne

## 🏗️ Architektura

### Komponenty główne:

1. **MyBonzoAgent Class** (`src/workers/mybonzo-agent.ts`)
   - Rozszerza klasę `Agent` z Agents SDK
   - Obsługuje WebSocket connections
   - Zarządza persistent state w Durable Objects
   - Integruje różne AI models

2. **Agent Router** (`src/workers/index.ts`)
   - Główny entry point dla Workers
   - Routing pattern: `/agents/:agent/:name`
   - API endpoints dla health check i status

3. **Frontend Client** (`src/pages/ai-agent-chat.astro`)
   - Nowoczesny UI z design system MyBonzo
   - Real-time chat interface
   - Narzędzia: generowanie obrazów, tłumaczenie
   - Persistent connection management

## 🔧 Konfiguracja

### Wrangler.toml
```toml
# Durable Objects bindings dla Agents SDK
[[durable_objects.bindings]]
name = "MYBONZO_AGENT"
class_name = "MyBonzoAgent"

# Migracje dla Agent state storage
[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyBonzoAgent"]
```

### Zmienne środowiskowe (.env)
```env
OPENAI_API_KEY=your_openai_api_key
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## 🚀 Funkcjonalności

### 1. Real-time Chat
- **Streaming responses** - chunks wysyłane przez WebSocket
- **Multi-model support** - wybór między OpenAI GPT-4 a Cloudflare AI
- **Conversation memory** - historia zachowywana między sesjami
- **Typing indicators** - real-time status

### 2. Image Generation
- **Integrated workflow** - generowanie bezpośrednio z chatu
- **R2 storage** - automatyczne zapisywanie obrazów
- **Multiple models** - Flux-1, Stable Diffusion, DreamShaper
- **Metadata tracking** - prompt, parametry, timestamp

### 3. Translation Service
- **Polish-English dictionary** - 150+ słów
- **Context-aware** - inteligentne tłumaczenie
- **UTF-8 normalization** - obsługa polskich znaków
- **Bidirectional** - PL↔EN

### 4. Persistent State
- **Durable Objects** - każdy Agent ma własny persistent state
- **SQLite storage** - wbudowana baza danych
- **Session management** - automatyczne odzyskiwanie po rozłączeniu
- **Preferences** - ustawienia użytkownika

## 📡 WebSocket Protocol

### Connection
```javascript
const ws = new WebSocket('ws://localhost:4326/agents/mybonzo-agent/{sessionId}');
```

### Message Types

#### Chat Message
```json
{
  "type": "chat",
  "message": "Hello MyBonzo!",
  "useOpenAI": false,
  "language": "polish"
}
```

#### Image Generation
```json
{
  "type": "generate_image",
  "prompt": "beautiful sunset",
  "width": 512,
  "height": 512
}
```

#### Translation
```json
{
  "type": "translate",
  "text": "Dzień dobry",
  "sourceLanguage": "polish",
  "targetLanguage": "english"
}
```

### Response Types

#### Chat Chunk (Streaming)
```json
{
  "type": "chat_chunk",
  "content": "Hello! How can I help you today?",
  "isDone": false
}
```

#### Welcome Message
```json
{
  "type": "welcome",
  "sessionId": "session-123",
  "conversationHistory": [...],
  "capabilities": ["Real-time AI chat", "Image generation", ...]
}
```

## 🎨 Design System Integration

Nowy Agent Chat zachowuje spójny design z resztą MyBonzo Platform:

### Kolory i style:
- **Primary**: `hsl(var(--themeColor), 20%, 8%)`
- **Accent**: `hsl(var(--themeColor), 100%, 50%)`
- **Borders**: `rgba(0,0,0,0.5)` z border-edge
- **Typography**: Rajdhani font family

### Komponenty UI:
- **Messages**: Gradient user messages, assistant w dark theme
- **Buttons**: Hover effects z cyan accent
- **Status indicators**: Real-time connection status
- **Typing animation**: Animated dots

## 🔄 Porównanie: Stare vs Nowe

### Przed modernizacją:
- ❌ Podstawowe Workers (HTTP request/response)
- ❌ Brak persistent state
- ❌ Proste API endpoints
- ❌ Brak real-time communication

### Po modernizacji:
- ✅ Agents SDK z Durable Objects
- ✅ Persistent conversation memory
- ✅ WebSocket streaming
- ✅ Enterprise-grade architecture
- ✅ Integrated tools ecosystem

## 📊 Performance Benefits

1. **Persistent Connections** - eliminuje overhead łączenia
2. **Streaming Responses** - redukcja perceived latency
3. **Local State** - brak potrzeby external database
4. **Autonomous Operations** - Agent może działać niezależnie

## 🛠️ Development Workflow

### Lokalne uruchomienie:
```bash
npm run dev  # Astro dev server (port 4326)
```

### Deploy to production:
```bash
npm run build
wrangler pages deploy ./dist
```

### Testing Agents:
```bash
# Health check
curl http://localhost:4326/health

# Agent status
curl http://localhost:4326/api/agents/status
```

## 🔮 Przyszłe rozszerzenia

1. **Multi-Agent Coordination** - komunikacja między Agentami
2. **Scheduled Tasks** - autonomiczne operacje
3. **Tool Ecosystem** - rozszerzenie MCP tools
4. **Browser Integration** - web scraping capabilities
5. **Memory Networks** - advanced conversation context

---

**Modernizacja zakończona!** 🎉

MyBonzo AI Platform posiada teraz enterprise-grade Agent system zgodny z najnowszymi standardami Cloudflare.
