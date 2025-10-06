# 🌊 Sekwencyjne Wizualizatory Muzyki - Instrukcja Obsługi

## Funkcjonalność
Strona zawiera **3 wizualizatory audio** które przełączają się automatycznie jeden po drugim co 3 sekundy:

### Wizualizatory:
1. **Warstwa tylna (music hue-rotated)** - Reaguje na muzykę, obracane kolory, jaśniejsze
2. **Warstwa tylna odbita (music darker)** - Reaguje na muzykę, odbita w poziomie, ciemniejsza  
3. **Warstwa przednia (mic)** - Reaguje na mikrofon, główna warstwa

## Kontrola

### Automatyczne Przełączanie
- Uruchamia się automatycznie po załadowaniu strony
- Przełącza wizualizatory co 3 sekundy
- Pokazuje jeden wizualizator na raz z płynną animacją

### Przycisk w Odtwarzaczu Muzyki
**🌊 Przycisk** w panelu kontrolnym:
- **Kliknij** = Włącz/Wyłącz automatyczne przełączanie
- **Zielony kolor** = Wizualizator aktywny

### Konsola Deweloperska (F12)
```javascript
// Włącz cykl
window.startVisualizerCycle()

// Wyłącz cykl  
window.stopVisualizerCycle()

// Przełącz (włącz/wyłącz)
window.toggleVisualizerCycle()
```

## Test
1. Otwórz http://localhost:3007
2. Odtwórz muzykę lub włącz mikrofon  
3. Obserwuj automatyczne przełączanie wizualizatorów
4. Testuj przycisk 🌊 w odtwarzaczu
5. Sprawdź konsole na logi: `🎵 Switched to visualizer X/3`

## Rozwiązywanie Problemów
- Jeśli wizualizatory nie działają: sprawdź czy muzyka/mikrofon są aktywne
- W razie problemów: odśwież stronę (F5)
- Console.log pokazuje status przełączania
