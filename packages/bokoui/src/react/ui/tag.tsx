import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { icons, resolveTone, tagClass, tagRemoveClass, type Action, type Color, type TagStyleProps } from "@/core";
import { Icon } from "../internal/icon";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "onClick">, TagStyleProps {
  color?: Color;
  action?: Action;
  children?: ReactNode;
  /** Makes the label a button (a filter chip). Combine with `pressed` for a toggle. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  pressed?: boolean;
  /** Shows a remove (×) button that calls this. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Default "Remove". */
  removeLabel?: string;
  disabled?: boolean;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { variant, size, color = "primary", action, className, children, onClick, pressed, onRemove, removeLabel = "Remove", disabled, ...props },
  ref,
) {
  const interactive = Boolean(onClick);
  return (
    <span ref={ref} data-tone={resolveTone(color, action)} className={tagClass({ variant, size }, false, className)} {...props}>
      {onClick ? (
        <button
          type="button"
          disabled={disabled}
          aria-pressed={pressed}
          onClick={onClick}
          className={["min-w-0 truncate rounded-sm focus-ring", interactive && "cursor-pointer disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)"].filter(Boolean).join(" ")}
        >
          {children}
        </button>
      ) : (
        <span className="min-w-0 truncate">{children}</span>
      )}
      {onRemove ? (
        <button type="button" disabled={disabled} aria-label={`${removeLabel} ${typeof children === "string" ? children : ""}`.trim()} onClick={onRemove} className={tagRemoveClass}>
          <Icon node={icons.close} />
        </button>
      ) : (
        <span className="w-1" aria-hidden="true" />
      )}
    </span>
  );
});
