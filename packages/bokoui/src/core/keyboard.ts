/*
 * Framework-neutral keyboard logic for roving focus (Tabs, Menu, Select). Bindings read the
 * key from the event, ask for the next index, then move focus themselves.
 */

export interface NavOptions {
  /** Which arrows move: horizontal = Left/Right, vertical = Up/Down. */
  orientation?: "horizontal" | "vertical" | "both";
  /** Wrap from the last item to the first and back. Default true. */
  loop?: boolean;
  /** Right-to-left: swaps Left/Right for horizontal movement. */
  rtl?: boolean;
}

/**
 * The index to focus after `key`, or `undefined` when the key is not a navigation key
 * (so the caller should not `preventDefault`). `count` is the number of enabled items.
 */
export function getNextIndex(current: number, count: number, key: string, options: NavOptions = {}): number | undefined {
  const { orientation = "vertical", loop = true, rtl = false } = options;
  if (count <= 0) return undefined;

  const horizontal = orientation !== "vertical";
  const vertical = orientation !== "horizontal";
  let step = 0;
  if (key === "ArrowDown" && vertical) step = 1;
  else if (key === "ArrowUp" && vertical) step = -1;
  else if (key === "ArrowRight" && horizontal) step = rtl ? -1 : 1;
  else if (key === "ArrowLeft" && horizontal) step = rtl ? 1 : -1;
  else if (key === "Home") return 0;
  else if (key === "End") return count - 1;
  else return undefined;

  const next = current + step;
  if (next < 0) return loop ? count - 1 : 0;
  if (next >= count) return loop ? 0 : count - 1;
  return next;
}

/**
 * Typeahead: the index of the next label starting with `query` (case-insensitive), searching
 * after `from` and wrapping. Repeating a single letter cycles through matches. `-1` if none.
 */
export function typeaheadIndex(labels: readonly string[], query: string, from: number): number {
  const q = query.toLowerCase();
  if (!q) return -1;
  const cycle = q.length > 1 && [...q].every((ch) => ch === q[0]);
  const needle = cycle ? q[0] : q;
  // A repeated letter starts after the current item; a longer word may match the current one.
  const start = cycle || q.length === 1 ? from + 1 : Math.max(from, 0);
  for (let i = 0; i < labels.length; i++) {
    const index = (start + i) % labels.length;
    if (labels[index].toLowerCase().startsWith(needle)) return index;
  }
  return -1;
}

/** True for a printable single character (typeahead input), excluding shortcuts. */
export function isTypeaheadKey(event: { key: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean }) {
  return event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey;
}
