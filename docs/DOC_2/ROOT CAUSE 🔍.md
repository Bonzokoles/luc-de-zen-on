ROOT CAUSE 🔍
Astro wymaga dokładnej struktury katalogów dla:

✅ Stron (src/pages/)
✅ API Routes (src/pages/api/)
✅ Middleware (src/middleware.ts)
✅ Adapterów (Cloudflare)
Jeśli katalogi nie istnieją → Astro nie może generować tras → API fails

ROZWIĄZANIE 1️⃣: Poprawna Struktura Katalogów ⚙️
Wymagana struktura projektu:


my-astro-project/
├── src/
│   ├── pages/                    ← OBOWIĄZKOWY!
│   │   ├── index.astro          ← Strona główna
│   │   ├── about.astro          ← /about
│   │   ├── api/                 ← API Routes
│   │   │   ├── hello.ts         ← /api/hello
│   │   │   ├── users/
│   │   │   │   └── [id].ts      ← /api/users/:id
│   │   │   └── contact.ts       ← POST /api/contact
│   │   └── [...rest].astro      ← Fallback route
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── components/
│   │   └── Header.astro
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   └── middleware.ts            ← Optional
│
├── public/
│   ├── favicon.svg
│   └── robots.txt
│
├── astro.config.mjs             ← Konfiguracja
├── tsconfig.json
├── package.json
└── wrangler.toml               ← Cloudflare config
Szybkie utworzenie brakujących katalogów:
bash


# Utwórz brakujące katalogi
mkdir -p src/pages/api
mkdir -p src/components
mkdir -p src/layouts
mkdir -p src/lib
ROZWIĄZANIE 2️⃣: Konfiguracja astro.config.mjs 📝
Prawidłowa konfiguracja dla Cloudflare Pages:
javascript


// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Musi być 'server' dla API Routes
  output: 'server',
  
  // Adapter Cloudflare
  adapter: cloudflare({
    // Opcje adaptera
    mode: 'directory',
    cacheOnDemand: true,
    wasmModuleImports: true,
  }),
  
  // Ścieżka do pages (domyślnie src/pages)
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  
  // Integracje
  integrations: [
    // Dodaj inne integracje tutaj
  ],
  
  // Vite configuration
  vite: {
    ssr: {
      // Excluduj pakiety jeśli potrzeba
      noExternal: ['some-package'],
    },
  },
});
Ważne ustawienia:
javascript


// ❌ ŹRÓDŁO BŁĘDU - Jeśli masz to:
output: 'static',  // API Routes nie będą działać!

// ✅ PRAWIDŁOWO:
output: 'server',  // Włącza SSR i API Routes
ROZWIĄZANIE 3️⃣: Tworzenie API Routes 🔌
Przykład 1: Prosty endpoint GET
typescript


// src/pages/api/hello.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Hello from Astro API!',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
Dostęp: GET /api/hello

Przykład 2: Endpoint POST z walidacją
typescript


// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const prerender = false; // ❌ WAŻNE! Inaczej nie zadziała w produkcji

export const POST: APIRoute = async ({ request }) => {
  // Sprawdzenie metody
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = await request.json();
    const { name, email, message } = data;

    // Walidacja
    if (!name || !email || !message) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Przetwarzanie (np. wysłanie maila)
    // const result = await sendEmail({ name, email, message });

    return new Response(JSON.stringify({
      success: true,
      message: 'Message received'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Invalid JSON'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
Dostęp: POST /api/contact

Przykład 3: Dynamiczne API Routes
typescript


// src/pages/api/users/[id].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response('ID is required', { status: 400 });
  }

  // Pobieranie użytkownika z bazy danych
  const user = await fetchUser(parseInt(id));

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Jeśli używasz getStaticPaths dla SSG
export async function getStaticPaths() {
  const users = await getAllUsers();
  return users.map(user => ({
    params: { id: user.id }
  }));
}
Dostęp: GET /api/users/123

ROZWIĄZANIE 4️⃣: package.json - Zainstaluj Adaptery 📦
Zainstaluj Cloudflare Adapter:
bash


# Automatycznie (najlepsze)
npm run astro add cloudflare

# LUB ręcznie
npm install @astrojs/cloudflare
Sprawdzenie package.json:
json


{
  "name": "astro-cloudflare-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "wrangler pages deploy dist"
  },
  "dependencies": {
    "astro": "^4.5.0",
    "@astrojs/cloudflare": "^9.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
ROZWIĄZANIE 5️⃣: wrangler.toml - Cloudflare Config ☁️
Prawidłowa konfiguracja:
toml


# wrangler.toml
name = "my-astro-project"
type = "javascript"
main = "dist/server/entry.mjs"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "example.com/*", zone_name = "example.com" }
]

[build]
command = "npm run build"
cwd = "./"
watch_paths = ["src/**/*.{ts,tsx,astro}"]

# Zmienne środowiskowe
[env.production.vars]
ENVIRONMENT = "production"
API_URL = "https://api.example.com"

[env.development.vars]
ENVIRONMENT = "development"
API_URL = "http://localhost:3000"
ROZWIĄZANIE 6️⃣: Krok po Kroku - Naprawianie Projektu ✅
1. Zainstaluj brakujące pakiety:
bash


npm install
npm run astro add cloudflare
2. Utwórz strukturę katalogów:
bash


mkdir -p src/pages/api
mkdir -p src/components
mkdir -p src/layouts
mkdir -p src/lib
3. Utwórz plik index.astro:
astro


---
// src/pages/index.astro
---

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moja Aplikacja Astro</title>
</head>
<body>
    <h1>Witaj w Astro + Cloudflare!</h1>
    <p>API jest dostępne na: /api/hello</p>
</body>
</html>
4. Utwórz test API:
typescript


// src/pages/api/test.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'API Routes działają! ✅'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
5. Zaaktualizuj astro.config.mjs:
javascript


// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
6. Testuj lokalnie:
bash


npm run dev
# Otwórz: http://localhost:3000/api/test
7. Build i deploy:
bash


npm run build
npm run deploy
CHECKLIST - Co Sprawdzić ✓


Element	Status	Co zrobić
src/pages/ istnieje	✓	mkdir -p src/pages
astro.config.mjs ma output: 'server'	✓	Zmień na server
@astrojs/cloudflare zainstalowany	✓	npm run astro add cloudflare
API route ma prerender = false	✓	Dodaj export const prerender = false;
package.json ma @astrojs/cloudflare	✓	Sprawdź dependencies
wrangler.toml skonfigurowany	✓	Utwórz ze wzoru
Test API działa lokalnie	✓	npm run dev + /api/test