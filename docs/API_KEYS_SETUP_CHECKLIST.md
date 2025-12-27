# 🔑 API Keys Setup - Checklist

## Obowiązkowe (dla działających funkcji):

### 1. Google Gemini API
**Gdzie:** https://aistudio.google.com/apikey  
**Używane w:**
- `chat-gemini.ts` - główny chatbot
- `generate-document-gemini.ts` - generowanie dokumentów
- `generate-content-gemini.ts` - generowanie treści

**Dodaj jako secret:**
```bash
npx wrangler pages secret put GOOGLE_API_KEY --project-name=luc-de-zen-on
```

**Sprawdź:**
```bash
npx wrangler pages secret list --project-name=luc-de-zen-on
```

---

### 2. OpenAI API (opcjonalne - dla email generator)
**Gdzie:** https://platform.openai.com/api-keys  
**Używane w:**
- `generate-email.ts` - generator emaili biznesowych

**Dodaj jako secret:**
```bash
npx wrangler pages secret put OPENAI_API_KEY --project-name=luc-de-zen-on
```

---

### 3. Hugging Face Token (dla Bielik - polski model)
**Gdzie:** https://huggingface.co/settings/tokens  
**Używane w:** Bielik polski model przez Cloudflare AI Gateway

**Dodaj jako secret:**
```bash
npx wrangler pages secret put HF_TOKEN --project-name=luc-de-zen-on
```

---

### 4. OpenRouter API (dla Claude/GPT multi-model)
**Gdzie:** https://openrouter.ai/keys  
**Używane w:** Multi-model chat (Claude, GPT-4)

**Dodaj jako secret:**
```bash
npx wrangler pages secret put OPENROUTER_API_KEY --project-name=luc-de-zen-on
```

---

## Sprawdź status:

```bash
# Lista wszystkich secrets
npx wrangler pages secret list --project-name=luc-de-zen-on

# Test lokalny (dev)
npm run dev
# Otwórz http://localhost:4321/chatbot
```

---

## Test produkcyjny (po dodaniu secrets):

1. Commit + Push → Auto-deploy
2. Otwórz https://mybonzo.com/chatbot
3. Napisz wiadomość testową
4. Sprawdź Console → Network → odpowiedź API

---

## 🚨 Priorytet:

**NAJWAŻNIEJSZY:** GOOGLE_API_KEY (Gemini) - używany w 3 miejscach  
**WAŻNY:** HF_TOKEN (Bielik) - polski model  
**OPCJONALNY:** OPENAI_API_KEY, OPENROUTER_API_KEY

---

## ✅ Po zakończeniu:

- [ ] Dodane GOOGLE_API_KEY do Cloudflare
- [ ] Dodane HF_TOKEN do Cloudflare  
- [ ] Test chatbota na mybonzo.com/chatbot
- [ ] Test generatora treści
- [ ] Commit tego pliku do repo
