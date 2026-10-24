import { act, render, screen } from "@testing-library/react";

// jsdom hides [popover] elements (no Popover API), so tooltip queries need `hidden: true`.
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "@/react/ui";

afterEach(() => vi.useRealTimers());

describe("Tooltip", () => {
  it("is hidden until the trigger is hovered, after the delay", async () => {
    vi.useFakeTimers();
    render(<Tooltip content="Save file"><button>Save</button></Tooltip>);
    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
    const button = screen.getByRole("button");
    await act(async () => {
      button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveTextContent("Save file");
  });

  it("shows immediately on keyboard focus and describes the trigger", async () => {
    render(<Tooltip content="Save file"><button>Save</button></Tooltip>);
    await userEvent.setup().tab();
    const tip = screen.getByRole("tooltip", { hidden: true });
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Save file");
    expect(tip.id).toBeTruthy();
  });

  it("hides on blur and on Escape", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Tip"><button>Save</button></Tooltip>);
    await user.tab();
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
    await user.tab({ shift: true });
    await user.tab();
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  });

  it("does not show when disabled", async () => {
    render(<Tooltip content="Tip" disabled><button>Save</button></Tooltip>);
    await userEvent.setup().tab();
    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  });

  it("keeps the trigger's own handlers and aria-describedby", async () => {
    const onFocus = vi.fn();
    render(
      <>
        <span id="other">Other</span>
        <Tooltip content="Tip"><button onFocus={onFocus} aria-describedby="other">Save</button></Tooltip>
      </>,
    );
    await userEvent.setup().tab();
    expect(onFocus).toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Other Tip");
  });
});
