import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ListRowProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  /** Right side: a value or a switch. A chevron shows for a row with `href` and no `end`. */
  end?: ReactNode;
  href?: string;
}

/** One row of a settings or list card: icon tile, title with optional subtitle, end content or a chevron. */
export function ListRow({ icon, title, subtitle, end, href }: ListRowProps) {
  const content = (
    <>
      {icon}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{title}</span>
        {subtitle ? <span className="truncate text-caption text-muted-foreground">{subtitle}</span> : null}
      </span>
      {end}
      {href && !end ? <ChevronRight aria-hidden="true" className="size-4.5 shrink-0 text-muted-foreground" /> : null}
    </>
  );
  const className = "flex min-h-14 w-full items-center gap-3 px-3 py-2 text-start";
  return href ? (
    <Link href={href} prefetch={false} className={`${className} hover:bg-muted focus-ring`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
