// Turns a checkout into the static GitHub Pages demo (run before `next build` with NEXT_PUBLIC_DEMO=true).
// Removes what cannot exist without a server: the API route, the proxy, server actions, request-time
// metadata files. The sample backend itself stays and runs in the browser (see `lib/api/client.ts`).
import { copyFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of ["src/app/api", "src/proxy.ts", "src/instrumentation.ts", "src/app/sitemap.ts", "src/app/robots.ts", "src/app/opengraph-image.tsx"]) {
  rmSync(path.join(root, file), { recursive: true, force: true });
}
copyFileSync(path.join(root, "demo/i18n-actions.ts"), path.join(root, "src/lib/i18n/actions.ts"));
console.log("prepared for static export");
