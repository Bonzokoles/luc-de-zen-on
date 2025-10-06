# MyBonzo Quick Gemini Aliases
# Dodaj do swojego PowerShell Profile: notepad $PROFILE

# Quick aliases for MyBonzo development
function gm-fix { .\gemini-mybonzo.ps1 fix @args }
function gm-api { .\gemini-mybonzo.ps1 api @args }
function gm-comp { .\gemini-mybonzo.ps1 component @args }
function gm-opt { .\gemini-mybonzo.ps1 optimize @args }
function gm-debug { .\gemini-mybonzo.ps1 debug @args }
function gm-pl { .\gemini-mybonzo.ps1 polish @args }
function gm-deploy { .\gemini-mybonzo.ps1 deploy @args }
function gm-config { .\gemini-mybonzo.ps1 config @args }
function gm-review { .\gemini-mybonzo.ps1 review @args }
function gm-polaczek { .\gemini-mybonzo.ps1 polaczek-deploy @args }
function gm-repair { .\gemini-mybonzo.ps1 full-system-repair @args }
function gm { .\gemini-mybonzo.ps1 @args }

Write-Host "🧠 MyBonzo Gemini CLI aliases loaded!" -ForegroundColor Green
Write-Host "Usage: gm-fix, gm-api, gm-comp, gm-opt, gm-debug, gm-pl, gm-deploy, gm-config, gm-review, gm-polaczek, gm-repair, gm" -ForegroundColor Yellow

# Examples:
# gm-fix "TypeScript error in tavi.ts"
# gm-api weather "OpenWeatherMap integration"  
# gm-comp news svelte "RSS feed reader"
# gm-opt "Tavily API performance"
# gm-pl ui "button labels"