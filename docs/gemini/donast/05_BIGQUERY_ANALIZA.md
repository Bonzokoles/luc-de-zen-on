# 📊 BIGQUERY_ANALIZA_04 - SYSTEM ANALIZY BIGQUERY ANALYTICS

## 🎯 PRZEGLĄD SYSTEMU BIGQUERY ANALYTICS

### **🏗️ ARCHITEKTURA GŁÓWNA**

#### **Frontend Interface**

- **Plik główny**: `src/pages/bigquery-analytics.astro` (968 linii)
- **Typ**: Astro component z kompleksowym SQL Query Interface
- **Framework**: MyBonzoLayout + advanced data visualization
- **Funkcjonalność**: Pełny system BigQuery z real-time query execution

#### **Backend APIs**

- **API główny**: `src/pages/api/bigquery/analytics.ts` (369 linii)
- **SQL Execution**: Real-time BigQuery query processing
- **AI Integration**: Natural language to SQL conversion
- **Data Management**: Dataset exploration i analytics insights

#### **Supporting Components**

- **BigQuery Widget**: `src/components/BigQueryWidget.svelte` (489 linii)
- **BigQuery API**: `src/utils/bigQueryAPI.js` (311 linii)
- **Cloudflare Worker**: `cloudflare-workers/polaczek-bigquery-worker.js` (236 linii)
- **Worker API**: `src/workers/bigquery-api.ts`

---

## 🤖 GOOGLE CLOUD INTEGRATION

### **BIGQUERY PROVIDERS & SERVICES**

```
Google Cloud BigQuery  ← Primary data warehouse
Cloudflare AI Models   ← SQL generation (Llama 3.1)
Mock Data Service      ← Development fallback
Polish Analytics Team  ← Specialized support team
```

### **AVAILABLE DATASETS**

```javascript
analytics: {
  tables: ['pageviews', 'sessions', 'users', 'events'],
  description: 'Website Analytics Data'
}

ecommerce: {
  tables: ['orders', 'products', 'customers', 'transactions'],
  description: 'E-commerce Transaction Data'
}

marketing: {
  tables: ['campaigns', 'ads', 'conversions', 'attribution'],
  description: 'Marketing Campaign Analytics'
}

polish_ai_interactions: {
  tables: ['conversations', 'feedback', 'performance', 'users'],
  description: 'POLACZEK AI Analytics Data'
}
```

### **QUERY TEMPLATES**

```sql
-- Daily Statistics Query
SELECT DATE(created_at) as date,
       COUNT(*) as visits
FROM `{project}.{dataset}.analytics`
GROUP BY date
ORDER BY date DESC
LIMIT 30

-- User Engagement Analysis
SELECT user_type,
       AVG(session_duration) as avg_duration,
       COUNT(DISTINCT user_id) as users
FROM `{project}.{dataset}.sessions`
GROUP BY user_type

-- Conversion Funnel Query
WITH funnel AS (
  SELECT event_name,
         COUNT(DISTINCT user_id) as users
  FROM `{project}.{dataset}.events`
  WHERE event_name IN ('page_view', 'add_to_cart', 'purchase')
  GROUP BY event_name
)
SELECT * FROM funnel ORDER BY users DESC
```

---

## 🔧 STRUKTURA TECHNICZNA PLIKÓW

### **1. Frontend: bigquery-analytics.astro**

```
Metadata & SEO (linie 1-35)           → Head configuration & props
Header Section (36-59)                → Visual branding layout
Navigation (60-91)                    → Breadcrumb & main navigation
Query Interface (92-280)              → SQL editor & controls
Query Examples (281-400)              → Template queries section
Results Display (401-500)             → Data visualization area
Project Configuration (501-600)       → BigQuery project settings
JavaScript Functions (601-968)        → Core query execution logic
```

### **2. Backend: api/bigquery/analytics.ts**

```
Request Routing (linie 1-50)          → GET parameter handling
AI Help System (51-100)               → Natural language processing
Query Execution (101-150)             → BigQuery integration
Mock Data Service (151-200)           → Development fallback
SQL Generation (201-250)              → AI-powered SQL creation
Instructions System (251-300)         → Help & documentation
Dataset Management (301-369)          → Available datasets API
```

