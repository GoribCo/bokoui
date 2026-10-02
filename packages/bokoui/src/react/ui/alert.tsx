import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import {
  alertBodyClass,
  alertClass,
  alertCloseClass,
  alertIcon,
  alertRole,
  alertTitleClass,
  icons,
  resolveTone,
  type Action,
  type AlertStyleProps,
  type Color,
} from "@/core";
import { Icon } from "../internal/icon";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title">, AlertStyleProps {
  color?: Color;
  /** Semantic intent; picks the tone and the default icon. Without it the alert is neutral with the info icon. */
  action?: Action;
  title?: ReactNode;
  /** Replaces the default icon; `false` hides it. */
  icon?: ReactNode | false;
  /** Shows a close button that calls this. The alert stays mounted; hide it in the handler. */
  onClose?: () => void;
  closeLabel?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant, color = "neutral", action, title, icon, onClose, closeLabel = "Dismiss", children, ...props },
  ref,
) {
  const tone = resolveTone(color, action);
  return (
    <div ref={ref} role={alertRole(tone)} data-tone={tone} className={alertClass({ variant }, className)} {...props}>
      {icon === false ? null : (icon ?? <Icon node={alertIcon(tone)} />)}
      <div className={alertBodyClass}>
        {title && <div className={alertTitleClass}>{title}</div>}
        {children && <div>{children}</div>}
      </div>
      {onClose && (
        <button type="button" aria-label={closeLabel} onClick={onClose} className={alertCloseClass}>
          <Icon node={icons.close} />
        </button>
      )}
    </div>
  );
});
