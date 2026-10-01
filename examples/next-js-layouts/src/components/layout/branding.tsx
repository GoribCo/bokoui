import Link from "next/link";

export interface BrandingProps {
  name: string;
  href?: string;
}

/** Logo mark and product name. Replace the mark with the product's own logo. */
export function Branding({ name, href = "/" }: BrandingProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-control focus-ring"
    >
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
      <span className="hidden truncate text-section font-semibold sm:inline">
        {name}
      </span>
    </Link>
  );
}
