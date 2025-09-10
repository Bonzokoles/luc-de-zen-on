# Deploy All AI Workers Script
# This script deploys all created AI workers to Cloudflare

Write-Host "🚀 Deploying All AI Workers to Cloudflare..." -ForegroundColor Green

# Array of worker configurations
$workers = @(
    "wrangler-openai.toml",
    "wrangler-anthropic.toml", 
    "wrangler-deepseek.toml",
    "wrangler-perplexity.toml",
    "wrangler-google-ai-studio.toml",
    "wrangler-huggingface.toml",
    "wrangler-elevenlabs.toml",
    "wrangler-multi-ai.toml",
    "wrangler-websocket-realtime.toml",
    "wrangler-multi-ai-agent.toml"
)

# Check if wrangler is installed
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler CLI not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
}

# Check if user is authenticated
Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Yellow
$authCheck = wrangler whoami 2>&1
if ($authCheck -match "Not logged in") {
    Write-Host "❌ Not authenticated with Cloudflare. Please run: wrangler login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Authenticated as: $authCheck" -ForegroundColor Green

# Deploy each worker
foreach ($config in $workers) {
    if (Test-Path $config) {
        $workerName = $config -replace "wrangler-", "" -replace ".toml", ""
        Write-Host "🔄 Deploying $workerName worker..." -ForegroundColor Cyan
        
        try {
            wrangler deploy --config $config --env production
            Write-Host "✅ Successfully deployed $workerName" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Failed to deploy $workerName" -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
        }
        
        Write-Host "---" -ForegroundColor Gray
    }
    else {
        Write-Host "⚠️  Configuration file $config not found" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Set API keys for each worker via Cloudflare dashboard or wrangler secrets"
Write-Host "2. Configure AI_GATEWAY_ACCOUNT_ID and AI_GATEWAY_ID"
Write-Host "3. Test each worker endpoint"
Write-Host ""
Write-Host "💡 Example secret commands:" -ForegroundColor Cyan
Write-Host "wrangler secret put OPENAI_API_KEY --config wrangler-openai.toml --env production"
Write-Host "wrangler secret put ANTHROPIC_API_KEY --config wrangler-anthropic.toml --env production"
Write-Host "# ... etc for each provider"
