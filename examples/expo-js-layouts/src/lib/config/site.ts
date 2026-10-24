import type { SiteConfig } from "@/lib/types";

/**
 * Everything that rebrands the app: name, logo, description, contact addresses, first-visit style and
 * mode. Locales live in `lib/i18n/config.ts` and feature flags in `features.ts`; both are re-exported from
 * `lib/config/index.ts`. No other file spells out the product name or an address.
 */

export const siteConfig: SiteConfig = {
  name: "Bokoui Layout",
  legalName: "Bokoui Layout",
  description: "A generic application shell for large, multi-organization products.",
  contact: { support: "support@example.com", privacy: "privacy@example.com" },
  defaultStyle: "flat",
  defaultMode: "system",
  footerLinks: [
    { id: "terms", label: "Terms", labelKey: "footer.terms", href: "/legal/terms" },
    { id: "privacy", label: "Privacy", labelKey: "footer.privacy", href: "/legal/privacy" },
    { id: "help", label: "Help", labelKey: "footer.help", href: "/help" },
    { id: "contact", label: "Contact", labelKey: "footer.contact", href: "/contact" },
  ],
};
