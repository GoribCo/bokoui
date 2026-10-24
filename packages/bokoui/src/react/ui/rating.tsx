"use client";

import { forwardRef, useState, type HTMLAttributes, type KeyboardEvent } from "react";
import { icons, ratingClass, ratingEmptyClass, ratingStarClass, resolveTone, cn, type Action, type Color, type RatingStyleProps } from "@/core";
import { Icon } from "../internal/icon";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">, RatingStyleProps {
  /** Selected stars (controlled). 0 = none. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  /** Display only: rendered as an image with a text alternative. */
  readOnly?: boolean;
  color?: Color;
  action?: Action;
  /** Accessible name, e.g. "Rate this product". */
  "aria-label"?: string;
}

/**
 * Star rating. Interactive it is a radio group (arrows move and select, Home/End jump);
 * read-only it is a single image described as "3 out of 5". Hover previews the value.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { value, defaultValue = 0, onValueChange, max = 5, readOnly = false, size, color = "primary", action, className, "aria-label": label = "Rating", ...props },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const current = value ?? inner;
  const shown = hover ?? current;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  const set = (next: number) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const star = (n: number) => <Icon key={n} node={icons.star} className={n <= shown ? undefined : ratingEmptyClass} fill={n <= shown ? "currentColor" : "none"} />;

  if (readOnly) {
    return (
      <div ref={ref} role="img" aria-label={`${label}: ${current} out of ${max}`} data-tone={resolveTone(color, action)} className={ratingClass({ size }, className)} {...props}>
        {stars.map((n) => (
          <Icon key={n} node={icons.star} className={n <= current ? undefined : ratingEmptyClass} fill={n <= current ? "currentColor" : "none"} />
        ))}
      </div>
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(max, (current || 0) + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(1, (current || 1) - 1);
    else if (event.key === "Home") next = 1;
    else if (event.key === "End") next = max;
    else if (event.key === "0" || event.key === "Delete" || event.key === "Backspace") next = 0;
    if (next === undefined) return;
    event.preventDefault();
    set(next);
    // Move DOM focus with the selection so the roving tabindex follows. React clears
    // event.currentTarget once the handler returns, so keep the element.
    const group = event.currentTarget;
    requestAnimationFrame(() => group.querySelector<HTMLElement>('[tabindex="0"]')?.focus());
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      data-tone={resolveTone(color, action)}
      className={ratingClass({ size }, className)}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
      {...props}
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === current}
          aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
          // Roving tabindex: the selected star (or the first, when none) is the tab stop.
          tabIndex={n === (current || 1) ? 0 : -1}
          className={cn(ratingStarClass)}
          onClick={() => set(n === current ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(null)}
        >
          {star(n)}
        </button>
      ))}
    </div>
  );
});
