import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Server mode dla Cloudflare Pages Functions
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    tailwind()
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['framer-motion', 'lucide-react', '@monaco-editor/react'],
            'vendor-charts': ['recharts', 'd3', '@visx/visx'],
            'vendor-utils': ['date-fns', 'jspdf', 'xlsx']
          }
        }
      }
    }
  }
});
