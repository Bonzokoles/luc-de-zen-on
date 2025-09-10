// MessageChannel polyfill for Cloudflare Workers
if (typeof globalThis.MessageChannel === 'undefined') {
    globalThis.MessageChannel = class MessageChannel {
        constructor() {
            this.port1 = new MessagePort();
            this.port2 = new MessagePort();

            // Connect the ports
            this.port1._other = this.port2;
            this.port2._other = this.port1;
        }
    };

    globalThis.MessagePort = class MessagePort {
        constructor() {
            this._listeners = new Map();
            this._other = null;
        }

        postMessage(data) {
            if (this._other) {
                setTimeout(() => {
                    const event = {
                        data,
                        type: 'message',
                        target: this._other,
                        origin: '',
                        lastEventId: '',
                        source: this,
                        ports: []
                    };

                    const listeners = this._other._listeners.get('message');
                    if (listeners) {
                        listeners.forEach(listener => {
                            try {
                                listener(event);
                            } catch (e) {
                                console.error('MessagePort listener error:', e);
                            }
                        });
                    }

                    if (this._other.onmessage) {
                        try {
                            this._other.onmessage(event);
                        } catch (e) {
                            console.error('MessagePort onmessage error:', e);
                        }
                    }
                }, 0);
            }
        }

        addEventListener(type, listener) {
            if (!this._listeners.has(type)) {
                this._listeners.set(type, new Set());
            }
            this._listeners.get(type).add(listener);
        }

        removeEventListener(type, listener) {
            const listeners = this._listeners.get(type);
            if (listeners) {
                listeners.delete(listener);
            }
        }

        start() {
            // MessagePort.start() in browsers - no-op in our polyfill
        }

        close() {
            this._listeners.clear();
            this._other = null;
        }
    };
}