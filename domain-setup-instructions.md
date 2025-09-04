# Konfiguracja domeny www.mybonzo.com dla Cloudflare Pages

## Krok 1: Dodaj custom domain w Cloudflare Pages Dashboard

1. **Zaloguj się do Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Przejdź do Workers & Pages** 
3. **Wybierz projekt**: `luc-de-zen-on`
4. **Przejdź do Custom domains**
5. **Kliknij "Set up a custom domain"**
6. **Wprowadź domenę**: `www.mybonzo.com`
7. **Kliknij Continue**

## Krok 2: Konfiguracja DNS

### Opcja A: Jeśli domena jest już w Cloudflare
- Cloudflare automatycznie utworzy rekord CNAME
- Typ: `CNAME`
- Nazwa: `www`  
- Cel: `03ea1446.luc-de-zen-on.pages.dev`

### Opcja B: Jeśli domena NIE jest w Cloudflare
1. **Zaloguj się do swojego dostawcy DNS** (gdzie kupiona domena)
2. **Dodaj rekord CNAME**:
   - Typ: `CNAME`
   - Nazwa: `www`
   - Wartość: `03ea1446.luc-de-zen-on.pages.dev`
   - TTL: 300 (lub domyślny)

### Opcja C: Przeniesienie nameserverów do Cloudflare (ZALECANE)
1. **W Cloudflare Dashboard**:
   - Dodaj strefę `mybonzo.com`
   - Skopiuj nameservery Cloudflare
2. **U dostawcy domeny**:
   - Zmień nameservery na te z Cloudflare
   - Może potrwać 24-48h na propagację

## Krok 3: Weryfikacja
Po konfiguracji DNS sprawdź:
```bash
nslookup www.mybonzo.com
# Powinno zwrócić: 03ea1446.luc-de-zen-on.pages.dev
```

## Krok 4: Przekierowanie z apex domain (opcjonalne)
Aby `mybonzo.com` przekierowywało na `www.mybonzo.com`:

### W Cloudflare (jeśli nameservery w CF):
1. **Page Rules** lub **Redirect Rules**
2. **Utwórz regułę**:
   - Jeśli: `mybonzo.com/*`
   - To: `https://www.mybonzo.com/$1` (301 przekierowanie)

## Status po konfiguracji:
✅ **Docelowy URL**: https://www.mybonzo.com
✅ **Obecny URL**: https://03ea1446.luc-de-zen-on.pages.dev  
✅ **SSL**: Automatycznie od Cloudflare
✅ **CDN**: Włączony globalnie

## Troubleshooting:
- **522 Error**: Custom domain nie został dodany w Pages Dashboard
- **DNS nie rozwiązuje**: Poczekaj na propagację DNS (do 48h)
- **SSL Error**: Poczekaj na wystawienie certyfikatu (do 24h)

---
**Uwaga**: Jeśli potrzebujesz pomocy z konfiguracją DNS, podaj gdzie masz kupioną domenę mybonzo.com.
