import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content in a span with the primary tone", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-tone", "primary");
  });

  it("lets action override color", () => {
    render(<Badge color="accent" action="success">Paid</Badge>);
    expect(screen.getByText("Paid")).toHaveAttribute("data-tone", "success");
  });

  it("defaults to the soft variant and switches by prop", () => {
    const { rerender } = render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("bg-(--tone-soft)");
    rerender(<Badge variant="solid">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("bg-(--tone)");
    rerender(<Badge variant="outline">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("bg-transparent");
  });

  it("applies sizes", () => {
    render(<Badge size="lg">Big</Badge>);
    expect(screen.getByText("Big")).toHaveClass("h-7");
  });

  it("merges className, passes attributes and forwards its ref", () => {
    let node: HTMLSpanElement | null = null;
    render(<Badge className="extra" data-testid="b" ref={(el) => void (node = el)}>x</Badge>);
    expect(screen.getByTestId("b")).toHaveClass("extra");
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });
});
