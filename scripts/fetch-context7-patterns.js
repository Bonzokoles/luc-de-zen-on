#!/usr/bin/env node
/**
 * Context7 Patterns Fetcher
 * --------------------------------------------------
 * Lightweight script to fetch and persist up-to-date documentation
 * snippets ("patterns") for core libraries using the Context7 MCP
 * tooling available in the editor environment. This runs locally and
 * writes snapshot JSON + markdown for quick developer reference.
 *
 * NOTE: This script purposefully avoids extra runtime deps; it uses
 * only Node 18+ built-ins. Extend the LIBRARIES map to add more.
 */

// Configuration base: default libraries (can be overridden by env var CONTEXT7_LIBS as JSON)
let LIBRARIES = [
    { id: 'astro', topics: ['routing', 'api endpoints', 'components'] },
    { id: 'cloudflare-workers', topics: ['kv', 'ai', 'durable objects'] },
    { id: 'tailwindcss', topics: ['utilities', 'configuration'] }
];

try {
    if (process.env.CONTEXT7_LIBS) {
        const parsed = JSON.parse(process.env.CONTEXT7_LIBS);
        if (Array.isArray(parsed)) {
            LIBRARIES = parsed.filter(x => x && typeof x.id === 'string' && Array.isArray(x.topics));
            console.log('[Context7] Using libraries from CONTEXT7_LIBS override');
        } else {
            console.warn('[Context7] CONTEXT7_LIBS not an array – ignoring');
        }
    }
} catch (e) {
    console.warn('[Context7] Failed to parse CONTEXT7_LIBS override:', e.message);
}

// Output directory
const OUT_DIR = 'docs/context7';

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function ensureDir(p) {
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function main() {
    ensureDir(OUT_DIR);

    const summaryIndex = [];

    for (const lib of LIBRARIES) {
        const libDir = join(OUT_DIR, lib.id.replace(/[^a-z0-9_-]/gi, '_'));
        ensureDir(libDir);

        const collected = [];

        // Try per-topic retrieval via Context7 MCP functions if exposed to the runtime.
        for (const topic of lib.topics) {
            try {
                if (!globalThis.__CONTEXT7_FETCH__) {
                    collected.push({ topic, error: 'Context7 MCP bridge not available (no __CONTEXT7_FETCH__)' });
                } else {
                    const doc = await globalThis.__CONTEXT7_FETCH__(lib.id, topic);
                    collected.push({ topic, doc });
                }
            } catch (e) {
                collected.push({ topic, error: String(e && e.message || e) });
            }
        }

        const ts = new Date().toISOString();
        const snapshot = { library: lib.id, fetchedAt: ts, entries: collected };
        const jsonPath = join(libDir, 'snapshot.json');
        writeFileSync(jsonPath, JSON.stringify(snapshot, null, 2), 'utf8');

        // Basic markdown synthesis
        const mdLines = [
            `# Context7 Patterns: ${lib.id}`, '', `Fetched: ${ts}`, '', '---', ''
        ];
        for (const entry of collected) {
            mdLines.push(`## Topic: ${entry.topic}`);
            if (entry.doc) {
                const trimmed = entry.doc.trim();
                mdLines.push('\n```text');
                mdLines.push(trimmed.length > 5000 ? trimmed.slice(0, 5000) + '\n...[truncated]' : trimmed);
                mdLines.push('```', '');
            } else if (entry.error) {
                mdLines.push(`> Error: ${entry.error}`, '');
            } else {
                mdLines.push('> No data returned', '');
            }
        }
        writeFileSync(join(libDir, 'README.md'), mdLines.join('\n'), 'utf8');

        summaryIndex.push({ library: lib.id, dir: libDir, topics: lib.topics });
    }

    writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify(summaryIndex, null, 2), 'utf8');
    console.log('Context7 pattern snapshots written to', OUT_DIR);
    console.log('If MCP bridge is unavailable, placeholders were generated.');
}

main().catch(err => { console.error(err); process.exit(1); });
