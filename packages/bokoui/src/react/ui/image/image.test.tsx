import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { forwardRef } from "react";
import { Image } from "./image";

describe("Image", () => {
  it("renders an img with alt text, lazy loading and async decoding", () => {
    render(<Image src="/a.png" alt="A cat" />);
    const img = screen.getByRole("img", { name: "A cat" });
    expect(img).toHaveAttribute("src", "/a.png");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("treats empty alt as decorative", () => {
    render(<Image src="/a.png" alt="" data-testid="i" />);
    expect(screen.getByTestId("i")).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("applies aspect, fit and rounded", () => {
    render(<Image src="/a.png" alt="x" aspect="video" fit="contain" rounded />);
    expect(screen.getByRole("img")).toHaveClass("aspect-video", "object-contain", "rounded-card");
  });

  it("renders a custom component through `as`, passing props and className", () => {
    const Custom = forwardRef<HTMLImageElement, Record<string, unknown>>(function Custom(props, ref) {
      return <img ref={ref} data-custom="yes" alt={props.alt as string} className={props.className as string} src={props.src as string} />;
    });
    render(<Image as={Custom} src="/a.png" alt="x" aspect="square" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("data-custom", "yes");
    expect(img).toHaveClass("aspect-square");
  });
});
