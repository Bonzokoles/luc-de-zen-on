// Postbuild polyfill consolidator
// Goals:
// 1. Ensure worker-polyfills.js exists in ALL locations chunks may resolve from:
//    - dist/worker-polyfills.js
//    - dist/_worker.js/worker-polyfills.js
//    - dist/_worker.js/chunks/worker-polyfills.js
//    - dist/_worker.js/chunks/astro/worker-polyfills.js
// 2. Rewrite first-line imports in astro chunk entry files (server_*, noop-middleware_*, astro-designed-error-pages_*)
//    from "import './worker-polyfills.js';" to a stable relative path to the worker root copy: "import '../../worker-polyfills.js';"
// This avoids runtime resolution failures during intermediate evaluation steps.

import { promises as fs } from 'fs';
import path from 'path';

async function run() {
    const distRoot = path.resolve('dist');
    const workerRoot = path.join(distRoot, '_worker.js');
    const chunksDir = path.join(workerRoot, 'chunks');
    const astroChunksDir = path.join(chunksDir, 'astro');
    const polyfillSourceFromSrc = path.resolve('src', 'worker-polyfills.js');
    let changedFiles = 0;
    let copiedFiles = 0;
    try {
        // Ensure destination directories exist
        for (const dir of [distRoot, workerRoot, chunksDir, astroChunksDir]) {
            try { await fs.mkdir(dir, { recursive: true }); } catch { }
        }

        // Resolve source polyfill: prefer src/worker-polyfills.js, else abort
        let sourceCode = null;
        try { sourceCode = await fs.readFile(polyfillSourceFromSrc, 'utf8'); } catch { }
        if (!sourceCode) {
            console.error('❌ Missing src/worker-polyfills.js – cannot deploy polyfills.');
        } else {
            const targets = [
                path.join(distRoot, 'worker-polyfills.js'),
                path.join(workerRoot, 'worker-polyfills.js'),
                path.join(chunksDir, 'worker-polyfills.js'),
                path.join(astroChunksDir, 'worker-polyfills.js')
            ];
            for (const target of targets) {
                try {
                    await fs.writeFile(target, sourceCode, 'utf8');
                    copiedFiles++;
                } catch (e) {
                    console.warn('⚠️ Write polyfill failed:', target, e.message);
                }
            }
        }

        // Rewrite imports in targeted astro chunk entry files.
        const rewritePatterns = [/^server_.*\.mjs$/, /^noop-middleware_.*\.mjs$/, /^astro-designed-error-pages_.*\.mjs$/];
        let astroEntries = [];
        try { astroEntries = await fs.readdir(astroChunksDir); } catch { }
        for (const file of astroEntries) {
            if (!rewritePatterns.some(r => r.test(file))) continue;
            const fullPath = path.join(astroChunksDir, file);
            let code;
            try { code = await fs.readFile(fullPath, 'utf8'); } catch { continue; }
            if (code.startsWith("import './worker-polyfills.js';")) {
                const updated = code.replace("import './worker-polyfills.js';", "import '../../worker-polyfills.js';");
                if (updated !== code) {
                    await fs.writeFile(fullPath, updated, 'utf8');
                    changedFiles++;
                    console.log(`✅ Rewritten polyfill import in: ${file}`);
                }
            }
        }

        console.log(`ℹ️ Polyfill summary: copies=${copiedFiles}, rewrites=${changedFiles}`);
    } catch (err) {
        console.error('❌ Postbuild polyfill fix failed:', err.message);
        process.exitCode = 1;
    }
}

run();
