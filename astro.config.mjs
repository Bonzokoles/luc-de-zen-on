// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: 'server', // Server for Workers deployment
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: [],
      noExternal: []
    },
    define: {
      // Ensure polyfills are available during build
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }
  },
  integrations: [svelte(), mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  site: "https://www.mybonzo.com",
  redirects: {
    "/posts": "/", // redirect from /posts because that page doesn't exist.
  },
});
