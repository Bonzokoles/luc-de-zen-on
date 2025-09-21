# 🎛️ EMERGENCY CONTROLS & TEST SUITE - Przewodnik Użytkownika

## 🚨 NOWE PRZYCISKI KONTROLNE

Po wdrożeniu znajdziesz 4 nowe małe przyciski przy głównym **🎤 VOICE ON**:

### 🚨 STOP - Awaryjne zatrzymanie
- **Funkcja**: `emergencyStopAll()`
- **Co robi**: Natychmiastowo zatrzymuje wszystkie systemy Voice, czyści AudioContext, resetuje stan
- **Kiedy użyć**: Gdy system się zawiesił lub są błędy z dźwiękiem

### 🔄 RESET - Pełny restart systemu  
- **Funkcja**: `resetSystem()`
- **Co robi**: STOP + czeka 1s + reinicjalizuje wszystko w czystym stanie
- **Kiedy użyć**: Gdy chcesz zacząć od nowa bez odświeżania strony

### 🧪 TEST - Test wszystkich funkcji
- **Funkcja**: `testAllFunctions()` 
- **Co robi**: Sprawdza dostępność 25+ funkcji AI/Voice, pokazuje raport w console i alert
- **Kiedy użyć**: Gdy masz błędy "function is not defined"

### 📊 DEBUG - Status systemów Voice
- **Funkcja**: `debugVoiceStatus()`
- **Co robi**: Pokazuje live status: global voice ON/OFF, aktywne instancje, stan przycisków
- **Kiedy użyć**: Gdy chcesz zobaczyć co działa a co nie

## 🔧 FUNKCJE DOSTĘPNE W KONSOLI

Wszystkie funkcje są również dostępne w konsoli przeglądarki:

```javascript
// Awaryjne zatrzymanie wszystkiego
emergencyStopAll()

// Pełny reset systemu  
resetSystem()

// Test dostępności funkcji
testAllFunctions()

// Debug status Voice
debugVoiceStatus()

// Ręczna inicjalizacja AudioContext
initializeAudioContext()
```

## 🎯 ROZWIĄZYWANIE PROBLEMÓW

### Problem: "startGeminiProVoice is not defined"
1. Kliknij **🧪 TEST** - sprawdzi czy funkcje są dostępne
2. Jeśli brakuje funkcji → odśwież stronę (Ctrl+F5)
3. Jeśli nadal problem → kliknij **🔄 RESET**

### Problem: Dźwięk się zawiesił
1. Kliknij **🚨 STOP** - zatrzyma wszystkie Voice systemy
2. Poczekaj 2 sekundy
3. Spróbuj ponownie włączyć Voice

### Problem: Przyciski nie działają
1. Kliknij **📊 DEBUG** - pokaże status wszystkich przycisków  
2. Sprawdź console (F12) czy są błędy
3. Kliknij **🔄 RESET** jeśli potrzeba

## 🎨 DESIGN PRZYCISKÓW

- **Czerwony (STOP)**: Niebezpieczne działanie - zatrzymuje wszystko
- **Pomarańczowy (RESET)**: Restart - bezpieczny ale resetuje stan  
- **Niebieski (TEST)**: Diagnostyka - bezpieczny, tylko sprawdza
- **Zielony (DEBUG)**: Info - bezpieczny, tylko pokazuje status

Wszystkie przyciski mają tooltips - najedź myszką aby zobaczyć opis!

---
*Auto-deployed na https://luc-de-zen-on.pages.dev za ~2 minuty*