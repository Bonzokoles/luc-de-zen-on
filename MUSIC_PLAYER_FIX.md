# Music Player Fix & Analyser Integration

## Summary
The background music visualizer stopped animating because the active component (`BackgroundMusicPlayerSimple.svelte`) reintroduced a simplified version without the Web Audio **AnalyserNode** logic. Visualization components (bars / waveform) were still expecting a global analyser reference (`window.MUSIC_ANALYSER` or `window.MUSIC.getAnalyser()`).

## Root Cause
1. Original implementation (in an earlier variant) created an `AudioContext`, `MediaElementSource`, and `AnalyserNode`.
2. Replacement / simplified component only handled basic play/pause.
3. Visualizer code silently failed (no analyser) – no runtime crash but zero-bar updates.

## Implemented Solution
- Reintroduced idempotent `setupAnalyser()` that:
  - Reuses a single shared `AudioContext` (resuming it on user gesture if suspended).
  - Wraps the component’s `<audio>` element in a `MediaElementSource` once.
  - Attaches a configured `AnalyserNode` (FFT size / smoothing) and stores it globally.
- Exposed accessor via `window.MUSIC = { getAnalyser(): AnalyserNode | null, ... }` so any visualizer can poll or subscribe.
- Fired a custom DOM event `music-analyser-ready` once analyzer is ready, enabling lazy listeners.
- Ensured no duplicate node graph creation on re-renders (guards by checking existing analyser & source).

## Global Contract
| Global | Type | Purpose |
|-------|------|---------|
| `window.MUSIC.getAnalyser()` | `() => AnalyserNode | null` | Obtain the active analyser safely. |
| `window.MUSIC_ANALYSER` (legacy) | `AnalyserNode | undefined` | Backward-compat pointer (still populated). |
| `music-analyser-ready` event | CustomEvent | Emitted once after first successful setup. |

## Testing / Verification Steps
1. Open site, play background track.
2. In DevTools console:
   ```js
   window.MUSIC && window.MUSIC.getAnalyser();
   ```
   Should return an `AnalyserNode`.
3. Execute a quick frequency sample:
   ```js
   const a = window.MUSIC.getAnalyser();
   const data = new Uint8Array(a.frequencyBinCount);
   a.getByteFrequencyData(data); console.log(data.slice(0,16));
   ```
   Values should be non-zero (after some audio plays).
4. Visual bars / waveform reflect music.

## Edge Cases Considered
- User pauses then resumes: analyser persists – no reallocation.
- Multiple rapid component mounts (HMR in dev): guard prevents duplicate `MediaElementSource` creation.
- Autoplay restrictions: context resume attempted only on explicit play gesture.

## Future Enhancements (Optional)
- Provide a tiny pub/sub utility for visualizers to register callbacks instead of polling.
- Add gain node for master volume smoothing & fade in/out.
- Add CPU adaptive FFT size (reduce when tab is hidden).

## Maintenance Notes
- Any refactor must keep the global accessor stable (`window.MUSIC.getAnalyser`).
- If migrating to a store-based Svelte pattern, keep a thin compatibility layer exposing the same global to avoid breaking existing visualizers.

---
Last updated: 2025-09-10
