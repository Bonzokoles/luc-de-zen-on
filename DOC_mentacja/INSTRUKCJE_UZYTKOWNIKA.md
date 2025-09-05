# 📖 INSTRUKCJE UŻYTKOWNIKA - AGENTS SYSTEM

## 🚀 Quick Start Guide

### 1. Logowanie do Systemu
- Przejdź na stronę: `http://localhost:4321/login`
- **Admin:** Użyj hasła `HAOS77`
- **Client:** Użyj standardowego hasła
- Po zalogowaniu zostaniesz przekierowany na stronę zarządzania

### 2. Tworzenie Nowego Agenta
1. Kliknij "🚀 Prawdziwy Agent" aby otworzyć kreator
2. Wypełnij formularz:
   - **Nazwa:** np. "Asystent_Marketingu"
   - **Typ zadań:** analiza, tworzenie, tłumaczenie
   - **Parametry AI:** temperatura (0.1-1.0), model
3. Przetestuj działanie przed zapisem
4. Zapisz agenta do systemu

### 3. Zarządzanie Agentami
Użyj karty "Zarządzaj Agentami":
- **"Agents Report"** - raport aktywności i statystyki
- **"Management"** - edycja, usuwanie i konfiguracja
- **"Monitoring"** - sprawdzanie statusu i wydajności

## 💡 Best Practices

### Efektywne Prompty
- Bądź precyzyjny w opisie zadania
- Podaj przykłady oczekiwanego wyniku
- Określ format odpowiedzi (JSON, tekst, lista)
- Ustaw ograniczenia i reguły
- Użyj kontekstu i ról ("Jesteś ekspertem od...")

### Optymalizacja Wydajności
- **Niska temperatura (0.1-0.3):** dla precyzji i faktów
- **Wysoka temperatura (0.7-1.0):** dla kreatywności
- **Testowanie modeli:** porównuj wyniki różnych AI
- **Monitoring tokenów:** sprawdzaj zużycie zasobów

## 🔧 Rozwiązywanie Problemów

### Agent nie odpowiada
1. Sprawdź status w sekcji "Monitoring"
2. Zrestartuj agenta przez Management
3. Sprawdź logi systemu w zakładce "Logi"

### Błędne odpowiedzi
1. Udoskonal prompt - dodaj więcej szczegółów
2. Zmień parametry temperatury AI
3. Przetestuj z innymi przykładami
4. Sprawdź czy kontekst jest wystarczający

### Przekroczenie limitów
1. Sprawdź użycie tokenów w Premium Features
2. Optymalizuj długość promptów
3. Rozważ upgrade planu
4. Monitoruj frequency limits

## ⚡ Zaawansowane Funkcje

### Łączenie Agentów (Pipeline)
```javascript
// Przykład łączenia agentów
const pipeline = {
  agent1: "translator", // Tłumaczy tekst
  agent2: "summarizer", // Streszcza przetłumaczony tekst
  agent3: "formatter"   // Formatuje wynik
};
```

### API Integracje
```javascript
// Przykład integracji z zewnętrznym API
const config = {
  endpoint: "https://api.example.com",
  headers: { "Authorization": "Bearer TOKEN" },
  method: "POST"
};
```

### Harmonogramy
- Uruchamiaj agentów automatycznie
- Ustawiaj cykliczne zadania
- Integruj z kalendarzem
- Monitoruj wykonanie zadań

## 📚 Dodatkowe Zasoby

### Pliki Konfiguracyjne
- `AGENTS_23/` - definicje agentów
- `DOC_mentacja/` - dokumentacja systemu
- `src/components/` - komponenty UI

### Zewnętrzne Linki
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Astro Framework Docs](https://docs.astro.build)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)

## 🔄 Rozwój i Aktualizacje

### Dodawanie Nowych Tutoriali
1. Edytuj plik `src/pages/agents.astro`
2. Dodaj nową kartę w sekcji "INSTRUKCJE UŻYTKOWANIA"
3. Stwórz odpowiedni plik `.md` w `DOC_mentacja/`
4. Zaktualizuj linki i nawigację

### Przykład Nowej Karty
```astro
<div class="tutorial-card bg-gradient-to-br from-blue-900/40 to-blue-700/20 border border-blue-500/30 rounded-xl p-8">
  <h3 class="text-2xl font-bold text-blue-300 mb-6">
    🎯 Nowy Tutorial
  </h3>
  <p class="text-gray-300">Opis tutorialu...</p>
  <!-- Treść tutorialu -->
</div>
```

### Struktura Folderów do Rozszerzania
```
DOC_mentacja/
├── INSTRUKCJE_AGENTS_23.md    # Główna dokumentacja
├── INSTRUKCJE_UZYTKOWNIKA.md  # Ten plik
├── tutorials/                 # Nowe tutoriale
│   ├── basic/                # Podstawowe przewodniki
│   ├── advanced/             # Zaawansowane funkcje
│   └── examples/             # Przykłady kodu
├── api/                      # Dokumentacja API
└── video/                    # Linki do video tutoriali
```

---

## 🆘 Pomoc i Support

**Kontakt:**
- System Issue: Sprawdź logi w zakładce "Logi"
- Dokumentacja: `INSTRUKCJE_AGENTS_23.md`
- Kod źródłowy: Dostępny w `src/` dla modyfikacji

**Stan Rozwoju:**
- ✅ Podstawowe funkcje zaimplementowane
- ✅ System logowania funkcjonalny
- ✅ Kreator agentów dostępny
- 🔄 Monitoring w rozwoju
- 🔄 API integracje planowane
- 🔄 Harmonogramy w przygotowaniu

---

*Dokumentacja aktualizowana: Wrzesień 2025*
*Wersja systemu: AGENTS_23.5*
