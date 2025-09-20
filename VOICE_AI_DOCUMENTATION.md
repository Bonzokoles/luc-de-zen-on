# Voice AI Agent - Comprehensive Documentation

## Overview

Voice AI Agent jest zaawansowanym systemem przetwarzania mowy w aplikacji MyBonzo, oferującym pełen zestaw funkcji związanych z rozpoznawaniem mowy, syntezą głosu, analizą audio i przetwarzaniem komend głosowych.

## Architektura Systemu

### Komponenty Frontend

#### VoiceAIWidget.svelte
- **Lokalizacja**: `src/components/VoiceAIWidget.svelte`
- **Funkcjonalność**: Główny interfejs użytkownika z 4 zakładkami
- **Zakładki**:
  1. 🎤 **Recognition** - Rozpoznawanie mowy w czasie rzeczywistym
  2. 🗣️ **Synthesis** - Synteza głosu z kontrolą parametrów
  3. ⚡ **Commands** - Przetwarzanie komend głosowych
  4. 📊 **Analysis** - Analiza plików audio

#### Integracja z Web Speech API
- Natywne wsparcie przeglądarki dla rozpoznawania mowy
- MediaRecorder API dla nagrywania audio
- AudioContext dla analizy w czasie rzeczywistym

### Komponenty Backend

#### API Endpoints (Astro)
- `src/pages/api/voice/recognition.ts` - Rozpoznawanie mowy
- `src/pages/api/voice/synthesis.ts` - Synteza głosu  
- `src/pages/api/voice/commands.ts` - Przetwarzanie komend
- `src/pages/api/voice/analysis.ts` - Analiza audio

#### Cloudflare Worker
- **Lokalizacja**: `cloudflare-workers/voice-ai-worker.js`
- **Funkcjonalność**: Zaawansowane przetwarzanie z integracją AI
- **Konfiguracja**: `voice-ai-wrangler.toml`

## Funkcjonalności

### 1. Rozpoznawanie Mowy (Speech Recognition)

#### Web Speech API
```javascript
// Podstawowa konfiguracja
const recognition = new webkitSpeechRecognition();
recognition.lang = 'pl-PL';
recognition.continuous = true;
recognition.interimResults = true;
```

#### Obsługiwane Języki
- **pl-PL** - Polski (podstawowy)
- **en-US** - Angielski amerykański
- **en-GB** - Angielski brytyjski
- **de-DE** - Niemiecki
- **es-ES** - Hiszpański
- **fr-FR** - Francuski

#### API Endpoint: `/api/voice/recognition`
```json
{
  "language": "pl-PL",
  "enableRealTime": true,
  "model": "latest_long",
  "maxAlternatives": 3,
  "profanityFilter": true
}
```

### 2. Synteza Głosu (Voice Synthesis)

#### Dostępne Głosy
```javascript
const voices = {
  'pl-PL': [
    { id: 'pl-zofia', name: 'Zofia', gender: 'female', premium: true },
    { id: 'pl-marek', name: 'Marek', gender: 'male', premium: true }
  ],
  'en-US': [
    { id: 'en-sarah', name: 'Sarah', gender: 'female', premium: true },
    { id: 'en-michael', name: 'Michael', gender: 'male', premium: true }
  ]
};
```

#### Kontrola Parametrów
- **Speed**: 0.5x - 2.0x prędkość mowy
- **Pitch**: 0.5x - 2.0x wysokość głosu
- **Volume**: 0.0 - 1.0 głośność
- **Emotional Tone**: neutral, friendly, professional, excited, calm

#### API Endpoint: `/api/voice/synthesis`
```json
{
  "text": "Witaj w systemie POLACZEK",
  "language": "pl-PL",
  "voice": "pl-zofia",
  "speed": 1.0,
  "pitch": 1.0,
  "emotionalTone": "friendly"
}
```

### 3. Komendy Głosowe (Voice Commands)

