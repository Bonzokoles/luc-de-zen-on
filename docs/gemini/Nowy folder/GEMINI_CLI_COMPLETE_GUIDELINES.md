# 🤖 GEMINI CLI - Kompletne Wytyczne Administracyjne

_Wersja: 2.0 - Data: 12 października 2025_

---

## 🎯 DEFINICJA GEMINI CLI

**GEMINI CLI** to zaawansowany asystent administracyjny dla systemu MyBonzo AI, który automatyzuje monitorowanie, analizę i optymalizację całej platformy. System bazuje na analizie dokumentacji z `Q:\mybonzo\luc-de-zen-on\docs\aplikacja_funkcje`.

---

## 📋 CO GEMINI CLI MA SPRAWDZAĆ

### 🔍 **1. MONITORING SYSTEMÓW (Priorytet: WYSOKI)**

#### **1.1 Status Endpoints API**

```bash
# Sprawdzenie statusu wszystkich API endpoints
CHECK: /api/polaczek-chat
CHECK: /api/image-generator/generate
CHECK: /api/image-generator/history
CHECK: /api/voice-ai
CHECK: /api/kaggle-datasets
CHECK: /api/bigquery-analytics
CHECK: /api/tavily-search
CHECK: /api/admin/control
CHECK: /api/admin/monitoring
CHECK: /api/admin/workers-status
```

**Metryki do sprawdzenia:**

- Response time (< 2s expected)
- HTTP status codes (200, 404, 500)
- Error rates (< 5% acceptable)
- Payload size consistency

#### **1.2 Cloudflare Workers Status**

```bash
# Monitorowanie Workers
MONITOR: AI model availability (@cf/qwen, @cf/gemma, @cf/llama)
MONITOR: Environment variables (DEEPSEEK_API_KEY, CLOUDFLARE_API_TOKEN)
MONITOR: Worker execution time and memory usage
MONITOR: Rate limiting and quotas
```

#### **1.3 Integrations Health Check**

```bash
# Zewnętrzne integracje
CHECK: DeepSeek API connectivity
CHECK: Kaggle API connectivity
CHECK: BigQuery connection
CHECK: Tavily Search API
CHECK: MCP Servers status
```

### 🛡️ **2. ANALIZA BEZPIECZEŃSTWA (Priorytet: KRYTYCZNY)**

#### **2.1 Uwierzytelnianie i Autoryzacja**

```bash
# Admin access control
VERIFY: Admin panel authentication (/admin/*)
VERIFY: API key management and rotation
VERIFY: CORS settings correctness
AUDIT: Failed login attempts
SCAN: Suspicious access patterns
```

#### **2.2 Data Privacy & GDPR**

```bash
# Zgodność z GDPR
AUDIT: User data collection points
VERIFY: Data retention policies
CHECK: Cookie consent implementation
SCAN: Personal data exposure in logs
```

### 📊 **3. ANALIZA WYDAJNOŚCI (Priorytet: WYSOKI)**

#### **3.1 Database Performance**

```bash
# Performance metrics
ANALYZE: Query execution times
MONITOR: Connection pool status
CHECK: Index optimization opportunities
TRACK: Storage usage trends
```

#### **3.2 Frontend Performance**

```bash
# UI responsiveness
MEASURE: Page load times (< 3s target)
ANALYZE: JavaScript bundle sizes
CHECK: Image optimization status
MONITOR: Core Web Vitals (LCP, FID, CLS)
```

### 🔧 **4. TECHNICAL DEBT ANALYSIS (Priorytet: ŚREDNI)**

#### **4.1 Code Quality Issues**

```bash
# Na podstawie dokumentacji z aplikacja_funkcje/
SCAN: UTF-8 encoding problems (POLACZEK system)
VERIFY: Environment variable availability (env?.AI undefined)
CHECK: Error handling completeness
ANALYZE: Code duplication patterns
```

#### **4.2 Documentation Sync**

```bash
# Sync między kodem a dokumentacją
COMPARE: API contracts vs implementation
VERIFY: Component documentation accuracy
CHECK: README files completeness
VALIDATE: Version consistency
```

---

## 🛠️ CO GEMINI CLI MA POPRAWIĆ

