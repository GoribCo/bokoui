import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../form-field";
import { Checkbox, Radio, RadioGroup, Switch } from "./toggle";

describe("Checkbox", () => {
  it("toggles by clicking the control or its label text", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept" />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    await user.click(box);
    expect(box).toBeChecked();
    await user.click(screen.getByText("Accept"));
    expect(box).not.toBeChecked();
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept" />);
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("reports changes and supports controlled use", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Checkbox aria-label="x" checked={on} onChange={(e) => (setOn(e.target.checked), onChange(e.target.checked))} />;
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    render(<Checkbox aria-label="x" disabled />);
    await userEvent.setup().click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("uses the danger tone when invalid", () => {
    const { container } = render(<Checkbox aria-label="x" action="success" invalid />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "danger");
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("merges className on the wrapper and applies size to the control", () => {
    const { container } = render(<Checkbox aria-label="x" className="extra" size="lg" />);
    expect(container.firstElementChild).toHaveClass("extra");
    expect(screen.getByRole("checkbox")).toHaveClass("size-6");
  });

  it("forwards its ref to the input", () => {
    let node: HTMLInputElement | null = null;
    render(<Checkbox aria-label="x" ref={(el) => void (node = el)} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
  });

  it("works inside FormField", () => {
    render(
      <FormField label="Terms" error="Required">
        <Checkbox />
      </FormField>,
    );
    const box = screen.getByLabelText("Terms");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription("Required");
  });
});

describe("Radio", () => {
  it("selects one option of a named group with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Plan">
        <Radio name="plan" value="a" label="A" defaultChecked />
        <Radio name="plan" value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();
  });

  it("lays a group out horizontally", () => {
    render(<RadioGroup aria-label="x" orientation="horizontal" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("flex-row");
  });
});

describe("Switch", () => {
  it("has the switch role and toggles", async () => {
    render(<Switch label="Wi-Fi" />);
    const sw = screen.getByRole("switch", { name: "Wi-Fi" });
    await userEvent.setup().click(sw);
    expect(sw).toBeChecked();
  });

  it("applies the action tone", () => {
    const { container } = render(<Switch aria-label="x" action="success" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "success");
  });
});
