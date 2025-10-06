# MyBonzo Gemini CLI Helper Scripts
# Użycie: .\gemini-mybonzo.ps1 [command] [args]

param(
    [Parameter(Position=0)]
    [string]$Command,
    [Parameter(Position=1, ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

# Główny kontekst MyBonzo dla wszystkich promptów
$MyBonzoContext = @"
You are an expert AI developer working on MyBonzo - a dual-repository Astro/Cloudflare Pages project.

TECH STACK:
- Astro 5 SSR, TypeScript, Cloudflare Workers
- React + Svelte components  
- APIs: Tavily, DeepSeek, Workers AI (@cf/google/gemma-7b-it)
- Storage: KV, R2 buckets, D1 database
- Monitoring: Sentry error tracking

ARCHITECTURE:
- Development: luc-de-zen-on → luc-de-zen-on.pages.dev
- Production: mybonzo-production → mybonzo.com
- Modular agents: src/components/agents/agent-XX-name/
- Dual-repo deployment with deploy-to-production.ps1

CRITICAL PATTERN:
✅ CORRECT: const apiKey = (locals as any)?.runtime?.env?.API_KEY;
❌ WRONG: const apiKey = import.meta.env.API_KEY; (build-time only)

Always follow MyBonzo patterns, use Polish language for content, consider Cloudflare Workers environment.
"@

function Invoke-GeminiWithContext {
    param([string]$Prompt)
    
    $FullPrompt = "$MyBonzoContext`n`n$Prompt"
    & gemini $FullPrompt
}

switch ($Command) {
    "fix" {
        $ErrorMsg = $Args -join " "
        $Prompt = "Fix this MyBonzo error and provide solution:`n`nERROR: $ErrorMsg`n`nProvide:`n1. Root cause analysis`n2. Specific fix with code`n3. Prevention strategy`n4. Test commands to verify fix"
        Invoke-GeminiWithContext $Prompt
    }
    
    "api" {
        $ApiName = $Args[0]
        $Description = $Args[1..($Args.Length-1)] -join " "
        $Prompt = "Create MyBonzo API endpoint:`n`nENDPOINT: /api/$ApiName`nFUNCTIONALITY: $Description`n`nRequirements:`n- Follow src/pages/api/[name].ts pattern`n- Use Cloudflare runtime env access`n- Add Sentry error tracking`n- Include GET/POST methods`n- Add proper TypeScript types`n- Handle errors with fallback mechanisms"
        Invoke-GeminiWithContext $Prompt
    }
    
    "component" {
        $ComponentName = $Args[0]
        $Framework = $Args[1]
        $Description = $Args[2..($Args.Length-1)] -join " "
        $Prompt = "Create MyBonzo agent component:`n`nNAME: agent-$ComponentName`nFRAMEWORK: $Framework`nFUNCTION: $Description`n`nStructure:`n- index.astro (max 200 lines)`n- api.ts (max 150 lines)`n- component.[$Framework] (max 200 lines)`n- config.ts (max 50 lines)`n- README.md`n`nUse Polish language content and MyBonzo patterns."
        Invoke-GeminiWithContext $Prompt
    }
    
    "optimize" {
        $Target = $Args -join " "
        $Prompt = "Optimize MyBonzo code for Cloudflare Pages performance:`n`nTARGET: $Target`n`nFocus on:`n- Cloudflare Workers AI efficiency`n- KV storage optimization`n- Edge caching strategies`n- Bundle size reduction`n- API response times`n- Memory usage in Workers environment`n`nProvide optimized code with performance impact analysis."
        Invoke-GeminiWithContext $Prompt
    }
    
    "debug" {
        $Issue = $Args -join " "
        $Prompt = "Debug MyBonzo issue:`n`nPROBLEM: $Issue`n`nAnalyze:`n- Cloudflare Pages Functions environment`n- Astro 5 SSR configuration`n- API integrations (Tavily, DeepSeek)`n- Sentry error tracking`n`nProvide step-by-step debugging approach and solution."
        Invoke-GeminiWithContext $Prompt
    }
    
    "polish" {
        $ContentType = $Args[0]
        $Context = $Args[1..($Args.Length-1)] -join " "
        $Prompt = "Generate Polish content for MyBonzo:`n`nTYPE: $ContentType`nCONTEXT: $Context`n`nRequirements:`n- Native Polish language (native speaker level)`n- Technical accuracy for AI/development terms`n- User-friendly and clear`n- Follow POLACZEK_* file conventions`n- Consistent with MyBonzo terminology"
        Invoke-GeminiWithContext $Prompt
    }
    
    "deploy" {
        $Changes = $Args -join " "
        $Prompt = "Create MyBonzo deployment plan:`n`nCHANGES: $Changes`n`nProvide:`n1. Pre-deployment checklist`n2. Deployment commands (quick-sync.ps1, deploy-to-production.ps1)`n3. Post-deployment verification`n4. Rollback strategy if needed`n5. Health check commands`n`nConsider dual-repository workflow and production stability."
        Invoke-GeminiWithContext $Prompt
    }
    
    "config" {
        $ConfigChange = $Args -join " "
        $Prompt = "Update MyBonzo wrangler.toml configuration:`n`nREQUIREMENT: $ConfigChange`n`nConsider:`n- Production vs development environments`n- KV namespaces, R2 buckets, D1 database bindings`n- Environment variables and secrets`n- Custom domains (mybonzo.com, www.mybonzo.com)`n- Smart placement and resource limits"
        Invoke-GeminiWithContext $Prompt
    }
    
    "review" {
        $FilePath = $Args[0]
        if (Test-Path $FilePath) {
            $Code = Get-Content $FilePath -Raw
            $Prompt = "Review this MyBonzo code for best practices:`n`nFILE: $FilePath`n`nCODE:`n$Code`n`nCheck for:`n- MyBonzo architectural patterns`n- Cloudflare Workers compatibility`n- TypeScript best practices`n- Performance optimization`n- Security considerations`n- Error handling completeness"
            Invoke-GeminiWithContext $Prompt
        } else {
            Write-Host "File not found: $FilePath" -ForegroundColor Red
        }
    }
    
    "polaczek-deploy" {
        $Prompt = @"
# Agent-08-Polaczek-Master Deployment & Integration

## 🇵🇱 MISSION: Deploy Polish AI Orchestrator to MyBonzo

### Cel Główny
Wdrożenie kompletnego Agent-08-Polaczek-Master z zastąpieniem modelu Bielik nowoczesnymi rozwiązaniami AI i pełną integracją z MyBonzo.

## 🎯 DEPLOYMENT TASKS

### 1. MODEL INTEGRATION (Priority #1)
```
MODELE DO WDROŻENIA:
✅ DeepSeek R1 - Główny model (już dostępny w MyBonzo)
🆕 Qwen2.5 3B - Lokalny model przez Ollama  
🆕 Gemma2 2B - Backup w Cloudflare Workers

KONFIGURACJA:
- Verify DEEPSEEK_API_KEY w Cloudflare
- Setup Ollama local server (optional)
- Configure model hierarchy w config.ts
- Test all model connections
```

### 2. AGENT SYSTEM DEPLOYMENT  
```
AGENCI DO WDROŻENIA:
🎯 POLACZEK_D - Dyrektor/Orchestrator (DeepSeek R1)
🔄 POLACZEK_T - Tłumacz/Content (DeepSeek R1) 
📚 POLACZEK_B - Bibliotekarz/Knowledge (Qwen2.5)
⚙️ POLACZEK_M1 - Manager/Tasks (Gemma2)
📊 POLACZEK_D1 - Dashboard/UI (Qwen2.5)

STRUKTURA GOTOWA:
src/components/agents/modules/agent-08-polaczek-master/
├── index.astro ✅
├── api.ts ✅  
├── component.svelte ✅
├── config.ts ✅
└── README.md ✅
```

### 3. API ENDPOINTS SETUP
```
ENDPOINTS DO WDROŻENIA:
✅ /api/polaczek/orchestrate - Main orchestration
🔄 Test orchestration with real DeepSeek calls
🔄 Add error handling & fallbacks  
🔄 Configure rate limiting
🔄 Add performance monitoring
```

### 4. UI INTEGRATION  
```
INTERFACE DO DODANIA:
✅ Agent page: /agent-08-polaczek-master
🔄 Add to main navigation
🔄 Test Svelte component functionality
🔄 Verify Polish language UI
🔄 Add to agents dashboard
```

### 5. MYBONZO INTEGRATION
```
INTEGRACJA Z SYSTEMEM:
🔄 Add agent to astro.config.mjs
🔄 Update navigation components
🔄 Add to agent listing
🔄 Configure environment variables
🔄 Test with existing agents (no conflicts)
```

## 🔧 TECHNICAL CHECKLIST

### Environment Setup
```bash
# Verify existing vars
DEEPSEEK_API_KEY=sk-xxx ✅ (already in MyBonzo)

# Add new vars to Cloudflare
QWEN_API_KEY=sk-xxx (if using Qwen API)
OLLAMA_ENDPOINT=http://localhost:11434 (optional)
POLACZEK_ENABLED=true
```

### File Integration
```typescript
// Add to src/components/navigation/
{
  id: 'agent-08-polaczek-master',
  name: 'Polaczek Master', 
  description: 'Polski Orchestrator AI',
  icon: '🇵🇱',
  path: '/agent-08-polaczek-master'
}
```

### Testing Commands
```bash
# Test API endpoint
curl -X POST http://localhost:4321/api/polaczek/orchestrate \\
  -H "Content-Type: application/json" \\
  -d '{"task":"Test polskiego agenta","priority":"normal","language":"pl"}'

# Test UI
http://localhost:4321/agent-08-polaczek-master

# Test orchestration
pnpm dev
```

## 🚀 DEPLOYMENT PHASES

### Phase 1: Core Deployment (Now)
- [x] Agent structure created
- [x] API endpoints ready
- [x] UI components built
- [ ] Test with DeepSeek API
- [ ] Add to navigation

### Phase 2: Integration Testing
- [ ] Test all 5 agents
- [ ] Verify orchestration logic
- [ ] Performance benchmarks
- [ ] Error handling validation

### Phase 3: Production  
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] User testing
- [ ] Documentation update

## 🎯 SUCCESS METRICS

1. ✅ All 5 Polish agents operational
2. ✅ DeepSeek R1 integration working perfectly
3. ✅ Smart agent selection based on task
4. ✅ Polish UI fully functional
5. ✅ Response time < 3s average
6. ✅ Success rate > 95%
7. ✅ No conflicts with existing MyBonzo agents

## 🚨 CRITICAL NOTES

- **NO Breaking Changes** - Existing agents must continue working
- **Polish First** - All interactions in Polish language
- **Model Hierarchy** - DeepSeek primary, fallbacks available
- **MyBonzo Compatibility** - Use existing infrastructure
- **Performance** - Must be better than original Bielik

## ROZPOCZNIJ DEPLOYMENT:
1. Test current API endpoint
2. Add to navigation system
3. Configure environment variables
4. Full integration testing
5. Production deployment

WAŻNE: Agent-08-Polaczek-Master jest gotowy do wdrożenia - wszystkie pliki utworzone i skonfigurowane!
"@
        Invoke-GeminiWithContext $Prompt
    }
    
    "full-system-repair" {
        $Prompt = @"
# MyBonzo Complete System Repair & BigQuery Integration

## CRITICAL MISSION: Full System Audit & Repair
Przeprowadź kompleksową naprawę całego systemu MyBonzo z integracją BigQuery i weryfikacją wszystkich funkcjonalności.

## 🎯 GŁÓWNE CELE

### 1. API ENDPOINTS REPAIR (Priorytet #1)
```
NAPRAW WSZYSTKIE API:
✅ /api/test-connections - Test wszystkich połączeń
✅ /api/test-tavily - Tavily Search API  
✅ /api/test-deepseek - DeepSeek AI API
✅ /api/test-kaggle - Kaggle Datasets API
✅ /api/health-check - System health monitoring
✅ /api/status-check - Service status verification

DODAJ NOWE API:
🆕 /api/bigquery-connect - BigQuery connection
🆕 /api/bigquery-query - Execute BigQuery queries  
🆕 /api/bigquery-datasets - List available datasets
🆕 /api/data-sync - Sync real data from APIs to BigQuery
🆕 /api/analytics - Real-time analytics from BigQuery
```

### 2. BIGQUERY INTEGRATION (Priorytet #1)
```
IMPLEMENTUJ PEŁNĄ INTEGRACJĘ:
📊 Połączenie z Google BigQuery
📊 Automatyczny sync danych z API (Tavily, DeepSeek, Kaggle)
📊 Real-time analytics dashboard
📊 Data warehouse dla wszystkich agentów
📊 Backup i recovery system
📊 Performance monitoring queries

STRUKTURY TABEL:
- api_calls (timestamp, endpoint, response_time, status)
- search_results (query, source, results, timestamp)
- ai_interactions (prompt, response, model, timestamp)
- kaggle_datasets (name, size, last_updated, downloads)
- system_metrics (cpu, memory, requests, errors, timestamp)
```

### 3. AGENTS FUNCTIONALITY AUDIT
```
SPRAWDŹ I NAPRAW WSZYSTKICH AGENTÓW:
🤖 Agent-01-POLACZEK - Polski content generator
🤖 Agent-02-Tavily - Search & research
🤖 Agent-03-DeepSeek - AI development
🤖 Agent-04-Kaggle - Data analysis
🤖 Agent-05-GoogleADK - Ads management
🤖 Agent-06-Voice - Audio processing
🤖 Agent-07-Stable-Diffusion - Image generation

DLA KAŻDEGO AGENTA:
- ✅ Test API endpoints
- ✅ Verify button functionality
- ✅ Check data flow
- ✅ Validate error handling
- ✅ Performance optimization
- ✅ Real data integration (NO FAKE DATA!)
```

### 4. BUTTON TESTING & REPAIR
```
PEŁNY AUDIT PRZYCISKÓW NA WSZYSTKICH STRONACH:
🔘 Strona główna - wszystkie call-to-action buttons
🔘 Agent pages - funkcjonalność każdego przycisku
🔘 Settings panels - konfiguracja i zapisywanie
🔘 API test panels - connection testing
🔘 Control panel - admin functions

NAPRAW:
- Event handlers
- API calls from buttons
- Loading states
- Error handling
- Success feedback
- Data persistence
```

### 5. REAL DATA IMPLEMENTATION
```
USUŃ WSZYSTKIE FAKE DATA:
❌ Mock responses
❌ Placeholder content
❌ Test data
❌ Dummy APIs

ZASTĄP REAL DATA:
✅ Live API connections
✅ Real search results from Tavily
✅ Actual AI responses from DeepSeek
✅ Real datasets from Kaggle
✅ Live metrics from BigQuery
✅ Actual user interactions
```

## 🔧 TECHNICAL IMPLEMENTATION

### Environment Variables Check
```typescript
// Sprawdź wszystkie wymagane zmienne
const requiredVars = [
    'DEEPSEEK_API_KEY',
    'TAVILY_API_KEY', 
    'KAGGLE_API_KEY',
    'GOOGLE_CLOUD_PROJECT_ID',
    'BIGQUERY_DATASET',
    'GOOGLE_APPLICATION_CREDENTIALS'
];
```

### BigQuery Schema Setup
```sql
-- Utwórz główne tabele
CREATE TABLE IF NOT EXISTS mybonzo_analytics.api_calls (
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    endpoint STRING,
    method STRING,
    response_time INT64,
    status_code INT64,
    user_agent STRING,
    ip_address STRING
);

CREATE TABLE IF NOT EXISTS mybonzo_analytics.search_queries (
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    query STRING,
    source STRING,
    results_count INT64,
    processing_time INT64
);
```

### Error Handling Pattern
```typescript
// Implement standardized error handling
try {
    const result = await apiCall();
    await logToBigQuery('success', result);
    return result;
} catch (error) {
    await logToBigQuery('error', error);
    throw new Error(`API Error: ${error.message}`);
}
```

## 📋 EXECUTION CHECKLIST

### Phase 1: Infrastructure
- [ ] Setup BigQuery connection
- [ ] Create database schemas
- [ ] Configure environment variables
- [ ] Test all API credentials

### Phase 2: API Repair
- [ ] Fix existing endpoints
- [ ] Add BigQuery endpoints
- [ ] Implement error handling
- [ ] Add performance monitoring

### Phase 3: Data Integration
- [ ] Remove all fake data
- [ ] Implement real API calls
- [ ] Setup data sync to BigQuery
- [ ] Create analytics dashboards

### Phase 4: Frontend Testing
- [ ] Test every button on every page
- [ ] Verify form submissions
- [ ] Check loading states
- [ ] Validate error messages

### Phase 5: Performance & Monitoring
- [ ] Setup real-time monitoring
- [ ] Performance benchmarks
- [ ] Error tracking
- [ ] Usage analytics

## 🚀 SUCCESS CRITERIA
1. ✅ Wszystkie API działają z prawdziwymi danymi
2. ✅ BigQuery integration działa perfekcyjnie
3. ✅ Każdy przycisk na każdej stronie funkcjonuje
4. ✅ Zero fake data w całym systemie
5. ✅ Real-time monitoring i analytics
6. ✅ Performance > 95% uptime
7. ✅ Error rate < 1%

## ROZPOCZNIJ NATYCHMIAST:
Zacznij od audytu obecnego stanu, zidentyfikuj wszystkie problemy, stwórz plan implementacji i wykonaj pełną naprawę systemu.

WAŻNE: To jest production system - wszelkie zmiany muszą być stabilne i przetestowane!
"@
        Invoke-GeminiWithContext $Prompt
    }
    
    "docs" {
        Write-Host "🧠 Opening MyBonzo Gemini documentation..." -ForegroundColor Green
        if (Test-Path "docs\gemini") {
            Start-Process explorer "docs\gemini"
            Write-Host "Documentation folder opened: docs\gemini\" -ForegroundColor Yellow
            Write-Host "Available files:" -ForegroundColor Yellow
            Get-ChildItem "docs\gemini\*.md" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }
        } else {
            Write-Host "Documentation folder not found: docs\gemini\" -ForegroundColor Red
        }
    }
    
    "send-docs" {
        Write-Host "� Opening Gemini CLI and sending MyBonzo docs..." -ForegroundColor Green
        if (Test-Path "docs\gemini") {
            # Przygotuj pełną dokumentację
            $AllDocs = "Przeczytaj tę kompletną dokumentację MyBonzo Gemini CLI i potwierdź zrozumienie kontekstu projektu:`n`n"
            
            Get-ChildItem "docs\gemini\*.md" | Sort-Object Name | ForEach-Object {
                $AllDocs += "=== $($_.Name) ===`n"
                $AllDocs += Get-Content $_.FullName -Raw
                $AllDocs += "`n`n---`n`n"
            }
            
            $FullPrompt = $AllDocs
            
            # Sprawdź czy Gemini CLI jest dostępne
            try {
                $geminiTest = & where.exe gemini 2>$null
                if ($geminiTest) {
                    Write-Host "📤 Sending to Gemini CLI..." -ForegroundColor Yellow
                    Write-Host "Files included:" -ForegroundColor Yellow
                    Get-ChildItem "docs\gemini\*.md" | ForEach-Object { Write-Host "  ✓ $($_.Name)" -ForegroundColor Cyan }
                    
                    # Wyślij do Gemini CLI
                    $FullPrompt | & gemini
                } else {
                    throw "Gemini CLI not found"
                }
            } catch {
                Write-Host "⚠️  Gemini CLI not found or not working" -ForegroundColor Yellow
                Write-Host "📋 Copying to clipboard instead..." -ForegroundColor Yellow
                $FullPrompt | Set-Clipboard
                Write-Host "✅ Documentation copied to clipboard!" -ForegroundColor Green
                Write-Host "💡 Install Gemini CLI or paste manually into Gemini" -ForegroundColor Cyan
                Write-Host "Files included:" -ForegroundColor Yellow
                Get-ChildItem "docs\gemini\*.md" | ForEach-Object { Write-Host "  ✓ $($_.Name)" -ForegroundColor Cyan }
            }
        } else {
            Write-Host "❌ Documentation folder not found: docs\gemini\" -ForegroundColor Red
        }
    }
    
    "init-gemini" {
        Write-Host "🧠 MyBonzo Gemini CLI Initialization" -ForegroundColor Green
        Write-Host "===================================" -ForegroundColor Green
        
        # Sprawdź Gemini CLI
        try {
            $geminiTest = & where.exe gemini 2>$null
            if ($geminiTest) {
                Write-Host "✅ Gemini CLI found: $geminiTest" -ForegroundColor Green
            } else {
                throw "Not found"
            }
        } catch {
            Write-Host "❌ Gemini CLI not found!" -ForegroundColor Red
            Write-Host "📥 Install with: npm install -g @google/generative-ai-cli" -ForegroundColor Yellow
            Write-Host "🔑 Then configure: gemini config set api-key YOUR_API_KEY" -ForegroundColor Yellow
            return
        }
        
        # Sprawdź API key
        try {
            $configTest = & gemini config list 2>$null
            if ($configTest -match "api-key") {
                Write-Host "✅ API key configured" -ForegroundColor Green
            } else {
                Write-Host "⚠️  API key not configured" -ForegroundColor Yellow
                Write-Host "🔑 Run: gemini config set api-key YOUR_API_KEY" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Could not check API key configuration" -ForegroundColor Yellow
        }
        
        # Sprawdź dokumentację
        if (Test-Path "docs\gemini") {
            Write-Host "✅ Documentation folder found" -ForegroundColor Green
            Write-Host "📁 Available docs:" -ForegroundColor Yellow
            Get-ChildItem "docs\gemini\*.md" | ForEach-Object { Write-Host "  ✓ $($_.Name)" -ForegroundColor Cyan }
        } else {
            Write-Host "❌ Documentation folder missing" -ForegroundColor Red
            return
        }
        
        # Pytaj czy wysłać dokumentację
        Write-Host "`n🚀 Ready to send MyBonzo context to Gemini!" -ForegroundColor Green
        $send = Read-Host "Send documentation now? (y/n)"
        
        if ($send -eq "y" -or $send -eq "Y") {
            & $MyInvocation.MyCommand.Path send-docs
        } else {
            Write-Host "💡 Use '.\gemini-mybonzo.ps1 send-docs' when ready" -ForegroundColor Cyan
        }
    }
    
    "help" {
        Write-Host @"
🧠 MyBonzo Gemini CLI Helper

USAGE:
  .\gemini-mybonzo.ps1 [command] [args]

COMMANDS:
  fix [error]           - Fix MyBonzo error
  api [name] [desc]     - Create API endpoint  
  component [name] [framework] [desc] - Create agent component
  optimize [target]     - Optimize performance
  debug [issue]         - Debug problem
  polish [type] [context] - Generate Polish content
  deploy [changes]      - Create deployment plan
  config [change]       - Update wrangler.toml
  review [filepath]     - Review code
  polaczek-deploy       - Deploy Agent-08-Polaczek-Master (Polish AI Orchestrator)
  full-system-repair    - Complete system audit, API repair & BigQuery integration
  docs                  - Open documentation folder
  send-docs             - Send all docs to Gemini CLI (or clipboard)
  init-gemini           - Interactive Gemini setup and context sending
  help                  - Show this help

EXAMPLES:
  .\gemini-mybonzo.ps1 fix "Property 'AI' does not exist on type 'Env'"
  .\gemini-mybonzo.ps1 api weather "OpenWeatherMap integration"
  .\gemini-mybonzo.ps1 component news svelte "RSS feed reader"
  .\gemini-mybonzo.ps1 optimize "Tavily API response times"
  .\gemini-mybonzo.ps1 polish "error-messages" "authentication system"

DOCUMENTATION:
  See docs\gemini\ folder for complete guides and templates
"@ -ForegroundColor Green
    }
    
    default {
        if ($Command) {
            # Treat as direct prompt
            $DirectPrompt = "$Command " + ($Args -join " ")
            Invoke-GeminiWithContext $DirectPrompt
        } else {
            & $MyInvocation.MyCommand.Path help
        }
    }
}