#!/usr/bin/env pwsh
# MYBONZO SYSTEM CHECK SCRIPT
# Kompleksowa diagnostyka systemu MyBonzo na bazie SYSTEM_ANALYSIS.md
# Sprawdza środowisko, zależności, konfigurację i connectivity

param(
    [switch]$Verbose,
    [switch]$Export,
    [string]$OutputFile = "system-check-report-$(Get-Date -Format 'yyyy-MM-dd-HHmm').md"
)

# =================================================================
# CONFIGURATION & HELPERS
# =================================================================

$PROJECT_NAME = "MyBonzo"
$REQUIRED_PORTS = @(3006, 4321, 8080)
$CRITICAL_FILES = @("package.json", "astro.config.mjs", "wrangler.jsonc")
$REPORT_SECTIONS = @()

function Write-Section {
    param([string]$Title, [string]$Content, [string]$Status = "INFO")
    
    $statusEmoji = switch ($Status) {
        "OK" { "✅" }
        "WARNING" { "⚠️" }
        "ERROR" { "❌" }
        "INFO" { "ℹ️" }
        default { "📋" }
    }
    
    $section = @"
## $statusEmoji $Title

$Content

"@
    
    $script:REPORT_SECTIONS += $section
    
    Write-Host "$statusEmoji $Title" -ForegroundColor $(
        switch ($Status) {
            "OK" { "Green" }
            "WARNING" { "Yellow" }
            "ERROR" { "Red" }
            default { "Cyan" }
        }
    )
    
    if ($Verbose) {
        Write-Host $Content -ForegroundColor Gray
    }
}

# =================================================================
# ENVIRONMENT CHECK
# =================================================================

function Test-Environment {
    Write-Host "📦 Sprawdzanie środowiska..." -ForegroundColor Yellow
    
    $envResults = @()
    
    # Node.js version
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
            if ($majorVersion -ge 18) {
                $envResults += "✅ Node.js: $nodeVersion (OK)"
            }
            else {
                $envResults += "⚠️ Node.js: $nodeVersion (zalecane >=18)"
            }
        }
    }
    catch {
        $envResults += "❌ Node.js: Nie zainstalowany lub niedostępny"
    }
    
    # Package managers
    $packageManagers = @("pnpm", "npm", "yarn")
    foreach ($pm in $packageManagers) {
        try {
            $version = & $pm --version 2>$null
            if ($version) {
                $envResults += "✅ $($pm.ToUpper()): $version"
            }
        }
        catch {
            $envResults += "❌ $($pm.ToUpper()): Nie zainstalowany"
        }
    }
    
    # Python (dla Stable Diffusion)
    try {
        $pythonVersion = python --version 2>$null
        if ($pythonVersion) {
            $envResults += "✅ Python: $pythonVersion"
        }
    }
    catch {
        $envResults += "⚠️ Python: Nie znaleziono (może być potrzebny dla Stable Diffusion)"
    }
    
    # Git
    try {
        $gitVersion = git --version 2>$null
        if ($gitVersion) {
            $envResults += "✅ Git: $gitVersion"
        }
    }
    catch {
        $envResults += "⚠️ Git: Nie znaleziono"
    }
    
    $status = if ($envResults -match "❌") { "ERROR" } elseif ($envResults -match "⚠️") { "WARNING" } else { "OK" }
    Write-Section "Środowisko deweloperskie" ($envResults -join "`n") $status
}

# =================================================================
# PROJECT STRUCTURE CHECK
# =================================================================

