# Development Workflow Guide
# Jak pracować z dwoma repozytoriami: development i production

## STRUKTURA:

```
Development Repo: luc-de-zen-on
├── Testowanie nowych funkcji
├── Eksperymenty
├── Deploy: luc-de-zen-on.pages.dev (development)
└── Branch: main (development)

Production Repo: mybonzo-production  
├── Tylko stabilny kod
├── Bezpieczne wersje
├── Deploy: mybonzo.com (production)
└── Branch: main (production)
```

## WORKFLOW:

### 1. Praca Developer (Codziennie)
```bash
# Pracuj w luc-de-zen-on
cd Q:\mybonzo\luc-de-zen-on

# Develop + test locally
pnpm dev

# Commit changes
git add .
git commit -m "Feature: nowa funkcjonalność"
git push

# Test na development domain
# https://luc-de-zen-on.pages.dev
```

### 2. Deploy to Production (Tylko gdy wszystko działa!)
```bash
# Uruchom production script
.\deploy-to-production.ps1

# Lub z custom message:
.\deploy-to-production.ps1 -CommitMessage "Release: nowa wersja stabilna"
```

### 3. Rollback (Jeśli coś nie działa)
```bash
# Production repo ma zawsze ostatnią działającą wersję
# Można szybko przywrócić poprzedni commit
```

## ZALETY:

✅ **Development** - szybkie iteracje, eksperymenty
✅ **Production** - tylko przetestowany kod  
✅ **Bezpieczeństwo** - production zawsze stabilny
✅ **Rollback** - łatwy powrót do działającej wersji
✅ **Testing** - development domain do testów

## ZASADY:

⚠️ **NIGDY** nie commituj bezpośrednio do production repo
⚠️ **ZAWSZE** testuj na development przed production
⚠️ **TYLKO** stabilne funkcje idą do production
⚠️ **BACKUP** - production repo to zawsze ostatnia działająca wersja

## DOMAINS:

- **Development**: https://luc-de-zen-on.pages.dev
- **Production**: https://mybonzo.com
- **Admin Development**: https://luc-de-zen-on.pages.dev/admin
- **Admin Production**: https://mybonzo.com/admin
