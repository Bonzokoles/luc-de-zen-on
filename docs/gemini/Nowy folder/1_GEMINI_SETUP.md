# 🚀 MyBonzo Gemini CLI Setup

## Installation

1. **Install Gemini CLI** (if not installed):

```powershell
# Install via npm/pip/cargo based on your preference
npm install -g @google/generative-ai-cli
# OR
pip install google-generativeai-cli
```

2. **Setup API Key**:

```powershell
gemini config set api-key YOUR_GEMINI_API_KEY
```

3. **Load MyBonzo Helpers**:

```powershell
# In your MyBonzo project directory
. .\gemini-aliases.ps1
```

## Quick Usage

### Fix Errors

```powershell
gm-fix "Property 'AI' does not exist on type 'Env'"
gm-fix "Build error in tavi.ts line 45"
```

### Create APIs

```powershell
gm-api weather "OpenWeatherMap integration with current weather"
gm-api translate "DeepL API integration for text translation"
```

### Build Components

```powershell
gm-comp news svelte "RSS feed reader with filtering"
gm-comp chat react "Real-time chat with WebSocket"
```

### Optimize Performance

```powershell
gm-opt "Tavily API response times"
gm-opt "bundle size reduction"
```

### Debug Issues

```powershell
gm-debug "API endpoint returning 500 error"
gm-debug "TypeScript compilation failing"
```

### Generate Polish Content

```powershell
gm-pl ui "button labels and form validation messages"
gm-pl docs "API documentation for weather endpoint"
```

### Deployment & Config

```powershell
gm-deploy "new weather API endpoint"
gm-config "add new KV namespace for caching"
```

### Code Review

```powershell
gm-review "src/pages/api/tavi.ts"
gm-review "functions/_middleware.ts"
```

## Examples in Action

```powershell
# Fix TypeScript error
PS> gm-fix "Property 'TAVILY_API_KEY' does not exist"
# Returns: Detailed fix with Cloudflare env access pattern

# Create new API
PS> gm-api news "HackerNews API integration"
# Returns: Complete API implementation with error handling

# Polish UI text
PS> gm-pl interface "weather widget labels"
# Returns: Native Polish translations for weather UI

# Performance optimization
PS> gm-opt "reduce API response latency"
# Returns: Optimization strategies with code examples
```

## Advanced Usage

### Direct Prompts

```powershell
# Use gm for custom prompts with MyBonzo context
gm "Create a real-time stock price tracker using WebSocket"
gm "Implement caching strategy for Tavily API responses"
```

### File Review

```powershell
# Review specific files
gm-review src/components/agents/agent-weather/component.svelte
```

### Configuration Updates

```powershell
# Update project config
gm-config "add Redis binding for session storage"
gm-config "update smart placement to EU region"
```

## Tips

- Always run from MyBonzo project root directory
- Specific error messages get better responses
- Include file paths when relevant
- Request Polish content when needed
- Mention specific frameworks (Svelte/React)

## Troubleshooting

### Gemini CLI not found

```powershell
# Check installation
where gemini
# Reinstall if needed
npm install -g @google/generative-ai-cli
```

### API Key issues

```powershell
# Check current config
gemini config list
# Reset API key
gemini config set api-key YOUR_NEW_KEY
```

### Aliases not working

```powershell
# Reload aliases
. .\gemini-aliases.ps1
# Check if loaded
gm help
```
