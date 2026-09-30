import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Bokoui Layout",
  description: "A generic application shell for large, multi-organization products.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3003",
  themeColor: { light: "#ffffff", dark: "#0a0a0a" },
  footerLinks: [
    { id: "terms", label: "Terms", labelKey: "footer.terms", href: "/legal/terms" },
    { id: "privacy", label: "Privacy", labelKey: "footer.privacy", href: "/legal/privacy" },
    { id: "help", label: "Help", labelKey: "footer.help", href: "/help" },
    { id: "contact", label: "Contact", labelKey: "footer.contact", href: "/contact" },
  ],
};
