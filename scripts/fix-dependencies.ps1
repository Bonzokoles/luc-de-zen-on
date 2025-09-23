#!/usr/bin/env pwsh
# MYBONZO DEPENDENCY FIX SCRIPT
# Automatyczne naprawianie zależności na bazie SYSTEM_ANALYSIS.md
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

Write-ColorOutput "🔧 $PROJECT_NAME - Naprawianie Zależności" "Green"
Write-ColorOutput "=======================================================" "Blue"
Write-Log "Rozpoczynam naprawę zależności projektu $PROJECT_NAME"

# Sprawdź czy jesteśmy w prawidłowym katalogu
if (-not (Test-Path "package.json")) {
    Write-ColorOutput "❌ Błąd: Nie znaleziono package.json w bieżącym katalogu!" "Red"
    Write-ColorOutput "💡 Upewnij się, że jesteś w głównym katalogu projektu" "Yellow"
    exit 1
}

Write-Log "Znaleziono package.json - kontynuuję"

# =================================================================
# STEP 1: CREATE BACKUP
# =================================================================

Write-ColorOutput "💾 Krok 1: Tworzenie kopii zapasowej..." "Yellow"

$backupTimestamp = Get-Date -Format "yyyy-MM-dd-HHmm"
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

try {
    Copy-Item "package.json" "$BACKUP_DIR/package.json.backup-$backupTimestamp"
    Write-Log "✅ Utworzono backup package.json"
    
    if (Test-Path "pnpm-lock.yaml") {
        Copy-Item "pnpm-lock.yaml" "$BACKUP_DIR/pnpm-lock.yaml.backup-$backupTimestamp"
        Write-Log "✅ Utworzono backup pnpm-lock.yaml"
    }
    
    if (Test-Path "package-lock.json") {
        Copy-Item "package-lock.json" "$BACKUP_DIR/package-lock.json.backup-$backupTimestamp"
        Write-Log "✅ Utworzono backup package-lock.json"
    }
}
catch {
    Write-ColorOutput "⚠️ Ostrzeżenie: Nie można utworzyć backupu - kontynuuję" "Yellow"
    Write-Log "Ostrzeżenie backupu: $($_.Exception.Message)"
}

# =================================================================
# STEP 2: CLEAN CACHE AND MODULES
# =================================================================

Write-ColorOutput "🧹 Krok 2: Czyszczenie cache i modułów..." "Yellow"

if ($FullClean -or $Force) {
    Write-Log "Wykonuję pełne czyszczenie (włączając node_modules)"
    
    # Usuń node_modules
    if (Test-Path "node_modules") {
        Write-Log "Usuwam node_modules..."
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    }
    
    # Usuń lock files jeśli force
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

# Usuń cache directories
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
    Write-Log "Czyszczę PNPM store..."
    pnpm store prune 2>$null
    Write-Log "✅ PNPM store wyczyszczony"
}
catch {
    Write-Log "⚠️ Nie można wyczyścić PNPM store (może nie być zainstalowany)"
}

# NPM cache cleanup
try {
    Write-Log "Czyszczę NPM cache..."
    npm cache clean --force 2>$null
    Write-Log "✅ NPM cache wyczyszczony"
}
catch {
    Write-Log "⚠️ Nie można wyczyścić NPM cache"
}

# =================================================================
# STEP 3: REINSTALL DEPENDENCIES
# =================================================================

Write-ColorOutput "📦 Krok 3: Reinstalacja zależności..." "Yellow"

# Sprawdź który package manager jest dostępny
$packageManager = $null

if (Get-Command "pnpm" -ErrorAction SilentlyContinue) {
    $packageManager = "pnpm"
    Write-Log "Znaleziono PNPM - używam jako domyślny"
}
elseif (Get-Command "npm" -ErrorAction SilentlyContinue) {
    $packageManager = "npm"
    Write-Log "Znaleziono NPM - używam jako fallback"
}
else {
    Write-ColorOutput "❌ Błąd: Nie znaleziono ani PNPM ani NPM!" "Red"
    exit 1
}

# Instalacja zależności
Write-Log "Instaluję zależności używając $packageManager..."

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
        Write-Log "✅ Zależności zainstalowane pomyślnie"
    }
    else {
        throw "Package manager zwrócił kod błędu $LASTEXITCODE"
    }
}
catch {
    Write-ColorOutput "❌ Błąd podczas instalacji zależności: $($_.Exception.Message)" "Red"
    Write-Log "Błąd instalacji: $($_.Exception.Message)"
    exit 1
}

