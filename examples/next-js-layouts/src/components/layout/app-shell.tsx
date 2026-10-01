import type { ReactNode } from "react";
import { AppFrame } from "./app-frame";

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
 * Application shell: header on top, then sidebar and content below it, plus footer. The page itself never scrolls:
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
    <AppFrame fixedHeight>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 rounded-control bg-surface px-4 py-2 text-nav focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus-ring"
      >
        {skipToContentLabel}
      </a>
      {/* The header spans the whole frame; the sidebar starts below it. */}
      {header}
      <div className="flex min-h-0 flex-1">
        <div className="hidden min-h-0 md:flex">{sidebar}</div>
        {/* The bottom padding keeps content and footer clear of the fixed bottom navigation and the device safe area. */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
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
    </AppFrame>
  );
}
