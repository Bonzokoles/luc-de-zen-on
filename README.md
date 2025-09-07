# MyBonzo - Reaktywny szablon portfolio

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Bonzokoles/luc-de-zen-on)

![homepage-top](https://github.com/user-attachments/assets/b1b8ed1c-4575-452d-8420-36b0d46b31bb)

<!-- dash-content-start -->

Szablon MyBonzo to nowoczesna strona portfolio z automatycznym tagowaniem projektów, galerią postów i pełnym wsparciem SEO. Zbudowany w Astro i wdrażany na Cloudflare Workers jako [static website](https://developers.cloudflare.com/workers/static-assets/).

![homepage-bottom](https://github.com/user-attachments/assets/041b2062-094e-483e-b37c-ccca537eeddc)

## Najważniejsze funkcje

- ✅ Automatyczne tagowanie projektów w sekcji hero
- ✅ Galeria postów z sortowaniem po tagach
- ✅ 100/100 w Lighthouse (wydajność)
- ✅ SEO, kanoniczne adresy URL, OpenGraph
- ✅ Sitemap i RSS
- ✅ Obsługa Markdown i MDX
- ✅ Built-in Observability logging

<!-- dash-content-end -->

## Instrukcja uruchomienia

Wszystkie polecenia uruchamiaj w katalogu głównym projektu:

1. **Zainstaluj zależności:**
   ```bash
   pnpm install
   ```

2. **Uruchom serwer deweloperski:**
   ```bash
   pnpm dev
   ```

3. **Buduj wersję produkcyjną:**
   ```bash
   pnpm build
   ```

4. **Podgląd produkcyjny:**
   ```bash
   pnpm preview
   ```

## 🚀 Struktura projektu

Astro szuka plików `.astro` lub `.md` w katalogu `src/pages/`. Każda strona jest eksponowana jako trasa na podstawie nazwy pliku.

W katalogu `src/components/` znajdziesz komponenty Astro/React/Vue/Svelte/Preact.

Katalog `src/content/` zawiera "kolekcje" powiązanych dokumentów Markdown i MDX. Użyj `getCollection()` aby pobrać posty z `src/content/blog/` i sprawdzić frontmatter używając opcjonalnego schematu. Zobacz [dokumentację Content Collections Astro](https://docs.astro.build/en/guides/content-collections/).

Wszelkie zasoby statyczne, takie jak obrazy, można umieścić w katalogu `public/`.

## Wdrażanie

Szablon można wdrożyć na Cloudflare Workers używając [C3](https://developers.cloudflare.com/pages/get-started/c3/) (narzędzie CLI `create-cloudflare`):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/astro-blog-starter-template
```

## 🧞 Polecenia

Wszystkie polecenia uruchamiane są z głównego katalogu projektu w terminalu:

| Polecenie                         | Akcja                                            |
| :-------------------------------- | :----------------------------------------------- |
| `pnpm install`                    | Instaluje zależności                            |
| `pnpm dev`                        | Uruchamia lokalny serwer dev na `localhost:4321`|
| `pnpm build`                      | Buduje stronę produkcyjną do `./dist/`          |
| `pnpm preview`                    | Podgląd buildu lokalnie, przed wdrożeniem       |
| `pnpm astro ...`                  | Uruchamia polecenia CLI jak `astro add`, `astro check` |
| `pnpm astro -- --help`            | Pomoc dla Astro CLI                              |
| `pnpm build && pnpm deploy`       | Wdróż stronę produkcyjną na Cloudflare          |
| `npm wrangler tail`               | Zobacz logi w czasie rzeczywistym dla Workers   |

## 👀 Chcesz dowiedzieć się więcej?

Sprawdź [dokumentację Astro](https://docs.astro.build) lub dołącz na [serwer Discord](https://astro.build/chat).

## Kredyty

Ten szablon bazuje na pięknym [Bear Blog](https://github.com/HermanMartinus/bearblog/).
