# CHUCK + Jimbo Integration

## 🎯 Overview

This implementation adds the CHUCK (Comprehensive Heuristic Universal Connector Kit) scoring engine and Jimbo universal nodes system to the project, enabling intelligent workflow creation with 140+ AI tools.

## 📁 File Structure

```
lib/
├── tools-extended.json          # 140+ AI tools database
├── compatibilityMatrix.ts       # Tool compatibility scoring
├── workflowScoring.ts           # Workflow DAG analysis & scoring
└── userLibraries/               # User-uploaded libraries
    ├── my-scrapers/
    │   └── allegro-prices.js    # Example: Allegro scraper
    ├── custom-ai/
    │   └── b2b-lead-scorer.py   # Example: Lead scoring
    └── workflows/
        └── seo-pipeline.json    # Example: SEO workflow

mcp-server/
└── index.ts                     # MCP server with /analyze and /exec endpoints

src/
├── nodes/
│   ├── universal.ts             # Universal node type definitions
│   ├── ai-agent.ts              # AI_AGENT node (CHUCK proxy)
│   ├── processor.ts             # PROCESSOR node (transform/scrape)
│   └── output.ts                # OUTPUT node (email/pdf/slack)
├── executionEngine.ts           # Workflow execution with retry logic
└── pages/
    ├── chuck-jimbo.astro        # Demo page
    └── api/chuck/
        ├── analyze.ts           # POST /api/chuck/analyze
        ├── exec.ts              # POST /api/chuck/exec
        └── tools.ts             # GET /api/chuck/tools

docs/
└── CHUCK_SCORING_ENGINE.md      # Complete documentation
```

## 🚀 Quick Start

### 1. View the Demo

Visit the demo page to see CHUCK + Jimbo in action:

```
http://localhost:4321/chuck-jimbo
```

### 2. Test API Endpoints

#### Get All Tools
```bash
curl http://localhost:4321/api/chuck/tools
```

#### Filter Tools by Category
```bash
curl "http://localhost:4321/api/chuck/tools?category=code-dev&minScore=90"
```

#### Analyze a Workflow
```bash
curl -X POST http://localhost:4321/api/chuck/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "id": "test-001",
      "name": "Test Workflow",
      "nodes": [
        {
          "id": "node1",
          "type": "AI_AGENT",
          "config": { "toolId": "perplexity" }
        },
        {
          "id": "node2",
          "type": "AI_AGENT",
          "config": { "toolId": "jasper" }
        }
      ],
      "connections": [
        { "from": "node1", "to": "node2" }
      ]
    },
    "options": {
      "includeRecommendations": true,
      "includeCompatibility": true
    }
  }'
```

#### Execute AI Tool
```bash
curl -X POST http://localhost:4321/api/chuck/exec \
  -H "Content-Type: application/json" \
  -d '{
    "toolId": "cursor",
    "prompt": "Write a hello world function",
    "parameters": { "language": "javascript" }
  }'
```

### 3. Use in Code

```typescript
import { executeWorkflow } from './src/executionEngine';
import { createAIAgentNode, createOutputNode } from './src/nodes/universal';

// Create workflow
const workflow = {
  id: 'my-workflow',
  name: 'My First Workflow',
  nodes: [
    createAIAgentNode('research', 'perplexity', {
      prompt: 'Research AI trends 2026'
    }),
    createAIAgentNode('write', 'jasper', {
      prompt: 'Write article based on research'
    }),
    createOutputNode('publish', 'email', {
      target: 'team@example.com'
    })
  ],
  connections: [
    { from: 'research', to: 'write' },
    { from: 'write', to: 'publish' }
  ]
};

// Execute
const result = await executeWorkflow(workflow);
console.log(result);
```

## 🧩 Features

### 1. 140+ AI Tools
- **SEO/Content** (20): Perplexity, Notion AI, MarketMuse, Jasper...
- **Code/Dev** (25): Cursor, GitHub Copilot, Replit AI, V0...
- **E-commerce/B2B** (30): Klaviyo, Gorgias, HubSpot, Salesforce...
- **Creative/Productivity** (35): Canva AI, Midjourney, Notion...
- **New 2026** (30): Sora, RunwayML, Claude, Gemini, Luma AI...

### 2. Universal Nodes

