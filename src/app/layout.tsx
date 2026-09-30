import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, ThemeScript, ThemeSwitcher } from "@/components/theme";
import { customThemes } from "@/styles/custom-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript customThemes={customThemes} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider customThemes={customThemes}>
          <header className="sticky top-0 z-10 border-b bg-background/90 px-6 py-3 backdrop-blur">
            <ThemeSwitcher />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
