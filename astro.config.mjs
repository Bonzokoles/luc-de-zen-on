import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import icon from 'astro-icon';

export default defineConfig({
  output: 'server',
  vite: {
    define: { global: 'globalThis' },
    optimizeDeps: { force: true },
    resolve: {
      alias: {
        'cloudflare:workers': new URL('./src/stubs/cloudflare-workers-stub.js', import.meta.url).pathname
      }
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        external: ['node:os', 'node:path', 'node:fs', 'node:crypto', 'node:util'],
        output: {
          // Inject a lightweight MessageChannel polyfill for Cloudflare Workers (React 19 scheduler requirement)
          banner: `if (typeof MessageChannel === 'undefined') {\n  class __PolyfillPort {\n    constructor(){ this.onmessage = null; }\n    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }\n    start(){} close(){}\n  }\n  class MessageChannel {\n    constructor(){\n      this.port1 = new __PolyfillPort();\n      this.port2 = new __PolyfillPort();\n      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };\n      this.port1.postMessage = (d)=> dispatch(this.port2, d);\n      this.port2.postMessage = (d)=> dispatch(this.port1, d);\n    }\n  }\n  globalThis.MessageChannel = MessageChannel;\n}`,
          // Simplified chunk strategy to avoid circular dependencies
          manualChunks: {
            'react': ['react', 'react-dom'],
            'babylon-core': ['@babylonjs/core']
          }
        }
      }
    },
    server: {
      hmr: { clientPort: 3006 }
    }
  },
  server: {
    port: 3006,
    host: true
  },
  integrations: [
    icon({
      include: {
        streamline: ['*'],
        lucide: ['*'],
        tabler: ['*'],
        heroicons: ['*'],
        phosphor: ['*'],
        feather: ['*']
      }
    }),
    tailwind(),
    svelte(),
    react({
      include: ['**/admin/*', '**/voice-ai/*', '**/agents/*', '**/react/*'],
      experimentalReactChildren: true
    }),
    mdx(),
    sitemap()
  ],
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  devToolbar: { enabled: false },
  site: 'https://www.mybonzo.com',
  redirects: { '/posts': '/' }
});
