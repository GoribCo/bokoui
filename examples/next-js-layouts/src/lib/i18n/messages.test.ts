import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { defaultLocale, locales } from "./config";

type Tree = { [key: string]: string | Tree };

const load = (locale: string): Tree =>
  JSON.parse(readFileSync(new URL(`./messages/${locale}.json`, import.meta.url), "utf8")) as Tree;

/** Flattens nested messages to `a.b.c -> text`. */
function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((out, [key, value]) => {
    if (typeof value === "string") out[`${prefix}${key}`] = value;
    else Object.assign(out, flatten(value, `${prefix}${key}.`));
    return out;
  }, {});
}

/** `{name}` and ICU `{count, plural, ...}` argument names used by a message. */
const placeholders = (text: string) =>
  [...text.matchAll(/\{\s*([A-Za-z_][\w]*)/g)].map((m) => m[1]).sort();

const reference = flatten(load(defaultLocale));

describe("message catalogs", () => {
  for (const locale of locales.filter((l) => l !== defaultLocale)) {
    const messages = flatten(load(locale));

    it(`${locale} has every key of ${defaultLocale}`, () => {
      const missing = Object.keys(reference).filter((key) => !(key in messages));
      assert.deepEqual(missing, [], `missing in ${locale}.json`);
    });

    it(`${locale} has no keys that ${defaultLocale} lacks`, () => {
      const extra = Object.keys(messages).filter((key) => !(key in reference));
      assert.deepEqual(extra, [], `unknown in ${locale}.json`);
    });

    it(`${locale} messages are not empty`, () => {
      const empty = Object.keys(messages).filter((key) => messages[key].trim() === "");
      assert.deepEqual(empty, []);
    });

    it(`${locale} keeps the placeholders of ${defaultLocale}`, () => {
      const differing = Object.keys(reference)
        .filter((key) => key in messages)
        .filter((key) => placeholders(reference[key]).join() !== placeholders(messages[key]).join());
      assert.deepEqual(differing, []);
    });
  }
});
