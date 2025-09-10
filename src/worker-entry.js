// Polyfill MessageChannel for Cloudflare Workers
import './polyfills/messageChannel.js';

// Re-export everything from main server
export * from '../dist/_worker.js';