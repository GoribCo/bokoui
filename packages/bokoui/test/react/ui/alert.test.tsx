import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "@/react/ui";

describe("Alert", () => {
  it("shows title and description", () => {
    render(<Alert title="Heads up">Something happened</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Heads upSomething happened");
  });

  it("interrupts assistive tech for danger and warning only", () => {
    const { rerender } = render(<Alert action="danger">x</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<Alert action="warning">x</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<Alert action="success">x</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("is neutral without an action, and action overrides color", () => {
    const { rerender } = render(<Alert>x</Alert>);
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "neutral");
    rerender(<Alert color="accent" action="info">x</Alert>);
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "info");
  });

  it("has a default icon that can be replaced or removed", () => {
    const { container, rerender } = render(<Alert>x</Alert>);
    expect(container.querySelector("svg")).not.toBeNull();
    rerender(<Alert icon={<b data-testid="i" />}>x</Alert>);
    expect(screen.getByTestId("i")).toBeInTheDocument();
    rerender(<Alert icon={false}>x</Alert>);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("only renders a close button when onClose is given", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Alert>x</Alert>);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<Alert onClose={onClose}>x</Alert>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies the variant", () => {
    render(<Alert variant="solid">x</Alert>);
    expect(screen.getByRole("status")).toHaveClass("bg-(--tone)");
  });
});
