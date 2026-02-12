# 🚀 Quick Start: HuggingFace MiniHelpers

## 5-Minute Setup Guide

### Step 1: Get HuggingFace Token (2 min)

1. Visit: https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: `luc-de-zen-on-minihelpers`
4. Type: Read
5. Copy the token (starts with `hf_...`)

### Step 2: Configure Token (1 min)

**For Cloudflare Pages (Production):**
```bash
npx wrangler pages secret put HF_TOKEN --project-name=luc-de-zen-on
# Paste your token when prompted
```

**For Local Development:**
```bash
echo "HF_TOKEN=hf_your_token_here" >> .env
```

### Step 3: Test Locally (2 min)

```bash
# Start dev server
npm run dev

# Open browser
# http://localhost:4321/narzedzia/semantic-search-demo
```

### Step 4: Try It!

Type one of these queries:
- "jak wystawić fakturę?"
- "jak obliczyć marżę?"
- "jak napisać email biznesowy?"

---

## What You Get

✅ **Semantic Search** - Find documents by meaning, not just keywords  
✅ **Fast Results** - 80MB model, instant responses  
✅ **Cost Effective** - No expensive LLM calls needed  
✅ **Polish Support** - Understands Polish language  

---

## Files to Explore

📚 **Full Documentation:**
- `docs/Do_zrobienia/HUGGINGFACE_MINICHELPERS.md` (comprehensive guide)
- `HUGGINGFACE_IMPLEMENTATION_README.md` (testing & troubleshooting)
- `TASK_COMPLETE_SUMMARY.md` (what was delivered)

💻 **Code:**
- `src/pages/api/mini-helper-semantic-search.ts` (API endpoint)
- `src/components/narzedzia/SemanticSearchDemo.tsx` (UI component)

---

## Common Issues

### "HF_TOKEN not configured"
**Fix:** Run step 2 above

### "429 Too Many Requests"
**Fix:** Free tier has limits. Wait or upgrade to HuggingFace PRO

### "Model is loading (503)"
**Fix:** First request takes 10-20s. Retry after delay

---

## Next Steps

1. ✅ Test the demo (you're here!)
2. 📊 Read use cases in `HUGGINGFACE_MINICHELPERS.md`
3. 🔧 Implement additional endpoints (sentiment, classification)
4. 🚀 Deploy to production

---

**Need Help?** Check `HUGGINGFACE_IMPLEMENTATION_README.md` for detailed troubleshooting.
