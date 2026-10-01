// Interactive parts of the shell (HD-1.3): sidebar collapse and persistence, mobile drawer focus trap,
// workspace switcher, account menu, display settings and the notification tabs.
import { WIDTHS, openPage } from "./lib.mjs";

const desktop = WIDTHS.find((v) => v.width === 1280);
const phone = WIDTHS.find((v) => v.width === 390);

function expect(condition, message) {
  if (!condition) throw new Error(message);
}


/** Waits until `fn` (run in the page) returns a truthy value. */
// A string is run as an expression by puppeteer, so wrap "() => ..." strings into a call.
const until = (page, fn, arg, timeout = 5000) =>
  page.waitForFunction(typeof fn === "string" ? `(${fn})()` : fn, { timeout, polling: 50 }, arg).catch(() => {
    throw new Error(`timed out waiting for: ${String(fn).replace(/\s+/g, " ").slice(0, 140)}`);
  });

/** Visible `:popover-open` panel, or null. */
const OPEN_PANEL = `(() => document.querySelector(":popover-open"))()`;

/** Clicks the first visible control inside `scope` whose text or label equals `text`. */
async function clickText(page, scope, text) {
  const clicked = await page.evaluate(
    (scopeSelector, wanted) => {
      const root = document.querySelector(scopeSelector);
      if (!root) return false;
      const candidates = [...root.querySelectorAll("button, [role=tab], [role=radio], [role=menuitem], label, a")];
      const match = candidates.find((el) => {
        const rect = el.getBoundingClientRect();
        const name = (el.getAttribute("aria-label") ?? el.textContent ?? "").trim();
        return rect.width > 0 && rect.height > 0 && (name === wanted || name.endsWith(wanted) || (name.startsWith(wanted) && /^\d+$/.test(name.slice(wanted.length))));
      });
      match?.click();
      return Boolean(match);
    },
    scope,
    text,
  );
  expect(clicked, `no control "${text}" in ${scope}`);
}

const attr = (page, selector, name) => page.$eval(selector, (el, n) => el.getAttribute(n), name);
const html = (page, name) => page.evaluate((n) => document.documentElement.getAttribute(n), name);
const cookie = async (page, name) => (await page.cookies()).find((c) => c.name === name)?.value;
/** Focus is inside `selector`, or on <body> (a modal dialog hands focus to the browser UI at the end of its Tab cycle). */
const focusInside = (page, selector) =>
  page.evaluate(
    (sel) => document.activeElement === document.body || Boolean(document.querySelector(sel)?.contains(document.activeElement)),
    selector,
  );

/** Runs scenarios one by one, so one failure does not hide the others. */
function makeRunner(failures, log) {
  return async (name, fn) => {
    try {
      await fn();
      log(`  ok   ${name}`);
    } catch (error) {
      log(`  FAIL ${name}: ${error.message}`);
      failures.push(`${name}: ${error.message}`);
    }
  };
}

const SIDEBAR = "#app-sidebar";
const TOGGLE = `button[aria-controls="app-sidebar"]`;

