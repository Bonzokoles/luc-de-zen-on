# MyBonzo Cloudflare Ultra-Lightweight Deployment
# Tymczasowo usuwa największe biblioteki na czas buildu
# Autor: AI Assistant  
# Data: $(Get-Date -Format "yyyy-MM-dd HH:mm")

Write-Host "🎯 MyBonzo Ultra-Lightweight Cloudflare Deployment - Starting..." -ForegroundColor Cyan

# === BACKUP PHASE ===
Write-Host "📦 Creating comprehensive backup..." -ForegroundColor Yellow
if (Test-Path "deployment-backup") {
    Remove-Item "deployment-backup" -Recurse -Force
}
New-Item -ItemType Directory -Path "deployment-backup" -Force | Out-Null

Copy-Item "package.json" "deployment-backup\package.json.original" -Force
Copy-Item "astro.config.mjs" "deployment-backup\astro.config.mjs.original" -Force
Copy-Item "pnpm-lock.yaml" "deployment-backup\pnpm-lock.yaml.original" -Force -ErrorAction SilentlyContinue

# === DETERMINE LIGHTEST CONFIG ===
Write-Host "⚡ Creating ultra-light package.json..." -ForegroundColor Yellow

# Get only essential dependencies from original
$originalPackage = Get-Content "package.json" | ConvertFrom-Json

# Create minimal dependencies set  
$lightDeps = @{
    "@astrojs/cloudflare" = $originalPackage.dependencies."@astrojs/cloudflare"
    "@astrojs/react"      = $originalPackage.dependencies."@astrojs/react"
    "@astrojs/rss"        = $originalPackage.dependencies."@astrojs/rss"  
    "@astrojs/svelte"     = $originalPackage.dependencies."@astrojs/svelte"
    "@astrojs/tailwind"   = $originalPackage.dependencies."@astrojs/tailwind"
    "@heroicons/react"    = "^2.0.18"
    "@types/react"        = $originalPackage.dependencies."@types/react"
    "@types/react-dom"    = $originalPackage.dependencies."@types/react-dom"
    "astro"               = $originalPackage.dependencies."astro"
    "clsx"                = $originalPackage.dependencies."clsx"
    "react"               = $originalPackage.dependencies."react"
    "react-dom"           = $originalPackage.dependencies."react-dom"
    "svelte"              = $originalPackage.dependencies."svelte"
    "tailwindcss"         = $originalPackage.dependencies."tailwindcss"
    "tailwind-merge"      = "^3.3.1"
    "typescript"          = $originalPackage.dependencies."typescript"
    "wrangler"            = $originalPackage.dependencies."wrangler"
    "nanostores"          = $originalPackage.dependencies."nanostores"
}

$lightPackage = @{
    name            = "mybonzo-ultra-light"
    type            = "module"  
    version         = "1.0.0"
    scripts         = $originalPackage.scripts
    dependencies    = $lightDeps
    devDependencies = @{
        "@types/node" = $originalPackage.devDependencies."@types/node"
    }
}

$lightPackage | ConvertTo-Json -Depth 10 | Set-Content "package.json"

# === EXTERNAL CONFIG ===
Write-Host "🚫 Creating external dependencies config..." -ForegroundColor Yellow

# Copy the pre-made cloudflare config
Copy-Item "astro.config.cloudflare.mjs" "astro.config.mjs" -Force

# === CLEAN INSTALL ===
Write-Host "🧹 Clean install with light dependencies..." -ForegroundColor Yellow
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue

try {
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        throw "pnpm install failed"
    }
}
catch {
    Write-Host "❌ Install failed: $_" -ForegroundColor Red
    Write-Host "🔄 Restoring original files..." -ForegroundColor Yellow
    Copy-Item "deployment-backup\package.json.original" "package.json" -Force
    Copy-Item "deployment-backup\astro.config.mjs.original" "astro.config.mjs" -Force
    Copy-Item "deployment-backup\pnpm-lock.yaml.original" "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
    exit 1
}

# === BUILD ===
Write-Host "🔨 Building ultra-light version..." -ForegroundColor Yellow
try {
    pnpm exec astro build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
}
catch {
    Write-Host "❌ Build failed: $_" -ForegroundColor Red
    Write-Host "🔄 Restoring original files..." -ForegroundColor Yellow
    Copy-Item "deployment-backup\package.json.original" "package.json" -Force
    Copy-Item "deployment-backup\astro.config.mjs.original" "astro.config.mjs" -Force
    Copy-Item "deployment-backup\pnpm-lock.yaml.original" "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
    exit 1
}

# === SIZE CHECK ===
Write-Host "📊 Checking bundle size..." -ForegroundColor Yellow
$bundleSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$bundleSizeRounded = [math]::Round($bundleSize, 2)
Write-Host "Bundle size: $bundleSizeRounded MB" -ForegroundColor $(if ($bundleSize -lt 25) { "Green" } else { "Red" })

if ($bundleSize -gt 25) {
    Write-Host "❌ Bundle still too large for Cloudflare Pages (>25MB)" -ForegroundColor Red
    Write-Host "🔍 Top 15 largest files:" -ForegroundColor Yellow
    Get-ChildItem -Path "dist" -Recurse -File | Sort-Object Length -Descending | Select-Object -First 15 Name, @{Name = "Size MB"; Expression = { [math]::Round($_.Length / 1MB, 2) } }
    
    Write-Host "🔄 Restoring original files..." -ForegroundColor Yellow
    Copy-Item "deployment-backup\package.json.original" "package.json" -Force
    Copy-Item "deployment-backup\astro.config.mjs.original" "astro.config.mjs" -Force
    Copy-Item "deployment-backup\pnpm-lock.yaml.original" "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
    exit 1
}

# === DEPLOY ===
Write-Host "🌐 Deploying to Cloudflare Pages..." -ForegroundColor Green
try {
    wrangler pages deploy dist --project-name="luc-de-zen-on"
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed"
    }
}
catch {
    Write-Host "❌ Deployment failed: $_" -ForegroundColor Red
    Write-Host "🔄 Restoring original files..." -ForegroundColor Yellow
    Copy-Item "deployment-backup\package.json.original" "package.json" -Force
    Copy-Item "deployment-backup\astro.config.mjs.original" "astro.config.mjs" -Force
    Copy-Item "deployment-backup\pnpm-lock.yaml.original" "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
    exit 1
}

# === RESTORE ===
Write-Host "🔄 Restoring original configuration..." -ForegroundColor Yellow
Copy-Item "deployment-backup\package.json.original" "package.json" -Force
Copy-Item "deployment-backup\astro.config.mjs.original" "astro.config.mjs" -Force
Copy-Item "deployment-backup\pnpm-lock.yaml.original" "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue

# Clean up
Remove-Item "deployment-backup" -Recurse -Force

# === SUCCESS ===
Write-Host "✅ Ultra-lightweight deployment completed successfully!" -ForegroundColor Green
Write-Host "🌍 Final bundle size: $bundleSizeRounded MB (under 25MB limit)" -ForegroundColor Green
Write-Host "🔗 Your app should be available at: https://luc-de-zen-on.pages.dev" -ForegroundColor Cyan
Write-Host "⚠️  Note: Some features may be limited in production due to excluded heavy libraries" -ForegroundColor Yellow

# === TEST ===
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://luc-de-zen-on.pages.dev" -TimeoutSec 15
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

Write-Host "🎉 MyBonzo ultra-lightweight Cloudflare deployment completed!" -ForegroundColor Cyan
Write-Host "📝 Original dependencies restored for local development" -ForegroundColor Green