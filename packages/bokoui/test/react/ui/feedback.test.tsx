import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "@/react/ui";
import { Skeleton, SkeletonText } from "@/react/ui";

describe("Progress", () => {
  it("exposes value, range and text to assistive tech", () => {
    render(<Progress value={40} label="Uploading" />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
    expect(bar.firstElementChild).toHaveStyle({ width: "40%" });
  });

  it("scales to a custom max and clamps out-of-range values", () => {
    const { rerender } = render(<Progress value={5} max={20} aria-label="x" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "25%");
    rerender(<Progress value={500} aria-label="x" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    rerender(<Progress value={-5} aria-label="x" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("is indeterminate without a value: no aria-valuenow, animated bar", () => {
    render(<Progress aria-label="Loading" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.firstElementChild).toHaveClass("animate-bokoui-indeterminate");
    expect(bar.firstElementChild).not.toHaveAttribute("style");
  });

  it("shows the percentage on request, and applies tone and size", () => {
    const { container } = render(<Progress value={70} showValue label="Disk" action="warning" size="lg" />);
    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("data-tone", "warning");
    expect(screen.getByRole("progressbar")).toHaveClass("h-4");
  });
});

describe("Skeleton", () => {
  it("is decorative and pulses (but not with reduced motion)", () => {
    render(<Skeleton data-testid="s" />);
    const s = screen.getByTestId("s");
    expect(s).toHaveAttribute("aria-hidden", "true");
    expect(s).toHaveClass("animate-pulse", "motion-reduce:animate-none");
  });

  it("supports shapes and custom sizing", () => {
    render(<Skeleton shape="circle" className="size-16" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("rounded-full", "size-16");
    expect(screen.getByTestId("s")).not.toHaveClass("size-10");
  });

  it("SkeletonText renders the requested lines with a shorter last one", () => {
    const { container } = render(<SkeletonText lines={4} />);
    const lines = container.querySelectorAll("span");
    expect(lines).toHaveLength(4);
    expect(lines[3]).toHaveClass("w-3/5");
    expect(lines[0]).not.toHaveClass("w-3/5");
  });

  it("does not shorten a single line", () => {
    const { container } = render(<SkeletonText lines={1} />);
    expect(container.querySelector("span")).not.toHaveClass("w-3/5");
  });
});
