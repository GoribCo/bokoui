// Measures the JavaScript each route loads on first visit (compressed bytes over the wire, as Chrome
// reports them) against a built clone of the app. Prints a table; `--json` prints JSON instead.
//
//   npm run measure:bundles
import puppeteer from "puppeteer-core";
import { APP_ROUTES, PUBLIC_ROUTES, WIDTHS, chromePath, signInCookies, startClone } from "../test/browser/lib.mjs";

const json = process.argv.includes("--json");
const desktop = WIDTHS.find((v) => v.width === 1280);
const routes = [
  ...PUBLIC_ROUTES.map((route) => ({ route, signedIn: false })),
  ...APP_ROUTES.map((route) => ({ route, signedIn: true })),
].filter(({ route }) => !/no-such-page|does-not-exist/.test(route));

const started = await startClone({ log: json ? () => {} : console.log });
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true });
const rows = [];
try {
  for (const { route, signedIn } of routes) {
    // A fresh context per route, so nothing is cached from the previous page.
    const context = await browser.createBrowserContext();
    const instrumented = await context.newPage();
    const cdp = await instrumented.createCDPSession();
    await cdp.send("Network.enable");
    const bytes = new Map();
    const urls = new Map();
    cdp.on("Network.responseReceived", ({ requestId, type, response }) => {
      if (type === "Script") urls.set(requestId, response.url);
    });
    cdp.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
      if (urls.has(requestId)) bytes.set(urls.get(requestId), encodedDataLength);
    });
    await instrumented.setViewport({ width: desktop.width, height: desktop.height });
    if (signedIn) await instrumented.setCookie(...(await signInCookies(started.baseUrl)));
    await instrumented.goto(`${started.baseUrl}${route}`, { waitUntil: "networkidle0", timeout: 45_000 });
    const total = [...bytes.values()].reduce((sum, size) => sum + size, 0);
    rows.push({ route, files: bytes.size, kb: Math.round(total / 1024), top: [...bytes].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([url, size]) => `${Math.round(size / 1024)} KB ${new URL(url).pathname.split("/").pop()}`) });
    await instrumented.close();
    await context.close();
  }
} finally {
  await browser.close();
  await started.stop();
}

rows.sort((a, b) => b.kb - a.kb);
if (json) console.log(JSON.stringify(rows, null, 2));
else {
  console.log("\nRoute".padEnd(55), "JS files".padStart(9), "JS (KB, compressed)".padStart(21));
  for (const { route, files, kb } of rows) console.log(route.padEnd(54), String(files).padStart(9), String(kb).padStart(21));
  const dashboard = rows.find((row) => row.route === "/dashboard");
  if (dashboard) console.log(`\nLargest files on /dashboard:\n  ${dashboard.top.join("\n  ")}`);
}
