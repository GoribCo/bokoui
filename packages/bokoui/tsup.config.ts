import { defineConfig } from "tsup";

const shared = {
  format: ["esm" as const],
  dts: true,
  outDir: "dist",
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  tsconfig: "tsconfig.json",
};

export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts", "theme-script": "src/theme-script.ts" },
    clean: true,
  },
  {
    ...shared,
    // Provider and switcher use hooks/state; scripts/postbuild.mjs adds "use client".
    entry: { theme: "src/theme.ts" },
    clean: false,
  },
]);
