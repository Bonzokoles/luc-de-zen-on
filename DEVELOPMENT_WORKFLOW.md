# 🚀 MyBonzo Platform - Development Workflow Guide

## 📋 Feature Branch Strategy

### 1. 🎯 Przed rozpoczęciem pracy

```bash
# Upewnij się, że jesteś na main i masz najnowsze zmiany
git checkout main
git pull origin main
```

### 2. 🌿 Tworzenie feature branch

```bash
# Konwencja nazewnictwa:
# feature/short-description
# bugfix/issue-description  
# enhancement/improvement-name

git checkout -b feature/ai-chat-integration
git push -u origin feature/ai-chat-integration
```

### 3. 💻 Rozwój funkcjonalności

```bash
# Regularne commitowanie zmian
git add .
git commit -m "feat: add AI chat basic structure"
git push origin feature/ai-chat-integration
```

### 4. 🔄 Przed utworzeniem PR

```bash
# Pobierz najnowsze zmiany z main
git checkout main
git pull origin main

# Wróć do swojego brancha i zrób rebase
git checkout feature/ai-chat-integration
git rebase main

# Rozwiąż konflikty jeśli są, potem:
git push --force-with-lease origin feature/ai-chat-integration
```

### 5. 📝 Tworzenie Pull Request

1. Idź na GitHub
2. Kliknij "New Pull Request"
3. Wybierz base: `main` ← compare: `feature/ai-chat-integration`
4. Wypełnij template PR
5. Dodaj odpowiednie labele
6. Przypisz reviewerów

### 6. ✅ Po zaakceptowaniu PR

```bash
# Przejdź na main i pobierz zmiany
git checkout main
git pull origin main

# Usuń lokalny feature branch
git branch -d feature/ai-chat-integration

# Usuń remote branch (jeśli nie usunięty automatycznie)
git push origin --delete feature/ai-chat-integration
```

## 🛠️ Przygotowanie środowiska

### Lokalne setup
```bash
npm install
npm run dev
```

### Cloudflare setup
```bash
# Instalacja Wrangler
npm install -g wrangler

# Login do Cloudflare
wrangler login

# Test local development
wrangler dev
```

## 🎯 Następne kroki

**Kiedy zacząć tworzyć branches:**
- ✅ **TERAZ**: Infrastruktura workflow (CI/CD, templates) - ✅ DONE
- 🔜 **PODCZAS ROZWOJU**: Feature branches gdy faktycznie implementujemy funkcje
- 📋 **PROCESS**: Issue → Branch → Development → PR → Merge → Cleanup

**Przykładowy flow rozwoju:**
1. Tworzymy issue: "Add AI Chat Integration"  
2. GitHub utworzy sugerowaną nazwę: `feature/issue-123-ai-chat-integration`
3. Developer tworzy branch i implementuje
4. PR → Review → Merge → Branch cleanup

To podejście daje nam maksymalną flexibilność i czyste repo! 🚀
