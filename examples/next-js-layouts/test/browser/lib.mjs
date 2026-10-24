// Shared helpers for the browser checks: build a throwaway clone, serve it, drive Chrome.
import { spawn } from "node:child_process";
import { constants, existsSync } from "node:fs";
import { cp, mkdtemp, rm } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const STYLES = [
  "flat", "material", "swiss", "brutalism", "neo-brutalism", "monochrome", "oled", "fluent",
  "minimalism", "bento", "material-3", "soft-ui", "neumorphism", "claymorphism", "skeuomorphism", "terminal", "synthwave", "glassmorphism", "liquid-glass", "aurora",
];
export const MODES = ["light", "dark"];
export const WIDTHS = [
  { width: 390, height: 844, mobile: true },
  { width: 768, height: 1024, mobile: false },
  { width: 1280, height: 800, mobile: false },
];

/** Pages without the shell; they need no session (and redirect away from sign-in when signed in). */
export const PUBLIC_ROUTES = [
  "/", // demo
  "/sign-in",
  "/legal/privacy",
  "/legal/terms",
  "/help",
  "/contact",
  "/hospital/green-valley-hospital",
  "/pharmacy/citycare-pharmacy",
  "/company/acme-health",
  "/hospital/does-not-exist",
];

/** Pages inside the shell; they need the session cookie. */
export const APP_ROUTES = [
  "/dashboard",
  "/account",
  "/admin",
  "/departments/cardiology/ward-a/intensive-care-unit",
  "/examples/filters", // demo
  "/examples/form", // demo
  "/examples/long-page", // demo
  "/examples/table", // demo
  "/examples/styles",
  "/examples/showcase-home",
  "/examples/showcase-settings",
  "/examples/showcase-calculator",
  "/notifications",
  "/organizations",
  "/profile",
  "/settings/privacy",
  "/no-such-page",
];

/** Routes that must answer 404; the browser logs that status as a console error, which is not a bug. */
export const NOT_FOUND_ROUTES = ["/hospital/does-not-exist", "/no-such-page"];

/** Signs in through the API and returns the token cookies it sets, ready for `page.setCookie`. */
export async function signInCookies(baseUrl) {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "check@example.com", password: "secret" }),
  });
  if (!response.ok) throw new Error(`login failed with ${response.status}`);
  const host = new URL(baseUrl).hostname;
  return response.headers.getSetCookie().map((line) => {
    const [pair] = line.split(";");
    const index = pair.indexOf("=");
    return { name: pair.slice(0, index), value: decodeURIComponent(pair.slice(index + 1)), domain: host, path: "/", httpOnly: true };
  });
}

export function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!found) throw new Error("Chrome not found. Set CHROME_PATH to a Chrome or Chromium binary.");
  return found;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve(output) : reject(new Error(`${command} ${args.join(" ")} failed:\n${output}`))));
  });
}

async function waitFor(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url, { redirect: "manual" })).status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Server did not answer at ${url}`);
}

/**
 * Copies the project to a temp folder (copy-on-write where the filesystem supports it), builds it there
 * and serves it. Never builds inside the project, so a running `next dev` is left alone.
 * Returns the base URL and a `stop` function that kills the server and deletes the copy.
 */
export async function startClone({ log = console.log } = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "layouts-check-"));
  log(`Copying the app to ${dir}`);
  await cp(projectDir, dir, {
    recursive: true,
    mode: constants.COPYFILE_FICLONE,
    filter: (source) => {
      const first = path.relative(projectDir, source).split(path.sep)[0];
      return first !== ".next" && first !== ".git";
    },
  });

  // The sample API refuses production traffic unless told otherwise; this is a throwaway check server.
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ALLOW_SAMPLE_API: "true", AUTH_JWT_SECRET: "browser-check-secret" };
  const nextBin = path.join(dir, "node_modules/next/dist/bin/next");
  log("Building (next build)");
  await run(process.execPath, [nextBin, "build"], { cwd: dir, env });

  const port = await freePort();
  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], { cwd: dir, env, stdio: "ignore" });
  const baseUrl = `http://localhost:${port}`;
  const stop = async () => {
    server.kill();
    await rm(dir, { recursive: true, force: true });
  };
  try {
    await waitFor(`${baseUrl}/sign-in`);
  } catch (error) {
    await stop();
    throw error;
  }
  log(`Serving the copy at ${baseUrl}`);
  return { baseUrl, stop };
}

/** CSS that removes transitions so colors are measured at rest, not mid-animation. */
export const NO_MOTION_CSS = "*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}";

/**
 * Opens a page at a viewport with motion off and optional cookies. Collects console errors and uncaught
 * exceptions into `page.problems`.
 */
export async function openPage(browser, baseUrl, route, { viewport, signedIn, locale }) {
  // Own browser context per page, so cookies from one page never leak into the next.
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  page.problems = [];
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
    deviceScaleFactor: 1,
  });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.evaluateOnNewDocument((css) => {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.append(style);
    });
  }, NO_MOTION_CSS);
  page.on("console", (message) => {
    if (message.type() === "error") page.problems.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => page.problems.push(`uncaught: ${error.message}`));

  const host = new URL(baseUrl).hostname;
  const cookies = [];
  if (signedIn) cookies.push(...(await signInCookies(baseUrl)));
  if (locale) cookies.push({ name: "locale", value: locale, domain: host, path: "/" });
  if (cookies.length > 0) await page.setCookie(...cookies);

  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle0", timeout: 45_000 });
  page.status = response?.status();
  if (NOT_FOUND_ROUTES.includes(route)) {
    page.problems = page.problems.filter((text) => !/Failed to load resource.*404/.test(text));
  }
  page.closeAll = () => context.close();
  return page;
}

/** Writes style and mode on <html> exactly like `applyTheme` does, then waits for layout to settle. */
export async function setTheme(page, style, mode) {
  await page.evaluate(
    (s, m) => {
      const root = document.documentElement;
      root.dataset.theme = s;
      root.dataset.mode = m;
      root.style.colorScheme = m;
    },
    style,
    mode,
  );
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

export function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const [key, inline] = arg.slice(2).split("=");
    const value = inline ?? (argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[(index += 1)] : "true");
    options[key] = value;
  }
  return options;
}

export const list = (value) => (value ? value.split(",").map((item) => item.trim()).filter(Boolean) : undefined);
