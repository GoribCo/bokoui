import type { FooterLink, SiteConfig } from "@/lib/types";

/**
 * Everything that rebrands the app: name, logo, description, URL, contact addresses, first-visit style and
 * mode. Locales live in `lib/i18n/config.ts` and feature flags in `features.ts`; both are re-exported from
 * `lib/config/index.ts`. No other file spells out the product name or an address.
 */

/** The same shell on the other platforms. URLs come from run.sh (fixed ports) or the Pages build. */
const otherLayouts: FooterLink[] = [
  { id: "layouts-vue", label: "Vue layouts", href: process.env.NEXT_PUBLIC_BOKOUI_URL_NUXT_LAYOUTS ?? "http://localhost:3006", external: true },
  { id: "layouts-expo", label: "Expo layouts", href: process.env.NEXT_PUBLIC_BOKOUI_URL_EXPO_LAYOUTS ?? "http://localhost:3005", external: true },
];

export const siteConfig: SiteConfig = {
  name: "Bokoui Layout (NextJs)",
  legalName: "Bokoui Layout (NextJs)",
  description: "A generic application shell for large, multi-organization products.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3004",
  themeColor: { light: "#ffffff", dark: "#0a0a0a" },
  contact: { support: "support@example.com", privacy: "privacy@example.com" },
  defaultStyle: "flat",
  defaultMode: "system",
  footerLinks: [
    { id: "terms", label: "Terms", labelKey: "footer.terms", href: "/legal/terms" },
    { id: "privacy", label: "Privacy", labelKey: "footer.privacy", href: "/legal/privacy" },
    { id: "help", label: "Help", labelKey: "footer.help", href: "/help" },
    { id: "contact", label: "Contact", labelKey: "footer.contact", href: "/contact" },
    ...otherLayouts,
  ],
};
