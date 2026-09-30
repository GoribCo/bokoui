"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

/** Left navigation. A scrolling row on small screens, a fixed column from `md`. */
export function SideNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Pages"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-4 py-2 md:sticky md:top-[57px] md:h-[calc(100dvh-57px)] md:w-60 md:flex-col md:overflow-y-auto md:border-r md:border-b-0 md:px-3 md:py-4"
    >
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-tone="primary"
            className="focus-ring shrink-0 rounded-control px-3 py-2 text-sm whitespace-nowrap md:whitespace-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-(--tone-soft) aria-[current=page]:font-medium aria-[current=page]:text-(--tone-ink)"
          >
            {item.label}
            <span className="hidden text-xs font-normal text-muted-foreground md:block">{item.description}</span>
          </Link>
        );
      })}
    </nav>
  );
}
