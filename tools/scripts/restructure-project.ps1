#!/usr/bin/env pwsh
# MYBONZO PROJECT RESTRUCTURE AUTOMATION
# Automatyczne przeniesienie do optymalnej struktury projektu
# Na bazie PROJECT_RESTRUCTURE_PLAN.md

param(
    [switch]$DryRun,
    [switch]$Force,
    [string]$BackupDir = "mybonzo_BACKUP_RESTRUCTURE_$(Get-Date -Format 'yyyy-MM-dd-HHmm')"
)

# =================================================================
# CONFIGURATION
# =================================================================

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PROJECT_ROOT = Split-Path -Parent $SCRIPT_DIR
$NEW_STRUCTURE = @{
    "apps"     = "Aplikacje główne"
    "packages" = "Współdzielone biblioteki" 
    "services" = "Serwisy backend"
    "docs"     = "Dokumentacja"
    "tools"    = "Narzędzia deweloperskie"
    "assets"   = "Zasoby statyczne"
    "backups"  = "Kopie zapasowe"
}

function Write-Status {
    param([string]$Message, [string]$Type = "INFO")
    
    $color = switch ($Type) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" } 
        "ERROR" { "Red" }
        "INFO" { "Cyan" }
        default { "White" }
    }
    
    $emoji = switch ($Type) {
        "SUCCESS" { "✅" }
        "WARNING" { "⚠️" }
        "ERROR" { "❌" }
        "INFO" { "ℹ️" }
        default { "📋" }
    }
    
    Write-Host "$emoji $Message" -ForegroundColor $color
}

# =================================================================
# VALIDATION & PREPARATION
# =================================================================

function Test-Prerequisites {
    Write-Status "Sprawdzanie wymagań wstępnych..." "INFO"
    
    # Sprawdź czy jesteśmy w głównym katalogu projektu
    if (-not (Test-Path "luc-de-zen-on")) {
        Write-Status "Błąd: Nie znaleziono katalogu 'luc-de-zen-on' - uruchom z głównego katalogu mybonzo" "ERROR"
        return $false
    }
    
    # Sprawdź czy nie ma aktywnych procesów
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses -and -not $Force) {
        Write-Status "Ostrzeżenie: Znaleziono aktywne procesy Node.js - zatrzymaj dev server przed restructurization" "WARNING"
        Write-Status "Użyj -Force aby kontynuować mimo to" "INFO"
        return $false
    }
    
    # Sprawdź wolne miejsce na dysku
    try {
        $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='$((Get-Location).Drive.Name)'" -ErrorAction SilentlyContinue
        if ($disk) {
            $freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 1)
            if ($freeSpaceGB -lt 2) {
                Write-Status "Błąd: Za mało miejsca na dysku ($freeSpaceGB GB) - potrzeba minimum 2GB" "ERROR"
                return $false
            }
        }
    }
    catch {
        Write-Status "Ostrzeżenie: Nie można sprawdzić miejsca na dysku" "WARNING"
    }
    
    Write-Status "Wymagania wstępne spełnione" "SUCCESS"
    return $true
}

