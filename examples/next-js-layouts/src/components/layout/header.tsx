import type { ReactNode } from "react";

export interface HeaderProps {
  /** Sidebar rail state; the branding cell follows the sidebar width so the toggle sits on the sidebar edge. */
  collapsed?: boolean;
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
export function Header({ toggle, collapsed = false, branding, title, subtitle, breadcrumbs, search, notifications, actions }: HeaderProps) {
  return (
    <header className="shrink-0 border-b-[length:var(--bokoui-card-border-width,var(--bokoui-border-width))] surface-card">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:px-4 md:ps-0">
        {/* From md up the branding cell is as wide as the sidebar, so the toggle lands on its edge. */}
        <div
          data-collapsed={collapsed || undefined}
          className="group/brand order-2 shrink-0 md:order-1 md:flex md:w-60 md:justify-start md:ps-3 md:transition-[width] md:duration-(--bokoui-duration) md:motion-reduce:transition-none md:data-[collapsed]:w-16 md:data-[collapsed]:justify-center md:data-[collapsed]:ps-0"
        >
          {branding}
        </div>
        {toggle ? <div className="order-1 shrink-0 md:order-2">{toggle}</div> : null}
        {toggle ? <span aria-hidden="true" className="order-3 hidden h-6 w-px shrink-0 bg-border md:block" /> : null}
        <div className="order-4 hidden min-w-0 flex-col leading-tight md:flex">
          <span className="truncate text-nav font-semibold">{title}</span>
          {subtitle ? <span className="truncate text-caption text-muted-foreground">{subtitle}</span> : null}
        </div>
        <div className="order-4 hidden min-w-0 flex-1 md:block md:ps-4">{breadcrumbs}</div>
        <div className="order-4 ms-auto flex shrink-0 items-center gap-1 sm:gap-2 md:ms-0">
          {search}
          {notifications}
          {actions}
        </div>
      </div>
    </header>
  );
}
