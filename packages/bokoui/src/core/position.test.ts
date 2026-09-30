import { describe, expect, it } from "vitest";
import { computePosition } from "./position";

const viewport = { width: 1000, height: 800 };
const floating = { width: 100, height: 40 };

describe("computePosition", () => {
  it("centers below the anchor by default", () => {
    const p = computePosition({ anchor: { top: 100, left: 400, width: 200, height: 40 }, floating, viewport });
    expect(p).toEqual({ side: "bottom", top: 148, left: 450 });
  });

  it("places above with top, aligned to the start edge", () => {
    const p = computePosition({ anchor: { top: 300, left: 400, width: 200, height: 40 }, floating, viewport, placement: "top-start" });
    expect(p).toEqual({ side: "top", top: 252, left: 400 });
  });

  it("flips when the requested side does not fit", () => {
    const p = computePosition({ anchor: { top: 10, left: 400, width: 200, height: 40 }, floating, viewport, placement: "top" });
    expect(p.side).toBe("bottom");
  });

  it("stays put when neither side fits", () => {
    const tiny = { width: 1000, height: 100 };
    const p = computePosition({ anchor: { top: 30, left: 0, width: 50, height: 40 }, floating: { width: 10, height: 200 }, viewport: tiny, placement: "top" });
    expect(p.side).toBe("top");
  });

  it("clamps into the viewport horizontally", () => {
    const p = computePosition({ anchor: { top: 100, left: 960, width: 30, height: 30 }, floating, viewport });
    expect(p.left).toBe(1000 - 100 - 8);
  });

  it("positions to the right of the anchor", () => {
    const p = computePosition({ anchor: { top: 100, left: 100, width: 50, height: 40 }, floating, viewport, placement: "right" });
    expect(p).toEqual({ side: "right", top: 100, left: 158 });
  });
});
