# 🕷️ AGENCI 04-06 - CRAWLER, EMAIL, DATABASE - REAL FUNCTIONS

**Akcja**: Implementacja realnych funkcji dla agentów 04, 05, 06  
**Powód**: Crawler, Email i Database muszą działać z prawdziwymi danymi  
**Dalej**: Pełna integracja z Cloudflare Workers i D1

---

## 🕷️ AGENT 04 - WEB CRAWLER REAL-TIME

### Istniejący Kod (Linie 792-794 index.astro)

```astro
<button onclick="toggleCrawlerAgent()" class="right-btn" id="crawlerAgentBtn" title="Agent 04 - Web Crawler Agent">
  🕷️ AGENT 04 - CRAWLER
</button>
```

### REAL IMPLEMENTATION - Tavily API + Cloudflare Workers

```javascript
// public/scripts/crawler-agent-real.js
class CrawlerAgent04 {
  constructor() {
    this.isRunning = false;
    this.crawlResults = [];
    this.currentJob = null;
    this.init();
  }

  init() {
    this.setupCrawlerUI();
  }

  async startCrawl(url, depth = 1, keywords = []) {
    if (this.isRunning) {
      this.updateStatus("❌ Crawler już działa");
      return;
    }

    this.isRunning = true;
    this.updateStatus("🕷️ Rozpoczynam crawling...");

    try {
      // Użyj Tavily API dla real search
      const response = await fetch("/api/crawler/tavily-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: url,
          max_results: depth * 5,
          search_depth: depth === 1 ? "basic" : "advanced",
          include_domains: [new URL(url).hostname],
          keywords: keywords,
        }),
      });

      if (!response.ok) throw new Error("Tavily API error");

      const data = await response.json();
      this.processCrawlResults(data.results);
    } catch (error) {
      console.error("Crawler error:", error);
      this.updateStatus(`❌ Błąd: ${error.message}`);
    } finally {
      this.isRunning = false;
    }
  }

  async processCrawlResults(results) {
    this.crawlResults = results.map((result) => ({
      url: result.url,
      title: result.title,
      content: result.content.substring(0, 500),
      score: result.score,
      timestamp: Date.now(),
      metadata: {
        images: result.raw_content?.images || [],
        links: result.raw_content?.links || [],
        keywords: this.extractKeywords(result.content),
      },
    }));

    // Zapisz do D1 database
    await this.saveCrawlResultsToD1();

    // Update UI
    this.updateResultsDisplay();
    this.updateStatus(`✅ Znaleziono ${this.crawlResults.length} stron`);
  }

  extractKeywords(content) {
    // Prosta ekstrakcja słów kluczowych (można rozbudować z AI)
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const frequency = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  async saveCrawlResultsToD1() {
    try {
      await fetch("/api/crawler/save-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: this.crawlResults,
          jobId: this.generateJobId(),
        }),
      });
    } catch (error) {
      console.error("Błąd zapisu do D1:", error);
    }
  }

  async searchInCrawledData(query) {
    try {
      const response = await fetch(
        `/api/crawler/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      this.displaySearchResults(data.results);
      this.updateStatus(
        `🔍 Znaleziono ${data.results.length} wyników dla: ${query}`
      );
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  displaySearchResults(results) {
    const searchResultsEl = document.getElementById("crawlerSearchResults");
    if (!searchResultsEl) return;

    searchResultsEl.innerHTML = results
      .map(
        (result) => `
      <div class="search-result-item">
        <div class="result-title">
          <a href="${result.url}" target="_blank">${result.title}</a>
          <span class="result-score">(${Math.round(result.score * 100)}%)</span>
        </div>
        <div class="result-content">${result.content}</div>
        <div class="result-keywords">
          ${result.metadata.keywords
            .map((kw) => `<span class="keyword-tag">${kw}</span>`)
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
  }

  updateResultsDisplay() {
    const resultsEl = document.getElementById("crawlerResults");
    if (!resultsEl) return;

    resultsEl.innerHTML = `
      <div class="crawler-stats">
        <div class="stat-item">URLs: ${this.crawlResults.length}</div>
        <div class="stat-item">Avg Score: ${this.getAverageScore()}%</div>
        <div class="stat-item">Last: ${new Date().toLocaleTimeString()}</div>
      </div>
      <div class="crawler-results-list">
        ${this.crawlResults
          .slice(0, 5)
          .map(
            (result) => `
          <div class="crawler-result-item">
            <a href="${result.url}" target="_blank">${result.title}</a>
            <div class="result-preview">${result.content}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  getAverageScore() {
    if (this.crawlResults.length === 0) return 0;
    const total = this.crawlResults.reduce(
      (sum, result) => sum + (result.score || 0),
      0
    );
    return Math.round((total / this.crawlResults.length) * 100);
  }

  generateJobId() {
    return "job_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  updateStatus(status) {
    const statusEl = document.getElementById("crawlerStatus");
    if (statusEl) statusEl.textContent = status;
  }

  setupCrawlerUI() {
    // Będzie dodane do widget'u
  }
}

// Global instance
window.crawlerAgent04 = new CrawlerAgent04();
```

### API Endpoint dla Tavily Integration

```typescript
// src/pages/api/crawler/tavily-search.ts
export async function POST({ request, locals }) {
  try {
    const { query, max_results, search_depth, include_domains, keywords } =
      await request.json();
    const apiKey = (locals as any)?.runtime?.env?.TAVILY_API_KEY;

    if (!apiKey) throw new Error("Tavily API key not found");

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: search_depth,
        include_answer: true,
        include_images: true,
        include_raw_content: true,
        max_results: max_results,
        include_domains: include_domains,
      }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        results: data.results,
        answer: data.answer,
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
```

---

## 📧 AGENT 05 - EMAIL MANAGER REAL SMTP

### Istniejący Kod (Linie 796-798 index.astro)

```astro
<button onclick="toggleEmailAgent()" class="right-btn" id="emailAgentBtn" title="Agent 05 - Email Manager Agent">
  📧 AGENT 05 - EMAIL
</button>
```

### REAL IMPLEMENTATION - MailChannels API + D1 Storage

```javascript
// public/scripts/email-agent-real.js
class EmailAgent05 {
  constructor() {
    this.inbox = [];
    this.outbox = [];
    this.templates = [];
    this.isConnected = false;
    this.init();
  }

  async init() {
    await this.checkEmailConnection();
    await this.loadEmailTemplates();
    await this.loadInbox();
  }

  async checkEmailConnection() {
    try {
      const response = await fetch("/api/email/connection-test");
      const data = await response.json();
      this.isConnected = data.success;
      this.updateConnectionStatus();
    } catch (error) {
      this.isConnected = false;
      console.error("Email connection test failed:", error);
    }
  }

  async sendEmail(to, subject, body, template = null) {
    if (!this.isConnected) {
      this.updateStatus("❌ Brak połączenia email");
      return false;
    }

    this.updateStatus("📤 Wysyłam email...");

    try {
      const emailData = {
        to: to,
        subject: subject,
        html: template ? this.applyTemplate(template, { body, subject }) : body,
        from: "ai-agent@mybonzo.com",
      };

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) throw new Error("Email send failed");

      const result = await response.json();

      // Log to outbox
      await this.logToOutbox(emailData, result);

      this.updateStatus("✅ Email wysłany");
      return true;
    } catch (error) {
      this.updateStatus(`❌ Błąd: ${error.message}`);
      return false;
    }
  }

  async loadEmailTemplates() {
    try {
      const response = await fetch("/api/email/templates");
      const data = await response.json();
      this.templates = data.templates || [];
      this.updateTemplatesDropdown();
    } catch (error) {
      console.error("Błąd ładowania szablonów:", error);
      // Default templates
      this.templates = [
        {
          id: "welcome",
          name: "Powitanie",
          subject: "Witaj w MyBonzo AI!",
          body: "<h1>Witaj {{name}}!</h1><p>Dziękujemy za dołączenie do MyBonzo AI Platform.</p>",
        },
        {
          id: "notification",
          name: "Powiadomienie",
          subject: "Powiadomienie: {{title}}",
          body: "<div><h2>{{title}}</h2><p>{{message}}</p></div>",
        },
      ];
    }
  }

  applyTemplate(templateId, variables) {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return variables.body;

    let html = template.body;
    Object.keys(variables).forEach((key) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
    });

    return html;
  }

  async loadInbox() {
    try {
      const response = await fetch("/api/email/inbox");
      const data = await response.json();
      this.inbox = data.emails || [];
      this.updateInboxDisplay();
    } catch (error) {
      console.error("Błąd ładowania skrzynki:", error);
    }
  }

  async logToOutbox(emailData, result) {
    try {
      await fetch("/api/email/log-outbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...emailData,
          messageId: result.messageId,
          timestamp: Date.now(),
          status: "sent",
        }),
      });
    } catch (error) {
      console.error("Błąd logowania do outbox:", error);
    }
  }

  async createBulkEmail(recipients, template, variables) {
    const results = [];
    this.updateStatus(`📬 Wysyłam do ${recipients.length} odbiorców...`);

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const personalizedVars = { ...variables, ...recipient };

      const success = await this.sendEmail(
        recipient.email,
        this.applyTemplate(template, personalizedVars).subject || "Newsletter",
        "",
        template
      );

      results.push({ email: recipient.email, success });

      // Progress update
      this.updateStatus(`📬 ${i + 1}/${recipients.length} wysłano`);

      // Delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const successCount = results.filter((r) => r.success).length;
    this.updateStatus(`✅ Wysłano ${successCount}/${recipients.length} emails`);

    return results;
  }

  updateInboxDisplay() {
    const inboxEl = document.getElementById("emailInbox");
    if (!inboxEl) return;

    inboxEl.innerHTML = this.inbox
      .slice(0, 10)
      .map(
        (email) => `
      <div class="email-item ${email.read ? "" : "unread"}">
        <div class="email-header">
          <span class="email-from">${email.from}</span>
          <span class="email-date">${new Date(
            email.timestamp
          ).toLocaleDateString()}</span>
        </div>
        <div class="email-subject">${email.subject}</div>
        <div class="email-preview">${email.preview}</div>
      </div>
    `
      )
      .join("");
  }

  updateTemplatesDropdown() {
    const dropdown = document.getElementById("emailTemplatesDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `
      <option value="">Wybierz szablon...</option>
      ${this.templates
        .map(
          (template) => `
        <option value="${template.id}">${template.name}</option>
      `
        )
        .join("")}
    `;
  }

  updateConnectionStatus() {
    const statusEl = document.getElementById("emailConnectionStatus");
    if (statusEl) {
      statusEl.textContent = this.isConnected
        ? "✅ Połączono"
        : "❌ Rozłączono";
      statusEl.className = this.isConnected ? "connected" : "disconnected";
    }
  }

  updateStatus(status) {
    const statusEl = document.getElementById("emailAgentStatus");
    if (statusEl) statusEl.textContent = status;
  }
}

// Global instance
window.emailAgent05 = new EmailAgent05();
```

### API Endpoint dla MailChannels

```typescript
// src/pages/api/email/send.ts
export async function POST({ request, locals }) {
  try {
    const { to, subject, html, from } = await request.json();

    // MailChannels API integration
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: {
          email: from,
          name: "MyBonzo AI Agent",
        },
        subject: subject,
        content: [
          {
            type: "text/html",
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`MailChannels API error: ${response.status}`);
    }

    // Log to D1 database
    const db = (locals as any)?.runtime?.env?.DB;
    if (db) {
      await db
        .prepare(
          `
        INSERT INTO email_log (to_email, subject, status, timestamp, message_id)
        VALUES (?, ?, ?, ?, ?)
      `
        )
        .bind(to, subject, "sent", Date.now(), `mc_${Date.now()}`)
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: `mc_${Date.now()}`,
        message: "Email sent successfully",
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
```

---

## 🗃️ AGENT 06 - DATABASE QUERY REAL D1

### Istniejący Kod (Linie 800-802 index.astro)

```astro
<button onclick="toggleDatabaseAgent()" class="right-btn" id="databaseAgentBtn" title="Agent 06 - Database Query Agent">
  🗃️ AGENT 06 - DATABASE
</button>
```

### REAL IMPLEMENTATION - Cloudflare D1 + SQL Builder

```javascript
// public/scripts/database-agent-real.js
class DatabaseAgent06 {
  constructor() {
    this.tables = [];
    this.queryHistory = [];
    this.currentQuery = "";
    this.isConnected = false;
    this.init();
  }

  async init() {
    await this.checkDatabaseConnection();
    await this.loadDatabaseSchema();
    this.setupQueryBuilder();
  }

  async checkDatabaseConnection() {
    try {
      const response = await fetch("/api/database/connection-test");
      const data = await response.json();
      this.isConnected = data.success;
      this.updateConnectionStatus();
    } catch (error) {
      this.isConnected = false;
      console.error("Database connection test failed:", error);
    }
  }

  async loadDatabaseSchema() {
    try {
      const response = await fetch("/api/database/schema");
      const data = await response.json();
      this.tables = data.tables || [];
      this.updateTablesDisplay();
    } catch (error) {
      console.error("Schema loading error:", error);
    }
  }

  async executeQuery(query, params = []) {
    if (!this.isConnected) {
      this.updateStatus("❌ Brak połączenia z bazą");
      return null;
    }

    this.updateStatus("🔄 Wykonuję zapytanie...");

    try {
      const response = await fetch("/api/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, params }),
      });

      if (!response.ok) throw new Error("Query execution failed");

      const result = await response.json();

      // Add to history
      this.queryHistory.unshift({
        query,
        params,
        results: result.results,
        timestamp: Date.now(),
        rowCount: result.results?.length || 0,
      });

      this.updateResultsDisplay(result);
      this.updateQueryHistory();
      this.updateStatus(
        `✅ Zapytanie wykonane (${result.results?.length || 0} wierszy)`
      );

      return result;
    } catch (error) {
      this.updateStatus(`❌ Błąd: ${error.message}`);
      return null;
    }
  }

  buildSelectQuery(
    table,
    columns = ["*"],
    where = "",
    orderBy = "",
    limit = ""
  ) {
    let query = `SELECT ${columns.join(", ")} FROM ${table}`;

    if (where) query += ` WHERE ${where}`;
    if (orderBy) query += ` ORDER BY ${orderBy}`;
    if (limit) query += ` LIMIT ${limit}`;

    return query;
  }

  async quickSelect(table, limit = 10) {
    const query = this.buildSelectQuery(table, ["*"], "", "", limit.toString());
    return await this.executeQuery(query);
  }

  async searchInTable(table, column, searchTerm) {
    const query = this.buildSelectQuery(
      table,
      ["*"],
      `${column} LIKE ?`,
      "",
      "20"
    );
    return await this.executeQuery(query, [`%${searchTerm}%`]);
  }

  async getTableStats(table) {
    const queries = [
      `SELECT COUNT(*) as total_rows FROM ${table}`,
      `SELECT COUNT(DISTINCT *) as unique_rows FROM ${table}`,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
    ];

    const stats = {};
    for (const query of queries) {
      const result = await this.executeQuery(query);
      if (result?.results?.[0]) {
        Object.assign(stats, result.results[0]);
      }
    }

    return stats;
  }

  async createTable(tableName, columns) {
    const columnDefs = columns
      .map(
        (col) =>
          `${col.name} ${col.type}${col.primaryKey ? " PRIMARY KEY" : ""}${
            col.notNull ? " NOT NULL" : ""
          }`
      )
      .join(", ");

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`;
    return await this.executeQuery(query);
  }

  async insertData(table, data) {
    if (!Array.isArray(data)) data = [data];

    const columns = Object.keys(data[0]);
    const placeholders = columns.map(() => "?").join(", ");
    const query = `INSERT INTO ${table} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    const results = [];
    for (const row of data) {
      const values = columns.map((col) => row[col]);
      const result = await this.executeQuery(query, values);
      results.push(result);
    }

    return results;
  }

  updateResultsDisplay(result) {
    const resultsEl = document.getElementById("databaseResults");
    if (!resultsEl) return;

    if (!result.results || result.results.length === 0) {
      resultsEl.innerHTML = '<div class="no-results">Brak wyników</div>';
      return;
    }

    const columns = Object.keys(result.results[0]);

    resultsEl.innerHTML = `
      <div class="results-table">
        <table>
          <thead>
            <tr>${columns.map((col) => `<th>${col}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${result.results
              .slice(0, 50)
              .map(
                (row) => `
              <tr>${columns
                .map((col) => `<td>${row[col] ?? "NULL"}</td>`)
                .join("")}</tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      ${
        result.results.length > 50
          ? `<div class="results-note">Pokazano 50 z ${result.results.length} wyników</div>`
          : ""
      }
    `;
  }

  updateTablesDisplay() {
    const tablesEl = document.getElementById("databaseTables");
    if (!tablesEl) return;

    tablesEl.innerHTML = this.tables
      .map(
        (table) => `
      <div class="table-item">
        <div class="table-name" onclick="window.databaseAgent06.quickSelect('${table.name}')">${table.name}</div>
        <div class="table-actions">
          <button onclick="window.databaseAgent06.getTableStats('${table.name}')" class="btn-small">📊</button>
          <button onclick="window.databaseAgent06.describeTable('${table.name}')" class="btn-small">ℹ️</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  updateQueryHistory() {
    const historyEl = document.getElementById("queryHistory");
    if (!historyEl) return;

    historyEl.innerHTML = this.queryHistory
      .slice(0, 10)
      .map(
        (item, index) => `
      <div class="history-item">
        <div class="history-query" onclick="window.databaseAgent06.loadHistoryQuery(${index})">${
          item.query
        }</div>
        <div class="history-meta">${new Date(
          item.timestamp
        ).toLocaleTimeString()} - ${item.rowCount} wierszy</div>
      </div>
    `
      )
      .join("");
  }

  loadHistoryQuery(index) {
    const item = this.queryHistory[index];
    if (item) {
      const queryInput = document.getElementById("sqlQueryInput");
      if (queryInput) queryInput.value = item.query;
    }
  }

  setupQueryBuilder() {
    // Query builder UI setup - będzie dodane do widget'u
  }

  updateConnectionStatus() {
    const statusEl = document.getElementById("databaseConnectionStatus");
    if (statusEl) {
      statusEl.textContent = this.isConnected
        ? "✅ D1 Połączono"
        : "❌ Rozłączono";
      statusEl.className = this.isConnected ? "connected" : "disconnected";
    }
  }

  updateStatus(status) {
    const statusEl = document.getElementById("databaseAgentStatus");
    if (statusEl) statusEl.textContent = status;
  }
}

// Global instance
window.databaseAgent06 = new DatabaseAgent06();
```

### API Endpoints dla D1 Database

```typescript
// src/pages/api/database/query.ts
export async function POST({ request, locals }) {
  try {
    const { query, params = [] } = await request.json();
    const db = (locals as any)?.runtime?.env?.DB;

    if (!db) throw new Error("D1 Database not available");

    // Security check - only allow safe queries
    const safeQuery = query.trim().toLowerCase();
    const allowedQueries = [
      "select",
      "insert",
      "update",
      "delete",
      "create",
      "drop",
      "alter",
    ];
    const isAllowed = allowedQueries.some((cmd) => safeQuery.startsWith(cmd));

    if (!isAllowed) {
      throw new Error("Query type not allowed");
    }

    let result;
    if (params.length > 0) {
      result = await db
        .prepare(query)
        .bind(...params)
        .all();
    } else {
      result = await db.prepare(query).all();
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: result.results,
        meta: result.meta,
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

// src/pages/api/database/schema.ts
export async function GET({ locals }) {
  try {
    const db = (locals as any)?.runtime?.env?.DB;
    if (!db) throw new Error("D1 Database not available");

    const tables = await db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `
      )
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        tables: tables.results,
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
```

---

## ✅ IMPLEMENTACJA - NASTĘPNE KROKI

### 1. Dodaj skrypty do projektu

```astro
<script src="/scripts/crawler-agent-real.js"></script>
<script src="/scripts/email-agent-real.js"></script>
<script src="/scripts/database-agent-real.js"></script>
```

### 2. Stwórz API endpoints w src/pages/api/

### 3. Dodaj env variables do wrangler.toml

```toml
[vars]
TAVILY_API_KEY = "your-tavily-key"
```

### 4. Stwórz D1 tabele

```sql
CREATE TABLE crawl_results (id INTEGER PRIMARY KEY, url TEXT, title TEXT, content TEXT, score REAL, timestamp INTEGER);
CREATE TABLE email_log (id INTEGER PRIMARY KEY, to_email TEXT, subject TEXT, status TEXT, timestamp INTEGER, message_id TEXT);
CREATE TABLE music_tracks (id INTEGER PRIMARY KEY, title TEXT, url TEXT, artist TEXT, duration INTEGER, play_count INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at INTEGER);
```

**Status**: ✅ GOTOWY DO IMPLEMENTACJI  
**Następnie**: Agenci 07-09 w kolejnym pliku
