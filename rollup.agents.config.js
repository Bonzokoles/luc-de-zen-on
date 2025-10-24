import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
// import typescript from "@rollup/plugin-typescript"; // Not needed for .js input
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
    // TypeScript plugin removed - not needed for .js input file
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};
