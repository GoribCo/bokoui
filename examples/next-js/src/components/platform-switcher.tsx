"use client";

import { usePathname } from "next/navigation";

interface Platform {
  id: "react" | "vue" | "expo";
  label: string;
  url: string;
  /** Pages this demo has. The switcher opens the same page there, or its home if it has none. */
  paths: readonly string[] | "all";
}

// URLs come from run.sh (fixed ports); the defaults match it, so `npm run dev` alone still works.
const platforms: Platform[] = [
  { id: "react", label: "React", url: process.env.NEXT_PUBLIC_BOKOUI_URL_REACT ?? "http://localhost:3001", paths: "all" },
  {
    id: "vue",
    label: "Vue",
    url: process.env.NEXT_PUBLIC_BOKOUI_URL_VUE ?? "http://localhost:3002",
    paths: ["/", "/forms", "/display", "/feedback", "/overlays", "/tabs"],
  },
  { id: "expo", label: "Expo", url: process.env.NEXT_PUBLIC_BOKOUI_URL_EXPO ?? "http://localhost:3000", paths: ["/"] },
];

const CURRENT = "react";

/** Jump to the same page in the React, Vue and Expo demos (they run on fixed ports; see run.sh). */
export function PlatformSwitcher() {
  const pathname = usePathname();
  return (
    <nav aria-label="Platform" data-tone="primary" className="inline-flex items-center gap-1 rounded-control border border-border p-0.5">
      {platforms.map((p) => {
        const current = p.id === CURRENT;
        const hasPage = p.paths === "all" || p.paths.includes(pathname);
        return (
          <a
            key={p.id}
            href={current ? undefined : `${p.url}${hasPage ? pathname : ""}`}
            aria-current={current ? "true" : undefined}
            title={current ? `You are in the ${p.label} demo` : hasPage ? `Open this page in ${p.label}` : `${p.label} demo home (no matching page)`}
            className="focus-ring rounded-[calc(var(--bokoui-radius-control)-2px)] px-2.5 py-1 text-sm text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground aria-[current=true]:bg-(--tone) aria-[current=true]:text-(--tone-fg) aria-[current=true]:hover:bg-(--tone)"
          >
            {p.label}
          </a>
        );
      })}
    </nav>
  );
}
