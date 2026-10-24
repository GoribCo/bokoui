import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import { inlineSvgClass } from "./shared";

export type TabsVariant = "underline" | "pills";
export type TabsOrientation = "horizontal" | "vertical";

/** Selected state comes from `aria-selected`, so no extra prop is needed. */
export const tabListVariants = cva("flex font-ui", {
  variants: {
    variant: {
      underline: "gap-1",
      pills: "gap-1 rounded-control bg-muted p-1",
    },
    orientation: {
      // Scrollable so tabs never wrap on a narrow screen; the scrollbar itself stays hidden (still scrollable
      // by touch/drag/wheel) since a row of tabs is its own obvious affordance and a track underneath it reads
      // as a stray leftover scrollbar, not a feature.
      horizontal: "flex-row items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      vertical: "flex-col items-stretch",
    },
  },
  compoundVariants: [
    { variant: "underline", orientation: "horizontal", className: "border-b-[length:var(--bokoui-border-width)] border-border" },
    { variant: "underline", orientation: "vertical", className: "border-e-[length:var(--bokoui-border-width)] border-border" },
  ],
  defaultVariants: { variant: "underline", orientation: "horizontal" },
});

export const tabVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-ui text-sm [font-weight:var(--bokoui-btn-weight)] [text-transform:var(--bokoui-btn-transform)] [letter-spacing:var(--bokoui-btn-tracking)]",
    "px-3 h-10 pointer-coarse:min-h-11 text-muted-foreground",
    "transition-[background-color,color,border-color] duration-(--bokoui-duration) ease-ui focus-ring",
    "enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
    inlineSvgClass,
  ],
  {
    variants: {
      variant: {
        underline: [
          "-mb-px border-b-2 border-transparent aria-selected:border-(--tone) aria-selected:text-(--tone-ink)",
        ],
        pills: ["rounded-button aria-selected:bg-(--tone) aria-selected:text-(--tone-fg) aria-selected:shadow-button"],
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

export interface TabsStyleProps {
  variant?: TabsVariant;
  orientation?: TabsOrientation;
}

export const tabListClass = ({ variant, orientation }: TabsStyleProps, className?: ClassValue) =>
  cn(tabListVariants({ variant, orientation }), className);

export const tabClass = ({ variant, orientation }: TabsStyleProps, className?: ClassValue) =>
  cn(
    tabVariants({ variant }),
    // Vertical underline tabs put the indicator on the inline-end edge.
    variant !== "pills" && orientation === "vertical" && "-me-px mb-0 justify-start border-b-0 border-e-2 border-e-transparent aria-selected:border-e-(--tone)",
    className,
  );

export const tabsRootClass = (orientation: TabsOrientation = "horizontal", className?: ClassValue) =>
  cn("flex gap-4", orientation === "vertical" ? "flex-row" : "flex-col", className);

export const tabPanelClass = (className?: ClassValue) => cn("font-ui text-foreground focus-ring rounded-control", className);