### **3. Component: BigQueryWidget.svelte**

```
Script Setup (1-70)                   → Component state & functions
Query Execution (71-150)              → API communication
Results Display (151-300)             → Data visualization
UI Components (301-400)               → Form controls & buttons
Styling (401-489)                     → CSS styles & animations
```

### **4. Utils: bigQueryAPI.js**

```
Class Constructor (1-30)              → API client setup
Query Methods (31-100)                → SQL execution functions
Analytics Methods (101-200)           → Data analysis functions
Dataset Management (201-250)          → Dataset exploration
Performance Monitoring (251-311)      → Query performance stats
```

---

## 📋 FUNKCJE JAVASCRIPT (15+ FUNKCJI)

### **QUERY EXECUTION & PROCESSING**

- `executeQuery()` - Główna funkcja wykonywania zapytań SQL
- `setQuery(query)` - Ustawianie predefiniowanych zapytań
- `validateQuery(query)` - Walidacja SQL przed wykonaniem
- `displayResults(results, metadata)` - Wyświetlanie wyników zapytania
- `displayError(message)` - Obsługa błędów wykonania

### **RESULT FORMATTING & DISPLAY**

- `displayTableResults(results, container)` - Formatowanie jako tabela HTML
- `displayJsonResults(results, container)` - Wyświetlanie w formacie JSON
- `displayCsvResults(results, container)` - Eksport do formatu CSV
- `exportResults(format)` - Pobieranie wyników w różnych formatach

### **PROJECT & DATASET MANAGEMENT**

- `loadProjects()` - Ładowanie dostępnych projektów Google Cloud
- `loadDatasets(projectId)` - Pobieranie datasetów dla projektu
- `loadTables(projectId, datasetId)` - Lista tabel w datasecie
- `exploreSchema(table)` - Analiza struktury tabeli

### **QUERY HISTORY & TEMPLATES**

- `addToHistory(query, metadata)` - Dodawanie do historii zapytań
- `loadQueryHistory()` - Wczytywanie zapisanych zapytań
- `saveQueryTemplate(name, query)` - Zapisywanie szablonów SQL
- `loadQueryTemplates()` - Ładowanie predefiniowanych szablonów

### **AI INTEGRATION FUNCTIONS**

- `generateSQLWithAI(description)` - AI-powered SQL generation
- `optimizeQuery(query)` - Optymalizacja zapytań przez AI
- `explainQuery(query)` - Wyjaśnienie logiki zapytania
- `suggestImprovements(query)` - Sugestie poprawek SQL

### **PERFORMANCE & MONITORING**

- `trackQueryPerformance(query, duration)` - Monitoring wydajności
- `getQueryStatistics()` - Statystyki wykonanych zapytań
- `estimateQueryCost(query)` - Szacowanie kosztów BigQuery
- `optimizeForPerformance(query)` - Optymalizacja pod kątem szybkości

---

## 🎛️ ELEMENTY UI I KONTROLKI

### **SQL QUERY INTERFACE**

- **Query Editor** (`#sqlQuery`) - Główny edytor SQL z syntax highlighting
- **Execute Button** (`#executeBtn`) - Przycisk wykonania zapytania
- **Query Templates** - Dropdown z predefiniowanymi zapytaniami
- **AI Helper** - Natural language to SQL converter

### **PROJECT CONFIGURATION**

- **Project ID Input** (`#projectId`) - Google Cloud Project ID
- **Dataset Selector** (`#datasetId`) - Wybór datasetu
- **Table Browser** (`#tablesList`) - Eksploracja dostępnych tabel
- **Schema Viewer** - Podgląd struktury tabel

### **QUERY SETTINGS**

- **Row Limit Slider** (`#rowLimit`) - Ograniczenie liczby wierszy (1-10000)
- **Output Format Select** (`#outputFormat`) - Format wyników (Table/JSON/CSV)
- **Query Timeout** - Timeout dla długotrwałych zapytań
- **Cache Settings** - Konfiguracja cache'owania wyników

