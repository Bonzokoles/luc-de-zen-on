/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

type CloudflareEnv = {
  OPENAI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  SESSION?: KVNamespace;
};

declare namespace App {
  interface Locals {
    runtime?: {
      env: CloudflareEnv;
      ctx: ExecutionContext;
      caches: CacheStorage & { default: Cache };
    };
  }
}
