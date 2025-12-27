import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cpSync, existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    {
      name: 'copy-functions',
      hooks: {
        'astro:build:done': () => {
          const functionsSource = join(__dirname, 'functions');
          const functionsDest = join(__dirname, 'dist', 'functions');
          const routesSource = join(__dirname, 'public', '_routes.json');
          const routesDest = join(__dirname, 'dist', '_routes.json');

          if (existsSync(functionsSource)) {
            if (!existsSync(join(__dirname, 'dist'))) {
              mkdirSync(join(__dirname, 'dist'), { recursive: true });
            }
            cpSync(functionsSource, functionsDest, { recursive: true });
            console.log('✅ Functions copied to dist/');
          } else {
            console.warn('⚠️ Functions directory not found');
          }

          if (existsSync(routesSource)) {
            cpSync(routesSource, routesDest);
            console.log('✅ _routes.json copied to dist/');
          } else {
            console.warn('⚠️ _routes.json not found');
          }
        }
      }
    }
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ai': ['openai', '@ai-sdk/openai', 'ai']
          }
        }
      }
    }
  }
});
