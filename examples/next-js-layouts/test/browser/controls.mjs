// Controls (HD-5.3): a visible focus indicator on every Tab stop, and touch targets of at least 44 px
// on a phone. Axe does not check either of these fully.
import { WIDTHS, openPage, setTheme } from "./lib.mjs";

const phone = WIDTHS.find((v) => v.width === 390);
const desktop = WIDTHS.find((v) => v.width === 1280);

const FOCUS_ROUTES = [
  { route: "/", signedIn: false }, // demo
  { route: "/sign-in", signedIn: false },
  { route: "/dashboard", signedIn: true },
  { route: "/examples/form", signedIn: true }, // demo
  { route: "/examples/table", signedIn: true }, // demo
  { route: "/notifications", signedIn: true },
];
const TOUCH_ROUTES = [
  { route: "/", signedIn: false }, // demo
  { route: "/sign-in", signedIn: false },
  { route: "/dashboard", signedIn: true },
  { route: "/examples/form", signedIn: true }, // demo
  { route: "/examples/filters", signedIn: true }, // demo
  { route: "/notifications", signedIn: true },
  { route: "/organizations", signedIn: true },
];

const describe = (el) => `${el.tag}${el.label ? ` "${el.label}"` : ""}`;

/** Tabs through the page and reports stops whose focus gives no visible change. */
async function focusVisibility(page, stops) {
  const bad = new Map();
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  for (let index = 0; index < stops; index += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const outline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
      const shadow = style.boxShadow !== "none";
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30),
        visible: rect.width > 0 && rect.height > 0,
        indicator: outline || shadow,
        key: `${el.tagName}|${el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 30) ?? ""}|${el.getAttribute("href") ?? ""}`,
      };
    });
    if (info?.visible && !info.indicator) bad.set(info.key, info);
  }
  return [...bad.values()];
}

/** Interactive elements smaller than 44 px in either direction (inline links inside text are exempt). */
function smallTargets(page) {
  return page.evaluate(() => {
    const out = [];
    const selector = 'button, a[href], input:not([type=hidden]), select, textarea, [role=tab], [role=menuitem], [role=checkbox], [role=radio], [role=switch]';
    for (const el of document.querySelectorAll(selector)) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden") continue;
      if (el.closest("[hidden], [inert]")) continue;
      // Skip links that sit inside a sentence: WCAG exempts inline targets.
      if (el.tagName === "A" && style.display === "inline" && el.parentElement && /\S/.test(el.parentElement.childNodes.length > 1 ? el.parentElement.textContent.replace(el.textContent, "") : "")) continue;
      // In-page skip links are hidden until focused.
      if (el.matches('a[href^="#"]')) continue;
      // A checkbox or radio inside a label is operated through the label's larger box.
      const label = el.closest("label");
      if (label && (el.matches("input[type=checkbox], input[type=radio]") || el.getAttribute("role") === "switch")) {
        const box = label.getBoundingClientRect();
        if (box.height >= 43.5 && box.width >= 43.5) continue;
      }
      if (rect.height < 43.5 || rect.width < 43.5) {
        out.push({
          tag: el.tagName.toLowerCase(),
          label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30),
          size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        });
      }
    }
    return out;
  });
}

export async function controls({ browser, baseUrl, options = {}, log = console.log }) {
  const failures = [];
  const styles = options.styles ?? ["flat", "brutalism", "oled"];

  for (const { route, signedIn } of FOCUS_ROUTES) {
    const page = await openPage(browser, baseUrl, route, { viewport: desktop, signedIn, locale: options.locale });
    try {
      for (const style of styles) {
        await setTheme(page, style, "light");
        for (const el of await focusVisibility(page, 60)) failures.push(`${route}: no visible focus on ${describe(el)} (${style})`);
      }
    } finally {
      await page.closeAll();
    }
    log(`  focus ${route}`);
  }

  for (const { route, signedIn } of TOUCH_ROUTES) {
    const page = await openPage(browser, baseUrl, route, { viewport: phone, signedIn, locale: options.locale });
    try {
      for (const el of await smallTargets(page)) failures.push(`${route} @390px: touch target ${describe(el)} is ${el.size}, below 44x44`);
    } finally {
      await page.closeAll();
    }
    log(`  touch targets ${route}`);
  }
  return [...new Set(failures)];
}
