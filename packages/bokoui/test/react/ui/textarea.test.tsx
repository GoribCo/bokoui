import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormField } from "@/react/ui";
import { Textarea } from "@/react/ui";

describe("Textarea", () => {
  it("renders a multi-line field with 3 rows by default", () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole("textbox", { name: "Bio" })).toHaveAttribute("rows", "3");
  });

  it("accepts typed text", async () => {
    render(<Textarea aria-label="Bio" />);
    await userEvent.setup().type(screen.getByRole("textbox"), "hello");
    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("forces the danger tone while invalid", () => {
    render(<Textarea aria-label="Bio" invalid action="success" />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveAttribute("data-tone", "danger");
    expect(field).toHaveAttribute("aria-invalid", "true");
  });

  it("applies the action tone otherwise", () => {
    render(<Textarea aria-label="Bio" action="success" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-tone", "success");
  });

  it("maps resize to a class and merges className", () => {
    render(<Textarea aria-label="Bio" resize="none" className="extra" />);
    expect(screen.getByRole("textbox")).toHaveClass("resize-none", "extra");
  });

  it("is disabled", () => {
    render(<Textarea aria-label="Bio" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards its ref", () => {
    let node: HTMLTextAreaElement | null = null;
    render(<Textarea aria-label="Bio" ref={(el) => void (node = el)} />);
    expect(node).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("works inside FormField", () => {
    render(
      <FormField label="Bio" error="Too short">
        <Textarea />
      </FormField>,
    );
    const field = screen.getByLabelText("Bio");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Too short");
  });
});
