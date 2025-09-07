# POLACZEK_T Chat AI Assistant System

Kompleksowy system asystenta AI oparty na Cloudflare Workers z integracją bazy wiedzy i wsparciem dla wielu dostawców modeli AI.

## 🚀 Funkcjonalności

- **💬 Chat w czasie rzeczywistym** - Interaktywny widget czatu na wszystkich stronach
- **📚 Baza wiedzy** - Cloudflare KV do przechowywania odpowiedzi i cache'owania
- **🤖 Wiele modeli AI** - Obsługa OpenAI, Hugging Face, Anthropic
- **🌐 Wsparcie językowe** - Optymalizacja dla języka polskiego
- **⚡ Cloudflare Workers** - Niskie opóźnienia, globalna dystrybucja
- **🔒 Bezpieczeństwo** - CORS, walidacja danych, obsługa błędów

## 🛠️ Architektura

```
Frontend (Astro/Svelte) → Cloudflare Worker → AI API Providers
                               ↓
                        Cloudflare KV (Knowledge Base)
```

## 📦 Instalacja i konfiguracja

### Wymagania wstępne
- Node.js 16+
- Konto Cloudflare
- Wrangler CLI (`npm install -g wrangler`)

### 1. Konfiguracja Wranglera

```bash
# Logowanie do Cloudflare
npx wrangler login

# Utworzenie KV namespace
npx wrangler kv namespace create polaczek-knowledge-base
```

### 2. Aktualizacja konfiguracji

Zaktualizuj `wrangler-polaczek.toml` z prawidłowym ID namespace KV:

```toml
[[kv_namespaces]]
binding = "KNOWLEDGE_BASE"
id = "your-actual-kv-namespace-id"  # ← Zastąp tym
preview_id = "preview-polaczek-knowledge"
```

### 3. Konfiguracja sekretów API

```bash
# OpenAI
npx wrangler secret put OPENAI_API_KEY --config wrangler-polaczek.toml

# Hugging Face
npx wrangler secret put HUGGINGFACE_API_KEY --config wrangler-polaczek.toml

# Anthropic
npx wrangler secret put ANTHROPIC_API_KEY --config wrangler-polaczek.toml
```

### 4. Deploy workera

```bash
# Ręczny deploy
npx wrangler deploy --config wrangler-polaczek.toml

# Lub użyj skryptu deploy
python deploy-polaczek-worker.py
```

## 🎯 Użycie

### Endpointy API

#### Chat (`POST /api/chat`)
```json
{
  "prompt": "Jak działa system?",
  "sessionId": "user-123"
}
```

Response:
```json
{
  "answer": "System działa przez Cloudflare Workers...",
  "source": "knowledge_base|ai_model",
  "sessionId": "user-123"
}
```

#### Status systemu (`GET /api/status`)
```json
{
  "status": "ready",
  "agent": "POLACZEK_T Chat Assistant",
  "knowledge_base_entries": 42,
  "capabilities": ["chat", "knowledge_base", "ai_integration", "caching"]
}
```

#### Zarządzanie bazą wiedzy (`POST /api/knowledge`)
```json
{
  "question": "Co to jest POLACZEK?",
  "answer": "POLACZEK to system agentów AI..."
}
```

#### Wyszukiwanie w bazie (`GET /api/knowledge/search?q=polaczek`)
```json
{
  "query": "polaczek",
  "results": [...],
  "total": 3
}
```

### Integracja z frontendem

Dodaj komponent ChatWidget do swojej aplikacji Astro:

```astro
---
import ChatWidget from '../components/ChatWidget.svelte';
---

<main>
  <!-- Twoja zawartość -->
  <ChatWidget client:load />
</main>
```

Zaktualizuj URL worker w komponencie `ChatWidget.svelte`:
```javascript
const response = await fetch('https://polaczek-chat-assistant.YOUR_WORKER.workers.dev/api/chat', {
  // ...
});
```

## 🔧 Konfiguracja zaawansowana

### Dostawcy modeli AI

Zmienna środowiskowa `AI_MODEL_PROVIDER` kontroluje wybór dostawcy:
- `openai` (domyślny) - GPT-3.5/4 przez OpenAI API
- `huggingface` - Modele przez Hugging Face Inference API
- `anthropic` - Claude przez Anthropic API

### Customowe prompty systemowe

Możesz modyfikować prompty systemowe w funkcjach `call*API` w `src/workers/polaczek-websocket.js`.

### Rozszerzanie bazy wiedzy

System automatycznie uczy się z interakcji użytkowników. Możesz też ręcznie dodawać wpisy przez API `/api/knowledge`.

## 🧪 Testowanie

### Testowanie lokalne

```bash
# Development mode
npx wrangler dev --config wrangler-polaczek.toml

# Test endpointów
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"help"}'
```

### Testowanie produkcyjne

```bash
# Health check
curl https://polaczek-chat-assistant.YOUR_WORKER.workers.dev/health

# Test chat
curl -X POST https://polaczek-chat-assistant.YOUR_WORKER.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"status systemu"}'
```

## 📊 Monitoring

Worker loguje wszystkie istotne zdarzenia do konsoli Cloudflare. Monitoruj:

- Liczbę wpisów w bazie wiedzy
- Statystyki użycia API
- Błędy i wyjątki
- Czas odpowiedzi

## 🚨 Rozwiązywanie problemów

### Common Issues

1. **Brak kluczy API** - Worker używa mock responses
2. **CORS errors** - Sprawdź konfigurację nagłówków
3. **KV namespace nie istnieje** - Utwórz namespace przez Wrangler
4. **Limit rate limiting** - Dostosuj limity w konfiguracji Cloudflare

### Debugowanie

```bash
# Logi workersa
npx wrangler tail --config wrangler-polaczek.toml

# Stan KV
npx wrangler kv key list --binding KNOWLEDGE_BASE --config wrangler-polaczek.toml
```

## 🔮 Roadmap

- [ ] Integracja z Bielik AI (polski model)
- [ ] Wsparcie dla plików i dokumentów
- [ ] Zaawansowane wyszukiwanie semantyczne
- [ ] Dashboard administracyjny
- [ ] Integracja z Notion/Confluence
- [ ] Wsparcie wielojęzyczne
- [ ] Analytics i reporting

## 📞 Wsparcie

Problemy i pytania:
1. Sprawdź logi Workers przez `wrangler tail`
2. Sprawdź konfigurację KV namespaces
3. Zweryfikuj klucze API w sekretach
4. Sprawdź CORS configuration

## 📜 Licencja

MIT License - szczegóły w pliku LICENSE.

---

**Uwaga**: Przed wdrożeniem produkcyjnym:
1. Przetestuj wszystkie integracje API
2. Skonfiguruj proper rate limiting
3. Ustaw monitoring i alerty
4. Przeprowadź testy obciążeniowe
5. Zabezpiecz endpointy autoryzacją
