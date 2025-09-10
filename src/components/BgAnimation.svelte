<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  let canvas: HTMLCanvasElement;
  let engine: any = null;

  onMount(async () => {
    try {
      const { loadBabylonCore } = await import("../utils/loadBabylonCore");
      const {
        Engine,
        Scene,
        Color3,
        Color4,
        FreeCamera,
        Vector3,
        HemisphericLight,
        MeshBuilder,
        StandardMaterial,
      } = await loadBabylonCore();

      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      // Engine & scene
      engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
      });
      const scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0, 0); // Transparent background

      // Camera
      const camera = new FreeCamera("camera", new Vector3(0, 0, -10), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvas, false);

      // Light
      const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
      light.intensity = 0.7;

      // Mesh
      const torus = MeshBuilder.CreateTorus(
        "torus",
        {
          diameter: 8,
          thickness: 0.5,
          tessellation: 32,
        },
        scene,
      );

      // Material
      const material = new StandardMaterial("torusMaterial", scene);
      material.emissiveColor = new Color3(0.5, 0.5, 1.0);
      material.alpha = 0.6;
      torus.material = material;

      // Animation
      scene.registerBeforeRender(() => {
        torus.rotation.x += 0.003;
        torus.rotation.y += 0.005;
      });

      // Render loop
      engine.runRenderLoop(() => scene.render());

      // Resize handling
      const resizeObserver = new ResizeObserver(() => {
        engine?.resize();
      });
      resizeObserver.observe(canvas);

      // Cleanup
      onDestroy(() => {
        engine?.stopRenderLoop();
        engine?.dispose();
        resizeObserver.disconnect();
      });
    } catch (e) {
      console.error("Babylon.js initialization error:", e);
    }
  });
</script>

<canvas
  bind:this={canvas}
  style="position: fixed; z-index: -1; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;"
  aria-hidden="true"
></canvas>
