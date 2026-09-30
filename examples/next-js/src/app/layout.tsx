import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { ThemeProvider, ThemeSwitcher } from "bokoui/react/theme";
import { ThemeScript } from "bokoui/react/theme-script";
import { customThemes } from "@/styles/custom-themes";
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
          <header className="sticky top-0 z-10 border-b bg-background/90 px-6 py-3 backdrop-blur">
            <ThemeSwitcher />
          </header>
          <MobileNav />
          <div className="flex flex-1 flex-col md:flex-row">
            <SideNav />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
