// Cloudflare Workers Entry Point for Astro
// Polyfills for Cloudflare Workers compatibility

// MessageChannel polyfill for React compatibility
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    port1: MessagePort;
    port2: MessagePort;
    
    constructor() {
      this.port1 = new (globalThis as any).MessagePort();
      this.port2 = new (globalThis as any).MessagePort();
      (this.port1 as any)._other = this.port2;
      (this.port2 as any)._other = this.port1;
    }
  };

  (globalThis as any).MessagePort = class MessagePortPolyfill extends EventTarget {
    _other: any = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onmessageerror: ((event: MessageEvent) => void) | null = null;

    postMessage(message: any) {
      if (this._other) {
        setTimeout(() => {
          const event = new MessageEvent('message', { data: message });
          if (this._other.onmessage) {
            this._other.onmessage(event);
          }
          this._other.dispatchEvent(event);
        }, 0);
      }
    }

    start() {}
    close() {}
  };
}

// Process polyfill for Node.js compatibility
if (typeof process === 'undefined') {
  globalThis.process = {
    env: {
      NODE_ENV: 'production'
    }
  } as any;
}

// Export handler (will be dynamically imported by Astro)