### 🚨 **1. KRYTYCZNE NAPRAWY (Priorytet: NATYCHMIASTOWY)**

#### **1.1 UTF-8 Encoding Fix**

**Problem:** Polskie znaki w POLACZEK API są źle kodowane
**Lokalizacja:** `src/pages/api/polaczek-chat.ts:405-415`

```typescript
// OBECNY KOD (❌ PROBLEM)
return new Response(JSON.stringify(data), {
  headers: { "Content-Type": "application/json" },
});

// POPRAWKA (✅ ROZWIĄZANIE)
return new Response(JSON.stringify(data), {
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  },
});
```

#### **1.2 Environment Variables Fix**

**Problem:** env?.AI undefined w generator obrazów
**Lokalizacja:** `src/pages/api/image-generator/generate.ts`

```typescript
// OBECNY KOD (❌ PROBLEM)
const ai = locals.runtime?.env?.AI;
if (!ai) {
  // Fallback to demo mode
}

// POPRAWKA (✅ ROZWIĄZANIE)
const ai = (locals as any)?.runtime?.env?.AI;
if (!ai) {
  console.error("Cloudflare AI binding not available");
  // Proper error handling
}
```

### 📊 **2. OPTYMALIZACJE WYDAJNOŚCI (Priorytet: WYSOKI)**

#### **2.1 API Response Optimization**

```bash
IMPLEMENT: Response caching for static data
OPTIMIZE: JSON payload compression
ADD: Rate limiting with proper error messages
IMPLEMENT: Request/response logging with rotation
```

#### **2.2 Database Query Optimization**

```bash
ADD: Query result caching
OPTIMIZE: Database indexes
IMPLEMENT: Connection pooling
ADD: Query performance monitoring
```

### 🔧 **3. FUNKCJONALNOŚCI DO ROZSZERZENIA (Priorytet: ŚREDNI)**

#### **3.1 Advanced Monitoring**

```bash
IMPLEMENT: Real-time system health dashboard
ADD: Automated alert system (email/SMS)
CREATE: Performance trend analysis
BUILD: Capacity planning tools
```

#### **3.2 Admin Tools Enhancement**

```bash
EXPAND: User management capabilities
ADD: System configuration editor
CREATE: Backup/restore functionality
IMPLEMENT: A/B testing framework
```

---

## 🚀 JAK GEMINI CLI MA DZIAŁAĆ

### 📋 **1. STARTUP SEQUENCE**

```bash
# 1. System Initialization
LOAD: Configuration from docs/aplikacja_funkcje/
VERIFY: All required environment variables
CONNECT: Database and external APIs
VALIDATE: Admin credentials

# 2. Health Check Execution
RUN: Complete system scan (2-3 minutes)
GENERATE: Initial status report
SEND: Admin notification if issues found
```

### 🔄 **2. CONTINUOUS MONITORING**

```bash
# Every 5 minutes
CHECK: Core API endpoints availability
MONITOR: Response times and error rates
VERIFY: Cloudflare Workers status

# Every 15 minutes
ANALYZE: Performance metrics trends
SCAN: Security logs for anomalies
UPDATE: System health dashboard

# Every hour
GENERATE: Performance summary report
BACKUP: Critical system data
ROTATE: Log files if needed

# Daily
CREATE: Comprehensive system report
ANALYZE: Usage patterns and trends
RECOMMEND: Optimization opportunities
PLAN: Capacity requirements
```

### 📨 **3. ALERT SYSTEM**

```bash
# Immediate Alerts (< 1 minute)
CRITICAL: System downtime detected
CRITICAL: Security breach attempt
CRITICAL: Database connection lost
HIGH: API error rate > 10%

# Standard Alerts (< 15 minutes)
WARNING: Performance degradation
WARNING: Storage capacity > 80%
INFO: Unusual traffic patterns
INFO: New user registrations spike
```

### 📊 **4. REPORTING SYSTEM**

#### **4.1 Real-time Dashboard**

```bash
DISPLAY: Current system status (green/yellow/red)
SHOW: Active user count and API usage
TRACK: Performance metrics (last 24h)
LIST: Recent alerts and resolutions
```

#### **4.2 Weekly Summary Reports**

