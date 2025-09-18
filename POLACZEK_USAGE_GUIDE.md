# 🎯 POLACZEK System - Instrukcja użytkowania

## 🚀 Jak używać POLACZEK na głównej stronie

### 1. 📊 BigQuery Analytics
**Na głównej stronie:**
- W sekcji "BigQuery Analytics" wpisz zapytanie SQL
- Kliknij "Analizuj" lub "Otwórz"

**Przykładowe zapytania:**
```sql
SELECT * FROM conversations LIMIT 10
SELECT COUNT(*) as total_users FROM users
SELECT topic, COUNT(*) as frequency FROM conversations GROUP BY topic
```

**API Endpoint:** `https://mybonzo.com/api/polaczek/bigquery`
**Team Lead:** Anna Nowak - BigQuery Analytics

---

### 2. 🔍 Kaggle Datasets  
**Na głównej stronie:**
- W sekcji "Kaggle Datasets" wpisz frazę wyszukiwania
- Kliknij "Wyszukaj" lub "Otwórz"

**Przykładowe wyszukiwania:**
```
polish nlp
sentiment analysis
machine learning
polish language
qa dataset
```

**API Endpoint:** `https://mybonzo.com/api/polaczek/kaggle`
**Team Lead:** Piotr Wiśniewski - Kaggle Research

---

### 3. 🎵 Music Player + Wizualizatory
**Kontrola muzyki:**
- ▶️ Play/Pause przycisk
- ⏭️ Następny/Poprzedni utwór
- 🔊 Regulacja głośności
- 🌊 Przycisk sterowania wizualizatorami

**Wizualizatory muzyki:**
- **Automatyczne przełączanie**: Co 3 sekundy między 3 wizualizatorami
- **Ręczna kontrola**: Przycisk 🌊 w music playerze
- **Tryby wizualizacji:**
  1. Music hue-rotated (kolorowe spektrum)
  2. Music darker mirrored (ciemniejsze odbicie)  
  3. Mic front layer (mikrofon na pierwszym planie)

**Komendy konsoli:**
```javascript
// Sterowanie wizualizatorami
window.startVisualizerCycle()    // Start automatycznego przełączania
window.stopVisualizerCycle()     // Stop automatycznego przełączania  
window.toggleVisualizerCycle()   // Przełącz stan

// Sterowanie muzyką
window.MUSIC.play()              // Włącz muzykę
window.MUSIC.pause()             // Zatrzymaj muzykę
window.MUSIC.toggle()            // Przełącz play/pause
window.MUSIC.next()              // Następny utwór
window.MUSIC.setVolume(0.5)      // Ustaw głośność 50%
```

---

### 4. 💬 AI Assistant (POLACZEK Chat)
**Dostęp:**
- Przycisk "AI ASSISTANT" w prawym górnym rogu
- Floating widget z AiHelpAssistant

**Funkcje:**
- Wyjaśnianie funkcji strony
- Pomoc z BigQuery zapytaniami
- Wskazówki dotyczące wyszukiwania w Kaggle
- Pomoc techniczna

---

### 5. 🔧 Workers Status Dashboard
**Monitoring:**
- Status wszystkich POLACZEK workerów
- Czas odpowiedzi API
- Dostępność usług

**Workery do monitorowania:**
- ✅ POLACZEK BigQuery Worker
- ✅ POLACZEK Kaggle Worker  
- ✅ Polish Music Worker
- ✅ Main Chat Worker

---

## 🎮 Praktyczne scenariusze użycia

### Scenariusz 1: Analiza danych muzycznych
1. **Włącz muzykę** - przycisk ▶️ w music playerze
2. **Aktywuj wizualizatory** - przycisk 🌊 dla automatycznego przełączania
3. **Przejdź do BigQuery** - kliknij "BigQuery Analytics" 
4. **Wykonaj zapytanie:**
   ```sql
   SELECT artist, COUNT(*) as plays 
   FROM music_analytics 
   GROUP BY artist 
   ORDER BY plays DESC
   ```

### Scenariusz 2: Wyszukiwanie zbiorów danych
1. **Otwórz Kaggle search** - kliknij "Kaggle Datasets"
2. **Wyszukaj polskie dane NLP:**
   ```
   polish sentiment analysis
   ```
3. **Przeanalizuj wyniki** w BigQuery po pobraniu danych

### Scenariusz 3: Multimedialne doświadczenie
1. **Uruchom muzykę** 🎵
2. **Włącz wizualizatory** 🌊 (automatyczne przełączanie co 3s)
3. **Pracuj z danymi** w BigQuery/Kaggle
4. **Korzystaj z AI Assistant** dla wsparcia

---

## 📍 Dostępne URLs

### Główne API endpoints:
- `https://mybonzo.com/api/polaczek/bigquery` - Analytics
- `https://mybonzo.com/api/polaczek/kaggle` - Datasets  
- `https://mybonzo.com/api/muzyka` - Polish Music

### Dedykowane strony:
- `/bigquery-analytics` - BigQuery interface
- `/kaggle-datasets` - Kaggle search interface
- `/` - Główna strona z wszystkimi funkcjami

### Health checks:
- `https://mybonzo.com/api/polaczek/bigquery/health`
- `https://mybonzo.com/api/polaczek/kaggle/health`

---

## 👥 Zespół POLACZEK_23

### 🔬 **Anna Nowak** - BigQuery Analytics Lead
- **Specjalizacja:** Analityka danych, SQL optimization
- **Email:** anna.nowak@mybonzo.com
- **Obszar:** Google Cloud BigQuery

### 🔍 **Piotr Wiśniewski** - Kaggle Research Lead  
- **Specjalizacja:** Dataset discovery, ML research
- **Email:** piotr.wisniewski@mybonzo.com
- **Obszar:** Kaggle API integration

### 🎵 **Maria Wójcik** - AI Language Trainer
- **Specjalizacja:** Polski NLP, language models
- **Email:** maria.wojcik@mybonzo.com  
- **Obszar:** Polish AI training data

### 🏗️ **Jakub Kowalski** - System Integration Lead
- **Specjalizacja:** System architecture, API integration
- **Email:** jakub.kowalski@mybonzo.com
- **Obszar:** Full-stack coordination

---

## 🚨 Rozwiązywanie problemów

### BigQuery nie działa?
```javascript
// Test w konsoli
fetch('/api/polaczek/bigquery/health')
  .then(r => r.json())
  .then(console.log)
```

### Kaggle nie zwraca wyników?
```javascript
// Test wyszukiwania
fetch('/api/polaczek/kaggle', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({search: 'test'})
}).then(r => r.json()).then(console.log)
```

### Wizualizatory nie działają?
```javascript
// Reset wizualizatorów
window.stopVisualizerCycle()
setTimeout(() => window.startVisualizerCycle(), 1000)
```

### Muzyka nie gra?
```javascript
// Test music API
console.log(window.MUSIC.getState())
window.MUSIC.ensureLoaded()
```

---

**Ostatnia aktualizacja:** 18 września 2025  
**Wersja systemu:** POLACZEK_23 v2.3.0  
**Status:** 🟢 Wszystkie systemy operacyjne