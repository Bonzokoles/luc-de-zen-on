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
    }
  };
}

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