### **RESULTS DISPLAY**

- **Results Table** (`#resultsContent`) - Tabela z wynikami zapytania
- **Metadata Panel** (`#resultsInfo`) - Informacje o wykonaniu
- **Export Options** - Przyciski eksportu (CSV, JSON, Excel)
- **Pagination Controls** - Nawigacja przez duże zbiory wyników

### **QUERY HISTORY**

- **History Panel** (`#queryHistory`) - Lista ostatnich zapytań
- **Favorite Queries** - Zapisane ulubione zapytania
- **Query Templates** - Biblioteka szablonów SQL
- **Share Query** - Udostępnianie zapytań innym użytkownikom

### **PERFORMANCE MONITORING**

- **Execution Time Display** (`#queryTime`) - Czas wykonania zapytania
- **Bytes Processed** - Ilość przetworzonych danych
- **Query Cost Estimate** - Szacowany koszt zapytania
- **Performance Tips** - Sugestie optymalizacji

---

## 💾 SYSTEM STORAGE I PERSISTENCE

### **LOCALSTORAGE MANAGEMENT**

```javascript
// BigQuery Settings
bigquerySettings = {
  defaultProjectId: "mybonzo-analytics",
  defaultDataset: "analytics",
  queryTimeout: 30000,
  rowLimit: 1000,
  outputFormat: "table",
  syntaxHighlighting: true,
  autoSave: true,
};

// Query History
queryHistory = [
  {
    query: "SELECT * FROM `project.dataset.table` LIMIT 100",
    timestamp: "2025-10-09T10:30:00Z",
    executionTime: 1.2,
    rowCount: 100,
    bytesProcessed: "1.2 MB",
  },
];

// Saved Templates
queryTemplates = {
  daily_stats: "SELECT DATE(created_at)...",
  user_analysis: "SELECT user_type...",
  conversion_funnel: "WITH funnel AS...",
};
```

### **GOOGLE CLOUD INTEGRATION**

```javascript
// Project Configuration
gcpProjects = [
  {
    projectId: "mybonzo-analytics",
    name: "MyBonzo Analytics",
    datasets: ["analytics", "ecommerce", "marketing"],
  },
];

// Authentication State
authState = {
  isAuthenticated: false,
  serviceAccountKey: null,
  permissions: ["bigquery.jobs.create", "bigquery.data.get"],
};
```

---

## 🔍 SQL QUERY PROCESSING SYSTEM

### **QUERY VALIDATION & SECURITY**

```javascript
// SQL Injection Protection
function validateQuery(query) {
  const dangerousPatterns =
    /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE)\b/i;

  if (dangerousPatterns.test(query)) {
    throw new Error("Potentially dangerous SQL operations are not allowed");
  }

  // Row limit enforcement
  if (!query.toLowerCase().includes("limit")) {
    query += " LIMIT 1000";
  }

  return query;
}

// Query Cost Estimation
function estimateQueryCost(query) {
  // Basic cost estimation based on query complexity
  const selectCount = (query.match(/SELECT/gi) || []).length;
  const joinCount = (query.match(/JOIN/gi) || []).length;
  const whereCount = (query.match(/WHERE/gi) || []).length;

  const complexity = selectCount + joinCount * 2 + whereCount;
  const estimatedCost = complexity * 0.005; // USD per query unit

  return {
    complexity: complexity,
    estimatedCost: estimatedCost,
    recommendation:
      complexity > 10
        ? "Consider optimizing this query"
        : "Query looks efficient",
  };
}
```

### **AI-POWERED SQL GENERATION**

