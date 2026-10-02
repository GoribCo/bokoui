// Browser checks (HD-1.2 to HD-1.4). Builds a clone of the app, serves it, and drives Chrome.
//
//   npm run check:browser                         everything
//   npm run check:browser -- --only sweep         only the route sweep (or: --only interactions, controls, site)
//   npm run check:browser -- --widths 390,1280 --styles flat,oled --modes light --routes /dashboard
//   npm run check:browser -- --locale bn          sweep with the Bangla UI
//   npm run check:browser -- --url http://localhost:4000   use a server you started from a clone yourself
import puppeteer from "puppeteer-core";
import { chromePath, list, parseArgs, startClone } from "./lib.mjs";
import { controls } from "./controls.mjs";
import { interactions } from "./interactions.mjs";
import { site } from "./site.mjs";
import { sweep } from "./sweep.mjs";

const args = parseArgs(process.argv.slice(2));
const options = {
  routes: list(args.routes),
  widths: list(args.widths)?.map(Number),
  styles: list(args.styles),
  modes: list(args.modes),
  locale: args.locale,
};
const suites = { sweep, interactions, controls, site };
const selected = args.only ? list(args.only) : Object.keys(suites);

const started = args.url ? { baseUrl: args.url, stop: async () => {} } : await startClone();
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ["--no-sandbox"] });
const failures = [];
try {
  for (const name of selected) {
    console.log(`\n== ${name} ==`);
    failures.push(...(await suites[name]({ browser, baseUrl: started.baseUrl, options })).map((text) => `[${name}] ${text}`));
  }
} finally {
  await browser.close();
  await started.stop();
}

if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):\n${failures.map((text) => `- ${text}`).join("\n")}`);
  process.exit(1);
}
console.log("\nBrowser checks passed.");