function Test-ProjectStructure {
    Write-Host "📁 Sprawdzanie struktury projektu..." -ForegroundColor Yellow
    
    $structureResults = @()
    
    # Critical files
    foreach ($file in $CRITICAL_FILES) {
        if (Test-Path $file) {
            $structureResults += "✅ $file - istnieje"
        }
        else {
            $structureResults += "❌ $file - BRAK (krytyczny)"
        }
    }
    
    # Important directories
    $importantDirs = @("src", "public", "src/components", "src/pages", "scripts")
    foreach ($dir in $importantDirs) {
        if (Test-Path $dir) {
            $fileCount = (Get-ChildItem $dir -File -Recurse -ErrorAction SilentlyContinue).Count
            $structureResults += "✅ $dir/ - istnieje ($fileCount plików)"
        }
        else {
            $structureResults += "⚠️ $dir/ - brak"
        }
    }
    
    # Check for backup directories (potential cleanup needed)
    $backupDirs = Get-ChildItem -Directory | Where-Object { 
        $_.Name -match "backup|BACKUP|_backup|\.backup" -or 
        $_.Name -match "copy|kopia" 
    }
    
    if ($backupDirs) {
        $structureResults += ""
        $structureResults += "🗂️ Znalezione katalogi backup (rozważ konsolidację):"
        foreach ($dir in $backupDirs) {
            $structureResults += "   • $($dir.Name)"
        }
    }
    
    $status = if ($structureResults -match "❌.*krytyczny") { "ERROR" } elseif ($structureResults -match "⚠️") { "WARNING" } else { "OK" }
    Write-Section "Struktura projektu" ($structureResults -join "`n") $status
}

# =================================================================
# DEPENDENCIES CHECK
# =================================================================

function Test-Dependencies {
    Write-Host "🔗 Sprawdzanie zależności..." -ForegroundColor Yellow
    
    $depResults = @()
    
    if (Test-Path "package.json") {
        try {
            $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
            
            # Count dependencies
            $deps = if ($packageJson.dependencies) { $packageJson.dependencies.PSObject.Properties.Count } else { 0 }
            $devDeps = if ($packageJson.devDependencies) { $packageJson.devDependencies.PSObject.Properties.Count } else { 0 }
            
            $depResults += "📊 Zależności produkcyjne: $deps"
            $depResults += "📊 Zależności deweloperskie: $devDeps"
            
            # Check for node_modules
            if (Test-Path "node_modules") {
                $nodeModulesSize = (Get-ChildItem "node_modules" -Recurse -File -ErrorAction SilentlyContinue | 
                    Measure-Object -Property Length -Sum).Sum / 1MB
                $depResults += "✅ node_modules: zainstalowane (~$([math]::Round($nodeModulesSize))MB)"
            }
            else {
                $depResults += "⚠️ node_modules: nie zainstalowane (uruchom: pnpm install)"
            }
            
            # Check lock files
            if (Test-Path "pnpm-lock.yaml") {
                $depResults += "✅ pnpm-lock.yaml: istnieje"
            }
            elseif (Test-Path "package-lock.json") {
                $depResults += "✅ package-lock.json: istnieje"
            }
            else {
                $depResults += "⚠️ Brak lock file - może powodować niestabilne buildy"
            }
            
        }
        catch {
            $depResults += "❌ Błąd czytania package.json: $($_.Exception.Message)"
        }
    }
    else {
        $depResults += "❌ Brak package.json - nie jest to projekt Node.js?"
    }
    
    $status = if ($depResults -match "❌") { "ERROR" } elseif ($depResults -match "⚠️") { "WARNING" } else { "OK" }
    Write-Section "Zależności projektu" ($depResults -join "`n") $status
}

# =================================================================
# CONFIGURATION CHECK
# =================================================================

