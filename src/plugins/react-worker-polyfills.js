// Vite plugin do wstrzykiwania polyfills React dla Cloudflare Workers
export function reactWorkerPolyfillsPlugin() {
  return {
    name: 'react-worker-polyfills',
    generateBundle(options, bundle) {
      // Znajdź główne chunki React i wstrzyknij polyfills
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && fileName.includes('_@astro-renderers_')) {
          // Wstrzyknij polyfills na początku chunk-a
          const polyfillsCode = `
// MessageChannel polyfill dla Cloudflare Workers
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      const eventTarget1 = new EventTarget();
      const eventTarget2 = new EventTarget();
      
      this.port1 = {
        postMessage: (data) => {
          setTimeout(() => {
            eventTarget2.dispatchEvent(new MessageEvent('message', { data }));
          }, 0);
        },
        addEventListener: eventTarget1.addEventListener.bind(eventTarget1),
        removeEventListener: eventTarget1.removeEventListener.bind(eventTarget1),
        close: () => {}
      };
      
      this.port2 = {
        postMessage: (data) => {
          setTimeout(() => {
            eventTarget1.dispatchEvent(new MessageEvent('message', { data }));
          }, 0);
        },
        addEventListener: eventTarget2.addEventListener.bind(eventTarget2),
        removeEventListener: eventTarget2.removeEventListener.bind(eventTarget2),
        close: () => {}
      };
    }
  };
}

if (typeof MessagePort === 'undefined') {
  globalThis.MessagePort = class MessagePort extends EventTarget {
    postMessage(data) {
      setTimeout(() => {
        this.dispatchEvent(new MessageEvent('message', { data }));
      }, 0);
    }
    close() {}
  };
}
`;
          chunk.code = polyfillsCode + '\n' + chunk.code;
        }
      });
    }
  };
}