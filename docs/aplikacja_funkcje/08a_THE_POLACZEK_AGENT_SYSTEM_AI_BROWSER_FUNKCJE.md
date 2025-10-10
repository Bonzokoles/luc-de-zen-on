# 🤖 AI BROWSER & AGENTS - MAPOWANIE FUNKCJI SYSTEMU

## 🎯 GŁÓWNE FUNKCJE SYSTEMU

### 1. BROWSER AUTOMATION FUNCTIONS

#### 1.1 Core Browser Actions (BrowserAgent Class)

```typescript
// src/workers/browser-rag-agents.ts - Browser automation engine
class BrowserAgent {
  // Main automation orchestrator
  async browse(request: BrowserRequest): Promise<BrowserResult>;

  // Screenshot generation
  private async takeScreenshot(options: any): Promise<any>;
  // 📸 Full-page or viewport screenshots
  // 🎯 PNG format, quality 90, base64 encoded
  // ⏱️ 2-4s average response time

  // PDF document generation
  private async generatePDF(options: any): Promise<any>;
  // 📄 A4 format with 1cm margins
  // 🎯 Landscape/portrait options
  // ⏱️ 3-6s generation time

  // HTML source extraction
  private async getHTML(options: any): Promise<any>;
  // 📝 Complete page source code
  // 🎯 Raw HTML with all elements
  // ⏱️ 1-2s extraction time

  // Clean text content extraction
  private async extractText(options: any): Promise<any>;
  // 📖 Text without styles/scripts
  // 🎯 Readable content only
  // ⏱️ 1-3s processing time

  // Element interaction automation
  private async clickElement(options: any, selector: string): Promise<any>;
  // 🖱️ CSS selector-based clicking
  // 🎯 Button, link, form interactions
  // ⏱️ 0.5-2s response time

  // Form automation
  private async typeText(
    options: any,
    selector: string,
    value: string
  ): Promise<any>;
  // ⌨️ Input field automation
  // 🎯 Text entry, form filling
  // ⏱️ 0.5-1s per field

  // Page navigation
  private async scrollPage(options: any): Promise<any>;
  // 📜 Page scrolling automation
  // 🎯 Down/up navigation, full page
  // ⏱️ 0.5-1s scroll time
}
```

#### 1.2 Browser Request Interface

```typescript
interface BrowserRequest {
  url: string; // Target URL for automation
  action:
    | "screenshot" // Available actions:
    | "pdf" //   📸 Screenshot capture
    | "html" //   📄 PDF generation
    | "text" //   📝 HTML extraction
    | "click" //   📖 Text extraction
    | "type" //   🖱️ Element clicking
    | "scroll"; //   ⌨️ Text typing
  //   📜 Page scrolling
  selector?: string; // CSS selector for interactions
  value?: string; // Input value for form fields
  waitFor?:
    | "load" // Wait conditions:
    | "networkidle" //   🔄 Page load complete
    | "domcontentloaded"; //   🌐 Network idle
  //   📋 DOM content loaded
  viewport?: {
    // Browser viewport settings
    width: number; //   📏 Width (default: 1920)
    height: number; //   📐 Height (default: 1080)
  };
  options?: Record<string, any>; // Additional configuration
}
```

### 2. WEB CRAWLING FUNCTIONS

#### 2.1 Web Crawler Manager (WebCrawlerManager Class)

```javascript
// src/components/agents/modules/crawler/core.js - Web crawling engine
class WebCrawlerManager {

  // Full website crawling orchestrator
  async crawlWebsite(startUrl, options = {})
  // 🕷️ Multi-page crawling (max 50 pages)
  // 📊 Depth-limited crawling (max 3 levels)
  // ⏱️ Rate-limited (1000ms delays)
  // 🤖 Robots.txt compliant

  // Single page analysis
  async crawlPage(item, settings)
  // 📄 Individual page processing
  // 🔍 Content extraction and analysis
  // 📈 Performance metrics collection

  // HTTP page fetching
  async fetchPage(url, settings)
  // 🌐 HTTP request handling
  // 📋 Response processing
  // ⚠️ Error handling and retries

  // Link extraction and analysis
  extractLinks(html, baseUrl)
  // 🔗 Internal/external link detection
  // 📊 Link analysis and categorization
  // 🎯 Navigation structure mapping

  // Media content extraction
  extractImages(html, baseUrl)
  // 🖼️ Image URL extraction
  // 📏 Dimension and alt-text analysis
  // 🎨 Media content cataloging

  // Clean text content extraction
  extractText(html)
  // 📖 Text content isolation
  // 🧹 HTML tag removal
  // 📝 Readable content extraction

  // SEO metadata extraction
  extractMetadata(html)
  // 🏷️ Title, description, keywords
  // 📊 Open Graph data
  // 🔍 SEO analysis data

  // Form detection and analysis
  extractForms(html, baseUrl)
  // 📋 Form field identification
  // 🎯 Action URL extraction
  // 🔒 Input type analysis

  // Structured data extraction
  extractTables(html)
  // 📊 Table data extraction
  // 🗂️ Structured content analysis
  // 📈 Data relationship mapping

  // Contact information extraction
  extractContacts(html)
  // 📧 Email address detection
  // 📞 Phone number extraction
  // 🏢 Business contact identification

  // Social media link extraction
  extractSocialLinks(html, baseUrl)
  // 📱 Social platform detection
  // 🔗 Profile URL extraction
  // 📊 Social presence analysis
}
```

