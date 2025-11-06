# MCP Astro Integration Guide - Cloudflare AI Models

## 🎯 AKTUALNA KONFIGURACJA SYSTEMU

### Model Hierarchy Status

```typescript
// Główne modele Cloudflare AI w produkcji
BIELIK_11B: "@cf/speakleash/bielik-11b-v2.2-instruct"; // Orchestrator
QWEN_14B: "@cf/qwen/qwen1.5-14b-chat-awq"; // Analytics
WHISPER: "@cf/openai/whisper-tiny-en"; // Voice
GEMMA_7B: "@cf/google/gemma-7b-it"; // Support
LLAMA_8B: "@cf/meta/llama-3.1-8b-instruct"; // Backup
```

## 📡 MCP SERVER ENDPOINTS - PRODUCTION READY

### Primary Polish AI Endpoints

```bash
# Agent-08 Polaczek Master Orchestrator
POST https://dc49870f.luc-de-zen-on.pages.dev/api/polaczek/orchestrate
POST https://dc49870f.luc-de-zen-on.pages.dev/api/bielik-polish
POST https://dc49870f.luc-de-zen-on.pages.dev/api/qwen-polish

# Voice Recognition & Synthesis
POST https://dc49870f.luc-de-zen-on.pages.dev/api/voice/recognition
POST https://dc49870f.luc-de-zen-on.pages.dev/api/voice/commands
POST https://dc49870f.luc-de-zen-on.pages.dev/api/voice/synthesis

# System Status & Health
GET https://dc49870f.luc-de-zen-on.pages.dev/api/health-check
GET https://dc49870f.luc-de-zen-on.pages.dev/api/workers-status
GET https://dc49870f.luc-de-zen-on.pages.dev/api/system/validate
```

## 🔧 JAK UŻYWAĆ MCP Z ASTRO

### 1. Basic Connection Pattern

```javascript
// Standard MCP request to Polish AI
const response = await fetch("/api/bielik-polish", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    prompt: "Twoje zapytanie w języku polskim",
    context: "business|conversational|technical",
    agentId: "agent-08-polaczek",
  }),
});

const aiResponse = await response.json();
```

### 2. Advanced Orchestrator Usage

```javascript
// Multi-agent orchestration through Polaczek Master
const orchestrationResponse = await fetch("/api/polaczek/orchestrate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    task: "complex-analysis",
    agents: ["bielik-main", "qwen-analytics", "voice-assistant"],
    context: {
      language: "polish",
      domain: "business-ai",
      priority: "high",
    },
    data: {
      userInput: "Przeanalizuj i zoptymalizuj proces biznesowy",
      requirements: ["efficiency", "cost-reduction", "automation"],
    },
  }),
});
```

### 3. Voice Integration Example

```javascript
// Voice command processing with Whisper + Bielik
async function processVoiceCommand(audioBlob) {
  // Step 1: Voice recognition
  const transcription = await fetch("/api/voice/recognition", {
    method: "POST",
    body: audioBlob,
    headers: { "Content-Type": "audio/webm" },
  });

  const { text } = await transcription.json();

  // Step 2: Process command with Bielik
  const command = await fetch("/api/bielik-polish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: text,
      context: "voice-command",
      responseType: "action",
    }),
  });

  return await command.json();
}
```

## 🚀 READY-TO-USE MCP FUNCTIONS

### Function 1: Polish Business AI Assistant

