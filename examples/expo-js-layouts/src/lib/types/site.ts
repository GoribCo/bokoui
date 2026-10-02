export interface FooterLink {
  id: string;
  label: string;
  labelKey?: string;
  href: string;
  external?: boolean;
}

export interface SiteConfig {
  /** Product name shown in the header, titles and footer. */
  name: string;
  /** Name of the company in legal text; usually the product name or the operating company. */
  legalName: string;
  description: string;
  /** Addresses shown on the contact, help and legal pages. */
  contact: { support: string; privacy: string };
  /** First-visit appearance; a visitor's own choice overrides it. `system` follows the device. */
  defaultStyle: string;
  defaultMode: "light" | "dark" | "system";
  /** Product logo; without it the built-in mark is drawn. */
  logo?: { src: string; alt?: string };
  footerLinks: FooterLink[];
}
