import { getLocale } from "next-intl/server";
import { FontSizeScript } from "@/components/appearance/font-size-script";
import { getInitialState } from "@/lib/session/initial-state";
import { fontVariableClassName } from "@/lib/fonts/fonts";
import { rootMetadata, rootViewport } from "@/lib/seo";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, initialState] = await Promise.all([getLocale(), getInitialState()]);
  return (
    // suppressHydrationWarning: next-themes sets the `dark` class before React hydrates.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontVariableClassName} h-full antialiased`}
    >
      <head>
        <FontSizeScript />
      </head>
      <body className="min-h-full">
        <AppProviders {...initialState}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