#### AI_AGENT
Executes AI tools via CHUCK proxy.
```typescript
{
  type: 'AI_AGENT',
  config: {
    toolId: 'cursor',
    prompt: 'Your prompt',
    chuckEndpoint: 'http://localhost:4321/api/chuck/exec'
  }
}
```

#### PROCESSOR
Data transformation and scraping.
```typescript
{
  type: 'PROCESSOR',
  config: {
    operation: 'scrape' | 'transform' | 'export',
    source: 'https://example.com',
    format: 'json'
  }
}
```

#### OUTPUT
Send results to various destinations.
```typescript
{
  type: 'OUTPUT',
  config: {
    destination: 'email' | 'pdf' | 'slack' | 'webhook',
    target: 'destination-specific',
    template: 'Optional template'
  }
}
```

### 3. Workflow Scoring

CHUCK analyzes workflows and provides:
- **Quality Score** (0-100%): Overall workflow quality
- **Compatibility Score**: Tool-to-tool compatibility
- **DAG Validation**: Cycle detection
- **Execution Order**: Topological sort
- **Recommendations**: Improvement suggestions

### 4. Execution Engine

Features:
- ✅ Topological sort for execution order
- ✅ Cycle detection (DAG validation)
- ✅ Retry logic with exponential backoff
- ✅ Timeout protection (5min default)
- ✅ Error handling (continue-on-error option)

## 📊 Examples

### Example 1: SEO Content Pipeline

See `lib/userLibraries/workflows/seo-pipeline.json` for a complete example:
1. Research keywords (Perplexity)
2. Generate content (Jasper)
3. Optimize SEO (Surfer SEO)
4. Format content (PROCESSOR)
5. Publish (Webhook)
6. Send notification (Email)

### Example 2: E-commerce Lead Scoring

```typescript
import { B2BLeadScorer } from './lib/userLibraries/custom-ai/b2b-lead-scorer';

const scorer = new B2BLeadScorer();
const result = scorer.score_lead({
  company_size: 500,
  industry: 'technology',
  budget: 75000,
  urgency: 'high'
});
```

### Example 3: Custom Scraper

```javascript
import { scrapeAllegroPrice } from './lib/userLibraries/my-scrapers/allegro-prices';

const product = await scrapeAllegroPrice('https://allegro.pl/...');
console.log(product.price); // 99.99 PLN
```

## 🔧 Configuration

### Environment Variables

No API keys required for the core system. Individual AI tools may require their own keys when integrated.

### Cloudflare Workers

The system is designed to work with Cloudflare Workers:

```typescript
// Keep existing mybonzo.com structure
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/chuck/')) {
      return handleMCPRequest(request);
    }
    
    // ... existing routes
  }
}
```

## 📚 Documentation

- **Complete Docs**: [docs/CHUCK_SCORING_ENGINE.md](../docs/CHUCK_SCORING_ENGINE.md)
- **API Reference**: See demo page at `/chuck-jimbo`
- **Examples**: `lib/userLibraries/`

## 🔐 Security

- **Local CHUCK**: Keys stored locally, never exposed
- **Proxy Pattern**: Jimbo delegates to CHUCK safely
- **Sandboxed Execution**: User libraries run in isolation
- **Environment Variables**: Secrets via env vars only

## 🎨 UI Components (Future)

Planned components:
- [ ] Workflow Builder (drag & drop)
- [ ] Tool Selector (filterable, searchable)
- [ ] Execution Monitor (real-time progress)
- [ ] Compatibility Visualizer

## 🚧 Limitations

Current implementation:
- Mock execution for most tools (integration needed)
- No persistent storage (workflows in-memory)
- No authentication/authorization
- No rate limiting

## 🛣️ Roadmap

1. **Phase 1** ✅ (Current)
   - Core infrastructure
   - API endpoints
   - Demo page

2. **Phase 2** (Next)
   - Real tool integrations
   - Persistent workflow storage
   - Visual workflow builder

3. **Phase 3** (Future)
   - ML-based scoring
   - Workflow templates marketplace
   - Real-time collaboration

## 📝 Contributing

To add new tools:

1. Edit `lib/tools-extended.json`
2. Add tool metadata (id, type, category, score)
3. Update compatibility if needed
4. Test with `/api/chuck/tools`

## 📄 License

Same as parent project.

## 🙋 Support

- GitHub Issues: Report bugs or request features
- Documentation: Check `docs/CHUCK_SCORING_ENGINE.md`
- Examples: Browse `lib/userLibraries/`
