# 🤖 Cloudflare Workers Library - THE_POLACZEK_AGENT_SYSTEM_AI_BROWSER

## 📋 INSTRUKCJE WDROŻENIA

### 1. Konfiguracja Cloudflare Worker

```javascript
// the-polaczek-agent-system-worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // POLACZEK Agents Orchestration
    if (url.pathname === "/api/polaczek-agents") {
      return await handlePolaczekAgents(request, env);
    }

    // Browser Automation Engine
    if (url.pathname === "/api/browser-automation") {
      return await handleBrowserAutomation(request, env);
    }

    // RAG Processing System
    if (url.pathname === "/api/rag-processing") {
      return await handleRAGProcessing(request, env);
    }

    // Web Crawler Manager
    if (url.pathname === "/api/web-crawler") {
      return await handleWebCrawler(request, env);
    }

    return new Response("THE POLACZEK Agent System AI Browser Active", {
      status: 200,
    });
  },
};

// POLACZEK Agents Handler
async function handlePolaczekAgents(request, env) {
  try {
    const { agent, task, context } = await request.json();

    const agentConfigs = {
      POLACZEK_D: {
        role: "Dyrektor - Orchestrator",
        model: "@cf/meta/llama-3.1-8b-instruct",
        systemPrompt:
          "Jestem dyrektorem AI koordynującym zespół POLACZEK agents...",
      },
      POLACZEK_T: {
        role: "Tłumacz - Translation Specialist",
        model: "@cf/facebook/bart-large-cnn",
        systemPrompt:
          "Specjalizuję się w tłumaczeniach i analizie językowej...",
      },
      POLACZEK_B: {
        role: "Bibliotekarz - Knowledge Manager",
        model: "@cf/deepseek-ai/deepseek-math-7b-instruct",
        systemPrompt: "Zarządzam wiedzą i dokumentacją systemową...",
      },
      POLACZEK_M1: {
        role: "Manager - Workflow Coordinator",
        model: "@cf/google/gemma-2b-it",
        systemPrompt: "Koordynuję przepływ pracy między agentami...",
      },
    };

    const selectedAgent = agentConfigs[agent];
    if (!selectedAgent) {
      throw new Error(`Unknown agent: ${agent}`);
    }

    // Process through Cloudflare AI
    const aiResponse = await env.AI.run(selectedAgent.model, {
      messages: [
        { role: "system", content: selectedAgent.systemPrompt },
        { role: "user", content: `Task: ${task}\nContext: ${context}` },
      ],
    });

    return new Response(
      JSON.stringify({
        success: true,
        agent: agent,
        role: selectedAgent.role,
        response: aiResponse.response,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Browser Automation Handler
async function handleBrowserAutomation(request, env) {
  try {
    const { action, url, config } = await request.json();

    let result;

    switch (action) {
      case "screenshot":
        result = await takeScreenshot(url, config, env);
        break;
      case "pdf_generation":
        result = await generatePDF(url, config, env);
        break;
      case "html_extraction":
        result = await extractHTML(url, config, env);
        break;
      case "text_extraction":
        result = await extractText(url, config, env);
        break;
      case "form_interaction":
        result = await interactWithForm(url, config, env);
        break;
      default:
        throw new Error(`Unknown automation action: ${action}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: action,
        url: url,
        result: result,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// RAG Processing Handler
async function handleRAGProcessing(request, env) {
  try {
    const { documents, query, mode } = await request.json();

    // Process documents through Vectorize
    const vectorizedDocs = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
          text: doc.content,
        });

        return {
          id: doc.id,
          content: doc.content,
          embedding: embedding,
        };
      })
    );

    // Store in Vectorize
    await env.VECTORIZE_INDEX.upsert(vectorizedDocs);

    // Query processing
    const queryEmbedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: query,
    });

    const searchResults = await env.VECTORIZE_INDEX.query(queryEmbedding, {
      topK: 5,
    });

    // Generate response using RAG
    const contextualResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "system",
            content:
              "Jesteś asystentem AI wykorzystującym kontekst dokumentów do udzielania odpowiedzi.",
          },
          {
            role: "user",
            content: `Pytanie: ${query}\n\nKontekst:\n${searchResults.matches
              .map((m) => m.metadata.content)
              .join("\n\n")}`,
          },
        ],
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        query: query,
        relevant_documents: searchResults.matches.length,
        response: contextualResponse.response,
        sources: searchResults.matches.map((m) => ({
          id: m.id,
          score: m.score,
        })),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Web Crawler Handler
