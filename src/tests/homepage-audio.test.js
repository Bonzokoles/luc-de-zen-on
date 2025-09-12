/**
 * Homepage & Audio Smoke Test
 * Run: node src/tests/homepage-audio.test.js
 * Auto-detects dev server port (4321-4330) unless BASE_URL provided.
 */

let BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

async function portReachable(url, timeoutMs = 1500) {
    try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), timeoutMs);
        const res = await fetch(url, { signal: ctl.signal });
        clearTimeout(t);
        return res.ok;
    } catch (_) { return false; }
}

async function autoDetectBaseUrl() {
    if (process.env.BASE_URL) return;
    for (let p = 4321; p <= 4330; p++) {
        const url = `http://localhost:${p}/`;
        if (await portReachable(url)) { BASE_URL = url.replace(/\/$/, ''); console.log(`[detect] Using ${BASE_URL}`); return; }
    }
    console.warn('[detect] No dev server found 4321-4330. Tests will likely fail.');
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

async function fetchText(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    assert(res.ok, `Expected 200 for ${path}, got ${res.status}`);
    return res.text();
}

async function testHomepage() {
    const html = await fetchText('/');
    assert(/MUSIC/i.test(html) || /music-analyser-ready/.test(html), 'Homepage should reference music system');
    return { bytes: html.length };
}

async function testImageGeneratorPage() {
    const html = await fetchText('/image-generator');
    assert(/generate-image/i.test(html) || /prompt/i.test(html), 'Image generator page should contain form elements');
}

async function run() {
    await autoDetectBaseUrl();
    const tests = [['Homepage basic', testHomepage], ['Image generator page', testImageGeneratorPage]];
    let fails = 0;
    for (const [name, fn] of tests) {
        process.stdout.write(`→ ${name} ... `);
        try { await fn(); console.log('OK'); } catch (e) { console.log('FAIL'); console.error('   ', e.message); fails++; }
    }
    if (fails) { console.error(`❌ ${fails} test(s) failed.`); process.exit(1); }
    console.log('✅ Homepage/audio smoke tests passed');
}

run().catch(e => { console.error(e); process.exit(1); });
