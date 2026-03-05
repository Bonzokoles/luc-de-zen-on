# ====================================
# CAY_XLM_FEED_Converter - Launcher
# ====================================

$PORT1 = 4656
$PORT2 = 4657
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BROWSER_URL = "file:///$SCRIPT_DIR/index.html".Replace("\", "/")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CAY_XLM_FEED_Converter - Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Sprawdź Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python znaleziony: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python nie znaleziony! Zainstaluj Python 3.8+" -ForegroundColor Red
    Write-Host "Pobierz z: https://www.python.org/downloads/" -ForegroundColor Yellow
    Read-Host "Naciśnij Enter aby wyjść"
    exit 1
}

Write-Host ""
Write-Host "📋 Będą uruchomione:" -ForegroundColor Yellow
Write-Host "   • Serwer 1: http://localhost:$PORT1" -ForegroundColor White
Write-Host "   • Serwer 2: http://localhost:$PORT2" -ForegroundColor White
Write-Host "   • Aplikacja: $BROWSER_URL" -ForegroundColor White
Write-Host ""

# Uruchom serwery
Write-Host "🚀 Uruchamianie serwerów..." -ForegroundColor Cyan

Push-Location $SCRIPT_DIR

Write-Host "   Startowanie serwera 1 (port $PORT1)..." -ForegroundColor Gray
Start-Process -NoNewWindow -ArgumentList "-m http.server $PORT1 --bind 127.0.0.1" -FilePath python

Start-Sleep -Seconds 2

Write-Host "   Startowanie serwera 2 (port $PORT2)..." -ForegroundColor Gray
Start-Process -NoNewWindow -ArgumentList "-m http.server $PORT2 --bind 127.0.0.1" -FilePath python

Start-Sleep -Seconds 1

# Otwórz aplikację
Write-Host "📖 Otwieranie aplikacji w przeglądarce..." -ForegroundColor Cyan
Start-Process -FilePath $BROWSER_URL

Write-Host ""
Write-Host "✅ Aplikacja uruchomiona!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Adresy dostępu:" -ForegroundColor Yellow
Write-Host "   • Localhost 4656: http://localhost:$PORT1" -ForegroundColor White
Write-Host "   • Localhost 4657: http://localhost:$PORT2" -ForegroundColor White
Write-Host "   • Plik lokalny: $BROWSER_URL" -ForegroundColor White
Write-Host ""
Write-Host "💡 Porady:" -ForegroundColor Yellow
Write-Host "   • Serwery działają w tle" -ForegroundColor White
Write-Host "   • Aby zatrzymać: zamknij okna konsoli" -ForegroundColor White
Write-Host "   • Aplikacja będzie działać w przeglądarce" -ForegroundColor White
Write-Host "   • Możesz pobierać pliki z URL przez proxy" -ForegroundColor White
Write-Host ""
Write-Host "Naciśnij Enter aby wyjść..." -ForegroundColor Gray
Read-Host

Pop-Location