function New-ProjectBackup {
    Write-Status "Tworzenie kopii zapasowej..." "INFO"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Utworzyłby backup w: $BackupDir" "INFO"
        return $true
    }
    
    try {
        # Utworz katalog backup
        if (-not (Test-Path $BackupDir)) {
            New-Item -ItemType Directory -Path $BackupDir | Out-Null
        }
        
        # Skopiuj ważne katalogi (pomijając node_modules, .git, dist)
        $importantDirs = @("luc-de-zen-on", "mybonzfronts", "nieuzy_tki", "DOCUMENTS_instruct_JE_CLOUD_flare")
        
        foreach ($dir in $importantDirs) {
            if (Test-Path $dir) {
                Write-Status "Kopiowanie $dir..." "INFO"
                robocopy $dir "$BackupDir\$dir" /E /XD node_modules .git dist .astro .vite /XF "*.log" /NFL /NDL /NP | Out-Null
            }
        }
        
        # Skopiuj ważne pliki z root
        $importantFiles = Get-ChildItem -File | Where-Object { 
            $_.Extension -in @('.md', '.json', '.html', '.txt') -and
            $_.Name -notmatch 'node_modules|\.log$'
        }
        
        foreach ($file in $importantFiles) {
            Copy-Item $file.FullName $BackupDir -Force
        }
        
        Write-Status "Backup utworzony: $BackupDir" "SUCCESS"
        return $true
        
    }
    catch {
        Write-Status "Błąd tworzenia backupu: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# =================================================================
# RESTRUCTURE OPERATIONS
# =================================================================

function New-DirectoryStructure {
    Write-Status "Tworzenie nowej struktury katalogów..." "INFO"
    
    foreach ($dir in $NEW_STRUCTURE.Keys) {
        if ($DryRun) {
            Write-Status "[DRY RUN] Utworzyłby katalog: $dir" "INFO"
        }
        else {
            try {
                if (-not (Test-Path $dir)) {
                    New-Item -ItemType Directory -Path $dir | Out-Null
                    Write-Status "Utworzono: $dir/ ($($NEW_STRUCTURE[$dir]))" "SUCCESS"
                }
                else {
                    Write-Status "Istnieje: $dir/" "INFO"
                }
            }
            catch {
                Write-Status "Błąd tworzenia $dir: $($_.Exception.Message)" "ERROR"
                return $false
            }
        }
    }
    
    # Utworz podkatalogi
    $subDirs = @(
        "apps/web",
        "apps/admin", 
        "packages/ui",
        "packages/utils",
        "packages/types",
        "packages/config",
        "services/workers",
        "services/api",
        "services/integrations",
        "docs/guides",
        "docs/api",
        "docs/deployment",
        "tools/scripts",
        "tools/tests",
        "tools/config",
        "assets/images",
        "assets/fonts", 
        "assets/media"
    )
    
    foreach ($subDir in $subDirs) {
        if ($DryRun) {
            Write-Status "[DRY RUN] Utworzyłby: $subDir" "INFO"
        }
        else {
            try {
                if (-not (Test-Path $subDir)) {
                    New-Item -ItemType Directory -Path $subDir -Force | Out-Null
                }
            }
            catch {
                Write-Status "Ostrzeżenie: Nie można utworzyć $subDir" "WARNING"
            }
        }
    }
    
    return $true
}

function Move-MainApplication {
    Write-Status "Przenoszenie głównej aplikacji (luc-de-zen-on → apps/web)..." "INFO"
    
    if (-not (Test-Path "luc-de-zen-on")) {
        Write-Status "Błąd: Katalog luc-de-zen-on nie istnieje" "ERROR"
        return $false
    }
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Przenosiłby luc-de-zen-on → apps/web" "INFO"
        return $true
    }
    
    try {
        if (Test-Path "apps/web") {
            Write-Status "Ostrzeżenie: apps/web już istnieje - pomijam" "WARNING"
            return $true
        }
        
        Move-Item "luc-de-zen-on" "apps/web"
        Write-Status "Przeniesiono luc-de-zen-on → apps/web" "SUCCESS"
        return $true
        
    }
    catch {
        Write-Status "Błąd przenoszenia głównej aplikacji: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Move-BackupDirectories {
    Write-Status "Konsolidacja katalogów backup..." "INFO"
    
    $backupDirs = @{
        "nieuzy_tki"   = "backups/archive/nieuzy_tki"
        "mybonzfronts" = "backups/archive/mybonzfronts"
    }
    
    # Sprawdź czy istnieje katalog RAPO_RT lub podobne
    $otherBackups = Get-ChildItem -Directory | Where-Object { 
        $_.Name -match "backup|BACKUP|_backup|\.backup|copy|kopia|RAPO_RT" -and
        $_.Name -notin @("backups")
    }
    
    foreach ($dir in $otherBackups) {
        $backupDirs[$dir.Name] = "backups/archive/$($dir.Name)"
    }
    
    foreach ($source in $backupDirs.Keys) {
        $destination = $backupDirs[$source]
        
        if (Test-Path $source) {
            if ($DryRun) {
                Write-Status "[DRY RUN] Przenosiłby $source → $destination" "INFO"
            }
            else {
                try {
                    $destDir = Split-Path $destination -Parent
                    if (-not (Test-Path $destDir)) {
                        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                    }
                    
                    if (-not (Test-Path $destination)) {
                        Move-Item $source $destination
                        Write-Status "Przeniesiono $source → $destination" "SUCCESS"
                    }
                    else {
                        Write-Status "Ostrzeżenie: $destination już istnieje - pomijam $source" "WARNING"
                    }
                }
                catch {
                    Write-Status "Błąd przenoszenia $source: $($_.Exception.Message)" "ERROR"
                }
            }
        }
    }
}

function Move-DocumentsAndAssets {
    Write-Status "Przenoszenie dokumentów i zasobów..." "INFO"
    
    # Dokumentacja
    $docMoves = @{
        "DOCUMENTS_instruct_JE_CLOUD_flare" = "docs/cloudflare-instructions"
        "MEGA_PRO_STATION_PLAN.md"          = "docs/mega-pro-station-plan.md"
        "PROJECT_RESTRUCTURE_PLAN.md"       = "docs/project-restructure-plan.md"
    }
    
    foreach ($source in $docMoves.Keys) {
        $destination = $docMoves[$source]
        
        if (Test-Path $source) {
            if ($DryRun) {
                Write-Status "[DRY RUN] Przenosiłby $source → $destination" "INFO"
            }
            else {
                try {
                    $destDir = if ($destination.Contains('/')) { Split-Path $destination -Parent } else { "docs" }
                    if (-not (Test-Path $destDir)) {
                        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                    }
                    
                    if (-not (Test-Path $destination)) {
                        Move-Item $source $destination
                        Write-Status "Przeniesiono $source → $destination" "SUCCESS"
                    }
                    else {
                        Write-Status "Ostrzeżenie: $destination już istnieje - pomijam" "WARNING"
                    }
                }
                catch {
                    Write-Status "Błąd przenoszenia $source: $($_.Exception.Message)" "ERROR"
                }
            }
        }
    }
    
    # HTML files (admin panel itp)
    $htmlFiles = Get-ChildItem -File -Filter "*.html" | Where-Object { 
        $_.Name -match "admin|panel|control" 
    }
    
    foreach ($file in $htmlFiles) {
        $destination = "apps/admin/$($file.Name)"
        
        if ($DryRun) {
            Write-Status "[DRY RUN] Przenosiłby $($file.Name) → $destination" "INFO"
        }
        else {
            try {
                if (-not (Test-Path "apps/admin")) {
                    New-Item -ItemType Directory -Path "apps/admin" -Force | Out-Null
                }
                
                if (-not (Test-Path $destination)) {
                    Move-Item $file.FullName $destination
                    Write-Status "Przeniesiono $($file.Name) → $destination" "SUCCESS"
                }
            }
            catch {
                Write-Status "Błąd przenoszenia $($file.Name): $($_.Exception.Message)" "ERROR"
            }
        }
    }
}

function Update-ConfigurationFiles {
    Write-Status "Aktualizacja plików konfiguracyjnych..." "INFO"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Zaktualizowałby pliki konfiguracyjne" "INFO"
        return $true
    }
    
    # Workspace package.json
    $workspacePackage = @{
        name            = "mybonzo-workspace"
        version         = "1.0.0"
        description     = "MyBonzo - AI Platform Workspace"
        workspaces      = @("apps/*", "packages/*", "services/*")
        scripts         = @{
            dev            = "npm run dev --workspace=apps/web"
            build          = "npm run build --workspace=apps/web" 
            test           = "npm run test --workspaces"
            lint           = "npm run lint --workspaces"
            "fix-deps"     = "pwsh tools/scripts/fix-dependencies.ps1"
            "system-check" = "pwsh tools/scripts/system-check.ps1"
        }
        devDependencies = @{
            "@types/node" = "^20.0.0"
            typescript    = "^5.0.0"
        }
    }
    
    try {
        $workspacePackage | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
        Write-Status "Utworzono workspace package.json" "SUCCESS"
    }
    catch {
        Write-Status "Błąd tworzenia package.json: $($_.Exception.Message)" "ERROR"
    }
    
    # .env.example
    $envExample = @"
# MyBonzo Configuration
# Skopiuj to do .env i uzupełnij wartości

# Core Configuration
NODE_ENV=development
PUBLIC_WORKER_BASE_URL=http://localhost:8080

# AI APIs  
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Cloudflare
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Database & Storage
R2_ACCESS_KEY_ID=your_r2_access_key_here
R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
R2_BUCKET_NAME=mybonzo-storage

# Optional APIs
GOOGLE_AI_API_KEY=your_google_ai_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
"@
    
    try {
        $envExample | Out-File -FilePath ".env.example" -Encoding UTF8
        Write-Status "Utworzono .env.example" "SUCCESS"
    }
    catch {
        Write-Status "Błąd tworzenia .env.example: $($_.Exception.Message)" "ERROR"
    }
    
    return $true
}

