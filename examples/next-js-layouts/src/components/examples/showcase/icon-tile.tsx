import type { ReactNode } from "react";

/** A rounded tile with a soft primary tint that holds an icon; `color` swaps the tint for a flat swatch. */
export function IconTile({ children, color, className = "" }: { children?: ReactNode; color?: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-tone="primary"
      style={color ? { backgroundColor: color } : undefined}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-control ${color ? "" : "bg-(--tone-soft) text-(--tone-ink)"} [&_svg]:size-5 ${className}`}
    >
      {children}
    </span>
  );
}
