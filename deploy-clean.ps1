# MyBonzo Production Deployment Script
# Wdraża zmiany z luc-de-zen-on do mybonzo.com

param(
    [switch]$Force,
    [switch]$SkipTests
)

Write-Host "🚀 MyBonzo Production Deployment Started" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# Sprawdź czy jesteśmy w development repo
$currentPath = Get-Location
if ($currentPath.Path -notlike "*luc-de-zen-on*") {
    Write-Host "❌ Musisz uruchamiać z katalogu luc-de-zen-on" -ForegroundColor Red
    exit 1
}

# 1. Build development version
Write-Host "🔨 Building development version..." -ForegroundColor Yellow
$buildResult = pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Development build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Development build successful" -ForegroundColor Green

# 2. Sprawdź czy production path istnieje  
$productionPath = "Q:\mybonzo\mybonzo-production"
if (-not (Test-Path $productionPath)) {
    Write-Host "📁 Creating production repository..." -ForegroundColor Yellow
    
    # Przejdź do katalogu parent
    cd Q:\mybonzo
    
    # Sklonuj development repo jako production
    Write-Host "📥 Cloning development repo..." -ForegroundColor Cyan
    git clone https://github.com/Bonzokoles/luc-de-zen-on.git mybonzo-production
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to clone repository!" -ForegroundColor Red
        exit 1
    }
    
    cd mybonzo-production
    
    # Usuń development remote
    git remote remove origin
    
    Write-Host "⚠️ UWAGA: Musisz utworzyć nowe repo 'mybonzo-production' na GitHub" -ForegroundColor Yellow
    Write-Host "   Następnie uruchom: git remote add origin https://github.com/Bonzokoles/mybonzo-production.git" -ForegroundColor Yellow
    
    # Wróć do development
    cd Q:\mybonzo\luc-de-zen-on
}

# 3. Synchronizuj pliki
Write-Host "`n🔄 Synchronizing files to production..." -ForegroundColor Yellow

# Lista plików do wykluczenia
$excludePatterns = @(
    ".git*",
    "node_modules*",
    ".astro*", 
    "dist*",
    ".env*",
    "*.log*",
    "coverage*",
    ".vscode*",
    "*.backup*"
)

# Kopiuj wszystkie pliki oprócz wykluczonych
Write-Host "📂 Copying files..." -ForegroundColor Cyan

# Użyj robocopy dla efektywnej synchronizacji
$robocopyArgs = @(
    "Q:\mybonzo\luc-de-zen-on",
    "Q:\mybonzo\mybonzo-production", 
    "/MIR",  # Mirror directory
    "/XD", ".git", "node_modules", ".astro", "dist", "coverage", ".vscode",  # Exclude directories
    "/XF", "*.log", "*.backup", ".env*",  # Exclude files
    "/NP",   # No progress
    "/NFL",  # No file list
    "/NDL"   # No directory list
)

& robocopy @robocopyArgs | Out-Null

if ($LASTEXITCODE -gt 7) {
    Write-Host "❌ File synchronization failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Files synchronized successfully" -ForegroundColor Green

# 4. Przejdź do production i zbuduj
Write-Host "`n🔨 Building production version..." -ForegroundColor Yellow
cd Q:\mybonzo\mybonzo-production

# Zainstaluj dependencies w production
Write-Host "📦 Installing production dependencies..." -ForegroundColor Cyan
pnpm install --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production dependencies installation failed!" -ForegroundColor Red
    cd Q:\mybonzo\luc-de-zen-on
    exit 1
}

# Build production
Write-Host "⚡ Building for production..." -ForegroundColor Cyan  
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production build failed!" -ForegroundColor Red
    cd Q:\mybonzo\luc-de-zen-on
    exit 1
}

Write-Host "✅ Production build successful" -ForegroundColor Green

# 5. Commit i push (jeśli remote skonfigurowane)
Write-Host "`n📤 Committing changes..." -ForegroundColor Yellow

git add -A
$commitMessage = "🚀 Production deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

# Sprawdź czy remote istnieje
$remoteCheck = git remote -v 2>$null
if ($remoteCheck) {
    Write-Host "🌐 Pushing to production repository..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed to production!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Push failed - możliwe że remote nie jest skonfigurowany" -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠️ Brak remote origin - skonfiguruj najpierw GitHub repo" -ForegroundColor Yellow  
    Write-Host "   git remote add origin https://github.com/Bonzokoles/mybonzo-production.git" -ForegroundColor Cyan
}

# 6. Finalizacja
cd Q:\mybonzo\luc-de-zen-on

Write-Host "`n🎉 DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Development build: SUCCESS" -ForegroundColor Green
Write-Host "✅ File sync: SUCCESS" -ForegroundColor Green  
Write-Host "✅ Production build: SUCCESS" -ForegroundColor Green
Write-Host "📁 Production location: Q:\mybonzo\mybonzo-production" -ForegroundColor Cyan
Write-Host "`n🔗 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Skonfiguruj GitHub repo dla production" -ForegroundColor White
Write-Host "   2. Skonfiguruj Cloudflare Pages dla mybonzo.com" -ForegroundColor White
Write-Host "   3. Dodaj environment variables w Cloudflare" -ForegroundColor White

Write-Host "`n🚀 Ready for mybonzo.com deployment!" -ForegroundColor Green