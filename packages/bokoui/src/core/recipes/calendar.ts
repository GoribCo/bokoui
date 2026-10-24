import { cn, type ClassValue } from "../cn";

export const calendarClass = (className?: ClassValue) =>
  cn("inline-flex w-[19.5rem] max-w-full flex-col gap-2 rounded-card border-[length:var(--bokoui-border-width)] border-border bg-surface p-3 font-ui text-foreground", className);

export const calendarHeaderClass = "flex items-center justify-between gap-2";
export const calendarTitleClass = "text-sm font-medium tabular-nums";
export const calendarNavClass = cn(
  "inline-flex size-8 items-center justify-center rounded-control text-muted-foreground transition-colors",
  "hover:bg-muted hover:text-foreground focus-ring disabled:opacity-(--bokoui-disabled-opacity) pointer-coarse:size-11 [&_svg]:size-4",
);
export const calendarGridClass = "w-full table-fixed border-separate border-spacing-y-0.5 text-center text-sm";
export const calendarWeekdayClass = "pb-1 text-xs font-normal text-muted-foreground";

/** Day button. Selected = `aria-pressed`; today, outside-month and disabled are data attributes set by the binding. */
export const calendarDayClass = cn(
  "mx-auto inline-flex size-9 items-center justify-center rounded-control tabular-nums transition-colors duration-(--bokoui-duration) ease-ui",
  "focus-ring pointer-coarse:size-10 hover:bg-(--tone-soft)",
  "data-[outside]:text-muted-foreground/60",
  "data-[today]:font-semibold data-[today]:ring-1 data-[today]:ring-(--tone-ink) data-[today]:ring-inset",
  "aria-pressed:bg-(--tone) aria-pressed:font-medium aria-pressed:text-(--tone-fg) aria-pressed:hover:bg-(--tone)",
  "data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground/40 data-[disabled]:line-through",
);
