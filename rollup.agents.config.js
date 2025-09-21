import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';

export default {
  input: 'src/agents-bundle/index.js',
  output: [
    {
      file: 'public/agents-bundle.js',
      format: 'iife',
      name: 'AgentsBundle',
      sourcemap: false,
      exports: 'default'
    },
    {
      file: 'public/agents-bundle.min.js', 
      format: 'iife',
      name: 'AgentsBundle',
      plugins: [terser()],
      sourcemap: false,
      exports: 'default'
    }
  ],
  plugins: [
    svelte({
      compilerOptions: {
        dev: false,
        generate: 'dom',
        hydratable: false
      }
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ['browser']
    }),
    commonjs(),
    typescript({
      declaration: false,
      sourceMap: false,
      inlineSources: false,
      noEmit: true,
      allowImportingTsExtensions: false,
      outDir: null,
      declarationMap: false,
      exclude: [
        'src/utils/documentationIndex.js',
        'src/utils/loadEnv.js', 
        'src/utils/polaczekKnowledge.js'
      ]
    })
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  }
};