```bash
SECTION: System uptime and availability
SECTION: Performance trends analysis
SECTION: Security incidents summary
SECTION: Usage statistics and growth
SECTION: Technical debt and improvements
SECTION: Recommendations for next week
```

### 🛠️ **5. MAINTENANCE AUTOMATION**

```bash
# Automated Tasks
AUTO: Log file rotation and archiving
AUTO: Database optimization queries
AUTO: Security patches application
AUTO: Backup verification and cleanup

# Semi-automated Tasks (requires approval)
SUGGEST: Configuration optimizations
PROPOSE: Infrastructure scaling needs
RECOMMEND: Library updates and migrations
PLAN: Feature deprecation timeline
```

---

## 💻 IMPLEMENTACJA TECHNICZNA

### 🏗️ **Architecture Overview**

```typescript
// Core GEMINI CLI Structure
interface GeminiCLI {
  monitor: SystemMonitor;
  analyzer: PerformanceAnalyzer;
  security: SecurityScanner;
  reporter: ReportGenerator;
  automation: MaintenanceBot;
}

class SystemMonitor {
  checkEndpoints(): HealthStatus[];
  monitorWorkers(): WorkerStatus[];
  validateIntegrations(): IntegrationStatus[];
}

class PerformanceAnalyzer {
  analyzeTrends(): TrendReport;
  identifyBottlenecks(): BottleneckReport;
  recommendOptimizations(): OptimizationPlan;
}
```

### 🔧 **Configuration Management**

```yaml
# gemini-config.yaml
monitoring:
  endpoints:
    - path: /api/polaczek-chat
      timeout: 5s
      expected_status: 200
    - path: /api/image-generator/generate
      timeout: 10s
      expected_status: 200

security:
  scan_intervals: 15m
  alert_thresholds:
    failed_logins: 5
    suspicious_requests: 10

performance:
  response_time_threshold: 2s
  error_rate_threshold: 5%
  memory_usage_threshold: 80%
```

---

## 📈 SCENARIUSZ: KOMPLETNY ZAPIS FUNKCJI

### 🎯 **AUTOMATED DOCUMENTATION GENERATOR**

GEMINI CLI będzie automatycznie generować kompletną dokumentację wszystkich funkcji systemu MyBonzo:

#### **1. Code Analysis Engine**

```bash
SCAN: All TypeScript/JavaScript files in src/
EXTRACT: Function signatures, parameters, return types
IDENTIFY: API endpoints and their methods
MAP: Component dependencies and relationships
GENERATE: Complete function inventory
```

#### **2. API Documentation Auto-Generator**

```bash
CREATE: OpenAPI/Swagger specifications
GENERATE: Postman collections for testing
BUILD: Interactive API documentation
UPDATE: Endpoint usage examples
MAINTAIN: Version changelog automatically
```

#### **3. Component Mapping System**

```bash
ANALYZE: React/Svelte component tree
MAP: Props flow and state management
DOCUMENT: Component lifecycle methods
TRACK: Reusable component library
GENERATE: Component usage statistics
```

#### **4. Database Schema Documentation**

```bash
EXTRACT: Table structures and relationships
DOCUMENT: Stored procedures and functions
MAP: Data flow diagrams
GENERATE: ER diagrams automatically
TRACK: Schema change history
```

---

## 🎨 WIZUALIZACJA POŁĄCZEŃ - DRAW.IO CODE

### 📊 **1. System Architecture Diagram**

