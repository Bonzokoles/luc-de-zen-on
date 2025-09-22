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