# 🚀 Auto-Deploy Configuration - mybonzo.com

## GitHub Actions Workflow Created ✅

Workflow automatycznie deployuje stronę **mybonzo.com** na Cloudflare Pages przy każdym pushu do `main`.

---

## 📋 Required GitHub Secrets

Musisz dodać 2 sekrety w GitHub:

### Krok 1: Pobierz Cloudflare API Token

1. Wejdź na: https://dash.cloudflare.com/profile/api-tokens
2. Kliknij **"Create Token"**
3. Użyj template: **"Edit Cloudflare Workers"**
4. Lub stwórz custom token z uprawnieniami:
   - **Account** → Cloudflare Pages: **Edit**
   - **Zone** → DNS: **Edit** (dla custom domain)
5. Skopiuj wygenerowany token

### Krok 2: Znajdź Account ID

1. Wejdź na: https://dash.cloudflare.com
2. Wybierz swoją domenę (mybonzo.com)
3. W prawym menu znajdź **"Account ID"**
4. Skopiuj

### Krok 3: Dodaj Secrets do GitHub

1. Wejdź na: https://github.com/Bonzokoles/luc-de-zen-on/settings/secrets/actions
2. Kliknij **"New repository secret"**
3. Dodaj dwa secrets:

#### Secret #1:
- **Name:** `CLOUDFLARE_API_TOKEN`
- **Value:** [Twój API Token z kroku 1]

#### Secret #2:
- **Name:** `CLOUDFLARE_ACCOUNT_ID`
- **Value:** [Twój Account ID z kroku 2]

---

## ✅ Verification

Po dodaniu secrets:

1. Zrób dowolną zmianę w projekcie
2. `git add -A`
3. `git commit -m "Test auto-deploy"`
4. `git push origin main`
5. Sprawdź zakładkę **Actions** w GitHub: https://github.com/Bonzokoles/luc-de-zen-on/actions

---

## 🌐 Domeny

Po poprawnej konfiguracji, każdy push na `main` automatycznie zaktualizuje:

- ✅ **luc-de-zen-on.pages.dev** (Cloudflare Pages default)
- ✅ **mybonzo.com** (Twoja custom domain)

---

## 📝 Workflow Details

- **Trigger:** Push do `main` branch
- **Node.js:** v20
- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Project name:** `luc-de-zen-on`

---

## 🔧 Troubleshooting

Jeśli deployment fail:
1. Sprawdź logi w GitHub Actions
2. Zweryfikuj czy secrets są poprawnie dodane
3. Upewnij się że API Token ma odpowiednie uprawnienia
4. Sprawdź czy Account ID jest prawidłowy

---

**Status:** ⏳ Waiting for GitHub Secrets configuration
