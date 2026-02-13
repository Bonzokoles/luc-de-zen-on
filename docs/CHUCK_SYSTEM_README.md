# CHUCK System - AI Workflow Orchestration Platform

CHUCK is a comprehensive AI workflow orchestration platform that enables users to build, execute, and manage complex workflows using 140+ AI tools.

## Features

### 🎯 Core Components

1. **Tools Database** (`lib/tools.json`)
   - 140+ AI tools across 20+ categories
   - Text generation, image/video creation, code generation, automation, and more
   - Compatibility scoring for tool combinations

2. **Universal Node System** (`src/nodes/universal.ts`)
   - **AI_AGENT**: Delegates to CHUCK API for AI operations
   - **PROCESSOR**: Data transformation, scraping, filtering
   - **OUTPUT**: Multi-channel delivery (email, PDF, Slack, webhook)

3. **Execution Engine** (`src/executionEngine.ts`)
   - Topological sort for dependency resolution
   - Retry logic with exponential backoff
   - Cycle detection and validation
   - Real-time workflow scoring (0-100%)

4. **Workflow Scoring** (`lib/workflowScoring.ts`)
   - Structure analysis
   - Tool compatibility checking
   - Efficiency scoring
   - Cycle detection

5. **Cloudflare Workers Proxy** (`workers/chuck-proxy.js`)
   - Supabase email authentication
   - Rate limiting (10 req/min per user via KV)
   - Secure tunnel proxy to local CHUCK API

6. **MyBonzo Dashboard** (`pages/index.tsx`)
   - Interactive tools grid with search/filter
   - Visual workflow builder
   - Monaco code editor for plugins
   - Billing integration (Stripe)

7. **Client Library** (`client/src/lib/chuckClient.ts`)
   - TypeScript client for CHUCK API
   - Authentication handling
   - Rate limit awareness
   - Error handling

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm install @monaco-editor/react
```

### 2. Set Up Environment Variables

Create `.env`:
```bash
PUBLIC_CHUCK_API_URL=https://api.mybonzo.com/chuck/exec
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Locally

```bash
npm run dev
```

Visit http://localhost:4321

### 4. Deploy

See [Deployment Guide](./docs/MYBONZO_DEPLOYMENT.md) for complete instructions.

## Architecture

```
┌─────────────────────────────────────────────┐
│         MyBonzo Dashboard (React)           │
│  - Tools Grid (140+ tools)                  │
│  - Workflow Builder                         │
│  - Plugin Manager                           │
│  - Billing                                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      CHUCK Client (chuckClient.ts)          │
│  - API communication                        │
│  - Auth & rate limit handling               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│    Cloudflare Workers (chuck-proxy.js)      │
│  - Supabase auth verification               │
│  - KV rate limiting                         │
│  - Tunnel proxy                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Cloudflared Tunnel (secure)            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      CHUCK API (localhost:5152)             │
│  - Execution Engine                         │
│  - Universal Nodes                          │
│  - Workflow Scoring                         │
└─────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Simple AI Agent Workflow

```typescript
import { ChuckClient } from './client/src/lib/chuckClient';

const client = new ChuckClient({
  apiUrl: 'https://api.mybonzo.com/chuck/exec'
});

client.setAuthToken('your-jwt-token');

const result = await client.execTool('openai-gpt4', {
  prompt: 'Explain quantum computing in simple terms'
});

console.log(result.data);
```

### Example 2: Multi-Step Workflow

```typescript
import { executeWorkflow } from './src/executionEngine';
import { createAIAgentNode, createOutputNode } from './src/nodes/universal';

const workflow = {
  workflowId: 'content-generator',
  nodes: [
    createAIAgentNode('node1', 'openai-gpt4', {
      prompt: 'Write a blog post about AI'
    }),
    createOutputNode('node2', 'email', {
      emailConfig: {
        to: 'user@example.com',
        subject: 'Your AI-Generated Content'
      }
    })
  ],
  edges: [
    { from: 'node1', to: 'node2' }
  ]
};

const result = await executeWorkflow(workflow);
```

### Example 3: Data Processing Pipeline

```typescript
import { createProcessorNode, createOutputNode } from './src/nodes/universal';

