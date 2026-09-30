import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Navbar, NavbarBrand, NavbarLink } from "./navbar";

function Example() {
  return (
    <Navbar brand={<NavbarBrand href="/">Bokoui</NavbarBrand>} actions={<button>Sign in</button>} sticky>
      <NavbarLink href="/" active>Home</NavbarLink>
      <NavbarLink href="/docs">Docs</NavbarLink>
    </Navbar>
  );
}

describe("Navbar", () => {
  it("is a banner containing a labelled navigation with links, brand and actions", () => {
    render(<Example />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bokoui" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Docs" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("toggles the mobile menu, keeping aria-expanded and aria-controls in sync", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const toggle = screen.getByRole("button", { name: "Menu" });
    const list = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(list.className).toContain("hidden");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(list.className).not.toContain("hidden ");
    expect(list).toHaveClass("flex");
  });

  it("closes the menu on Escape and after choosing a link", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const toggle = screen.getByRole("button", { name: "Menu" });
    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "Docs" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("makes the bar sticky only when asked", () => {
    const { rerender } = render(<Navbar>x</Navbar>);
    expect(screen.getByRole("banner")).not.toHaveClass("sticky");
    rerender(<Navbar sticky>x</Navbar>);
    expect(screen.getByRole("banner")).toHaveClass("sticky");
  });

  it("pushes the menu button to the end only when there are no actions", () => {
    const { rerender } = render(<Navbar>x</Navbar>);
    expect(screen.getByRole("button", { name: "Menu" })).toHaveClass("ms-auto");
    rerender(<Navbar actions={<button>Go</button>}>x</Navbar>);
    expect(screen.getByRole("button", { name: "Menu" })).not.toHaveClass("ms-auto");
  });
});
