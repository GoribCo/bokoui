import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppearanceMenu } from "@/components/appearance/appearance-menu";
import { Branding } from "@/components/layout/branding";
import { features } from "@/config/features";
import { siteConfig } from "@/config/site";

// Sign-in pages stay out of search results (FR-11.5).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Centered, shell-free layout for sign-in and related pages (FR-1.3). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Branding name={siteConfig.name} />
        <AppearanceMenu fontSwitcher={features.fontSwitcher} />
      </header>
      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
