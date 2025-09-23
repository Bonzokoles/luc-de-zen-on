<<<<<<< HEAD
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';
import { reactWorkerPolyfillsPlugin } from './src/plugins/react-worker-polyfills.js';

// 🚀 MyBonzo Ultimate AI Platform Configuration
// Integruje wszystkie funkcje: AI Chat, Image Gen, BigQuery, Voice AI, Agents
export default defineConfig({
  site: 'https://mybonzo.com',
  output: 'server',
  
  // Cloudflare Pages z pełnym wsparciem Workers AI
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    runtime: {
      mode: 'local',  
      type: 'pages'
    }
  }),
  
  // React + Svelte integracje dla wszystkich komponentów
  integrations: [
    react({
      experimentalReactChildren: true,
      include: ['**/src/components/**/*.tsx', '**/src/components/**/*.jsx']
    }),
    svelte({
      include: ['**/src/components/**/*.svelte']
    })
  ],
  
  // Optymalizacja bundlingu dla wszystkich API endpoints i komponentów
  build: {
    inlineStylesheets: 'auto',
    split: true,
    assets: '_astro'
  },
  
  // Vite configuration dla MyBonzo AI ecosystem
  vite: {
    plugins: [reactWorkerPolyfillsPlugin()],
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'svelte']
    },
    server: {
      fs: {
        allow: ['.']
      }
    }
  }
});
=======

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.mybonzo.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    tailwind(),
    react(),
    svelte()
  ],
  
  // Optymalizacja bundlingu
  build: {
    inlineStylesheets: 'auto',
    split: true
  },
  
  // Optymalizacja Vite
  vite: {
    build: {
      rollupOptions: {
        external: [
          'virtual:astro-icon' // Dodaj to żeby naprawić błąd astro-icon
        ],
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-astro': ['astro'],
            'vendor-icons': ['@heroicons/react', '@tabler/icons-react', 'lucide-react'],
            'vendor-ui': ['@chatscope/chat-ui-kit-react']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    ssr: {
      external: ['fs/promises', 'path'], // Dodaj node modules do external
      noExternal: ['@astrojs/react', '@astrojs/svelte']
    }
  }
});
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
