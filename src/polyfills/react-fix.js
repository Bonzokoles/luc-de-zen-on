// React polyfill for browser environment
if (typeof window !== 'undefined') {
    // Define module if it doesn't exist
    if (typeof module === 'undefined') {
        window.module = {};
    }

    // Define process.env if it doesn't exist
    if (typeof process === 'undefined') {
        window.process = { env: {} };
    }

    // Define global if it doesn't exist
    if (typeof global === 'undefined') {
        window.global = window;
    }

    // Define require if it doesn't exist (for compatibility)
    if (typeof require === 'undefined') {
        window.require = function (id) {
            if (id === 'react') return window.React;
            if (id === 'react-dom') return window.ReactDOM;
            throw new Error(`Module '${id}' not found`);
        };
    }
}