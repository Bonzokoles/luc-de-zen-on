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