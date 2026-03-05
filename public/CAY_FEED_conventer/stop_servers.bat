@echo off
REM Zatrzymaj wszystkie serwery

echo.
echo ========================================
echo   Zatrzymywanie serwerów...
echo ========================================
echo.

taskkill /F /IM python.exe /FI "WINDOWTITLE eq*http.server*" >nul 2>&1

if errorlevel 0 (
    echo ✅ Serwery zatrzymane!
) else (
    echo ℹ️  Nie znaleziono działających serwerów
)

echo.
echo Naciśnij Enter aby wyjść...
pause >nul
