
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://mybonzo.com',
  output: 'server',
  experimental: {
    preserveScriptOrder: true
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  
  // Cache control dla lepszego deploymentu
  server: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
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
    resolve: {
      alias: {
        '@': '/src'
      }
    },
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
