import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { demoLinkFiles, demoPaths, demoRewrites, root, stripDemo } from "../../../../scripts/remove-demo.mjs";

function* files(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* files(full);
    else if (/\.(ts|tsx|mjs)$/.test(entry)) yield full;
  }
}

describe("scripts/remove-demo.mjs stays in step with the code", () => {
  it("every path it deletes, rewrites or relinks exists", () => {
    for (const rel of [...demoPaths, ...Object.keys(demoRewrites), ...demoLinkFiles]) {
      assert.ok(existsSync(path.join(root, rel)), `${rel} is listed in the script but missing`);
    }
  });

  it("every // demo:start has a // demo:end", () => {
    for (const dir of ["src", "test"]) {
      for (const file of files(path.join(root, dir))) {
        assert.doesNotThrow(() => stripDemo(readFileSync(file, "utf8")), path.relative(root, file));
      }
    }
  });

  it("strips marked lines and blocks and nothing else", () => {
    const source = ["keep 1", "drop // demo", "// demo:start", "drop block", "// demo:end", "keep 2"].join("\n");
    assert.equal(stripDemo(source), "keep 1\nkeep 2");
    assert.equal(stripDemo("nothing marked"), null);
  });

  it("rejects an unterminated block", () => {
    assert.throws(() => stripDemo("a\n// demo:start\nb"));
  });
});