async function desktopScenarios({ browser, baseUrl, step, failures }) {
  const page = await openPage(browser, baseUrl, "/dashboard", { viewport: desktop, signedIn: true });
  try {
    await step("sidebar collapses, persists in a cookie, survives a reload without layout shift", async () => {
      const expandedWidth = await page.$eval(SIDEBAR, (el) => el.getBoundingClientRect().width);
      expect((await attr(page, TOGGLE, "aria-expanded")) === "true", "starts expanded");
      await page.click(TOGGLE);
      await until(page, (sel) => document.querySelector(sel)?.getBoundingClientRect().width < 120, SIDEBAR);
      expect((await attr(page, TOGGLE, "aria-label")) === "Expand sidebar", "toggle label does not change to Expand");
      expect((await cookie(page, "sidebar-collapsed")) === "true", "cookie sidebar-collapsed is not true");

      // Reload: read the state at DOMContentLoaded, before the client has hydrated.
      await page.reload({ waitUntil: "domcontentloaded" });
      const early = await page.evaluate(() => ({
        expanded: document.querySelector('button[aria-controls="app-sidebar"]')?.getAttribute("aria-expanded"),
        width: document.querySelector("#app-sidebar")?.getBoundingClientRect().width,
      }));
      expect(early.expanded === "false" && early.width < 120, `server render is not collapsed (${JSON.stringify(early)})`);
      await page.waitForNetworkIdle({ idleTime: 500 });
      expect((await attr(page, TOGGLE, "aria-expanded")) === "false", "collapsed state lost after hydration");

      await page.click(TOGGLE);
      await until(page, (sel, w) => document.querySelector(sel)?.getBoundingClientRect().width > w - 5, SIDEBAR, 5000).catch(() => {});
      await until(page, (sel) => document.querySelector(sel)?.getBoundingClientRect().width > 200, SIDEBAR);
      expect((await cookie(page, "sidebar-collapsed")) === "false", "cookie not reset on expand");
      expect(expandedWidth > 200, "expanded sidebar is unexpectedly narrow");
    });

    await step("workspace switcher lists organizations, switches the menu, closes on Escape", async () => {
      const trigger = `${SIDEBAR} button[aria-label="Switch organization"]`;
      const navBefore = await page.$eval(`${SIDEBAR} nav`, (el) => el.textContent);
      await page.click(trigger);
      await until(page, `${OPEN_PANEL} !== null && document.querySelectorAll("[data-org-item]").length >= 2`.replace(/^/, "() => "));
      const target = await page.evaluate(() => {
        const item = [...document.querySelectorAll("[data-org-item]")].find((el) => el.getAttribute("aria-current") !== "true");
        return item?.querySelector("span.truncate.font-medium")?.textContent ?? null;
      });
      expect(target, `no other organization to switch to (${await page.evaluate(() => [...document.querySelectorAll("[data-org-item]")].map((el) => `${el.getAttribute("aria-current")}:${el.querySelector("span.truncate.font-medium")?.textContent}`).join(", "))})`);
      await page.evaluate(() => [...document.querySelectorAll("[data-org-item]")].find((el) => el.getAttribute("aria-current") !== "true")?.click());
      await until(page, "() => document.querySelector(':popover-open') === null");
      const shown = await page.$eval(trigger, (el) => el.textContent);
      expect(shown.includes(target), `trigger shows "${shown}", expected "${target}"`);
      await until(page, (before) => document.querySelector("#app-sidebar nav")?.textContent !== before, navBefore);

      await page.click(trigger);
      await until(page, "() => document.querySelector(':popover-open') !== null");
      await page.keyboard.press("Escape");
      await until(page, "() => document.querySelector(':popover-open') === null");
      expect(await page.evaluate((sel) => document.activeElement === document.querySelector(sel), trigger), "focus did not return to the switcher");
    });

    await step("account menu opens with its items and closes on Escape", async () => {
      const trigger = `${SIDEBAR} button[aria-label="Account menu"]`;
      await page.click(trigger);
      await until(page, "() => document.querySelector(':popover-open [role=menuitem]') !== null");
      const items = await page.$$eval(":popover-open [role=menuitem]", (els) => els.map((el) => el.textContent.trim()));
      expect(items.length >= 3, `only ${items.length} menu items`);
      expect(items.includes("Sign out"), `no "Sign out" among ${items.join(", ")}`);
      await page.keyboard.press("Escape");
      await until(page, "() => document.querySelector(':popover-open') === null");
      expect(await page.evaluate((sel) => document.activeElement === document.querySelector(sel), trigger), "focus did not return to the account button");
    });

    await step("display settings change mode, style and language", async () => {
      await page.click(`button[aria-label="Display settings"]`);
      await until(page, "() => document.querySelector(':popover-open') !== null");
      await clickText(page, ":popover-open", "Dark");
      await until(page, () => document.documentElement.dataset.mode === "dark");
      await clickText(page, ":popover-open", "Light");
      await until(page, () => document.documentElement.dataset.mode === "light");
      await page.select(":popover-open select", "swiss");
      await until(page, () => document.documentElement.dataset.theme === "swiss");
      await page.select(":popover-open select", "flat");
      await until(page, () => document.documentElement.dataset.theme === "flat");
      await clickText(page, ":popover-open", "বাংলা");
      await until(page, () => document.documentElement.lang === "bn", undefined, 10000);
      await page.waitForNetworkIdle({ idleTime: 500 });
      await page.click(`button[aria-label="উপস্থিতি"], button[aria-haspopup="dialog"][aria-label]:not([aria-label^="Switch"]):not([aria-label^="সংস্থা"])`).catch(() => {});
      await page.evaluate(() => document.querySelector(":popover-open") === null && null);
      // Put English back through the cookie so later steps read English labels.
      await page.setCookie({ name: "locale", value: "en", url: page.url() });
      await page.reload({ waitUntil: "networkidle0" });
      expect((await html(page, "lang")) === "en", "language did not return to English");
    });

    await step("theme mode and style persist across a reload, set before first paint", async () => {
      await page.click(`button[aria-label="Display settings"]`);
      await until(page, "() => document.querySelector(':popover-open') !== null");
      await clickText(page, ":popover-open", "Dark");
      await page.select(":popover-open select", "swiss");
      await until(page, () => document.documentElement.dataset.mode === "dark" && document.documentElement.dataset.theme === "swiss");
      await page.reload({ waitUntil: "domcontentloaded" });
      const early = await page.evaluate(() => ({ mode: localStorage.getItem("bokoui-theme-mode"), theme: localStorage.getItem("bokoui-theme-style") }));
      expect(early.mode === "dark" && early.theme === "swiss", `stored choice is ${early.theme}/${early.mode}, not swiss/dark`);
      await page.waitForNetworkIdle({ idleTime: 500 });
      await page.click(`button[aria-label="Display settings"]`);
      await until(page, "() => document.querySelector(':popover-open') !== null");
      await clickText(page, ":popover-open", "Light");
      await page.select(":popover-open select", "flat");
      await until(page, () => document.documentElement.dataset.mode === "light" && document.documentElement.dataset.theme === "flat");
      await page.keyboard.press("Escape");
    });

    await step("a five-level menu: the active deep item is shown in the sidebar and nothing overflows", async () => {
      // The hospital organization owns the large departments menu; earlier steps switched away from it.
      await page.setCookie({ name: "active-organization", value: "org-hospital", url: baseUrl });
      await page.goto(`${baseUrl}/departments/cardiology/ward-a/intensive-care-unit`, { waitUntil: "networkidle0" });
      const state = await page.evaluate(() => {
        const sidebar = document.querySelector("#app-sidebar");
        const root = document.documentElement;
        return {
          hasActive: Boolean(sidebar?.querySelector('a[aria-current="page"]')),
          sidebarOverflowX: sidebar ? sidebar.scrollWidth > sidebar.clientWidth + 1 : null,
          pageOverflowX: root.scrollWidth > root.clientWidth + 1,
          crumbs: document.querySelectorAll('nav[aria-label="Breadcrumb"] li').length,
        };
      });
      expect(state.hasActive, "the active item is not in the sidebar (parents not expanded)");
      expect(state.sidebarOverflowX === false, "the sidebar scrolls sideways");
      expect(!state.pageOverflowX, "the page scrolls sideways");
      expect(state.crumbs >= 3, `breadcrumb has ${state.crumbs} parts for a five-level page`);
    });

    await step("every notification tab shows its own list; mark all read clears the badge", async () => {
      const bell = `button[aria-label^="Notifications"]`;
      await until(page, () => document.querySelector('button[aria-label^="Notifications"]')?.getAttribute("aria-label").includes("unread")).catch(async () => {
        throw new Error(`bell has no unread count at the start (label "${await attr(page, bell, "aria-label")}", lang ${await html(page, "lang")})`);
      });
      await page.click(bell);
      await until(page, "() => document.querySelector(':popover-open [role=tab]') !== null");
      const tabs = await page.$$eval(":popover-open [role=tab]", (els) => els.map((el) => el.textContent.trim()));
      expect(tabs.length === 4, `expected 4 tabs, got ${tabs.join(", ")}`);
      for (const name of ["All", "Unread", "Urgent", "Invitations"]) {
        await clickText(page, ":popover-open", name);
        const state = await page.evaluate((wanted) => {
          const tab = [...document.querySelectorAll(":popover-open [role=tab]")].find((el) => el.textContent.trim().startsWith(wanted));
          const panel = document.querySelector(":popover-open [role=tabpanel]");
          return {
            selected: tab?.getAttribute("aria-selected"),
            rows: panel?.querySelectorAll("li").length ?? 0,
            empty: Boolean(panel && !panel.querySelector("li") && panel.textContent.trim()),
            badge: Number(tab?.textContent.match(/(\d+)\s*$/)?.[1] ?? NaN),
          };
        }, name);
        expect(state.selected === "true", `tab ${name} is not selected`);
        expect(state.rows > 0 || state.empty, `tab ${name} shows neither rows nor an empty message`);
        if (name !== "All" && !Number.isNaN(state.badge)) expect(state.badge === state.rows, `tab ${name} says ${state.badge} but lists ${state.rows}`);
      }
      await clickText(page, ":popover-open", "All");
      await clickText(page, ":popover-open", "Mark all as read");
      await until(page, () => !document.querySelector('button[aria-label^="Notifications"]')?.getAttribute("aria-label").includes("unread"));
      expect(
        await page.evaluate(() => document.querySelector(":popover-open")?.contains(document.activeElement)),
        "focus is lost after Mark all as read (the button removed itself); Escape no longer closes the panel",
      );
      await clickText(page, ":popover-open", "Unread");
      const empty = await page.$eval(":popover-open [role=tabpanel]", (el) => el.querySelectorAll("li").length === 0);
      expect(empty, "Unread tab still lists items after marking all read");
      await page.keyboard.press("Escape");
      await until(page, "() => document.querySelector(':popover-open') === null");
    });

    for (const problem of new Set(page.problems)) failures.push(`desktop console: ${problem}`);
  } finally {
    await page.closeAll();
  }
}

