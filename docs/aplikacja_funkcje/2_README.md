# 🧠 MyBonzo Gemini AI Documentation

Ten folder zawiera kompletną dokumentację do używania Gemini CLI z projektem MyBonzo.

## 📁 Pliki

### 🚀 Quick Start

- **`GEMINI_SETUP.md`** - Instalacja i konfiguracja Gemini CLI
- **`GEMINI_TEMPLATES.md`** - Gotowe prompty do copy-paste

### 📋 Reference

- **`gemini-quick-prompts.md`** - Szybki przewodnik i przykłady
- **`gemini-prompts.md`** - Pełna dokumentacja wszystkich promptów
- **`SYSTEM_REPAIR_TEMPLATE.md`** - Kompleksowa naprawa systemu i BigQuery

## 🎯 Jak Zacząć

1. **Przeczytaj setup**: `GEMINI_SETUP.md`
2. **Załaduj aliasy**: `. .\gemini-aliases.ps1` (w root projektu)
3. **Użyj templates**: Copy-paste z `GEMINI_TEMPLATES.md`

## ⚡ Szybkie Komendy

```powershell
# Załaduj aliasy (z root projektu)
. .\gemini-aliases.ps1

# Użyj komend
gm-fix "błąd TypeScript"
gm-api weather "integracja z API pogody"
gm-comp news svelte "komponent RSS"
```

## 📤 Wysyłanie do Gemini

```powershell
# Wyślij całą dokumentację do Gemini
Get-ChildItem docs\gemini\*.md | ForEach-Object {
    Write-Host "=== $($_.Name) ===" -ForegroundColor Green
    Get-Content $_.FullName
} | Out-String | Set-Clipboard

# Następnie wklej do Gemini z prefiksem:
# "Przeczytaj tę dokumentację MyBonzo Gemini CLI i potwierdź zrozumienie:"
```

## 🔄 Aktualizacje

Dokumentacja jest synchronizowana z rozwojem MyBonzo. Sprawdzaj aktualizacje regularnie.

---

**Status**: ✅ Gotowa do użycia z Gemini CLI