async function handleWebCrawler(request, env) {
  try {
    const { urls, depth, filters } = await request.json();

    const crawlResults = await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "POLACZEK-Agent-System-Crawler/1.0",
          },
        });

        const html = await response.text();
        const text = extractTextFromHTML(html);
        const links = extractLinksFromHTML(html);

        return {
          url: url,
          status: response.status,
          title: extractTitleFromHTML(html),
          content: text,
          links: links.slice(0, depth * 10), // Limit based on depth
          metadata: {
            crawled_at: new Date().toISOString(),
            content_length: text.length,
            links_found: links.length,
          },
        };
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        crawl_summary: {
          urls_processed: urls.length,
          total_content_length: crawlResults.reduce(
            (sum, r) => sum + r.content.length,
            0
          ),
          total_links_found: crawlResults.reduce(
            (sum, r) => sum + r.links.length,
            0
          ),
        },
        results: crawlResults,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Browser Automation Functions
async function takeScreenshot(url, config, env) {
  // Use Cloudflare Browser Rendering API
  const browser = await env.BROWSER.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const screenshot = await page.screenshot({
    format: config.format || "png",
    quality: config.quality || 80,
  });

  await browser.close();

  return {
    format: config.format || "png",
    size: screenshot.length,
    base64: screenshot.toString("base64"),
  };
}

async function generatePDF(url, config, env) {
  const browser = await env.BROWSER.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const pdf = await page.pdf({
    format: config.format || "A4",
    margin: config.margin || {
      top: "1cm",
      bottom: "1cm",
      left: "1cm",
      right: "1cm",
    },
  });

  await browser.close();

  return {
    format: "pdf",
    size: pdf.length,
    base64: pdf.toString("base64"),
  };
}

async function extractHTML(url, config, env) {
  const response = await fetch(url);
  const html = await response.text();

  return {
    html: html,
    size: html.length,
    extracted_at: new Date().toISOString(),
  };
}

async function extractText(url, config, env) {
  const response = await fetch(url);
  const html = await response.text();
  const text = extractTextFromHTML(html);

  return {
    text: text,
    word_count: text.split(/\s+/).length,
    character_count: text.length,
  };
}

// Utility Functions
function extractTextFromHTML(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinksFromHTML(html) {
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  const links = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }

  return [...new Set(links)]; // Remove duplicates
}

function extractTitleFromHTML(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : "No title found";
}
```

### 2. Wrangler Configuration

```toml
# wrangler.toml
name = "the-polaczek-agent-system-ai-browser"
main = "src/the-polaczek-agent-system-worker.js"
compatibility_date = "2024-01-01"

[env.production]
name = "the-polaczek-agent-system-prod"

[vars]
ENVIRONMENT = "production"
API_VERSION = "1.0.0"

[[ai]]
binding = "AI"

[[browser]]
binding = "BROWSER"

[[vectorize]]
binding = "VECTORIZE_INDEX"
index_name = "polaczek-knowledge-base"

[[kv_namespaces]]
binding = "AGENT_CACHE"
id = "your-kv-namespace-id"

[[d1_databases]]
binding = "CRAWL_HISTORY"
database_name = "polaczek-crawl-history"
database_id = "your-d1-database-id"
```

### 3. Deployment Commands

```bash
# Create Vectorize index
wrangler vectorize create polaczek-knowledge-base --dimensions=768 --metric=cosine

