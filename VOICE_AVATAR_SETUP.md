# Voice Avatar Setup Guide

## 📸 Dodawanie Twojego Zdjęcia

### 1. Umieść zdjęcie w folderze public
```
public/
  avatar.jpg       <- Twoje główne zdjęcie
  avatar-thumb.jpg <- Opcjonalnie: mniejsza wersja
```

### 2. Zalecane parametry zdjęcia
- **Format**: JPG, PNG, WebP
- **Rozmiar**: 512x512px (kwadratowe)
- **Jakość**: Wysokiej rozdzielczości
- **Tło**: Najlepiej jednolite lub usunięte

### 3. Testowanie Avatar
Otwórz w przeglądarce:
```
http://localhost:4321/voice-avatar-test
```

## 🎨 Dostępne Efekty Wizualne

### States Avatara
- **Idle** (Spokój): Delikatny ring, neutralny wygląd
- **Listening** (Słuchanie): Niebieski pulsujący ring
- **Speaking** (Mówienie): Zielony ring z animacją
- **Thinking** (Myślenie): Subtelne efekty przejścia

### Ring Animations
```css
/* Listening State */
ring-4 ring-blue-400 ring-opacity-75

/* Speaking State */  
ring-4 ring-green-400 ring-opacity-75

/* Idle State */
ring-2 ring-gray-300 ring-opacity-50
```

## 🔧 Customization Options

### Zmiana rozmiaru avatara
```tsx
// W VoiceAvatarComponent.tsx, zmień klasy:
w-32 h-32  // Default: 128px
w-24 h-24  // Smaller: 96px  
w-40 h-40  // Larger: 160px
```

### Własne style
```tsx
<VoiceAvatarComponent 
  variant="hero"
  avatarSrc="/avatar.jpg"
  avatarType="image"
  className="custom-avatar-styles"
/>
```

### Multiple Avatars
```tsx
// Różne avatary dla różnych kontekstów
<VoiceAvatarComponent avatarSrc="/avatar-formal.jpg" />
<VoiceAvatarComponent avatarSrc="/avatar-casual.jpg" />
<VoiceAvatarComponent avatarSrc="/avatar-fun.jpg" />
```

## 🎯 Integration Examples

### Na głównej stronie
```astro
---
import { VoiceAvatarComponent } from '../components/voice-ai/VoiceAvatarComponent';
---

<VoiceAvatarComponent 
  variant="hero"
  avatarSrc="/avatar.jpg"
  avatarType="image"
/>
```

### W sidebarze
```astro
<VoiceAvatarComponent 
  variant="compact"
  avatarSrc="/avatar.jpg"
  avatarType="image"
  className="w-full"
/>
```

### Floating assistant
```astro
<VoiceAvatarComponent 
  variant="floating"
  avatarSrc="/avatar.jpg"
  avatarType="image"
/>
```

## 🚀 Next Steps

1. **Upload zdjęcia** do `/public/avatar.jpg`
2. **Test strony** na `http://localhost:4321/voice-avatar-test`
3. **Dostosuj style** według preferencji
4. **Integruj** z głównymi stronami
5. **Deploy** Voice AI Worker dla pełnej funkcjonalności

## 💡 Pro Tips

### Optymalizacja zdjęcia
- Użyj narzędzi jak Photoshop/GIMP do usunięcia tła
- Skompresu obraz dla szybszego ładowania
- Przygotuj wersje w różnych rozmiarach

### Performance
- WebP format dla lepszej kompresji
- Lazy loading dla dużych obrazów
- CDN dla globalnej dystrybucji

### Accessibility
- Alt text dla screen readers
- Keyboard navigation support
- High contrast mode compatibility
