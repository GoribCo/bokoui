import Link from "next/link";
import type { FooterLink } from "@/lib/types";

export interface FooterProps {
  /** Links with labels already resolved (see `resolveLabel`). */
  links: FooterLink[];
  /** Full copyright line, already translated. */
  copyright: string;
  /** Accessible name of the footer's link list. */
  navigationLabel: string;
}

/** Page footer: configurable links and a copyright line. Sits at the end of the scrolling content (FR-8.1). */
export function Footer({ links, copyright, navigationLabel }: FooterProps) {
  return (
    <footer className="border-t-[length:var(--bokoui-card-border-width,var(--bokoui-border-width))] surface-card text-caption text-muted-foreground">
      <div className="flex w-full flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <nav aria-label={navigationLabel}>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {links.map((link) => (
              <li key={link.id}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-control hover:text-foreground hover:underline focus-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="inline-flex items-center rounded-control hover:text-foreground hover:underline focus-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <p>{copyright}</p>
      </div>
    </footer>
  );
}
