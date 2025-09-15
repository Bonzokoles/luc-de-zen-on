# 🎨 AI Image Generator - Strona Robocza

Zintegrowana strona robocza łącząca Stable Diffusion z systemem Wildcards dla kreatywnego generowania promptów.

## 📁 Struktura

```
work_page/
├── app.py                  # Główny serwer Flask
├── src/
│   └── wildcard_parser.py  # Parser wildcards YAML
├── templates/
│   └── index.html          # Interfejs webowy
├── wildcards/              # Pliki YAML z wildcards
│   ├── artists.yaml
│   ├── creatures.yaml
│   └── castle.yaml
├── static/                 # Pliki statyczne
├── requirements.txt        # Zależności Python
└── README.md              # Ten plik
```

## 🚀 Uruchomienie

### 1. Instalacja zależności
```bash
pip install -r requirements.txt
```

### 2. Konfiguracja (opcjonalnie)
```bash
# Dla Hugging Face API (jeśli masz token)
set HUGGINGFACE_TOKEN=your_token_here

# Alternatywnie używa Cloudflare Workers na localhost:8787
```

### 3. Uruchomienie serwera
```bash
python app.py
```

Aplikacja będzie dostępna na: http://localhost:5000

## ✨ Funkcjonalności

### 🎯 Generowanie Obrazów
- **7 modeli AI**: Realistic Vision, DreamShaper, SDXL, Deliberate, Anything V5, Protogen, Flux
- **Dual API**: Hugging Face API lub Cloudflare Workers fallback
- **Real-time preview**: Podgląd przetworzonych promptów

### 🎲 System Wildcards
- **Automatyczne parsowanie**: Pliki YAML z milionami opcji
- **Smart suggestions**: Podpowiedzi podczas wpisywania
- **Enhancement levels**: Lekkie/średnie/mocne ulepszenia promptów
- **Random generator**: Całkowicie losowe prompty

### 💡 Przykłady Wildcards

```
# Podstawowe wildcards
__artists.prehistoric_art__
__creatures.characters.magical-beings.airavata.name__

# Wybory losowe
{magical|mystical|ethereal} creature

# Kombinacje
a {beautiful|stunning} __artists.prehistoric_art__ style painting of __creatures.characters__
```

### 🔧 API Endpoints

```
GET  /api/models                    # Lista dostępnych modeli
GET  /api/wildcards/categories      # Kategorie wildcards  
GET  /api/wildcards/suggestions     # Sugestie wildcards
POST /api/wildcards/process         # Przetwarzanie wildcards
GET  /api/wildcards/random          # Losowy prompt
POST /api/generate                  # Generowanie obrazu
GET  /api/health                    # Status aplikacji
```

## 🔗 Integracja z Cloudflare Workers

Jeśli nie masz Hugging Face token, aplikacja automatycznie użyje Cloudflare Workers API:

1. Uruchom Cloudflare Workers serwer na porcie 8787
2. Aplikacja automatycznie wykryje i przekieruje requesty

## 🎨 Customizacja

### Dodawanie nowych wildcards:
1. Dodaj plik `.yaml` do folderu `wildcards/`
2. Restart aplikacji - automatycznie załaduje nowe kategorie

### Modyfikacja modeli:
Edytuj słownik `MODELS` w `app.py`:
```python
MODELS = {
    "custom_model": "your/huggingface/model/path",
    # ...
}
```

## 🐛 Debugging

### Sprawdzenie stanu:
```bash
curl http://localhost:5000/api/health
```

### Logi serwera:
- Flask wyświetla logi w konsoli
- Sprawdź połączenie z API w Network tab przeglądarki

## 📦 Następne kroki

Po testach i dopracowaniu funkcjonalności:
1. Migracja do głównego folderu projektu
2. Dodanie więcej modeli i wildcards
3. Optymalizacja wydajności
4. Deployment na produkcję

---
**Status**: 🚧 Strona robocza - w rozwoju  
**Cel**: Integracja i testowanie przed final deployment