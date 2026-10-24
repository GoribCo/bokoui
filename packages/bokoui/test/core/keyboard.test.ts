import { describe, expect, it } from "vitest";
import { getNextIndex, isTypeaheadKey, typeaheadIndex } from "@/core/keyboard";

describe("getNextIndex", () => {
  it("moves with vertical arrows by default and wraps", () => {
    expect(getNextIndex(0, 3, "ArrowDown")).toBe(1);
    expect(getNextIndex(2, 3, "ArrowDown")).toBe(0);
    expect(getNextIndex(0, 3, "ArrowUp")).toBe(2);
  });

  it("stops at the ends without loop", () => {
    expect(getNextIndex(2, 3, "ArrowDown", { loop: false })).toBe(2);
    expect(getNextIndex(0, 3, "ArrowUp", { loop: false })).toBe(0);
  });

  it("ignores arrows of the other axis", () => {
    expect(getNextIndex(0, 3, "ArrowRight", { orientation: "vertical" })).toBeUndefined();
    expect(getNextIndex(0, 3, "ArrowDown", { orientation: "horizontal" })).toBeUndefined();
    expect(getNextIndex(0, 3, "ArrowDown", { orientation: "both" })).toBe(1);
  });

  it("flips horizontal arrows in rtl", () => {
    expect(getNextIndex(1, 3, "ArrowRight", { orientation: "horizontal", rtl: true })).toBe(0);
  });

  it("handles Home and End, and unrelated keys", () => {
    expect(getNextIndex(1, 3, "Home")).toBe(0);
    expect(getNextIndex(1, 3, "End")).toBe(2);
    expect(getNextIndex(1, 3, "a")).toBeUndefined();
    expect(getNextIndex(0, 0, "ArrowDown")).toBeUndefined();
  });
});

describe("typeaheadIndex", () => {
  const labels = ["Apple", "Avocado", "Banana", "Blueberry"];

  it("finds the next label with the typed letter, wrapping", () => {
    expect(typeaheadIndex(labels, "b", 0)).toBe(2);
    expect(typeaheadIndex(labels, "b", 2)).toBe(3);
    expect(typeaheadIndex(labels, "b", 3)).toBe(2);
  });

  it("matches multi-letter prefixes including the current item", () => {
    expect(typeaheadIndex(labels, "blu", 2)).toBe(3);
    expect(typeaheadIndex(labels, "av", 0)).toBe(1);
  });

  it("cycles when the same letter repeats", () => {
    expect(typeaheadIndex(labels, "aa", 0)).toBe(1);
  });

  it("returns -1 when nothing matches", () => {
    expect(typeaheadIndex(labels, "z", 0)).toBe(-1);
    expect(typeaheadIndex(labels, "", 0)).toBe(-1);
  });
});

describe("isTypeaheadKey", () => {
  it("accepts letters, rejects space, shortcuts and named keys", () => {
    expect(isTypeaheadKey({ key: "a" })).toBe(true);
    expect(isTypeaheadKey({ key: " " })).toBe(false);
    expect(isTypeaheadKey({ key: "a", metaKey: true })).toBe(false);
    expect(isTypeaheadKey({ key: "Enter" })).toBe(false);
  });
});
