# CHUCK Scoring Engine Documentation

## Overview

CHUCK (Comprehensive Heuristic Universal Connector Kit) is an AI workflow scoring and compatibility engine that powers the Jimbo universal nodes system. It provides intelligent tool selection, workflow optimization, and execution management for 140+ AI tools.

## Architecture

```
┌─────────────────────────────────────────────────┐
│            CHUCK Scoring Engine                  │
├─────────────────────────────────────────────────┤
│  • tools-extended.json (140+ AI tools)          │
│  • compatibilityMatrix.ts (scoring algorithm)   │
│  • workflowScoring.ts (DAG analysis)            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Jimbo Universal Nodes (3 types)          │
├─────────────────────────────────────────────────┤
│  • AI_AGENT → CHUCK proxy (localhost:4321)     │
│  • PROCESSOR → scrape/transform/export          │
│  • OUTPUT → email/pdf/slack/webhook             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          Execution Engine                        │
├─────────────────────────────────────────────────┤
│  • Topological sort (execution order)           │
│  • Cycle detection (DAG validation)             │
│  • Retry logic (exponential backoff)            │
└─────────────────────────────────────────────────┘
```

## Components

### 1. Tools Extended (`lib/tools-extended.json`)

Contains 140+ AI tools organized into 5 categories:

- **SEO/Content** (20 tools): Perplexity, Notion AI, MarketMuse, etc.
- **Code/Dev** (25 tools): Cursor, GitHub Copilot, Replit AI, etc.
- **E-commerce/B2B** (30 tools): Klaviyo, Gorgias, HubSpot, etc.
- **Creative/Productivity** (35 tools): Canva AI, Midjourney, Notion, etc.
- **New 2026** (30 tools): RunwayML, Sora, Claude, Gemini, etc.

Each tool includes:
```json
{
  "id": "cursor",
  "type": "coding",
  "pl": "VS Code AI",
  "score": 97,
  "category": "code-dev"
}
```

### 2. Compatibility Matrix (`lib/compatibilityMatrix.ts`)

Calculates compatibility scores between tools:

```typescript
// Category-level compatibility (60% weight)
categoryCompatibility = {
  'seo-content': { 'seo-content': 95, 'code-dev': 70, ... },
  'code-dev': { 'code-dev': 100, ... }
}

// Type-level compatibility (40% weight)
typeCompatibility = {
  'research': { 'writing': 95, 'seo': 98, ... },
  'coding': { 'ui': 95, 'webdev': 92, ... }
}
```

**Functions:**
- `calculateCompatibility(tool1, tool2)` → score 0-100
- `findBestNextTools(currentTool, allTools)` → top 10 recommendations
- `validateWorkflow(toolSequence)` → validation result

### 3. Workflow Scoring (`lib/workflowScoring.ts`)

Analyzes and scores complete workflows:

```typescript
interface WorkflowScore {
  quality: number;        // 0-100% overall score
  hasCycles: boolean;     // DAG validation
  cycles?: string[][];    // Detected cycles
  compatibilityScore: number;
  executionOrder?: string[];
  issues: string[];
  recommendations: string[];
}
```

**Quality Score Formula:**
```
quality = (compatibility × 0.4) + (avgToolScore × 0.3) + (structure × 0.3)
```

Where:
- **Compatibility**: Average compatibility between consecutive tools
- **AvgToolScore**: Average quality score of tools used
- **Structure**: 100 if no cycles, 0 if cycles detected

**Functions:**
- `detectCycles(workflow)` → cycle detection using DFS
- `getExecutionOrder(workflow)` → topological sort
- `scoreWorkflow(workflow, tools)` → complete scoring

## Jimbo Universal Nodes

### Node Types

#### 1. AI_AGENT
Delegates to CHUCK API for AI tool execution.

```typescript
{
  type: 'AI_AGENT',
  config: {
    toolId: 'cursor',           // From tools-extended.json
    prompt: 'Write a function',
    chuckEndpoint: 'http://localhost:4321/api/chuck/exec'
  }
}
```

#### 2. PROCESSOR
Data transformation and scraping.

```typescript
{
  type: 'PROCESSOR',
  config: {
    operation: 'scrape' | 'transform' | 'export' | 'filter' | 'merge',
    source: 'https://example.com',
    format: 'json' | 'csv' | 'xml' | 'html'
  }
}
```

#### 3. OUTPUT
Final output destinations.

```typescript
{
  type: 'OUTPUT',
  config: {
    destination: 'email' | 'pdf' | 'slack' | 'webhook' | 'database' | 'file',
    target: 'user@example.com',
    template: 'Email template {{variable}}'
  }
}
```

## Execution Engine

### Features

