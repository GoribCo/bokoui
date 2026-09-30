import type { ReactNode } from "react";

export interface AppShellProps {
  /** Desktop sidebar; shown from the `md` breakpoint up. */
  sidebar: ReactNode;
  header: ReactNode;
  footer?: ReactNode;
  /** Mobile bottom navigation; shown below the `md` breakpoint and reserved in the content area. */
  bottomNav?: ReactNode;
  /** Modal layers (drawer, sheets) kept outside the main landmark. */
  overlays?: ReactNode;
  /** Text of the skip link that jumps to the main content. */
  skipToContentLabel: string;
  children: ReactNode;
}

/** Id of the main landmark, target of the skip link. */
export const MAIN_CONTENT_ID = "main-content";

/**
 * Application frame: sidebar, header, main content and footer. The page itself never scrolls:
 * the sidebar navigation and the content column each scroll on their own (FR-1.2).
 */
export function AppShell({
  sidebar,
  header,
  footer,
  bottomNav,
  overlays,
  skipToContentLabel,
  children,
}: AppShellProps) {
  return (
    // The outer div is the page backdrop; the frame inside stops growing at --shell-max-width so the
    // sidebar and the content stay together on very wide screens.
    <div className="h-dvh overflow-hidden bg-muted text-foreground">
      <div className="mx-auto flex h-full max-w-(--shell-max-width) overflow-hidden bg-background min-[120rem]:border-x min-[120rem]:border-border">
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only z-50 rounded-control bg-surface px-4 py-2 text-nav focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus-ring"
        >
          {skipToContentLabel}
        </a>
        <div className="hidden min-h-0 md:flex">{sidebar}</div>
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          {/* The bottom padding keeps content and footer clear of the fixed bottom navigation and the device safe area. */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
            <main
              id={MAIN_CONTENT_ID}
              tabIndex={-1}
              className="flex-1 outline-none"
            >
              {children}
            </main>
            {footer}
          </div>
        </div>
        {bottomNav ? <div className="md:hidden">{bottomNav}</div> : null}
        {overlays}
      </div>
    </div>
  );
}
