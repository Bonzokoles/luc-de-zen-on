import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    imageService: 'passthrough'
  }),
  integrations: [react(), svelte(), tailwind()],
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    },
    ssr: {
      external: [
        '@google-cloud/bigquery',
        '@google-cloud/bigquery-analyticshub', 
        '@google-cloud/logging',
        '@google-cloud/storage',
        '@google-cloud/firestore',
        '@google-cloud/functions-framework',
        'googleapis',
        'babylonjs',
        '@babylonjs/core',
        '@babylonjs/materials',
        '@babylonjs/loaders',
        '@babylonjs/core/Engines/engine.js',
        '@babylonjs/core/scene.js',
        '@babylonjs/core/Maths/math.color.js',
        '@babylonjs/core/Maths/math.js',
        '@babylonjs/core/Cameras/freeCamera.js',
        '@babylonjs/core/Lights/hemisphericLight.js',
        '@babylonjs/core/Meshes/meshBuilder.js',
        '@babylonjs/core/Materials/standardMaterial.js'
      ]
    },
    build: {
      rollupOptions: {
        external: [
          '@google-cloud/bigquery',
          '@google-cloud/bigquery-analyticshub',
          '@google-cloud/logging', 
          '@google-cloud/storage',
          '@google-cloud/firestore',
          '@google-cloud/functions-framework',
          'googleapis',
          'babylonjs',
          '@babylonjs/core',
          '@babylonjs/materials',
          '@babylonjs/loaders',
          '@babylonjs/core/Engines/engine.js',
          '@babylonjs/core/scene.js',
          '@babylonjs/core/Maths/math.color.js',
          '@babylonjs/core/Maths/math.js',
          '@babylonjs/core/Cameras/freeCamera.js',
          '@babylonjs/core/Lights/hemisphericLight.js',
          '@babylonjs/core/Meshes/meshBuilder.js',
          '@babylonjs/core/Materials/standardMaterial.js'
        ]
      }
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  }
});