1. **Topological Sort**: Determines optimal execution order
2. **Cycle Detection**: Validates DAG structure
3. **Retry Logic**: Exponential backoff (3 retries default)
4. **Timeout Protection**: 5 minutes per node default
5. **Error Handling**: Continue on error option

### Execution Flow

```typescript
const result = await executeWorkflow(workflow, {
  maxRetries: 3,
  retryDelay: 1000,     // ms
  timeout: 300000,      // 5 min
  continueOnError: false
});
```

Result structure:
```typescript
{
  success: boolean,
  workflowId: string,
  executionTime: number,
  results: { [nodeId]: any },
  errors: { [nodeId]: string },
  executionOrder: string[]
}
```

## MCP Server

### Endpoints

#### POST /api/analyze
Analyze workflow and get scoring.

**Request:**
```json
{
  "workflow": { ... },
  "options": {
    "includeRecommendations": true,
    "includeCompatibility": true,
    "includeExecutionPlan": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "score": {
    "overall": 85,
    "quality": 87,
    "compatibility": 92
  },
  "dag": {
    "isValid": true,
    "hasCycles": false,
    "executionOrder": ["node1", "node2", "node3"]
  },
  "recommendations": [
    "Consider using higher-rated tools"
  ]
}
```

#### POST /api/exec
Execute AI tool via CHUCK proxy.

**Request:**
```json
{
  "toolId": "cursor",
  "prompt": "Write a function",
  "parameters": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "result": { ... },
  "metadata": {
    "toolId": "cursor",
    "executionTime": 1234,
    "tokensUsed": 500
  }
}
```

## User Libraries

Custom libraries stored in `lib/userLibraries/`:

```
lib/userLibraries/
├── my-scrapers/          # Custom scrapers
│   └── allegro-prices.js
├── custom-ai/            # Custom AI models
│   └── b2b-lead-scorer.py
└── workflows/            # Saved workflows
    └── seo-pipeline.json
```

### Adding Libraries

**Option 1: Drag & Drop**
```
Manual copy to lib/userLibraries/
```

**Option 2: MCP Function**
```typescript
saveLibrary(name, files) → git clone + commit
```

## Example Workflow

```json
{
  "id": "example-001",
  "name": "SEO Content Pipeline",
  "nodes": [
    {
      "id": "research",
      "type": "AI_AGENT",
      "config": { "toolId": "perplexity" }
    },
    {
      "id": "write",
      "type": "AI_AGENT",
      "config": { "toolId": "jasper" }
    },
    {
      "id": "optimize",
      "type": "AI_AGENT",
      "config": { "toolId": "surfer-seo" }
    },
    {
      "id": "publish",
      "type": "OUTPUT",
      "config": { "destination": "webhook" }
    }
  ],
  "connections": [
    { "from": "research", "to": "write" },
    { "from": "write", "to": "optimize" },
    { "from": "optimize", "to": "publish" }
  ]
}
```

### Execution

```typescript
import { executeWorkflow } from './src/executionEngine';

const result = await executeWorkflow(workflow);

if (result.success) {
  console.log('Workflow completed:', result.results);
} else {
  console.error('Workflow failed:', result.errors);
}
```

## API Integration

### Local Development

```bash
# Start development server
npm run dev  # Port 4321 (Astro)

# CHUCK API endpoints
http://localhost:4321/api/chuck/exec
http://localhost:4321/api/chuck/analyze
http://localhost:4321/api/chuck/tools
```

### Production (Cloudflare Workers)

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

## Security

- **CHUCK Local**: Keys stored locally, not exposed
- **Jimbo Delegation**: Proxies requests to CHUCK
- **User Libraries**: Sandboxed execution
- **API Keys**: Stored in environment variables

## Performance

- **Tool Lookup**: O(1) hash map
- **Compatibility Calc**: O(n²) for n tools
- **Topological Sort**: O(V + E) for V nodes, E edges
- **Cycle Detection**: O(V + E) DFS

## Future Enhancements

1. **Caching**: Cache compatibility scores
2. **Optimization**: Greedy algorithm for workflow optimization
3. **ML Scoring**: Train ML model on workflow success rates
4. **Real-time Updates**: WebSocket for execution progress
5. **Visual Editor**: Drag-and-drop workflow builder

## Troubleshooting

### Common Issues

**Q: Workflow has cycles**
A: Use `detectCycles()` to identify and remove cyclic dependencies

**Q: Low compatibility score**
A: Use `findBestNextTools()` to get recommendations

**Q: Node execution timeout**
A: Increase `timeout` option in `executeWorkflow()`

**Q: CHUCK API not responding**
A: Ensure development server is running with `npm run dev` on localhost:4321

## Support

For issues or questions:
- GitHub Issues: https://github.com/Bonzokoles/luc-de-zen-on/issues
- Documentation: `/docs/CHUCK_SCORING_ENGINE.md`
- Examples: `/lib/userLibraries/workflows/`
