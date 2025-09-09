// Polyfills for Cloudflare Workers environment
// Required for React compatibility

// MessageChannel polyfill for React Scheduler
if (typeof MessageChannel === 'undefined') {
    // Simple MessageChannel polyfill for Cloudflare Workers
    globalThis.MessageChannel = class MessageChannel {
        port1: MessagePort;
        port2: MessagePort;

        constructor() {
            const channel = {
                port1: null as any,
                port2: null as any
            };

            this.port1 = {
                onmessage: null,
                postMessage: (data: any) => {
                    if (channel.port2?.onmessage) {
                        setTimeout(() => channel.port2.onmessage({ data }), 0);
                    }
                },
                close: () => { },
                start: () => { }
            } as MessagePort;

            this.port2 = {
                onmessage: null,
                postMessage: (data: any) => {
                    if (channel.port1?.onmessage) {
                        setTimeout(() => channel.port1.onmessage({ data }), 0);
                    }
                },
                close: () => { },
                start: () => { }
            } as MessagePort;

            channel.port1 = this.port1;
            channel.port2 = this.port2;
        }
    };
}

// Additional polyfills for browser APIs that might be missing
if (typeof requestIdleCallback === 'undefined') {
    globalThis.requestIdleCallback = (callback: IdleRequestCallback) => {
        return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1) as any;
    };
}

if (typeof cancelIdleCallback === 'undefined') {
    globalThis.cancelIdleCallback = (id: number) => {
        clearTimeout(id as any);
    };
}