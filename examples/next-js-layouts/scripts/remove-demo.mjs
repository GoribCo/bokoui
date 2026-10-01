// Removes the demo content so the app can start from the shell alone (README, "Start here").
//
//   node scripts/remove-demo.mjs            delete the demo and rewrite the pages that used it
//   node scripts/remove-demo.mjs --dry-run  only list what would change
//
// What goes: the /examples pages and their components, hooks, services, schemas, endpoints and sample
// data; the landing page (replaced by a redirect); the demo dashboard (replaced by an empty page). Lines
// marked `// demo` and blocks between `// demo:start` and `// demo:end` are stripped from the code that
// registers them. Search for "demo" to see every coupling point. What stays: the shell, the public
// organization profiles, legal pages, the notifications and organizations pages, and the sample backend in
// src/api (replace that with your API; see the README).
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Paths relative to the project root, deleted entirely. */
export const demoPaths = [
  "src/app/(dashboard)/examples",
  "src/components/examples",
  "src/hooks/use-records.ts",
  "src/hooks/use-create-staff.ts",
  "src/hooks/use-list-params.ts",
  "src/lib/query/search-params.ts",
  "src/lib/services/record.service.ts",
  "src/lib/services/staff.service.ts",
  "src/lib/schemas/record.ts",
  "src/lib/schemas/staff.ts",
  "src/lib/types/record.ts",
  "src/api/endpoints/records.ts",
  "src/api/endpoints/staff.ts",
  "src/api/data/records.ts",
  // Tests the manifest itself, so it goes too.
  "src/lib/config/demo-removal.test.ts",
];

/** Pages rewritten to a minimal version that does not use the demo. */
export const demoRewrites = {
  "src/app/(dashboard)/dashboard/page.tsx": `import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Dashboard", path: "/dashboard" });

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Replace this page with your own content." />
    </PageContainer>
  );
}
`,
  "src/app/(public)/page.tsx": `import { redirect } from "next/navigation";
import { DASHBOARD_PATH, SIGN_IN_PATH } from "@/lib/config/auth";
import { getSession } from "@/lib/session/session";

/** Replace with your landing page. Until then visitors go to sign-in and signed-in users to the dashboard. */
export default async function HomePage() {
  redirect((await getSession()) ? DASHBOARD_PATH : SIGN_IN_PATH);
}
`,
};

/** Sample menus and notifications link to demo pages; point them at the dashboard instead. */
export const demoLinkFiles = ["src/api/data/menus.ts", "src/api/data/notifications.ts"];
const demoLink = /"\/examples\/[a-z-]+"/g;

const codeFile = /\.(ts|tsx|mjs)$/;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (codeFile.test(entry)) yield full;
  }
}

/** Drops lines ending in `// demo` and everything from `// demo:start` to `// demo:end`. Returns null when unchanged. */
export function stripDemo(source) {
  const out = [];
  let inside = false;
  let changed = false;
  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "// demo:start" || trimmed === "// demo:end") {
      inside = trimmed === "// demo:start";
      changed = true;
    } else if (inside || /\s\/\/ demo$/.test(line)) {
      changed = true;
    } else {
      out.push(line);
    }
  }
  if (inside) throw new Error("`// demo:start` without `// demo:end`");
  return changed ? out.join("\n") : null;
}

export function removeDemo({ dryRun = false, log = console.log } = {}) {
  const act = (what, fn) => {
    log(`${dryRun ? "would " : ""}${what}`);
    if (!dryRun) fn();
  };

  for (const rel of demoPaths) {
    const full = path.join(root, rel);
    if (existsSync(full)) act(`delete ${rel}`, () => rmSync(full, { recursive: true }));
    else log(`skip ${rel} (already gone)`);
  }
  for (const [rel, content] of Object.entries(demoRewrites)) act(`rewrite ${rel}`, () => writeFileSync(path.join(root, rel), content));
  for (const rel of demoLinkFiles) {
    const full = path.join(root, rel);
    const text = readFileSync(full, "utf8");
    if (demoLink.test(text)) act(`point demo links in ${rel} at /dashboard`, () => writeFileSync(full, text.replace(demoLink, '"/dashboard"')));
    demoLink.lastIndex = 0;
  }
  for (const dir of ["src", "tests"]) {
    for (const file of walk(path.join(root, dir))) {
      const stripped = stripDemo(readFileSync(file, "utf8"));
      if (stripped !== null) act(`strip demo lines in ${path.relative(root, file)}`, () => writeFileSync(file, stripped));
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  removeDemo({ dryRun: process.argv.includes("--dry-run") });
  console.log("\nNext: run `npm run check`, then follow the README checklist (menus, auth, branding, legal text).");
}
