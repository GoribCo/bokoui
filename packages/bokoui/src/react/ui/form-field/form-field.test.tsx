import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { describedBy, formFieldIds } from "@/core";
import { Input } from "../input";
import { FormField } from "./form-field";
import { Label } from "./label";

describe("core helpers", () => {
  const ids = formFieldIds("email");

  it("derives ids from a base", () => {
    expect(ids).toEqual({ control: "email", hint: "email-hint", error: "email-error" });
  });

  it("describes with error and hint, or nothing", () => {
    expect(describedBy(ids, { hint: true, error: true })).toBe("email-hint email-error");
    expect(describedBy(ids, {})).toBeUndefined();
  });
});

describe("Label", () => {
  it("marks required visually only", () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("FormField", () => {
  it("associates the label with the control", () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });

  it("wires hint into aria-describedby", () => {
    render(
      <FormField label="Email" hint="We never share it">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("We never share it");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the control invalid and announces the error", () => {
    render(
      <FormField label="Email" hint="Hint" error="Required">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Hint Required");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("passes required and disabled to the control", () => {
    render(
      <FormField label="Email" required disabled>
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it("uses a caller-provided id", () => {
    render(
      <FormField label="Email" id="custom">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "custom");
  });
});
