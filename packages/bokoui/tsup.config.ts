import { readdirSync } from "node:fs";
import { defineConfig } from "tsup";

/**
 * React components are built one entry per file (`dist/react/ui/<name>.js`, `dist/react/blocks/<name>.js`).
 * A stateful component starts with `"use client"`; scripts/postbuild.mjs puts that line on its output file
 * (the bundler drops it) and generates the public barrels (`react/ui`, `react/blocks`, `react`, `react/client`)
 * as plain re-exports. A barrel is not a build entry on purpose: if it were, esbuild would pull a component's code
 * out of the file that carries the directive and into a shared chunk.
 */
const components = Object.fromEntries(
  (["ui", "blocks"] as const).flatMap((group) =>
    readdirSync(`src/react/${group}`)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => [`react/${group}/${file.slice(0, -4)}`, `src/react/${group}/${file}`] as const),
  ),
);

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
    // Internal building block; apps use the re-exports of `bokoui/react`.
    core: "src/core/index.ts",
    ...components,
    // Types, style registry, `cn` and class recipes that `bokoui/react` re-exports.
    "react/shared": "src/core/public.ts",
    // Provider and switcher use hooks/state; scripts/postbuild.mjs adds "use client".
    "react/theme": "src/react/theme/index.ts",
    "react/theme-script": "src/react/theme/theme-script.tsx",
    "vue/index": "src/vue/index.ts",
    "expo/index": "src/expo/index.ts",
    // Basic elements and composed blocks of Expo, importable on their own.
    "expo/ui": "src/expo/ui/index.ts",
    "expo/blocks": "src/expo/blocks/index.ts",
  },
});
