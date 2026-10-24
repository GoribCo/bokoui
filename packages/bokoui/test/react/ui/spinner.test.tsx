import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "@/react/ui";

describe("Spinner", () => {
  it("is a status region with an accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saving");
  });

  it("applies the tone and size", () => {
    const { container } = render(<Spinner action="danger" size="lg" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "danger");
    expect(container.querySelector("svg")).toHaveClass("size-8", "motion-reduce:animate-pulse");
  });
});
