# Agent Template

This is a basic template for creating new agents in the modular system.

## Usage

1. Copy this template: `cp -r src/components/agents/_templates/basic-agent src/agents/agent-XX-your-name`2. Update `config.ts` with your agent details
3. Implement your logic in `api.ts`
4. Create your UI in `component.svelte`
5. Update `index.astro` with your agent page
## Files Structure

- `index.astro` - Main page for the agent
- `api.ts` - API endpoint implementation  
- `component.svelte` - UI component
- `config.ts` - Agent configuration
- `README.md` - Agent documentation
