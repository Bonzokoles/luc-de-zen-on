// Polyfills for Cloudflare Workers environment
// Required for React compatibility

// MessageChannel polyfill for React Scheduler
if (typeof MessageChannel === 'undefined') {
    // Simple MessageChannel polyfill for Cloudflare Workers
    globalThis.MessageChannel = class MessageChannel {
        constructor() {
            const channel = {
                port1: null,
                port2: null
            };

            this.port1 = {
                onmessage: null,
                postMessage: (data) => {
                    if (channel.port2?.onmessage) {
                        setTimeout(() => channel.port2.onmessage({ data }), 0);
                    }
                },
                close: () => { },
                start: () => { }
            };

            this.port2 = {
                onmessage: null,
                postMessage: (data) => {
                    if (channel.port1?.onmessage) {
                        setTimeout(() => channel.port1.onmessage({ data }), 0);
                    }
                },
                close: () => { },
                start: () => { }
            };

            channel.port1 = this.port1;
            channel.port2 = this.port2;
        }
    };
}

// Additional polyfills for browser APIs that might be missing
if (typeof requestIdleCallback === 'undefined') {
    globalThis.requestIdleCallback = (callback) => {
        return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
    };
}

if (typeof cancelIdleCallback === 'undefined') {
    globalThis.cancelIdleCallback = (id) => {
        clearTimeout(id);
    };
}