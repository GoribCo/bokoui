import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a type=button by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("maps action to data-tone, overriding color", () => {
    render(<Button color="primary" action="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-tone", "danger");
  });

  it("is busy and disabled while loading", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("fires onClick, but not when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("merges a custom className", () => {
    render(<Button className="custom-class">Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
