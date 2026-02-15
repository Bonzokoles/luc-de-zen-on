# MCP System - Model Context Protocol - Dokumentacja

## 🔗 Najnowsze Repozytorium MCP

Projekt został zaktualizowany o najnowsze standardy **Model Context Protocol (MCP)** z oficjalnego repozytorium:
- **GitHub**: https://github.com/modelcontextprotocol/modelcontextprotocol
- **Dokumentacja**: https://modelcontextprotocol.io/
- **Wersja**: 2025-06-18 (najnowsza specyfikacja)

## 🚀 Co zostało zaimplementowane

### 1. **Zarządzanie Połączeniem (Connection Management)**

Nowa klasa `MCPConnectionManager` zapewnia:

#### ✅ Utrzymanie Połączenia (Keep-Alive)
- **Heartbeat**: Automatyczne sprawdzanie stanu połączenia co 30 sekund
- **Connection Timeout**: Wykrywanie utraty połączenia po 60 sekundach
- **Auto-reconnect**: Automatyczne ponowne łączenie z wykładniczym backoff

#### ✅ Monitorowanie Połączenia
- Status połączenia w czasie rzeczywistym
- Zliczanie prób reconnect
- Eventy dla wszystkich zmian stanu (connected, disconnected, heartbeat, error)

#### ✅ Resilience (Odporność)
- Maksymalnie 10 prób reconnect
- Wykładniczy backoff między próbami
- Graceful shutdown z czyszczeniem zasobów

### 2. **System Bezpieczeństwa (Safety System)**

Nowa klasa `MCPSafetyValidator` chroni przed szkodliwymi operacjami:

#### ✅ Walidacja Promptów
- Limit długości promptu (10,000 znaków)
- Wykrywanie potencjalnie niebezpiecznych wzorców
- Sprawdzanie wrażliwych słów kluczowych (password, secret, api_key)

#### ✅ Walidacja Skills
- Lista dozwolonych skills (whitelist)
- Blokowanie niezweryfikowanych funkcji
- Sugestie podobnych dozwolonych skills

#### ✅ Filtrowanie Treści
- Wykrywanie i usuwanie:
  - Hardcoded credentials (API keys, passwords, tokens)
  - Kod JavaScript/XSS patterns
  - SQL injection patterns
  - Command injection patterns
- Redakcja niebezpiecznych fragmentów: `[REDACTED]`

#### ✅ System Prompts
Gotowe system prompts dla różnych kontekstów:

1. **BASE_SAFETY** - Podstawowe zasady bezpieczeństwa
2. **BUSINESS_SAFETY** - Bezpieczeństwo w kontekście biznesowym
3. **CODE_SAFETY** - Bezpieczeństwo przy generowaniu kodu
4. **DATA_SAFETY** - Ochrona danych i prywatności

### 3. **Dozwolone Skills (Safe Skills)**

System definiuje bezpieczne kategorie skills:

#### Content Skills
- `text-generation` - Generowanie tekstu
- `summarization` - Podsumowywanie
- `translation` - Tłumaczenie
- `paraphrasing` - Parafraza
- `grammar-check` - Sprawdzanie gramatyki

#### Business Skills
- `email-writing` - Pisanie emaili
- `document-generation` - Generowanie dokumentów
- `data-analysis` - Analiza danych
- `report-generation` - Raporty
- `task-management` - Zarządzanie zadaniami

#### Technical Skills
- `code-review` - Przegląd kodu
- `documentation` - Dokumentacja
- `debugging-assistance` - Pomoc w debugowaniu
- `api-integration` - Integracje API
- `testing` - Testowanie

#### Creative Skills
- `brainstorming` - Burza mózgów
- `ideation` - Generowanie pomysłów
- `content-planning` - Planowanie treści
- `social-media` - Social media

## 📡 API Endpoints

### `/api/mcp-server`

Główny endpoint MCP z pełnym bezpieczeństwem.

#### GET - Informacje o serwerze
```bash
GET /api/mcp-server
```