#### 2.2 Crawler Configuration

```typescript
// src/components/agents/modules/crawler/config.ts - Crawler settings
export const AGENT_CONFIG = {
  id: "agent-04-web-crawler",
  name: "Web Crawler",
  version: "1.0.0",

  capabilities: [
    "web_scraping", // 🕷️ Web page scraping
    "data_extraction", // 📊 Content extraction
    "link_analysis", // 🔗 Link relationship analysis
    "content_monitoring", // 📈 Content change monitoring
    "seo_analysis", // 🔍 SEO optimization analysis
  ],

  crawler: {
    maxDepth: 3, // 📏 Maximum crawl depth
    maxPages: 50, // 📄 Page limit per session
    delayBetweenRequests: 1000, // ⏱️ Rate limiting (ms)
    respectRobotsTxt: true, // 🤖 Robots.txt compliance
    userAgent: "LucDeZenOn-WebCrawler/1.0",
    maxConcurrentRequests: 5, // 🔄 Parallel request limit
  },

  extraction: {
    selectors: {
      title: ["title", "h1", "[data-title]"],
      description: ['meta[name="description"]', "[data-description]"],
      keywords: ['meta[name="keywords"]', "[data-keywords]"],
      links: ["a[href]"],
      images: ["img[src]"],
      text: ["p", "div", "span"],
    },
  },
};
```

### 3. AI BROWSER INTERFACE FUNCTIONS

#### 3.1 Main Browser Interface (ai-browser.astro - 593 linii)

```javascript
// Frontend functions for browser interaction

// Main search orchestration
async function performSearch()
// 🔍 Multi-agent search coordination
// 🤖 POLACZEK agents orchestration
// 🌐 Results processing and display
// 📊 Search history management

// Loading state management
function showLoading()
// ⏳ Loading spinner display
// 🔄 Agent activity indicators
// 📱 UI state management

// Results visualization
function displayResults(results)
// 📊 Search results formatting
// 🎨 Content presentation
// 🔗 Interactive result elements
// 📈 Orchestration plan display

// Error handling and display
function displayError(error)
// ❌ Error message formatting
// 🚨 User-friendly error display
// 🛠️ Debugging information

// Agent management functions
function activateAgent(agentId)
// 🤖 Agent activation control
// 📊 Status updating
// 🔄 Active agents tracking

function updateAgentStatus(agentId, status)
// 📈 Real-time status updates
// 🎯 Visual status indicators
// 🔄 UI synchronization

// Translation system functions
function toggleTranslator()
// 🌍 Translation panel control
// 📱 UI panel management
// 🔄 Interface state switching

async function translateText()
// 🔄 POLACZEK_T integration
// 🌐 Multi-language processing
// 📝 Translation result display
// ⚡ Real-time translation
```

#### 3.2 POLACZEK Agents System

```javascript
// Agent coordination and management

// Active agents tracking
let activeAgents = ['POLACZEK_D', 'POLACZEK_T', 'POLACZEK_M1'];

// POLACZEK_D - Dyrektor (🎯 Orchestrator)
function orchestrateSearch()
// 🎯 Master coordination
// 📋 Task distribution
// 🔄 Workflow management
// 📊 Results compilation

// POLACZEK_T - Tłumacz (🔄 Translator)
function translateContent()
// 🌍 Multi-language support
// 🔄 Auto-detect source language
// 📝 Context-aware translation
// 🎯 Polish language optimization

// POLACZEK_B - Bibliotekarz (📚 Knowledge Manager)
function manageKnowledge()
// 📚 Document indexing
// 🔍 Content categorization
// 📊 Knowledge base management
// 🎯 Information retrieval

// POLACZEK_M1 - Manager (⚙️ Workflow Coordinator)
function coordinateWorkflow()
// ⚙️ Task optimization
// 📈 Performance monitoring
// 🔄 Agent load balancing
// 🎯 Efficiency optimization
```

### 4. RAG (RETRIEVAL AUGMENTED GENERATION) FUNCTIONS

#### 4.1 RAG Agent Class

```typescript
// src/workers/browser-rag-agents.ts - RAG processing engine
class RAGAgent {
  // Document indexing and storage
  async addDocument(document: RAGDocument): Promise<void>;
  // 📄 Document vectorization
  // 🧠 Embedding generation
  // 💾 Vectorize storage
  // 🔍 Search index updating

  // Semantic search functionality
  async search(request: RAGSearchRequest): Promise<RAGSearchResult[]>;
  // 🔍 Vector similarity search
  // 📊 Relevance scoring
  // 📋 Result ranking
  // 🎯 Context-aware retrieval

  // AI-powered response generation
  async generateResponse(
    query: string,
    context: RAGDocument[]
  ): Promise<string>;
  // 🤖 AI model integration
  // 📝 Context-aware generation
  // 🎯 Accurate information synthesis
  // 📊 Quality scoring
}
```

