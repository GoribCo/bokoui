import type { MenuGroup, MenuItem } from "@/types";

/** Group and chain of items from the top level down to the active item. */
export interface ActiveTrail {
  group: MenuGroup;
  items: MenuItem[];
}

const normalize = (path: string) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

/** Exact match wins; otherwise the longest href that is a path-segment prefix of the pathname. */
function matchScore(href: string, pathname: string): number {
  const target = normalize(href);
  if (target === pathname) return Number.POSITIVE_INFINITY;
  if (target !== "/" && pathname.startsWith(`${target}/`)) return target.length;
  return 0;
}

/** True when `href` is the pathname or one of its path-segment prefixes. */
export function isPathActive(href: string, pathname: string): boolean {
  return matchScore(href, normalize(pathname)) > 0;
}

interface Candidate {
  score: number;
  trail: ActiveTrail;
}

/** Finds the menu item for the current pathname and its parent chain (FR-2.4, FR-7.3). */
export function findActiveTrail(groups: MenuGroup[], pathname: string): ActiveTrail | null {
  const path = normalize(pathname);

  const search = (group: MenuGroup, items: MenuItem[], parents: MenuItem[], best: Candidate | null): Candidate | null => {
    let result = best;
    for (const item of items) {
      const chain = [...parents, item];
      const score = item.href ? matchScore(item.href, path) : 0;
      if (score > 0 && (!result || score > result.score)) result = { score, trail: { group, items: chain } };
      if (item.children) result = search(group, item.children, chain, result);
    }
    return result;
  };

  let best: Candidate | null = null;
  for (const group of groups) best = search(group, group.items, [], best);
  return best?.trail ?? null;
}