```javascript
// Natural Language to SQL Conversion
async function generateSQLWithAI(description, dataset = "analytics") {
  const prompt = `
    Convert this natural language request to BigQuery SQL:
    "${description}"
    
    Available dataset: ${dataset}
    Tables: pageviews, sessions, users, events
    
    Return only the SQL query, no explanations.
  `;

  const response = await fetch("/api/bigquery/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ai_help: description, dataset: dataset }),
  });

  const result = await response.json();
  return result.ai_response.sql_query;
}

// Query Explanation Service
async function explainQuery(query) {
  const explanation = await fetch("/api/bigquery/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "explain_query",
      query: query,
    }),
  });

  return explanation.json();
}
```

---

## 📊 DATA VISUALIZATION & EXPORT

### **RESULTS DISPLAY FORMATS**

```javascript
// Table Format with Pagination
function displayTableResults(results, container) {
  const pageSize = 50;
  let currentPage = 0;

  function renderPage(page) {
    const startIdx = page * pageSize;
    const endIdx = startIdx + pageSize;
    const pageData = results.slice(startIdx, endIdx);

    const columns = Object.keys(results[0]);
    let html = '<table class="results-table"><thead><tr>';

    columns.forEach((col) => {
      html += `<th onclick="sortBy('${col}')" class="sortable">${col}</th>`;
    });
    html += "</tr></thead><tbody>";

    pageData.forEach((row) => {
      html += "<tr>";
      columns.forEach((col) => {
        const value = row[col];
        html += `<td>${formatCellValue(value)}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table>";
    html += generatePaginationControls(
      page,
      Math.ceil(results.length / pageSize)
    );

    container.innerHTML = html;
  }

  renderPage(0);
}

// Advanced Export Options
function exportResults(results, format, filename) {
  switch (format) {
    case "csv":
      return exportToCSV(results, filename);
    case "json":
      return exportToJSON(results, filename);
    case "excel":
      return exportToExcel(results, filename);
    case "pdf":
      return exportToPDF(results, filename);
  }
}
```

### **QUERY PERFORMANCE ANALYTICS**

```javascript
// Performance Tracking
class QueryPerformanceTracker {
  constructor() {
    this.metrics = JSON.parse(localStorage.getItem("queryMetrics") || "[]");
  }

  trackQuery(query, executionTime, bytesProcessed, rowCount) {
    const metric = {
      query: query.substring(0, 100) + "...",
      executionTime: executionTime,
      bytesProcessed: bytesProcessed,
      rowCount: rowCount,
      timestamp: new Date().toISOString(),
      cost: this.calculateCost(bytesProcessed),
    };

    this.metrics.push(metric);
    this.saveMetrics();
  }

  getPerformanceReport() {
    return {
      totalQueries: this.metrics.length,
      avgExecutionTime: this.getAverageExecutionTime(),
      totalCost: this.getTotalCost(),
      slowestQueries: this.getSlowestQueries(5),
      mostExpensiveQueries: this.getMostExpensiveQueries(5),
    };
  }

  calculateCost(bytesProcessed) {
    // BigQuery pricing: $5 per TB processed
    const tbProcessed = bytesProcessed / (1024 * 1024 * 1024 * 1024);
    return tbProcessed * 5;
  }
}
```

---

## 🔄 API ENDPOINTS I DATA FLOW

### **GŁÓWNY WORKFLOW BIGQUERY**

```
User Query → Validation → AI Enhancement → BigQuery Execution → Result Processing → Visualization → Export
```

### **API ENDPOINTS STRUCTURE**

```
/api/bigquery/analytics             ← Main BigQuery API
  ├── GET ?query=SQL                ← Execute SQL query
  ├── GET ?ai_help=DESCRIPTION      ← AI SQL generation
  ├── GET ?instructions=true        ← API documentation
  └── GET ?dataset=NAME             ← Dataset exploration

/api/bigquery-light                 ← Lightweight query endpoint
  └── POST {query, projectId}       ← Simple query execution

/api/polaczek/bigquery             ← Polish AI specialized endpoint
  ├── POST /query                   ← Polish analytics queries
  ├── GET /analytics                ← Performance analytics
  └── GET /datasets                 ← Available datasets
