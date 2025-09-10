/**
 * Context7 MCP Bridge Bootstrap
 * Provides globalThis.__CONTEXT7_FETCH__ used by fetch-context7-patterns.js
 * Strategy:
 *  - If an MCP injection object globalThis.__MCP_CONTEXT7__ exists -> use it.
 *  - Else fallback to placeholder (still deterministic, but warns).
 * Extend __MCP_CONTEXT7__ externally to wire real calls.
 */

const CACHE = new Map();

async function doRealFetch(libraryId, topic) {
    if (!globalThis.__MCP_CONTEXT7__) {
        return `[[placeholder:${libraryId}:${topic}]] (no __MCP_CONTEXT7__ bridge)`;
    }
    // Expecting an API shape: getLibraryDocs(libraryId, { topic, tokens })
    try {
        const raw = await globalThis.__MCP_CONTEXT7__.getLibraryDocs(libraryId, { topic, tokens: 6000 });
        if (typeof raw === 'string') return raw;
        if (raw && typeof raw === 'object') {
            return raw.content || raw.text || JSON.stringify(raw, null, 2);
        }
        return String(raw ?? '');
    } catch (e) {
        return `[[error:${libraryId}:${topic}]] ${e && e.message || e}`;
    }
}

globalThis.__CONTEXT7_FETCH__ = async function (libraryId, topic) {
    const key = libraryId + '::' + topic;
    if (CACHE.has(key)) return CACHE.get(key);
    const val = await doRealFetch(libraryId, topic);
    CACHE.set(key, val);
    return val;
};

console.log('[Context7 Bridge] globalThis.__CONTEXT7_FETCH__ ready');
