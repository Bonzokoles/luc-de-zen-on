# 🎯 CHUCK Scoring Engine & Jimbo Universal Nodes

System budowania i oceny workflow AI z wykorzystaniem 133 narzędzi.

## 📋 Spis Treści

- [Przegląd](#-przegląd)
- [Komponenty](#-komponenty)
- [Baza Narzędzi](#-baza-narzędzi)
- [Typy Węzłów](#-typy-węzłów)
- [Scoring Engine](#-scoring-engine)
- [Użycie](#-użycie)
- [Demo](#-demo)

## 🎯 Przegląd

CHUCK (Complete Hub for Unified Compatibility Knowledge) to zaawansowany system do:
- Zarządzania bazą 133 narzędzi AI
- Oceny kompatybilności między narzędziami
- Budowania i walidacji workflow
- Wykrywania problemów (cykle, niewydajności)
- Delegacji zadań do specjalistycznych narzędzi

## 🔧 Komponenty

### 1. Baza Danych Narzędzi (`lib/tools.json`)

133 narzędzia AI zorganizowane według typów:

- **writer** (24 narzędzia) - ChatGPT-4, Claude, Gemini, Jasper, Copy.ai...
- **code** (8 narzędzi) - DeepSeek Coder, Copilot, Cursor, Tabnine...
- **design** (31 narzędzi) - Midjourney, DALL-E, Canva, Figma, Leonardo...
- **video** (8 narzędzi) - Runway, Synthesia, HeyGen, Descript...
- **audio** (8 narzędzi) - ElevenLabs, Suno, Whisper, AssemblyAI...
- **research** (9 narzędzi) - Perplexity, Elicit, ChatPDF, Consensus...
- **social** (18 narzędzi) - Hootsuite, Buffer, ManyChat, Chatbase...
- **productivity** (15 narzędzi) - Notion, Monday, Asana, Superhuman...
- **automation** (4 narzędzia) - Zapier, Make, POLACZEK...
- **analytics** (5 narzędzi) - Semrush, Ahrefs, Surfer SEO...
- **crm** (7 narzędzi) - Salesforce, HubSpot, Intercom, Zendesk...

Każde narzędzie zawiera:
```typescript
{
  id: string;           // Unikalny identyfikator
  name: string;         // Nazwa międzynarodowa
  namePl: string;       // Nazwa polska
  type: string;         // Typ narzędzia
  workflows: string[];  // Obsługiwane workflow
  scoreMatrix: {
    quality: number;    // Jakość 0-100
    speed: number;      // Szybkość 0-100
    creativity: number; // Kreatywność 0-100
    technical: number;  // Poziom techniczny 0-100
  };
}
```

### 2. Matryca Kompatybilności (`lib/compatibilityMatrix.ts`)

Oblicza kompatybilność między narzędziami:

```typescript
// Przykład: writer → social = 95% kompatybilności
calculateConnectionScore(chatgpt, buffer); // 95%

// Znajdź kompatybilne narzędzia
getCompatibleTools(chatgpt, allTools, 80); // min 80% score

// Najlepsze narzędzia dla workflow
findBestToolsForWorkflow('content', allTools, 5);
```

**Tabela połączeń:**
- writer → social: 95%
- design → video: 95%
- code → automation: 95%
- analytics → crm: 95%
- research → analytics: 92%

### 3. Workflow Scoring (`lib/workflowScoring.ts`)

Ocena jakości workflow 0-100%:

```typescript
const score = calculateQuality(workflow);
// {
//   overall: 96,
//   breakdown: {
//     structure: 100,   // Struktura grafu
//     efficiency: 100,  // Wydajność
//     reliability: 80,  // Niezawodność
//     complexity: 100   // Prostota (im niższa złożoność, tym lepiej)
//   },
//   issues: [],
//   suggestions: []
// }
```

**Wykrywanie cykli:**
```typescript
const cycles = detectCycles(nodes, edges);
// [[node1, node2, node3, node1]] - znaleziony cykl
```

### 4. Universal Nodes (`src/nodes/universal.ts`)

Trzy typy węzłów Jimbo:

#### AI_AGENT
Deleguje wykonanie do CHUCK:
```typescript
const node = createAIAgentNode('chatgpt-4', {
  prompt: 'Wygeneruj post na LinkedIn',
  temperature: 0.7,
  maxTokens: 500
});
```

#### PROCESSOR
Przetwarza dane:
```typescript
// Scraping
createProcessorNode('scrape', {
  url: 'https://example.com',
  selector: '.content'
});

// Transformacja
createProcessorNode('transform', {
  transformType: 'json',
  mapping: { title: 'name', desc: 'description' }
});

// Export
createProcessorNode('export', {
  format: 'csv',
  filename: 'results.csv'
});
```

#### OUTPUT
Wysyła wyniki:
```typescript
// Email
createOutputNode('email', {
  to: 'user@example.com',
  subject: 'Raport'
});

// PDF
createOutputNode('pdf', {
  pdfOptions: { format: 'A4', orientation: 'portrait' }
});

// Slack
createOutputNode('slack', {
  channel: '#notifications',
  webhookUrl: 'https://...'
});
```

### 5. Execution Engine (`src/executionEngine.ts`)

Orkiestruje wykonanie workflow:

```typescript
const engine = new ExecutionEngine({
  chuckApiUrl: 'http://localhost:5152/api/exec',
  timeout: 30000,
  retryAttempts: 3
});

// Wykonaj pojedynczy węzeł
const result = await engine.executeNode(node, context);

// Wykonaj cały workflow
const results = await engine.executeWorkflow(nodes, edges, {
  input: 'Starting data'
});
```

**Delegacja do CHUCK:**
```typescript
// AI_AGENT nodes automatycznie delegowane do CHUCK
if (node.type === "ai_agent") {
  return fetch("http://localhost:5152/api/exec", {
    method: "POST",
    body: JSON.stringify({ toolId, prompt, ... })
  });
}
```

## 📊 Scoring Engine

### Ocena Struktury (0-100%)
- ✅ Brak cykli: +100%
- ⚠️ Cykle: -20% per cykl
- ⚠️ Węzły osierocone: -5% per węzeł
- ⚠️ Zbyt wiele punktów wejścia/wyjścia: -5%

### Ocena Wydajności (0-100%)
- ✅ Optymalna liczba węzłów (≤20): +100%
- ⚠️ Zbyt wiele węzłów: -penalty
- ⚠️ Zbyt wiele połączeń (ratio >2): -10%
- ⚠️ Długie ścieżki (>10): -3% per nadmiarowy krok

### Ocena Niezawodności (0-100%)
- Base: 80%
- ✅ Error handling: +10%
- ✅ Retry logic: +10%

### Ocena Złożoności (0-100%)
- Complexity 1-5: 90-100% (doskonałe)
- Complexity 6-10: 70-89% (dobre)
- Complexity 11-20: 50-69% (średnie)
- Complexity 21+: 0-49% (złożone)

## 🚀 Użycie

### 1. Import Modułów

```typescript
import { calculateConnectionScore } from './lib/compatibilityMatrix';
import { calculateQuality, detectCycles } from './lib/workflowScoring';
import { createAIAgentNode, createProcessorNode, createOutputNode } from './nodes/universal';
import { ExecutionEngine } from './executionEngine';
import tools from './lib/tools.json';
```

### 2. Budowanie Workflow

```typescript
// Utwórz węzły
const node1 = createAIAgentNode('chatgpt-4', {
  prompt: 'Napisz post o AI'
});

const node2 = createProcessorNode('transform', {
  transformType: 'markdown'
});

const node3 = createOutputNode('slack', {
  channel: '#marketing'
});

// Zdefiniuj połączenia
const edges = [
  { from: node1.id, to: node2.id },
  { from: node2.id, to: node3.id }
];

// Oceń workflow
const workflow = {
  nodes: [
    { id: node1.id, toolId: 'chatgpt-4', type: node1.type },
    { id: node2.id, toolId: '', type: node2.type },
    { id: node3.id, toolId: '', type: node3.type }
  ],
  edges
};

const score = calculateQuality(workflow);
console.log(`Workflow score: ${score.overall}%`);

// Wykryj cykle
const cycles = detectCycles(workflow.nodes, workflow.edges);
if (cycles.length > 0) {
  console.warn('Znaleziono cykle!', cycles);
}
```

### 3. Wykonanie Workflow

```typescript
const engine = new ExecutionEngine();

const results = await engine.executeWorkflow(
  [node1, node2, node3],
  edges,
  { input: 'Początkowe dane' }
);

// Sprawdź wyniki
results.forEach((result, nodeId) => {
  console.log(`${nodeId}: ${result.success ? 'OK' : 'FAIL'}`);
  if (result.data) console.log(result.data);
});
```

### 4. Analiza Kompatybilności

```typescript
const chatgpt = tools.find(t => t.id === 'chatgpt-4');
const compatible = getCompatibleTools(chatgpt, tools, 85);

console.log('Narzędzia kompatybilne z ChatGPT-4:');
compatible.forEach(c => {
  console.log(`- ${c.tool.namePl}: ${c.score}%`);
});
```

## 🎨 Demo

### Visual Workflow Builder

Dostępny pod adresem: `/narzedzia/workflow-builder`

**Funkcje:**
- 🎯 Paleta 140+ narzędzi AI z filtrowaniem
- 🔗 Wizualne budowanie workflow
- 📊 Ocena jakości w czasie rzeczywistym
- 🔍 Wykrywanie cykli
- 💡 Sugestie optymalizacji

### Testy

Uruchom testy:
```bash
npx tsx src/test-chuck.ts
```

Wynik:
```
✅ All tests completed successfully!
  • 133 AI tools database
  • Compatibility scoring between tools
  • Workflow quality evaluation (0-100%)
  • Cycle detection in workflows
  • 3 universal node types (AI_AGENT, PROCESSOR, OUTPUT)
  • Integration with execution engine
```

## 🔗 Integracja z CAY_DEN

System zachowuje strukturę proxy Workers z mybonzo.com:

```typescript
// CHUCK proxy endpoint
const CHUCK_API = 'http://localhost:5152/api/exec';

// Delegacja AI_AGENT nodes
if (node.type === 'AI_AGENT') {
  const response = await fetch(CHUCK_API, {
    method: 'POST',
    body: JSON.stringify({
      toolId: node.config.toolId,
      prompt: node.config.prompt,
      workflowId: context.workflowId
    })
  });
}
```

## 📝 Licencja

MIT - Część projektu luc-de-zen-on

---

**Stworzono dla**: Bonzokoles/luc-de-zen-on  
**Technologie**: TypeScript, React, Astro  
**Status**: ✅ Production Ready
