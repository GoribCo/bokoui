import type { ReactNode } from "react";

export interface HeaderProps {
  /** Sidebar toggle at the far left (collapse on desktop, open the drawer on mobile). */
  toggle?: ReactNode;
  /** Logo and product name. */
  branding: ReactNode;
  /** Current page title. */
  title: ReactNode;
  /** Small line under the title, e.g. the product name. */
  subtitle?: ReactNode;
  /** Breadcrumb trail; hidden on small screens, where the title is enough. */
  breadcrumbs?: ReactNode;
  search?: ReactNode;
  notifications?: ReactNode;
  /** Right-aligned controls, e.g. the display settings button. */
  actions?: ReactNode;
}

/**
 * Top bar across the whole frame; the sidebar starts below it. Every slot is optional
 * except branding and title, so a project can drop what it does not need (FR-7.1, FR-7.3).
 */
export function Header({ toggle, branding, title, subtitle, breadcrumbs, search, notifications, actions }: HeaderProps) {
  return (
    <header className="shrink-0 border-b border-border bg-background">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:px-4">
        {toggle ? (
          <>
            {toggle}
            <span aria-hidden="true" className="h-6 w-px shrink-0 bg-border" />
          </>
        ) : null}
        <div className="shrink-0">{branding}</div>
        <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-border md:block" />
        <div className="hidden min-w-0 flex-col leading-tight md:flex">
          <span className="truncate text-nav font-semibold">{title}</span>
          {subtitle ? <span className="truncate text-caption text-muted-foreground">{subtitle}</span> : null}
        </div>
        <div className="hidden min-w-0 flex-1 md:block md:ps-4">{breadcrumbs}</div>
        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2 md:ms-0">
          {search}
          {notifications}
          {actions}
        </div>
      </div>
    </header>
  );
}
