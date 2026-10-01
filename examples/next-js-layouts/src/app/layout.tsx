import { getLocale } from "next-intl/server";
import { ThemeScript } from "bokoui/react/theme-script";
import { FontScript } from "@/components/appearance/font-script";
import { FontSizeScript } from "@/components/appearance/font-size-script";
import { features } from "@/lib/config/features";
import { getInitialState } from "@/lib/session/initial-state";
import { fontVariableClassName } from "@/lib/fonts/fonts";
import { rootMetadata, rootViewport } from "@/lib/seo";
import { AppProviders } from "@/providers/app-providers";
import { customThemes } from "@/styles/custom-themes";
import "./globals.css";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, initialState] = await Promise.all([getLocale(), getInitialState()]);
  return (
    // suppressHydrationWarning: ThemeScript sets data-theme/data-mode before React hydrates.
    <html
      lang={locale}
      data-theme="flat"
      data-mode="light"
      suppressHydrationWarning
      className={`${fontVariableClassName} h-full antialiased`}
    >
      <head>
        <ThemeScript customThemes={customThemes} />
        <FontSizeScript />
        {features.fontSwitcher ? <FontScript /> : null}
      </head>
      <body className="min-h-full">
        <AppProviders {...initialState} customThemes={customThemes}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
