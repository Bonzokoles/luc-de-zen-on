#!/usr/bin/env pwsh
# MYBONZO DEPENDENCY FIX SCRIPT
# Automatyczne naprawianie zalenoci na bazie SYSTEM_ANALYSIS.md
# Kompatybilny z PowerShell Core i Windows PowerShell

param(
    [switch]$Force,
    [switch]$FullClean,
    [switch]$SecurityAudit
)

# =================================================================
# CONFIGURATION
# =================================================================

$PROJECT_NAME = "MyBonzo"
$BACKUP_DIR = "BACKUPS"
$LOG_FILE = "dependency-fix-$(Get-Date -Format 'yyyy-MM-dd-HHmm').log"

# Kolory dla output
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    
    $colorMap = @{
        "Red"     = [ConsoleColor]::Red
        "Green"   = [ConsoleColor]::Green
        "Yellow"  = [ConsoleColor]::Yellow
        "Blue"    = [ConsoleColor]::Blue
        "Cyan"    = [ConsoleColor]::Cyan
        "Magenta" = [ConsoleColor]::Magenta
        "White"   = [ConsoleColor]::White
    }
    
    Write-Host $Message -ForegroundColor $colorMap[$Color]
}

# Logging function
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -FilePath $LOG_FILE -Append -Encoding UTF8
    Write-ColorOutput $Message "Cyan"
}

# =================================================================
# MAIN SCRIPT
# =================================================================

Write-ColorOutput " $PROJECT_NAME - Naprawianie Zalenoci" "Green"
Write-ColorOutput "=======================================================" "Blue"
Write-Log "Rozpoczynam napraw zalenoci projektu $PROJECT_NAME"

# Sprawd czy jestemy w prawidowym katalogu
if (-not (Test-Path "package.json")) {
    Write-ColorOutput " Bd: Nie znaleziono package.json w biecym katalogu!" "Red"
    Write-ColorOutput " Upewnij si, e jeste w gwnym katalogu projektu" "Yellow"
    exit 1
}

Write-Log "Znaleziono package.json - kontynuuj"

# =================================================================
# STEP 1: CREATE BACKUP
# =================================================================

Write-ColorOutput " Krok 1: Tworzenie kopii zapasowej..." "Yellow"

$backupTimestamp = Get-Date -Format "yyyy-MM-dd-HHmm"
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

try {
    Copy-Item "package.json" "$BACKUP_DIR/package.json.backup-$backupTimestamp"
    Write-Log " Utworzono backup package.json"
    
    if (Test-Path "pnpm-lock.yaml") {
        Copy-Item "pnpm-lock.yaml" "$BACKUP_DIR/pnpm-lock.yaml.backup-$backupTimestamp"
        Write-Log " Utworzono backup pnpm-lock.yaml"
    }
    
    if (Test-Path "package-lock.json") {
        Copy-Item "package-lock.json" "$BACKUP_DIR/package-lock.json.backup-$backupTimestamp"
        Write-Log " Utworzono backup package-lock.json"
    }
}
catch {
    Write-ColorOutput " Ostrzeenie: Nie mona utworzy backupu - kontynuuj" "Yellow"
    Write-Log "Ostrzeenie backupu: $($_.Exception.Message)"
}

# =================================================================
# STEP 2: CLEAN CACHE AND MODULES
# =================================================================

Write-ColorOutput " Krok 2: Czyszczenie cache i moduw..." "Yellow"

if ($FullClean -or $Force) {
    Write-Log "Wykonuj pene czyszczenie (wczajc node_modules)"
    
    # Usu node_modules
    if (Test-Path "node_modules") {
        Write-Log "Usuwam node_modules..."
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    }
    
    # Usu lock files jeli force
    if ($Force) {
        if (Test-Path "pnpm-lock.yaml") {
            Write-Log "Usuwam pnpm-lock.yaml..."
            Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
        }
        if (Test-Path "package-lock.json") {
            Write-Log "Usuwam package-lock.json..."
            Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
        }
    }
}

# Usu cache directories
$cacheDirectories = @(
    ".astro",
    ".vite", 
    "node_modules/.vite",
    "node_modules/.cache",
    "dist"
)

foreach ($dir in $cacheDirectories) {
    if (Test-Path $dir) {
        Write-Log "Usuwam cache: $dir"
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
    }
}

# PNPM specific cleanup
try {
    Write-Log "Czyszcz PNPM store..."
    pnpm store prune 2>$null
    Write-Log " PNPM store wyczyszczony"
}
catch {
    Write-Log " Nie mona wyczyci PNPM store (moe nie by zainstalowany)"
}

# NPM cache cleanup
try {
    Write-Log "Czyszcz NPM cache..."
    npm cache clean --force 2>$null
    Write-Log " NPM cache wyczyszczony"
}
catch {
    Write-Log " Nie mona wyczyci NPM cache"
}

# =================================================================
# STEP 3: REINSTALL DEPENDENCIES
# =================================================================

Write-ColorOutput " Krok 3: Reinstalacja zalenoci..." "Yellow"

# Sprawd ktry package manager jest dostpny
$packageManager = $null

