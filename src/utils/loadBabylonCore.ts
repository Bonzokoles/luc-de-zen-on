// Shared dynamic Babylon loader (selective subpath imports for smaller bundle)
// Caches a promise so consumers get a single initialization.
let corePromise: Promise<any> | null = null;

export async function loadBabylonCore() {
    if (!corePromise) {
        corePromise = (async () => {
            // Import only the modules actually needed for the BgAnimation scene.
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
                import('@babylonjs/core/Maths/math.color.js').catch(() => import('@babylonjs/core/Maths/math.js')), // color utilities
                import('@babylonjs/core/Cameras/freeCamera.js'),
                import('@babylonjs/core/Lights/hemisphericLight.js'),
                import('@babylonjs/core/Meshes/meshBuilder.js'),
                import('@babylonjs/core/Materials/standardMaterial.js')
            ]);

            return {
                Engine,
                Scene,
                Color3,
                Color4,
                FreeCamera,
                Vector3,
                HemisphericLight,
                MeshBuilder,
                StandardMaterial
            };
        })();
    }
    return corePromise;
}

// Note: If future features need physics, particle systems, etc., extend the Promise.all list.
