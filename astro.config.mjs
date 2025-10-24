import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://luc-de-zen-on.pages.dev",
  output: "server",
  experimental: {
    preserveScriptOrder: true,
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    routes: {
      strategy: "exclude",
      exclude: [
        "/_astro/*",
        "/assets/*",
        "/favicon.*",
        "/*.png",
        "/*.jpg",
        "/*.jpeg",
        "/*.svg",
        "/*.ico",
      ],
    },
  }),

  // Cache control dla lepszego deploymentu
  server: {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
  integrations: [
    tailwind(),
    react(),
    svelte({
      compilerOptions: {
        experimental: {
          async: true,
        },
      },
    }),
  ],

  // Optymalizacja bundlingu
  build: {
    inlineStylesheets: "auto",
    split: true,
  },

  // Optymalizacja Vite
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
            "vendor-astro": ["astro"],
            "vendor-icons": [
              "@heroicons/react",
              "@tabler/icons-react",
              "lucide-react",
            ],
            "vendor-ui": ["@chatscope/chat-ui-kit-react"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    ssr: {
      external: [
        // Node.js built-ins
        "fs", "fs/promises", "path", "crypto", "stream", "events", "querystring", 
        "https", "http", "util", "os", "child_process", "net", "tls", "assert", 
        "url", "zlib", "buffer", "worker_threads", "process",
        "node:fs", "node:path", "node:crypto", "node:stream", "node:events", 
        "node:querystring", "node:https", "node:http", "node:util", "node:os", 
        "node:child_process", "node:net", "node:tls", "node:assert", "node:url", 
        "node:zlib", "node:buffer", "node:worker_threads", "node:process",
        "node:async_hooks", "node:stream/web",
        // Google Cloud libraries - often problematic on Workers
        "google-auth-library", "google-cloud", "@google-cloud/bigquery", 
        "@google-cloud/storage", "googleapis", "gaxios", "gtoken",
        "teeny-request", "gcp-metadata", "google-logging-utils",
        // Other problematic packages
        "node-fetch", "https-proxy-agent", "http-proxy-agent", "agent-base",
        "readable-stream", "retry-request", "jws", "jwa", "fetch-blob",
        "node-domexception",
      ],
      noExternal: ["@astrojs/react", "@astrojs/svelte"],
    },
  },
});