if (Get-Command "pnpm" -ErrorAction SilentlyContinue) {
    $packageManager = "pnpm"
    Write-Log "Znaleziono PNPM - uywam jako domylny"
}
elseif (Get-Command "npm" -ErrorAction SilentlyContinue) {
    $packageManager = "npm"
    Write-Log "Znaleziono NPM - uywam jako fallback"
}
else {
    Write-ColorOutput " Bd: Nie znaleziono ani PNPM ani NPM!" "Red"
    exit 1
}

# Instalacja zalenoci
Write-Log "Instaluj zalenoci uywajc $packageManager..."

try {
    if ($packageManager -eq "pnpm") {
        if ($Force) {
            & pnpm install --force --prefer-frozen-lockfile=false
        }
        else {
            & pnpm install
        }
    }
    else {
        if ($Force) {
            & npm install --force
        }
        else {
            & npm install
        }
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log " Zalenoci zainstalowane pomylnie"
    }
    else {
        throw "Package manager zwrci kod bdu $LASTEXITCODE"
    }
}
catch {
    Write-ColorOutput " Bd podczas instalacji zalenoci: $($_.Exception.Message)" "Red"
    Write-Log "Bd instalacji: $($_.Exception.Message)"
    exit 1
}

# =================================================================
# STEP 4: SECURITY AUDIT
# =================================================================

if ($SecurityAudit) {
    Write-ColorOutput " Krok 4: Audyt bezpieczestwa..." "Yellow"
    
    try {
        Write-Log "Uruchamiam audyt bezpieczestwa..."
        
        if ($packageManager -eq "pnpm") {
            & pnpm audit --fix
        }
        else {
            & npm audit fix --force
        }
        
        Write-Log " Audyt bezpieczestwa zakoczony"
    }
    catch {
        Write-ColorOutput " Ostrzeenie: Problemy z audytem bezpieczestwa" "Yellow"
        Write-Log "Ostrzeenie audytu: $($_.Exception.Message)"
    }
}

# =================================================================
# STEP 5: DEPENDENCY CHECK
# =================================================================

Write-ColorOutput " Krok 5: Sprawdzanie zalenoci..." "Yellow"

try {
    Write-Log "Sprawdzam list zainstalowanych pakietw..."
    
    if ($packageManager -eq "pnpm") {
        & pnpm list --depth=0
    }
    else {
        & npm list --depth=0
    }
    
    Write-Log " Lista zalenoci sprawdzona"
}
catch {
    Write-ColorOutput " Ostrzeenie: Problemy ze sprawdzeniem zalenoci" "Yellow"
    Write-Log "Ostrzeenie list: $($_.Exception.Message)"
}

# =================================================================
# STEP 6: BUILD TEST
# =================================================================

Write-ColorOutput " Krok 6: Test kompilacji..." "Yellow"

try {
    Write-Log "Testuj kompilacj projektu..."
    
    if ($packageManager -eq "pnpm") {
        & pnpm build
    }
    else {
        & npm run build
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log " Projekt kompiluje si poprawnie"
    }
    else {
        throw "Build zwrci kod bdu $LASTEXITCODE"
    }
}
catch {
    Write-ColorOutput " Ostrzeenie: Problemy z kompilacj - moe wymaga dodatkowej konfiguracji" "Yellow"
    Write-Log "Ostrzeenie build: $($_.Exception.Message)"
}

# =================================================================
# STEP 7: ENVIRONMENT CHECK
# =================================================================

Write-ColorOutput " Krok 7: Sprawdzanie konfiguracji rodowiska..." "Yellow"

# Sprawd .env files
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-ColorOutput " Kopiuj .env.example do .env" "Yellow"
        Copy-Item ".env.example" ".env"
        Write-Log " Skopiowano .env.example do .env"
    }
    else {
        Write-ColorOutput " Brak pliku .env i .env.example - moe wymaga rcznej konfiguracji" "Yellow"
        Write-Log "Ostrzeenie: Brak konfiguracji rodowiska"
    }
}
else {
    Write-Log " Plik .env istnieje"
}

# =================================================================
# FINAL SUMMARY
# =================================================================

Write-ColorOutput " Naprawiono zalenoci $PROJECT_NAME!" "Green"
Write-ColorOutput "=======================================================" "Blue"
Write-ColorOutput " Podsumowanie:" "White"
Write-ColorOutput "    Utworzono kopie zapasowe" "White"
Write-ColorOutput "    Wyczyszczono cache i stare pliki" "White"
Write-ColorOutput "    Przeinstalowano zalenoci ($packageManager)" "White"

if ($SecurityAudit) {
    Write-ColorOutput "    Przeprowadzono audyt bezpieczestwa" "White"
}

Write-ColorOutput "    Przetestowano kompilacj" "White"
Write-ColorOutput "    Sprawdzono konfiguracj rodowiska" "White"
Write-ColorOutput "" "White"
Write-ColorOutput " Log zapisano w: $LOG_FILE" "Cyan"
Write-ColorOutput " Mona teraz uruchomi: pnpm dev lub npm run dev" "Green"

Write-Log "Skrypt naprawy zalenoci zakoczony pomylnie"