```

### **REQUEST/RESPONSE FORMATS**

#### **SQL Query Request**

```javascript
{
  query: "SELECT * FROM `project.dataset.table` LIMIT 100",
  projectId: "mybonzo-analytics",
  datasetId: "analytics",
  rowLimit: 1000,
  format: "table",
  timeout: 30000
}
```

#### **AI Help Request**

```javascript
{
  ai_help: "Show me the top 10 pages with most views last month",
  dataset: "analytics",
  context: {
    available_tables: ["pageviews", "sessions", "users"],
    user_preferences: {
      date_format: "YYYY-MM-DD",
      limit_default: 100
    }
  }
}
```

#### **Query Response**

```javascript
{
  success: true,
  service: "BigQuery Analytics",
  query: "SELECT page_path, COUNT(*) as views...",
  results: {
    rows: [...],
    schema: [...],
    totalRows: 150,
    jobComplete: true,
    bytesProcessed: 1048576
  },
  metadata: {
    executionTime: 1.5,
    jobId: "job_12345",
    location: "US",
    creationTime: "2025-10-09T10:30:00Z"
  },
  ai_insights: "This query shows your most popular content..."
}
```

---

## ⚙️ CLOUDFLARE WORKERS INTEGRATION

### **POLACZEK BIGQUERY WORKER**

```javascript
// Main Worker Configuration
const BIGQUERY_CONFIG = {
  projectId: "mybonzo-polaczek-analytics",
  datasetId: "polish_ai_interactions",
  location: "europe-west1",
  tables: {
    conversations: "conversations",
    feedback: "feedback",
    performance: "performance",
    users: "users",
  },
};

// Analytics Team Structure
const ANALYTICS_TEAM = {
  ANNA_NOWAK: {
    name: "Anna Nowak",
    role: "Data Scientist - BigQuery Lead",
    specialization: "Polish AI Analytics",
    email: "anna.nowak@mybonzo.com",
  },
  PIOTR_WISNIEWSKI: {
    name: "Piotr Wiśniewski",
    role: "ML Engineer",
    specialization: "Query Optimization",
  },
};

// Request Processing
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  switch (path) {
    case "/query":
      return await executeQuery(request);
    case "/analytics":
      return await getAnalytics(request);
    case "/datasets":
      return await getDatasets(request);
    case "/performance":
      return await getPerformanceStats(request);
    default:
      return new Response("Endpoint not found", { status: 404 });
  }
}
```

### **QUERY EXECUTION WITH MOCK DATA**

```javascript
// Simulated BigQuery Execution
async function executeQuery(query, projectId) {
  console.log(`🔍 Executing BigQuery query in project: ${projectId}`);

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return contextual mock data based on query type
  if (query.toLowerCase().includes("conversations")) {
    return {
      rows: [
        { user_id: "user_001", message_count: 45, avg_response_time: 0.8 },
        { user_id: "user_002", message_count: 32, avg_response_time: 0.6 },
        { user_id: "user_003", message_count: 28, avg_response_time: 0.9 },
      ],
      totalRows: 3,
      bytesProcessed: 2048,
      jobComplete: true,
    };
  }

  if (query.toLowerCase().includes("analytics")) {
    return {
      rows: [
        { date: "2025-10-09", users: 1250, sessions: 1680, pageviews: 4230 },
        { date: "2025-10-08", users: 1180, sessions: 1520, pageviews: 3890 },
        { date: "2025-10-07", users: 1340, sessions: 1780, pageviews: 4560 },
      ],
      totalRows: 3,
      bytesProcessed: 4096,
      jobComplete: true,
    };
  }

  // Default response for unknown queries
  return {
    rows: [
      {
        message: "Query executed successfully",
        timestamp: new Date().toISOString(),
      },
    ],
    totalRows: 1,
    bytesProcessed: 512,
    jobComplete: true,
  };
}
```

---

## 🎨 UI COMPONENTS I ADVANCED STYLING

### **QUERY INTERFACE STYLING**

```css
/* Main Query Container */
.query-container {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--edge-color);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* Query Editor */
#sqlQuery {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #374151;
  color: #e5e7eb;
  font-family: "Fira Code", monospace;
  font-size: 14px;
  line-height: 1.5;
  min-height: 120px;
  padding: 16px;
  resize: vertical;
}

