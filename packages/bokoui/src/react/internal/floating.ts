import { useCallback, useLayoutEffect, useState, type RefObject } from "react";
import { computePosition, type Placement, type Side } from "@/core";

export interface FloatingState {
  top: number;
  left: number;
  side: Side;
  /** False until the first measurement, so the element can stay invisible (no flash at 0,0). */
  ready: boolean;
}

const initial: FloatingState = { top: 0, left: 0, side: "bottom", ready: false };

/**
 * Positions `floating` next to `anchor` (viewport coordinates, for `position: fixed`) while
 * `open`, and re-measures on scroll and resize. Uses the pure `computePosition` from core.
 */
export function useFloating(
  anchor: RefObject<HTMLElement | null>,
  floating: RefObject<HTMLElement | null>,
  open: boolean,
  placement: Placement = "bottom",
  offset = 8,
) {
  const [state, setState] = useState(initial);

  const update = useCallback(() => {
    const a = anchor.current;
    const f = floating.current;
    if (!a || !f) return;
    const rect = a.getBoundingClientRect();
    const next = computePosition({
      anchor: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      floating: { width: f.offsetWidth, height: f.offsetHeight },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      placement,
      offset,
    });
    setState((prev) => (prev.ready && prev.top === next.top && prev.left === next.left && prev.side === next.side ? prev : { ...next, ready: true }));
  }, [anchor, floating, placement, offset]);

  useLayoutEffect(() => {
    if (!open) {
      setState(initial);
      return;
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update]);

  return { ...state, update };
}

/** Promotes a `popover="manual"` element to the top layer while `open`, where the browser supports it. */
export function useTopLayer(ref: RefObject<HTMLElement | null>, open: boolean) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !open || typeof el.showPopover !== "function") return;
    try {
      el.showPopover();
    } catch {
      // Already showing.
    }
    return () => {
      try {
        el.hidePopover();
      } catch {
        // Already hidden or removed.
      }
    };
  }, [ref, open]);
}
