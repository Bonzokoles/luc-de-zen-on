# Agent 05 - File Manager

## 📁 Opis
Agent File Manager zapewnia kompletne zarządzanie plikami w systemie. Obsługuje wszystkie podstawowe operacje CRUD oraz zaawansowane funkcje wyszukiwania i organizacji plików.

## 🚀 Funkcjonalności

### Podstawowe operacje
- **Lista plików** - Przeglądanie zawartości folderów
- **Upload plików** - Przesyłanie nowych plików tekstowych
- **Download plików** - Pobieranie zawartości plików
- **Usuwanie** - Usuwanie plików i folderów (z potwierdzeniem)
- **Zmiana nazwy** - Przemianowywanie plików i folderów
- **Tworzenie folderów** - Organizacja struktury katalogów

### Zaawansowane funkcje
- **Wyszukiwanie rekursywne** - Znajdowanie plików w całym drzewie katalogów
- **Sortowanie** - Według nazwy, rozmiaru, daty modyfikacji
- **Widok siatki/lista** - Różne tryby wyświetlania
- **Podgląd metadanych** - Rozmiar, data, rozszerzenie
- **Operacje wsadowe** - Zaznaczanie wielu plików

## 🛡️ Bezpieczeństwo

### Ograniczenia dostępu
```typescript
allowedPaths: [
  './src',
  './public', 
  './docs',
  './scripts',
  './config'
]
```

### Obsługiwane formaty
- Pliki tekstowe: `.txt`, `.md`, `.json`, `.xml`
- Kód źródłowy: `.js`, `.ts`, `.jsx`, `.tsx`, `.py`, `.java`
- Pliki webowe: `.html`, `.css`, `.scss`
- Konfiguracja: `.yaml`, `.yml`, `.toml`, `.ini`

### Limity
- Maksymalny rozmiar pliku: **10MB**
- Tylko dozwolone ścieżki
- Walidacja rozszerzeń plików

## 📊 API Endpoints

### Główny endpoint
```
POST /api/agents/file-manager
```

### Dostępne akcje

#### Test agenta
```json
{
  "action": "test"
}
```

#### Status agenta  
```json
{
  "action": "status"
}
```

#### Lista plików
```json
{
  "action": "list",
  "path": "./src"
}
```

#### Upload pliku
```json
{
  "action": "upload",
  "path": "./src",
  "filename": "nowy-plik.js",
  "content": "console.log('Hello World');"
}
```

#### Download pliku
```json
{
  "action": "download",
  "path": "./src/example.js"
}
```

#### Usunięcie pliku/folderu
```json
{
  "action": "delete",
  "path": "./src/old-file.js"
}
```

#### Zmiana nazwy
```json
{
  "action": "rename",
  "path": "./src/old-name.js",
  "newName": "new-name.js"
}
```

#### Utworzenie folderu
```json
{
  "action": "create-folder",
  "path": "./src/new-folder"
}
```

#### Wyszukiwanie
```json
{
  "action": "search",
  "query": "component",
  "path": "./src",
  "recursive": true
}
```

## 🎨 Interface

### Główny widok
- **Header z breadcrumbami** - Nawigacja po ścieżkach
- **Przyciski akcji** - Upload, nowy folder, odświeżenie
- **Filtrowanie i sortowanie** - Wyszukiwanie, tryby widoku
- **Lista plików** - Ikony, metadane, akcje

### Modalne okna
- **Upload Modal** - Nazwa pliku i zawartość
- **New Folder Modal** - Nazwa nowego folderu
- **Confirmation Dialogs** - Potwierdzenie usuwania

### Stylistyka
- **Sharp Design** - Brak zaokrąglonych narożników
- **Cyberpunk Theme** - Neon kolory, glass effects
- **Polish Language** - Wszystkie etykiety w języku polskim
- **Responsive** - Dostosowanie do różnych ekranów

## 🔧 Technologie

### Backend
- **Node.js fs promises** - Operacje na plikach
- **Path module** - Manipulacja ścieżek
- **TypeScript** - Typy dla bezpieczeństwa

### Frontend  
- **Svelte 5** - Reaktywny komponent UI
- **CSS Custom Properties** - Themowanie
- **Accessibility** - ARIA labels, keyboard navigation

## 💡 Przykłady użycia

### Tworzenie nowego pliku
1. Kliknij "📤 Prześlij plik"
2. Podaj nazwę: `components/Button.svelte`
3. Wklej zawartość kodu
4. Zatwierdź przyciskiem "Prześlij"

### Organizacja projektu
1. Utwórz folder `components`
2. Przenieś pliki `.svelte` do nowego folderu
3. Aktualizuj importy w plikach nadrzędnych

### Wyszukiwanie plików
1. Wpisz frazę w pole wyszukiwania
2. Agent przeszuka rekursywnie wszystkie podfoldery
3. Wyniki pokazują pełne ścieżki dopasowań

## ⚠️ Uwagi

- Agent działa tylko w środowisku z dostępem do file system
- Nie obsługuje plików binarnych (obrazy, wideo)
- Operacje są asynchroniczne, jednak przy bardzo dużych plikach czas wykonania może być odczuwalny
- Wymaga uprawnień do odczytu/zapisu w dozwolonych folderach

## 🔮 Roadmap

### Wersja 1.1
- [ ] Obsługa plików binarnych
- [ ] Kompresja/dekompresja archiwów
- [ ] Podgląd obrazów w interfejsie
- [ ] Edytor tekstowy inline

### Wersja 1.2
- [ ] Integracja z cloud storage
- [ ] Wersjonowanie plików
- [ ] Współdzielenie linków
- [ ] API webhooks dla zmian
