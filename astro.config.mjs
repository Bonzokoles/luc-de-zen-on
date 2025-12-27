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
          
          if (existsSync(functionsSource)) {
            if (!existsSync(join(__dirname, 'dist'))) {
              mkdirSync(join(__dirname, 'dist'), { recursive: true });
            }
            cpSync(functionsSource, functionsDest, { recursive: true });
            console.log('✅ Functions copied to dist/');
          } else {
            console.warn('⚠️ Functions directory not found');
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
