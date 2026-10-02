import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardFooter, CardHeader } from "./card";

describe("Card", () => {
  it("renders children with the outline variant and medium padding by default", () => {
    render(<Card data-testid="c">Body</Card>);
    const card = screen.getByTestId("c");
    expect(card).toHaveTextContent("Body");
    expect(card).toHaveClass("surface-card", "gap-4");
  });

  it("switches variant and padding", () => {
    render(<Card data-testid="c" variant="filled" padding="none" />);
    const card = screen.getByTestId("c");
    expect(card).toHaveClass("bg-muted");
    expect(card).not.toHaveClass("gap-4");
  });

  it("adds elevation only for elevated", () => {
    render(<Card data-testid="c" variant="elevated" />);
    expect(screen.getByTestId("c")).toHaveClass("surface-card-raised");
  });

  it("adds interactive feedback only when asked", () => {
    const { rerender } = render(<Card data-testid="c" />);
    expect(screen.getByTestId("c")).not.toHaveClass("cursor-pointer");
    rerender(<Card data-testid="c" interactive />);
    expect(screen.getByTestId("c")).toHaveClass("cursor-pointer");
  });

  it("merges className and forwards its ref", () => {
    let node: HTMLDivElement | null = null;
    render(<Card className="extra" data-testid="c" ref={(el) => void (node = el)} />);
    expect(screen.getByTestId("c")).toHaveClass("extra");
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("renders header and footer slots", () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toHaveClass("flex-col");
    expect(screen.getByText("Actions")).toHaveClass("items-center");
  });
});
