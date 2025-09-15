# Stable Diffusion AI Image Generator

## Opis
Kompletny system do generowania obrazów AI za pomocą modeli Stable Diffusion z interfejsem webowym.

## Struktura projektu
```
StableDiffusion/
├── src/                 # Kod źródłowy
├── models/             # Modele AI (checkpointy, LoRA, embeddingi)
├── output/             # Wygenerowane obrazy
├── config/             # Pliki konfiguracyjne
├── web/                # Interfejs webowy
├── scripts/            # Skrypty pomocnicze
├── requirements.txt    # Zależności Python
└── README.md          # Ten plik
```

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone <repo-url>
cd StableDiffusion
```

2. Utwórz środowisko wirtualne:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# lub source venv/bin/activate  # Linux/Mac
```

3. Zainstaluj zależności:
```bash
pip install -r requirements.txt
```

## Uruchomienie

### Interfejs Gradio
```bash
python web/gradio_interface.py
```

### Interfejs Streamlit
```bash
streamlit run web/streamlit_app.py
```

### Generowanie z linii komend
```bash
python src/generate.py --prompt "beautiful landscape" --steps 50
```

## Funkcjonalności

- ✅ Generowanie obrazów z promptów tekstowych
- ✅ Obsługa różnych modeli Stable Diffusion
- ✅ ControlNet dla precyzyjnej kontroli
- ✅ LoRA i embeddingi
- ✅ Batch processing
- ✅ Interfejs webowy
- ✅ Zapisywanie metadanych

## Wymagania systemowe

- Python 3.8+
- NVIDIA GPU z CUDA (rekomendowane)
- 8GB+ RAM
- 10GB+ wolnego miejsca na dysku