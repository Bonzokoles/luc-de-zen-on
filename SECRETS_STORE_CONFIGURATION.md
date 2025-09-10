# Secrets Store Configuration Guide
# Secure management of API keys using Cloudflare Secrets Store

## Setup Instructions

### 1. Create Secrets Store (if not exists)
```powershell
# Create store (run only once)
wrangler secrets-store store create "ai-providers-store" --remote
```

### 2. Add Secrets to Store
```powershell
# AI Provider API Keys
wrangler secrets-store secret create <STORE_ID> --name OPENAI_API_KEY --scopes workers --remote
wrangler secrets-store secret create <STORE_ID> --name ANTHROPIC_API_KEY --scopes workers --remote  
wrangler secrets-store secret create <STORE_ID> --name DEEPSEEK_API_KEY --scopes workers --remote
wrangler secrets-store secret create <STORE_ID> --name PERPLEXITY_API_KEY --scopes workers --remote
wrangler secrets-store secret create <STORE_ID> --name GOOGLE_AI_STUDIO_API_KEY --scopes workers --remote
wrangler secrets-store secret create <STORE_ID> --name HUGGINGFACE_API_KEY --scopes workers --remote
wrangler secrets-store secret create <STORE_ID> --name ELEVENLABS_API_KEY --scopes workers --remote

# AI Gateway Configuration
wrangler secrets-store secret create <STORE_ID> --name AI_GATEWAY_ACCOUNT_ID --scopes workers --remote
wrangler secrets-store secret create <STORE_ID> --name AI_GATEWAY_ID --scopes workers --remote

# Cloudflare Token for WebSocket Authentication
wrangler secrets-store secret create <STORE_ID> --name CLOUDFLARE_API_KEY --scopes workers --remote
```

### 3. Enhanced Wrangler Configuration

Add to each wrangler-*.toml file:

```toml
# Secrets Store bindings for secure API key management
[[secrets_store_secrets]]
binding = "OPENAI_API_KEY"
store_id = "<YOUR_STORE_ID>"
secret_name = "OPENAI_API_KEY"

[[secrets_store_secrets]]
binding = "AI_GATEWAY_ACCOUNT_ID"
store_id = "<YOUR_STORE_ID>"
secret_name = "AI_GATEWAY_ACCOUNT_ID"

[[secrets_store_secrets]]
binding = "AI_GATEWAY_ID"
store_id = "<YOUR_STORE_ID>"
secret_name = "AI_GATEWAY_ID"

# Repeat for each provider...
```

### 4. Worker Code Usage

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Access secrets asynchronously
    const openaiKey = await env.OPENAI_API_KEY.get();
    const gatewayAccountId = await env.AI_GATEWAY_ACCOUNT_ID.get();
    const gatewayId = await env.AI_GATEWAY_ID.get();
    
    // Use in API calls
    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${gatewayAccountId}/${gatewayId}/openai/chat/completions`;
    
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    return response;
  },
};
```

## Benefits of Secrets Store

### 🔒 Enhanced Security
- Centralized secret management across all workers
- Encrypted storage in all Cloudflare data centers
- Account-level permissions and role-based access
- No secrets in source code or configuration files

### 🔄 Operational Efficiency  
- Update secrets once, apply to all workers
- Granular scoping (workers, pages, etc.)
- Audit trail for secret access and changes
- No worker redeployment needed for secret updates

### 🛡️ Compliance & Governance
- Super Administrator and Secrets Store Admin roles
- Deployment permissions separate from secret management
- Integration with Cloudflare's security infrastructure
- Production vs development environment separation

## Migration from Environment Variables

### Before (wrangler secrets)
```powershell
# Old method - per-worker secrets
wrangler secret put OPENAI_API_KEY --config wrangler-openai.toml
wrangler secret put OPENAI_API_KEY --config wrangler-anthropic.toml
# Repeat for each worker...
```

### After (secrets store)
```powershell
# New method - centralized secrets
wrangler secrets-store secret create <STORE_ID> --name OPENAI_API_KEY --scopes workers --remote
# All workers automatically have access via bindings
```

## Best Practices

1. **Use Descriptive Names**: `PROVIDER_MODEL_API_KEY` vs `API_KEY`
2. **Scope Appropriately**: Use `workers` scope for Worker access
3. **Separate Environments**: Different stores for production/staging
4. **Regular Rotation**: Implement key rotation policies
5. **Audit Access**: Monitor secret usage and access patterns
6. **Minimal Permissions**: Grant least privilege access

## Commands Reference

```powershell
# List all stores
wrangler secrets-store store list

# List secrets in a store  
wrangler secrets-store secret list <STORE_ID>

# Get store details
wrangler secrets-store store get <STORE_ID>

# Delete a secret
wrangler secrets-store secret delete <STORE_ID> --name <SECRET_NAME>

# Update a secret
wrangler secrets-store secret create <STORE_ID> --name <SECRET_NAME> --scopes workers --remote
```
