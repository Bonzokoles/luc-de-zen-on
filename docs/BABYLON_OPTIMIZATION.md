# BabylonJS Optimization Strategy

This document summarizes the steps taken to reduce bundle impact of BabylonJS in the project and provides guidance for future evolution.

## Goals
- Minimize initial JavaScript payload for faster Time-To-Interactive.
- Isolate heavy 3D engine code into a lazily loaded chunk.
- Remove unused monolithic dependencies.
- Provide a repeatable pattern for further selective imports.

## Completed Steps
1. **Refactor to Modular Package**: Migrated from dynamic `import('babylonjs')` (monolith) to `@babylonjs/core`.
2. **Shared Loader**: Introduced `src/utils/loadBabylonCore.ts` to centralize dynamic import & cache the promise.
3. **Manual Chunking**: Added explicit Rollup `manualChunks` rule to name `babylon-core` for caching and clear separation.
4. **Dependency Prune**: Removed `babylonjs` from `package.json` after confirming no active references.
5. **Selective Subpath Imports** (Latest): Replaced single `import('@babylonjs/core')` with targeted subpath imports for only the symbols required by `BgAnimation` (Engine, Scene, Camera, HemisphericLight, MeshBuilder, Materials, Color & Vector math).
6. **Runtime Polyfill**: Added a lightweight `MessageChannel` polyfill via Rollup `banner` to satisfy React 19 scheduler inside Cloudflare Workers runtime.

## Result Snapshot (Post-Optimization)
- `Header` bundle reduced from ~6.2 MB to ~79 KB (raw before gzip) after isolating Babylon.
- `babylon-core` chunk now loads on demand; further size improvements expected after fine-grained subpath imports (post-change measurement required).

## Current Loader Pattern
```ts
export async function loadBabylonCore() {
  if (!corePromise) {
    corePromise = (async () => {
      const [
        { Engine },
        { Scene },
        { Color3, Color4, Vector3 },
        { FreeCamera },
        { HemisphericLight },
        { MeshBuilder },
        { StandardMaterial }
      ] = await Promise.all([
        import('@babylonjs/core/Engines/engine.js'),
        import('@babylonjs/core/scene.js'),
        import('@babylonjs/core/Maths/math.color.js').catch(() => import('@babylonjs/core/Maths/math.js')),
        import('@babylonjs/core/Cameras/freeCamera.js'),
        import('@babylonjs/core/Lights/hemisphericLight.js'),
        import('@babylonjs/core/Meshes/meshBuilder.js'),
        import('@babylonjs/core/Materials/standardMaterial.js')
      ]);
      return { Engine, Scene, Color3, Color4, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial };
    })();
  }
  return corePromise;
}
```

## Measuring Impact
Run a build and inspect sizes:
```powershell
pnpm build
Get-ChildItem dist/_astro -File | Sort-Object Length -Descending | Select-Object -First 20 | Format-Table Name,Length
```
Focus on `babylon-core.*.js` size trend across changes.

## Extending Functionality
If you add features needing new Babylon modules (e.g., physics, post-processes, GUI), extend the `Promise.all` list with the smallest necessary subpaths. Favor specific module files to help Rollup tree-shake unused parts.

## Fallback Strategy
If a precise subpath fails (version shifts internal file paths):
- Temporarily revert that one line to `import('@babylonjs/core')` for validation.
- Look up the new subpath in Babylon release notes or source.

## Potential Future Improvements
- Introduce dynamic feature flags: only load MeshBuilder vs. more advanced geometry helpers when required.
- Add a thin wrapper that performs runtime capability detection (e.g., disable antialiasing on constrained devices) before creating `Engine`.
- Lazy-load scene content (textures/material variations) after first render using requestIdleCallback.
- Explore WebGL2 only build if Babylon supports conditional stripping to further reduce footprint.

## Caveats
- Cloudflare Workers runtime lacks some browser primitives (e.g., `MessageChannel`); keep polyfill minimal to avoid inflating all chunks.
- Always validate that Svelte/React hydration boundaries don’t collapse the dynamic import (currently stable with this loader approach).

## CI & Verification (Planned)
- Add GitHub Action to run `pnpm build` and produce a bundle size report diff.
- Run Codacy or alternative static analysis in a Linux container (needed due to Windows CLI limitation locally).

---
Maintainer Notes: Update this doc when adding new Babylon features or further reducing engine footprint.
