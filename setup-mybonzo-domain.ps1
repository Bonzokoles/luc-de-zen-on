# Setup MyBonzo.com Custom Domain Configuration
# Automatyczne konfigurowanie custom domains dla www.mybonzo.com

param(
    [switch]$Deploy = $false,
    [switch]$TestOnly = $false
)

Write-Host "🌐 MYBONZO.COM DOMAIN SETUP" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Sprawdz czy Wrangler jest zainstalowany
if (-not (Get-Command "wrangler" -ErrorAction SilentlyContinue)) {
    Write-Host "Wrangler CLI nie znaleziony" -ForegroundColor Red
    Write-Host "Instalowanie Wrangler..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Sprawdz login do Cloudflare
Write-Host "Sprawdzanie autoryzacji Cloudflare..." -ForegroundColor Yellow
$whoami = wrangler whoami 2>&1
if ($whoami -like "*not authenticated*") {
    Write-Host "Nie jestes zalogowany do Cloudflare" -ForegroundColor Red
    Write-Host "Uruchamianie logowania..." -ForegroundColor Yellow
    wrangler login
}

# Sprawdz aktualny status Pages project
Write-Host "Sprawdzanie statusu projektu..." -ForegroundColor Yellow
$pagesInfo = wrangler pages project list 2>&1

if ($TestOnly) {
    Write-Host "TEST MODE - Sprawdzanie konfiguracji..." -ForegroundColor Green
    
    # Test konfiguracji wrangler.toml
    if (Test-Path "wrangler.toml") {
        Write-Host "wrangler.toml znaleziony" -ForegroundColor Green
        
        # Sprawdz zawartosc custom domains
        $tomlContent = Get-Content "wrangler.toml" -Raw
        if ($tomlContent -match 'pattern = "www\.mybonzo\.com"') {
            Write-Host "Konfiguracja www.mybonzo.com znaleziona" -ForegroundColor Green
        } else {
            Write-Host "Brak konfiguracji www.mybonzo.com" -ForegroundColor Red
        }
        
        if ($tomlContent -match 'pattern = "mybonzo\.com"') {
            Write-Host "Konfiguracja mybonzo.com znaleziona" -ForegroundColor Green
        } else {
            Write-Host "Brak konfiguracji mybonzo.com" -ForegroundColor Red
        }
    } else {
        Write-Host "wrangler.toml nie znaleziony" -ForegroundColor Red
        return
    }
    
    # Test czy dist/ istnieje
    if (Test-Path "dist") {
        Write-Host "Folder dist/ gotowy do deployment" -ForegroundColor Green
    } else {
        Write-Host "Brak folderu dist/ - uruchom build najpierw" -ForegroundColor Red
    }
    
    return
}

# Sprawdz czy dist folder istnieje
if (-not (Test-Path "dist")) {
    Write-Host "Budowanie projektu..." -ForegroundColor Yellow
    pnpm run build
    
    if (-not (Test-Path "dist")) {
        Write-Host "Build failed - brak folderu dist/" -ForegroundColor Red
        return
    }
}

if ($Deploy) {
    Write-Host "Deploying z custom domains..." -ForegroundColor Green
    
    # Deploy uzywajac wrangler.toml z custom domains
    Write-Host "Wdrazanie do Cloudflare Pages..." -ForegroundColor Yellow
    $deployResult = wrangler pages deploy dist --project-name=luc-de-zen-on 2>&1
    
    Write-Host $deployResult
    
    if ($deployResult -like "*success*" -or $deployResult -like "*deployment complete*") {
        Write-Host "Deploy udany!" -ForegroundColor Green
        
        Write-Host "" -ForegroundColor White
        Write-Host "NASTEPNE KROKI W CLOUDFLARE DASHBOARD:" -ForegroundColor Cyan
        Write-Host "1. Idz do Workers and Pages - luc-de-zen-on" -ForegroundColor White
        Write-Host "2. Custom domains - Set up a custom domain" -ForegroundColor White
        Write-Host "3. Dodaj: www.mybonzo.com" -ForegroundColor White
        Write-Host "4. Dodaj: mybonzo.com" -ForegroundColor White
        Write-Host "5. Cloudflare automatycznie utworzy CNAME records" -ForegroundColor White
        Write-Host "" -ForegroundColor White
        Write-Host "Dashboard URL: https://dash.cloudflare.com/?to=/:account/workers-and-pages" -ForegroundColor Yellow
        
    } else {
        Write-Host "Deploy failed" -ForegroundColor Red
        Write-Host $deployResult -ForegroundColor Red
    }
} else {
    Write-Host "Konfiguracja gotowa. Opcje:" -ForegroundColor Green
    Write-Host "  -Deploy     : Wdrozenie z custom domains" -ForegroundColor White
    Write-Host "  -TestOnly   : Test konfiguracji" -ForegroundColor White
    Write-Host "" -ForegroundColor White
    Write-Host "Przyklad: .\setup-mybonzo-domain.ps1 -Deploy" -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "MANUAL CLOUDFLARE STEPS (jesli potrzebne):" -ForegroundColor Cyan
Write-Host "1. Dashboard - Workers and Pages - luc-de-zen-on" -ForegroundColor White
Write-Host "2. Custom domains - Add domain" -ForegroundColor White
Write-Host "3. www.mybonzo.com i mybonzo.com" -ForegroundColor White
Write-Host "4. DNS - Create CNAME: www -> luc-de-zen-on.pages.dev" -ForegroundColor White
Write-Host "5. DNS - Create CNAME: @ -> luc-de-zen-on.pages.dev" -ForegroundColor White