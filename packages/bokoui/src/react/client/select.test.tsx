import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../ui/form-field";
import { Select, type SelectOption } from "./select";

// jsdom hides [popover] elements (no Popover API), so listbox queries need `hidden: true`.
const opts = { hidden: true } as const;

const fruits: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "avocado", label: "Avocado", disabled: true },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
];

const combo = () => screen.getByRole("combobox");

describe("Select", () => {
  it("shows the placeholder, then the chosen label", async () => {
    const user = userEvent.setup();
    render(<Select options={fruits} placeholder="Pick a fruit" aria-label="Fruit" />);
    expect(combo()).toHaveTextContent("Pick a fruit");
    await user.click(combo());
    await user.click(screen.getByRole("option", { name: "Banana", ...opts }));
    expect(combo()).toHaveTextContent("Banana");
    expect(screen.queryByRole("listbox", opts)).toBeNull();
  });

  it("exposes combobox semantics and lists options", async () => {
    render(<Select options={fruits} aria-label="Fruit" defaultValue="banana" />);
    expect(combo()).toHaveAttribute("aria-haspopup", "listbox");
    expect(combo()).toHaveAttribute("aria-expanded", "false");
    await userEvent.setup().click(combo());
    expect(combo()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option", opts)).toHaveLength(4);
    expect(screen.getByRole("option", { name: "Banana", ...opts })).toHaveAttribute("aria-selected", "true");
    expect(combo()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Banana", ...opts }).id);
  });

  it("opens with the keyboard and skips disabled options", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={fruits} aria-label="Fruit" onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox", opts)).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(combo()).toHaveFocus();
  });

  it("supports Home/End and Escape without changing the value", async () => {
    const user = userEvent.setup();
    render(<Select options={fruits} aria-label="Fruit" defaultValue="apple" />);
    await user.tab();
    await user.keyboard("{Enter}{End}");
    expect(combo()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Blueberry", ...opts }).id);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox", opts)).toBeNull();
    expect(combo()).toHaveTextContent("Apple");
  });

  it("changes the value by typeahead while closed", async () => {
    const user = userEvent.setup();
    render(<Select options={fruits} aria-label="Fruit" />);
    await user.tab();
    await user.keyboard("b");
    expect(combo()).toHaveTextContent("Banana");
    await user.keyboard("b");
    expect(combo()).toHaveTextContent("Blueberry");
  });

  it("does not choose disabled options", async () => {
    const user = userEvent.setup();
    render(<Select options={fruits} aria-label="Fruit" />);
    await user.click(combo());
    await user.click(screen.getByRole("option", { name: "Avocado", ...opts }));
    expect(screen.getByRole("listbox", opts)).toBeInTheDocument();
    expect(combo()).toHaveTextContent("Select…");
  });

  it("supports controlled use", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={fruits} aria-label="Fruit" value="apple" onValueChange={onValueChange} />);
    await user.click(combo());
    await user.click(screen.getByRole("option", { name: "Banana", ...opts }));
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(combo()).toHaveTextContent("Apple");
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(<><Select options={fruits} aria-label="Fruit" /><p>outside</p></>);
    await user.click(combo());
    await user.click(screen.getByText("outside"));
    expect(screen.queryByRole("listbox", opts)).toBeNull();
  });

  it("submits its value through a hidden input", () => {
    const { container } = render(<Select options={fruits} aria-label="Fruit" name="fruit" defaultValue="apple" />);
    expect(container.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue("apple");
  });

  it("is not openable when disabled", async () => {
    render(<Select options={fruits} aria-label="Fruit" disabled />);
    await userEvent.setup().click(combo());
    expect(screen.queryByRole("listbox", opts)).toBeNull();
  });

  it("marks invalid and works inside FormField", () => {
    render(
      <FormField label="Fruit" error="Pick one">
        <Select options={fruits} />
      </FormField>,
    );
    expect(combo()).toHaveAttribute("aria-invalid", "true");
    expect(combo()).toHaveAccessibleDescription("Pick one");
    expect(screen.getByLabelText("Fruit")).toBe(combo());
  });

  it("does not get the read-only muted background (buttons match :read-only)", () => {
    render(<Select options={fruits} aria-label="Fruit" />);
    expect(combo().className).not.toMatch(/(^|\s)read-only:bg-muted/);
  });
});
