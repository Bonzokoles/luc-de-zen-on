@echo off
REM ====================================
REM CAY_XLM_FEED_Converter - Advanced
REM Wersja z logowaniem i diagnostyką
REM ====================================

setlocal enabledelayedexpansion

REM Setup
set PORT1=4656
set PORT2=4657
set SCRIPT_DIR=%cd%
set LOG_FILE=%SCRIPT_DIR%\server.log
set TIMESTAMP=%date% %time%

echo.
echo ========================================
echo   CAY_XLM_FEED_Converter - Advanced
echo ========================================
echo.

REM Sprawdzenie Pythona
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python nie znaleziony!
    pause
    exit /b 1
)

REM Sprawdzenie dostępności portów
echo Sprawdzanie portów...
netstat -ano | findstr :%PORT1% >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port %PORT1% już zajęty!
    echo Zamknij inne aplikacje lub zmień port.
    pause
    exit /b 1
)

netstat -ano | findstr :%PORT2% >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port %PORT2% już zajęty!
    pause
    exit /b 1
)

echo ✅ Porty dostępne

REM Uruchom serwery z logowaniem
echo.
echo Uruchamianie serwerów...
echo [%TIMESTAMP%] Serwery uruchamiane >> "%LOG_FILE%"

start "" /B /MIN cmd /c "cd /d "%SCRIPT_DIR%" && python -m http.server %PORT1% --bind 127.0.0.1 >> "%LOG_FILE%" 2>&1"
timeout /t 1 /nobreak >nul

start "" /B /MIN cmd /c "cd /d "%SCRIPT_DIR%" && python -m http.server %PORT2% --bind 127.0.0.1 >> "%LOG_FILE%" 2>&1"
timeout /t 1 /nobreak >nul

echo ✅ Serwery uruchomione w TLE

REM Otwórz aplikację
echo Otwieranie aplikacji...
if exist "%SCRIPT_DIR%\index.html" (
    start "" "%SCRIPT_DIR%\index.html"
    echo ✅ Aplikacja otwarta
) else (
    echo ❌ Nie znaleziono index.html
)

echo.
echo ========================================
echo   ✅ Aplikacja gotowa!
echo ========================================
echo.
echo Szczegóły:
echo   • Serwer 1: http://localhost:%PORT1%
echo   • Serwer 2: http://localhost:%PORT2%
echo   • Log: %LOG_FILE%
echo.
echo Aby zatrzymać serwery:
echo   1. Uruchom stop_servers.bat
echo   2. Lub: taskkill /F /IM python.exe
echo.
timeout /t 15 /nobreak >nul
