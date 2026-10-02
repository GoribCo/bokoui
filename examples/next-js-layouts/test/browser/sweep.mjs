// Visits every route at three widths in every style and mode; fails on axe violations, horizontal
// scroll and console errors.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { APP_ROUTES, MODES, NOT_FOUND_ROUTES, PUBLIC_ROUTES, STYLES, WIDTHS, openPage, setTheme } from "./lib.mjs";

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

/** Runs axe in the page and returns plain violation records. */
async function scan(page) {
  return page.evaluate(async () => {
    const results = await window.axe.run(document, { resultTypes: ["violations"] });
    return results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
    }));
  });
}

const overflows = (page) =>
  page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1 ? `${root.scrollWidth}px content in a ${root.clientWidth}px viewport` : null;
  });

/**
 * @param {{browser: import("puppeteer-core").Browser, baseUrl: string, options: Record<string, unknown>}} context
 * Options: routes, widths (numbers), styles, modes, locale. Returns a list of failure strings.
 */
export async function sweep({ browser, baseUrl, options = {}, log = console.log }) {
  const styles = options.styles ?? STYLES;
  const modes = options.modes ?? MODES;
  const viewports = options.widths ? WIDTHS.filter((v) => options.widths.includes(v.width)) : WIDTHS;
  const routes = [
    ...PUBLIC_ROUTES.map((route) => ({ route, signedIn: false })),
    ...APP_ROUTES.map((route) => ({ route, signedIn: true })),
  ].filter(({ route }) => !options.routes || options.routes.includes(route));

  const failures = new Map(); // key -> { text, where: Set }
  const record = (route, viewport, kind, text, where) => {
    const key = `${route}|${viewport.width}|${kind}|${text}`;
    if (!failures.has(key)) failures.set(key, { label: `${route} @${viewport.width}px: ${kind}: ${text}`, where: new Set() });
    failures.get(key).where.add(where);
  };

  let checks = 0;
  for (const viewport of viewports) {
    for (const { route, signedIn } of routes) {
      const page = await openPage(browser, baseUrl, route, { viewport, signedIn, locale: options.locale });
      try {
        if (NOT_FOUND_ROUTES.includes(route)) {
          // A streamed response cannot change status, so Next answers 200 with a noindex tag (a soft 404).
          const noindex = await page.evaluate(() => /noindex/.test(document.querySelector('meta[name="robots"]')?.content ?? ""));
          if (page.status !== 404 && !(page.status === 200 && noindex)) {
            record(route, viewport, "status", `answered ${page.status} without noindex; search engines would index the 404 page`, "page load");
          }
        } else if (page.status !== 200) {
          record(route, viewport, "status", `answered ${page.status}, expected 200`, "page load");
        }
        const landed = new URL(page.url()).pathname;
        if (landed !== route) record(route, viewport, "redirect", `ended at ${landed}`, "page load");
        await page.evaluate(axeSource);
        if (options.locale === "bn") {
          const font = await page.evaluate(async () => {
            await document.fonts.ready;
            return {
              lang: document.documentElement.lang,
              loaded: [...document.fonts].some((face) => /Noto Sans Bengali/.test(face.family) && face.status === "loaded"),
            };
          });
          if (font.lang !== "bn") record(route, viewport, "locale", `lang is "${font.lang}", expected bn`, "page load");
          if (!font.loaded) record(route, viewport, "font", "Noto Sans Bengali did not load", "page load");
        }
        for (const style of styles) {
          for (const mode of modes) {
            await setTheme(page, style, mode);
            const where = `${style}/${mode}`;
            for (const violation of await scan(page)) {
              record(route, viewport, "axe", `${violation.id} (${violation.impact}) ${violation.help} [${violation.targets.join(" | ")}]`, where);
            }
            const overflow = await overflows(page);
            if (overflow) record(route, viewport, "horizontal scroll", overflow, where);
            checks += 1;
          }
        }
        for (const problem of new Set(page.problems)) record(route, viewport, "console", problem, "page load");
      } finally {
        await page.closeAll();
      }
      log(`  ${route} @${viewport.width}px: ${styles.length * modes.length} style/mode combinations checked`);
    }
  }

  log(`Sweep: ${checks} checks, ${failures.size} distinct problems`);
  return [...failures.values()].map(({ label, where }) => {
    const all = [...where];
    return `${label} (${all.length > 4 ? `${all.length} combinations, e.g. ${all.slice(0, 3).join(", ")}` : all.join(", ")})`;
  });
}
