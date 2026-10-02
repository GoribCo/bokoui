// Site-level checks: every page has a title and description, and robots and sitemap respond.
import { APP_ROUTES, NOT_FOUND_ROUTES, PUBLIC_ROUTES, WIDTHS, openPage } from "./lib.mjs";

const desktop = WIDTHS.find((v) => v.width === 1280);

export async function site({ browser, baseUrl, log = console.log }) {
  const failures = [];

  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const response = await fetch(`${baseUrl}${path}`);
    const text = await response.text();
    if (response.status !== 200 || text.trim() === "") failures.push(`${path} answered ${response.status}${text.trim() === "" ? " with an empty body" : ""}`);
    else log(`  ${path} ok`);
  }

  const routes = [
    ...PUBLIC_ROUTES.map((route) => ({ route, signedIn: false })),
    ...APP_ROUTES.map((route) => ({ route, signedIn: true })),
  ];
  for (const { route, signedIn } of routes) {
    const page = await openPage(browser, baseUrl, route, { viewport: desktop, signedIn });
    try {
      const meta = await page.evaluate(() => ({
        title: document.title.trim(),
        description: document.querySelector('meta[name="description"]')?.content?.trim() ?? "",
        lang: document.documentElement.lang,
        h1: document.querySelectorAll("h1").length,
      }));
      if (!meta.title || /^create next app$/i.test(meta.title)) failures.push(`${route}: missing or default <title> ("${meta.title}")`);
      if (!meta.description) failures.push(`${route}: no meta description`);
      if (!meta.lang) failures.push(`${route}: <html> has no lang`);
      if (meta.h1 !== 1 && !NOT_FOUND_ROUTES.includes(route)) failures.push(`${route}: ${meta.h1} h1 elements, expected 1`);
    } finally {
      await page.closeAll();
    }
  }
  log(`  metadata checked on ${routes.length} routes`);
  return failures;
}
