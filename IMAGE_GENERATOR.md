## Unified Image Generator API

Single authoritative endpoint: `POST /api/generate-image`

### Response
Always returns raw `image/png` (binary). No Base64 JSON wrapper. Optional header:
`X-Prompt-Enhanced: 1` – present when prompt enhancement logic was applied.

### Request JSON Fields
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| prompt | string | yes | Core textual description |
| model | string | no | One of allowed models (see below) |
| width | number | no | Pixel width (e.g. 512, 768, 1024) |
| height | number | no | Pixel height |
| steps | number | no | Inference steps (mapped to `num_steps`) |
| style | string | no | Style hint used in enhancement |
| enhancePrompt | boolean | no | Enable enhancement pipeline |
| enhanceOptions | object | no | { colorPalette, artistStyle, mood, quality } |

### Allowed Models
Defined centrally in `src/utils/imageGeneration.ts` (`ALLOWED_IMAGE_MODELS`). Current list mirrors Cloudflare Workers AI image models plus variants (SDXL, Flux, Lightning, etc.).

### Prompt Enhancement
If `enhancePrompt: true` the system may append quality/style descriptors and palette cues. Enhancement is deterministic for given inputs (no random synonyms). On failure it gracefully falls back to a basic style append.

### Example cURL
```bash
curl -X POST http://localhost:4321/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Retro pixel art dragon","width":512,"height":512,"steps":4,"enhancePrompt":true}' \
  -o dragon.png
```

### Example Fetch (Browser)
```js
async function generate() {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'A crystal forest at dusk', width: 512, height: 512, steps: 4, enhancePrompt: true })
  });
  if(!res.ok) throw new Error('Generation failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  document.getElementById('preview').src = url;
}
```

### Node Test Script
Use: `node src/test-image-generator.js "A cyberpunk alley with rain"`
Outputs PNG to `generated-test-images/`.

### Deprecations
`src/workers/generate-image.ts` now returns HTTP 410 and instructs clients to migrate. All logic lives in the Astro API route.

### Frontend Integration Notes
`image-generator.astro` now stores direct URLs:
* HuggingFace path: data URL (already base64) returned by its own endpoint.
* Cloudflare path: blob URL (no conversion to data URL; lower memory footprint).

History/storage still keeps `imageUrl` – consumer components remain compatible.

### Future Enhancements (Optional)
* Add caching / dedupe by (prompt, model, width, height, steps) hash.
* Provide `/api/generate-image/meta` to return enhancement breakdown for UI tooltips.
* Stream partial progress when Workers AI adds support.

---
Last updated: ${new Date().toISOString()}
