# Instrukcja dodania domeny www.myonzo.com

## Automatyczne dodanie przez API Cloudflare

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/7f490d58a478c6baccb0ae01ea1d87c3/pages/projects/luc-de-zen-on/domains" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{"name": "www.myonzo.com"}'
```

## Ręczne dodanie przez Dashboard

1. **Zaloguj się do Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Przejdź do Workers & Pages**
3. **Wybierz projekt**: `luc-de-zen-on`
4. **Przejdź do Custom domains** 
5. **Kliknij "Set up a custom domain"**
6. **Wprowadź domenę**: `www.myonzo.com`
7. **Kliknij Continue**

## Co się dzieje automatycznie (domena w Cloudflare)

✅ **Cloudflare automatycznie**:
- Utworzy rekord CNAME: `www` → `luc-de-zen-on.pages.dev`
- Wyda certyfikat SSL dla www.myonzo.com
- Skonfiguruje CDN i proxy

## Status po konfiguracji

- **Obecny URL**: https://luc-de-zen-on.pages.dev
- **Docelowy URL**: https://www.myonzo.com
- **SSL**: Automatycznie od Cloudflare  
- **CDN**: Włączony globalnie

## Weryfikacja

```bash
# Sprawdź DNS
nslookup www.myonzo.com

# Sprawdź certyfikat SSL
curl -I https://www.myonzo.com
```

## Troubleshooting

- **Błąd 522**: Domain nie został dodany w Pages Dashboard
- **SSL Error**: Poczekaj na wystawienie certyfikatu (do 15 minut)
- **DNS nie resolves**: Sprawdź czy zona myonzo.com jest w tym samym koncie Cloudflare

---
**Zaktualizowano**: wrangler.toml już zawiera PUBLIC_SITE_URL = "https://www.myonzo.com"
