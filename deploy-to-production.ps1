# Deploy to Production Script
# Synchronizuje zmiany z development repo do production repo i wdraża

param(
    [string]$CommitMessage = "Production sync from development",
    [switch]$Force = $false
)

Write-Host "🚀 PRODUCTION DEPLOYMENT SCRIPT" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Sprawdź czy jesteśmy w development repo
$currentRepo = git remote get-url origin
if ($currentRepo -notlike "*luc-de-zen-on*") {
    Write-Host "❌ Error: Musisz być w development repo (luc-de-zen-on)" -ForegroundColor Red
    exit 1
}

# Sprawdź status git
$gitStatus = git status --porcelain
if ($gitStatus -and -not $Force) {
    Write-Host "❌ Error: Masz niezatwierdzone zmiany. Zatwierdź je lub użyj -Force" -ForegroundColor Red
    Write-Host "Niezatwierdzone pliki:" -ForegroundColor Yellow
    git status --short
    exit 1
}

Write-Host "✅ Development repo jest czysty" -ForegroundColor Green

# Build i test development
Write-Host "🔨 Building development version..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Development build successful" -ForegroundColor Green

# Sprawdź czy production repo istnieje
$productionPath = "Q:\mybonzo\mybonzo-production"
if (-not (Test-Path $productionPath)) {
    Write-Host "📁 Creating production repository..." -ForegroundColor Yellow
    
    # Przejdź do katalogu mybonzo
    cd Q:\mybonzo
    
    # Sklonuj development repo jako production
    git clone https://github.com/Bonzokoles/luc-de-zen-on.git mybonzo-production
    cd mybonzo-production
    
    # Ustaw nowy remote dla production
    git remote remove origin
    # Tu dodamy nowy remote gdy utworzymy production repo na GitHub
    Write-Host "⚠️ Uwaga: Musisz utworzyć nowe repo 'mybonzo-production' na GitHub" -ForegroundColor Yellow
    Write-Host "   i uruchomić: git remote add origin https://github.com/Bonzokoles/mybonzo-production.git" -ForegroundColor Yellow
    
    cd Q:\mybonzo\luc-de-zen-on
}

# Synchronizuj pliki do production
Write-Host "🔄 Synchronizing to production repo..." -ForegroundColor Yellow

# Lista plików do synchronizacji (pomiń node_modules, .git, itp.)
$excludePatterns = @(
    ".git",
    "node_modules",
    ".astro",
    "dist",
    ".env*",
    "*.log",
    ".DS_Store",
    "Thumbs.db"
)

# Kopiuj pliki z wykluczeniami
robocopy . $productionPath /MIR /XD $excludePatterns /XF "*.log" "*.tmp" /R:1 /W:1 /NP

Write-Host "✅ Files synchronized to production" -ForegroundColor Green

# Przejdź do production repo i commit
cd $productionPath

Write-Host "📝 Committing changes to production repo..." -ForegroundColor Yellow
git add .
git commit -m $CommitMessage
git push

Write-Host "🚀 Deploying to production Cloudflare Pages..." -ForegroundColor Yellow

# Build production
pnpm install
pnpm build

# Deploy do production project
wrangler pages deploy dist --project-name="my-bonzo-zen-com" --branch="main" --commit-dirty=true

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 PRODUCTION DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "✅ Production site: https://mybonzo.com" -ForegroundColor Green
    Write-Host "✅ Development site: https://luc-de-zen-on.pages.dev" -ForegroundColor Green
}
else {
    Write-Host "❌ PRODUCTION DEPLOYMENT FAILED!" -ForegroundColor Red
    exit 1
}

# Wróć do development repo
cd Q:\mybonzo\luc-de-zen-on

Write-Host "📋 DEPLOYMENT SUMMARY:" -ForegroundColor Cyan
Write-Host "- Development: luc-de-zen-on (testowanie)" -ForegroundColor White
Write-Host "- Production: mybonzo-production (stabilny)" -ForegroundColor White
Write-Host "- Deploy only when everything works perfectly!" -ForegroundColor Yellow