const workflow = {
  workflowId: 'data-pipeline',
  nodes: [
    createProcessorNode('scrape', 'scrape', {
      scrapeConfig: {
        url: 'https://example.com/data',
        method: 'api'
      }
    }),
    createProcessorNode('transform', 'transform', {
      transformConfig: {
        mapping: {
          title: 'name',
          content: 'description'
        }
      }
    }),
    createProcessorNode('export', 'export', {
      exportConfig: {
        format: 'csv'
      }
    }),
    createOutputNode('output', 'storage', {
      storageConfig: {
        provider: 'cloudflare-r2',
        path: 'exports/data.csv'
      }
    })
  ],
  edges: [
    { from: 'scrape', to: 'transform' },
    { from: 'transform', to: 'export' },
    { from: 'export', to: 'output' }
  ]
};

const result = await executeWorkflow(workflow);
```

## Tool Categories

- **Text Generation**: GPT-4, Claude, Gemini, Llama, Mistral
- **Image Generation**: DALL-E, Midjourney, Stable Diffusion
- **Video Generation**: Runway, Synthesia, Pika Labs
- **Audio**: ElevenLabs, Whisper, Murf
- **Code**: GitHub Copilot, Tabnine, Cursor
- **Automation**: Zapier, Make, n8n
- **Data**: Vector DBs, Analytics, BI tools
- **Infrastructure**: Docker, Kubernetes, Cloud platforms
- And 20+ more categories...

## API Reference

### ChuckClient

```typescript
class ChuckClient {
  constructor(config?: ChuckClientConfig)
  setAuthToken(token: string): void
  exec(execution: WorkflowExecution): Promise<ChuckResponse>
  execWorkflow(workflow: { nodes: any[]; edges: any[] }): Promise<ChuckResponse>
  execTool(toolId: string, input?: any, config?: any): Promise<ChuckResponse>
  health(): Promise<{ status: string; service: string; version: string }>
}
```

### Universal Nodes

```typescript
// AI Agent
createAIAgentNode(id: string, toolId: string, options?: Partial<AIAgentNode['config']>)

// Processor
createProcessorNode(id: string, operation: string, config: Partial<ProcessorNode['config']>)

// Output
createOutputNode(id: string, channel: string, config: Partial<OutputNode['config']>)
```

### Execution Engine

```typescript
executeWorkflow(context: WorkflowExecutionContext): Promise<ExecutionResult>
```

### Workflow Scoring

```typescript
scoreWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[], toolsMap: Map<string, any>): WorkflowScore
validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): { valid: boolean; errors: string[] }
detectCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean
topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] | null
```

## Configuration

### Workers Environment

Required secrets (set via `wrangler secret put`):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `CHUCK_TUNNEL_URL`: Cloudflared tunnel URL

### Rate Limiting

Default limits (configurable in `workers/chuck-proxy.js`):
- 10 requests per minute per user
- 60-second sliding window
- Stored in Cloudflare KV

### Retry Configuration

Default retry settings (configurable in execution context):
- Max retries: 3
- Initial delay: 1 second
- Max delay: 30 seconds
- Exponential backoff

## Security

- ✅ Supabase email authentication
- ✅ JWT token verification
- ✅ Rate limiting per user
- ✅ CORS protection
- ✅ Cloudflared encrypted tunnel
- ✅ Environment variable secrets
- ✅ Input validation

## Performance

- **Worker Cold Start**: ~50ms
- **KV Read Latency**: <20ms globally
- **Tunnel Latency**: <100ms added
- **Dashboard Load**: <2s (143 tools)
- **Workflow Execution**: Varies by nodes

## Documentation

- [Deployment Guide](./docs/MYBONZO_DEPLOYMENT.md)
- [Cloudflared Tunnel Setup](./docs/CLOUDFLARED_TUNNEL_SETUP.md)
- API Documentation (see above)
- TypeScript type definitions in source files

## Support

- **Issues**: GitHub Issues
- **Email**: support@mybonzo.com
- **Documentation**: `/docs` directory

## License

MIT License - see LICENSE file

## Credits

Built with:
- Astro
- React + TypeScript
- Cloudflare Pages + Workers
- Supabase
- Monaco Editor
- Tailwind CSS