/* Syntax Highlighting */
.sql-keyword {
  color: #60a5fa;
  font-weight: 600;
}
.sql-string {
  color: #34d399;
}
.sql-number {
  color: #fbbf24;
}
.sql-comment {
  color: #6b7280;
  font-style: italic;
}

/* Execute Button */
#executeBtn {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

#executeBtn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

#executeBtn:disabled {
  background: #374151;
  cursor: not-allowed;
  transform: none;
}
```

### **RESULTS DISPLAY COMPONENTS**

```css
/* Results Table */
.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.6);
}

.results-table th {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid #374151;
  color: #e5e7eb;
  font-weight: 600;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
}

.results-table th:hover {
  background: rgba(59, 130, 246, 0.3);
}

.results-table td {
  border: 1px solid #374151;
  color: #d1d5db;
  padding: 6px 12px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results-table tbody tr:hover {
  background: rgba(59, 130, 246, 0.1);
}

/* Progress Indicator */
.query-progress {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  height: 3px;
  border-radius: 2px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
```

### **MOBILE RESPONSIVE DESIGN**

```css
/* Mobile Adaptations */
@media (max-width: 768px) {
  .query-container {
    margin: 10px;
    padding: 15px;
  }

  #sqlQuery {
    font-size: 12px;
    min-height: 100px;
  }

  .results-table {
    font-size: 11px;
  }

  .results-table th,
  .results-table td {
    padding: 4px 6px;
    max-width: 120px;
  }

  /* Horizontal scroll for large results */
  .results-content {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Touch-friendly controls */
@media (pointer: coarse) {
  button {
    min-height: 44px;
    min-width: 44px;
  }

  select,
  input {
    min-height: 40px;
  }
}
```

---

## 🚀 ADVANCED FEATURES

### **REAL-TIME COLLABORATION**

```javascript
// Query Sharing System
class QueryCollaboration {
  constructor() {
    this.sharedQueries = new Map();
  }

  shareQuery(query, settings) {
    const shareId = this.generateShareId();
    const sharedQuery = {
      id: shareId,
      query: query,
      settings: settings,
      createdBy: this.getCurrentUser(),
      createdAt: new Date().toISOString(),
      accessCount: 0,
    };

    this.sharedQueries.set(shareId, sharedQuery);
    return shareId;
  }

  loadSharedQuery(shareId) {
    const shared = this.sharedQueries.get(shareId);
    if (shared) {
      shared.accessCount++;
      return shared;
    }
    return null;
  }
}

// Query Collaboration UI
function showShareDialog(query) {
  const shareId = queryCollaboration.shareQuery(query, getCurrentSettings());
  const shareUrl = `${window.location.origin}/bigquery-analytics?shared=${shareId}`;

  const dialog = document.createElement("div");
  dialog.innerHTML = `
    <div class="share-dialog">
      <h3>Udostępnij zapytanie</h3>
      <input type="text" value="${shareUrl}" readonly />
      <button onclick="copyToClipboard('${shareUrl}')">Skopiuj link</button>
    </div>
  `;

  document.body.appendChild(dialog);
}
```

### **QUERY OPTIMIZATION ASSISTANT**

```javascript
// AI-Powered Query Optimization
class QueryOptimizer {
  constructor() {
    this.optimizationRules = [
      {
        pattern: /SELECT \* FROM/i,
        suggestion: "Specify only needed columns instead of SELECT *",
        impact: "Reduces data transfer and improves performance",
      },
      {
        pattern: /ORDER BY.*LIMIT/i,
        suggestion: "Consider using TOP() function for better performance",
        impact: "Faster execution for limited sorted results",
      },
      {
        pattern: /WHERE.*LIKE '%.*%'/i,
        suggestion: "Full text search with LIKE %...% can be slow",
        impact: "Consider using BigQuery full-text search functions",
      },
    ];
  }

  analyzeQuery(query) {
    const suggestions = [];

    this.optimizationRules.forEach((rule) => {
      if (rule.pattern.test(query)) {
        suggestions.push({
          type: "optimization",
          message: rule.suggestion,
          impact: rule.impact,
          severity: "medium",
        });
      }
    });

    return {
      suggestions: suggestions,
      complexity: this.calculateComplexity(query),
      estimatedCost: this.estimateCost(query),
    };
  }

  suggestOptimizations(query) {
    const analysis = this.analyzeQuery(query);

    return {
      originalQuery: query,
      optimizedQuery: this.applyOptimizations(query),
      improvements: analysis.suggestions,
      expectedPerformanceGain: this.calculatePerformanceGain(analysis),
    };
  }
}
```

### **AUTOMATED REPORTING SYSTEM**

```javascript
// Scheduled Reports Generator
class ReportScheduler {
  constructor() {
    this.scheduledReports = JSON.parse(
      localStorage.getItem("scheduledReports") || "[]"
    );
  }

  scheduleReport(name, query, schedule, recipients) {
    const report = {
      id: this.generateReportId(),
      name: name,
      query: query,
      schedule: schedule, // cron format
      recipients: recipients,
      lastRun: null,
      nextRun: this.calculateNextRun(schedule),
      active: true,
    };

    this.scheduledReports.push(report);
    this.saveReports();

    return report.id;
  }

  async runScheduledReports() {
    const now = new Date();

    for (const report of this.scheduledReports) {
      if (report.active && report.nextRun <= now) {
        try {
          const results = await this.executeQuery(report.query);
          await this.sendReport(report, results);

          report.lastRun = now;
          report.nextRun = this.calculateNextRun(report.schedule, now);
        } catch (error) {
          console.error(`Failed to run report ${report.name}:`, error);
        }
      }
    }

    this.saveReports();
  }
}
```

---

## 📊 MONITORING I ANALYTICS

### **QUERY PERFORMANCE DASHBOARD**

```javascript
// Performance Metrics Collection
class BigQueryMetrics {
  constructor() {
    this.metrics = {
      totalQueries: 0,
      totalExecutionTime: 0,
      totalBytesProcessed: 0,
      totalCost: 0,
      errorRate: 0,
      averageResponseTime: 0,
      peakUsageHours: {},
      topQueries: [],
      slowestQueries: [],
      mostExpensiveQueries: [],
    };
  }

  recordQuery(queryData) {
    this.metrics.totalQueries++;
    this.metrics.totalExecutionTime += queryData.executionTime;
    this.metrics.totalBytesProcessed += queryData.bytesProcessed;
    this.metrics.totalCost += queryData.cost;

    this.updateAverages();
    this.updateTopQueries(queryData);
    this.saveMetrics();
  }

  generateReport() {
    return {
      period: "30 days",
      summary: {
        totalQueries: this.metrics.totalQueries,
        avgExecutionTime: this.metrics.averageResponseTime,
        totalCost: this.metrics.totalCost,
        dataProcessed: this.formatBytes(this.metrics.totalBytesProcessed),
      },
      trends: this.calculateTrends(),
      recommendations: this.generateRecommendations(),
    };
  }
}

// Real-time Monitoring Display
function initializeMonitoringDashboard() {
  const dashboard = document.getElementById("monitoring-dashboard");

  dashboard.innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card">
        <h4>Total Queries</h4>
        <span class="metric-value" id="total-queries">0</span>
      </div>
      <div class="metric-card">
        <h4>Avg Response Time</h4>
        <span class="metric-value" id="avg-response-time">0ms</span>
      </div>
      <div class="metric-card">  
        <h4>Data Processed</h4>
        <span class="metric-value" id="data-processed">0 MB</span>
      </div>
      <div class="metric-card">
        <h4>Total Cost</h4>
        <span class="metric-value" id="total-cost">$0.00</span>
      </div>
    </div>
  `;

  // Update metrics every 30 seconds
  setInterval(updateMetricsDisplay, 30000);
}
```

---

_Kompletna analiza systemu BigQuery Analytics - utworzona 09.10.2025_ 📊