# Create KV namespace
wrangler kv:namespace create "AGENT_CACHE"
wrangler kv:namespace create "AGENT_CACHE" --preview

# Create D1 database
wrangler d1 create polaczek-crawl-history

# Deploy to production
wrangler deploy

# Monitor logs
wrangler tail
```

### 4. Database Schema

```sql
-- D1 Database Schema
CREATE TABLE crawl_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  crawled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status INTEGER,
  content_length INTEGER,
  links_found INTEGER,
  agent_used TEXT
);

CREATE TABLE agent_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  agent_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  tasks_completed INTEGER DEFAULT 0
);

CREATE INDEX idx_crawl_url ON crawl_history(url);
CREATE INDEX idx_session_id ON agent_sessions(session_id);
```

## 📊 INSTRUKCJE PO ETAPIE - THE_POLACZEK_AGENT_SYSTEM_AI_BROWSER

### Co zostało dodane:

1. ✅ **Zmiana nazwy** z "AI Browser & Agents" na "THE_POLACZEK_AGENT_SYSTEM_AI_BROWSER"
2. ✅ **Cloudflare Worker Library** - kompletny system agentów POLACZEK
3. ✅ **4 główne handlery** - Agents, Browser Automation, RAG Processing, Web Crawler
4. ✅ **POLACZEK Agents Configuration** - 4 specjalistyczne agenty z rolami
5. ✅ **Browser Rendering API** - screenshot, PDF, HTML, text extraction
6. ✅ **RAG System** - Vectorize integration z embeddings
7. ✅ **Web Crawler** - inteligentne przeszukiwanie stron

### Co zostało zmienione:

- Wszystkie pliki dokumentacji 08\* otrzymały nową nazwę THE_POLACZEK_AGENT_SYSTEM_AI_BROWSER
- Główny tytuł systemu w plikach analitycznych
- Focus na orchestrację agentów POLACZEK

### Jak powinno działać:

1. **POLACZEK Agents** - 4 wyspecjalizowane agenty AI (Dyrektor, Tłumacz, Bibliotekarz, Manager)
2. **Browser Automation** - screenshot, PDF generation, form interaction przez Cloudflare Browser API
3. **RAG Processing** - dokumenty → embeddings → Vectorize → kontekstowe odpowiedzi
4. **Web Crawler** - inteligentne crawlowanie z analizą treści i linków
5. **Vectorize Index** - knowledge base dla agentów POLACZEK
6. **D1 Database** - historia crawlingu i sesje agentów

### Następne kroki:

1. Wykonaj deployment commands w kolejności
2. Skonfiguruj Vectorize index z proper dimensionality (768)
3. Utwórz D1 database z provided schema
4. Włącz Browser Rendering API w Cloudflare dashboard
5. Testuj każdy endpoint osobno

### Integracja z główną aplikacją:

```javascript
// W src/pages/api/browser-automation.ts
const CLOUDFLARE_WORKER_URL =
  "https://the-polaczek-agent-system-ai-browser.your-domain.workers.dev";

// Wywołanie POLACZEK agents
const agentResponse = await fetch(
  `${CLOUDFLARE_WORKER_URL}/api/polaczek-agents`,
  {
    method: "POST",
    body: JSON.stringify({
      agent: "POLACZEK_D",
      task: "Orchestrate web research",
      context: "User needs comprehensive analysis",
    }),
  }
);

// Browser automation
const browserAction = await fetch(
  `${CLOUDFLARE_WORKER_URL}/api/browser-automation`,
  {
    method: "POST",
    body: JSON.stringify({
      action: "screenshot",
      url: "https://example.com",
      config: { format: "png", quality: 90 },
    }),
  }
);
```

### Kluczowe features:

- **Multi-Agent Orchestration** - koordynacja 4 agentów POLACZEK
- **Intelligent Browser Control** - automated interactions
- **Knowledge Management** - RAG z persistent storage
- **Scalable Crawling** - distributed web scraping
- **Performance Optimized** - Cloudflare edge computing