Odpowiedź:
```json
{
  "name": "MCP Server Enhanced",
  "version": "2.0.0",
  "protocol": "Model Context Protocol 2025",
  "features": {
    "connectionManagement": true,
    "safetyValidation": true,
    "systemPrompts": true,
    "skillValidation": true,
    "heartbeat": true
  },
  "status": "operational"
}
```

#### POST - Wykonanie akcji

##### 1. Wykonanie Skill (execute_skill)
```bash
POST /api/mcp-server
Content-Type: application/json

{
  "action": "execute_skill",
  "skillId": "text-generation",
  "prompt": "Napisz profesjonalny email",
  "context": "business",
  "parameters": {
    "tone": "professional",
    "length": "medium"
  }
}
```

##### 2. Walidacja Skill (validate_skill)
```bash
POST /api/mcp-server
{
  "action": "validate_skill",
  "skillId": "email-writing"
}
```

##### 3. Pobranie System Prompt (get_system_prompt)
```bash
POST /api/mcp-server
{
  "action": "get_system_prompt",
  "context": "business"
}
```

Dostępne konteksty:
- `general` - Ogólny
- `business` - Biznesowy
- `code` - Kod/programowanie
- `data` - Dane/prywatność

##### 4. Health Check
```bash
POST /api/mcp-server
{
  "action": "health_check"
}
```

## 💻 Użycie w Kodzie

### 1. Connection Manager

```typescript
import MCPConnectionManager from '@/lib/mcp-connection-manager';

// Inicjalizacja
const manager = new MCPConnectionManager({
  serverUrl: 'http://localhost:4321/api/mcp-server',
  heartbeatInterval: 30000,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  enableSafetyChecks: true,
});

// Nasłuchiwanie eventów
manager.on('connected', (status) => {
  console.log('Połączono!', status);
});

manager.on('disconnected', (status) => {
  console.log('Rozłączono!', status);
});

manager.on('heartbeat', (data) => {
  console.log('Heartbeat:', data.timestamp);
});

manager.on('reconnecting', (data) => {
  console.log(`Próba reconnect ${data.attempt}/${data.maxAttempts}`);
});

// Połączenie
await manager.connect();

// Sprawdzenie statusu
const status = manager.getStatus();
console.log('Connected:', manager.isConnected());

// Rozłączenie
manager.disconnect();

// Cleanup
manager.destroy();
```

### 2. Safety Validator

```typescript
import MCPSafetyValidator from '@/lib/mcp-safety';

const validator = new MCPSafetyValidator({
  enablePromptValidation: true,
  enableSkillValidation: true,
  enableContentFiltering: true,
});

// Walidacja promptu
const promptCheck = validator.validatePrompt('Mój prompt');
if (!promptCheck.safe) {
  console.error('Naruszenia:', promptCheck.violations);
}

// Walidacja skill
const skillCheck = validator.validateSkill('text-generation');
if (skillCheck.safe) {
  console.log('Skill jest bezpieczny');
}

// Walidacja całego requesta
const requestCheck = validator.validateMCPRequest({
  prompt: 'Napisz email',
  skillId: 'email-writing',
  content: 'Zawartość do sprawdzenia',
});

// Pobranie system prompt
const systemPrompt = validator.getSystemPrompt('business');
```

### 3. Użycie w React Component

```tsx
import { useEffect, useState } from 'react';
import MCPConnectionManager from '@/lib/mcp-connection-manager';

function MCPStatus() {
  const [manager] = useState(() => new MCPConnectionManager({
    serverUrl: '/api/mcp-server',
  }));
  
  const [status, setStatus] = useState(manager.getStatus());

  useEffect(() => {
    // Connect on mount
    manager.connect().catch(console.error);

    // Listen to status changes
    const updateStatus = () => setStatus(manager.getStatus());
    
    manager.on('connected', updateStatus);
    manager.on('disconnected', updateStatus);
    manager.on('heartbeat', updateStatus);

    // Cleanup on unmount
    return () => {
      manager.destroy();
    };
  }, [manager]);

  return (
    <div>
      <h3>MCP Status</h3>
      <p>Connected: {status.connected ? '✅' : '❌'}</p>
      <p>Server: {status.serverUrl}</p>
      <p>Last Heartbeat: {new Date(status.lastHeartbeat).toLocaleString()}</p>
      {status.error && <p>Error: {status.error}</p>}
    </div>
  );
}
```

