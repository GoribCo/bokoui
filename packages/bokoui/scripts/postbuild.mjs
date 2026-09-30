// 1. Inlines the relative @imports of src/styles/bokoui.css into dist/styles.css.
// 2. Marks dist/theme.js as a client module (bundlers strip the directive if set at build time).
import fs from "node:fs";
import path from "node:path";

const entry = path.resolve(import.meta.dirname, "../../../src/styles/bokoui.css");

function inline(file) {
  const dir = path.dirname(file);
  return fs
    .readFileSync(file, "utf8")
    .replace(/@import\s+"(\.[^"]+)";/g, (_, rel) => inline(path.resolve(dir, rel)));
}

const out = path.resolve(import.meta.dirname, "../dist/styles.css");
fs.mkdirSync(path.dirname(out), { recursive: true });
// Tailwind skips node_modules when auto-detecting classes; register the built JS explicitly
// so consumers need no manual @source line.
const css = inline(entry) + '\n/* Scan the components in this package for Tailwind classes. */\n@source "./";\n';
fs.writeFileSync(out, css);
console.log("wrote", path.relative(process.cwd(), out));

const themeJs = path.resolve(import.meta.dirname, "../dist/theme.js");
const code = fs.readFileSync(themeJs, "utf8");
if (!code.startsWith('"use client"')) fs.writeFileSync(themeJs, `"use client";\n${code}`);
console.log('marked dist/theme.js with "use client"');