function Test-Configuration {
    Write-Host "⚙️ Sprawdzanie konfiguracji..." -ForegroundColor Yellow
    
    $configResults = @()
    
    # .env files
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" -ErrorAction SilentlyContinue
        $envVars = ($envContent | Where-Object { $_ -match "^[^#]" }).Count
        $configResults += "✅ .env: istnieje ($envVars zmiennych)"
    }
    else {
        $configResults += "⚠️ .env: brak (może być potrzebny)"
    }
    
    if (Test-Path ".env.example") {
        $configResults += "✅ .env.example: istnieje (szablon)"
    }
    
    # Astro config
    if (Test-Path "astro.config.mjs") {
        try {
            $astroConfig = Get-Content "astro.config.mjs" -Raw
            $integrations = ([regex]::Matches($astroConfig, "@astrojs/\w+")).Count
            $configResults += "✅ astro.config.mjs: $integrations integracji skonfigurowanych"
        }
        catch {
            $configResults += "⚠️ astro.config.mjs: błąd parsowania"
        }
    }
    
    # Wrangler config (Cloudflare)
    if (Test-Path "wrangler.jsonc") {
        try {
            # Usuń komentarze z JSONC przed parsowaniem
            $wranglerContent = (Get-Content "wrangler.jsonc" -Raw) -replace '//.*$', '' -replace '/\*[\s\S]*?\*/', ''
            $wranglerConfig = $wranglerContent | ConvertFrom-Json -ErrorAction SilentlyContinue
            
            if ($wranglerConfig) {
                $configResults += "✅ wrangler.jsonc: skonfigurowany"
                if ($wranglerConfig.name) {
                    $configResults += "   └ Worker name: $($wranglerConfig.name)"
                }
            }
        }
        catch {
            $configResults += "⚠️ wrangler.jsonc: błąd parsowania JSON"
        }
    }
    
    # Tailwind config
    if (Test-Path "tailwind.config.mjs") {
        $configResults += "✅ tailwind.config.mjs: skonfigurowany"
    }
    
    # TypeScript config
    if (Test-Path "tsconfig.json") {
        $configResults += "✅ tsconfig.json: skonfigurowany"
    }
    
    $status = if ($configResults -match "❌") { "ERROR" } elseif ($configResults -match "⚠️") { "WARNING" } else { "OK" }
    Write-Section "Konfiguracja" ($configResults -join "`n") $status
}

# =================================================================
# PORT & CONNECTIVITY CHECK
# =================================================================

function Test-Connectivity {
    Write-Host "🌐 Sprawdzanie portów i connectivity..." -ForegroundColor Yellow
    
    $connResults = @()
    
    # Check ports
    foreach ($port in $REQUIRED_PORTS) {
        try {
            $connection = Test-NetConnection -ComputerName "localhost" -Port $port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                $connResults += "✅ Port $port - używany (serwis aktywny)"
            }
            else {
                $connResults += "ℹ️ Port $port - wolny"
            }
        }
        catch {
            $connResults += "ℹ️ Port $port - nie można sprawdzić"
        }
    }
    
    # Test internet connectivity
    try {
        $internetTest = Test-NetConnection -ComputerName "8.8.8.8" -Port 53 -WarningAction SilentlyContinue
        if ($internetTest.TcpTestSucceeded) {
            $connResults += "✅ Połączenie internetowe: OK"
        }
        else {
            $connResults += "⚠️ Połączenie internetowe: problemy"
        }
    }
    catch {
        $connResults += "⚠️ Nie można sprawdzić połączenia internetowego"
    }
    
    # Test Cloudflare Workers (if configured)
    if (Test-Path "wrangler.jsonc") {
        try {
            $wranglerWhoami = wrangler whoami 2>$null
            if ($LASTEXITCODE -eq 0) {
                $connResults += "✅ Cloudflare CLI: uwierzytelniony"
            }
            else {
                $connResults += "⚠️ Cloudflare CLI: nie uwierzytelniony (wrangler login)"
            }
        }
        catch {
            $connResults += "⚠️ Cloudflare CLI: niedostępny"
        }
    }
    
    Write-Section "Porty i połączenia" ($connResults -join "`n") "INFO"
}

# =================================================================
# SYSTEM HEALTH CHECK
# =================================================================

