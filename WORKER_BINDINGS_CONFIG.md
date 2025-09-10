# Worker Bindings Configuration for MyBonzo
# Custom domains and worker routing

# Main chat worker
mybonzo-main-chat.lissonkarol-msa.workers.dev -> www.mybonzo.com/api/main-chat
# Enhanced AI worker  
mybonzo-enhanced-ai.lissonkarol-msa.workers.dev -> www.mybonzo.com/api/enhanced-ai
# DeepSeek search worker
deepseek-search-worker.lissonkarol-msa.workers.dev -> www.mybonzo.com/api/deepseek-search
# Bielik worker
bielik-worker.lissonkarol-msa.workers.dev -> www.mybonzo.com/api/bielik-chat

# Worker URLs:
- https://mybonzo-main-chat.lissonkarol-msa.workers.dev
- https://mybonzo-enhanced-ai.lissonkarol-msa.workers.dev  
- https://deepseek-search-worker.lissonkarol-msa.workers.dev
- https://bielik-worker.lissonkarol-msa.workers.dev

# Integration Steps:
1. Add service bindings to wrangler.toml
2. Create API proxies in src/pages/api/
3. Update deployment configuration
4. Test worker integration
