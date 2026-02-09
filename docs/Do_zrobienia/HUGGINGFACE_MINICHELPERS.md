# 🤖 HuggingFace MiniHelpers - Lekkie Modele i Narzędzia

**Data utworzenia:** 2026-02-09  
**Projekt:** ZENON_Biznes_HUB (luc-de-zen-on)  
**Cel:** Integracja lekkich modeli i narzędzi z HuggingFace dla wsparcia funkcji biznesowych

---

## 📋 Spis Treści

1. [Co to są MiniHelpers?](#co-to-sa)
2. [Rekomendowane Modele](#modele)
3. [Przypadki Użycia](#przypadki-uzycia)
4. [Integracja z Projektem](#integracja)
5. [Konfiguracja](#konfiguracja)
6. [Przykłady Implementacji](#przyklady)
7. [Następne Kroki](#nastepne-kroki)

---

## <a name="co-to-sa"></a>🎯 Co to są MiniHelpers?

**MiniHelpers** to zbiór lekkich, wydajnych modeli AI z HuggingFace, które:
- Działają szybko nawet na słabszym sprzęcie
- Zajmują mało pamięci (80MB-500MB)
- Nie wymagają GPU do inference
- Idealnie nadają się do zadań pomocniczych w aplikacji biznesowej

### Dlaczego MiniHelpers?

W projekcie ZENON_Biznes_HUB mamy już duże modele (Gemini, GPT-4, Claude), ale brakuje:
- ✅ **Szybkich embeddings** dla wyszukiwania semantycznego
- ✅ **Klasyfikacji tekstu** dla kategoryzacji treści
- ✅ **Ekstrakcji informacji** z dokumentów
- ✅ **Tłumaczeń** polsko-angielskich
- ✅ **Analizy sentymentu** opinii klientów

---

## <a name="modele"></a>🔧 Rekomendowane Modele z HuggingFace

### 1. **SmolLM (Hugging Face SmolLM)**
**Repo:** https://github.com/huggingface/smollm  
**Model:** `HuggingFaceTB/SmolLM2-1.7B-Instruct`

**Parametry:**
- Rozmiar: 1.7B parametrów
- RAM: ~4GB
- Licencja: Apache 2.0 (komercyjne OK)
- Języki: EN, PL (częściowo)

**Użycie:**
```javascript
// Endpoint API dla SmolLM
// src/pages/api/smollm-helper.ts
const MODEL_ID = "HuggingFaceTB/SmolLM2-1.7B-Instruct";
```

**Przypadki użycia:**
- Szybkie odpowiedzi na proste pytania
- Klasyfikacja tekstu (spam/nie-spam, kategoria)
- Generowanie krótkich opisów
- Tłumaczenia prostych fraz

---

### 2. **sentence-transformers/all-MiniLM-L6-v2**
**Repo:** https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

**Parametry:**
- Rozmiar: ~80MB
- Bardzo szybki (CPU OK)
- Embeddings: 384 wymiary

**Użycie:**
```python
# Dla funkcji wyszukiwania semantycznego
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
```

**Przypadki użycia:**
- Wyszukiwanie semantyczne w dokumentach
- Podobieństwo tekstów (duplikaty, FAQ matching)
- Clustering treści biznesowych
- Rekomendacje artykułów/produktów

---

### 3. **BAAI/bge-small-en-v1.5**
**Repo:** https://huggingface.co/BAAI/bge-small-en-v1.5

**Parametry:**
- Rozmiar: ~133MB
- Embeddings: 384 wymiary
- Optymalizowany dla retrieval

**Użycie:**
```javascript
// Embedding API endpoint
const MODEL = "BAAI/bge-small-en-v1.5";
```

**Przypadki użycia:**
- RAG (Retrieval Augmented Generation)
- Semantyczne wyszukiwanie w bazie wiedzy
- Q&A matching

---

### 4. **Xenova/gte-small**
**Repo:** https://huggingface.co/Xenova/gte-small

**Parametry:**
- Rozmiar: ~120MB
- Obsługa ONNX (szybki inference w przeglądarce!)
- Wielojęzyczny

**Użycie:**
```javascript
// Client-side embeddings (Transformers.js)
import { pipeline } from '@xenova/transformers';
const embedder = await pipeline('feature-extraction', 'Xenova/gte-small');
```

**Przypadki użycia:**
- Embeddings w przeglądarce (bez API!)
- Offline wyszukiwanie
- Privacy-first processing

---

### 5. **sdadas/polish-roberta-base-v2**
**Repo:** https://huggingface.co/sdadas/polish-roberta-base-v2

**Parametry:**
- Rozmiar: ~500MB
- **POLSKI MODEL** (natywnie)
- Sentiment, NER, Classification

**Użycie:**
```python
from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("sdadas/polish-roberta-base-v2")
model = AutoModel.from_pretrained("sdadas/polish-roberta-base-v2")
```

**Przypadki użycia:**
- Analiza sentymentu polskich opinii
- Named Entity Recognition (NER) - firmy, osoby, lokalizacje
- Klasyfikacja polskich tekstów biznesowych

---

### 6. **Bielik-11B-v2.2-Instruct** (już planowany)
**Repo:** https://huggingface.co/speakleash/Bielik-11B-v2.2-Instruct

**Status:** ✅ Dokumentacja istnieje (`GATEWAY_BIELIK_SETUP.md`)  
**Integracja:** Przez Cloudflare AI Gateway  
**Token:** `HF_TOKEN` (environment variable)

**Przeznaczenie:**
- Voice Assistant (polskie rozmowy)
- Agent Orchestrator (routing zadań)
- Główny polski LLM w systemie

---

## <a name="przypadki-uzycia"></a>💡 Przypadki Użycia w ZENON_Biznes_HUB

### 1. **Wyszukiwanie Semantyczne w Dokumentach**
**Model:** `all-MiniLM-L6-v2` lub `bge-small-en-v1.5`

**Funkcjonalność:**
- Użytkownik wpisuje pytanie: "jak wystawić fakturę VAT?"
- System wyszukuje w dokumentacji najlepiej pasujące sekcje
- Zwraca top 3 wyniki z linkami

**Implementacja:**
```typescript
// src/pages/api/semantic-search.ts
export const POST: APIRoute = async ({ request, locals }) => {
  const { query } = await request.json();
  
  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(query);
  
  // 2. Search in vector DB (lub localStorage z pre-computed embeddings)
  const results = await searchSimilarDocs(queryEmbedding);
  
  return new Response(JSON.stringify(results));
};
```

---

### 2. **Auto-kategoryzacja Treści Marketingowych**
**Model:** `SmolLM2-1.7B` lub `polish-roberta-base-v2`

**Funkcjonalność:**
- Użytkownik generuje post marketingowy
- System automatycznie sugeruje kategorię: "Promocja", "Informacja", "Event", "Oferta"
- Dodaje odpowiednie hashtagi

**Implementacja:**
```typescript
// src/pages/api/classify-content.ts
const categories = ["Promocja", "Informacja", "Event", "Oferta", "Edukacja"];

export const POST: APIRoute = async ({ request }) => {
  const { text } = await request.json();
  
  const category = await classifyText(text, categories);
  const hashtags = await generateHashtags(text, category);
  
  return new Response(JSON.stringify({ category, hashtags }));
};
```

---

### 3. **Analiza Sentymentu Opinii Klientów**
**Model:** `polish-roberta-base-v2`

**Funkcjonalność:**
- Import opinii klientów (CSV, teksty)
- Automatyczna analiza: pozytywne/neutralne/negatywne
- Dashboard z statystykami

**UI:**
```
📊 Analiza Opinii Klientów
--------------------------------
✅ Pozytywne: 127 (63%)
😐 Neutralne: 52 (26%)
❌ Negatywne: 21 (11%)

🔍 Top problemy:
- Opóźnienia w dostawie (8 opinii)
- Problemy z płatnością (5 opinii)
```

---

### 4. **Smart FAQ Matching**
**Model:** `all-MiniLM-L6-v2`

**Funkcjonalność:**
- Użytkownik zadaje pytanie
- System znajduje najbardziej podobne pytanie z FAQ
- Automatycznie wyświetla odpowiedź (zamiast czatu z LLM)

**Oszczędności:**
- Mniej wywołań do drogich API (Gemini/GPT-4)
- Szybsze odpowiedzi (embedding vs generacja)
- Offline mode możliwy

---

### 5. **Ekstrakcja Danych z Faktur/Umów**
**Model:** `SmolLM2-1.7B` + prompt engineering

**Funkcjonalność:**
- Upload obrazu faktury/PDF
- Ekstrakcja: kwota, data, NIP, nazwa firmy
- Auto-fill formularza księgowego

**Przykład:**
```json
{
  "kwota_netto": 1500.00,
  "kwota_brutto": 1845.00,
  "vat": 23,
  "data_wystawienia": "2026-02-09",
  "sprzedawca_nip": "1234567890",
  "nabywca_nazwa": "Firma XYZ Sp. z o.o."
}
```

---

## <a name="integracja"></a>🔌 Integracja z Projektem

### Architektura

```
User Input (Text/File)
    ↓
[Frontend React Component]
    ↓
[Astro API Endpoint]
    ↓
[HuggingFace Inference API]
    ↓
[Mini Helper Model]
    ↓
[Response Processing]
    ↓
[Display Results]
```

### Opcje Deployment

#### **Opcja 1: HuggingFace Inference API** (zalecane dla start)
✅ Łatwa integracja  
✅ Bezpłatna warstwa (rate limited)  
✅ Bez instalacji modeli

```typescript
// src/pages/api/hf-inference.ts
const HF_API_URL = "https://api-inference.huggingface.co/models/";
const HF_TOKEN = env.HF_TOKEN;

const response = await fetch(`${HF_API_URL}sentence-transformers/all-MiniLM-L6-v2`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${HF_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ inputs: text })
});
```

#### **Opcja 2: Cloudflare Workers AI** (future)
✅ Więcej kontroli  
✅ Rate limiting customizowany  
✅ Caching w AI Gateway

```typescript
// Via Cloudflare AI Gateway
const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/mini-helpers-gateway/huggingface/sentence-transformers/all-MiniLM-L6-v2`;
```

#### **Opcja 3: Transformers.js (client-side)** (eksperymentalne)
✅ Bez API calls  
✅ Privacy-first  
❌ Wolniejsze na słabych urządzeniach

```javascript
import { pipeline } from '@xenova/transformers';

// Runs in browser!
const embedder = await pipeline('feature-extraction', 'Xenova/gte-small');
const output = await embedder(text);
```

---

## <a name="konfiguracja"></a>⚙️ Konfiguracja

### 1. Dodaj HF_TOKEN do Cloudflare

```bash
# Pobierz token z: https://huggingface.co/settings/tokens
npx wrangler pages secret put HF_TOKEN --project-name=luc-de-zen-on

# Sprawdź
npx wrangler pages secret list --project-name=luc-de-zen-on
```

### 2. Zaktualizuj .env.example

```bash
# HuggingFace API Token (dla MiniHelpers)
HF_TOKEN=hf_your_token_here

# Opcjonalnie: Custom endpoint URL
HF_INFERENCE_URL=https://api-inference.huggingface.co/models/
```

### 3. Dodaj nowy endpoint API

```bash
# Stwórz plik
touch src/pages/api/mini-helper-embeddings.ts
```

---

## <a name="przyklady"></a>📝 Przykłady Implementacji

### Przykład 1: Semantic Search Endpoint

**Plik:** `src/pages/api/semantic-search.ts`

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { query, documents } = await request.json();
    const env = locals.runtime.env;
    
    // Validate
    if (!query || !documents || !Array.isArray(documents)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }
    
    // Generate embeddings for query
    const queryEmbedding = await generateEmbedding(query, env.HF_TOKEN);
    
    // Generate embeddings for all documents (can be cached)
    const docEmbeddings = await Promise.all(
      documents.map(doc => generateEmbedding(doc.text, env.HF_TOKEN))
    );
    
    // Calculate cosine similarity
    const similarities = docEmbeddings.map((docEmb, idx) => ({
      index: idx,
      score: cosineSimilarity(queryEmbedding, docEmb),
      document: documents[idx]
    }));
    
    // Sort by score descending
    const results = similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5
    
    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

async function generateEmbedding(text: string, token: string): Promise<number[]> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    }
  );
  
  if (!response.ok) {
    throw new Error(`HF API error: ${response.status}`);
  }
  
  return await response.json();
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

---

### Przykład 2: Sentiment Analysis Endpoint

**Plik:** `src/pages/api/sentiment-analysis.ts`

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { text } = await request.json();
    const env = locals.runtime.env;
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 });
    }
    
    // Use Polish RoBERTa for sentiment
    const response = await fetch(
      'https://api-inference.huggingface.co/models/sdadas/polish-roberta-base-v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: text })
      }
    );
    
    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Process result (model-specific format)
    const sentiment = analyzeSentiment(result);
    
    return new Response(JSON.stringify({ sentiment }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

function analyzeSentiment(modelOutput: any) {
  // Process based on model output format
  // Example: [{ label: 'POSITIVE', score: 0.95 }]
  const topResult = modelOutput[0][0];
  
  return {
    label: topResult.label,
    score: topResult.score,
    emoji: topResult.label === 'POSITIVE' ? '😊' : topResult.label === 'NEGATIVE' ? '😞' : '😐'
  };
}
```

---

### Przykład 3: Text Classification Component

**Plik:** `src/components/narzedzia/TextClassifier.tsx`

```tsx
import React, { useState } from 'react';

const TextClassifier = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const classifyText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sentiment-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      setResult(data.sentiment);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">🧠 Analiza Sentymentu</h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Wpisz tekst do analizy..."
        className="w-full p-3 border rounded-lg mb-4"
        rows={5}
      />
      
      <button
        onClick={classifyText}
        disabled={loading || !text}
        className="btn btn-primary"
      >
        {loading ? 'Analizuję...' : 'Analizuj Sentiment'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="text-6xl text-center mb-2">{result.emoji}</div>
          <div className="text-center">
            <span className="font-bold">{result.label}</span>
            <br />
            Pewność: {(result.score * 100).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default TextClassifier;
```

---

## <a name="nastepne-kroki"></a>🚀 Następne Kroki

### Faza 1: Setup (1-2 dni)
- [ ] Zdobądź HF_TOKEN z https://huggingface.co/settings/tokens
- [ ] Dodaj secret do Cloudflare Pages
- [ ] Stwórz pierwszy endpoint: `/api/mini-helper-embeddings.ts`
- [ ] Test z modelem `all-MiniLM-L6-v2`

### Faza 2: Implementacja Semantic Search (3-5 dni)
- [ ] Endpoint `/api/semantic-search.ts`
- [ ] Pre-compute embeddings dla dokumentacji projektu
- [ ] Zapisz embeddings w localStorage lub KV
- [ ] UI: Search bar z semantic results
- [ ] Test: "jak wystawić fakturę?" → relevant docs

### Faza 3: Sentiment Analysis (2-3 dni)
- [ ] Endpoint `/api/sentiment-analysis.ts`
- [ ] Model: `sdadas/polish-roberta-base-v2`
- [ ] UI: Textarea + analyze button
- [ ] Dashboard: batch analysis (upload CSV)

### Faza 4: Text Classification (2-3 dni)
- [ ] Endpoint `/api/classify-content.ts`
- [ ] Kategorie: Promocja, Info, Event, Oferta
- [ ] Auto-hashtag generation
- [ ] Integracja z Generator Treści

### Faza 5: Optimization (ongoing)
- [ ] Caching embeddings (Cloudflare KV)
- [ ] Rate limiting (max 100 requests/min)
- [ ] Fallback na cached results gdy quota exceeded
- [ ] Monitoring użycia HF API

---

## 📚 Przydatne Linki

### Dokumentacja
- **HuggingFace Inference API:** https://huggingface.co/docs/api-inference
- **SmolLM GitHub:** https://github.com/huggingface/smollm
- **Sentence Transformers:** https://www.sbert.net
- **Transformers.js:** https://github.com/xenova/transformers.js

### Modele
- **all-MiniLM-L6-v2:** https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
- **bge-small-en-v1.5:** https://huggingface.co/BAAI/bge-small-en-v1.5
- **polish-roberta-base-v2:** https://huggingface.co/sdadas/polish-roberta-base-v2
- **SmolLM2-1.7B-Instruct:** https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct

### Tools
- **Text Embeddings Inference:** https://github.com/huggingface/text-embeddings-inference
- **Cloudflare AI Gateway:** https://developers.cloudflare.com/ai-gateway

---

## ⚠️ Ważne Uwagi

1. **Rate Limiting:** HuggingFace Inference API ma limit requestów:
   - Free tier: ~1000 requests/day
   - Rozważ caching embeddings w Cloudflare KV

2. **Cold Start:** Pierwszy request do modelu może trwać 10-20s (model loading)
   - Kolejne requesty: 1-3s
   - Użyj loading indicators w UI

3. **Quota Management:**
   - Monitor użycie na https://huggingface.co/settings/billing
   - Fallback na cached results

4. **Privacy:**
   - Jeśli przetwarzasz wrażliwe dane, użyj self-hosted models
   - Opcja: Transformers.js (client-side, bez wysyłania do API)

---

**Utworzono:** 2026-02-09  
**Autor:** GitHub Copilot  
**Status:** 📋 Ready for implementation
