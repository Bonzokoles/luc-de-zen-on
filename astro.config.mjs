import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    resolve: {
      alias: {
        '@modules': path.resolve(__dirname, './src/modules')
      }
    },
    ssr: {
      external: ['events', 'timers', 'stream']
    },
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
