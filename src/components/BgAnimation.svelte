<script lang="ts">
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  let canvas: HTMLCanvasElement;
  let engine: any = null;

  onMount(async () => {
    try {
      // Dynamic import Babylon.js
      const BABYLON = await import('babylonjs');
      
      // Check if canvas is available
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      // Create engine and scene
      engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      });
      
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Transparent background

      // Create camera
      const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -10), scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);

      // Create lighting
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);
      light.intensity = 0.7;

      // Create torus mesh
      const torus = BABYLON.MeshBuilder.CreateTorus('torus', { 
        diameter: 8, 
        thickness: 0.5, 
        tessellation: 32 
      }, scene);
      
      // Create material with emissive color
      const material = new BABYLON.StandardMaterial("torusMaterial", scene);
      material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 1.0); // Blue glow
      material.alpha = 0.6;
      torus.material = material;

      // Animation loop
      scene.registerBeforeRender(() => {
        torus.rotation.x += 0.003;
        torus.rotation.y += 0.005;
      });

      // Render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        if (engine) {
          engine.resize();
        }
      });
      
      resizeObserver.observe(canvas);

      // Cleanup on destroy
      onDestroy(() => {
        if (engine) {
          engine.stopRenderLoop();
          engine.dispose();
        }
        resizeObserver.disconnect();
      });

    } catch (error) {
      console.error('Babylon.js initialization error:', error);
    }
  });
</script>

<canvas 
  bind:this={canvas} 
  style="position: fixed; z-index: -1; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;"
  aria-hidden="true"
></canvas>
