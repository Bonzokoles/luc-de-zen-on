Oto szczegółowa instrukcja konfiguracji narzędzia Wrangler oraz sekretów środowiskowych (Secrets) dla API kluczy i integracji Cloudflare AI.

1. Instalacja i konfiguracja Wrangler
Krok 1: Zainstaluj Wrangler (jeśli nie masz)
bash
npm install -g wrangler
Krok 2: Zaloguj się do Cloudflare przez Wrangler
bash
wrangler login
Postępuj zgodnie z instrukcjami w przeglądarce, aby autoryzować CLI.

Krok 3: Inicjalizuj projekt (jeśli jeszcze nie masz)
W katalogu projektu:

bash
wrangler init
Lub, jeśli masz projekt Astro, możesz pominąć ten krok i ręcznie stworzyć plik konfiguracyjny.

2. Konfiguracja pliku wrangler.toml
Przykład pliku wrangler.toml dla Twojego projektu:

text
name = "mybonzo-worker"
type = "javascript" # lub "webpack" / "rust" w zależności od setupu

account_id = "<TWOJE_ACCOUNT_ID>"
workers_dev = true
compatibility_date = "2025-08-27" # obowiązkowe, data kompatybilności

# Binding dla Workers KV - baza agentów
[[kv_namespaces]]
binding = "AGENTS"
id = "<ID_KV_AGENTS>"

# Binding dla Workers AI
[[ai]]
binding = "AI"

# Sekrety NIE WSTAWIAMY DO PLIKU wrangler.toml!
# Załaduj je za pomocą komend CLI
account_id znajdziesz w dashboardzie Cloudflare w panelu konta.

id podaj wzięte z dashboardu na zakładce Workers KV.

3. Dodawanie sekretów (Secrets) z kluczami API
Jak dodać sekret do Workers:
bash
wrangler secret put OPENAI_API_KEY
Po wykonaniu tej komendy wpisz swój klucz API (np. z OpenAI lub innej usługi AI).

4. Publikacja Workers z nową konfiguracją
Po skonfigurowaniu wszystkiego:

bash
wrangler publish
To wdroży Workers.com z podaną konfiguracją i sekretami.

5. Testowanie i debugowanie
W konsoli Cloudflare lub przez wrangler tail możesz obserwować logi na żywo:

bash
wrangler tail
Sprawdzaj odpowiedzi serwera, błędy i sukcesy.

6. Podsumowanie dla Twojego projektu
W wrangler.toml masz bindingi dla AI (model Cloudflare Workers AI) i AGENTS (Workers KV baza).

Sekret OPENAI_API_KEY należy dodać oddzielnie komendą wrangler secret put OPENAI_API_KEY.

Po każdej zmianie konfiguracji publikuj zmiany wrangler publish.

Lokalne testy z Astro możesz robić równolegle.

