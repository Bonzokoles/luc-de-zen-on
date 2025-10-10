# 🔧 BIGQUERY_FUNKCJE_04 - MAPA FUNKCJI SYSTEMU BIGQUERY ANALYTICS

## 🎯 GŁÓWNE FUNKCJE JAVASCRIPT

### **⚡ QUERY EXECUTION FUNCTIONS**

#### **1. executeQuery()**

```javascript
async function executeQuery() {
  const query = document.getElementById("sqlQuery").value.trim();
  const projectId = document.getElementById("projectId").value;
  const datasetId = document.getElementById("datasetId").value;
  const rowLimit = document.getElementById("rowLimit").value;

  if (!query) {
    displayError("Wprowadź zapytanie SQL");
    return;
  }

  showLoading();

  try {
    const response = await fetch(
      `/api/bigquery/analytics?query=${encodeURIComponent(
        query
      )}&projectId=${projectId}&datasetId=${datasetId}&rowLimit=${rowLimit}`
    );
    const data = await response.json();

    if (data.success) {
      displayResults(data.results, data.metadata);
      addToHistory(query, data.metadata);
    } else {
      displayError(data.error || "Błąd wykonania zapytania");
    }
  } catch (error) {
    displayError("Błąd połączenia z API: " + error.message);
  } finally {
    hideLoading();
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 650-690)
- **Cel**: Główna funkcja wykonywania zapytań SQL w BigQuery
- **Parametry**: Pobiera dane z formularza UI (query, projectId, datasetId, rowLimit)
- **Zwraca**: Wyniki zapytania lub komunikat błędu

#### **2. setQuery(query)**

```javascript
function setQuery(query) {
  const sqlTextarea = document.getElementById("sqlQuery");
  if (sqlTextarea) {
    sqlTextarea.value = query;
    sqlTextarea.focus();

    // Auto-resize textarea
    sqlTextarea.style.height = "auto";
    sqlTextarea.style.height = sqlTextarea.scrollHeight + "px";

    // Syntax highlighting update
    updateSyntaxHighlighting();
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 700-715)
- **Cel**: Ustawianie predefiniowanych zapytań w edytorze SQL
- **Użycie**: Kliknięcie na przykładowe zapytania
- **Features**: Auto-resize textarea, syntax highlighting

#### **3. validateQuery(query)**

```javascript
function validateQuery(query) {
  // Remove comments and normalize whitespace
  const cleanQuery = query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  if (!cleanQuery) {
    throw new Error("Zapytanie nie może być puste");
  }

  // Check for dangerous operations
  const dangerousPatterns =
    /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b/i;
  if (dangerousPatterns.test(cleanQuery)) {
    throw new Error("Operacje modyfikujące dane są zabronione");
  }

  // Enforce row limit
  if (!cleanQuery.toLowerCase().includes("limit")) {
    return cleanQuery + " LIMIT 1000";
  }

  return cleanQuery;
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 720-740)
- **Cel**: Walidacja zapytań SQL przed wykonaniem
- **Zabezpieczenia**: Blokada dangerous operations, wymuszenie LIMIT
- **Zwraca**: Zwalidowane i oczyszczone zapytanie SQL

### **📊 RESULTS DISPLAY FUNCTIONS**

#### **4. displayResults(results, metadata)**

```javascript
function displayResults(results, metadata) {
  const resultsDiv = document.getElementById("resultsContent");
  const infoDiv = document.getElementById("resultsInfo");

  if (!results || !results.rows || results.rows.length === 0) {
    resultsDiv.innerHTML =
      '<p class="text-center text-gray-400 py-8">Brak wyników</p>';
    return;
  }

  // Display metadata
  infoDiv.innerHTML = `
    <div class="results-metadata">
      <span>Wiersze: ${results.totalRows || results.rows.length}</span>
      <span>Czas: ${metadata.executionTime || "N/A"}s</span>
      <span>Dane: ${formatBytes(metadata.bytesProcessed || 0)}</span>
      <span>Koszt: $${(metadata.cost || 0).toFixed(4)}</span>
    </div>
  `;

  // Get output format
  const format = document.getElementById("outputFormat").value;

  switch (format) {
    case "table":
      displayTableResults(results, resultsDiv);
      break;
    case "json":
      displayJsonResults(results, resultsDiv);
      break;
    case "csv":
      displayCsvResults(results, resultsDiv);
      break;
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 750-785)
- **Cel**: Główna funkcja wyświetlania wyników zapytania
- **Formaty**: Obsługa table, JSON, CSV
- **Metadata**: Wyświetlanie informacji o wykonaniu

#### **5. displayTableResults(results, container)**

```javascript
function displayTableResults(results, container) {
  if (!results.rows || results.rows.length === 0) return;

  const columns = Object.keys(results.rows[0]);
  const maxRows = Math.min(results.rows.length, 500); // Limit for performance

  let html = '<div class="table-responsive">';
  html += '<table class="results-table">';
  html += "<thead><tr>";

  columns.forEach((col) => {
    html += `<th onclick="sortTableBy('${col}')" class="sortable" title="Kliknij aby sortować">
      ${col} <span class="sort-icon">↕</span>
    </th>`;
  });

  html += "</tr></thead><tbody>";

  for (let i = 0; i < maxRows; i++) {
    const row = results.rows[i];
    html += "<tr>";
    columns.forEach((col) => {
      const value = row[col];
      html += `<td title="${escapeHtml(String(value))}">${formatCellValue(
        value
      )}</td>`;
    });
    html += "</tr>";
  }

  html += "</tbody></table>";

  if (results.rows.length > maxRows) {
    html += `<p class="text-sm text-gray-400 mt-2">
      Wyświetlono ${maxRows} z ${results.rows.length} wierszy
    </p>`;
  }

  html += "</div>";
  container.innerHTML = html;
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 790-825)
- **Cel**: Wyświetlanie wyników w formacie tabeli HTML
- **Features**: Sortowanie kolumn, limit wydajnościowy, tooltips
- **Performance**: Ograniczenie do 500 wierszy

#### **6. displayJsonResults(results, container)**

```javascript
function displayJsonResults(results, container) {
  const jsonData = {
    metadata: {
      totalRows: results.totalRows || results.rows.length,
      columns: results.rows.length > 0 ? Object.keys(results.rows[0]) : [],
    },
    data: results.rows,
  };

  const jsonString = JSON.stringify(jsonData, null, 2);

  container.innerHTML = `
    <div class="json-display">
      <div class="json-controls">
        <button onclick="copyJsonToClipboard()" class="btn-secondary">
          📋 Skopiuj JSON
        </button>
        <button onclick="downloadJson()" class="btn-secondary">
          💾 Pobierz JSON
        </button>
      </div>
      <pre class="json-content"><code class="language-json">${escapeHtml(
        jsonString
      )}</code></pre>
    </div>
  `;

  // Apply syntax highlighting if available
  if (window.Prism) {
    Prism.highlightAll();
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 830-855)
- **Cel**: Wyświetlanie wyników w formacie JSON
- **Features**: Kopiowanie do schowka, pobieranie pliku
- **Styling**: Syntax highlighting z Prism.js

### **🔄 QUERY MANAGEMENT FUNCTIONS**

#### **7. addToHistory(query, metadata)**

```javascript
function addToHistory(query, metadata) {
  const maxHistorySize = 50;
  let history = JSON.parse(localStorage.getItem("bigqueryHistory") || "[]");

  const historyItem = {
    id: Date.now(),
    query: query,
    timestamp: new Date().toISOString(),
    executionTime: metadata.executionTime,
    bytesProcessed: metadata.bytesProcessed,
    cost: metadata.cost,
    rowCount: metadata.rowCount,
  };

  // Remove duplicates
  history = history.filter((item) => item.query !== query);

  // Add to beginning
  history.unshift(historyItem);

  // Limit size
  if (history.length > maxHistorySize) {
    history = history.slice(0, maxHistorySize);
  }

  localStorage.setItem("bigqueryHistory", JSON.stringify(history));
  updateHistoryDisplay();
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 860-885)
- **Cel**: Dodawanie zapytań do historii localStorage
- **Limit**: Maksymalnie 50 zapytań w historii
- **Deduplication**: Usuwa duplikaty przed dodaniem

#### **8. loadQueryHistory()**

```javascript
function loadQueryHistory() {
  const history = JSON.parse(localStorage.getItem("bigqueryHistory") || "[]");
  const historyContainer = document.getElementById("queryHistory");

  if (history.length === 0) {
    historyContainer.innerHTML =
      '<p class="text-gray-400 text-sm">Brak historii zapytań</p>';
    return;
  }

  let html = '<div class="history-list">';

  history.forEach((item) => {
    const shortQuery =
      item.query.length > 60 ? item.query.substring(0, 60) + "..." : item.query;

    html += `
      <div class="history-item" onclick="loadHistoryQuery(${item.id})">
        <div class="history-query">${escapeHtml(shortQuery)}</div>
        <div class="history-meta">
          <span class="history-time">${formatTimestamp(item.timestamp)}</span>
          <span class="history-cost">$${(item.cost || 0).toFixed(4)}</span>
        </div>
      </div>
    `;
  });

  html += "</div>";
  historyContainer.innerHTML = html;
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 890-920)
- **Cel**: Wczytywanie i wyświetlanie historii zapytań
- **UI**: Skrócone zapytania z metadanymi
- **Interakcja**: Kliknięcie wczytuje zapytanie

### **🏗️ PROJECT MANAGEMENT FUNCTIONS**

#### **9. loadProjects()**

```javascript
async function loadProjects() {
  const projectSelect = document.getElementById("projectId");

  try {
    // Try to load from Google Cloud API
    const response = await fetch("/api/bigquery/projects");

    if (response.ok) {
      const projects = await response.json();
      populateProjectSelect(projects);
    } else {
      // Fallback to default projects
      const defaultProjects = [
        { id: "mybonzo-analytics", name: "MyBonzo Analytics" },
        { id: "mybonzo-production", name: "MyBonzo Production" },
        { id: "mybonzo-development", name: "MyBonzo Development" },
      ];
      populateProjectSelect(defaultProjects);
    }
  } catch (error) {
    console.warn("Failed to load projects:", error);
    // Use local storage cache
    const cachedProjects = JSON.parse(
      localStorage.getItem("bigqueryProjects") || "[]"
    );
    if (cachedProjects.length > 0) {
      populateProjectSelect(cachedProjects);
    }
  }
}

function populateProjectSelect(projects) {
  const projectSelect = document.getElementById("projectId");

  projectSelect.innerHTML = '<option value="">Wybierz projekt...</option>';

  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name || project.id;
    projectSelect.appendChild(option);
  });

  // Cache projects
  localStorage.setItem("bigqueryProjects", JSON.stringify(projects));
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 925-965)
- **Cel**: Ładowanie dostępnych projektów Google Cloud
- **Fallback**: Domyślne projekty + localStorage cache
- **UI**: Populacja select dropdown

#### **10. loadDatasets(projectId)**

```javascript
async function loadDatasets(projectId) {
  const datasetSelect = document.getElementById("datasetId");

  if (!projectId) {
    datasetSelect.innerHTML =
      '<option value="">Najpierw wybierz projekt</option>';
    return;
  }

  datasetSelect.innerHTML = '<option value="">Ładowanie...</option>';

  try {
    const response = await fetch(
      `/api/bigquery/datasets?projectId=${projectId}`
    );

    if (response.ok) {
      const datasets = await response.json();

      datasetSelect.innerHTML = '<option value="">Wybierz dataset...</option>';

      datasets.forEach((dataset) => {
        const option = document.createElement("option");
        option.value = dataset.id;
        option.textContent = `${dataset.id} (${
          dataset.description || "Brak opisu"
        })`;
        datasetSelect.appendChild(option);
      });
    } else {
      // Fallback to common datasets
      const commonDatasets = [
        { id: "analytics", description: "Website Analytics Data" },
        { id: "ecommerce", description: "E-commerce Data" },
        { id: "marketing", description: "Marketing Campaigns" },
      ];

      datasetSelect.innerHTML = '<option value="">Wybierz dataset...</option>';
      commonDatasets.forEach((dataset) => {
        const option = document.createElement("option");
        option.value = dataset.id;
        option.textContent = `${dataset.id} (${dataset.description})`;
        datasetSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Failed to load datasets:", error);
    datasetSelect.innerHTML =
      '<option value="">Błąd ładowania datasets</option>';
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 970-1010)
- **Cel**: Ładowanie datasetów dla wybranego projektu
- **Dependency**: Wymaga wybranego projectId
- **Fallback**: Wspólne datasety w przypadku błędu

### **🤖 AI INTEGRATION FUNCTIONS**

#### **11. generateSQLWithAI(description)**

```javascript
async function generateSQLWithAI(description, dataset = "analytics") {
  const aiButton = document.getElementById("aiGenerateBtn");
  const originalText = aiButton.textContent;

  aiButton.textContent = "Generowanie...";
  aiButton.disabled = true;

  try {
    const response = await fetch("/api/bigquery/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ai_help: description,
        dataset: dataset,
        context: {
          available_tables: ["pageviews", "sessions", "users", "events"],
          user_preferences: {
            date_format: "YYYY-MM-DD",
            limit_default: 100,
          },
        },
      }),
    });

    const data = await response.json();

    if (data.success && data.ai_response && data.ai_response.sql_query) {
      setQuery(data.ai_response.sql_query);

      // Show AI explanation if available
      if (data.ai_response.explanation) {
        showAIExplanation(data.ai_response.explanation);
      }
    } else {
      displayError(data.error || "Błąd generowania SQL przez AI");
    }
  } catch (error) {
    displayError("Błąd połączenia z AI: " + error.message);
  } finally {
    aiButton.textContent = originalText;
    aiButton.disabled = false;
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 1015-1055)
- **Cel**: Generowanie SQL z natural language przez AI
- **Model**: Cloudflare AI (Llama 3.1)
- **Context**: Dostępne tabele i preferencje użytkownika

#### **12. showAIExplanation(explanation)**

```javascript
function showAIExplanation(explanation) {
  const explanationDiv = document.getElementById("aiExplanation");

  if (!explanationDiv) {
    // Create explanation panel if doesn't exist
    const panel = document.createElement("div");
    panel.id = "aiExplanation";
    panel.className = "ai-explanation-panel";

    const queryContainer = document.querySelector(".query-container");
    queryContainer.appendChild(panel);
  }

  const explanationContent = `
    <div class="ai-explanation-content">
      <div class="ai-explanation-header">
        <h4>🤖 Wyjaśnienie AI</h4>
        <button onclick="hideAIExplanation()" class="close-btn">×</button>
      </div>
      <div class="ai-explanation-text">
        ${escapeHtml(explanation)}
      </div>
    </div>
  `;

  document.getElementById("aiExplanation").innerHTML = explanationContent;
  document.getElementById("aiExplanation").style.display = "block";
}

function hideAIExplanation() {
  const panel = document.getElementById("aiExplanation");
  if (panel) {
    panel.style.display = "none";
  }
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 1060-1090)
- **Cel**: Wyświetlanie wyjaśnień AI dla generowanych zapytań
- **UI**: Dynamiczne tworzenie panelu wyjaśnień
- **UX**: Przycisk zamykania panelu

### **📤 EXPORT FUNCTIONS**

#### **13. exportResults(format)**

```javascript
function exportResults(format) {
  const results = window.currentResults;

  if (!results || !results.rows || results.rows.length === 0) {
    displayError("Brak wyników do eksportu");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `bigquery-results-${timestamp}`;

  switch (format) {
    case "csv":
      exportToCSV(results, filename);
      break;
    case "json":
      exportToJSON(results, filename);
      break;
    case "excel":
      exportToExcel(results, filename);
      break;
    default:
      displayError("Nieobsługiwany format eksportu");
  }
}

function exportToCSV(results, filename) {
  const columns = Object.keys(results.rows[0]);
  let csv = columns.join(",") + "\\n";

  results.rows.forEach((row) => {
    const values = columns.map((col) => {
      const value = row[col];
      // Escape commas and quotes
      if (
        typeof value === "string" &&
        (value.includes(",") || value.includes('"'))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(",") + "\\n";
  });

  downloadFile(csv, filename + ".csv", "text/csv");
}

function exportToJSON(results, filename) {
  const jsonData = {
    exported_at: new Date().toISOString(),
    total_rows: results.totalRows || results.rows.length,
    data: results.rows,
  };

  const jsonString = JSON.stringify(jsonData, null, 2);
  downloadFile(jsonString, filename + ".json", "application/json");
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 1095-1150)
- **Cel**: Eksport wyników w różnych formatach
- **Formaty**: CSV, JSON, Excel (planowany)
- **Features**: Automatyczne nazwanie plików z timestamp

### **🔍 UTILITY FUNCTIONS**

#### **14. formatCellValue(value)**

```javascript
function formatCellValue(value) {
  if (value === null || value === undefined) {
    return '<span class="null-value">NULL</span>';
  }

  if (typeof value === "string") {
    // Format URLs as links
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return `<a href="${value}" target="_blank" class="cell-link">${escapeHtml(
        value
      )}</a>`;
    }

    // Format emails
    if (value.includes("@") && value.includes(".")) {
      return `<a href="mailto:${value}" class="cell-email">${escapeHtml(
        value
      )}</a>`;
    }

    // Truncate long strings
    if (value.length > 100) {
      return `<span title="${escapeHtml(value)}">${escapeHtml(
        value.substring(0, 100)
      )}...</span>`;
    }

    return escapeHtml(value);
  }

  if (typeof value === "number") {
    // Format large numbers with separators
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString();
    }
    return value;
  }

  if (typeof value === "boolean") {
    return `<span class="boolean-value ${value}">${value}</span>`;
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return String(value);
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 1155-1190)
- **Cel**: Formatowanie wartości komórek w tabeli wyników
- **Features**: URLs jako linki, truncation długich tekstów, formatowanie liczb

#### **15. formatBytes(bytes)**

```javascript
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
```

- **Lokalizacja**: bigquery-analytics.astro (linie 1195-1205)
- **Cel**: Formatowanie rozmiarów plików/danych
- **Units**: B, KB, MB, GB, TB, PB
- **Precision**: Konfigurowalna precyzja dziesiętna

---

## 🔌 API BACKEND FUNCTIONS

### **API ENDPOINT HANDLERS (analytics.ts)**

#### **16. handleQueryExecution()**

```javascript
async function handleQueryExecution(query, projectId, datasetId, rowLimit) {
  const startTime = Date.now();

  try {
    // Validate query
    const validatedQuery = validateQuery(query);

    // Check for mock data mode
    if (!process.env.BIGQUERY_SERVICE_ACCOUNT) {
      return generateMockResults(validatedQuery, rowLimit);
    }

    // Execute real BigQuery
    const bigquery = new BigQuery({
      projectId: projectId,
      keyFilename: process.env.BIGQUERY_SERVICE_ACCOUNT,
    });

    const options = {
      query: validatedQuery,
      location: "US",
      maxResults: parseInt(rowLimit) || 1000,
      timeoutMs: 30000,
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    const executionTime = (Date.now() - startTime) / 1000;

    return {
      success: true,
      service: "BigQuery Analytics",
      query: validatedQuery,
      results: {
        rows: rows,
        totalRows: rows.length,
        jobComplete: true,
        bytesProcessed: job.metadata.statistics.query.totalBytesProcessed,
      },
      metadata: {
        executionTime: executionTime,
        jobId: job.id,
        location: job.metadata.jobReference.location,
        creationTime: job.metadata.statistics.creationTime,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      query: query,
    };
  }
}
```

- **Lokalizacja**: api/bigquery/analytics.ts (linie 50-100)
- **Cel**: Główna funkcja wykonywania zapytań BigQuery
- **Mock Mode**: Fallback na mock data bez service account
- **Real BigQuery**: Integracja z Google Cloud BigQuery API

#### **17. generateMockResults()**

```javascript
function generateMockResults(query, rowLimit = 100) {
  const limit = Math.min(parseInt(rowLimit), 1000);

  // Analyze query to generate relevant mock data
  const queryLower = query.toLowerCase();

  if (queryLower.includes("pageviews") || queryLower.includes("analytics")) {
    return generateAnalyticsMockData(limit);
  }

  if (queryLower.includes("users") || queryLower.includes("sessions")) {
    return generateUsersMockData(limit);
  }

  if (queryLower.includes("ecommerce") || queryLower.includes("orders")) {
    return generateEcommerceMockData(limit);
  }

  // Default mock data
  return generateDefaultMockData(limit);
}

function generateAnalyticsMockData(limit) {
  const mockRows = [];
  const pages = ["/home", "/about", "/contact", "/products", "/blog"];

  for (let i = 0; i < limit; i++) {
    mockRows.push({
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      page_path: pages[Math.floor(Math.random() * pages.length)],
      pageviews: Math.floor(Math.random() * 1000) + 1,
      unique_pageviews: Math.floor(Math.random() * 800) + 1,
      avg_time_on_page: Math.round(Math.random() * 300 * 100) / 100,
      bounce_rate: Math.round(Math.random() * 100 * 100) / 100,
    });
  }

  return {
    success: true,
    service: "BigQuery Analytics (Mock)",
    results: {
      rows: mockRows,
      totalRows: mockRows.length,
      jobComplete: true,
      bytesProcessed: mockRows.length * 64,
    },
    metadata: {
      executionTime: Math.random() * 2 + 0.5,
      jobId: "mock_job_" + Date.now(),
      location: "US",
      creationTime: new Date().toISOString(),
    },
  };
}
```

- **Lokalizacja**: api/bigquery/analytics.ts (linie 120-180)
- **Cel**: Generowanie realistycznych mock data na podstawie zapytania
- **Context-Aware**: Różne dane w zależności od type zapytania
- **Realistic**: Prawdopodobne wartości i struktura danych

### **🤖 AI INTEGRATION (analytics.ts)**

#### **18. handleAIHelp()**

```javascript
async function handleAIHelp(description, dataset = "analytics", context = {}) {
  try {
    const systemPrompt = `
      You are a BigQuery SQL expert. Convert natural language requests to BigQuery SQL queries.
      
      Available dataset: ${dataset}
      Available tables: ${
        context.available_tables?.join(", ") ||
        "pageviews, sessions, users, events"
      }
      
      Rules:
      - Always include LIMIT clause (default: ${
        context.user_preferences?.limit_default || 100
      })
      - Use standard SQL syntax compatible with BigQuery
      - Reference tables as \`project.dataset.table\` format
      - Only return the SQL query, no explanations
      - If the request is unclear, make reasonable assumptions
    `;

    const userPrompt = `Create a BigQuery SQL query for: ${description}`;

    // Use Cloudflare AI
    const response = await fetch(
      "https://api.cloudflare.com/client/v4/ai/run/@cf/meta/llama-3.1-8b-instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_AI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    const aiResponse = await response.json();

    if (aiResponse.success) {
      const sqlQuery = aiResponse.result.response.trim();

      return {
        success: true,
        ai_response: {
          sql_query: sqlQuery,
          explanation: `Generated SQL query for: "${description}"`,
          model: "Llama 3.1 8B Instruct",
          confidence: "high",
        },
      };
    } else {
      throw new Error("AI service unavailable");
    }
  } catch (error) {
    // Fallback to template-based generation
    return generateTemplateSQL(description, dataset, context);
  }
}
```

- **Lokalizacja**: api/bigquery/analytics.ts (linie 200-250)
- **Cel**: Konwersja natural language na SQL przez AI
- **Model**: Cloudflare AI Llama 3.1
- **Fallback**: Template-based generation przy błędzie AI

#### **19. generateTemplateSQL()**

```javascript
function generateTemplateSQL(description, dataset, context) {
  const descLower = description.toLowerCase();
  const defaultLimit = context.user_preferences?.limit_default || 100;

  // Pattern matching for common queries
  if (descLower.includes("top") && descLower.includes("page")) {
    const limit = extractNumberFromText(description) || 10;
    return {
      success: true,
      ai_response: {
        sql_query: `SELECT page_path, COUNT(*) as pageviews 
FROM \`project.${dataset}.pageviews\` 
WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY page_path 
ORDER BY pageviews DESC 
LIMIT ${limit}`,
        explanation: "Template-generated query for top pages",
        model: "Template System",
        confidence: "medium",
      },
    };
  }

  if (
    descLower.includes("daily") &&
    (descLower.includes("user") || descLower.includes("visit"))
  ) {
    return {
      success: true,
      ai_response: {
        sql_query: `SELECT DATE(created_at) as date, 
       COUNT(DISTINCT user_id) as unique_users,
       COUNT(*) as total_sessions
FROM \`project.${dataset}.sessions\` 
WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY date 
ORDER BY date DESC 
LIMIT ${defaultLimit}`,
        explanation: "Template-generated query for daily user statistics",
        model: "Template System",
        confidence: "medium",
      },
    };
  }

  // Default fallback query
  return {
    success: true,
    ai_response: {
      sql_query: `SELECT * FROM \`project.${dataset}.pageviews\` 
WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY created_at DESC 
LIMIT ${defaultLimit}`,
      explanation: "Default query showing recent pageviews",
      model: "Template System",
      confidence: "low",
    },
  };
}

function extractNumberFromText(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}
```

- **Lokalizacja**: api/bigquery/analytics.ts (linie 260-320)
- **Cel**: Template-based SQL generation jako fallback dla AI
- **Pattern Matching**: Rozpoznawanie wspólnych wzorców zapytań
- **Intelligent Defaults**: Sensowne domyślne zapytania

---

## 📊 BIGQUERY WIDGET FUNCTIONS

### **SVELTE COMPONENT FUNCTIONS (BigQueryWidget.svelte)**

#### **20. Component Initialization**

```javascript
// Component state
let query = "";
let results = null;
let loading = false;
let error = null;
let expanded = false;

// Configuration
let config = {
  projectId: "mybonzo-analytics",
  datasetId: "analytics",
  rowLimit: 100,
  outputFormat: "table",
};

// API client
import { BigQueryAPI } from "../utils/bigQueryAPI.js";
const api = new BigQueryAPI();

onMount(() => {
  loadSavedConfig();
  initializeWidget();
});

function loadSavedConfig() {
  const saved = localStorage.getItem("bigqueryWidgetConfig");
  if (saved) {
    config = { ...config, ...JSON.parse(saved) };
  }
}

function saveConfig() {
  localStorage.setItem("bigqueryWidgetConfig", JSON.stringify(config));
}
```

- **Lokalizacja**: BigQueryWidget.svelte (linie 1-35)
- **Cel**: Inicjalizacja komponentu Svelte widget
- **State Management**: Reactive state dla query, results, loading
- **Persistence**: localStorage dla konfiguracji

#### **21. executeWidgetQuery()**

```javascript
async function executeWidgetQuery() {
  if (!query.trim()) {
    error = "Wprowadź zapytanie SQL";
    return;
  }

  loading = true;
  error = null;

  try {
    saveConfig(); // Save current config

    const response = await api.executeQuery(query, {
      projectId: config.projectId,
      datasetId: config.datasetId,
      rowLimit: config.rowLimit,
    });

    if (response.success) {
      results = response.results;

      // Emit custom event for parent components
      dispatch("queryExecuted", {
        query: query,
        results: results,
        metadata: response.metadata,
      });
    } else {
      error = response.error || "Błąd wykonania zapytania";
    }
  } catch (err) {
    error = "Błąd połączenia: " + err.message;
  } finally {
    loading = false;
  }
}
```

- **Lokalizacja**: BigQueryWidget.svelte (linie 40-70)
- **Cel**: Wykonywanie zapytań w widget mode
- **Events**: Dispatch events dla parent components
- **Error Handling**: Comprehensive error management

#### **22. Widget Display Functions**

```javascript
function toggleExpanded() {
  expanded = !expanded;

  if (expanded) {
    // Load full interface
    loadFullInterface();
  }
}

function loadFullInterface() {
  // Dynamically import full BigQuery interface
  import("./BigQueryFullInterface.svelte").then((module) => {
    const fullInterface = new module.default({
      target: document.getElementById("bigquery-full-interface"),
      props: {
        initialQuery: query,
        initialConfig: config,
        initialResults: results,
      },
    });
  });
}

function formatWidgetResults(results) {
  if (!results || !results.rows || results.rows.length === 0) {
    return '<p class="text-gray-400">Brak wyników</p>';
  }

  // Simplified table for widget
  const columns = Object.keys(results.rows[0]);
  const maxRows = Math.min(results.rows.length, 5); // Limit for widget

  let html = '<table class="widget-table">';
  html += "<thead><tr>";
  columns.slice(0, 4).forEach((col) => {
    // Max 4 columns in widget
    html += `<th>${col}</th>`;
  });
  html += "</tr></thead><tbody>";

  for (let i = 0; i < maxRows; i++) {
    const row = results.rows[i];
    html += "<tr>";
    columns.slice(0, 4).forEach((col) => {
      const value = row[col];
      html += `<td>${formatWidgetValue(value)}</td>`;
    });
    html += "</tr>";
  }

  html += "</tbody></table>";

  if (results.rows.length > maxRows || columns.length > 4) {
    html += `<p class="widget-more">
      +${results.rows.length - maxRows} wierszy, ${
      columns.length > 4 ? "+" + (columns.length - 4) + " kolumn" : ""
    }
      <button on:click={toggleExpanded}>Rozwiń</button>
    </p>`;
  }

  return html;
}

function formatWidgetValue(value) {
  if (value === null || value === undefined) return "NULL";

  if (typeof value === "string" && value.length > 30) {
    return value.substring(0, 30) + "...";
  }

  return value;
}
```

- **Lokalizacja**: BigQueryWidget.svelte (linie 80-140)
- **Cel**: Zarządzanie widget display modes
- **Compact Mode**: Ograniczona tabela (5 wierszy, 4 kolumny)
- **Expansion**: Dynamiczne ładowanie full interface

---

## 🛠️ UTILITY API CLASS

### **BIGQUERY API CLIENT (bigQueryAPI.js)**

#### **23. BigQueryAPI Class Constructor**

```javascript
class BigQueryAPI {
  constructor(baseUrl = "/api/bigquery") {
    this.baseUrl = baseUrl;
    this.defaultTimeout = 30000;

    // Request interceptors
    this.interceptors = {
      request: [],
      response: [],
    };

    // Performance tracking
    this.metrics = {
      totalRequests: 0,
      totalTime: 0,
      errors: 0,
    };
  }

  // Add request interceptor
  addRequestInterceptor(fn) {
    this.interceptors.request.push(fn);
  }

  // Add response interceptor
  addResponseInterceptor(fn) {
    this.interceptors.response.push(fn);
  }
}
```

- **Lokalizacja**: bigQueryAPI.js (linie 1-30)
- **Cel**: Główna klasa API client dla BigQuery operations
- **Features**: Interceptors, metrics tracking, configurable timeout
- **Architecture**: Singleton pattern dla API calls

#### **24. executeQuery() API Method**

```javascript
async executeQuery(query, options = {}) {
  const startTime = Date.now();

  try {
    this.metrics.totalRequests++;

    // Apply request interceptors
    const config = this.applyRequestInterceptors({
      query: query,
      projectId: options.projectId || 'mybonzo-analytics',
      datasetId: options.datasetId || 'analytics',
      rowLimit: options.rowLimit || 1000,
      timeout: options.timeout || this.defaultTimeout
    });

    const url = new URL(`${this.baseUrl}/analytics`, window.location.origin);
    Object.keys(config).forEach(key => {
      if (config[key] !== undefined) {
        url.searchParams.append(key, config[key]);
      }
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'BigQueryAPI'
      },
      signal: AbortSignal.timeout(config.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Apply response interceptors
    const processedData = this.applyResponseInterceptors(data);

    // Track performance
    const executionTime = Date.now() - startTime;
    this.metrics.totalTime += executionTime;

    return processedData;

  } catch (error) {
    this.metrics.errors++;

    // Enhanced error handling
    if (error.name === 'AbortError') {
      throw new Error(`Query timeout after ${config.timeout}ms`);
    }

    if (error.name === 'TypeError') {
      throw new Error('Network error - check your connection');
    }

    throw error;
  }
}
```

- **Lokalizacja**: bigQueryAPI.js (linie 40-95)
- **Cel**: Główna metoda wykonywania zapytań przez API
- **Features**: Timeout handling, interceptors, performance tracking
- **Error Handling**: Rozróżnienie typów błędów (network, timeout, HTTP)

#### **25. getAnalytics() API Method**

```javascript
async getAnalytics(timeRange = '30d', metrics = ['pageviews', 'users']) {
  try {
    const params = new URLSearchParams({
      action: 'get_analytics',
      time_range: timeRange,
      metrics: metrics.join(',')
    });

    const response = await fetch(`${this.baseUrl}/analytics?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.analytics,
      timeRange: timeRange,
      metrics: metrics,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      timeRange: timeRange,
      metrics: metrics
    };
  }
}
```

- **Lokalizacja**: bigQueryAPI.js (linie 100-130)
- **Cel**: Pobieranie analytics data z predefiniowanych metryk
- **Parameters**: Configurable time range i metrics selection
- **Return Format**: Standardized response object

#### **26. Performance Monitoring Methods**

```javascript
getPerformanceMetrics() {
  const avgTime = this.metrics.totalRequests > 0 ?
    this.metrics.totalTime / this.metrics.totalRequests : 0;

  return {
    totalRequests: this.metrics.totalRequests,
    totalTime: this.metrics.totalTime,
    averageTime: Math.round(avgTime),
    errors: this.metrics.errors,
    errorRate: this.metrics.totalRequests > 0 ?
      (this.metrics.errors / this.metrics.totalRequests * 100).toFixed(2) : 0,
    uptime: Date.now() - this.startTime
  };
}

resetMetrics() {
  this.metrics = {
    totalRequests: 0,
    totalTime: 0,
    errors: 0
  };
  this.startTime = Date.now();
}

// Health check method
async healthCheck() {
  try {
    const startTime = Date.now();

    const response = await fetch(`${this.baseUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();

      return {
        healthy: true,
        responseTime: responseTime,
        status: data.status,
        version: data.version,
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        healthy: false,
        responseTime: responseTime,
        error: `HTTP ${response.status}`,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
```

- **Lokalizacja**: bigQueryAPI.js (linie 250-310)
- **Cel**: Performance monitoring i health checking
- **Metrics**: Request count, timing, error rates
- **Health Check**: API availability verification

---

_Kompletna mapa funkcji systemu BigQuery Analytics - utworzona 09.10.2025_ 🔧
