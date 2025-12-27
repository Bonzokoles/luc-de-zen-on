BŁĘDY - Czym się różnią 🐛
❌ Błąd 1: "Cannot find pages directory"


Przyczyna: Brak src/pages/
Rozwiązanie: mkdir -p src/pages && touch src/pages/index.astro
❌ Błąd 2: "API Routes not working"


Przyczyna: output: 'static' zamiast 'server'
Rozwiązanie: Zmień w astro.config.mjs na output: 'server'
❌ Błąd 3: "prerender is not compatible with dynamic routes"


Przyczyna: API route ma prerender = true
Rozwiązanie: Zmień na export const prerender = false;
❌ Błąd 4: "404 on /api/ routes"*


Przyczyna: Serwer nie widzi api/ folder w pages/
Rozwiązanie: 
1. mkdir -p src/pages/api
2. npm run build
3. npm run deploy
BEST PRACTICES 💡
1. Zawsze używaj prerender = false w API Routes:
typescript


export const prerender = false;
export const GET: APIRoute = async () => { /* ... */ };
2. Zawsze obsługuj błędy:
typescript


try {
  // Twój kod
} catch (error) {
  return new Response(JSON.stringify({ error: 'Server error' }), {
    status: 500
  });
}
3. Zawsze ustaw nagłówki Content-Type:
typescript


headers: { 'Content-Type': 'application/json' }
4. Użyj TypeScript dla type-safety:
typescript


// ✅ Dobry typ
import type { APIRoute } from 'astro';
export const GET: APIRoute = async ({ params, request }) => { /* ... */ };
5. Organizuj API routes w folderach:


src/pages/api/
├── users/
│   ├── [id].ts
│   └── index.ts
├── posts/
│   ├── [id].ts
│   └── index.ts
└── auth/
    ├── login.ts
    └── logout.ts
SZYBKI TEST - Czy działa? 🧪
Utwórz plik testowy:
bash


# src/pages/api/status.ts
cat > src/pages/api/status.ts << 'EOF'
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'working',
    timestamp: new Date().toISOString(),
    framework: 'Astro',
    deployment: 'Cloudflare Pages'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
EOF
Testuj:
bash


npm run dev
# Otwórz w przeglądarce: http://localhost:3000/api/status
Powinnaś zobaczyć:
json


{
  "status": "working",
  "timestamp": "2025-10-22T...",
  "framework": "Astro",
  "deployment": "Cloudflare Pages"
}
