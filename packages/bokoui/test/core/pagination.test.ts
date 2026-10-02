import { describe, expect, it } from "vitest";
import { getPageRange } from "@/core/pagination";

describe("getPageRange", () => {
  it("lists every page when there are few", () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPageRange(1, 0)).toEqual([]);
    expect(getPageRange(1, 1)).toEqual([1]);
  });

  it("collapses the end when near the start", () => {
    expect(getPageRange(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
    expect(getPageRange(4, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
  });

  it("collapses both sides in the middle", () => {
    expect(getPageRange(5, 10)).toEqual([1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]);
    expect(getPageRange(6, 20)).toEqual([1, "ellipsis-start", 5, 6, 7, "ellipsis-end", 20]);
  });

  it("collapses the start when near the end", () => {
    expect(getPageRange(10, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
    expect(getPageRange(7, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
  });

  it("keeps a constant length once collapsed", () => {
    for (let page = 1; page <= 20; page++) expect(getPageRange(page, 20)).toHaveLength(7);
  });

  it("honors siblings and clamps the page", () => {
    expect(getPageRange(10, 20, 2)).toEqual([1, "ellipsis-start", 8, 9, 10, 11, 12, "ellipsis-end", 20]);
    expect(getPageRange(99, 10)).toEqual(getPageRange(10, 10));
    expect(getPageRange(-3, 10)).toEqual(getPageRange(1, 10));
  });
});
