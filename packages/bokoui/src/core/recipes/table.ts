import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

/** Scrolls horizontally on narrow screens instead of breaking the page layout. */
export const tableWrapperClass = (className?: ClassValue) =>
  cn(
    "w-full overflow-x-auto rounded-card border-[length:var(--bokoui-border-width)] border-border bg-surface",
    className,
  );

export const tableVariants = cva(
  [
    "w-full caption-bottom border-collapse text-start font-ui text-sm text-foreground",
    "[&_tr]:border-b-[length:var(--bokoui-border-width)] [&_tr]:border-border [&_tbody_tr:last-child]:border-b-0",
  ],
  {
    variants: {
      striped: { true: "[&_tbody_tr:nth-child(even)]:bg-muted/50", false: "" },
      hoverable: { true: "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-(--tone-soft)", false: "" },
      density: { comfortable: "[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3", compact: "[&_td]:px-3 [&_td]:py-1.5 [&_th]:px-3 [&_th]:py-2" },
    },
    defaultVariants: { striped: false, hoverable: false, density: "comfortable" },
  },
);

export interface TableStyleProps {
  striped?: boolean;
  hoverable?: boolean;
  density?: "comfortable" | "compact";
}

export const tableClass = ({ striped, hoverable, density }: TableStyleProps, className?: ClassValue) =>
  cn(tableVariants({ striped, hoverable, density }), className);

export const tableHeadClass = (className?: ClassValue) =>
  cn("bg-muted/60 text-xs font-medium tracking-wide text-muted-foreground uppercase [&_tr]:border-b", className);

export const tableHeaderCellClass = (className?: ClassValue) =>
  cn("text-start font-medium whitespace-nowrap text-muted-foreground", className);

export const tableCaptionClass = (className?: ClassValue) => cn("px-4 py-3 text-sm text-muted-foreground", className);

/** Numeric columns line up when right-aligned with tabular figures. */
export const tableNumericClass = "text-end tabular-nums";

export const tableSortButtonClass = cn(
  "-mx-1 inline-flex items-center gap-1 rounded-sm px-1 font-medium text-inherit uppercase transition-colors",
  "hover:text-foreground focus-ring [&_svg]:size-3.5",
);
