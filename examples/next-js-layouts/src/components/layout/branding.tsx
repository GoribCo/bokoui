import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export interface BrandingProps {
  name: string;
  href?: string;
  /** Defaults to the logo in `siteConfig`; without one the built-in mark is drawn. */
  logo?: { src: string; alt?: string };
}

/** Logo and product name. Set `logo` in `lib/config/site.ts` to use the product's own image. */
export function Branding({ name, href = "/", logo = siteConfig.logo }: BrandingProps) {
  return (
    <Link
      href={href}
      aria-label={name}
      className="flex items-center gap-2 rounded-control focus-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center"
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- the logo is a small static asset of unknown size
        <img src={logo.src} alt={logo.alt ?? ""} className="size-7 shrink-0 object-contain" />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-7 shrink-0 text-primary"
        >
          <rect width="24" height="24" rx="6" fill="currentColor" />
          <path
            d="M8 6.5h4.5a2.75 2.75 0 0 1 0 5.5H8Zm0 5.5h5.5a2.75 2.75 0 0 1 0 5.5H8Z"
            fill="var(--color-primary-foreground)"
          />
        </svg>
      )}
      <span className="hidden truncate text-section font-semibold sm:inline md:group-data-[collapsed]/brand:hidden">
        {name}
      </span>
    </Link>
  );
}
