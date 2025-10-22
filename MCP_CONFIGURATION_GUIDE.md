# Konfiguracja MCP (Model Context Protocol)

## 📋 Pliki konfiguracyjne

### 1. Claude Desktop Configuration
**Plik**: `claude-desktop-mcp-config.json`
**Lokalizacja**: Skopiuj do katalogu konfiguracji Claude Desktop

### 2. VS Code MCP Settings
**Plik**: `.vscode/settings.json` 
**Status**: ✅ Oczyszczony z hardcoded tokenów

## 🔧 Dostępne serwery MCP

### 🗂️ **filesystem-zenon**
- **Funkcja**: Dostęp do dysków lokalnych
- **Dyski**: F:\, W:\, R:\, Q:\, T:\, U:\, S:\, V:\, E:\, H:\, C:\, M:\

### 🔍 **brave-search**
- **Funkcja**: Wyszukiwarka internetowa
- **Klucz**: BSAa8VqK4CjkKCwCNtTqlCDMcLLDvWD

### 🖥️ **desktop-commander**
- **Funkcja**: Kontrola systemu desktop

### 🧠 **knowledge-graph**
- **Funkcja**: Graf wiedzy z pamięcią
- **Ścieżka**: R:\CLAUDE_MEMORY

### ☁️ **cloudflare-developer-platform**
- **Funkcja**: Zarządzanie Cloudflare
- **Token**: Wymaga aktualizacji w pliku konfiguracyjnym

### 🐳 **MCP_DOCKER**
- **Funkcja**: Gateway Docker MCP
- **Typ**: stdio

## ✅ **Dodatkowo aktywowane w VS Code:**

### 🔍 **Codacy MCP** - ✅ AKTYWNY

- **codacy_cli_analyze** - analiza jakości kodu
- **codacy_list_tools** - lista narzędzi (58 dostępnych)
- **codacy_get_pattern** - szczegóły wzorców

### 📚 **Context7 MCP** - ✅ AKTYWNY

- **resolve-library-id** - wyszukiwanie bibliotek
- **get-library-docs** - dokumentacja bibliotek

### ☁️ **Azure Tools** - ✅ AKTYWNY

- **azure_resources-query** - zapytania do Azure Resource Graph
- **azure_cli-generate** - generowanie poleceń Azure CLI
- **azure_auth** - zarządzanie autoryzacją
- **azure_bicep** - moduły Bicep

### 📖 **Microsoft Documentation** - ✅ AKTYWNY

- **microsoft_docs_search** - wyszukiwanie dokumentacji
- **microsoft_docs_fetch** - pobieranie stron
- **microsoft_code_sample_search** - przykłady kodu

### 🎯 **Atlassian (Jira)** - ✅ AKTYWNY

- **jira_issue_management** - zarządzanie zadaniami
- **jira_search** - wyszukiwanie w Jira
- **jira_create/edit** - tworzenie/edycja zadań

### 🐙 **Git Tools (GitKraken)** - ✅ AKTYWNY

- **git_status/commit/push** - operacje Git
- **git_branch/checkout** - zarządzanie gałęziami
- **git_blame/diff** - analiza zmian

### 🤗 **Hugging Face** - ✅ AKTYWNY

- **model_search** - wyszukiwanie modeli ML
- **dataset_search** - wyszukiwanie zbiorów danych
- **paper_search** - wyszukiwanie publikacji
- **flux1_schnell_infer** - generowanie obrazów

### 🐍 **Python Environment** - ✅ AKTYWNY

- **configure_python_environment** - konfiguracja środowiska
- **install_python_packages** - instalacja pakietów
- **get_python_details** - informacje o środowisku

## ⚠️ Bezpieczeństwo

### ✅ **Naprawione**

- Usunięto hardcoded tokeny z `.vscode/settings.json`
- Tokeny będą pobierane ze zmiennych środowiskowych

### 🔄 **Do zrobienia**

1. Zaktualizuj `CLOUDFLARE_API_TOKEN` w `claude-desktop-mcp-config.json`
2. Ustaw zmienne środowiskowe systemowe dla tokenów
3. Sprawdź czy stary token jest aktywny w Cloudflare Dashboard

## 📖 Użycie

### Claude Desktop:
1. Skopiuj `claude-desktop-mcp-config.json` do odpowiedniego katalogu
2. Zaktualizuj token Cloudflare
3. Restart Claude Desktop

### VS Code:
MCP będzie używać zmiennych środowiskowych automatycznie.