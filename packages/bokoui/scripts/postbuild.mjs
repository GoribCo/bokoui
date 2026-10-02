// 1. Inlines the relative @imports of src/styles/bokoui.css into dist/styles.css.
// 2. Marks the stateful React entries (theme, client) as client modules (bundlers strip the directive if set at build time).
import fs from "node:fs";
import path from "node:path";

function inline(file) {
  const dir = path.dirname(file);
  return fs
    .readFileSync(file, "utf8")
    .replace(/@import\s+"(\.[^"]+)";/g, (_, rel) => inline(path.resolve(dir, rel)));
}

// Tailwind skips node_modules when auto-detecting classes; register the built JS explicitly
// so consumers need no manual @source line.
const SOURCE = '\n/* Scan the components in this package for Tailwind classes. */\n@source "./";\n';
for (const [from, to] of [["bokoui.css", "styles.css"], ["bokoui-lite.css", "styles-lite.css"]]) {
  const out = path.resolve(import.meta.dirname, "../dist", to);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, inline(path.resolve(import.meta.dirname, "../src/styles", from)) + SOURCE);
  console.log("wrote", path.relative(process.cwd(), out));
}

// 2. React entries: client markers, then the barrels apps import.
const dist = path.resolve(import.meta.dirname, "../dist/react");
const src = path.resolve(import.meta.dirname, "../src/react");
const names = (group) => fs.readdirSync(path.join(src, group)).filter((f) => f.endsWith(".tsx")).map((f) => f.slice(0, -4)).sort();
const isClient = (group, name) => fs.readFileSync(path.join(src, group, `${name}.tsx`), "utf8").trimStart().startsWith('"use client"');
const mark = (file) => {
  const code = fs.readFileSync(file, "utf8");
  if (!code.startsWith('"use client"')) fs.writeFileSync(file, `"use client";\n${code}`);
};

mark(path.join(dist, "theme.js"));
const groups = { ui: names("ui"), blocks: names("blocks") };
const clientEntries = [];
for (const [group, list] of Object.entries(groups)) {
  for (const name of list) {
    if (!isClient(group, name)) continue;
    mark(path.join(dist, group, `${name}.js`));
    clientEntries.push(`${group}/${name}`);
  }
}

const reexport = (entries) => entries.map((entry) => `export * from "./${entry}";\n`);
const barrel = (file, entries) => {
  fs.writeFileSync(path.join(dist, `${file}.js`), reexport(entries).map((l) => l.replace(/";/, '.js";')).join(""));
  fs.writeFileSync(path.join(dist, `${file}.d.ts`), reexport(entries).join(""));
};
const all = (group) => groups[group].map((name) => `${group}/${name}`);
barrel("ui", all("ui"));
barrel("blocks", all("blocks"));
barrel("index", ["ui", "blocks", "shared"]);
// Compatibility: the old entry that held only the stateful components.
barrel("client", clientEntries);
console.log(`wrote react barrels (${groups.ui.length} ui, ${groups.blocks.length} blocks, ${clientEntries.length} client)`);
