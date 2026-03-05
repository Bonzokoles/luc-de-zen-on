@echo off
REM ====================================
REM CAY_XLM_FEED_Converter - Launcher
REM Uruchamia serwery w TLE (bez widoku)
REM ====================================

setlocal enabledelayedexpansion

REM Sprawdź czy Python jest zainstalowany
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo   BLAD: Python nie znaleziony!
    echo ========================================
    echo.
    echo Zainstaluj Python 3.8+ z:
    echo https://www.python.org/downloads/
    echo.
    echo WAZNE: Zaznacz opcje:
    echo   [x] Add Python to PATH
    echo   [x] Install pip
    echo.
    pause
    exit /b 1
)

REM Ustawienia
set PORT1=4656
set PORT2=4657
set SCRIPT_DIR=%cd%

REM Sprawdź czy serwery już działają
netstat -ano | findstr :%PORT1% >nul 2>&1
if not errorlevel 1 (
    echo ========================================
    echo   Serwer na porcie %PORT1% już działa!
    echo ========================================
    echo.
)

echo.
echo ========================================
echo   CAY_XLM_FEED_Converter - Startup
echo ========================================
echo.
echo 🚀 Uruchamianie serwerów w TLE...
echo.

REM Uruchom serwery w tle (bez widocznych okien)
echo   • Serwer 1 (port %PORT1%)...
start "" /B /MIN cmd /c "cd /d "%SCRIPT_DIR%" && python -m http.server %PORT1% --bind 127.0.0.1"
timeout /t 1 /nobreak >nul

echo   • Serwer 2 (port %PORT2%)...
start "" /B /MIN cmd /c "cd /d "%SCRIPT_DIR%" && python -m http.server %PORT2% --bind 127.0.0.1"
timeout /t 1 /nobreak >nul

REM Otwórz aplikację
echo.
echo 📖 Otwieranie aplikacji...
timeout /t 1 /nobreak >nul

REM Spróbuj otworzyć plik HTML
if exist "%SCRIPT_DIR%\index.html" (
    start "" "%SCRIPT_DIR%\index.html"
) else (
    echo.
    echo WARNING: Nie znaleziono index.html!
    echo Umieść index.html w folderze z tym plikiem.
    echo.
)

REM Poczekaj i pokaż status
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   ✅ Aplikacja uruchomiona!
echo ========================================
echo.
echo 📡 Adresy dostępu:
echo    • Aplikacja: file:///%SCRIPT_DIR%/index.html
echo    • Serwer 1: http://localhost:%PORT1%
echo    • Serwer 2: http://localhost:%PORT2%
echo.
echo 💡 Informacje:
echo    • Serwery działają w TLE (bez okien)
echo    • Aby zatrzymać: uruchom stop_servers.bat
echo    • Lub: taskkill /F /IM python.exe
echo.
echo 🔧 Jeśli coś nie działa:
echo    1. Sprawdź czy Python jest zainstalowany
echo    2. Sprawdź czy porty 4656, 4657 są wolne
echo    3. Otwórz index.html ręcznie w przeglądarce
echo.
echo Okno będzie zamknięte za 10 sekund...
timeout /t 10 /nobreak >nul