```typescript
// Location: /api/bielik-polish
export async function polishBusinessAssistant(prompt: string) {
  const response = await env.AI.run("@cf/speakleash/bielik-11b-v2.2-instruct", {
    messages: [
      {
        role: "system",
        content: `Jesteś Agent-08-Polaczek, ekspert AI w dziedzinie biznesu. 
               Odpowiadasz profesjonalnie w języku polskim z pełnym 
               zrozumieniem kontekstu kulturowego i biznesowego.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return response;
}
```

### Function 2: Advanced Analytics Engine

```typescript
// Location: /api/qwen-polish
export async function advancedPolishAnalytics(data: any) {
  const response = await env.AI.run("@cf/qwen/qwen1.5-14b-chat-awq", {
    messages: [
      {
        role: "system",
        content: `Wykonuj zaawansowane analizy danych w kontekście polskim.
               Specjalizujesz się w analytics, reporting i data science.`,
      },
      {
        role: "user",
        content: `Przeanalizuj dane: ${JSON.stringify(data)}`,
      },
    ],
  });
  return response;
}
```

### Function 3: Voice Command Processor

```typescript
// Location: /api/voice/commands
export async function processPolishVoiceCommands(audioInput: ArrayBuffer) {
  // Whisper transcription
  const transcription = await env.AI.run("@cf/openai/whisper-tiny-en", {
    audio: audioInput,
  });

  // Bielik processing
  const commandResponse = await env.AI.run(
    "@cf/speakleash/bielik-11b-v2.2-instruct",
    {
      messages: [
        {
          role: "system",
          content:
            "Przetwarzasz polskie komendy głosowe i wykonujesz odpowiednie akcje.",
        },
        {
          role: "user",
          content: transcription.text,
        },
      ],
    }
  );

  return commandResponse;
}
```

## 📋 CHECKLIST - CO SPRAWDZIĆ

### ✅ System Health Check

- [ ] Test endpoint: `GET /api/health-check`
- [ ] Sprawdź response time < 2s
- [ ] Zweryfikuj status code 200

### ✅ Polish Models Testing

- [ ] Test Bielik orchestrator: `POST /api/bielik-polish`
- [ ] Test Qwen analytics: `POST /api/qwen-polish`
- [ ] Test voice recognition: `POST /api/voice/recognition`
- [ ] Sprawdź odpowiedzi w języku polskim

### ✅ MCP Integration Verification

- [ ] Test multi-agent orchestration via `/api/polaczek/orchestrate`
- [ ] Sprawdź kolejkowanie zapytań
- [ ] Zweryfikuj error handling
- [ ] Test rate limiting (jeśli jest)

## 🔧 TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### Issue 1: Model Timeout

```javascript
// Dodaj timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch("/api/bielik-polish", {
    signal: controller.signal,
    // ... rest of config
  });
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request timeout - model overloaded");
  }
}
```

#### Issue 2: Polish Character Encoding

```javascript
// Ensure proper Polish character handling
const response = await fetch("/api/bielik-polish", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json; charset=utf-8",
  },
  body: JSON.stringify({ prompt: "Ćwiczenie ąęłńóśźż" }),
});
```

#### Issue 3: Voice Audio Format

```javascript
// Proper audio format for Whisper
const audioChunks = [];
mediaRecorder.ondataavailable = (event) => {
  audioChunks.push(event.data);
};

mediaRecorder.onstop = async () => {
  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  // Send to /api/voice/recognition
};
```

## 📊 PERFORMANCE METRICS

### Expected Response Times

- Bielik 11B: 2-4 seconds
- Qwen 14B: 3-5 seconds
- Whisper: 1-2 seconds
- Health Check: < 500ms

### Usage Limits (Cloudflare Free Tier)

- 100,000 requests/day
- No token limits
- Rate limit: 100 req/min per IP

## 🎯 NEXT DEVELOPMENT PRIORITIES

### Phase 1: Enhanced Voice Commands

1. Polish voice command vocabulary expansion
2. Context-aware voice processing
3. Multi-modal voice + text interactions

### Phase 2: Advanced Agent Orchestration

1. Agent capability matching
2. Task distribution optimization
3. Real-time collaboration between agents

### Phase 3: Business AI Functions

1. Polish-specific business logic
2. Cultural context enhancement
3. Industry-specific templates

**Status**: ✅ **PRODUCTION READY - MCP ASTRO INTEGRATION COMPLETE**
