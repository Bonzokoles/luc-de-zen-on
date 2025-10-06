# MyBonzo Git Workflow - Przewodnik Szybkiego Startu

## 🚀 Szybkie Komendy

### 1. Rozpoczęcie nowej funkcjonalności
```bash
# Linux/Mac
./dev-helper.sh new_feature nazwa-funkcjonalnosci

# Windows PowerShell
. .\dev-helper.ps1; New-FeatureBranch "nazwa-funkcjonalnosci"
```

### 2. Sprawdzenie statusu
```bash
# Linux/Mac
./dev-helper.sh check_status

# Windows PowerShell
. .\dev-helper.ps1; Check-RepoStatus
```

### 3. Szybki commit
```bash
# Linux/Mac
./dev-helper.sh commit "feat: opis zmian"

# Windows PowerShell
. .\dev-helper.ps1; Invoke-QuickCommit "feat: opis zmian"
```

### 4. Test lokalny
```bash
# Linux/Mac
./dev-helper.sh test

# Windows PowerShell
. .\dev-helper.ps1; Test-Local
```

### 5. Przygotowanie do merge
```bash
# Linux/Mac
./dev-helper.sh prepare_merge

# Windows PowerShell
. .\dev-helper.ps1; Invoke-PrepareMerge
```

## 📋 Konwencje Commit Messages

### Typy commitów:
- `feat:` - Nowa funkcjonalność
- `fix:` - Naprawa błędu
- `docs:` - Zmiany w dokumentacji
- `style:` - Formatowanie, białe znaki (nie wpływa na kod)
- `refactor:` - Refaktoryzacja kodu
- `test:` - Dodanie lub modyfikacja testów
- `chore:` - Zmiany w buildzie, narzędziach

### Przykłady:
```
feat: dodanie POLACZEK AI assistant z integracją MyBonzo
fix: naprawa błędu w dokumentationIndex.js
docs: aktualizacja README z instrukcjami deployment
refactor: optymalizacja obsługi AI models
```

## 🌿 Strategia Branch'owania

### Branch'e główne:
- `main` - Produkcja (zawsze stabilny)
- `feature/*` - Nowe funkcjonalności
- `hotfix/*` - Szybkie naprawy

### Konwencja nazewnictwa:
```
feature/polaczek-integration
feature/documentation-system
feature/ai-models-upgrade
hotfix/cors-headers-fix
```

## 🔄 Workflow Krok po Kroku

### 1. Nowa funkcjonalność:
```bash
# 1. Utwórz feature branch
./dev-helper.sh new_feature polaczek-docs

# 2. Pracuj nad kodem
# ... edytuj pliki ...

# 3. Commituj zmiany
./dev-helper.sh commit "feat: dodanie dokumentacji POLACZEK"

# 4. Testuj lokalnie
./dev-helper.sh test

# 5. Przygotuj do merge
./dev-helper.sh prepare_merge

# 6. Push i PR
git push origin feature/polaczek-docs
```

### 2. Szybka naprawa:
```bash
# 1. Utwórz hotfix branch
git checkout -b hotfix/cors-fix

# 2. Napraw problem
# ... edytuj pliki ...

# 3. Commit i push
./dev-helper.sh commit "fix: naprawa CORS headers"
git push origin hotfix/cors-fix

# 4. Merge bezpośrednio do main
```

## 🚨 Procedury Awaryjne

### Rollback ostatniego commit:
```bash
./dev-helper.sh rollback
```

### Cofnięcie niepoprawnego merge:
```bash
git checkout main
git reset --hard HEAD~1
git push --force-with-lease origin main
```

### Przywrócenie poprzedniej wersji:
```bash
git checkout main
git revert <commit-hash>
git push origin main
```

## 📊 Monitoring Deployment

### Cloudflare Pages:
- URL: https://mybonzo-hub.pages.dev
- Dashboard: Cloudflare -> Pages -> mybonzo-hub

### Statusy deployment:
- ✅ Success - Deployment zakończony pomyślnie
- 🟡 Building - W trakcie budowania
- ❌ Failed - Błąd deployment

### Logi dostępne w:
- Cloudflare Dashboard
- GitHub Actions (jeśli skonfigurowane)

## 🔧 Rozwiązywanie Problemów

### Build fails:
```bash
# Sprawdź logi
npm run build

# Wyczyść node_modules
rm -rf node_modules package-lock.json
npm install
```

### Konflikt podczas rebase:
```bash
# Rozwiąż konflikty w edytorze
git add .
git rebase --continue
```

### Worker nie deployuje:
```bash
# Sprawdź konfigurację
cat wrangler.toml

# Manual deploy
npx wrangler deploy
```

## 📝 Checklist przed Merge

- [ ] Kod przeszedł przez `npm run build`
- [ ] Wszystkie testy lokalne działają
- [ ] Commit messages zgodne z konwencją
- [ ] Rebase z aktualnym main
- [ ] Brak konfliktów
- [ ] Feature branch jest up-to-date

## 🎯 Best Practices

1. **Małe, częste commit'y** - lepiej 5 małych niż 1 duży
2. **Opisowe commit messages** - wyjaśnij DLACZEGO, nie tylko CO
3. **Testuj przed push** - zawsze sprawdź czy build działa
4. **Aktualizuj dokumentację** - nowe funkcje = nowa dokumentacja
5. **Review przed merge** - zawsze przejrzyj zmiany
6. **Backup przed dużymi zmianami** - git branch backup-main

## 📞 Pomoc

Jeśli masz problemy:
1. Sprawdź `DEVELOPMENT_WORKFLOW.md` - pełna dokumentacja
2. Użyj `./dev-helper.sh help` - lista komend
3. Sprawdź GitHub Issues
4. Skontaktuj się z teamem