```xml
<!-- MyBonzo System Architecture - Draw.io XML -->
<mxfile host="app.diagrams.net" modified="2025-10-12T00:00:00.000Z">
  <diagram name="MyBonzo Architecture" id="system-overview">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Frontend Layer -->
        <mxCell id="frontend" value="FRONTEND LAYER" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="720" height="120" as="geometry"/>
        </mxCell>

        <mxCell id="astro-pages" value="📄 Astro Pages&#xa;• index.astro (Main Chat)&#xa;• image-generator.astro (1300+ lines)&#xa;• /admin/* (Dashboard)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="frontend">
          <mxGeometry y="30" width="240" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="svelte-components" value="⚡ Svelte Components&#xa;• GoogleVoiceAgent.svelte&#xa;• MainChatAgentFunctions&#xa;• Admin Dashboard UI" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="frontend">
          <mxGeometry x="240" y="30" width="240" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="react-components" value="⚛️ React Components&#xa;• AdminDashboard.tsx (898 lines)&#xa;• WorkersStatusDashboard.tsx&#xa;• TrafficChart.tsx" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="frontend">
          <mxGeometry x="480" y="30" width="240" height="90" as="geometry"/>
        </mxCell>

        <!-- API Layer -->
        <mxCell id="api-layer" value="API LAYER" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="40" y="200" width="720" height="160" as="geometry"/>
        </mxCell>

        <mxCell id="core-apis" value="🔥 Core APIs&#xa;• /api/polaczek-chat.ts (418 lines)&#xa;• /api/image-generator/generate.ts&#xa;• /api/voice-ai.ts" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="api-layer">
          <mxGeometry y="30" width="240" height="130" as="geometry"/>
        </mxCell>

        <mxCell id="data-apis" value="📊 Data APIs&#xa;• /api/kaggle-datasets.ts&#xa;• /api/bigquery-analytics.ts&#xa;• /api/tavily-search.ts" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="api-layer">
          <mxGeometry x="240" y="30" width="240" height="130" as="geometry"/>
        </mxCell>

        <mxCell id="admin-apis" value="🛡️ Admin APIs&#xa;• /api/admin/control.ts (600+ lines)&#xa;• /api/admin/monitoring.ts&#xa;• /api/admin/workers-status.ts" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="admin-apis">
          <mxGeometry x="480" y="30" width="240" height="130" as="geometry"/>
        </mxCell>

        <!-- AI & External Services -->
        <mxCell id="ai-services" value="AI & EXTERNAL SERVICES" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="40" y="400" width="720" height="140" as="geometry"/>
        </mxCell>

        <mxCell id="cloudflare-ai" value="☁️ Cloudflare AI&#xa;• @cf/qwen/qwen1.5-14b-chat-awq&#xa;• @cf/gemma/gemma-7b-it&#xa;• @cf/llama/llama-2-7b-chat-int8&#xa;❌ env?.AI undefined issue" style="text;strokeColor=#b85450;fillColor=#f8cecc;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="ai-services">
          <mxGeometry y="30" width="240" height="110" as="geometry"/>
        </mxCell>

        <mxCell id="external-apis" value="🌐 External APIs&#xa;• DeepSeek API&#xa;• Kaggle API&#xa;• Google BigQuery&#xa;• Tavily Search API" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="ai-services">
          <mxGeometry x="240" y="30" width="240" height="110" as="geometry"/>
        </mxCell>

        <mxCell id="mcp-servers" value="🔌 MCP Servers&#xa;• Knowledge Management&#xa;• Document Processing&#xa;• Agent Coordination&#xa;• Task Automation" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="ai-services">
          <mxGeometry x="480" y="30" width="240" height="110" as="geometry"/>
        </mxCell>

        <!-- Utils & Support -->
        <mxCell id="utils-layer" value="UTILS & SUPPORT LAYER" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
          <mxGeometry x="40" y="580" width="720" height="120" as="geometry"/>
        </mxCell>

        <mxCell id="core-utils" value="🔧 Core Utils&#xa;• polaczekKnowledge.js&#xa;• documentationIndex.js&#xa;• corsUtils.ts&#xa;❌ UTF-8 encoding issue" style="text;strokeColor=#9673a6;fillColor=#e1d5e7;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="utils-layer">
          <mxGeometry y="30" width="240" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="voice-utils" value="🎤 Voice Utils&#xa;• voiceAiAPI.js&#xa;• Speech recognition&#xa;• Audio processing&#xa;✅ Fixed and working" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="utils-layer">
          <mxGeometry x="240" y="30" width="240" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="admin-utils" value="🛡️ Admin Utils&#xa;• Authentication&#xa;• Monitoring helpers&#xa;• Configuration management&#xa;• Security utilities" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="utils-layer">
          <mxGeometry x="480" y="30" width="240" height="90" as="geometry"/>
        </mxCell>

        <!-- Connection Arrows -->
        <mxCell id="arrow1" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="frontend" target="api-layer">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="380" y="300" as="sourcePoint"/>
            <mxPoint x="430" y="250" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="arrow2" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="api-layer" target="ai-services">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="380" y="400" as="sourcePoint"/>
            <mxPoint x="430" y="350" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="arrow3" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="ai-services" target="utils-layer">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="380" y="500" as="sourcePoint"/>
            <mxPoint x="430" y="450" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <!-- Problem Indicators -->
        <mxCell id="problem1" value="❌ UTF-8 Issue" style="shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="800" y="180" width="120" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="problem2" value="❌ env?.AI undefined" style="shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="800" y="380" width="120" height="60" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 🔄 **2. Data Flow Diagram**

```xml
<!-- Data Flow Diagram - Draw.io XML -->
<mxfile host="app.diagrams.net" modified="2025-10-12T00:00:00.000Z">
  <diagram name="Data Flow" id="data-flow">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- User Input -->
        <mxCell id="user" value="👤 USER" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="80" height="40" as="geometry"/>
        </mxCell>

        <!-- Chat Flow -->
        <mxCell id="chat-widget" value="💬 Chat Widget&#xa;(index.astro)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="180" y="30" width="120" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="polaczek-api" value="🤖 POLACZEK API&#xa;(/api/polaczek-chat.ts)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
          <mxGeometry x="360" y="30" width="140" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="ai-models" value="🧠 AI Models&#xa;(@cf/qwen, @cf/gemma)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="560" y="30" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- Image Generation Flow -->
        <mxCell id="image-ui" value="🎨 Image Generator UI&#xa;(image-generator.astro)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="180" y="130" width="140" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="image-api" value="🖼️ Image API&#xa;(/api/image-generator/)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
          <mxGeometry x="360" y="130" width="120" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="cloudflare-ai-img" value="☁️ Cloudflare AI&#xa;(Image Models)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="560" y="130" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- Admin Flow -->
        <mxCell id="admin-ui" value="🛡️ Admin Dashboard&#xa;(/admin/*)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="180" y="230" width="120" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="admin-api" value="⚙️ Admin API&#xa;(/api/admin/)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
          <mxGeometry x="360" y="230" width="120" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="monitoring" value="📊 Monitoring&#xa;& Analytics" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="560" y="230" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- Data Stores -->
        <mxCell id="knowledge-base" value="📚 Knowledge Base&#xa;(polaczekKnowledge.js)" style="cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="40" y="350" width="140" height="80" as="geometry"/>
        </mxCell>

        <mxCell id="user-data" value="👥 User Data&#xa;& Sessions" style="cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="220" y="350" width="120" height="80" as="geometry"/>
        </mxCell>

        <mxCell id="system-logs" value="📋 System Logs&#xa;& Metrics" style="cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="380" y="350" width="120" height="80" as="geometry"/>
        </mxCell>

        <mxCell id="external-apis" value="🌐 External APIs&#xa;(DeepSeek, Kaggle, etc.)" style="cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="540" y="350" width="140" height="80" as="geometry"/>
        </mxCell>

        <!-- Flow Arrows -->
        <mxCell id="flow1" value="" style="endArrow=classic;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="user" target="chat-widget">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="300" y="200" as="sourcePoint"/>
            <mxPoint x="350" y="150" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="flow2" value="" style="endArrow=classic;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="chat-widget" target="polaczek-api">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="300" y="200" as="sourcePoint"/>
            <mxPoint x="350" y="150" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="flow3" value="" style="endArrow=classic;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="polaczek-api" target="ai-models">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="300" y="200" as="sourcePoint"/>
            <mxPoint x="350" y="150" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <!-- Problem indicators -->
        <mxCell id="utf8-problem" value="❌ UTF-8&#xa;Encoding" style="shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="400" y="10" width="80" height="40" as="geometry"/>
        </mxCell>

        <mxCell id="env-problem" value="❌ env?.AI&#xa;undefined" style="shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="580" y="110" width="80" height="40" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 🏗️ **3. Component Architecture Diagram**