function Update-PathsInCode {
    Write-Status "Aktualizowanie ścieżek w kodzie..." "INFO"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Zaktualizowałby ścieżki w plikach konfiguracyjnych" "INFO"
        return $true
    }
    
    # Aktualizuj astro.config.mjs w apps/web
    $astroConfigPath = "apps/web/astro.config.mjs"
    if (Test-Path $astroConfigPath) {
        try {
            $content = Get-Content $astroConfigPath -Raw
            # Tu można dodać specyficzne aktualizacje ścieżek jeśli potrzeba
            Write-Status "Sprawdzono astro.config.mjs" "SUCCESS"
        }
        catch {
            Write-Status "Ostrzeżenie: Nie można zaktualizować astro.config.mjs" "WARNING"
        }
    }
    
    return $true
}

# =================================================================
# VALIDATION & TESTING
# =================================================================

function Test-NewStructure {
    Write-Status "Walidacja nowej struktury..." "INFO"
    
    $expectedDirs = @("apps", "packages", "services", "docs", "tools", "assets", "backups")
    $missing = $expectedDirs | Where-Object { -not (Test-Path $_) }
    
    if ($missing.Count -eq 0) {
        Write-Status "Struktura katalogów prawidłowa" "SUCCESS"
    }
    else {
        Write-Status "Brakujące katalogi: $($missing -join ', ')" "ERROR"
        return $false
    }
    
    # Sprawdź czy główna aplikacja została przeniesiona
    if (Test-Path "apps/web/package.json") {
        Write-Status "Główna aplikacja poprawnie przeniesiona" "SUCCESS"
    }
    else {
        Write-Status "Błąd: Główna aplikacja nie została przeniesiona prawidłowo" "ERROR"
        return $false
    }
    
    return $true
}

