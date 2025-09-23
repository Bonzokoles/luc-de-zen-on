// Cloudflare Workers Polyfills
if (typeof globalThis === 'undefined') {
  var globalThis = global || window || self;
}

// MessageChannel polyfill for Cloudflare Workers
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new MessagePort();
      this.port2 = new MessagePort();
      this.port1._other = this.port2;
      this.port2._other = this.port1;
    }
  };

  globalThis.MessagePort = class MessagePort extends EventTarget {
    constructor() {
      super();
      this._other = null;
      this.onmessage = null;
    }

    postMessage(message) {
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

    start() {
      // No-op for compatibility
    }

    close() {
      // No-op for compatibility
    }
  };
}

// React DOM Server compatibility
if (typeof process === 'undefined') {
  globalThis.process = {
    env: {
      NODE_ENV: 'production'
    }
  };
}

// Buffer polyfill if needed
if (typeof Buffer === 'undefined') {
  globalThis.Buffer = {
    isBuffer: () => false,
    from: (str) => new Uint8Array(new TextEncoder().encode(str)),
    alloc: (size) => new Uint8Array(size)
  };
}