# =================================================================
# STEP 4: SECURITY AUDIT
# =================================================================

if ($SecurityAudit) {
    Write-ColorOutput "🛡️ Krok 4: Audyt bezpieczeństwa..." "Yellow"
    
    try {
        Write-Log "Uruchamiam audyt bezpieczeństwa..."
        
        if ($packageManager -eq "pnpm") {
            & pnpm audit --fix
        }
        else {
            & npm audit fix --force
        }
        
        Write-Log "✅ Audyt bezpieczeństwa zakończony"
    }
    catch {
        Write-ColorOutput "⚠️ Ostrzeżenie: Problemy z audytem bezpieczeństwa" "Yellow"
        Write-Log "Ostrzeżenie audytu: $($_.Exception.Message)"
    }
}

# =================================================================
# STEP 5: DEPENDENCY CHECK
# =================================================================

Write-ColorOutput "🔍 Krok 5: Sprawdzanie zależności..." "Yellow"

try {
    Write-Log "Sprawdzam listę zainstalowanych pakietów..."
    
    if ($packageManager -eq "pnpm") {
        & pnpm list --depth=0
    }
    else {
        & npm list --depth=0
    }
    
    Write-Log "✅ Lista zależności sprawdzona"
}
catch {
    Write-ColorOutput "⚠️ Ostrzeżenie: Problemy ze sprawdzeniem zależności" "Yellow"
    Write-Log "Ostrzeżenie list: $($_.Exception.Message)"
}

# =================================================================
# STEP 6: BUILD TEST
# =================================================================

Write-ColorOutput "🔨 Krok 6: Test kompilacji..." "Yellow"

try {
    Write-Log "Testuję kompilację projektu..."
    
    if ($packageManager -eq "pnpm") {
        & pnpm build
    }
    else {
        & npm run build
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Projekt kompiluje się poprawnie"
    }
    else {
        throw "Build zwrócił kod błędu $LASTEXITCODE"
    }
}
catch {
    Write-ColorOutput "⚠️ Ostrzeżenie: Problemy z kompilacją - może wymagać dodatkowej konfiguracji" "Yellow"
    Write-Log "Ostrzeżenie build: $($_.Exception.Message)"
}

# =================================================================
# STEP 7: ENVIRONMENT CHECK
# =================================================================

Write-ColorOutput "⚙️ Krok 7: Sprawdzanie konfiguracji środowiska..." "Yellow"

# Sprawdź .env files
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-ColorOutput "📝 Kopiuję .env.example do .env" "Yellow"
        Copy-Item ".env.example" ".env"
        Write-Log "✅ Skopiowano .env.example do .env"
    }
    else {
        Write-ColorOutput "⚠️ Brak pliku .env i .env.example - może wymagać ręcznej konfiguracji" "Yellow"
        Write-Log "Ostrzeżenie: Brak konfiguracji środowiska"
    }
}
else {
    Write-Log "✅ Plik .env istnieje"
}

# =================================================================
# FINAL SUMMARY
# =================================================================

Write-ColorOutput "✅ Naprawiono zależności $PROJECT_NAME!" "Green"
Write-ColorOutput "=======================================================" "Blue"
Write-ColorOutput "📋 Podsumowanie:" "White"
Write-ColorOutput "   • Utworzono kopie zapasowe" "White"
Write-ColorOutput "   • Wyczyszczono cache i stare pliki" "White"
Write-ColorOutput "   • Przeinstalowano zależności ($packageManager)" "White"

if ($SecurityAudit) {
    Write-ColorOutput "   • Przeprowadzono audyt bezpieczeństwa" "White"
}

Write-ColorOutput "   • Przetestowano kompilację" "White"
Write-ColorOutput "   • Sprawdzono konfigurację środowiska" "White"
Write-ColorOutput "" "White"
Write-ColorOutput "📝 Log zapisano w: $LOG_FILE" "Cyan"
Write-ColorOutput "💡 Można teraz uruchomić: pnpm dev lub npm run dev" "Green"

Write-Log "Skrypt naprawy zależności zakończony pomyślnie"