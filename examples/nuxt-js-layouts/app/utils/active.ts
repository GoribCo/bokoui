import type { MenuGroup, MenuItem } from './types'

export interface ActiveTrail {
  group: MenuGroup
  items: MenuItem[]
}

const normalize = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path)

/** Exact match wins; otherwise the longest href that is a path-segment prefix of the pathname. */
function matchScore(href: string, pathname: string): number {
  const target = normalize(href)
  if (target === pathname) return Number.POSITIVE_INFINITY
  if (target !== '/' && pathname.startsWith(`${target}/`)) return target.length
  return 0
}

export const isPathActive = (href: string, pathname: string) => matchScore(href, normalize(pathname)) > 0

/** The menu item for the current pathname and its parent chain. */
export function findActiveTrail(groups: MenuGroup[], pathname: string): ActiveTrail | null {
  const path = normalize(pathname)
  let best: { score: number; trail: ActiveTrail } | null = null
  const search = (group: MenuGroup, items: MenuItem[], parents: MenuItem[]) => {
    for (const item of items) {
      const chain = [...parents, item]
      const score = item.href ? matchScore(item.href, path) : 0
      if (score > 0 && (!best || score > best.score)) best = { score, trail: { group, items: chain } }
      if (item.children) search(group, item.children, chain)
    }
  }
  for (const group of groups) search(group, group.items, [])
  return (best as { trail: ActiveTrail } | null)?.trail ?? null
}
