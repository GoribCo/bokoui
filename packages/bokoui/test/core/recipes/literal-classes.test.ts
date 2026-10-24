import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Tailwind only generates classes it can read as complete string literals in the built
 * package. A class assembled with a template (`${x}:sr-only`) silently produces no CSS, and
 * jsdom tests cannot notice. Recipes therefore must not interpolate into strings.
 */
const dir = join(import.meta.dirname, "../../../src/core/recipes");
const allowed = new Set(["form-field.ts"]); // interpolates element ids, not classes

describe("recipes use only literal class strings", () => {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))) {
    it(file, () => {
      if (allowed.has(file)) return;
      const source = readFileSync(join(dir, file), "utf8");
      expect(source.match(/`[^`]*\$\{[^`]*`/g) ?? []).toEqual([]);
    });
  }
});
