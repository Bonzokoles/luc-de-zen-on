// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import icon from 'astro-icon';

import { fileURLToPath } from 'node:url';
const cloudflareWorkersStub = fileURLToPath(new URL('./src/stubs/cloudflare-workers-stub.js', import.meta.url));

export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    define: { global: 'globalThis' },
    // Removing incorrect optimizeDeps include; forcing full optimization can stay if needed but not required now.
    optimizeDeps: { force: true },
    resolve: {
      alias: {
        'cloudflare:workers': cloudflareWorkersStub
      }
    },
    build: {
      // Raise the warning limit so large vendor bundles (e.g., BabylonJS) don't spam warnings
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // Manual chunk strategy to improve browser caching & initial load
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            // React core
            if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(id)) return 'react';
            // BabylonJS heavy 3D engine
            if (/[\\/]node_modules[\\/]babylonjs[\\/]/.test(id)) return 'babylon';
            // Chat UI kit (styles + components)
            if (/[\\/]node_modules[\\/]@chatscope[\\/]/.test(id)) return 'chat-ui';
            // Icon libraries & iconify JSON packs
            if (
              /[\\/]node_modules[\\/]@iconify-json[\\/]/.test(id) ||
              /[\\/]node_modules[\\/](lucide-react|@phosphor-icons|feather-icons|@heroicons|@tabler)[\\/]/.test(id)
            ) return 'icons';
            // NOTE: We intentionally do NOT force @astrojs/* into a dedicated chunk.
            // Splitting Astro core + integrations separately introduced a circular
            // import with another internal vendor chunk leading to a temporal
            // dead zone error: "Cannot access 'objectType' before initialization".
            // Allowing Rollup to group these organically avoids that cycle.
            // Fallback vendor chunk
            return 'vendor';
          }
        }
      }
    },
    // No banner injection; polyfill copies handled postbuild.
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
    svelte(),
    react({
      include: ['**/admin/*', '**/voice-ai/*', '**/agents/*', '**/react/*'],
      experimentalReactChildren: true
    }),
    mdx(),
    sitemap()
  ],
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'compile'
  }),
  devToolbar: { enabled: false },
  site: 'https://www.mybonzo.com',
  redirects: { '/posts': '/' }
});
