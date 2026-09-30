import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getInitials } from "@/core";
import { Avatar } from "./avatar";

describe("getInitials", () => {
  it("takes the first letters of up to two words", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("  ada   king lovelace ")).toBe("ak");
    expect(getInitials("Cher")).toBe("C");
    expect(getInitials(undefined)).toBe("");
  });
});

describe("Avatar", () => {
  it("shows initials and an accessible name without an image", () => {
    render(<Avatar name="Ada Lovelace" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar).toHaveTextContent("AL");
  });

  it("renders the image with the name as alt text", () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveAttribute("src", "/ada.png");
  });

  it("uses a custom fallback instead of initials", () => {
    render(<Avatar name="Ada" fallback={<b>?</b>} />);
    expect(screen.getByText("?")).toBeInTheDocument();
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("applies size and shape", () => {
    render(<Avatar name="Ada" size="lg" shape="square" data-testid="a" />);
    expect(screen.getByTestId("a")).toHaveClass("size-12", "rounded-control");
  });

  it("draws a status dot with its own tone", () => {
    const { container } = render(<Avatar name="Ada" status statusAction="warning" />);
    expect(container.querySelector('[data-tone="warning"]')).not.toBeNull();
  });

  it("forwards onError to the image", () => {
    let called = false;
    render(<Avatar name="Ada" src="/x.png" imgProps={{ onError: () => (called = true) }} />);
    screen.getByRole("img", { name: "Ada" }).dispatchEvent(new Event("error"));
    expect(called).toBe(true);
  });
});
