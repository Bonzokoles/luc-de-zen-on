# 🎯 Voice Avatar Worker - Instrukcje Wdrożenia

## 📋 Przegląd

Nowy `voice-avatar-worker` został utworzony jako dedykowany worker Cloudflare do obsługi polskojęzycznych interakcji z avatarem głosowym.

## 🚀 Wdrożenie

### 1. Przygotowanie sekretów

Skonfiguruj następujące sekrety w Cloudflare:

```powershell
# Klucz OpenAI API (dla fallback TTS)
npx wrangler secret put OPENAI_API_KEY --config wrangler-voice-avatar.toml

# Klucz ElevenLabs API (główny TTS)
npx wrangler secret put ELEVENLABS_API_KEY --config wrangler-voice-avatar.toml
```

### 2. Deploy workera

```powershell
npx wrangler deploy --config wrangler-voice-avatar.toml
```

### 3. Aktualizacja URL w komponencie

Po wdrożeniu zanotuj URL workera i zaktualizuj w `VoiceAvatarComponent.tsx`:

```typescript
const VOICE_AI_ENDPOINT = 'https://voice-avatar-worker-production.TWOJA-SUBDOMENA.workers.dev';
```

## 🔧 Konfiguracja Środowiska

### Produkcja

- Worker URL: `https://voice-avatar-worker-production.TWOJA-SUBDOMENA.workers.dev`
- KV namespace: `VOICE_CACHE`
- AI binding: `AI` (Cloudflare Workers AI)

### Staging

- Worker URL: `https://voice-avatar-worker-staging.TWOJA-SUBDOMENA.workers.dev`
- KV namespace: `VOICE_CACHE_STAGING`

## 🎤 API Endpoints

Worker obsługuje następujące endpointy:

### POST /transcribe
Transkrypcja audio na tekst
```json
{
  "type": "transcribe",
  "data": "base64_audio_data"
}
```

### POST /chat
Konwersacja z polskim AI
```json
{
  "type": "chat",
  "data": "tekst użytkownika"
}
```

### POST /generate_speech
Generowanie mowy z tekstu
```json
{
  "type": "generate_speech",
  "data": "tekst do wymówienia"
}
```

## 🤖 Modele AI

- **Chat Model**: `@cf/meta/llama-3.1-8b-instruct`
- **Speech Recognition**: `@cf/openai/whisper`
- **Text-to-Speech**: ElevenLabs + OpenAI (fallback)

## 📊 Cechy Systemu

### Avatar Rotation
- 16 dostępnych avatarów (`avatar_1.png` do `avatar_16.jpg`)
- Automatyczna rotacja co 2 godziny
- Dynamiczne wykrywanie dostępnych plików

### Voice AI
- Rozpoznawanie polskiej mowy
- Konwersacja w języku polskim
- Wysokiej jakości TTS (ElevenLabs)
- Fallback do OpenAI TTS

### UI Features
- Wskaźniki stanu (słuchanie, przetwarzanie, mówienie)
- Obsługa błędów z komunikatami
- Responsywny design

## 🔍 Testowanie

### Test lokalny (development)
```bash
pnpm dev
```

### Test workera
```bash
curl -X POST "https://voice-avatar-worker-production.TWOJA-SUBDOMENA.workers.dev" \
  -H "Content-Type: application/json" \
  -d '{"type": "chat", "data": "Cześć!"}'
```

## 📝 Logi i Debugging

### Wrangler tail (logi w czasie rzeczywistym)
```bash
npx wrangler tail --config wrangler-voice-avatar.toml
```

### Console logi w komponencie
- 🎤 - Operacje mikrofonu
- 📝 - Transkrypcja
- 💬 - Chat z AI
- 🔊 - Odtwarzanie audio
- ❌ - Błędy

## 🔧 Troubleshooting

### Brak dostępu do mikrofonu
- Sprawdź uprawnienia przeglądarki
- Użyj HTTPS (wymagane dla WebRTC)

### Błąd workera
- Sprawdź logi: `npx wrangler tail`
- Zweryfikuj sekrety: `npx wrangler secret list`

### Avatar nie ładuje się
- Sprawdź ścieżki w `/public/avatars/`
- Zweryfikuj formaty plików (jpg, png, webp)

## 🎯 Next Steps

1. Deploy workera do produkcji
2. Ustaw sekrety API
3. Przetestuj voice interactions
4. Dodaj więcej avatarów (do 20)
5. Optymalizuj dla polskiego TTS

## 📁 Pliki Projektu

- `src/workers/voice-avatar-worker.ts` - Worker z polskim AI
- `wrangler-voice-avatar.toml` - Konfiguracja Wrangler
- `src/components/voice-ai/VoiceAvatarComponent.tsx` - React komponent
- `public/avatars/` - Folder z avatarami

## 🔗 Worker Features

- ✅ Polski model AI (Llama-3.1-8b-instruct)
- ✅ ElevenLabs TTS dla polskiego
- ✅ OpenAI fallback TTS
- ✅ Whisper transcription
- ✅ CORS support
- ✅ Error handling
- ✅ KV caching dla optymalizacji
