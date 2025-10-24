import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript"; // Needed for .ts imports
import svelte from "rollup-plugin-svelte";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/agents-bundle/index.js",
  output: [
    {
      file: "public/agents-bundle.js",
      format: "iife",
      name: "AgentsBundle",
      sourcemap: false,
      exports: "default",
    },
    {
      file: "public/agents-bundle.min.js",
      format: "iife",
      name: "AgentsBundle",
      plugins: [terser()],
      sourcemap: false,
      exports: "default",
    },
  ],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.browser": "true",
      "process.env": "{}",
      global: "globalThis",
      preventAssignment: true,
    }),
    svelte({
      compilerOptions: {
        dev: false,
        generate: "dom",
        hydratable: false,
      },
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ["browser"],
    }),
    commonjs(),
    typescript({
      declaration: false,
      sourceMap: false,
      noEmit: false,
    }),
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};
