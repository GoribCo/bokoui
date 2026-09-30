import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "./form-field";
import { EmptyState } from "./empty-state";
import { Container, Grid, Inline, Stack } from "./layout";
import { Slider } from "./slider";
import { Stepper } from "./stepper";
import { Tag } from "./tag";

describe("Slider", () => {
  it("is a native range input with sensible defaults", () => {
    render(<Slider aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");
  });

  it("reports value changes (arrow/Home/End behavior is native, checked in a real browser)", () => {
    const onChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={50} step={10} onChange={(e) => onChange(e.target.value)} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("50");
    fireEvent.change(slider, { target: { value: "60" } });
    expect(onChange).toHaveBeenLastCalledWith("60");
    expect(slider).toHaveValue("60");
  });

  it("applies tone, invalid state, size and disabled", () => {
    const { rerender } = render(<Slider aria-label="x" action="success" size="lg" />);
    expect(screen.getByRole("slider")).toHaveAttribute("data-tone", "success");
    expect(screen.getByRole("slider")).toHaveClass("h-6");
    rerender(<Slider aria-label="x" invalid action="success" disabled />);
    expect(screen.getByRole("slider")).toHaveAttribute("data-tone", "danger");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("works inside FormField", () => {
    render(<FormField label="Volume" hint="0 to 100"><Slider /></FormField>);
    expect(screen.getByLabelText("Volume")).toHaveAccessibleDescription("0 to 100");
  });
});

describe("Tag", () => {
  it("renders text without controls by default", () => {
    render(<Tag>design</Tag>);
    expect(screen.getByText("design")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("removes through a labelled button", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>design</Tag>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Remove design" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("becomes a toggle button with onClick and reports pressed", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Tag onClick={onClick} pressed={false}>filter</Tag>);
    const button = screen.getByRole("button", { name: "filter" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.setup().click(button);
    expect(onClick).toHaveBeenCalled();
    rerender(<Tag onClick={onClick} pressed>filter</Tag>);
    expect(screen.getByRole("button", { name: "filter" })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not react when disabled and applies tone/variant", async () => {
    const onRemove = vi.fn();
    const { container } = render(<Tag disabled onRemove={onRemove} action="danger" variant="solid">x</Tag>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Remove x" }));
    expect(onRemove).not.toHaveBeenCalled();
    expect(container.firstElementChild).toHaveAttribute("data-tone", "danger");
    expect(container.firstElementChild).toHaveClass("bg-(--tone)");
  });

  it("supports a custom remove label", () => {
    render(<Tag onRemove={() => {}} removeLabel="Quitar">uno</Tag>);
    expect(screen.getByRole("button", { name: "Quitar uno" })).toBeInTheDocument();
  });
});

describe("Stepper", () => {
  const steps = [{ label: "Account", description: "Your details" }, { label: "Plan" }, { label: "Confirm" }];

  it("marks the current step and exposes status to screen readers", () => {
    render(<Stepper steps={steps} current={1} aria-label="Checkout" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[0]).toHaveTextContent("(completed)");
    expect(items[1]).toHaveTextContent("(current step)");
    expect(items[2]).not.toHaveTextContent("(current step)");
    expect(within(items[0]).getByText("Your details")).toBeInTheDocument();
  });

  it("numbers upcoming and current steps and checks completed ones", () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    const items = container.querySelectorAll("li");
    expect(items[0].querySelector("svg")).not.toBeNull();
    expect(items[1]).toHaveTextContent("2");
    expect(items[2]).toHaveTextContent("3");
  });

  it("draws connectors between steps but not after the last", () => {
    const { container } = render(<Stepper steps={steps} current={2} />);
    const items = container.querySelectorAll("li");
    expect(items[0].querySelector('[aria-hidden="true"].absolute')).not.toBeNull();
    expect(items[2].querySelector('[aria-hidden="true"].absolute')).toBeNull();
  });

  it("supports vertical orientation and tones", () => {
    const { container } = render(<Stepper steps={steps} current={0} orientation="vertical" action="success" />);
    expect(container.firstElementChild).toHaveClass("flex-col");
    expect(container.firstElementChild).toHaveAttribute("data-tone", "success");
  });
});

describe("EmptyState", () => {
  it("shows title, description, icon and actions", () => {
    render(<EmptyState icon={<svg data-testid="i" />} title="No projects" description="Create one to get started" actions={<button>New project</button>} />);
    expect(screen.getByText("No projects")).toBeInTheDocument();
    expect(screen.getByText("Create one to get started")).toBeInTheDocument();
    expect(screen.getByTestId("i")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New project" })).toBeInTheDocument();
  });

  it("omits optional parts", () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});

describe("layout primitives", () => {
  it("Stack is a column with the requested gap and alignment", () => {
    render(<Stack gap={6} align="center" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("flex-col", "gap-6", "items-center");
  });

  it("Inline wraps a row and can justify", () => {
    render(<Inline justify="between" gap={2} data-testid="i" />);
    expect(screen.getByTestId("i")).toHaveClass("flex-row", "flex-wrap", "justify-between", "gap-2");
  });

  it("Container centers with a max width", () => {
    render(<Container size="sm" data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveClass("mx-auto", "max-w-2xl");
  });

  it("Grid picks a responsive column preset", () => {
    render(<Grid cols={4} data-testid="g" />);
    expect(screen.getByTestId("g")).toHaveClass("grid", "grid-cols-2", "lg:grid-cols-4");
  });

  it("renders the element given by `as` and merges className", () => {
    render(
      <Stack as="ul" className="extra" aria-label="List">
        <li>one</li>
      </Stack>,
    );
    const list = screen.getByRole("list", { name: "List" });
    expect(list.tagName).toBe("UL");
    expect(list).toHaveClass("extra");
  });
});

