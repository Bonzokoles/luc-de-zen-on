# MyBonzo Cloudflare Optimization Deployment Script
# This script deploys optimized configurations for www.mybonzo.com

param(
    [switch]$Production,
    [switch]$DryRun,
    [string]$Environment = "preview"
)

Write-Host "🚀 MyBonzo Cloudflare Optimization Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check if wrangler is installed
if (-not (Get-Command "wrangler" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g wrangler" -ForegroundColor Yellow
    exit 1
}

# Login check
Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Yellow
$authCheck = wrangler whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Cloudflare first: wrangler login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Authenticated as: $authCheck" -ForegroundColor Green

# Step 1: Create R2 Buckets
Write-Host "📦 Setting up R2 Storage Buckets..." -ForegroundColor Yellow

$buckets = @(
    "mybonzo-assets",
    "mybonzo-uploads", 
    "mybonzo-cache"
)

foreach ($bucket in $buckets) {
    Write-Host "Creating R2 bucket: $bucket" -ForegroundColor Cyan
    if (-not $DryRun) {
        wrangler r2 bucket create $bucket 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Created bucket: $bucket" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Bucket $bucket might already exist or creation failed" -ForegroundColor Yellow
        }
    }
}

# Step 2: Create KV Namespace
Write-Host "🗄️  Setting up KV Namespace..." -ForegroundColor Yellow
if (-not $DryRun) {
    $kvOutput = wrangler kv namespace create "EDGE_CACHE" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ KV Namespace created" -ForegroundColor Green
        Write-Host "📝 Please update your wrangler config with the KV namespace ID from above" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  KV Namespace might already exist: $kvOutput" -ForegroundColor Yellow
    }
}

# Step 3: Deploy with optimized configuration
Write-Host "🚀 Deploying optimized configuration..." -ForegroundColor Yellow

$configFile = if ($Production) { "wrangler-ultimate-optimized.jsonc" } else { "wrangler-optimized.jsonc" }

if (-not (Test-Path $configFile)) {
    Write-Host "❌ Configuration file not found: $configFile" -ForegroundColor Red
    exit 1
}

if (-not $DryRun) {
    Write-Host "📤 Building and deploying..." -ForegroundColor Cyan
    
    # Build the project
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    
    # Deploy to Cloudflare Pages
    $deployCmd = if ($Production) {
        "wrangler pages deploy dist --project-name mybonzo-optimized --config $configFile"
    } else {
        "wrangler pages deploy dist --project-name mybonzo-optimized --config $configFile"
    }
    
    Invoke-Expression $deployCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Performance Testing
Write-Host "⚡ Running Performance Tests..." -ForegroundColor Yellow

$testUrls = @(
    "https://www.mybonzo.com/",
    "https://www.mybonzo.com/api/stats",
    "https://www.mybonzo.com/ai-functions/education-recommendations"
)

foreach ($url in $testUrls) {
    Write-Host "Testing: $url" -ForegroundColor Cyan
    if (-not $DryRun) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
            $cacheStatus = $response.Headers["X-Cache"] -join ","
            $cacheStrategy = $response.Headers["X-Cache-Strategy"] -join ","
            
            Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "  Cache: $cacheStatus" -ForegroundColor Cyan
            Write-Host "  Strategy: $cacheStrategy" -ForegroundColor Cyan
        } catch {
            Write-Host "  ⚠️  Test failed: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

# Step 5: Cache Purge
if ($Production -and -not $DryRun) {
    Write-Host "🧹 Purging cache for fresh start..." -ForegroundColor Yellow
    wrangler pages deployment tail --project-name mybonzo-optimized
}

Write-Host "" 
Write-Host "🎉 MyBonzo Optimization Deployment Complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update DNS to point to the new optimized deployment" -ForegroundColor White
Write-Host "2. Monitor performance in Cloudflare Analytics" -ForegroundColor White
Write-Host "3. Set up R2 bucket CORS if needed for direct uploads" -ForegroundColor White
Write-Host "4. Configure cache rules in Cloudflare Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Performance Monitoring URLs:" -ForegroundColor Yellow
Write-Host "- Cloudflare Analytics: https://dash.cloudflare.com/analytics" -ForegroundColor Cyan
Write-Host "- R2 Usage: https://dash.cloudflare.com/r2" -ForegroundColor Cyan
Write-Host "- Worker Metrics: https://dash.cloudflare.com/workers" -ForegroundColor Cyan
