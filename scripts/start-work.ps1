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