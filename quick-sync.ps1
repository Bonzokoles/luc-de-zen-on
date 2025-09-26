# Quick Production Sync
# Szybki skrypt do synchronizacji z production

Write-Host "🔄 QUICK SYNC TO PRODUCTION" -ForegroundColor Cyan

# Sprawdź build
Write-Host "Building..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build OK - ready for production" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy to production run:" -ForegroundColor White
    Write-Host ".\deploy-to-production.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Current status:" -ForegroundColor White
    Write-Host "- Development: luc-de-zen-on.pages.dev ✅" -ForegroundColor Green
    Write-Host "- Production: mybonzo.com (not updated)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Build failed - fix errors before production" -ForegroundColor Red
}