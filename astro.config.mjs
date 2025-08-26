// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
<<<<<<< HEAD
import cloudflare from "@astrojs/cloudflare";
=======
>>>>>>> 2eebbf4225c94f91c5954ea9e6dd27355101c62f
import { siteUrl } from "./src/data/site.json";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), mdx(), sitemap()],
<<<<<<< HEAD
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
=======
>>>>>>> 2eebbf4225c94f91c5954ea9e6dd27355101c62f
  site: siteUrl,
  redirects: {
    "/posts": "/", // redirect from /posts because that page doesn't exist.
  },
});
