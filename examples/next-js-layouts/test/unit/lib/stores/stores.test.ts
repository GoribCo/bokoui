import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { createOrganizationStore, ACTIVE_ORGANIZATION_COOKIE } from "@/lib/stores/organization-store";
import { createUiStore, parseSidebarCookie, SIDEBAR_COOKIE, uiSelectors } from "@/lib/stores/ui-store";

/** Minimal `document.cookie` jar: assignment sets or deletes one cookie, reading lists them. */
function installCookieJar() {
  const jar = new Map<string, string>();
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      get cookie() {
        return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
      },
      set cookie(line: string) {
        const [pair, ...attrs] = line.split("; ");
        const [name, value] = [pair.slice(0, pair.indexOf("=")), pair.slice(pair.indexOf("=") + 1)];
        if (attrs.includes("max-age=0")) jar.delete(name);
        else jar.set(name, value);
      },
    },
  });
  return jar;
}

describe("ui store", () => {
  let jar: Map<string, string>;
  beforeEach(() => {
    jar = installCookieJar();
  });

  it("starts expanded with sheets closed", () => {
    const state = createUiStore().getState();
    assert.deepEqual(
      [state.sidebarCollapsed, state.mobileDrawerOpen, state.bottomNavMoreOpen],
      [false, false, false],
    );
  });

  it("accepts a server-seeded initial state", () => {
    assert.equal(createUiStore({ sidebarCollapsed: true }).getState().sidebarCollapsed, true);
  });

  it("toggles and sets the collapsed flag", () => {
    const store = createUiStore();
    store.getState().toggleSidebar();
    assert.equal(store.getState().sidebarCollapsed, true);
    store.getState().setSidebarCollapsed(false);
    assert.equal(store.getState().sidebarCollapsed, false);
  });

  it("opens and closes the drawer and the More sheet", () => {
    const store = createUiStore();
    store.getState().setMobileDrawerOpen(true);
    store.getState().setBottomNavMoreOpen(true);
    assert.equal(uiSelectors.mobileDrawerOpen(store.getState()), true);
    assert.equal(uiSelectors.bottomNavMoreOpen(store.getState()), true);
  });

  it("persists only the collapsed flag, as a plain cookie", () => {
    const store = createUiStore();
    store.getState().setMobileDrawerOpen(true);
    assert.equal(jar.has(SIDEBAR_COOKIE), true);
    store.getState().setSidebarCollapsed(true);
    assert.equal(jar.get(SIDEBAR_COOKIE), "true");
    assert.equal(jar.size, 1);
  });

  it("restores the flag from the cookie on rehydrate", async () => {
    jar.set(SIDEBAR_COOKIE, "true");
    const store = createUiStore();
    assert.equal(store.getState().sidebarCollapsed, false, "skipHydration: not applied until asked");
    await store.persist.rehydrate();
    assert.equal(store.getState().sidebarCollapsed, true);
  });

  it("parses the cookie value", () => {
    assert.equal(parseSidebarCookie("true"), true);
    assert.equal(parseSidebarCookie("false"), false);
    assert.equal(parseSidebarCookie(undefined), false);
  });
});

describe("organization store", () => {
  let jar: Map<string, string>;
  beforeEach(() => {
    jar = installCookieJar();
  });

  it("switches and persists the active organization", () => {
    const store = createOrganizationStore({ activeOrganizationId: "a" });
    store.getState().setActiveOrganization("b");
    assert.equal(store.getState().activeOrganizationId, "b");
    assert.equal(jar.get(ACTIVE_ORGANIZATION_COOKIE), "b");
  });

  it("restores the organization from the cookie on rehydrate", async () => {
    jar.set(ACTIVE_ORGANIZATION_COOKIE, "c");
    const store = createOrganizationStore({ activeOrganizationId: "a" });
    await store.persist.rehydrate();
    assert.equal(store.getState().activeOrganizationId, "c");
  });
});
