import type { ReactNode } from "react";

export interface AppFrameProps {
  /**
   * `true` for the app shell: the frame is exactly the viewport tall and its parts scroll on their own.
   * `false` for page-like layouts (public, sign-in): the frame is at least that tall and the page scrolls.
   */
  fixedHeight?: boolean;
  children: ReactNode;
}

/**
 * The one frame every layout uses: a block capped at `--shell-max-width` and centered on the screen,
 * with the page backdrop visible on both sides of very wide screens. Keeping it in one place is what
 * makes the dashboard, public and sign-in pages look the same.
 */
export function AppFrame({ fixedHeight = false, children }: AppFrameProps) {
  return (
    <div
      className={`bg-[var(--bokoui-page-bg,var(--bokoui-muted))] text-foreground ${fixedHeight ? "h-dvh overflow-hidden" : "min-h-dvh"}`}
    >
      <div
        className={`mx-auto flex max-w-(--shell-max-width) flex-col bg-[var(--bokoui-page-bg,var(--bokoui-bg))] min-[100rem]:border-x min-[100rem]:border-border ${
          fixedHeight ? "h-full overflow-hidden" : "min-h-dvh"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
