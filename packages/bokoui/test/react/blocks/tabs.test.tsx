import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tab, TabList, TabPanel, Tabs } from "@/react/blocks";

function Example(props: Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs defaultValue="a" {...props}>
      <TabList aria-label="Sections">
        <Tab value="a">One</Tab>
        <Tab value="b">Two</Tab>
        <Tab value="c" disabled>Three</Tab>
        <Tab value="d">Four</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="d">Panel D</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the default tab's panel and hides the rest", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
    expect(screen.queryByText("Panel B")).not.toBeVisible();
  });

  it("links tabs and panels with aria", () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "One" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("switches on click", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");
  });

  it("uses a roving tabindex", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("tabindex", "-1");
  });

  it("moves with arrow keys, skipping disabled tabs, wrapping, and honoring Home/End", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel D");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("uses up/down when vertical", async () => {
    const user = userEvent.setup();
    render(<Example orientation="vertical" />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
  });

  it("does not select a disabled tab", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Three" }));
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("supports controlled use and reports changes", async () => {
    const onValueChange = vi.fn();
    render(<Example value="a" defaultValue={undefined} onValueChange={onValueChange} />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
  });

  it("applies the tone to the root", () => {
    const { container } = render(<Example action="success" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "success");
  });

  it("throws a clear error outside Tabs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tab value="a">x</Tab>)).toThrow("<Tab> must be used inside <Tabs>");
    spy.mockRestore();
  });
});
