# 🎨 Streamline Icons - Instrukcja użycia

## 📦 Instalacja

Streamline Icons zostały już zainstalowane i skonfigurowane w projekcie:

```bash
npm install @iconify-json/streamline astro-icon
```

## ⚙️ Konfiguracja

W `astro.config.mjs` dodano konfigurację astro-icon:

```javascript
import icon from "astro-icon";

export default defineConfig({
  integrations: [
    icon({
      include: {
        streamline: ['*'], // Wszystkie ikony Streamline
        lucide: ['*'],     // Lucide icons
        tabler: ['*'],     // Tabler icons
        heroicons: ['*'],  // Heroicons
        phosphor: ['*'],   // Phosphor icons
        feather: ['*']     // Feather icons
      }
    }),
    // ... inne integracje
  ],
});
```

## 🚀 Użycie w komponentach Astro

### Podstawowe użycie:

```astro
---
// W sekcji frontmatter nie trzeba nic importować
---

<!-- W HTML można używać komponentu Icon -->
<Icon name="streamline:interface-essential-home" class="icon" />
<Icon name="streamline:interface-essential-user" class="icon" />
<Icon name="streamline:interface-essential-settings" class="icon" />
```

### Z klasami CSS:

```astro
<Icon
  name="streamline:interface-essential-heart"
  class="w-6 h-6 text-red-500 hover:text-red-600 transition-colors"
/>
```

### Z różnymi rozmiarami:

```astro
<!-- Mała ikona -->
<Icon name="streamline:interface-essential-star" class="w-4 h-4" />

<!-- Średnia ikona -->
<Icon name="streamline:interface-essential-star" class="w-6 h-6" />

<!-- Duża ikona -->
<Icon name="streamline:interface-essential-star" class="w-8 h-8" />
```

## 📋 Popularne kategorie ikon

### Interface Essential
- `streamline:interface-essential-home` - Dom
- `streamline:interface-essential-user` - Użytkownik
- `streamline:interface-essential-settings` - Ustawienia
- `streamline:interface-essential-search` - Wyszukiwanie
- `streamline:interface-essential-heart` - Serce
- `streamline:interface-essential-star` - Gwiazda
- `streamline:interface-essential-bell` - Dzwonek
- `streamline:interface-essential-mail` - Poczta

### Business & Work
- `streamline:work-office-company` - Biuro
- `streamline:money-cash` - Pieniądze
- `streamline:shopping-bag` - Zakupy
- `streamline:travel-transportation` - Podróż

### Creative & Design
- `streamline:design-tools` - Narzędzia projektowe
- `streamline:images-pictures` - Zdjęcia
- `streamline:music-audio` - Muzyka
- `streamline:video-movies` - Wideo

### Technology
- `streamline:computer-hardware` - Sprzęt komputerowy
- `streamline:programming-coding` - Programowanie
- `streamline:internet-network` - Internet
- `streamline:mobile-phone` - Telefon

### Social & Communication
- `streamline:social-media` - Media społecznościowe
- `streamline:communication-chat` - Czat
- `streamline:users-people` - Ludzie
- `streamline:emotions` - Emocje

### Data & Analytics
- `streamline:data-analytics` - Analiza danych
- `streamline:charts-graphs` - Wykresy
- `streamline:files-documents` - Pliki
- `streamline:security` - Bezpieczeństwo

## 🎯 Przykład komponentu

```astro
---
// StreamlineIconButton.astro
export interface Props {
  icon: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const { icon, label, variant = 'primary' } = Astro.props;
---

<button class={`icon-button icon-button-${variant}`}>
  <Icon name={`streamline:${icon}`} class="w-5 h-5" />
  <span>{label}</span>
</button>

<style>
  .icon-button {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .icon-button-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white;
  }

  .icon-button-secondary {
    @apply bg-gray-600 hover:bg-gray-700 text-white;
  }

  .icon-button-danger {
    @apply bg-red-600 hover:bg-red-700 text-white;
  }
</style>
```

## 🔗 Przydatne linki

- [Streamline Icons Gallery](https://icon-sets.iconify.design/streamline/) - Wszystkie dostępne ikony
- [Iconify Docs](https://iconify.design/docs/) - Dokumentacja Iconify
- [Astro Icon Docs](https://www.astroicon.dev/) - Dokumentacja astro-icon

## 📝 Uwagi

1. **Brak pobierania na dysk** - Ikony są ładowane przez CDN Iconify, nie trzeba ich pobierać lokalnie
2. **Optymalizacja** - Astro automatycznie optymalizuje ikony w buildzie
3. **TypeScript** - Pełne wsparcie dla TypeScript
4. **Dostępność** - Ikony są dostępne w formacie SVG, więc są skalowalne i dostępne

## 🚀 Demo

Zobacz stronę demonstracyjną: `/streamline-icons-demo`

Na tej stronie znajdziesz przykłady użycia wszystkich kategorii ikon Streamline.
