// React polyfills dla Cloudflare Workers
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    port1: any;
    port2: any;
    
    constructor() {
      const eventTarget1 = new EventTarget();
      const eventTarget2 = new EventTarget();
      
      this.port1 = {
        postMessage: (data: any) => {
          setTimeout(() => {
            eventTarget2.dispatchEvent(new MessageEvent('message', { data }));
          }, 0);
        },
        addEventListener: eventTarget1.addEventListener.bind(eventTarget1),
        removeEventListener: eventTarget1.removeEventListener.bind(eventTarget1),
        close: () => {}
      };
      
      this.port2 = {
        postMessage: (data: any) => {
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
    postMessage(data: any) {
      setTimeout(() => {
        this.dispatchEvent(new MessageEvent('message', { data }));
      }, 0);
    }
    
    close() {}
  } as any;
}