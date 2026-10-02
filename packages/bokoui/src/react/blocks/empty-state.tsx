import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import {
  emptyStateActionsClass,
  emptyStateClass,
  emptyStateDescriptionClass,
  emptyStateIconClass,
  emptyStateTitleClass,
} from "@/core";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** An icon, shown in a round badge. Decorative: give it `aria-hidden`. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links, e.g. "Create project". */
  actions?: ReactNode;
}

/** What to show when a list, table or search has nothing in it: say why and offer the next step. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, actions, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={emptyStateClass(className)} {...props}>
      {icon && <div className={emptyStateIconClass}>{icon}</div>}
      <p className={emptyStateTitleClass}>{title}</p>
      {description && <p className={emptyStateDescriptionClass}>{description}</p>}
      {actions && <div className={emptyStateActionsClass}>{actions}</div>}
    </div>
  );
});
