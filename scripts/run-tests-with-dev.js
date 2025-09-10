#!/usr/bin/env node
/**
 * Test Runner that launches a temporary Astro dev server (if needed), runs test suites, then shuts down.
 * ESM version (package.json has type=module).
 */

import { spawn } from 'node:child_process';
import http from 'node:http';

const EXPLICIT_BASE = process.env.BASE_URL;
const PORT = process.env.TEST_PORT ? parseInt(process.env.TEST_PORT, 10) : 4399;
let BASE_URL = EXPLICIT_BASE || `http://localhost:${PORT}`;
let SHOULD_START = !EXPLICIT_BASE; // will be recomputed after probing

let devProc = null;

function log(msg) { console.log(`[test-runner] ${msg}`); }

function waitForServer(url, timeoutMs = 20000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const attempt = () => {
            const req = http.get(url, res => {
                if (res.statusCode && res.statusCode < 500) {
                    res.resume();
                    return resolve();
                }
                retry();
            });
            req.on('error', retry);
            function retry() {
                if (Date.now() - start > timeoutMs) return reject(new Error('Server did not become ready in time'));
                setTimeout(attempt, 600);
            }
        };
        attempt();
    });
}

async function runCommand(nodeArgs) {
    return new Promise((resolve) => {
        const proc = spawn(process.execPath, nodeArgs, { stdio: 'inherit', env: process.env });
        proc.on('exit', code => resolve(code ?? 1));
    });
}

async function probe(url) {
    try {
        await waitForServer(url + '/');
        return true;
    } catch { return false; }
}

async function autoDetectExisting() {
    // If user set BASE_URL try it first
    if (EXPLICIT_BASE) {
        if (await probe(EXPLICIT_BASE)) {
            return EXPLICIT_BASE.replace(/\/$/, '');
        }
        log(`Provided BASE_URL ${EXPLICIT_BASE} not reachable, will start internal dev server.`);
        SHOULD_START = true;
        return `http://localhost:${PORT}`;
    }
    // Scan common dev ports (4321-4330) then fallback to designated PORT
    for (let p = 4321; p <= 4330; p++) {
        const candidate = `http://localhost:${p}`;
        if (await probe(candidate)) {
            log(`Detected running dev server at ${candidate}`);
            SHOULD_START = false;
            return candidate;
        }
    }
    SHOULD_START = true;
    return `http://localhost:${PORT}`;
}

async function main() {
    let exitCode = 0;
    BASE_URL = await autoDetectExisting();
    if (SHOULD_START) {
        log(`Starting Astro dev server on port ${PORT} ...`);
        devProc = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'dev', '--port', String(PORT)], {
            stdio: 'inherit',
            env: { ...process.env, NODE_ENV: 'development' }
        });
        devProc.on('exit', (code) => {
            if (code !== 0) log(`Dev server exited early with code ${code}`);
        });
        try {
            await waitForServer(`${BASE_URL}/`);
            log('Dev server ready');
        } catch (e) {
            log(`Failed to start dev server: ${e.message}`);
            if (devProc) devProc.kill();
            process.exit(1);
        }
    } else {
        log(`Using existing server at ${BASE_URL}`);
    }

    // Propagate BASE_URL to tests
    process.env.BASE_URL = BASE_URL;

    // Run image generator tests
    log('Running image generator tests...');
    const imgCode = await runCommand(['src/tests/image-generator.test.js']);
    if (imgCode !== 0) exitCode = imgCode;

    // Run homepage tests only if previous passed
    if (exitCode === 0) {
        log('Running homepage/audio tests...');
        const homeCode = await runCommand(['src/tests/homepage-audio.test.js']);
        if (homeCode !== 0) exitCode = homeCode;
    }

    if (devProc) {
        log('Shutting down dev server...');
        devProc.kill();
    }
    process.exit(exitCode);
}

main().catch(err => {
    log(`Unexpected error: ${err.stack || err.message}`);
    if (devProc) devProc.kill();
    process.exit(1);
});
