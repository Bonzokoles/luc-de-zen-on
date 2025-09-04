@echo off
REM Uruchamia lokalny serwer HTTP i otwiera aplikację w przeglądarce
cd /d %~dp0
start /b python -m http.server 8000
start chrome http://localhost:8000/dist/index.html
