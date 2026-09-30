import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn knows the custom theme keys", () => {
  it("lets a standard radius override each custom radius", () => {
    for (const custom of ["rounded-control", "rounded-button", "rounded-card"]) {
      expect(cn(custom, "rounded-none")).toBe("rounded-none");
      expect(cn(custom, "rounded-full")).toBe("rounded-full");
    }
  });

  it("lets a standard shadow override the custom shadows", () => {
    expect(cn("shadow-button", "shadow-none")).toBe("shadow-none");
    expect(cn("shadow-button-hover", "shadow-lg")).toBe("shadow-lg");
  });

  it("treats font-ui as a family, so it coexists with a weight but not another family", () => {
    expect(cn("font-ui", "font-medium")).toBe("font-ui font-medium");
    expect(cn("font-ui", "font-mono")).toBe("font-mono");
    expect(cn("font-heading", "font-sans")).toBe("font-sans");
  });

  it("treats ease-ui as a timing function", () => {
    expect(cn("ease-ui", "ease-in")).toBe("ease-in");
  });

  it("keeps unrelated custom text colors next to a size", () => {
    expect(cn("text-foreground", "text-sm")).toBe("text-foreground text-sm");
    expect(cn("text-muted-foreground", "text-foreground")).toBe("text-foreground");
  });
});