#### Obsługiwane Komendy (Polski)
```javascript
const polishCommands = {
  // POLACZEK Control
  'otwórz polaczek': 'togglePolaczekAssistant',
  'zamknij polaczek': 'closePolaczekAssistant',
  
  // WebMaster Control  
  'uruchom webmaster': 'toggleWebMasterWidget',
  'analiza seo': 'toggleWebMasterWidget',
  
  // AI Functions
  'wygeneruj obraz': 'generateImage',
  'stwórz obraz': 'generateImage',
  
  // Music Control
  'włącz muzykę': 'playMusic',
  'wyłącz muzykę': 'pauseMusic',
  
  // System Commands
  'sprawdź status': 'checkSystemStatus',
  'przejdź do': 'navigateToPage'
};
```

#### Processing Pipeline
1. **Recognition** - Konwersja mowy na tekst
2. **Pattern Matching** - Dopasowanie do wzorców komend
3. **Parameter Extraction** - Wyodrębnienie parametrów
4. **Action Execution** - Wykonanie akcji
5. **Feedback** - Potwierdzenie wykonania

### 4. Analiza Audio (Audio Analysis)

#### Typy Analizy
- **Transcription** - Transkrypcja z timestampami
- **Emotion Detection** - Rozpoznawanie emocji
- **Quality Assessment** - Ocena jakości audio
- **Speaker Detection** - Identyfikacja mówiących

#### Metryki Jakości
```javascript
const qualityMetrics = {
  clarity: 85,        // Czytelność mowy
  noiseLevel: 12,     // Poziom szumu (niższy = lepszy)
  volume: 78,         // Głośność nagrania
  speechRate: 92,     // Tempo mowy
  pronunciation: 88   // Jakość wymowy
};
```

## Integracja z AI Services

### OpenAI Whisper
```javascript
// Konfiguracja dla transkrypcji
const whisperConfig = {
  model: 'whisper-1',
  language: 'pl',
  response_format: 'json',
  temperature: 0.2
};
```

### Google Cloud Speech API
```javascript
// Konfiguracja zaawansowana
const googleConfig = {
  encoding: 'WEBM_OPUS',
  sampleRateHertz: 48000,
  languageCode: 'pl-PL',
  enableWordTimeOffsets: true,
  enableAutomaticPunctuation: true,
  model: 'latest_long'
};
```

### ElevenLabs (Premium TTS)
```javascript
// Wysokiej jakości synteza
const elevenLabsConfig = {
  voice_id: 'rachel',
  model_id: 'eleven_multilingual_v2',
  voice_settings: {
    stability: 0.75,
    similarity_boost: 0.8
  }
};
```

## Konfiguracja i Deployment

### Environment Variables
```bash
# AI Service API Keys
OPENAI_API_KEY=sk-...
GOOGLE_SPEECH_KEY=AIza...
AZURE_COGNITIVE_KEY=abc123...
ELEVENLABS_API_KEY=sk_...

# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

### Wdrożenie Cloudflare Worker
```powershell
# Podstawowe wdrożenie
./deploy-voice-ai.ps1 -Environment development

# Z konfiguracją sekretów
./deploy-voice-ai.ps1 -Environment production -SetupSecrets