async function phoneScenarios({ browser, baseUrl, step, failures }) {
  const page = await openPage(browser, baseUrl, "/dashboard", { viewport: phone, signedIn: true });
  try {
    await step("mobile drawer traps focus, closes on Escape and returns focus", async () => {
      const opener = `button[aria-label="Open menu"]`;
      await page.click(opener);
      await until(page, "() => document.querySelector('dialog[open]') !== null");
      expect(await page.evaluate(() => document.querySelector("dialog[open]")?.contains(document.activeElement)), "focus did not move into the drawer");
      for (let index = 0; index < 25; index += 1) {
        await page.keyboard.press("Tab");
        expect(await focusInside(page, "dialog[open]"), `focus left the drawer after ${index + 1} Tab presses`);
      }
      for (let index = 0; index < 5; index += 1) {
        await page.keyboard.down("Shift");
        await page.keyboard.press("Tab");
        await page.keyboard.up("Shift");
        expect(await focusInside(page, "dialog[open]"), "focus left the drawer on Shift+Tab");
      }
      await page.keyboard.press("Escape");
      await until(page, "() => document.querySelector('dialog[open]') === null");
      expect(await page.evaluate((sel) => document.activeElement === document.querySelector(sel), opener), "focus did not return to the menu button");
    });

    await step("a bottom-nav item with children opens its sub menu in a sheet above the bar", async () => {
      const result = await page.evaluate(() => {
        const bar = document.querySelector('nav[aria-label="Mobile navigation"]');
        const button = [...(bar?.querySelectorAll("button[aria-haspopup=dialog]") ?? [])].find((el) => el.textContent.trim() !== "More");
        button?.click();
        return { found: Boolean(button) };
      });
      expect(result.found, "no bottom-nav item with a sub menu");
      await until(page, "() => document.querySelector('dialog[open]') !== null");
      const geometry = await page.evaluate(() => {
        const sheet = document.querySelector("dialog[open]").getBoundingClientRect();
        const bar = document.querySelector('nav[aria-label="Mobile navigation"]').getBoundingClientRect();
        return { sheetBottom: sheet.bottom, barTop: bar.top };
      });
      expect(geometry.sheetBottom <= geometry.barTop + 2, `the sheet ends at ${Math.round(geometry.sheetBottom)}px but the bar starts at ${Math.round(geometry.barTop)}px`);
      await page.keyboard.press("Escape");
      await until(page, "() => document.querySelector('dialog[open]') === null");
    });

    await step("bottom navigation 'More' opens a sheet that closes on Escape", async () => {
      const more = `nav button[aria-label="More"], nav button:has(+ *), nav button`;
      const clicked = await page.evaluate(() => {
        const button = [...document.querySelectorAll("nav button")].find((el) => el.textContent.trim() === "More");
        button?.click();
        return Boolean(button);
      });
      expect(clicked, `no "More" button (${more})`);
      await until(page, "() => document.querySelector('dialog[open]') !== null");
      await page.keyboard.press("Escape");
      await until(page, "() => document.querySelector('dialog[open]') === null");
    });

    for (const problem of new Set(page.problems)) failures.push(`phone console: ${problem}`);
  } finally {
    await page.closeAll();
  }
}

export async function interactions({ browser, baseUrl, log = console.log }) {
  const failures = [];
  const step = makeRunner(failures, log);
  await desktopScenarios({ browser, baseUrl, step, failures });
  await phoneScenarios({ browser, baseUrl, step, failures });
  return failures;
}
