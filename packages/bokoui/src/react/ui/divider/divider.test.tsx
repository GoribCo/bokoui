import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

describe("Divider", () => {
  it("renders a horizontal <hr> by default", () => {
    render(<Divider />);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });

  it("marks a vertical divider with aria-orientation", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("shows a label between two lines", () => {
    render(<Divider label="or" />);
    expect(screen.getByRole("separator")).toHaveTextContent("or");
  });

  it("merges className", () => {
    render(<Divider className="my-4" />);
    expect(screen.getByRole("separator")).toHaveClass("my-4");
  });
});
