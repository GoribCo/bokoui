import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  dts: true,
  outDir: "dist",
  treeshake: true,
  clean: true,
  tsconfig: "tsconfig.json",
  // Framework runtimes are peers of the matching entry point, never bundled.
  external: ["react", "react-dom", "react/jsx-runtime", "vue", "react-native"],
  entry: {
    core: "src/core/index.ts",
    "react/index": "src/react/index.ts",
    // Provider and switcher use hooks/state; scripts/postbuild.mjs adds "use client".
    "react/theme": "src/react/theme/index.ts",
    "react/theme-script": "src/react/theme/theme-script.tsx",
    "vue/index": "src/vue/index.ts",
    "expo/index": "src/expo/index.ts",
  },
});
