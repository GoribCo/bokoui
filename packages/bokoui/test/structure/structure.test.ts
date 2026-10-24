import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { themes } from "@/core/themes";

const root = join(import.meta.dirname, "../..");
const src = join(root, "src");

function* files(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* files(full);
    else if (/\.(ts|tsx)$/.test(entry)) yield full;
  }
}
const read = (file: string) => readFileSync(file, "utf8");

/** Ids of the styles defined in code for Expo, read from the source (importing it would load react-native). */
const nativeStyleIds = (() => {
  const body = read(join(src, "expo/styles/index.ts")).split("nativeStyles: NativeCustomThemes = {")[1].split("};")[0];
  return [...body.matchAll(/^\s*"?([\w-]+)"?\s*[:,]/gm)].map((m) => m[1]);
})();

describe("source layout", () => {
  it("never imports a package barrel from inside the package (an import cycle waiting to happen)", () => {
    const barrels = /from "@\/(expo|expo\/ui|expo\/blocks|react|react\/ui|react\/blocks)"/;
    const offenders = [...files(src)].filter((file) => barrels.test(read(file))).map((file) => file.replace(src, "src"));
    expect(offenders).toEqual([]);
  });

  for (const group of ["ui", "blocks"] as const) {
    it(`react/${group}: every component file is exported by its barrel`, () => {
      const dir = join(src, "react", group);
      const components = readdirSync(dir).filter((f) => f.endsWith(".tsx")).map((f) => f.slice(0, -4));
      const barrel = read(join(dir, "index.ts"));
      expect(components.filter((name) => !barrel.includes(`"./${name}"`))).toEqual([]);
    });
  }

  it("react: a file is either a client module or imports none of the client-only hooks", () => {
    const hooks = /\b(useState|useEffect|useLayoutEffect|useRef|useCallback|useMemo|useReducer|useContext|createContext)\b/;
    const offenders: string[] = [];
    for (const group of ["ui", "blocks"]) {
      for (const file of readdirSync(join(src, "react", group)).filter((f) => f.endsWith(".tsx"))) {
        const code = read(join(src, "react", group, file));
        const client = code.trimStart().startsWith('"use client"');
        const importsReact = [...code.matchAll(/import\s*\{([^}]*)\}\s*from\s*"react"/g)].some((m) => hooks.test(m[1]));
        if (importsReact && !client) offenders.push(`${group}/${file}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("style registry", () => {
  const cssIds = readdirSync(join(src, "styles/themes")).filter((f) => f.endsWith(".css") && !["index.css", "classic.css", "materials.css", "expressive.css"].includes(f)).map((f) => f.slice(0, -4)).sort();
  const registered: string[] = themes.map((t) => t.id).sort();

  it("every registered style has a CSS file and the other way round", () => {
    expect(registered).toEqual(cssIds);
  });

  it("every style is imported by classic.css, materials.css or expressive.css", () => {
    const imported = read(join(src, "styles/themes/classic.css")) + read(join(src, "styles/themes/materials.css")) + read(join(src, "styles/themes/expressive.css"));
    expect(registered.filter((id) => !imported.includes(`"./${id}.css"`))).toEqual([]);
  });

  it("every style defined in code for Expo is registered", () => {
    expect(nativeStyleIds.filter((id) => !registered.includes(id))).toEqual([]);
  });

  it("generated CSS of the code-defined styles is up to date", async () => {
    // scripts/sync-expo-styles.mjs writes these files; running it must not change them.
    const before = Object.fromEntries(nativeStyleIds.map((id) => [id, read(join(src, `styles/themes/${id}.css`))]));
    const { execFileSync } = await import("node:child_process");
    execFileSync(process.execPath, [join(root, "scripts/sync-expo-styles.mjs")], { cwd: root });
    const after = Object.fromEntries(nativeStyleIds.map((id) => [id, read(join(src, `styles/themes/${id}.css`))]));
    expect(after).toEqual(before);
  });
});