```xml
<!-- Component Architecture - Draw.io XML -->
<mxfile host="app.diagrams.net" modified="2025-10-12T00:00:00.000Z">
  <diagram name="Component Architecture" id="components">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Frontend Components Layer -->
        <mxCell id="frontend-layer" value="FRONTEND COMPONENTS" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="800" height="200" as="geometry"/>
        </mxCell>

        <!-- Astro Components -->
        <mxCell id="astro-box" value="📄 ASTRO PAGES" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=25;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="frontend-layer">
          <mxGeometry y="30" width="200" height="170" as="geometry"/>
        </mxCell>

        <mxCell id="astro-index" value="index.astro&#xa;• Main chat widget&#xa;• Navigation&#xa;• Hero section" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="astro-box">
          <mxGeometry y="25" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="astro-generator" value="image-generator.astro&#xa;• 1300+ lines UI&#xa;• Batch generation&#xa;• History display" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="astro-box">
          <mxGeometry y="70" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="astro-admin" value="/admin/*.astro&#xa;• Dashboard pages&#xa;• Monitoring UI&#xa;• Configuration" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="astro-box">
          <mxGeometry y="115" width="200" height="55" as="geometry"/>
        </mxCell>

        <!-- Svelte Components -->
        <mxCell id="svelte-box" value="⚡ SVELTE COMPONENTS" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=25;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="frontend-layer">
          <mxGeometry x="200" y="30" width="200" height="170" as="geometry"/>
        </mxCell>

        <mxCell id="svelte-voice" value="GoogleVoiceAgent.svelte&#xa;• Voice controls&#xa;• Speech recognition&#xa;✅ Fixed & working" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="svelte-box">
          <mxGeometry y="25" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="svelte-polaczek" value="PolaczekDyrektorPanel.svelte&#xa;• Agent management&#xa;• POLACZEK controls&#xa;• Real-time status" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="svelte-box">
          <mxGeometry y="70" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="svelte-config" value="ConfigurationManager.svelte&#xa;• System settings&#xa;• Environment vars&#xa;• Service toggles" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="svelte-box">
          <mxGeometry y="115" width="200" height="55" as="geometry"/>
        </mxCell>

        <!-- React Components -->
        <mxCell id="react-box" value="⚛️ REACT COMPONENTS" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=25;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="frontend-layer">
          <mxGeometry x="400" y="30" width="200" height="170" as="geometry"/>
        </mxCell>

        <mxCell id="react-dashboard" value="AdminDashboard.tsx&#xa;• 898 lines main UI&#xa;• Component orchestration&#xa;• State management" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="react-box">
          <mxGeometry y="25" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="react-workers" value="WorkersStatusDashboard.tsx&#xa;• Worker monitoring&#xa;• Performance metrics&#xa;• Health indicators" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="react-box">
          <mxGeometry y="70" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="react-charts" value="TrafficChart.tsx&#xa;• Data visualization&#xa;• Real-time graphs&#xa;• Analytics display" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="react-box">
          <mxGeometry y="115" width="200" height="55" as="geometry"/>
        </mxCell>

        <!-- Utility Components -->
        <mxCell id="utils-box" value="🔧 UTILITY COMPONENTS" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=25;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="frontend-layer">
          <mxGeometry x="600" y="30" width="200" height="170" as="geometry"/>
        </mxCell>

        <mxCell id="utils-status" value="StatusBox.tsx&#xa;• Real-time status&#xa;• Health indicators&#xa;• Alert displays" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="utils-box">
          <mxGeometry y="25" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="utils-stats" value="PanelStats.tsx&#xa;• Statistics display&#xa;• KPI metrics&#xa;• Performance data" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="utils-box">
          <mxGeometry y="70" width="200" height="45" as="geometry"/>
        </mxCell>

        <mxCell id="utils-tables" value="TicketsTable.tsx&#xa;UsersTable.tsx&#xa;• Data tables&#xa;• CRUD operations" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="utils-box">
          <mxGeometry y="115" width="200" height="55" as="geometry"/>
        </mxCell>

        <!-- API Integration Layer -->
        <mxCell id="api-integration" value="API INTEGRATION LAYER" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="40" y="280" width="800" height="120" as="geometry"/>
        </mxCell>

        <mxCell id="main-chat-functions" value="💬 MainChatAgentFunctions&#xa;• Real-time messaging&#xa;• WebSocket connections&#xa;• Chat state management&#xa;• Message history" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="api-integration">
          <mxGeometry y="30" width="200" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="image-functions" value="🎨 ImageGeneratorFunctions&#xa;• Batch processing&#xa;• Quality analysis&#xa;• Progress tracking&#xa;• Result caching" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="api-integration">
          <mxGeometry x="200" y="30" width="200" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="admin-functions" value="🛡️ AdminPanelFunctions&#xa;• System monitoring&#xa;• Configuration management&#xa;• User management&#xa;• Performance analytics" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="api-integration">
          <mxGeometry x="400" y="30" width="200" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="voice-functions" value="🎤 VoiceIntegrationFunctions&#xa;• Speech recognition&#xa;• Voice commands&#xa;• Audio processing&#xa;✅ Fully working" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="api-integration">
          <mxGeometry x="600" y="30" width="200" height="90" as="geometry"/>
        </mxCell>

        <!-- Data Flow Connections -->
        <mxCell id="connection1" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;strokeColor=#d6b656;strokeWidth=2;" edge="1" parent="1" source="astro-box" target="main-chat-functions">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="400" y="350" as="sourcePoint"/>
            <mxPoint x="450" y="300" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="connection2" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;strokeColor=#9673a6;strokeWidth=2;" edge="1" parent="1" source="svelte-box" target="image-functions">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="400" y="350" as="sourcePoint"/>
            <mxPoint x="450" y="300" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="connection3" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;strokeColor=#b85450;strokeWidth=2;" edge="1" parent="1" source="react-box" target="admin-functions">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="400" y="350" as="sourcePoint"/>
            <mxPoint x="450" y="300" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <mxCell id="connection4" value="" style="endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;strokeColor=#82b366;strokeWidth=2;" edge="1" parent="1" source="utils-box" target="voice-functions">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="400" y="350" as="sourcePoint"/>
            <mxPoint x="450" y="300" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <!-- Problem Annotations -->
        <mxCell id="utf8-annotation" value="❌ UTF-8 Problem&#xa;in POLACZEK API" style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="860" y="100" width="100" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="env-annotation" value="❌ env?.AI Issue&#xa;in Image Generator" style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="860" y="200" width="100" height="60" as="geometry"/>
        </mxCell>

        <mxCell id="working-annotation" value="✅ Voice System&#xa;Fixed & Working" style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="860" y="300" width="100" height="60" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 📚 INSTRUKCJE WDROŻENIA

### 🔧 **1. Setup GEMINI CLI**

```bash
# Instalacja dependencies
npm install -g @gemini/cli-tools
npm install typescript @types/node dotenv

