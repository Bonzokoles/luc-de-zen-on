# MagicPrompt-SD

Uniwersalny generator promptów dla Stable Diffusion i innych modeli AI.

## Użycie

Prosty system do generowania i optymalizacji promptów dla modeli generacyjnych.

## Pliki

- `prompts.py` - Generator promptów
- `examples.txt` - Przykładowe prompty

## Instalacja

```bash
pip install transformers torch
```

## Przykład

```python
from prompts import generate_prompt
result = generate_prompt("landscape")
print(result)
```