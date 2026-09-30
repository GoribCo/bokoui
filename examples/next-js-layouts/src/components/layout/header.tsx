import type { ReactNode } from "react";

export interface HeaderProps {
  /** Mobile hamburger that opens the drawer; hidden from `md` up. */
  menuButton?: ReactNode;
  /** Logo and product name. */
  branding: ReactNode;
  /** Breadcrumb trail; hidden on small screens, where the title is enough. */
  breadcrumbs?: ReactNode;
  search?: ReactNode;
  notifications?: ReactNode;
  /** Right-aligned controls, e.g. the appearance menu. */
  actions?: ReactNode;
}

/** Top bar. Every slot is optional except branding, so a project can drop what it does not need (FR-7.1, FR-7.3). */
export function Header({
  menuButton,
  branding,
  breadcrumbs,
  search,
  notifications,
  actions,
}: HeaderProps) {
  return (
    <header className="shrink-0 border-b border-border bg-background">
      {/* Same max width and side padding as PageContainer, so header, page and footer line up. */}
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
        {menuButton ? <div className="md:hidden">{menuButton}</div> : null}
        <div className="shrink-0">{branding}</div>
        <div className="hidden min-w-0 flex-1 md:block md:ps-4">
          {breadcrumbs}
        </div>
        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2 md:ms-0">
          {search}
          {notifications}
          {actions}
        </div>
      </div>
    </header>
  );
}
