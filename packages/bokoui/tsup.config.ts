import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  dts: true,
  outDir: "dist",
  treeshake: true,
  clean: true,
  tsconfig: "tsconfig.json",
  // Framework runtimes are peers of the matching entry point, never bundled.
  external: ["react", "react-dom", "react/jsx-runtime", "vue", "react-native", "expo-blur"],
  entry: {
    core: "src/core/index.ts",
    "react/index": "src/react/index.ts",
    // Provider and switcher use hooks/state; scripts/postbuild.mjs adds "use client".
    "react/theme": "src/react/theme/index.ts",
    // Stateful components (Tabs, Modal, ...); scripts/postbuild.mjs adds "use client".
    "react/client": "src/react/client/index.ts",
    "react/theme-script": "src/react/theme/theme-script.tsx",
    "vue/index": "src/vue/index.ts",
    "expo/index": "src/expo/index.ts",
    // Basic elements and composed blocks of Expo, importable on their own.
    "expo/ui": "src/expo/ui/index.ts",
    "expo/blocks": "src/expo/blocks/index.ts",
  },
});
