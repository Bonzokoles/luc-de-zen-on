# GitHub CLI Guide / Przewodnik GitHub CLI

## English

### What is GitHub CLI?

GitHub CLI (`gh`) is a command-line tool that brings GitHub functionality to your terminal. It allows you to interact with GitHub repositories, issues, pull requests, and more without leaving the command line.

### Installation

GitHub CLI is already installed in our GitHub Actions workflows. For local development:

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh
```

**Windows:**
```bash
winget install --id GitHub.cli
```

### Authentication

To use GitHub CLI locally, you need to authenticate:

```bash
gh auth login
```

Follow the prompts to authenticate via web browser or token.

### Common Commands

#### Working with Pull Requests
```bash
# List pull requests
gh pr list

# View a specific PR
gh pr view [number]

# Create a new PR
gh pr create --title "Your Title" --body "Description"

# Comment on a PR
gh pr comment [number] --body "Your comment"

# Merge a PR
gh pr merge [number]
```

#### Working with Issues
```bash
# List issues
gh issue list

# Create a new issue
gh issue create --title "Issue title" --body "Description"

# View an issue
gh issue view [number]

# Close an issue
gh issue close [number]
```

#### Repository Operations
```bash
# View repository
gh repo view

# Clone a repository
gh repo clone owner/repo

# Create a new repository
gh repo create
```

#### Workflow Operations
```bash
# List workflows
gh workflow list

# View workflow runs
gh run list

# View specific run
gh run view [run-id]

# Manually trigger a workflow
gh workflow run [workflow-name]
```

### Usage in This Project

GitHub CLI is integrated into our deployment workflow (`.github/workflows/deploy.yml`):

1. **Automatic Setup**: The workflow automatically sets up and authenticates GitHub CLI
2. **Deployment Notifications**: After deployment, the workflow uses `gh` to comment on pull requests with deployment status
3. **Status Updates**: The workflow can create issues or update existing ones based on deployment results

### Examples for This Repository

```bash
# Check deployment workflow status
gh run list --workflow=deploy.yml

# View the latest deployment
gh run view --log

# Create a PR for your changes
gh pr create --title "Add new feature" --body "Description of changes"

# Check if the site is deployed
curl -f https://luc-de-zen-on.pages.dev
```

---

## Polski

### Czym jest GitHub CLI?

GitHub CLI (`gh`) to narzędzie wiersza poleceń, które przynosi funkcjonalność GitHub do Twojego terminala. Pozwala na interakcję z repozytoriami GitHub, zgłoszeniami, pull requestami i więcej bez opuszczania wiersza poleceń.

### Instalacja

GitHub CLI jest już zainstalowany w naszych workflow GitHub Actions. Do lokalnego rozwoju:

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh
```

**Windows:**
```bash
winget install --id GitHub.cli
```

### Uwierzytelnianie

Aby używać GitHub CLI lokalnie, musisz się uwierzytelnić:

```bash
gh auth login
```

Postępuj zgodnie z instrukcjami, aby uwierzytelnić się przez przeglądarkę lub token.

### Podstawowe Komendy

#### Praca z Pull Requestami
```bash
# Lista pull requestów
gh pr list

# Zobacz konkretny PR
gh pr view [numer]

# Utwórz nowy PR
gh pr create --title "Twój Tytuł" --body "Opis"

# Skomentuj PR
gh pr comment [numer] --body "Twój komentarz"

# Scal PR
gh pr merge [numer]
```

#### Praca ze Zgłoszeniami (Issues)
```bash
# Lista zgłoszeń
gh issue list

# Utwórz nowe zgłoszenie
gh issue create --title "Tytuł zgłoszenia" --body "Opis"

# Zobacz zgłoszenie
gh issue view [numer]

# Zamknij zgłoszenie
gh issue close [numer]
```

#### Operacje na Repozytorium
```bash
# Zobacz repozytorium
gh repo view

# Sklonuj repozytorium
gh repo clone właściciel/repo

# Utwórz nowe repozytorium
gh repo create
```

#### Operacje Workflow
```bash
# Lista workflow
gh workflow list

# Zobacz uruchomienia workflow
gh run list

# Zobacz konkretne uruchomienie
gh run view [run-id]

# Ręcznie uruchom workflow
gh workflow run [nazwa-workflow]
```

### Użycie w Tym Projekcie

GitHub CLI jest zintegrowany z naszym workflow wdrożeniowym (`.github/workflows/deploy.yml`):

1. **Automatyczna Konfiguracja**: Workflow automatycznie konfiguruje i uwierzytelnia GitHub CLI
2. **Powiadomienia o Wdrożeniu**: Po wdrożeniu, workflow używa `gh` do komentowania pull requestów ze statusem wdrożenia
3. **Aktualizacje Statusu**: Workflow może tworzyć zgłoszenia lub aktualizować istniejące na podstawie wyników wdrożenia

### Przykłady dla Tego Repozytorium

```bash
# Sprawdź status workflow wdrożenia
gh run list --workflow=deploy.yml

# Zobacz ostatnie wdrożenie
gh run view --log

# Utwórz PR dla swoich zmian
gh pr create --title "Dodaj nową funkcję" --body "Opis zmian"

# Sprawdź czy strona jest wdrożona
curl -f https://luc-de-zen-on.pages.dev
```

## Additional Resources / Dodatkowe Zasoby

- [GitHub CLI Official Documentation](https://cli.github.com/manual/)
- [GitHub CLI Repository](https://github.com/cli/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
