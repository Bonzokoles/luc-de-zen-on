import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import icon from 'astro-icon';

export default defineConfig({
    integrations: [
        react(),
        svelte(),
        tailwind({
            applyBaseStyles: false,
        }),
        icon()
    ],
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    server: {
        port: 4321,
        host: true
    },
    vite: {
        optimizeDeps: {
            exclude: ['@astrojs/react']
        },
        server: {
            fs: {
                allow: ['..']
            }
        }
    },
    // Exclude problematic directories from processing
    srcDir: './src',
    publicDir: './public'
});
