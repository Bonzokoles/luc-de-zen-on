# 🔄 CAY_XLM_FEED_Converter

Aplikacja do konwersji plików (XML, JSON, YAML, CSV, HTML, Markdown, JSONL).

## 📁 Struktura Folderu

```
CAY_XLM_FEED_Converter/
├── index.html                    # Aplikacja
├── run_windows.bat               # Launcher - serwery w tle ⭐
├── run_windows_hidden.vbs        # VBS launcher - najlepiej ⭐⭐⭐
├── run_windows_advanced.bat      # Zaawansowany launcher
├── stop_servers.bat              # Zatrzymywanie serwerów
├── run_windows.ps1               # PowerShell (zaawansowane)
├── run_macos_linux.sh            # Mac/Linux
├── run_universal.py              # Python (uniwersalny)
└── README.md                      # Dokumentacja
```

## 🚀 Szybki Start

### Windows (Najlepsze opcje)

**Opcja 1: VBS (REKOMENDOWANE - zero okien)**
- Kliknij 2x: `run_windows_hidden.vbs`
- Serwery uruchamiają się w zupełnym ukryciu
- Najczystsze do użytku

**Opcja 2: BAT (serwery w tle)**
- Kliknij 2x: `run_windows.bat`
- Serwery w tle, potwierdzenie w konsoli
- BAT zamyka się automatycznie

**Opcja 3: BAT Advanced**
- `run_windows_advanced.bat`
- Z diagnostyką i logowaniem
- Dla zaawansowanych użytkowników

### Zatrzymanie Serwerów

Kliknij 2x: `stop_servers.bat`

Lub z konsoli:
```bash
taskkill /F /IM python.exe
```

### Mac/Linux

```bash
chmod +x run_macos_linux.sh
./run_macos_linux.sh
```

### Wszędzie (Python)

```bash
python run_universal.py
```

## ✨ Funkcje

✅ **Pobierz z URL** - Wklej link, pobierz bez pobierania na dysk
✅ **Prześlij lokalnie** - Przeciągnij plik lub wybierz
✅ **6 formatów** - JSON, YAML, CSV, HTML, Markdown, JSONL
✅ **Bez serwera** - Działa lokalnie
✅ **Serwery w tle** - Nie widać konsoli
✅ **Statystyka** - Info o plikach

## 📡 Porty

- **4656** - Serwer 1 (proxy)
- **4657** - Serwer 2 (backup)

## 🛠 Troubleshooting

| Problem | Rozwiązanie |
|---------|------------|
| Aplikacja się nie otwiera | Otwórz `index.html` ręcznie w przeglądarce |
| Port już zajęty | `taskkill /F /IM python.exe` |
| VBS nie działa | Sprawdź czy Python jest zainstalowany |
| Pobieranie z URL nie idzie | Serwery muszą działać (4656, 4657) |

## 📝 Obsługiwane Formaty

| Format | Opis |
|--------|------|
| JSON | JavaScript Object Notation |
| YAML | YAML Ain't Markup Language |
| CSV | Comma-Separated Values |
| HTML | Tabele HTML |
| Markdown | Markdown Tables |
| JSONL | JSON Lines (1 JSON per line) |

---

**Wersja**: 1.0  
**Ostatnia aktualizacja**: 2025-11-20
