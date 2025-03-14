// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { siteUrl } from "./src/data/site.json";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), mdx(), sitemap()],
  site: siteUrl,
  redirects: {
    "/posts": "/", // redirect from /posts because that page doesn't exist.
  },
});
