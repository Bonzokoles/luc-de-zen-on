# MyBonzo Cloudflare Ultra-Lightweight Deployment - Simplified
# Autor: AI Assistant

Write-Host "🎯 MyBonzo Ultra-Lightweight Deployment - Starting..." -ForegroundColor Cyan

# Backup original files
Write-Host "📦 Creating backup..." -ForegroundColor Yellow
Copy-Item "package.json" "package.original.json" -Force
Copy-Item "astro.config.mjs" "astro.config.original.mjs" -Force

# Use pre-made configurations
Write-Host "⚡ Switching to lightweight config..." -ForegroundColor Yellow
Copy-Item "package-minimal.json" "package.json" -Force
Copy-Item "astro.config.cloudflare.mjs" "astro.config.mjs" -Force

# Clean install
Write-Host "🧹 Clean install..." -ForegroundColor Yellow
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue

# Install minimal deps + additional needed ones
pnpm install
pnpm install tailwind-merge nanostores

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Install failed!" -ForegroundColor Red
    Copy-Item "package.original.json" "package.json" -Force
    Copy-Item "astro.config.original.mjs" "astro.config.mjs" -Force
    exit 1
}

# Build
Write-Host "🔨 Building..." -ForegroundColor Yellow
pnpm exec astro build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Copy-Item "package.original.json" "package.json" -Force
    Copy-Item "astro.config.original.mjs" "astro.config.mjs" -Force
    exit 1
}

# Check size
Write-Host "📊 Checking size..." -ForegroundColor Yellow
$bundleSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$bundleSizeRounded = [math]::Round($bundleSize, 2)
Write-Host "Bundle size: $bundleSizeRounded MB" -ForegroundColor $(if ($bundleSize -lt 25) { "Green" } else { "Red" })

if ($bundleSize -gt 25) {
    Write-Host "❌ Still too large!" -ForegroundColor Red
    Copy-Item "package.original.json" "package.json" -Force
    Copy-Item "astro.config.original.mjs" "astro.config.mjs" -Force
    exit 1
}

# Deploy
Write-Host "🌐 Deploying..." -ForegroundColor Green
wrangler pages deploy dist --project-name="luc-de-zen-on"

# Restore
Write-Host "🔄 Restoring..." -ForegroundColor Yellow
Copy-Item "package.original.json" "package.json" -Force
Copy-Item "astro.config.original.mjs" "astro.config.mjs" -Force

Write-Host "Deployment completed! Bundle: $bundleSizeRounded MB" -ForegroundColor Green