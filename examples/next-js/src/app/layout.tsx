import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { ThemeProvider, ThemeSwitcher } from "bokoui/react/theme";
import { ThemeScript } from "bokoui/react/theme-script";
import { ToastProvider } from "bokoui/react/client";
import { customThemes } from "@/styles/custom-themes";
import { CommandMenu } from "@/components/command-menu";
import { PlatformSwitcher } from "@/components/platform-switcher";
import { MobileNav, SideNav } from "@/components/side-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Material style uses Roboto; bokoui does not ship fonts, so the app loads them.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "UI Framework",
  description: "Themeable UI components built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: ThemeScript sets data-theme/data-mode before React hydrates.
    <html
      lang="en"
      data-theme="flat"
      data-mode="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript customThemes={customThemes} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider customThemes={customThemes}>
          <ToastProvider>
            {/* Sticky only from md: on a phone the wrapped header would take a fifth of the screen. */}
            <header className="z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-background/90 px-4 py-3 backdrop-blur sm:px-6 md:sticky md:top-0 md:h-[57px] md:flex-nowrap md:py-0">
              <ThemeSwitcher />
              <div className="flex items-center gap-3">
                <PlatformSwitcher />
                <CommandMenu />
              </div>
            </header>
            <MobileNav />
            <div className="flex flex-1 flex-col md:flex-row">
              <SideNav />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
