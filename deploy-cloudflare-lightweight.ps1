# MyBonzo Cloudflare Deployment Script - Bez Google Cloud Libraries
# Autor: AI Assistant
# Data: $(Get-Date -Format "yyyy-MM-dd HH:mm")

Write-Host "🚀 MyBonzo Cloudflare Deployment (Lightweight) - Starting..." -ForegroundColor Cyan

# Backup oryginalne pliki
Write-Host "📦 Creating backup of original files..." -ForegroundColor Yellow
Copy-Item "package.json" "package.json.full-backup" -Force
Copy-Item "astro.config.mjs" "astro.config.mjs.full-backup" -Force

# Użyj lekkich konfiguracji
Write-Host "⚡ Switching to lightweight configuration..." -ForegroundColor Yellow
Copy-Item "package-cloudflare.json" "package.json" -Force
Copy-Item "astro.config.cloudflare.mjs" "astro.config.mjs" -Force

# Reinstall dependencies (tylko niezbędne)
Write-Host "📥 Installing lightweight dependencies..." -ForegroundColor Yellow
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
pnpm install --frozen-lockfile=false

# Build projektu
Write-Host "🔨 Building project with lightweight config..." -ForegroundColor Yellow
$buildResult = pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    # Restore originals
    Copy-Item "package.json.full-backup" "package.json" -Force
    Copy-Item "astro.config.mjs.full-backup" "astro.config.mjs" -Force
    exit 1
}

# Check bundle size
Write-Host "📊 Checking bundle size..." -ForegroundColor Yellow
$bundleSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$bundleSizeRounded = [math]::Round($bundleSize, 2)
Write-Host "Bundle size: $bundleSizeRounded MB" -ForegroundColor $(if ($bundleSize -lt 25) { "Green" } else { "Red" })

if ($bundleSize -gt 25) {
    Write-Host "❌ Bundle still too large for Cloudflare Pages (>25MB)" -ForegroundColor Red
    Write-Host "🔍 Largest files:" -ForegroundColor Yellow
    Get-ChildItem -Path "dist" -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10 Name, @{Name = "Size MB"; Expression = { [math]::Round($_.Length / 1MB, 2) } }
    
    # Restore originals but continue to show what we achieved
    Copy-Item "package.json.full-backup" "package.json" -Force
    Copy-Item "astro.config.mjs.full-backup" "astro.config.mjs" -Force
    Write-Host "⚠️  Configurations restored. Need further optimization." -ForegroundColor Yellow
    exit 1
}

# Deploy to Cloudflare Pages
Write-Host "🌐 Deploying to Cloudflare Pages..." -ForegroundColor Green
$deployResult = wrangler pages deploy dist --project-name="luc-de-zen-on"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    # Restore originals
    Copy-Item "package.json.full-backup" "package.json" -Force
    Copy-Item "astro.config.mjs.full-backup" "astro.config.mjs" -Force
    exit 1
}

# Restore original files
Write-Host "🔄 Restoring original configuration files..." -ForegroundColor Yellow
Copy-Item "package.json.full-backup" "package.json" -Force
Copy-Item "astro.config.mjs.full-backup" "astro.config.mjs" -Force

# Clean up backup files
Remove-Item "package.json.full-backup" -Force -ErrorAction SilentlyContinue
Remove-Item "astro.config.mjs.full-backup" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌍 Bundle size: $bundleSizeRounded MB (under 25MB limit)" -ForegroundColor Green
Write-Host "🔗 Your app should be available at: https://luc-de-zen-on.pages.dev" -ForegroundColor Cyan

# Test deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://luc-de-zen-on.pages.dev" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Deployment test successful!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Deployment test returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️  Could not test deployment immediately (may still be propagating)" -ForegroundColor Yellow
}

Write-Host "🎉 MyBonzo Cloudflare deployment completed!" -ForegroundColor Cyan