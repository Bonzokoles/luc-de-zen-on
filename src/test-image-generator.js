/**
 * Simple test script for unified image generator endpoint.
 * Usage (PowerShell):
 *   node src/test-image-generator.js "A futuristic neon city at night"
 */
import fs from 'fs';
import path from 'path';

const prompt = process.argv.slice(2).join(' ') || 'A serene mountain landscape at sunrise';
const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

async function main() {
    const res = await fetch(`${BASE_URL}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, width: 512, height: 512, steps: 4, enhancePrompt: true })
    });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const j = await res.json(); msg += ' ' + JSON.stringify(j); } catch { }
        throw new Error('Generation failed: ' + msg);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outDir = path.resolve(process.cwd(), 'generated-test-images');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `test-${Date.now()}.png`);
    fs.writeFileSync(file, buffer);
    console.log('Saved image:', file, 'bytes=', buffer.length);
    console.log('Prompt:', prompt);
    const enhanced = res.headers.get('X-Prompt-Enhanced');
    if (enhanced) console.log('Prompt was enhanced.');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
