1. Komponent animowanego tła Babylon.js — src/components/BgAnimation.svelte
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
2. Komponent animacji przejścia stron — src/components/PageTransition.svelte
text
<script>
  import { fade } from 'svelte/transition';
  export let key;
</script>

<div {key} transition:fade={{ duration: 300 }}>
  <slot />
</div>
3. Przykład animowanego montowania komponentu — src/components/AnimatedComponent.svelte
text
<script>
  import { fly, fade } from 'svelte/transition';
</script>

<div in:fly={{ y: 20, duration: 300 }} in:fade={{ duration: 300 }}>
  <slot />
</div>
4. Modyfikacja layoutu Astro — src/layouts/BaseLayout.astro
text
---
import BgAnimation from '../components/BgAnimation.svelte';
import PageTransition from '../components/PageTransition.svelte';
import { Astro } from 'astro'; // lub inny import dynamiczny do uzyskania URL / key
const pageKey = Astro.request.url; // prosty przykład klucza strony
---

<html>
  <head>
    <title>Odzyskana strona z animacjami</title>
  </head>
  <body>
    <BgAnimation />
    <PageTransition key={pageKey}>
      <slot />
    </PageTransition>
  </body>
</html>
5. Użycie animowanego komponentu
Przykładowo, gdy używasz komponentów z animacją montowania:

text
---
import AnimatedComponent from '../components/AnimatedComponent.svelte';
---

<AnimatedComponent>
  <p>Tu jest zawartość z efektem animacji montowania</p>
</AnimatedComponent>
Podsumowanie
Komponent BgAnimation.svelte generuje animowane tło Babylon.js,

PageTransition.svelte tworzy efekt fade podczas przejść między stronami,

AnimatedComponent.svelte to wzorzec na animacje pojawiania się w DOM,

Layout Astro otacza stronę tymi komponentami, nadając im animacje bez modyfikowania odzyskanych plików,

Wszystkie pliki możesz w prosty sposób wkleić do folderu src/components i src/layouts.