function Test-BuildAfterRestructure {
    Write-Status "Test kompilacji po restructuryzacji..." "INFO"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] Przetestowałby kompilację" "INFO"
        return $true
    }
    
    try {
        Push-Location "apps/web"
        
        # Test czy package.json istnieje
        if (-not (Test-Path "package.json")) {
            Write-Status "Błąd: Brak package.json w apps/web" "ERROR"
            return $false
        }
        
        # Sprawdź czy są zainstalowane zależności
        if (-not (Test-Path "node_modules")) {
            Write-Status "Instalowanie zależności..." "INFO"
            if (Get-Command "pnpm" -ErrorAction SilentlyContinue) {
                & pnpm install
            }
            else {
                & npm install  
            }
        }
        
        # Test build
        Write-Status "Testowanie kompilacji..." "INFO"
        if (Get-Command "pnpm" -ErrorAction SilentlyContinue) {
            & pnpm build
        }
        else {
            & npm run build
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Kompilacja zakończona sukcesem" "SUCCESS"
            return $true
        }
        else {
            Write-Status "Błąd kompilacji - może wymagać dodatkowych poprawek" "WARNING"
            return $false
        }
        
    }
    catch {
        Write-Status "Błąd testu kompilacji: $($_.Exception.Message)" "ERROR"
        return $false
    }
    finally {
        Pop-Location
    }
}

# =================================================================
# MAIN EXECUTION
# =================================================================

function Invoke-ProjectRestructure {
    Write-Host "🚀 MyBonzo - Automatyczna Restructuryzacja Projektu" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Blue
    Write-Host "Rozpoczęcie: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    
    if ($DryRun) {
        Write-Host "🔍 TRYB DRY RUN - tylko symulacja bez rzeczywistych zmian" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    # Validation
    if (-not (Test-Prerequisites)) {
        Write-Status "Wymagania wstępne nie są spełnione - przerwano" "ERROR"
        return $false
    }
    
    # Backup
    if (-not (New-ProjectBackup)) {
        Write-Status "Nie można utworzyć backupu - przerwano" "ERROR"
        return $false
    }
    
    # Restructure operations
    $operations = @(
        { New-DirectoryStructure },
        { Move-MainApplication },
        { Move-BackupDirectories }, 
        { Move-DocumentsAndAssets },
        { Update-ConfigurationFiles },
        { Update-PathsInCode }
    )
    
    foreach ($operation in $operations) {
        if (-not (& $operation)) {
            Write-Status "Błąd podczas operacji - przerwano restructuryzację" "ERROR"
            return $false
        }
    }
    
    # Validation
    if (-not $DryRun) {
        if (-not (Test-NewStructure)) {
            Write-Status "Walidacja nowej struktury nie powiodła się" "ERROR"
            return $false
        }
        
        # Optional build test
        if (-not (Test-BuildAfterRestructure)) {
            Write-Status "Test kompilacji nie powiódł się - może wymagać ręcznych poprawek" "WARNING"
        }
    }
    
    Write-Host ""
    Write-Status "Restructuryzacja projektu zakończona!" "SUCCESS"
    Write-Host "=============================================" -ForegroundColor Blue
    
    if (-not $DryRun) {
        Write-Status "Następne kroki:" "INFO"
        Write-Status "• Sprawdź czy wszystko działa: cd apps/web && pnpm dev" "INFO"
        Write-Status "• Zaktualizuj ścieżki w IDE/edytorze" "INFO"  
        Write-Status "• Przetestuj wszystkie funkcje aplikacji" "INFO"
        Write-Status "• Backup znajduje się w: $BackupDir" "INFO"
    }
    
    return $true
}

# Execute main function
Invoke-ProjectRestructure