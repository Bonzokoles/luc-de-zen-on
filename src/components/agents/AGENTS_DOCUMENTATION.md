# 🤖 Modular Agents System - Architecture

## 📋 Overview

This is a completely modular agent system where each agent is self-contained and easily extensible.

## 🏗️ Structure

```
src/agents/
├── agent-01-voice-command/     # Voice recognition & commands
├── agent-02-music-control/     # Audio streaming & playlists  
├── agent-03-system-monitor/    # Performance & health monitoring
├── agent-04-web-crawler/       # Automated web scraping
├── agent-05-file-manager/      # Document & file operations
├── agent-06-database-query/    # SQL & NoSQL data analysis
├── agent-07-email-handler/     # SMTP & newsletter automation
├── agent-08-security-guard/    # Auth & threat detection
├── agent-09-openai-gpt/        # OpenAI GPT integration
├── agent-10-claude-ai/         # Anthropic Claude integration
├── agent-11-gemini-pro/        # Google Gemini integration
├── agent-12-polaczek-local/    # Local Polish AI assistant
├── agent-13-code-reviewer/     # Automated code analysis
├── agent-14-content-writer/    # Content generation AI
├── agent-15-data-analyst/      # Advanced analytics
├── agent-16-translator/        # Multi-language translation
└── _templates/                 # Agent templates for new agents
```

## 📁 Standard Agent Structure

```
agent-XX-name/
├── index.astro                 # Agent page (max 200 lines)
├── api.ts                      # API endpoint (max 150 lines)
├── component.svelte           # UI component (max 200 lines)
├── config.ts                  # Configuration (max 50 lines)
├── README.md                  # Agent documentation
└── assets/                    # Agent-specific assets
    ├── styles.css
    ├── icons/
    └── data/
```

## 🎯 Agent Standards

### API Pattern

```typescript
// Every agent follows this API pattern
export const POST: APIRoute = async ({ request }) => {
  const { action, data } = await request.json();
  
  switch (action) {
    case 'test':
      return testAgent();
    case 'execute':
      return executeAgent(data);
    case 'status':
      return getAgentStatus();
    default:
      return errorResponse('Invalid action');
  }
};
```

### Config Pattern

```typescript
// Every agent has standardized config
export const AGENT_CONFIG = {
  id: 'agent-XX-name',
  name: 'Agent Name',
  version: '1.0.0',
  description: 'What this agent does',
  status: 'active' | 'development' | 'disabled',
  capabilities: ['capability1', 'capability2'],
  dependencies: [],
  ports: { api: 3001, ws: 3002 }
};
```

## 🔄 MCP Services Integration

```
mcp-services/
├── mcp-duckdb/                # Database queries
├── mcp-paypal/                # Payment processing  
├── mcp-huggingface/           # AI models & datasets
├── mcp-memory/                # Knowledge graph
├── mcp-github/                # Repository management
├── mcp-analytics/             # Data visualization
├── mcp-search/                # Elasticsearch integration
└── mcp-files/                 # Document management
```

## 🚀 Development Workflow

1. **Copy agent template**: `cp -r _templates/basic-agent agent-XX-new-name/`
2. **Update config**: Edit `config.ts` with agent details
3. **Implement API**: Add logic to `api.ts`
4. **Build UI**: Create interface in `component.svelte`
5. **Add to registry**: Update main agents registry
6. **Test**: Run agent tests and integration
7. **Deploy**: Agent auto-registers on next build

## 🎛️ Agent Registry

All agents auto-register through a central registry that enables:

- Dynamic agent discovery
- Health monitoring
- Load balancing
- Hot-swapping
- Version management

## 🔧 Benefits

- **Modularity**: Each agent is completely independent
- **Scalability**: Easy to add/remove agents without affecting others  
- **Maintainability**: Small files are easy to debug and modify
- **Reusability**: Standard patterns reduce development time
- **Hot-reload**: Changes to one agent don't require full rebuild
