// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { siteUrl } from "./src/data/site.json";

// https://astro.build/config
export default defineConfig({
  output: 'server', // Required for Cloudflare adapter with API routes
  experimental: {
    session: true  // Enable session support for Cloudflare adapter
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    // Remove session config to avoid experimental flag requirement
  }),
  site: siteUrl,
  redirects: {
    "/posts": "/", // redirect from /posts because that page doesn't exist.
  },
});
