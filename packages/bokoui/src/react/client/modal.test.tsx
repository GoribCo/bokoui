import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./modal";

describe("Modal", () => {
  it("opens and closes the native dialog with `open`", () => {
    const { rerender } = render(<Modal open={false} onOpenChange={() => {}} title="Hi">Body</Modal>);
    expect(document.querySelector("dialog")).not.toHaveAttribute("open");
    rerender(<Modal open onOpenChange={() => {}} title="Hi">Body</Modal>);
    expect(document.querySelector("dialog")).toHaveAttribute("open");
    rerender(<Modal open={false} onOpenChange={() => {}} title="Hi">Body</Modal>);
    expect(document.querySelector("dialog")).not.toHaveAttribute("open");
  });

  it("is named by its title and described by its description", () => {
    render(<Modal open onOpenChange={() => {}} title="Delete item" description="This cannot be undone">Body</Modal>);
    const dialog = screen.getByRole("dialog", { name: "Delete item" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone");
  });

  it("renders body and footer", () => {
    render(<Modal open onOpenChange={() => {}} title="T" footer={<button>OK</button>}>Content</Modal>);
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("reports a close from the × button", async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="T">x</Modal>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("reports a close when the backdrop is clicked, but not the content", () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="T"><p>inside</p></Modal>);
    fireEvent.click(screen.getByText("inside"));
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("dialog"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("ignores backdrop clicks when closeOnBackdrop is false", () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} closeOnBackdrop={false} aria-label="x">c</Modal>);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("turns Escape (the cancel event) into onOpenChange(false)", () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="T">x</Modal>);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("locks page scroll only while open", () => {
    const { rerender } = render(<Modal open onOpenChange={() => {}} title="T">x</Modal>);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Modal open={false} onOpenChange={() => {}} title="T">x</Modal>);
    expect(document.body.style.overflow).toBe("");
  });

  it("can hide the close button", () => {
    render(<Modal open onOpenChange={() => {}} title="T" showClose={false}>x</Modal>);
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("only sets display:flex when open, so a closed dialog stays hidden", () => {
    render(<Modal open={false} onOpenChange={() => {}} title="T">x</Modal>);
    const classes = (document.querySelector("dialog") as HTMLDialogElement).className.split(/\s+/);
    expect(classes).toContain("open:flex");
    expect(classes).not.toContain("flex");
  });
});