# Z testowaniem
./deploy-voice-ai.ps1 -Environment staging -TestAfterDeploy
```

### Konfiguracja DNS (Production)
```
voice-ai.mybonzo.com CNAME mybonzo-voice-ai-prod.workers.dev
```

## Testowanie i Debugging

### Unit Tests
```javascript
// Test rozpoznawania mowy
describe('Voice Recognition', () => {
  test('should recognize Polish commands', async () => {
    const result = await recognizeCommand('otwórz polaczek', 'pl-PL');
    expect(result.recognized).toBe(true);
    expect(result.command.action).toBe('togglePolaczekAssistant');
  });
});
```

### Integration Tests
```javascript
// Test API endpoint
describe('Voice API Integration', () => {
  test('should process voice synthesis request', async () => {
    const response = await fetch('/api/voice/synthesis', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Test synthesis',
        language: 'pl-PL'
      })
    });
    
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
  });
});
```

### Debug Commands
```javascript
// Browser Console Debugging
window.voiceAIDebug = {
  testRecognition: () => toggleVoiceAIWidget(),
  checkMicrophone: () => navigator.mediaDevices.getUserMedia({audio: true}),
  testSynthesis: (text) => speechSynthesis.speak(new SpeechSynthesisUtterance(text))
};
```

## Performance i Optymalizacja

### Caching Strategy
- **Recognition Results**: Cache w KV Storage (5 minut)
- **Synthesis Audio**: R2 Storage z CDN
- **Command Patterns**: Memory cache w Worker

### Rate Limiting
```javascript
const rateLimits = {
  recognition: '60 requests/minute',
  synthesis: '30 requests/minute', 
  analysis: '10 requests/minute',
  commands: '120 requests/minute'
};
```

### Audio Compression
```javascript
// Optymalizacja audio dla przesyłania
const audioConfig = {
  sampleRate: 16000,  // Wystarczające dla mowy
  channels: 1,        // Mono
  bitRate: 64000,     // 64kbps
  format: 'webm'      // Nowoczesny format
};
```

## Security i Privacy

### Data Protection
- Audio data jest przetwarzany w pamięci
- Brak trwałego składowania nagrań
- Szyfrowanie end-to-end dla API calls

### API Security
```javascript
// CORS i CSP headers
const securityHeaders = {
  'Access-Control-Allow-Origin': 'https://mybonzo.com',
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
};
```

### Privacy Compliance
- GDPR compliant (brak składowania danych osobowych)
- Opcjonalne logowanie dla debugging
- User consent dla microphone access

## Troubleshooting

### Częste Problemy

#### 1. Mikrofon nie działa
```javascript
// Sprawdź uprawnienia
navigator.permissions.query({name: 'microphone'})
  .then(result => console.log('Microphone permission:', result.state));
```

#### 2. Recognition nie rozpoznaje polskich komend
```javascript
// Sprawdź język
const recognition = new webkitSpeechRecognition();
console.log('Supported languages:', recognition.lang);
```

#### 3. Synthesis nie działa
```javascript
// Sprawdź dostępne głosy
speechSynthesis.getVoices().forEach(voice => {
  console.log(`${voice.name} (${voice.lang})`);
});
```

### Monitoring i Logi

#### Cloudflare Worker Logs
```bash
# Real-time monitoring
wrangler tail --env production

# Specific service logs
wrangler tail --env production --format pretty --grep "voice-ai"
```

#### Analytics Dashboard
- Request volume i response times
- Error rates per endpoint
- AI service usage statistics
- User engagement metrics

## Roadmap i Rozwój

### Planned Features

#### Q1 2025
- [ ] Real-time voice conversation mode
- [ ] Custom voice training
- [ ] Advanced emotion recognition
- [ ] Multi-speaker detection

#### Q2 2025  
- [ ] Voice biometrics authentication
- [ ] Real-time translation
- [ ] Voice-controlled UI navigation
- [ ] Offline mode support

#### Q3 2025
- [ ] AI voice cloning
- [ ] Voice analytics dashboard
- [ ] Integration with IoT devices
- [ ] Voice assistant SDK

### Contributing

#### Development Setup
```bash
# Clone i setup
git clone https://github.com/karollisson/mybonzo
cd mybonzo/luc-de-zen-on
pnpm install

# Start development server
pnpm dev

# Deploy voice worker
cd cloudflare-workers
./deploy-voice-ai.ps1 -Environment development
```

#### Code Standards
- TypeScript dla type safety
- ESLint + Prettier dla formatting
- Unit tests pokrycie >80%
- Dokumentacja dla publicznych API

## Support i Resources

### Documentation Links
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [Google Cloud Speech](https://cloud.google.com/speech-to-text/docs)

### Community
- GitHub Issues: [Report bugs](https://github.com/karollisson/mybonzo/issues)
- Discord: MyBonzo Development Server
- Email: support@mybonzo.com

### License
MIT License - zobacz pełny tekst w `LICENSE` pliku.

---

**Voice AI Agent** - Powered by MyBonzo Platform
*Last updated: September 2024*