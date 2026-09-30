import { describe, expect, it } from "vitest";
import { formatBytes, isAccepted } from "./files";

describe("formatBytes", () => {
  it("formats with 1024-based units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(10 * 1024)).toBe("10 KB");
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1.4 * 1024 * 1024)).toBe("1.4 MB");
    expect(formatBytes(5 * 1024 ** 3)).toBe("5 GB");
  });

  it("returns an empty string for nonsense", () => {
    expect(formatBytes(-1)).toBe("");
    expect(formatBytes(NaN)).toBe("");
  });
});

describe("isAccepted", () => {
  const png = { name: "Photo.PNG", type: "image/png" };
  const pdf = { name: "cv.pdf", type: "application/pdf" };

  it("accepts anything without a rule", () => {
    expect(isAccepted(png)).toBe(true);
    expect(isAccepted(png, "")).toBe(true);
  });

  it("matches extensions, exact types and wildcards, case-insensitively", () => {
    expect(isAccepted(png, ".png")).toBe(true);
    expect(isAccepted(png, ".jpg,.png")).toBe(true);
    expect(isAccepted(png, "image/*")).toBe(true);
    expect(isAccepted(png, "image/png")).toBe(true);
    expect(isAccepted(pdf, "image/*")).toBe(false);
    expect(isAccepted(pdf, ".png, application/pdf")).toBe(true);
    expect(isAccepted({ name: "a.txt", type: "" }, ".txt")).toBe(true);
    expect(isAccepted({ name: "a.txt", type: "text/plain" }, "image/*")).toBe(false);
  });
});
