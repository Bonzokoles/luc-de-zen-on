<<<<<<< HEAD
/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    // tutaj możesz dodać własne lokalne typy
  }
}

interface Env {
  AI: AI;
  AGENTS?: KVNamespace;
  AI_AGENTS?: KVNamespace;
  SESSION?: KVNamespace;
  IMAGES?: KVNamespace;
}
=======
/// <reference path="../.astro/types.d.ts" />
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
