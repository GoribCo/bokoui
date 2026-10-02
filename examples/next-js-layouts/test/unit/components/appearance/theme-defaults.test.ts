import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { describe, it } from "node:test";
import { MODE_KEY, STYLE_KEY } from "bokoui/react";
import { buildThemeDefaultsScript } from "@/components/appearance/theme-defaults";

function run(style: string, mode: string, stored: Record<string, string> = {}) {
  const storage = new Map(Object.entries(stored));
  const localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => void storage.set(key, value),
  };
  runInNewContext(buildThemeDefaultsScript(style, mode), { localStorage });
  return Object.fromEntries(storage);
}

describe("theme defaults script", () => {
  it("seeds the configured style and mode for a first visit", () => {
    assert.deepEqual(run("swiss", "dark"), { [STYLE_KEY]: "swiss", [MODE_KEY]: "dark" });
  });

  it("never overwrites what the visitor chose", () => {
    const stored = { [STYLE_KEY]: "oled", [MODE_KEY]: "light" };
    assert.deepEqual(run("swiss", "dark", stored), stored);
  });

  it("seeds only the missing half", () => {
    assert.deepEqual(run("swiss", "dark", { [MODE_KEY]: "light" }), { [MODE_KEY]: "light", [STYLE_KEY]: "swiss" });
  });

  it("survives blocked storage", () => {
    assert.doesNotThrow(() =>
      runInNewContext(buildThemeDefaultsScript("swiss", "dark"), {
        localStorage: { getItem: () => { throw new Error("blocked"); } },
      }),
    );
  });
});
