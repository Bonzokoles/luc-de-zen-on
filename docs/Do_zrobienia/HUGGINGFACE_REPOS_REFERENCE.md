# 🔗 HuggingFace Repositories - Quick Reference

**Data:** 2026-02-09  
**Projekt:** ZENON_Biznes_HUB  
**Cel:** Szybki dostęp do repozytoriów modeli HuggingFace dla MiniHelpers

---

## 📦 Rekomendowane Repozytoria

### 1. SmolLM (Small Language Models)
**GitHub:** https://github.com/huggingface/smollm  
**Model:** https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct  
**Licencja:** Apache 2.0  
**Rozmiar:** 1.7B parametrów (~4GB RAM)  
**Język:** EN, PL (częściowo)  
**Użycie:** Lekki LLM do klasyfikacji, generowania, Q&A

---

### 2. Sentence Transformers - all-MiniLM-L6-v2
**Repo:** https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2  
**Licencja:** Apache 2.0  
**Rozmiar:** ~80MB  
**Embeddings:** 384 wymiary  
**Użycie:** Semantic search, clustering, similarity

---

### 3. BGE Small English
**Repo:** https://huggingface.co/BAAI/bge-small-en-v1.5  
**Licencja:** MIT  
**Rozmiar:** ~133MB  
**Embeddings:** 384 wymiary  
**Użycie:** Retrieval, RAG, semantic search

---

### 4. Xenova GTE Small (ONNX)
**Repo:** https://huggingface.co/Xenova/gte-small  
**Licencja:** Apache 2.0  
**Rozmiar:** ~120MB  
**Format:** ONNX (szybki w przeglądarce!)  
**Użycie:** Client-side embeddings, offline mode

---

### 5. Polish RoBERTa Base v2 🇵🇱
**Repo:** https://huggingface.co/sdadas/polish-roberta-base-v2  
**Licencja:** CC BY-SA 4.0  
**Rozmiar:** ~500MB  
**Język:** Polski (natywnie)  
**Użycie:** Sentiment analysis, NER, classification (polski)

---

### 6. Bielik-11B v2.2 Instruct 🇵🇱 (już zaplanowany)
**Repo:** https://huggingface.co/speakleash/Bielik-11B-v2.2-Instruct  
**Licencja:** Apache 2.0  
**Rozmiar:** 11.2B parametrów  
**Język:** Polski (natywnie)  
**Użycie:** Voice assistant, orchestrator, główny polski LLM  
**Status:** ✅ Dokumentacja w `GATEWAY_BIELIK_SETUP.md`

---

## 🛠️ Helper Libraries & Tools

### 1. Text Embeddings Inference (TEI)
**GitHub:** https://github.com/huggingface/text-embeddings-inference  
**Opis:** Blazing fast inference dla text embeddings  
**Features:** Docker, GPU support, high-throughput  
**Użycie:** Self-hosted embedding service

---

### 2. Transformers.js
**GitHub:** https://github.com/xenova/transformers.js  
**NPM:** `@xenova/transformers`  
**Opis:** Transformers w przeglądarce (ONNX Runtime)  
**Features:** Offline, privacy-first, no API calls  
**Użycie:** Client-side ML

---

### 3. HuggingFace.js
**GitHub:** https://github.com/huggingface/huggingface.js  
**NPM:** `@huggingface/inference`  
**Opis:** Oficjalny JS client dla HF Inference API  
**Użycie:** Server-side calls do HF API

---

## 📚 Datasets (opcjonalne)

### Polish Reviews Dataset
**Repo:** https://huggingface.co/datasets/clarin-pl/polemo2-official  
**Opis:** Polski dataset opinii (sentiment)  
**Użycie:** Fine-tuning modeli sentymentu

---

### Polish Wikipedia
**Repo:** https://huggingface.co/datasets/wikipedia  
**Config:** `pl` (20240301)  
**Użycie:** Training/fine-tuning polskich embeddings

---

## ⚡ Quick Start Commands

### Install HuggingFace JS Client
```bash
npm install @huggingface/inference
```

### Install Transformers.js (client-side)
```bash
npm install @xenova/transformers
```

### Python (local testing)
```bash
pip install transformers sentence-transformers
```

---

## 🔑 Authentication

**Token:** https://huggingface.co/settings/tokens  
**Variable:** `HF_TOKEN` (environment)  
**Cloudflare:** 
```bash
npx wrangler pages secret put HF_TOKEN --project-name=luc-de-zen-on
```

---

## 📊 API Endpoints

### HuggingFace Inference API
**Base URL:** `https://api-inference.huggingface.co/models/`  
**Example:** `https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2`

**Rate Limits:**
- Free: ~1000 requests/day
- PRO: Higher limits + priority

### Cloudflare AI Gateway (for caching)
**Pattern:** `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/huggingface/{model_id}`

---

## 🎯 Use Cases Mapping

| Przypadek użycia | Rekomendowany model | Repo |
|------------------|---------------------|------|
| Semantic search | all-MiniLM-L6-v2 | [Link](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) |
| Polish sentiment | polish-roberta-base-v2 | [Link](https://huggingface.co/sdadas/polish-roberta-base-v2) |
| Text classification | SmolLM2-1.7B | [Link](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct) |
| Client-side embeddings | Xenova/gte-small | [Link](https://huggingface.co/Xenova/gte-small) |
| RAG/Retrieval | bge-small-en-v1.5 | [Link](https://huggingface.co/BAAI/bge-small-en-v1.5) |
| Polish LLM | Bielik-11B-v2.2 | [Link](https://huggingface.co/speakleash/Bielik-11B-v2.2-Instruct) |

---

## 📝 Notes

- Wszystkie modele Apache 2.0/MIT = OK dla użytku komercyjnego
- Polish RoBERTa = CC BY-SA 4.0 (attribution required)
- SmolLM + Xenova = najlepsze dla local/edge deployment
- Bielik = najlepszy dla polskiego języka (large model)
- all-MiniLM = najszybszy dla embeddings

---

**Ostatnia aktualizacja:** 2026-02-09  
**Related docs:** `HUGGINGFACE_MINICHELPERS.md`, `GATEWAY_BIELIK_SETUP.md`
