# MyBonzo AI Bridge - Dokumentacja Połączenia Aplikacji

## 📋 Przegląd Projektu

System Bridge Cloud Apps umożliwia połączenie między:
- **Aplikacją główną**: `https://www.mybonzo.com` 
- **Blogiem i narzędziami**: `https://www.mybonzoaiblog.com`

Projekt składa się z:
1. **Gateway Worker** - Cloudflare Worker obsługujący komunikację API
2. **AI Bridge Interface** - Interfejs wizualny łączący systemy 12↔9 klawiszy
3. **Blog Subordinate Window** - Podrzędne okno z skrótami do bloga

## 🚀 Szybki Start

### 1. Wdrożenie Gateway Worker

```bash
cd gateway-worker
npm install
npm run deploy
```

### 2. Konfiguracja Custom Domain

1. W Cloudflare Dashboard → **Workers & Pages**
2. Wybierz worker `mybonzo-gateway`
3. **Settings → Domains & Routes → Add → Custom Domain**
4. Dodaj domenę: `api.mybonzoaiblog.com`

### 3. Testowanie Interface

Otwórz plik `ai-bridge-interface.html` w przeglądarce:
```bash
# Lokalnie
start ai-bridge-interface.html

# Lub hostuj na serwerze
python -m http.server 8000
# Następnie otwórz: http://localhost:8000/ai-bridge-interface.html
```

## 📁 Struktura Projektu

```
BRIDGE_CLOUD_APPS/
├── gateway-worker/           # Cloudflare Worker
│   ├── src/index.js         # Główny kod Worker
│   ├── wrangler.toml        # Konfiguracja Cloudflare
│   ├── package.json         # Zależności npm
│   └── README.md            # Dokumentacja Worker
├── ai-bridge-interface.html # Interfejs wizualny
├── połączenie_aplikacjii.md # Instrukcje originalne
└── README.md                # Ten plik
```

## ⚙️ Gateway Worker - Funkcje

### Endpointy API:

- **`/`** - Status Gateway i dostępne endpointy
- **`/publish`** - Publikowanie postów z aplikacji do bloga
- **`/status`** - Pobieranie statusu modeli AI
- **`/bridge-ai`** - Most między systemami 12↔9 klawiszy
- **`/sync`** - Synchronizacja aplikacji z blogiem

### Przykład użycia:

```javascript
// Publikowanie do bloga
const response = await fetch('https://api.mybonzoaiblog.com/publish', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    title: 'AI Status Update',
    content: 'Model Flux1 został aktywowany',
    tags: ['ai', 'status', 'flux']
  })
});
```

## 🎨 AI Bridge Interface - Funkcje

### System 12 Klawiszy:
- **F1-F12** - Funkcje aplikacji (AI Gen, Voice, Image, etc.)
- Status połączenia w czasie rzeczywistym
- Animowane aktywacje funkcji

### System 9 Klawiszy (Zaawansowane AI):
- **1-9** - Modele AI (GPT-4, Claude, Gemini, Flux, etc.)
- Dedykowane funkcje zaawansowane
- Synchronizacja z systemem 12 klawiszy

### Podrzędne Okno Bloga:
- **Skróty**: Nowy Post, Status AI, Analityki, Ustawienia
- **Opis funkcji**: Automatyczna synchronizacja z AI
- **Minimalizacja**: Możliwość zwijania okna
- **Responsive**: Adaptacja do urządzeń mobilnych

## 🔧 Konfiguracja i Ustawienia

### Environment Variables (Gateway Worker):

```toml
[vars]
BLOG_API_URL = "https://www.mybonzoaiblog.com/api/"
MYBONZO_API_URL = "https://www.mybonzo.com/api/"
AUTH_TOKEN = "SECRET_TOKEN"
```

### Dostosowanie Interface:

```css
/* Zmiana kolorów systemów klawiszy */
.keys-12 {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
}

.keys-9 {
    background: linear-gradient(45deg, #48dbfb, #0abde3);
}
```

## 🧪 Testowanie

### 1. Test Gateway Worker (lokalne):
```bash
cd gateway-worker
npm run dev
# Test: http://localhost:8787/
```

### 2. Test produkcyjny:
```bash
curl https://api.mybonzoaiblog.com/
# Powinno zwrócić: {"active": true, "gateway": "mybonzo"}
```

### 3. Test Interface:
1. Otwórz `ai-bridge-interface.html`
2. Kliknij dowolny klawisz
3. Sprawdź Console (F12) - powinny być logi synchronizacji

## 📊 Monitoring i Logi

### Cloudflare Worker Logs:
```bash
cd gateway-worker
npm run logs
```

### JavaScript Console (Interface):
- Aktywacje klawiszy
- Komunikacja z Gateway API
- Synchronizacja czasowa
- Błędy połączenia

## 🔒 Bezpieczeństwo

1. **JWT Tokens**: Wszystkie zapytania do API używają tokenów autoryzacyjnych
2. **CORS**: Skonfigurowane nagłówki dla komunikacji między domenami
3. **HTTPS**: Wymagane połączenia szyfrowane
4. **Rate Limiting**: Cloudflare automatycznie ogranicza nadmierne zapytania

## 🚀 Wdrożenie Produkcyjne

### 1. Przygotowanie:
```bash
# Klonuj repozytorium
git clone https://github.com/Bonzokoles/luc-de-zen-on.git
cd luc-de-zen-on/BRIDGE_CLOUD_APPS
```

### 2. Konfiguracja Gateway:
```bash
cd gateway-worker
npm install
# Edytuj wrangler.toml z właściwymi domenami
npm run deploy
```

### 3. DNS i Domeny:
- Dodaj rekord CNAME: `api.mybonzoaiblog.com → mybonzo-gateway.workers.dev`
- Aktywuj SSL/TLS w Cloudflare
- Zweryfikuj certyfikaty

### 4. Integracja z Aplikacją:
```html
<!-- Osadź interface w aplikacji -->
<iframe src="https://yourdomain.com/ai-bridge-interface.html"
        width="100%" height="600px"></iframe>
```

## 📞 Wsparcie

- **GitHub Issues**: [Repository Issues](https://github.com/Bonzokoles/luc-de-zen-on/issues)
- **Email**: kontakt@mybonzo.com
- **Dokumentacja**: [Docs](docs/aplikacja_funkcje/)

## 📈 Roadmapa

### Wersja 1.1:
- [ ] WebSocket real-time sync
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support

### Wersja 1.2:
- [ ] Mobile app integration
- [ ] Voice commands
- [ ] AI auto-posting

---

**Stworzone**: 19.10.2025
**Ostatnia aktualizacja**: 19.10.2025
**Wersja**: 1.0.0
**Status**: ✅ Gotowe do wdrożenia