# Konfiguracja środowiska
cp .env.example .env.gemini
# Dodaj klucze API: CLOUDFLARE_API_TOKEN, DEEPSEEK_API_KEY

# Inicjalizacja GEMINI CLI
gemini init --project=mybonzo --docs=docs/aplikacja_funkcje/
gemini configure --monitoring=enabled --alerts=enabled
```

### 📊 **2. Monitoring Setup**

```bash
# Uruchomienie systemu monitorowania
gemini monitor start --interval=5m
gemini dashboard deploy --port=3001

# Konfiguracja alertów
gemini alerts configure --email=admin@mybonzo.com
gemini alerts add --type=critical --threshold=90%
```

### 🚀 **3. Pierwsze Uruchomienie**

```bash
# Pełny system scan
gemini scan --full --output=reports/initial-scan.json

# Analiza problemów
gemini analyze --problems --fix-suggestions

# Automatyczne naprawy (opcjonalnie)
gemini fix --auto --backup=enabled
```

---

## 📝 PODSUMOWANIE

GEMINI CLI to kompleksowy system administracyjny, który:

1. **🔍 Monitoruje** wszystkie komponenty systemu MyBonzo 24/7
2. **🛠️ Naprawia** znane problemy automatycznie (UTF-8, env variables)
3. **📊 Analizuje** wydajność i trendy wykorzystania
4. **🛡️ Zabezpiecza** system przed zagrożeniami i anomaliami
5. **📈 Optymalizuje** koszty i wydajność infrastruktury
6. **📋 Dokumentuje** wszystkie funkcje i połączenia automatycznie
7. **🎨 Wizualizuje** architekturę systemu w Draw.io

System jest gotowy do wdrożenia i zintegruje się z istniejącą infrastrukturą MyBonzo bez zakłóceń w działaniu serwisów produkcyjnych.
