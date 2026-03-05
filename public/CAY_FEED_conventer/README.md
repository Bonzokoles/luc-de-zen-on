# 🔄 CAY_XLM_FEED_Converter

Aplikacja do konwersji plików (XML, JSON, YAML, CSV, HTML, Markdown, JSONL) z możliwością pobierania z internetu.

## 📁 Struktura Folderu

```
CAY_XLM_FEED_Converter/
├── index.html                  # Aplikacja (otworzyć w przeglądarce)
├── run_windows.bat             # Launcher dla Windows (kliknij 2x)
├── run_windows.ps1             # Launcher PowerShell (zaawansowane)
├── run_macos_linux.sh          # Launcher dla Mac/Linux
├── run_universal.py            # Launcher Python (universal)
└── README.md                    # Ten plik
```

## 🚀 Uruchomienie

### Windows (Najprostsze)
Kliknij dwukrotnie na **`run_windows.bat`**

Lub uruchom PowerShell:
```powershell
.un_windows.ps1
```

### Mac/Linux
```bash
chmod +x run_macos_linux.sh
./run_macos_linux.sh
```

Lub Python:
```bash
python3 run_universal.py
```

### Uniwersalnie (Python)
```bash
python run_universal.py  # Windows
python3 run_universal.py # Mac/Linux
```

## ✨ Funkcje

✅ **Pobierz z URL** - Wklej link do pliku, pobierz i konwertuj
✅ **Prześlij lokalnie** - Przeciągnij plik lub wybierz z dysku
✅ **6 formatów** - JSON, YAML, CSV, HTML, Markdown, JSONL
✅ **Bez serwera** - Działa lokalnie w przeglądarce
✅ **Proxy support** - Pobiera duże pliki przez localhost serwery
✅ **Statystyka** - Info o liczbie rekordów, pól, rozmiarze

## 🔌 Porty

- **Port 4656** - Serwer 1 (proxy dla pobierania)
- **Port 4657** - Serwer 2 (backup proxy)

## 💡 Wskazówki

1. **Aplikacja się nie otwiera?**
   - Sprawdź czy Python jest zainstalowany
   - Otwórz `index.html` ręcznie w przeglądarce

2. **Pobieranie z URL nie działa?**
   - Upewnij się że serwery lokalnych działają (okna konsoli)
   - Sprawdź URL (czy plik istnieje i jest dostępny)

3. **Duże pliki?**
   - Aplikacja obsługuje do 50MB
   - Dla większych plików pobierz ręcznie, potem prześlij lokalnie

## 📝 Obsługiwane Formaty

| Format | Opis |
|--------|------|
| **JSON** | JavaScript Object Notation |
| **YAML** | Yet Another Markup Language |
| **CSV** | Comma-Separated Values |
| **HTML** | HyperText Markup Language |
| **Markdown** | Markdown Tables |
| **JSONL** | JSON Lines (1 JSON per line) |

## 🛠 Wymagania

- **Python 3.8+** (wbudowana biblioteka http.server)
- **Przeglądarka** (Chrome, Firefox, Safari, Edge)

## 📦 Meble Pumo - Przykład Użycia

```
1. Otwórz aplikację (kliknij run_windows.bat)
2. Wklej URL: https://www.meblepumo.pl/data/export/feed10009_...
3. Zaznacz formaty: JSON, CSV, YAML
4. Kliknij "Pobierz i Konwertuj"
5. Pobierz wygenerowane pliki
```

## 🐛 Troubleshooting

| Problem | Rozwiązanie |
|---------|-------------|
| "Failed to fetch" | Uruchom launcher (serwery są wymagane) |
| Port już zajęty | Zmień numer portu w pliku launcher'a |
| Python not found | Zainstaluj Python: https://python.org |
| Plik zbyt duży | Max 50MB, pobierz ręcznie i prześlij |

## 📞 Support

Jeśli coś nie działa:
1. Sprawdź czy Python jest zainstalowany (`python --version`)
2. Sprawdź czy serwery działają (konsola)
3. Sprawdź Browser Console (F12 → Console tab)

---

**Wersja**: 1.0  
**Ostatnia aktualizacja**: 2025-11-20  
**Autor**: CAY_XLM_FEED_Converter  
