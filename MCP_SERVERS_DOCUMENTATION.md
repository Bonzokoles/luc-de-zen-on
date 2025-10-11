# MCP Servers Documentation

## Obecnie Zaimplementowane MCP Serwery w Left Panel

### Aktywne MCP Serwery (z funkcjonalnością)

1. **🌐 BROWSER** - `mcpBrowserBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~325)
   - **Funkcja**: `data-action="open-mcp-browser"`
   - **Status**: ✅ Aktywny
   - **Opis**: Automatyzacja przeglądarki, scraping, interakcje z stronami web

2. **🐳 DOCKER** - `mcpDockerBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~336)
   - **Funkcja**: `data-action="open-mcp-docker"`
   - **Status**: ✅ Aktywny
   - **Opis**: Zarządzanie kontenerami Docker, obrazami, deployment

3. **⚡ GITHUB** - `mcpGithubBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~347)
   - **Funkcja**: `data-action="open-mcp-github"`
   - **Status**: ✅ Aktywny
   - **Opis**: Integracja z GitHub API, repo management, PR operations

4. **🧠 KNOWLEDGE** - `mcpKnowledgeBtn`
   - **Lokalizacja**: `src/pages/index.astro` (linia ~358)
   - **Funkcja**: `data-action="open-mcp-knowledge"`
   - **Status**: ✅ Aktywny
   - **Opis**: Zarządzanie bazą wiedzy, knowledge graph

### Nowe MCP Serwery (przyciski dodane, funkcje do implementacji)

5. **🗄️ SQLITE** - `mcpSqliteBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~370)
   - **Funkcja**: `data-action="open-mcp-sqlite"`
   - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
   - **Opis**: Operacje na bazach danych SQLite, queries, schema management

6. **📁 FILESYSTEM** - `mcpFilesystemBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~381)
   - **Funkcja**: `data-action="open-mcp-filesystem"`
   - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
   - **Opis**: Zarządzanie plikami systemowymi, operacje I/O

7. **🐘 POSTGRES** - `mcpPostgresBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~392)
   - **Funkcja**: `data-action="open-mcp-postgres"`
   - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
   - **Opis**: Zaawansowane operacje PostgreSQL, complex queries

8. **🌍 FETCH** - `mcpFetchBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~403)
   - **Funkcja**: `data-action="open-mcp-fetch"`
   - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
   - **Opis**: HTTP requests, API calls, web data fetching

9. **🔍 BRAVE SEARCH** - `mcpBraveSearchBtn`

   - **Lokalizacja**: `src/pages/index.astro` (linia ~414)
   - **Funkcja**: `data-action="open-mcp-brave-search"`
   - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
   - **Opis**: Web search via Brave Search API, privacy-focused search

10. **📝 OBSIDIAN** - `mcpObsidianBtn`

    - **Lokalizacja**: `src/pages/index.astro` (linia ~425)
    - **Funkcja**: `data-action="open-mcp-obsidian"`
    - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
    - **Opis**: Integracja z Obsidian vault, note management

11. **💬 SLACK** - `mcpSlackBtn`
    - **Lokalizacja**: `src/pages/index.astro` (linia ~436)
    - **Funkcja**: `data-action="open-mcp-slack"`
    - **Status**: 🔄 Przycisk dodany, funkcje do implementacji
    - **Opis**: Slack workspace integration, messaging, notifications

## Architektura MCP Serwerów

### Struktura w Left Panel

- **Panel Admin** (🔧 PANEL ADMIN)
- **Login** (🔑 LOGIN)
- **MCP Serwery** (11 przycisków)
- **OpenAI MCP Akcje** (istniejące)

### Style CSS

- Klasa: `.left-panel-fixed`
- Kontenery: `.floating-widget-container`
- Przyciski: `.left-btn`
- Lokalizacja stylów: `src/pages/index.astro` (linie ~2300+)

## Plan Implementacji Funkcji

### Faza 1 - Core Database & File Operations

1. **SQLite Server** - podstawowe operacje DB
2. **Filesystem Server** - file management
3. **Fetch Server** - HTTP requests

### Faza 2 - Advanced Integrations

1. **PostgreSQL Server** - advanced DB operations
2. **Brave Search Server** - web search capabilities
3. **Obsidian Server** - knowledge management

### Faza 3 - Communication & Collaboration

1. **Slack Server** - team communication integration

## Notatki Techniczne

- Wszystkie MCP serwery używają `data-action` attributes
- JavaScript handlers będą dodane w `src/pages/index.astro` w sekcji `<script>`
- Funkcjonalność będzie implementowana jako moduły w `src/mcp-servers/`
- Każdy serwer będzie miał własny config w `src/config/mcp-servers.ts`

## Aktualizacja: 11 października 2025

- Dodano 7 nowych przycisków MCP serwerów
- Usunięto duplikaty DuckDB, PayPal, HuggingFace, Memory
- Struktura ready do implementacji funkcji