function Test-SystemHealth {
    Write-Host "🏥 Sprawdzanie zdrowia systemu..." -ForegroundColor Yellow
    
    $healthResults = @()
    
    # Disk space
    try {
        $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'" -ErrorAction SilentlyContinue
        if ($disk) {
            $freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 1)
            $totalSpaceGB = [math]::Round($disk.Size / 1GB, 1)
            $freePercent = [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 1)
            
            if ($freePercent -gt 15) {
                $healthResults += "✅ Miejsce na dysku: ${freeSpaceGB}GB/$totalSpaceGB GB wolne ($freePercent%)"
            }
            else {
                $healthResults += "⚠️ Miejsce na dysku: ${freeSpaceGB}GB/$totalSpaceGB GB wolne ($freePercent%) - mało miejsca!"
            }
        }
    }
    catch {
        $healthResults += "ℹ️ Nie można sprawdzić miejsca na dysku"
    }
    
    # Memory usage
    try {
        $memory = Get-WmiObject -Class Win32_OperatingSystem -ErrorAction SilentlyContinue
        if ($memory) {
            $totalMemGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 1)
            $freeMemGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 1)
            $usedPercent = [math]::Round((1 - ($memory.FreePhysicalMemory / $memory.TotalVisibleMemorySize)) * 100, 1)
            
            if ($usedPercent -lt 85) {
                $healthResults += "✅ Pamięć RAM: $usedPercent% używane ($freeMemGB GB wolne z $totalMemGB GB)"
            }
            else {
                $healthResults += "⚠️ Pamięć RAM: $usedPercent% używane ($freeMemGB GB wolne z $totalMemGB GB) - wysoki poziom!"
            }
        }
    }
    catch {
        $healthResults += "ℹ️ Nie można sprawdzić użycia pamięci"
    }
    
    # Running Node.js processes
    try {
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $healthResults += "ℹ️ Aktywne procesy Node.js: $($nodeProcesses.Count)"
            foreach ($proc in $nodeProcesses) {
                $memoryMB = [math]::Round($proc.WorkingSet / 1MB, 1)
                $healthResults += "   └ PID $($proc.Id): ${memoryMB}MB RAM"
            }
        }
        else {
            $healthResults += "ℹ️ Brak aktywnych procesów Node.js"
        }
    }
    catch {
        $healthResults += "ℹ️ Nie można sprawdzić procesów Node.js"
    }
    
    $status = if ($healthResults -match "⚠️.*wysoki|⚠️.*mało") { "WARNING" } else { "INFO" }
    Write-Section "Zdrowie systemu" ($healthResults -join "`n") $status
}

# =================================================================
# MAIN EXECUTION
# =================================================================

Write-Host "🔍 $PROJECT_NAME - Diagnostyka Systemu" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Blue
Write-Host "Rozpoczęcie: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# Run all checks
Test-Environment
Test-ProjectStructure  
Test-Dependencies
Test-Configuration
Test-Connectivity
Test-SystemHealth

# =================================================================
# GENERATE REPORT
# =================================================================

Write-Host ""
Write-Host "📋 Generowanie raportu..." -ForegroundColor Yellow

$reportHeader = @"
# 🔍 $PROJECT_NAME - Raport Diagnostyki Systemu

**Wygenerowano:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  
**Komputer:** $env:COMPUTERNAME  
**Użytkownik:** $env:USERNAME  
**Katalog:** $(Get-Location)  

---

"@

$fullReport = $reportHeader + ($REPORT_SECTIONS -join "`n")

if ($Export) {
    try {
        $fullReport | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "✅ Raport zapisano w: $OutputFile" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Błąd zapisu raportu: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# =================================================================
# SUMMARY & RECOMMENDATIONS
# =================================================================

Write-Host ""
Write-Host "✅ Diagnostyka zakończona!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Blue

# Count issues
$errorSections = $REPORT_SECTIONS | Where-Object { $_ -match "## ❌" }
$warningSections = $REPORT_SECTIONS | Where-Object { $_ -match "## ⚠️" }

if ($errorSections.Count -gt 0) {
    Write-Host "❌ Znaleziono $($errorSections.Count) krytycznych problemów" -ForegroundColor Red
}

if ($warningSections.Count -gt 0) {
    Write-Host "⚠️ Znaleziono $($warningSections.Count) ostrzeżeń" -ForegroundColor Yellow
}

if ($errorSections.Count -eq 0 -and $warningSections.Count -eq 0) {
    Write-Host "🎉 System wygląda na zdrowy!" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 Następne kroki:" -ForegroundColor Cyan
Write-Host "   • Jeśli są błędy: uruchom scripts/fix-dependencies.ps1" -ForegroundColor White
Write-Host "   • Sprawdź konfigurację .env jeśli brak" -ForegroundColor White
Write-Host "   • Uruchom: pnpm dev lub npm run dev" -ForegroundColor White

if ($Export) {
    Write-Host "   • Pełny raport w: $OutputFile" -ForegroundColor White
}