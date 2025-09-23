# ZASADY ROZWOJU MYBONZO - WORKFLOW BEZPIECZNY

## 🚨 GŁÓWNE ZASADY PRACY

### 1. NIGDY bezpośrednio na MAIN
❌ **ZABRONIONE**: `git push origin main` bez testów
❌ **ZABRONIONE**: Bezpośrednie zmiany w produkcji
❌ **ZABRONIONE**: Commitowanie bez lokalnych testów

### 2. WORKFLOW OBOWIĄZKOWY
```
LOKALNA PRACA → TESTY LOKALNE → mybonzo_zoo → main
```

## 📋 PROCEDURA KROK PO KROK

### KROK 1: Praca lokalna
```bash
# Zawsze zaczynaj od aktualnego main
git checkout main
git pull origin main

# Twórz nową feature branch lub używaj mybonzo_zoo
git checkout -b feature/nowa-funkcja
# LUB
git checkout mybonzo_zoo
git pull origin mybonzo_zoo
```

### KROK 2: Rozwój i testy lokalne
```bash
# Praca nad kodem
npm run dev

# OBOWIĄZKOWE TESTY:
# ✅ http://localhost:4321 działa
# ✅ Wszystkie funkcje działają
# ✅ Brak błędów w konsoli
# ✅ Voice Button funkcjonuje
# ✅ API endpoints odpowiadają
```

### KROK 3: Deploy do mybonzo_zoo (STAGING)
```bash
# Tylko gdy wszystko działa lokalnie
git add .
git commit -m "Feature: opis zmian"
git checkout mybonzo_zoo
git merge feature/nowa-funkcja
git push origin mybonzo_zoo

# CZEKAJ 2-3 minuty na deploy Cloudflare
# TESTUJ na mybonzo_zoo.pages.dev
```

### KROK 4: Deploy do main (PRODUKCJA)
```bash
# Tylko gdy mybonzo_zoo działa bez problemów
git checkout main
git merge mybonzo_zoo
git push origin main
```

## 🛡️ ZABEZPIECZENIA

### Przed każdym pushem:
- [ ] `npm run build` przeszedł bez błędów
- [ ] Lokalne testy przeszły pomyślnie
- [ ] Sprawdzono wszystkie nowe funkcje
- [ ] Nie ma konfliktów w git

### Backup przed większymi zmianami:
```bash
# Utwórz backup w folderze BACKUP_
cp -r src/ BACKUP_$(date +%Y%m%d_%H%M%S)/
```

## 🔄 BRANCHING STRATEGY

```
main (PRODUKCJA)
├── mybonzo_zoo (STAGING)
├── feature/voice-ai
├── feature/stable-diffusion
└── hotfix/critical-bug
```

### Nazewnictwo branchy:
- `feature/nazwa` - nowe funkcje
- `hotfix/nazwa` - pilne poprawki
- `mybonzo_zoo` - staging branch
- `main` - produkcja

## 🚫 CO NIE ROBIĆ

1. **Nie commituj credentials**
   - Zawsze sprawdź `.gitignore`
   - Usuń `credentials/` z git

2. **Nie łącz dużych zmian**
   - Rób małe, atomowe commity
   - Jeden commit = jedna funkcja

3. **Nie pomijaj testów lokalnych**
   - Zawsze `npm run dev` przed pushem
   - Sprawdź w przeglądarce

## 📁 STRUKTURA BACKUPÓW

```
mybonzo/
├── BACKUP_CURRENT_WWW_VERSION/  ← Aktualna wersja produkcyjna
├── BACKUP_2025_09_22/           ← Backupy datowane
├── BACKUP_VOICE_AI_WORKING/     ← Backupy funkcjonalne
└── mybonzo-github/              ← Workspace rozwojowy
```

## 🎯 CHECKLIST PRZED PUSHEM

### Rozwój lokalny:
- [ ] Kod działa lokalnie (`npm run dev`)
- [ ] Brak błędów w konsoli
- [ ] Wszystkie funkcje testowane
- [ ] Build przechodzi (`npm run build`)

### Staging (mybonzo_zoo):
- [ ] Push do mybonzo_zoo
- [ ] Czekanie 2-3 minuty
- [ ] Test na staging URL
- [ ] Potwierdzenie działania

### Produkcja (main):
- [ ] Staging działa bez problemów
- [ ] Merge do main
- [ ] Push z pełną pewnością

## 🆘 W RAZIE PROBLEMÓW

1. **Cofnij do ostatniego działającego commita:**
   ```bash
   git reset --hard HEAD~1
   ```

2. **Przywróć z backupu:**
   ```bash
   cp BACKUP_CURRENT_WWW_VERSION/* src/
   ```

3. **Force push w ostateczności:**
   ```bash
   git push origin main --force
   ```

---
**📌 PAMIĘTAJ**: Bezpieczny rozwój = szczęśliwy developer + działająca produkcja!