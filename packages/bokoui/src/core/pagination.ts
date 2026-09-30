export type PageItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Page numbers to show, with ellipses for the gaps. Always shows the first and last page, the
 * current page and `siblings` pages either side. The length is constant (siblings * 2 + 5)
 * once there are enough pages, so the control does not jump in width while paging.
 *
 *   getPageRange(1, 10)  -> 1 2 3 4 5 … 10
 *   getPageRange(5, 10)  -> 1 … 4 5 6 … 10
 *   getPageRange(10, 10) -> 1 … 6 7 8 9 10
 */
export function getPageRange(page: number, pageCount: number, siblings = 1): PageItem[] {
  const count = Math.max(0, Math.floor(pageCount));
  const slots = siblings * 2 + 5;
  const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  if (count <= slots) return range(1, count);

  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const edge = slots - 2; // pages shown next to an ellipsis when the current page is near an end
  const showStartGap = current - siblings > 3;
  const showEndGap = current + siblings < count - 2;

  if (!showStartGap) return [...range(1, edge), "ellipsis-end", count];
  if (!showEndGap) return [1, "ellipsis-start", ...range(count - edge + 1, count)];
  return [1, "ellipsis-start", ...range(current - siblings, current + siblings), "ellipsis-end", count];
}
