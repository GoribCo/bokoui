import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/react/blocks";
import { Drawer } from "@/react/blocks";
import { Popover } from "@/react/blocks";
import { ToastProvider, useToast } from "@/react/ui";

// jsdom hides [popover] elements (no Popover API), so queries into them need `hidden: true`.
const opts = { hidden: true } as const;

function Faq(props: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="a"><AccordionTrigger>One</AccordionTrigger><AccordionContent>Answer one</AccordionContent></AccordionItem>
      <AccordionItem value="b"><AccordionTrigger>Two</AccordionTrigger><AccordionContent>Answer two</AccordionContent></AccordionItem>
      <AccordionItem value="c" disabled><AccordionTrigger>Three</AccordionTrigger><AccordionContent>Answer three</AccordionContent></AccordionItem>
    </Accordion>
  );
}
const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
  it("starts closed, with closed content inert and linked to its trigger", () => {
    render(<Faq />);
    expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(trigger("One").getAttribute("aria-controls")!)!;
    expect(panel.hasAttribute("inert")).toBe(true);
    // No landmark by default: many panels would flood the landmarks list.
    expect(panel).not.toHaveAttribute("role");
    expect(panel).not.toHaveAttribute("aria-labelledby");
  });

  it("makes each panel a labelled region on request", () => {
    render(<Faq regions />);
    const region = document.getElementById(trigger("One").getAttribute("aria-controls")!)!;
    expect(region).toHaveAttribute("role", "region");
    expect(region).toHaveAttribute("aria-labelledby", trigger("One").id);
  });

  it("opens on click and closes again (single, collapsible by default)", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    await user.click(trigger("One"));
    expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(trigger("One").getAttribute("aria-controls")!)!.hasAttribute("inert")).toBe(false);
    await user.click(trigger("One"));
    expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps one open at a time in single mode", async () => {
    const user = userEvent.setup();
    render(<Faq defaultValue="a" />);
    await user.click(trigger("Two"));
    expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
    expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
  });

  it("can forbid closing the open item with collapsible={false}", async () => {
    render(<Faq defaultValue="a" collapsible={false} />);
    await userEvent.setup().click(trigger("One"));
    expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
  });

  it("allows several open in multiple mode", async () => {
    const user = userEvent.setup();
    render(<Faq type="multiple" />);
    await user.click(trigger("One"));
    await user.click(trigger("Two"));
    expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
  });

  it("reports changes: a string when single, an array when multiple", async () => {
    const single = vi.fn();
    const multiple = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(<Faq onValueChange={single} />);
    await user.click(trigger("Two"));
    expect(single).toHaveBeenCalledWith("b");
    await user.click(trigger("Two"));
    expect(single).toHaveBeenLastCalledWith("");
    unmount();
    render(<Faq type="multiple" onValueChange={multiple} />);
    await user.click(trigger("One"));
    await user.click(trigger("Two"));
    expect(multiple).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("supports controlled use", async () => {
    render(<Faq value="a" onValueChange={() => {}} />);
    await userEvent.setup().click(trigger("Two"));
    expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Two")).toHaveAttribute("aria-expanded", "false");
  });

  it("moves focus between triggers with arrows, Home and End, skipping disabled", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    await user.tab();
    expect(trigger("One")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(trigger("Two")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(trigger("One")).toHaveFocus();
    await user.keyboard("{End}");
    expect(trigger("Two")).toHaveFocus();
    await user.keyboard("{Home}");
    expect(trigger("One")).toHaveFocus();
  });

  it("does not open a disabled item", async () => {
    await userEvent.setup().click(render(<Faq />) && trigger("Three"));
    expect(trigger("Three")).toHaveAttribute("aria-expanded", "false");
  });

  it("throws a clear error outside an Accordion", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<AccordionItem value="x">y</AccordionItem>)).toThrow("<AccordionItem> must be used inside <Accordion>");
    spy.mockRestore();
  });
});

