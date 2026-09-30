"use client";

import { useState, type SyntheticEvent } from "react";

/**
 * Tells whether the `[data-menu-label]` text inside the hovered or focused row is cut off by an ellipsis.
 * Measured on hover/focus (before a tooltip's delay elapses), so idle rows cost nothing.
 */
export function useTruncatedLabel() {
  const [truncated, setTruncated] = useState(false);
  const measure = (event: SyntheticEvent<HTMLElement>) => {
    const text = event.currentTarget.querySelector<HTMLElement>("[data-menu-label]");
    setTruncated(Boolean(text && text.scrollWidth > text.clientWidth));
  };
  return { truncated, measure };
}
