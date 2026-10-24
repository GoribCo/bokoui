// Fails the build when a server-safe React entry can reach code that needs the browser.
// A stateful component starts with "use client" in src; its dist file must start with it too, and no entry
// without it may import (directly or through a shared chunk) a React hook or `createContext`. A Server Component
// that imports such a file breaks at build time in Next.js, so this catches it here instead.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const src = path.join(root, "src/react");
const CLIENT_ONLY = /\b(useState|useEffect|useLayoutEffect|useRef|useCallback|useMemo|useReducer|useContext|useSyncExternalStore|useTransition|createContext)\b/;

const read = (file) => fs.readFileSync(file, "utf8");
const imports = (file) => [...read(file).matchAll(/(?:from|import)\s*['"](\.[^'"]+)['"]/g)].map((m) => path.resolve(path.dirname(file), m[1]));
const reactImports = (code) => [...code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]react['"]/g)].map((m) => m[1]).join(",");

const problems = [];
for (const group of ["ui", "blocks"]) {
  for (const file of fs.readdirSync(path.join(src, group)).filter((f) => f.endsWith(".tsx"))) {
    const name = file.slice(0, -4);
    const entry = path.join(dist, "react", group, `${name}.js`);
    const client = read(path.join(src, group, file)).trimStart().startsWith('"use client"');
    if (client) {
      if (!read(entry).startsWith('"use client"')) problems.push(`${group}/${name}: stateful but dist file has no "use client"`);
      continue;
    }
    const seen = new Set();
    const walk = (f) => {
      if (seen.has(f)) return;
      seen.add(f);
      const code = read(f);
      if (CLIENT_ONLY.test(reactImports(code))) problems.push(`${group}/${name}: server-safe entry reaches ${path.relative(dist, f)}, which imports a client-only React API`);
      if (code.startsWith('"use client"') && f !== entry) return; // a client boundary: what is behind it is fine
      imports(f).forEach(walk);
    };
    walk(entry);
  }
}
if (problems.length) {
  console.error(problems.map((p) => `- ${p}`).join("\n"));
  process.exit(1);
}
console.log("client boundaries ok");
