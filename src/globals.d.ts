// Global type declarations for window object properties and Cloudflare Workers
declare global {
  // Cloudflare Workers types
  interface KVNamespace {
    get(key: string, options?: { type: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
    put(key: string, value: string): Promise<void>;
    list(): Promise<{ keys: { name: string }[] }>;
  }

  interface Window {
    apiTests: {
      testChatAPI?: () => Promise<{ success: boolean; message: string; data?: any }>;
      testImageGeneration?: () => Promise<{ success: boolean; message: string; data?: any }>;
      testAIBot?: (message?: string) => Promise<{ success: boolean; message: string; data?: any }>;
      testBigQuery?: () => Promise<{ success: boolean; message: string; data?: any }>;
      testKaggle?: (search?: string) => Promise<{ success: boolean; message: string; data?: any }>;
      testTavily?: (query?: string) => Promise<{ success: boolean; message: string; data?: any }>;
      testAllAPIs?: () => Promise<{ 
        chat: any; 
        aiBot: any; 
        imageGen: any; 
        kaggle: any; 
        tavily: any; 
        errors: string[] 
      }>;
      [key: string]: any;
    };
    openImageGenerator: () => void;
    openChatbot: () => void;
    openBigQuery: () => void;
    openKaggle: () => void;
    openTavily: () => void;
    testButtonFunction: (buttonType: string) => boolean;
  }
}

declare namespace App {
  interface Locals {
    runtime?: {
      env?: Record<string, any>;
      waitUntil?: (promise: Promise<any>) => void;
      passThroughOnException?: () => void;
    };
  }
}

// Astro ImportMeta extension
interface ImportMeta {
  readonly env: ImportMetaEnv & {
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
  };
}

export {};
