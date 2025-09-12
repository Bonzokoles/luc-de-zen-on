// Polyfills for Cloudflare Workers environment
// These polyfills ensure compatibility with browser APIs in the Worker context

// Global polyfills
if (typeof global === 'undefined') {
  globalThis.global = globalThis;
}

// Export for module compatibility
export {};