describe("Popover", () => {
  const Example = (props: Partial<React.ComponentProps<typeof Popover>>) => (
    <>
      <Popover trigger={<button>Info</button>} aria-label="Details" {...props}>
        <p>Panel text</p>
        <button>Inside</button>
      </Popover>
      <p>outside</p>
    </>
  );

  it("toggles on click and advertises the popup", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const t = screen.getByRole("button", { name: "Info" });
    expect(t).toHaveAttribute("aria-haspopup", "dialog");
    expect(t).toHaveAttribute("aria-expanded", "false");
    await user.click(t);
    // Names are not computed for elements jsdom treats as hidden, so check the attribute.
    expect(screen.getByRole("dialog", opts)).toHaveAttribute("aria-label", "Details");
    expect(screen.getByRole("dialog", opts)).toHaveTextContent("Panel text");
    expect(t).toHaveAttribute("aria-expanded", "true");
    expect(t.getAttribute("aria-controls")).toBe(screen.getByRole("dialog", opts).id);
    await user.click(t);
    expect(screen.queryByRole("dialog", opts)).toBeNull();
  });

  it("moves focus to the first focusable inside", async () => {
    await userEvent.setup().click(render(<Example />) && screen.getByRole("button", { name: "Info" }));
    expect(screen.getByRole("button", { name: "Inside", ...opts })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Info" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", opts)).toBeNull();
    expect(screen.getByRole("button", { name: "Info" })).toHaveFocus();
  });

  it("closes on an outside click", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Info" }));
    await user.click(screen.getByText("outside"));
    expect(screen.queryByRole("dialog", opts)).toBeNull();
  });

  it("supports controlled use", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Example open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Info" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog", opts)).toBeNull();
  });
});

describe("Toast", () => {
  function Demo({ duration = 5000 }: { duration?: number }) {
    const { toast, dismiss } = useToast();
    return (
      <>
        <button onClick={() => toast({ title: "Saved", description: "All good", action: "success", duration })}>Show</button>
        <button onClick={() => toast({ title: "Failed", action: "danger", duration: 0 })}>Fail</button>
        <button onClick={() => dismiss()}>Clear</button>
      </>
    );
  }
  const setup = (duration?: number) => render(<ToastProvider><Demo duration={duration} /></ToastProvider>);

  it("shows a labelled region with the toast, using the right live role", async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.queryByRole("region", opts)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Show" }));
    const region = screen.getByRole("region", opts);
    expect(region).toHaveAttribute("aria-label", "Notifications");
    expect(region).toHaveTextContent("Saved");
    expect(screen.getByRole("status", opts)).toHaveTextContent("All good");
    await user.click(screen.getByRole("button", { name: "Fail" }));
    expect(screen.getByRole("alert", opts)).toHaveTextContent("Failed");
  });

  it("dismisses from its close button and via dismiss()", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Show" }));
    await user.click(screen.getByRole("button", { name: "Dismiss", ...opts }));
    expect(screen.queryByRole("status", opts)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Fail" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.queryByRole("alert", opts)).toBeNull();
  });

  it("removes itself after its duration, and pauses while hovered", async () => {
    vi.useFakeTimers();
    try {
      setup(1000);
      await act(async () => screen.getByRole("button", { name: "Show" }).click());
      const item = screen.getByRole("status", opts).parentElement!;
      await act(async () => item.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
      await act(async () => vi.advanceTimersByTime(3000));
      expect(screen.queryByRole("status", opts)).not.toBeNull();
      await act(async () => item.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })));
      await act(async () => vi.advanceTimersByTime(1000));
      expect(screen.queryByRole("status", opts)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps a duration of 0 until dismissed", async () => {
    vi.useFakeTimers();
    try {
      setup();
      await act(async () => screen.getByRole("button", { name: "Fail" }).click());
      await act(async () => vi.advanceTimersByTime(60_000));
      expect(screen.getByRole("alert", opts)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("caps the stack at max, dropping the oldest", async () => {
    const user = userEvent.setup();
    function Many() {
      const { toast } = useToast();
      return <button onClick={() => toast({ title: `t${Math.random()}`, duration: 0 })}>Add</button>;
    }
    render(<ToastProvider max={2}><Many /></ToastProvider>);
    for (let i = 0; i < 4; i++) await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getAllByRole("status", opts)).toHaveLength(2);
  });

  it("throws a clear error outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Demo />)).toThrow("useToast must be used inside <ToastProvider>");
    spy.mockRestore();
  });
});

describe("Drawer", () => {
  it("is a Modal anchored to an edge", () => {
    render(<Drawer open onOpenChange={() => {}} title="Filters">Body</Drawer>);
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveClass("ms-auto", "h-dvh");
    expect(dialog).not.toHaveClass("rounded-card");
  });

  it("supports left and bottom sheets", () => {
    const { rerender } = render(<Drawer open onOpenChange={() => {}} side="left" aria-label="Nav">x</Drawer>);
    expect(screen.getByRole("dialog")).toHaveClass("me-auto");
    rerender(<Drawer open onOpenChange={() => {}} side="bottom" aria-label="Nav">x</Drawer>);
    expect(screen.getByRole("dialog")).toHaveClass("mt-auto", "max-w-none");
  });

  it("still closes from the × button", async () => {
    const onOpenChange = vi.fn();
    render(<Drawer open onOpenChange={onOpenChange} title="T">x</Drawer>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
