import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "./menu";

// jsdom hides [popover] elements (no Popover API), so menu queries need `hidden: true`.
const opts = { hidden: true } as const;

function Example({ onEdit = () => {}, onDelete = () => {} }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Menu trigger={<button>Options</button>}>
      <MenuLabel>Actions</MenuLabel>
      <MenuItem onSelect={onEdit}>Edit</MenuItem>
      <MenuItem disabled>Copy</MenuItem>
      <MenuSeparator />
      <MenuItem danger onSelect={onDelete}>Delete</MenuItem>
    </Menu>
  );
}

describe("Menu", () => {
  it("is closed initially and the trigger advertises the popup", () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu", opts)).toBeNull();
  });

  it("opens on click and focuses the first enabled item", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu", opts)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Options" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Edit", ...opts })).toHaveFocus();
  });

  it("opens with ArrowDown (first) and ArrowUp (last)", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Delete", ...opts })).toHaveFocus();
  });

  it("moves with arrows, skipping disabled items and wrapping", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete", ...opts })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit", ...opts })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Delete", ...opts })).toHaveFocus();
  });

  it("jumps by typeahead", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("d");
    expect(screen.getByRole("menuitem", { name: "Delete", ...opts })).toHaveFocus();
  });

  it("selects with Enter, calls onSelect, closes and returns focus", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<Example onEdit={onEdit} />);
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu", opts)).toBeNull();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });

  it("does not select disabled items", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.click(screen.getByRole("menuitem", { name: "Copy", ...opts }));
    expect(screen.getByRole("menu", opts)).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu", opts)).toBeNull();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });

  it("closes on an outside click", async () => {
    const user = userEvent.setup();
    render(<><Example /><p>outside</p></>);
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.click(screen.getByText("outside"));
    expect(screen.queryByRole("menu", opts)).toBeNull();
  });

  it("keeps the menu open if onSelect prevents default", async () => {
    const user = userEvent.setup();
    render(
      <Menu trigger={<button>Options</button>}>
        <MenuItem onSelect={(e) => e.preventDefault()}>Stay</MenuItem>
      </Menu>,
    );
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.click(screen.getByRole("menuitem", { name: "Stay", ...opts }));
    expect(screen.getByRole("menu", opts)).toBeInTheDocument();
  });

  it("throws a clear error when MenuItem is used outside Menu", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<MenuItem>x</MenuItem>)).toThrow("<MenuItem> must be used inside <Menu>");
    spy.mockRestore();
  });
});
