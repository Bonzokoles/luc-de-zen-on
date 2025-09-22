# SKRYPT AUTOMATYZACJI WORKFLOW

## Skrypty pomocnicze dla bezpiecznego developmentu

### 1. Skrypt inicjalizacji pracy (start-work.ps1)
```powershell
# ROZPOCZNIJ PRACĘ - Automatyczna synchronizacja
Write-Host "🚀 Rozpoczynam bezpieczną pracę..." -ForegroundColor Green

# Przejdź do głównego katalogu
Set-Location "Q:\mybonzo\mybonzo-github"

# Aktualizuj main
git checkout main
git pull origin main

# Sprawdź czy mybonzo_zoo istnieje, jeśli nie - utwórz
$branchExists = git branch -r | Select-String "origin/mybonzo_zoo"
if (-not $branchExists) {
    Write-Host "Tworzę branch mybonzo_zoo..." -ForegroundColor Yellow
    git checkout -b mybonzo_zoo
    git push -u origin mybonzo_zoo
} else {
    git checkout mybonzo_zoo
    git pull origin mybonzo_zoo
}

Write-Host "✅ Gotowy do pracy na mybonzo_zoo!" -ForegroundColor Green
```

### 2. Skrypt testowania lokalnego (test-local.ps1)
```powershell
# TEST LOKALNY - Sprawdź czy wszystko działa
Write-Host "🧪 Rozpoczynam testy lokalne..." -ForegroundColor Cyan

# Build test
Write-Host "📦 Sprawdzam build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build nieudany! Napraw błędy przed kontynuacją." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build przeszedł pomyślnie!" -ForegroundColor Green

# Uruchom dev server w tle
Write-Host "🌐 Uruchamiam dev server..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock { Set-Location "Q:\mybonzo\mybonzo-github"; npm run dev }

Start-Sleep 10

# Test HTTP
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4321" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Serwer lokalny działa!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Serwer lokalny nie odpowiada!" -ForegroundColor Red
    Stop-Job $job
    exit 1
}

Stop-Job $job
Write-Host "🎉 Wszystkie testy lokalne przeszły!" -ForegroundColor Green
```

### 3. Skrypt deploy do staging (deploy-staging.ps1)
```powershell
# DEPLOY DO STAGING - mybonzo_zoo
param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "📤 Deploy do staging (mybonzo_zoo)..." -ForegroundColor Cyan

# Sprawdź czy jesteśmy na mybonzo_zoo
$currentBranch = git branch --show-current
if ($currentBranch -ne "mybonzo_zoo") {
    Write-Host "⚠️ Przełączam na mybonzo_zoo..." -ForegroundColor Yellow
    git checkout mybonzo_zoo
}

# Commit zmian
git add .
git commit -m "STAGING: $CommitMessage"

# Push do staging
git push origin mybonzo_zoo

Write-Host "✅ Wdrożono do staging! Sprawdź na mybonzo-zoo.pages.dev" -ForegroundColor Green
Write-Host "⏱️ Czekaj 2-3 minuty na deploy Cloudflare..." -ForegroundColor Yellow
```

### 4. Skrypt deploy do produkcji (deploy-production.ps1)
```powershell
# DEPLOY DO PRODUKCJI - main (tylko po akceptacji staging)
param(
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

Write-Host "🚀 Deploy do PRODUKCJI..." -ForegroundColor Red

if (-not $Force) {
    $confirmation = Read-Host "Czy staging działa bez problemów? (tak/nie)"
    if ($confirmation -ne "tak") {
        Write-Host "❌ Anulowano deploy do produkcji!" -ForegroundColor Red
        exit 1
    }
}

# Przełącz na main
git checkout main
git pull origin main

# Merge z mybonzo_zoo
git merge mybonzo_zoo

# Push do produkcji
git push origin main

Write-Host "🎉 Wdrożono do PRODUKCJI! www.mybonzo.com" -ForegroundColor Green
```

### 5. Skrypt tworzenia backupu (create-backup.ps1)
```powershell
# UTWÓRZ BACKUP - przed większymi zmianami
$timestamp = Get-Date -Format "yyyy_MM_dd_HHmm"
$backupDir = "Q:\mybonzo\BACKUP_$timestamp"

Write-Host "💾 Tworzę backup..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path $backupDir -Force

# Kopiuj kluczowe pliki
Copy-Item "Q:\mybonzo\mybonzo-github\src\pages\www.astro" "$backupDir\www.astro"
Copy-Item "Q:\mybonzo\mybonzo-github\astro.config.mjs" "$backupDir\astro.config.mjs"
Copy-Item "Q:\mybonzo\mybonzo-github\src\components\QuickVoiceAI.tsx" "$backupDir\QuickVoiceAI.tsx"

# Zapisz info o commit
git log --oneline -1 > "$backupDir\current_commit.txt"

Write-Host "✅ Backup utworzony: $backupDir" -ForegroundColor Green
```