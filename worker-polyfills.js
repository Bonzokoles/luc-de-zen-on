<<<<<<< HEAD
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
=======
// Critical polyfills that must load before any React components
// This file is imported at the worker entry point level

// MessageChannel polyfill - must be defined before React Server Components load
if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = {
        onmessage: null,
        postMessage: (data) => {
          setTimeout(() => {
            if (this.port2 && this.port2.onmessage) {
              this.port2.onmessage({ data });
            }
          }, 0);
        },
        close: () => {},
        start: () => {}
      };
      
      this.port2 = {
        onmessage: null,
        postMessage: (data) => {
          setTimeout(() => {
            if (this.port1 && this.port1.onmessage) {
              this.port1.onmessage({ data });
            }
          }, 0);
        },
        close: () => {},
        start: () => {}
      };
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    }
  };
}

<<<<<<< HEAD
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
=======
// Additional critical polyfills
if (typeof globalThis.performance === 'undefined') {
  globalThis.performance = {
    now: () => Date.now(),
    timeOrigin: Date.now()
  };
}

if (typeof globalThis.requestIdleCallback === 'undefined') {
  globalThis.requestIdleCallback = (callback) => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
  };
}

if (typeof globalThis.cancelIdleCallback === 'undefined') {
  globalThis.cancelIdleCallback = (id) => {
    clearTimeout(id);
  };
}
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
