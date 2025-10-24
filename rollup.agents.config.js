import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
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
      inlineSources: false,
      noEmit: true,
      allowImportingTsExtensions: false,
      outDir: null,
      declarationMap: false,
      exclude: [
        "src/utils/documentationIndex.js",
        "src/utils/loadEnv.js",
        "src/utils/polaczekKnowledge.js",
        "src/utils/voiceAiAPI.js",
        "src/utils/ADKAdapter.ts", // Problematyczny adapter
        "src/utils/GoogleAgentManager.ts", // Google Manager
        "src/utils/GoogleAgentFactory.ts", // Google Factory
        "src/lib/**/*.ts", // Wyklucz biblioteki TypeScript
        "src/pages/**/*.ts", // Wyklucz strony TypeScript
        "src/workers/**/*", // Wyklucz workers z błędami TS
        "src/components/**/*.tsx", // Wyklucz komponenty TSX
        // Pozwól na agents, ale wykluczaj problematyczne
        "src/agents/agent.ts", // Generic agent
        "src/agents/multi-ai-agent.ts", // Multi agent
      ],
    }),
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};
