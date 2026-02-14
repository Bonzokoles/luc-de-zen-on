# Jimbo Unified System Documentation

## 🎯 Overview

The **Jimbo Unified System** is a comprehensive AI workflow automation platform that unifies 140+ AI tools through a simple, powerful interface. It combines the CHUCK (Comprehensive Heuristic Universal Connector Kit) scoring engine with Jimbo's universal node architecture to create intelligent, optimized workflows.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Universal Nodes](#universal-nodes)
- [Workflow Templates](#workflow-templates)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## 🚀 Quick Start

### Access the System

Navigate to: `http://localhost:4321/jimbo-unified-system`

### Create Your First Workflow

1. **Choose a Template**: Select from pre-built templates like "SEO Content Pipeline" or "Code Review & Documentation"
2. **Analyze**: Click "Analyze Workflow" to validate and score your workflow
3. **Execute**: Click "Execute Workflow" to run your automation

### Simple Example

```typescript
const workflow = {
  id: 'my-first-workflow',
  name: 'Content Creation Pipeline',
  nodes: [
    {
      id: 'research',
      type: 'AI_AGENT',
      config: { toolId: 'perplexity', prompt: 'Research AI trends 2026' }
    },
    {
      id: 'write',
      type: 'AI_AGENT',
      config: { toolId: 'jasper', prompt: 'Write blog post' }
    },
    {
      id: 'publish',
      type: 'OUTPUT',
      config: { destination: 'webhook', target: 'https://blog.com/api/publish' }
    }
  ],
  connections: [
    { from: 'research', to: 'write' },
    { from: 'write', to: 'publish' }
  ]
};
```

---

## 🏗️ Architecture

### System Components

```
Jimbo Unified System
├── CHUCK Scoring Engine (lib/)
│   ├── tools-extended.json (140+ AI tools)
│   ├── compatibilityMatrix.ts (tool compatibility)
│   └── workflowScoring.ts (quality analysis)
│
├── Universal Nodes (src/nodes/)
│   ├── AI_AGENT (delegates to CHUCK)
│   ├── PROCESSOR (data operations)
│   └── OUTPUT (destinations)
│
├── Orchestrator (src/lib/)
│   ├── workflowOrchestrator.ts (execution engine)
│   └── unifiedSystemConfig.ts (configuration)
│
└── API Endpoints (src/pages/api/)
    ├── /api/chuck/* (CHUCK operations)
    └── /api/unified-system (orchestration)
```

### Data Flow

```
User Input → Template Selection → Workflow Definition
     ↓
Analysis (CHUCK Scoring Engine)
     ↓
Validation (DAG check, quality score)
     ↓
Execution Plan (topological sort)
     ↓
Sequential Execution (with retry logic)
     ↓
Results & Metrics
```

---

## 🔧 Universal Nodes

### AI_AGENT Node

Delegates execution to CHUCK API for AI tool processing.

**Configuration:**
```typescript
{
  type: 'AI_AGENT',
  config: {
    toolId: string;          // Tool ID from tools-extended.json
    prompt?: string;         // Instruction for the AI tool
    parameters?: object;     // Tool-specific parameters
    chuckEndpoint?: string;  // Default: http://localhost:5152/api/exec
  }
}
```

**Example:**
```typescript
{
  id: 'node1',
  type: 'AI_AGENT',
  config: {
    toolId: 'cursor',
    prompt: 'Review code for security issues',
    parameters: { language: 'typescript' }
  }
}
```

**Available Tools (140+):**
- **SEO/Content (20)**: Perplexity, Jasper, Copy.ai, Surfer SEO, MarketMuse
- **Code/Dev (25)**: Cursor, GitHub Copilot, Replit AI, V0, Codeium
- **E-commerce (30)**: Klaviyo, Shopify Magic, HubSpot, Salesforce
- **Creative (35)**: Canva AI, Midjourney, Gamma App, Notion AI
- **New 2026 (30)**: Claude, Gemini, Sora, RunwayML, Luma AI

### PROCESSOR Node

Data transformation, scraping, and processing operations.

**Configuration:**
```typescript
{
  type: 'PROCESSOR',
  config: {
    operation: 'scrape' | 'transform' | 'export' | 'filter' | 'merge';
    source?: string;         // URL or data source
    transformer?: string;    // JavaScript function or library
    format?: 'json' | 'csv' | 'xml' | 'html';
    options?: object;
  }
}
```

**Operations:**
- **scrape**: Web scraping with URL validation and SSRF protection
- **transform**: Data transformation using safe evaluation
- **export**: Convert data between formats
- **filter**: Filter data based on conditions
- **merge**: Combine multiple data sources

**Example:**
```typescript
{
  id: 'node2',
  type: 'PROCESSOR',
  config: {
    operation: 'scrape',
    source: 'https://example.com/data',
    format: 'json'
  }
}
```

### OUTPUT Node

Final output destinations for workflow results.

**Configuration:**
```typescript
{
  type: 'OUTPUT',
  config: {
    destination: 'email' | 'pdf' | 'slack' | 'webhook' | 'database' | 'file';
    target?: string;         // Email address, URL, file path, etc.
    template?: string;       // Formatting template
    options?: object;
  }
}
```

**Destinations:**
- **email**: Send via SMTP
- **pdf**: Generate PDF document
- **slack**: Post to Slack channel
- **webhook**: HTTP POST to URL
- **database**: Store in database
- **file**: Save to file system

**Example:**
```typescript
{
  id: 'node3',
  type: 'OUTPUT',
  config: {
    destination: 'slack',
    target: '#marketing',
    template: 'Campaign results: {{results}}'
  }
}
```

---

## 📋 Workflow Templates

### Pre-built Templates

#### 1. SEO Content Pipeline
**Purpose:** Research → Write → Optimize → Publish

**Nodes:**
- Perplexity (research)
- Jasper (writing)
- Surfer SEO (optimization)
- Webhook (publishing)

**Use Case:** Automated blog post creation with SEO optimization

#### 2. Code Review & Documentation
**Purpose:** Review → Document → Test → Deploy

**Nodes:**
- Cursor (code review)
- GitHub Copilot (documentation)
- Processor (export to markdown)
- File output

**Use Case:** Automated code review and documentation generation

#### 3. E-commerce Product Optimization
**Purpose:** Analyze → Optimize → Update → Notify

**Nodes:**
- Processor (scrape products)
- Jasper (optimize descriptions)
- Shopify Magic (SEO metadata)
- Webhook (update shop)

**Use Case:** Bulk product description optimization

#### 4. Social Media Campaign
**Purpose:** Generate content for all platforms

**Nodes:**
- Jasper (campaign ideas)
- Canva AI (visuals)
- Processor (transform to JSON)
- Slack (team notification)

**Use Case:** Multi-platform social media content generation

#### 5. Data Analysis & Reporting
**Purpose:** Collect → Analyze → Visualize → Send

**Nodes:**
- Processor (scrape analytics)
- Claude (analyze trends)
- Gamma App (create presentation)
- Email (send report)

**Use Case:** Automated weekly analytics reports

---

## 🔌 API Reference

### Unified System API

**Endpoint:** `/api/unified-system`

#### Execute Workflow
```http
POST /api/unified-system
Content-Type: application/json

{
  "action": "execute",
  "workflow": { /* UniversalWorkflow */ }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "workflowId": "workflow-123",
    "status": "success",
    "duration": 15340,
    "steps": [...]
  }
}
```

#### Create Execution Plan
```http
POST /api/unified-system
Content-Type: application/json

{
  "action": "plan",
  "workflow": { /* UniversalWorkflow */ }
}
```

#### Get Statistics
```http
GET /api/unified-system?action=stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalExecutions": 42,
    "successRate": 95.2,
    "averageDuration": 12450
  }
}
```

### CHUCK API Endpoints

#### List Tools
```http
GET /api/chuck/tools
```

#### Analyze Workflow
```http
POST /api/chuck/analyze
Content-Type: application/json

{
  "workflow": { /* UniversalWorkflow */ },
  "options": {
    "includeRecommendations": true,
    "includeCompatibility": true,
    "includeExecutionPlan": true
  }
}
```

#### Execute AI Tool
```http
POST /api/chuck/exec
Content-Type: application/json

{
  "toolId": "cursor",
  "prompt": "Write a function",
  "parameters": {}
}
```

---

## ⚙️ Configuration

### System Configuration

```typescript
import { DEFAULT_CONFIG } from './lib/unifiedSystemConfig';

const customConfig = {
  chuckEndpoint: 'http://localhost:5152',
  execution: {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000
  },
  validation: {
    requireDAG: true,
    minQualityScore: 50
  }
};
```

### Environment Variables

```env
# CHUCK API endpoint
CHUCK_ENDPOINT=http://localhost:5152

# Execution settings
MAX_RETRIES=3
RETRY_DELAY=1000
EXECUTION_TIMEOUT=30000

# Validation
REQUIRE_DAG=true
MIN_QUALITY_SCORE=50
```

---

## 💡 Examples

### Example 1: Simple Content Creation

```typescript
import { WorkflowOrchestrator } from './lib/workflowOrchestrator';

const orchestrator = new WorkflowOrchestrator();

const workflow = {
  id: 'content-001',
  name: 'Blog Post Creation',
  nodes: [
    {
      id: 'research',
      type: 'AI_AGENT',
      config: { toolId: 'perplexity', prompt: 'Research AI in 2026' }
    },
    {
      id: 'write',
      type: 'AI_AGENT',
      config: { toolId: 'jasper', prompt: 'Write 1000-word article' }
    },
    {
      id: 'save',
      type: 'OUTPUT',
      config: { destination: 'file', target: './blog/post.md' }
    }
  ],
  connections: [
    { from: 'research', to: 'write' },
    { from: 'write', to: 'save' }
  ]
};

const result = await orchestrator.executeWorkflow(workflow);
console.log('Execution result:', result);
```

### Example 2: E-commerce Automation

```typescript
const ecommerceWorkflow = {
  id: 'ecommerce-001',
  name: 'Product Optimization',
  nodes: [
    {
      id: 'scrape',
      type: 'PROCESSOR',
      config: {
        operation: 'scrape',
        source: 'https://shop.example.com/products.json'
      }
    },
    {
      id: 'optimize',
      type: 'AI_AGENT',
      config: {
        toolId: 'jasper',
        prompt: 'Optimize product descriptions for SEO'
      }
    },
    {
      id: 'update',
      type: 'OUTPUT',
      config: {
        destination: 'webhook',
        target: 'https://shop.example.com/api/products/bulk-update'
      }
    }
  ],
  connections: [
    { from: 'scrape', to: 'optimize' },
    { from: 'optimize', to: 'update' }
  ]
};
```

---

## ✅ Best Practices

### Workflow Design

1. **Keep it Simple**: Start with 3-5 nodes, then expand
2. **Use Templates**: Leverage pre-built templates as starting points
3. **Test Incrementally**: Validate each node before adding more
4. **Monitor Quality**: Aim for >80% quality score

### Performance

1. **Avoid Cycles**: Always use DAG (Directed Acyclic Graph) structure
2. **Optimize Dependencies**: Minimize sequential dependencies
3. **Use Caching**: Cache results when possible
4. **Set Timeouts**: Configure appropriate timeouts for long-running tasks

### Security

1. **Validate URLs**: All URLs are validated to prevent SSRF
2. **Safe Evaluation**: Filter operations use safe evaluation
3. **No Code Injection**: Function constructors are disabled
4. **Environment Secrets**: Store API keys in environment variables

### Error Handling

1. **Retry Logic**: System automatically retries failed steps (max 3)
2. **Graceful Degradation**: Partial execution continues on non-critical failures
3. **Detailed Logging**: All errors are logged with context
4. **Status Monitoring**: Check execution history and statistics

---

## 📊 Quality Scoring

### Score Components

- **40% Compatibility**: How well tools work together
- **30% Tool Quality**: Quality scores of individual tools
- **30% Structure**: DAG validity, cycle detection

### Score Interpretation

- **90-100%**: Excellent workflow
- **70-89%**: Good workflow
- **50-69%**: Acceptable workflow
- **0-49%**: Needs improvement

---

## 🔗 Related Documentation

- [CHUCK Scoring Engine](./CHUCK_SCORING_ENGINE.md)
- [Universal Nodes API](../src/nodes/universal.ts)
- [Workflow Orchestrator](../src/lib/workflowOrchestrator.ts)
- [System Configuration](../src/lib/unifiedSystemConfig.ts)

---

## 🤝 Support

- **GitHub Issues**: [Create an issue](https://github.com/Bonzokoles/luc-de-zen-on/issues)
- **Documentation**: Full docs in `/docs` directory
- **Demo Page**: `/chuck-jimbo` for API testing
- **Unified System**: `/jimbo-unified-system` for workflow creation

---

**Built with ❤️ for AI workflow automation**

*Jimbo Unified System - Automate intelligently with 140+ AI tools*
