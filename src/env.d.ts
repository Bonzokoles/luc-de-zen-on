/// <reference path="../.astro/types.d.ts" />
/// <reference path="./globals.d.ts" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean; 
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals extends Astro.Locals {
    runtime: {
      env: {
        ADMIN_PASSWORD?: string;
        USER_PASSWORD?: string;
        [key: string]: string | undefined;
      };
    };
  }
}
