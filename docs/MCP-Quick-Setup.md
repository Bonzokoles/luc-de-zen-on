# Quick Setup Guide - OpenAI + MCP Integration

## 🚀 Setup w 5 krokach

### 1. Test MCP Servers Status

```bash
GET /api/openai-mcp-integration?action=status
```

### 2. Register OpenAI Agent

```bash
POST /api/openai-mcp-integration
{
  "action": "register_agent",
  "agent_id": "my-assistant-001",
  "mcp_servers": ["browser", "docker", "github", "knowledge"],
  "webhook_url": "https://api.openai.com/v1/your-webhook"
}
```

### 3. Add Functions to OpenAI Agent

Kopiuj funkcje z response i dodaj do Agent Builder w OpenAI.

### 4. Configure Webhook

W OpenAI Agent Builder ustaw webhook URL:

```
https://yourdomain.com/api/openai-mcp-integration?action=webhook_receive
```

### 5. Test Integration

Wyślij message do agenta: _"Navigate to google.com and take screenshot"_

## 🔗 Available MCP Buttons

Po lewej stronie strony głównej znajdziesz 4 przyciski MCP:

- **🌐 Browser** - Web automation
- **🐳 Docker** - Container management
- **⚡ GitHub** - Code repository management
- **🧠 Knowledge** - Knowledge graph operations

Każdy przycisk otwiera odpowiednią sekcję konfiguracji MCP.

## 📋 Function Examples

### Browser Automation:

```javascript
browser_navigate("https://example.com");
browser_screenshot();
```

### Docker Operations:

```javascript
docker_list_containers();
docker_create_container("nginx", { ports: { 80: "8080" } });
```

### GitHub Management:

```javascript
github_create_repo("my-new-project");
github_create_file("my-repo", "README.md", "# My Project");
```

### Knowledge Graph:

```javascript
knowledge_search("AI technologies");
knowledge_add_entity("GPT-4", "AI Model", { vendor: "OpenAI" });
```

## 🎯 Next Steps

1. Kliknij przycisk MCP żeby skonfigurować serwery
2. Skopiuj API endpoint do OpenAI Agent Builder
3. Dodaj webhook URL
4. Przetestuj z prostą komendą

**API Endpoint**: `/api/openai-mcp-integration`
