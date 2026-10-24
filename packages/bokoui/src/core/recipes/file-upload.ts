import { cn, type ClassValue } from "../cn";

/** Drop target. It is a `<label>` around a visually hidden file input, so it works with keyboard and click. */
export const dropzoneClass = (className?: ClassValue) =>
  cn(
    "relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-card px-6 py-10 text-center font-ui",
    "border-2 border-dashed border-field-border bg-field text-foreground",
    "transition-colors duration-(--bokoui-duration) ease-ui hover:border-(--tone-ink) hover:bg-(--tone-soft)",
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
    "data-[dragging]:border-(--tone) data-[dragging]:bg-(--tone-soft)",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-(--bokoui-disabled-opacity) aria-invalid:border-(--tone)",
    "[&_svg]:size-8 [&_svg]:text-muted-foreground",
    className,
  );

export const fileListClass = "flex flex-col gap-2";
export const fileItemClass =
  "flex items-center gap-3 rounded-control border-[length:var(--bokoui-border-width)] border-border bg-surface px-3 py-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";
export const fileNameClass = "min-w-0 flex-1 truncate";
export const fileSizeClass = "shrink-0 tabular-nums text-xs text-muted-foreground";
