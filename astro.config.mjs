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