import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppearanceMenu } from "@/components/appearance/appearance-menu";
import { AppFrame } from "@/components/layout/app-frame";
import { Branding } from "@/components/layout/branding";
import { features } from "@/lib/config/features";
import { siteConfig } from "@/lib/config/site";

// Sign-in pages stay out of search results (FR-11.5).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Centered, shell-free layout for sign-in and related pages (FR-1.3). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppFrame>
      <header className="shrink-0 border-b border-border">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
          <Branding name={siteConfig.name} />
          <AppearanceMenu fontSwitcher={features.fontSwitcher} />
        </div>
      </header>
      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-8"
      >
        {children}
      </main>
    </AppFrame>
  );
}