#### 4.2 RAG Document Interface

```typescript
interface RAGDocument {
  id: string; // Unique document identifier
  content: string; // Document text content
  metadata: {
    // Document metadata
    title?: string; //   📄 Document title
    url?: string; //   🔗 Source URL
    timestamp: Date; //   ⏰ Creation/update time
    tags?: string[]; //   🏷️ Content tags
    source?: string; //   📍 Content source
    type?: string; //   📋 Document type
  };
  embedding?: number[]; // Vector representation
  similarity?: number; // Search relevance score
}
```

### 5. AGENT MANAGEMENT FUNCTIONS

#### 5.1 Agent API System (agents-api.ts)

```typescript
// RESTful agent management API

// GET /api/agents - List all agents
async function listAgents(): Promise<AgentResponse>;
// 📋 Agent inventory
// 📊 Status information
// 🔄 Health monitoring
// 📈 Performance metrics

// POST /api/agents - Create new agent
async function createAgent(agentData: AgentData): Promise<AgentResponse>;
// 🤖 Agent instantiation
// ⚙️ Configuration setup
// 🔄 Service registration
// 📊 Initial status setting

// PUT /api/agents/:id - Update agent
async function updateAgent(
  id: string,
  updates: Partial<AgentData>
): Promise<AgentResponse>;
// 🔧 Configuration updates
// 📊 Status modifications
// ⚙️ Capability adjustments
// 🔄 Service reconfiguration

// DELETE /api/agents/:id - Remove agent
async function deleteAgent(id: string): Promise<AgentResponse>;
// 🗑️ Agent decommissioning
// 🧹 Resource cleanup
// 📊 Status updates
// 🔄 Service deregistration
```

#### 5.2 Agent Status Management

```typescript
// Agent health and performance monitoring

interface AgentStatus {
  agent_id: string; // Agent identifier
  name: string; // Human-readable name
  type: string; // Agent type/category
  status:
    | "active" // Status options:
    | "idle" //   🟢 Active and working
    | "busy" //   ⚪ Idle and available
    | "error" //   🟡 Busy processing
    | "offline"; //   🔴 Error state
  //   ⚫ Offline/unavailable
  cpu_usage: number; // CPU utilization %
  memory_usage: number; // Memory usage MB
  messages_processed: number; // Total message count
  errors_count: number; // Error occurrence count
  created_at: string; // Creation timestamp
  last_activity: string; // Last activity timestamp
  version: string; // Agent version
  port?: number; // Service port (if applicable)
}
```

### 6. VOICE INTEGRATION FUNCTIONS

#### 6.1 Voice-Controlled Browsing

```typescript
// src/workers/advanced-voice-agent.ts - Voice integration
class VoiceAgent {
  // Voice-controlled web browsing
  private async browseWeb(connection: Connection, data: any);
  // 🗣️ Voice command processing
  // 🌐 Browser action translation
  // 📱 Hands-free operation
  // 🔄 Real-time feedback

  // Browser agent integration
  private async getBrowserAgent();
  // 🤖 Agent instance retrieval
  // 🔗 Service connection
  // ⚙️ Configuration management
  // 📊 Status monitoring
}
```

#### 6.2 Voice Command Processing

```typescript
// Voice-to-browser action mapping

interface VoiceCommand {
  command: string; // Voice command text
  action: BrowserAction; // Corresponding browser action
  parameters?: {
    // Command parameters
    url?: string; //   🔗 Target URL
    selector?: string; //   🎯 Element selector
    value?: string; //   📝 Input value
    waitFor?: string; //   ⏳ Wait condition
  };
}

// Example voice commands:
// "Take screenshot of example.com" → screenshot action
// "Click the login button" → click action with selector
// "Type my email in the form" → type action with value
// "Scroll down the page" → scroll action
```

---

## 📊 FUNKCJE WEDŁUG KATEGORII

### 🔍 SEARCH & DISCOVERY

- Multi-agent search orchestration
- Semantic content discovery
- Cross-language search support
- Real-time result processing
- Knowledge base integration

### 🤖 AUTOMATION & INTERACTION

- Browser automation (7 core actions)
- Form filling and submission
- Element interaction (click, type, scroll)
- Screenshot and PDF generation
- Page content extraction

### 🕷️ WEB CRAWLING & SCRAPING

- Multi-depth website crawling
- Structured data extraction
- SEO metadata analysis
- Content monitoring
- Robots.txt compliance

### 🧠 AI & INTELLIGENCE

- RAG document processing
- Vector similarity search
- Multi-model AI integration
- Context-aware responses
- Automated translation

### 📱 USER INTERFACE

- Cyberpunk-inspired design
- Real-time status indicators
- Agent management panels
- Translation interface
- Results visualization

### 🔧 SYSTEM MANAGEMENT

- Agent lifecycle management
- Performance monitoring
- Error handling and recovery
- Resource optimization
- Health check systems

---

**Total Functions**: 50+ distinct functions  
**Core Systems**: 6 major subsystems  
**Integration Points**: 15+ external services  
**Performance Target**: <3s average response time
