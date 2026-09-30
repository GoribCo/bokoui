import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../ui/form-field";
import { Calendar } from "./calendar";
import { CommandPalette } from "./command-palette";
import { Combobox } from "./combobox";
import { DatePicker } from "./date-picker";
import { FileUpload } from "./file-upload";
import { Rating } from "./rating";

// jsdom hides [popover] elements (no Popover API), so queries into them need `hidden: true`.
const opts = { hidden: true } as const;

describe("Rating", () => {
  it("is a radio group of stars with a roving tab stop", () => {
    render(<Rating aria-label="Quality" defaultValue={3} />);
    expect(screen.getByRole("radiogroup", { name: "Quality" })).toBeInTheDocument();
    const stars = screen.getAllByRole("radio");
    expect(stars).toHaveLength(5);
    expect(stars[2]).toHaveAttribute("aria-checked", "true");
    expect(stars[2]).toHaveAttribute("tabindex", "0");
    expect(stars[0]).toHaveAttribute("tabindex", "-1");
    expect(stars[0]).toHaveAccessibleName("1 star");
    expect(stars[1]).toHaveAccessibleName("2 stars");
  });

  it("selects by click, and clicking the selected star clears it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Rating aria-label="Quality" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "4 stars" }));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    expect(screen.getByRole("radio", { name: "4 stars" })).toHaveAttribute("aria-checked", "true");
    await user.click(screen.getByRole("radio", { name: "4 stars" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("changes with arrows, Home, End and 0", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Rating aria-label="Quality" defaultValue={3} onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    await user.keyboard("0");
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("supports controlled use and a custom max", async () => {
    render(<Rating aria-label="x" value={2} max={10} onValueChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(10);
    await userEvent.setup().click(screen.getByRole("radio", { name: "7 stars" }));
    expect(screen.getByRole("radio", { name: "2 stars" })).toHaveAttribute("aria-checked", "true");
  });

  it("read-only is an image with a text alternative and no controls", () => {
    render(<Rating readOnly value={3} aria-label="Average" />);
    expect(screen.getByRole("img", { name: "Average: 3 out of 5" })).toBeInTheDocument();
    expect(screen.queryByRole("radio")).toBeNull();
  });
});

describe("Combobox", () => {
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "avocado", label: "Avocado", disabled: true },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
  ];
  const box = () => screen.getByRole("combobox");

  it("shows all options on open, then filters as you type", async () => {
    const user = userEvent.setup();
    render(<Combobox options={fruits} aria-label="Fruit" />);
    await user.click(box());
    expect(screen.getAllByRole("option", opts)).toHaveLength(4);
    await user.keyboard("bl");
    const options = screen.getAllByRole("option", opts);
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Blueberry");
    expect(box()).toHaveAttribute("aria-activedescendant", options[0].id);
  });

  it("chooses with Enter, fills the text, closes, and reports the value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox options={fruits} aria-label="Fruit" onValueChange={onValueChange} name="fruit" />);
    await user.click(box());
    await user.keyboard("ban{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(box()).toHaveValue("Banana");
    expect(screen.queryByRole("listbox", opts)).toBeNull();
    expect(document.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue("banana");
  });

  it("navigates with arrows, skipping disabled options", async () => {
    const user = userEvent.setup();
    render(<Combobox options={fruits} aria-label="Fruit" />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(box()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Apple", ...opts }).id);
    await user.keyboard("{ArrowDown}");
    expect(box()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Banana", ...opts }).id);
  });

  it("shows an empty message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Combobox options={fruits} aria-label="Fruit" emptyText="Nothing found" />);
    await user.click(box());
    await user.keyboard("zzz");
    expect(screen.queryAllByRole("option", opts)).toHaveLength(0);
    expect(screen.getByText("Nothing found")).toBeInTheDocument();
  });

  it("restores the chosen text on Escape and when leaving the field", async () => {
    const user = userEvent.setup();
    render(<><Combobox options={fruits} aria-label="Fruit" defaultValue="apple" /><button>other</button></>);
    expect(box()).toHaveValue("Apple");
    await user.click(box());
    await user.keyboard("{Control>}a{/Control}xyz");
    await user.keyboard("{Escape}");
    expect(box()).toHaveValue("Apple");
    await user.keyboard("q");
    await user.click(screen.getByRole("button", { name: "other" }));
    expect(box()).toHaveValue("Apple");
  });

  it("does not choose a disabled option and closes on outside click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox options={fruits} aria-label="Fruit" onValueChange={onValueChange} />);
    await user.click(box());
    await user.click(screen.getByRole("option", { name: "Avocado", ...opts }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.tab();
    expect(screen.queryByRole("listbox", opts)).toBeNull();
  });

  it("marks invalid and works inside FormField", () => {
    render(<FormField label="Fruit" error="Pick one"><Combobox options={fruits} /></FormField>);
    expect(box()).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Fruit")).toBe(box());
    expect(box()).toHaveAccessibleDescription("Pick one");
  });
});

const D = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe("Calendar", () => {
  const sept = D(2026, 9, 15);
  const dayBtn = (label: RegExp | string) => screen.getByRole("button", { name: label });

  it("shows the month of the value with weekday headers and 42 days", () => {
    render(<Calendar value={sept} locale="en-US" />);
    expect(screen.getByText("September 2026")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Sun");
    expect(within(screen.getByRole("table")).getAllByRole("button")).toHaveLength(42);
  });

  it("starts the week on the requested day", () => {
    render(<Calendar value={sept} locale="en-US" weekStartsOn={1} />);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Mon");
  });

  it("marks the selected day as pressed with a full-date name", () => {
    render(<Calendar value={sept} locale="en-US" />);
    expect(dayBtn("Tuesday, September 15, 2026")).toHaveAttribute("aria-pressed", "true");
    expect(dayBtn("Wednesday, September 16, 2026")).toHaveAttribute("aria-pressed", "false");
  });

  it("selects on click (uncontrolled) and reports the date", async () => {
    const onValueChange = vi.fn();
    render(<Calendar defaultValue={sept} locale="en-US" onValueChange={onValueChange} />);
    await userEvent.setup().click(dayBtn("Thursday, September 17, 2026"));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(17);
    expect(dayBtn("Thursday, September 17, 2026")).toHaveAttribute("aria-pressed", "true");
  });

  it("stays put when controlled", async () => {
    render(<Calendar value={sept} locale="en-US" onValueChange={() => {}} />);
    await userEvent.setup().click(dayBtn("Thursday, September 17, 2026"));
    expect(dayBtn("Tuesday, September 15, 2026")).toHaveAttribute("aria-pressed", "true");
  });

  it("has one tab stop and moves focus with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Calendar value={sept} locale="en-US" />);
    const stops = within(screen.getByRole("table")).getAllByRole("button").filter((b) => b.getAttribute("tabindex") === "0");
    expect(stops).toHaveLength(1);
    stops[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(dayBtn("Wednesday, September 16, 2026")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(dayBtn("Wednesday, September 23, 2026")).toHaveFocus();
    await user.keyboard("{Home}");
    expect(dayBtn("Sunday, September 20, 2026")).toHaveFocus();
    await user.keyboard("{End}");
    expect(dayBtn("Saturday, September 26, 2026")).toHaveFocus();
  });

  it("changes month by keyboard across a boundary, and with PageDown", async () => {
    const user = userEvent.setup();
    render(<Calendar value={D(2026, 9, 30)} locale="en-US" />);
    dayBtn("Wednesday, September 30, 2026").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("October 2026")).toBeInTheDocument();
    expect(dayBtn("Thursday, October 1, 2026")).toHaveFocus();
    await user.keyboard("{PageDown}");
    expect(screen.getByText("November 2026")).toBeInTheDocument();
  });

  it("navigates months with the header buttons", async () => {
    const user = userEvent.setup();
    render(<Calendar value={sept} locale="en-US" />);
    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("October 2026")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous month" }));
    await user.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByText("August 2026")).toBeInTheDocument();
  });

  it("disables days outside min/max and by predicate, and does not select them", async () => {
    const onValueChange = vi.fn();
    render(<Calendar value={sept} locale="en-US" min={D(2026, 9, 10)} max={D(2026, 9, 20)} isDisabled={(d) => d.getDay() === 0} onValueChange={onValueChange} />);
    expect(dayBtn("Wednesday, September 9, 2026")).toHaveAttribute("aria-disabled", "true");
    expect(dayBtn("Sunday, September 13, 2026")).toHaveAttribute("aria-disabled", "true");
    expect(dayBtn("Monday, September 14, 2026")).not.toHaveAttribute("aria-disabled");
    await userEvent.setup().click(dayBtn("Wednesday, September 9, 2026"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disables the month buttons at the range ends", () => {
    render(<Calendar value={sept} locale="en-US" min={D(2026, 9, 1)} max={D(2026, 9, 30)} />);
    expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });

  it("marks outside-month days for styling", () => {
    render(<Calendar value={sept} locale="en-US" />);
    expect(dayBtn("Sunday, August 30, 2026")).toHaveAttribute("data-outside");
    expect(dayBtn("Tuesday, September 15, 2026")).not.toHaveAttribute("data-outside");
  });

  it("marks today after mount", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(D(2026, 9, 15));
    try {
      render(<Calendar value={D(2026, 9, 1)} locale="en-US" />);
      expect(dayBtn("Tuesday, September 15, 2026")).toHaveAttribute("aria-current", "date");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("DatePicker", () => {
  const trigger = () => screen.getByRole("button", { name: /Pick a date|\d{4}/ });

  it("shows the placeholder, then the chosen date in the locale format", async () => {
    const user = userEvent.setup();
    render(<DatePicker locale="en-US" defaultValue={null} />);
    expect(trigger()).toHaveTextContent("Pick a date");
    await user.click(trigger());
    expect(screen.getByRole("dialog", opts)).toBeInTheDocument();
    await act(async () => {}); // let the calendar learn today's date
    const day = within(screen.getByRole("dialog", opts)).getAllByRole("button", opts).find((b) => /, /.test(b.getAttribute("aria-label") ?? ""))!;
    await user.click(day);
    expect(screen.queryByRole("dialog", opts)).toBeNull();
    expect(trigger()).toHaveTextContent(/\w+ \d{1,2}, \d{4}/);
  });

  it("opens on the value's month, closes when a day is picked, and reports it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker locale="en-US" defaultValue={D(2026, 9, 15)} onValueChange={onValueChange} name="when" />);
    expect(trigger()).toHaveTextContent("September 15, 2026");
    await user.click(trigger());
    expect(screen.getByText("September 2026")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Friday, September 18, 2026", ...opts }));
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(18);
    expect(trigger()).toHaveTextContent("September 18, 2026");
    expect(document.querySelector('input[type="hidden"][name="when"]')).toHaveValue("2026-09-18");
  });

  it("focuses the selected day when it opens, and Escape returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<DatePicker locale="en-US" defaultValue={D(2026, 9, 15)} />);
    await user.click(trigger());
    expect(screen.getByRole("button", { name: "Tuesday, September 15, 2026", ...opts })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", opts)).toBeNull();
    expect(trigger()).toHaveFocus();
  });

  it("respects min/max and works inside FormField", async () => {
    const user = userEvent.setup();
    render(
      <FormField label="Due date" error="Required">
        <DatePicker locale="en-US" defaultValue={D(2026, 9, 15)} min={D(2026, 9, 10)} />
      </FormField>,
    );
    expect(screen.getByLabelText("Due date")).toHaveAttribute("aria-invalid", "true");
    await user.click(screen.getByLabelText("Due date"));
    expect(screen.getByRole("button", { name: "Tuesday, September 8, 2026", ...opts })).toHaveAttribute("aria-disabled", "true");
  });
});

const file = (name: string, type: string, size = 100) => new File([new Uint8Array(size)], name, { type });

describe("FileUpload", () => {
  const input = (c: HTMLElement) => c.querySelector('input[type="file"]') as HTMLInputElement;

  it("is a labelled drop zone around a file input", () => {
    const { container } = render(<FileUpload label="Upload a photo" />);
    expect(screen.getByLabelText("Upload a photo")).toBe(input(container));
  });

  it("lists chosen files with size and removes them", async () => {
    const onFilesChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<FileUpload multiple onFilesChange={onFilesChange} />);
    await user.upload(input(container), [file("a.png", "image/png", 2048), file("b.png", "image/png", 10)]);
    const list = screen.getByRole("list", { name: "Selected files" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(list).toHaveTextContent("a.png");
    expect(list).toHaveTextContent("2 KB");
    expect(onFilesChange.mock.lastCall![0]).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Remove a.png" }));
    expect(screen.queryByText("a.png")).toBeNull();
    expect(onFilesChange.mock.lastCall![0]).toHaveLength(1);
  });

  it("keeps only one file unless multiple", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload />);
    await user.upload(input(container), file("a.png", "image/png"));
    await user.upload(input(container), file("b.png", "image/png"));
    expect(screen.queryByText("a.png")).toBeNull();
    expect(screen.getByText("b.png")).toBeInTheDocument();
  });

  it("rejects wrong types, oversize files and excess files with a message", async () => {
    const onReject = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    const { container } = render(<FileUpload multiple accept="image/*" maxSize={1000} maxFiles={1} onReject={onReject} />);
    await user.upload(input(container), [file("doc.pdf", "application/pdf"), file("big.png", "image/png", 5000), file("ok.png", "image/png"), file("two.png", "image/png")]);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("doc.pdf: this file type is not allowed");
    expect(alert).toHaveTextContent("big.png: larger than 1000 B");
    expect(alert).toHaveTextContent("two.png: only 1 file allowed");
    expect(screen.getByRole("list", { name: "Selected files" })).toHaveTextContent("ok.png");
    expect(onReject.mock.calls[0][0].map((r: { reason: string }) => r.reason)).toEqual(["type", "size", "count"]);
    expect(input(container)).toHaveAttribute("aria-describedby", alert.id);
  });

  it("accepts dropped files and shows the dragging state", () => {
    const { container } = render(<FileUpload />);
    const zone = container.querySelector("label")!;
    fireEvent.dragEnter(zone);
    expect(zone).toHaveAttribute("data-dragging");
    fireEvent.drop(zone, { dataTransfer: { files: [file("drop.png", "image/png")] } });
    expect(zone).not.toHaveAttribute("data-dragging");
    expect(screen.getByText("drop.png")).toBeInTheDocument();
  });

  it("ignores drops when disabled", () => {
    const { container } = render(<FileUpload disabled />);
    fireEvent.drop(container.querySelector("label")!, { dataTransfer: { files: [file("drop.png", "image/png")] } });
    expect(screen.queryByText("drop.png")).toBeNull();
  });
});

describe("CommandPalette", () => {
  const run = vi.fn();
  const groups = [
    { heading: "Pages", commands: [{ id: "home", label: "Go to Home", onSelect: () => run("home") }, { id: "docs", label: "Open docs", keywords: "documentation help", onSelect: () => run("docs") }] },
    { heading: "Actions", commands: [{ id: "theme", label: "Toggle theme", hint: "T", onSelect: () => run("theme") }, { id: "locked", label: "Delete everything", disabled: true, onSelect: () => run("locked") }] },
  ];
  const Host = ({ initial = true }: { initial?: boolean }) => {
    const [open, setOpen] = (require("react") as typeof import("react")).useState(initial);
    return <CommandPalette open={open} onOpenChange={setOpen} groups={groups} hotkey="k" />;
  };
  const search = () => screen.getAllByRole("combobox")[0];

  it("lists grouped commands and labels the dialog", () => {
    run.mockClear();
    render(<Host />);
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    expect(screen.getAllByRole("group").map((g) => g.getAttribute("aria-label"))).toEqual(["Pages", "Actions"]);
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(search()).toHaveFocus();
  });

  it("filters by label and keywords, and shows an empty message", async () => {
    const user = userEvent.setup();
    render(<Host />);
    await user.keyboard("help");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option")).toHaveTextContent("Open docs");
    await user.keyboard("zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("moves with arrows (skipping disabled), runs with Enter, and closes", async () => {
    run.mockClear();
    const user = userEvent.setup();
    render(<Host />);
    expect(search()).toHaveAttribute("aria-activedescendant", screen.getAllByRole("option")[0].id);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getAllByRole("option")[2]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(run).toHaveBeenCalledWith("docs");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("runs a command on click but never a disabled one", async () => {
    run.mockClear();
    const user = userEvent.setup();
    render(<Host />);
    await user.click(screen.getByRole("option", { name: /Delete everything/ }));
    expect(run).not.toHaveBeenCalled();
    await user.click(screen.getByRole("option", { name: /Toggle theme/ }));
    expect(run).toHaveBeenCalledWith("theme");
  });

  it("toggles with Ctrl/Cmd+K and resets the search each time", async () => {
    const user = userEvent.setup();
    render(<Host initial={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("home");
    // jsdom does not turn Escape into the dialog's cancel event; a browser does.
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(search()).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });
});
