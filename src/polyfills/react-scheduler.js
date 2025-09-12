// Critical polyfill that must be loaded before React
// MessageChannel polyfill for Cloudflare Workers React SSR compatibility

// Ensure this runs in global scope
(function () {
    'use strict';

    // Skip if already defined
    if (typeof globalThis.MessageChannel !== 'undefined') {
        return;
    }

    // MessageChannel polyfill specifically for React's scheduler
    globalThis.MessageChannel = class MessageChannel {
        constructor() {
            this.port1 = new MessagePort();
            this.port2 = new MessagePort();

            // Cross-reference the ports
            this.port1._linkedPort = this.port2;
            this.port2._linkedPort = this.port1;
        }
    };

    globalThis.MessagePort = class MessagePort {
        constructor() {
            this.onmessage = null;
            this._linkedPort = null;
            this._listeners = [];
        }

        postMessage(data) {
            if (this._linkedPort) {
                // Use queueMicrotask for better React compatibility
                if (typeof queueMicrotask !== 'undefined') {
                    queueMicrotask(() => {
                        this._deliverMessage(data);
                    });
                } else {
                    setTimeout(() => {
                        this._deliverMessage(data);
                    }, 0);
                }
            }
        }

        _deliverMessage(data) {
            if (!this._linkedPort) return;

            const event = {
                data,
                type: 'message',
                target: this._linkedPort,
                currentTarget: this._linkedPort,
                isTrusted: true,
                origin: '',
                lastEventId: '',
                source: this,
                ports: []
            };

            // Call onmessage if set
            if (this._linkedPort.onmessage && typeof this._linkedPort.onmessage === 'function') {
                try {
                    this._linkedPort.onmessage.call(this._linkedPort, event);
                } catch (error) {
                    console.error('MessagePort onmessage error:', error);
                }
            }

            // Call all event listeners
            this._linkedPort._listeners.forEach(listener => {
                try {
                    listener.call(this._linkedPort, event);
                } catch (error) {
                    console.error('MessagePort listener error:', error);
                }
            });
        }

        addEventListener(type, listener) {
            if (type === 'message' && typeof listener === 'function') {
                this._listeners.push(listener);
            }
        }

        removeEventListener(type, listener) {
            if (type === 'message') {
                const index = this._listeners.indexOf(listener);
                if (index > -1) {
                    this._listeners.splice(index, 1);
                }
            }
        }

        start() {
            // No-op in this polyfill
        }

        close() {
            this.onmessage = null;
            this._listeners = [];
            this._linkedPort = null;
        }
    };

    // Additional scheduler-related polyfills
    if (typeof globalThis.requestIdleCallback === 'undefined') {
        globalThis.requestIdleCallback = function (callback, options = {}) {
            const timeout = options.timeout || 0;
            const start = Date.now();

            return setTimeout(() => {
                callback({
                    didTimeout: timeout > 0 && (Date.now() - start) >= timeout,
                    timeRemaining() {
                        return Math.max(0, 50 - (Date.now() - start));
                    }
                });
            }, 1);
        };
    }

    if (typeof globalThis.cancelIdleCallback === 'undefined') {
        globalThis.cancelIdleCallback = function (id) {
            clearTimeout(id);
        };
    }

    console.log('MessageChannel polyfill loaded for Cloudflare Workers');
})();