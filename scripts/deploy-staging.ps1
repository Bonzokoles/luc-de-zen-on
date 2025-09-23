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