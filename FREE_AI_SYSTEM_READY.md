# 🎨 Darmowy System AI - MyBonzo

## 🚀 Dostępne Modele

### 📸 Generowanie Obrazów

- **Flux Schnell** (Together AI) - ultra szybki
- **SDXL Turbo** (Stability AI) - 1 krok
- **Playground v2** (Hugging Face) - estetyczny

### 🎬 Generowanie Video

- **OpenAI Sora Turbo** - DARMOWY od października 2024!

## ⚙️ Konfiguracja (GOTOWA!)

Wszystkie klucze API zostały skonfigurowane w Cloudflare Dashboard:

- ✅ OPENAI_API_KEY
- ✅ TOGETHER_API_KEY
- ✅ STABILITY_API_KEY
- ✅ HUGGINGFACE_API_KEY

## 🌐 Interface

- **Dev**: http://localhost:4321/free-ai-models
- **Produkcja**: https://mybonzo.com/free-ai-models (po deploy)

## 🔧 Deploy

```bash
pnpm build && npx wrangler pages deploy dist --project-name=luc-de-zen-on
```

System gotowy do użycia! 🎉
