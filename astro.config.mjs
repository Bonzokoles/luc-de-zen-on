import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    integrations: [react(), tailwind()],
    server: {
        port: 3006,
        host: true
    },
    output: 'static'
});
