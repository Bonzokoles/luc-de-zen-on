# Voice AI Deployment Guide

## Przegląd
System Voice AI składa się z dwóch głównych komponentów:
1. **React Island Component** - Frontend interface w Astro
2. **Cloudflare Worker** - Backend AI processing

## Deployment Steps

### 1. Deploy Voice AI Worker

```powershell
# Deploy Voice AI Worker
wrangler deploy --config wrangler-voice-ai.toml

# Create KV namespaces
wrangler kv:namespace create "VOICE_AI_KV"
wrangler kv:namespace create "VOICE_AI_KV" --preview

# Update wrangler-voice-ai.toml with actual KV IDs
```

### 2. Update Frontend Configuration

W pliku `src/lib/cloudflare-voice-ai.ts`, zaktualizuj URL do deployed worker:

```typescript
private voiceAIWorkerUrl = 'https://voice-ai-worker.YOUR-SUBDOMAIN.workers.dev';
```

### 3. Test Voice AI Integration

```powershell
# Test worker endpoint
curl https://voice-ai-worker.YOUR-SUBDOMAIN.workers.dev

# Test voice AI functionality
curl -X POST https://voice-ai-worker.YOUR-SUBDOMAIN.workers.dev/voice-ai \
  -H "Content-Type: application/json" \
  -d '{"type": "chat_completion", "data": "Cześć!", "sessionId": "test"}'
```

## Features Implemented

### ✅ Complete Features
- React Voice AI Component z trzema wariantami (hero, compact, floating)
- Audio capture z AudioWorklet support
- Real-time audio visualization
- WebSocket communication structure
- Voice metrics tracking
- Cloudflare Workers AI integration layer

### 🔄 In Progress
- Cloudflare Workers AI models integration
- Real STT/TTS processing
- Session management w KV storage

### 📋 Next Steps
- Deploy worker to production
- Test real audio processing
- Optimize performance
- Add error recovery

## Usage Examples

### Basic Implementation
```typescript
import { VoiceAIComponent } from '../components/VoiceAIComponent';

// Hero variant for main pages
<VoiceAIComponent variant="hero" />

// Compact variant for sidebars
<VoiceAIComponent variant="compact" />

// Floating variant for global access
<VoiceAIComponent variant="floating" />
```

### Advanced Configuration
```typescript
const config = {
  model: '@cf/google/gemma-3-12b-it',
  voice: 'polish_female',
  language: 'pl',
  enableRealtime: true,
  latencyTarget: 200
};
```

## Cloudflare Workers AI Models

### Speech-to-Text
- `@cf/deepgram/nova-3` - Najlepszy dla polskiego języka

### Text-to-Speech  
- `@cf/deepgram/aura-1` - Naturalne głosy w wielu językach

### Chat Completion
- `@cf/google/gemma-3-12b-it` - Dobry balance performance/quality
- `@cf/meta/llama-3.1-8b-instruct` - Alternative model

## Performance Optimization

### Audio Processing
- AudioWorklet dla low-latency processing
- Voice Activity Detection (VAD)
- Automatic gain control
- Echo cancellation

### Network Optimization
- WebSocket dla real-time communication
- Chunked audio streaming
- Adaptive quality based on connection
- Automatic reconnection

## Troubleshooting

### Common Issues
1. **AudioWorklet not supported** - Falls back to basic audio processing
2. **Worker deployment fails** - Check wrangler configuration
3. **CORS errors** - Verify ALLOWED_ORIGINS in worker
4. **Audio permissions** - Ensure HTTPS for microphone access

### Debug Commands
```powershell
# Check worker logs
wrangler tail voice-ai-worker

# Test KV storage
wrangler kv:key get "test-session" --binding VOICE_AI_KV

# Verify worker status
wrangler dev --config wrangler-voice-ai.toml
```

## Security Considerations

### API Security
- CORS restrictions dla specific domains
- Session-based access control
- Rate limiting w worker
- Input validation dla wszystkich endpoints

### Audio Privacy
- No persistent audio storage
- Session-based processing only
- Encrypted communication
- User consent required
