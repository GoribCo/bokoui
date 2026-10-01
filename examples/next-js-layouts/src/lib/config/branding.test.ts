import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const srcDir = path.resolve(import.meta.dirname, "../..");

/** The configuration module and the sample backend (demo data, deleted with `src/api`) may name the product. */
const allowed = ["lib/config/", "api/"];

function* sourceFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* sourceFiles(full);
    else if (/\.(ts|tsx|json|css)$/.test(entry) && !/\.test\.ts$/.test(entry)) yield full;
  }
}

describe("branding lives in the configuration module", () => {
  const patterns: [string, RegExp][] = [
    ["the product name", /Bokoui Layout/],
    ["a demo address", /@example\.(com|org)|https?:\/\/(www\.)?example\.(com|org)/],
  ];

  for (const [what, pattern] of patterns) {
    it(`no file outside lib/config names ${what}`, () => {
      const offenders = [...sourceFiles(srcDir)]
        .map((file) => path.relative(srcDir, file).split(path.sep).join("/"))
        .filter((file) => !allowed.some((prefix) => file.startsWith(prefix)))
        .filter((file) => pattern.test(readFileSync(path.join(srcDir, file), "utf8")));
      assert.deepEqual(offenders, []);
    });
  }
});