## 🛡️ Bezpieczeństwo

### Zabezpieczenia Wbudowane:

1. **Blokowanie Credentials**
   - API keys, passwords, secrets, tokens
   - Automatyczna redakcja w odpowiedziach

2. **Ochrona przed Injection**
   - XSS (Cross-Site Scripting)
   - SQL Injection
   - Command Injection

3. **Walidacja Skills**
   - Tylko zweryfikowane skills mogą być używane
   - Automatyczne sugestie bezpiecznych alternatyw

4. **Ochrona Prywatności**
   - Wykrywanie PII (email, telefon)
   - Ostrzeżenia o potencjalnych wyciekach danych

5. **System Prompts**
   - Automatyczne dodawanie zasad bezpieczeństwa
   - Kontekstowe wytyczne (biznes, kod, dane)

## 🔧 Konfiguracja

### Environment Variables

```env
# MCP Server Configuration
MCP_SERVER_URL=http://localhost:4321/api/mcp-server
MCP_HEARTBEAT_INTERVAL=30000
MCP_RECONNECT_INTERVAL=5000
MCP_MAX_RECONNECT_ATTEMPTS=10

# Safety Configuration
MCP_ENABLE_SAFETY_CHECKS=true
MCP_MAX_PROMPT_LENGTH=10000
MCP_ENABLE_CONTENT_FILTERING=true
```

## 📊 Monitorowanie

### Eventy Connection Manager

- `connected` - Połączono z serwerem
- `disconnected` - Rozłączono
- `heartbeat` - Heartbeat wysłany
- `reconnecting` - Próba reconnect
- `error` - Błąd połączenia
- `max_reconnect_attempts` - Osiągnięto max prób

### Metryki

```typescript
const status = manager.getStatus();
console.log({
  connected: status.connected,
  lastHeartbeat: status.lastHeartbeat,
  reconnectAttempts: status.reconnectAttempts,
  serverUrl: status.serverUrl,
  error: status.error,
});
```

## 🚨 Obsługa Błędów

### Przykłady Błędów

1. **Safety Validation Failed**
```json
{
  "success": false,
  "error": "Safety validation failed",
  "violations": ["Prompt contains potentially unsafe pattern"],
  "warnings": ["Prompt contains sensitive keyword: password"]
}
```

2. **Skill Not Allowed**
```json
{
  "success": false,
  "error": "Skill validation failed",
  "violations": ["Skill 'unknown-skill' is not in the allowed skills list"],
  "warnings": ["Similar allowed skills: text-generation, code-generation"]
}
```

3. **Connection Failed**
```typescript
manager.on('error', (status) => {
  console.error('Connection error:', status.error);
  // Handle error (show notification, retry, etc.)
});
```

## 📝 Best Practices

1. **Zawsze używaj Connection Manager** dla produkcyjnych aplikacji
2. **Włącz wszystkie safety checks** domyślnie
3. **Monitoruj eventy** i reaguj na błędy
4. **Używaj odpowiednich system prompts** dla kontekstu
5. **Waliduj skills** przed użyciem
6. **Nie hardcode'uj credentials** w promptach
7. **Loguj safety warnings** dla audytu

## 🔄 Aktualizacje

System jest zgodny z najnowszą specyfikacją MCP (2025-06-18) i będzie aktualizowany wraz z rozwojem protokołu.

### Planowane Funkcje:
- [ ] WebSocket transport dla real-time komunikacji
- [ ] Server-Sent Events (SSE) dla streamingu
- [ ] Advanced metrics i analytics
- [ ] Multi-server failover
- [ ] Distributed tracing
- [ ] Custom skill plugins

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Zweryfikuj konfigurację API endpoint
3. Sprawdź status połączenia przez health check
4. Zobacz dokumentację safety violations

---

**Implementacja zgodna z:**
- Model Context Protocol 2025 Specification
- Anthropic Claude Safety Guidelines
- OpenAI Safety Best Practices
- OWASP Security Standards
