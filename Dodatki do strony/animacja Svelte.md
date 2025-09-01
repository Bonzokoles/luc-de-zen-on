Integracja animacji dla Svelte w Astro
1. Animacja tła Babylon.js jako komponent Svelte
Utwórz plik src/components/BgAnimation.svelte:

text
<script lang="ts">
  import { onMount } from 'svelte';
  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const BABYLON = await import('babylonjs');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);

    const torus = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 8, thickness: 0.5 }, scene);

    scene.registerBeforeRender(() => {
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
    });

    engine.runRenderLoop(() => scene.render());

    window.addEventListener('resize', () => engine.resize());

    return () => {
      engine.dispose();
    };
  });
</script>

<canvas bind:this={canvas} style="position: fixed; z-index: -1; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;"></canvas>
2. Dodanie animacji przejść między stronami (Page Transitions) w Svelte
Użyj wbudowanych przejść Svelte, np. fade:

W src/components/PageTransition.svelte:

text
<script>
  import { fade } from 'svelte/transition';
  export let key;
</script>

<svelte:component this={$$slots.default ? $$slots.default[0].component : null} {key} 
  transition:fade={{ duration: 300 }} />
W layoucie Astro przy renderowaniu zawartości:

text
---
import PageTransition from '../components/PageTransition.svelte';
import { page } from '@astrojs/svelte';
---

<html>
  <body>
    <PageTransition key={page.url.pathname}>
      <slot />
    </PageTransition>
  </body>
</html>
(Uwaga: dostosuj do wersji Astro i Svelte integracji — page może wymagać alternatywnego podpięcia.)

3. Animacje montowania komponentów Svelte
W każdym komponencie (np. MyComponent.svelte) możesz używać wbudowanych płynnych przejść:

text
<script>
  import { fly, fade } from 'svelte/transition';
</script>

<div in:fly={{ y: 20, duration: 300 }} in:fade={{ duration: 300 }}>
  <!-- zawartość komponentu -->
</div>
4. Dodanie animowanego tła i animacji przejść do Twojego layoutu Astro
text
---
import BgAnimation from '../components/BgAnimation.svelte';
---

<html>
  <head>
    <title>Odzyskana strona z animacjami</title>
  </head>
  <body>
    <BgAnimation />
    <slot />
  </body>
</html>
Podsumowanie
BgAnimation.svelte – animowane tło Babylon.js na każdej stronie,

PageTransition.svelte – prosty fade przejścia między stronami,

Wbudowane przejścia Svelte fly i fade do animacji montowania komponentów,

Łatwa integracja w layoucie i w komponentach bez ingerencji w logikę backendu.