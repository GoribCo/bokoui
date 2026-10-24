export interface FooterLink {
  id: string;
  label: string;
  labelKey?: string;
  href: string;
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  /** Absolute origin, used for canonical URLs and the sitemap. */
  url: string;
  themeColor: { light: string; dark: string };
  ogImage?: string;
  footerLinks: FooterLink[];
}
