# 🚀 MyBonzo Development Workflow Guide

## 📋 Przegląd Workflow

MyBonzo używa **Git Flow** z automatycznym deploymentem na Cloudflare Pages.

## 🔄 Podstawowy Workflow

### 1. 🌟 Nowa funkcjonalność/naprawa błędu

```bash
# Utwórz nowy branch od main
git checkout main
git pull origin main
git checkout -b feature/nowa-funkcjonalnost
# lub
git checkout -b hotfix/naprawa-bledu
```

### 2. 💻 Rozwój lokalny

```bash
# Pracuj nad kodem
# Testuj lokalnie
npm run dev
# lub
npm run build && npm run preview

# Commituj często z opisowymi wiadomościami
git add .
git commit -m "feat: dodanie nowej funkcjonalności X"
```

### 3. 🧪 Testowanie

```bash
# Przed merge - zawsze testuj lokalnie
npm run build  # Sprawdź czy build się kompiluje
npm run dev    # Testuj funkcjonalność
```

### 4. 🔀 Integracja z main

```bash
# Aktualizuj swój branch
git checkout main
git pull origin main
git checkout feature/nowa-funkcjonalnost
git rebase main  # lub merge main

# Push do GitHub
git push origin feature/nowa-funkcjonalnost
```

### 5. 🎯 Pull Request

1. Utwórz PR na GitHub
2. Opisz zmiany
3. Poczekaj na review (jeśli zespół)
4. Po zatwierdzeniu - merge do main

### 6. 🚀 Automatyczny Deploy

- **Push do main** → automatyczny deploy na Cloudflare Pages
- **Monitorowanie** → sprawdź czy deploy się udał
- **Rollback** → w razie problemów

## 📝 Konwencje Nazewnictwa Branchy

```
feature/nazwa-funkcjonalnosci    # Nowe funkcjonalności
hotfix/naprawa-problemu         # Pilne naprawy
bugfix/nazwa-bledu              # Standardowe naprawy
docs/aktualizacja-dokumentacji  # Dokumentacja
refactor/nazwa-refactoringu     # Refaktoryzacja
```

## 💬 Konwencje Commit Messages

```
feat: dodanie nowej funkcjonalności
fix: naprawa błędu w POLACZEK API
docs: aktualizacja dokumentacji
style: formatowanie kodu
refactor: reorganizacja kodu
test: dodanie testów
chore: aktualizacja zależności
```

## 🔄 Przykład Pełnego Workflow

```bash
# 1. Przygotowanie
git checkout main
git pull origin main

# 2. Nowy feature branch
git checkout -b feature/polaczek-dokumentacja-integracja

# 3. Rozwój i testowanie
# ... praca nad kodem ...
npm run dev  # testuj lokalnie

# 4. Commit zmian
git add .
git commit -m "feat: integracja POLACZEK z systemem dokumentacji"

# 5. Aktualizacja i push
git checkout main
git pull origin main
git checkout feature/polaczek-dokumentacja-integracja
git rebase main
git push origin feature/polaczek-dokumentacja-integracja

# 6. Create Pull Request na GitHub

# 7. Po merge - automatyczny deploy
```

## ⚠️ Procedury Awaryjne

### 🔧 Rollback w przypadku problemów

```bash
# Szybki rollback do poprzedniej wersji
git checkout main
git reset --hard HEAD~1  # Cofnij ostatni commit
git push --force-with-lease origin main
```

### 🚨 Hotfix dla krytycznych błędów

```bash
# Pilny hotfix
git checkout main
git checkout -b hotfix/critical-api-fix
# ... napraw problem ...
git commit -m "hotfix: naprawa krytycznego błędu API"
git push origin hotfix/critical-api-fix
# Utwórz PR z priorytetem i merge natychmiast
```

## 📊 Monitoring Deploymentów

### Sprawdzanie statusu

```bash
# Test podstawowych endpointów po deploy
curl https://luc-de-zen-on.pages.dev/api/health
curl -X POST https://luc-de-zen-on.pages.dev/api/polaczek-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test deployment"}'
```

### GitHub Actions

- Każdy push do main wyzwala automatyczny build i deploy
- Monitoruj zakładkę "Actions" w GitHub
- Sprawdzaj logi w przypadku błędów

## 🛡️ Zasady Bezpieczeństwa

1. **Nigdy nie commituj** sekretów/kluczy API
2. **Zawsze testuj lokalnie** przed merge
3. **Używaj opisowych commit messages**
4. **Regularnie aktualizuj** dependencies
5. **Backup przed większymi zmianami**

## 🔧 Przydatne Komendy

```bash
# Sprawdź aktualny branch
git branch

# Zobacz historię commitów
git log --oneline

# Cofnij niezcommitowane zmiany
git restore .

# Zmień ostatni commit message
git commit --amend -m "nowa wiadomość"

# Sprawdź różnice przed commitem
git diff

# Stash zmian na później
git stash
git stash pop
```

## 🎯 Checklist przed każdym Release

- [ ] Kod skompilowany bez błędów
- [ ] Testy lokalne przeszły
- [ ] Dokumentacja zaktualizowana
- [ ] Commit messages opisowe
- [ ] Branch zaktualizowany z main
- [ ] Pull Request utworzony
- [ ] Deploy monitorowany
- [ ] Endpointy działają poprawnie

---

**Pamiętaj:** Ten workflow zapewnia stabilność i możliwość szybkiego rollbacku w przypadku problemów! 🛡️