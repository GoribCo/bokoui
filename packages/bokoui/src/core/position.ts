/** Placement of a floating element relative to its anchor. */
export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";
export type Placement = Side | `${Side}-${Exclude<Align, "center">}`;

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PositionInput {
  anchor: Rect;
  floating: { width: number; height: number };
  viewport: { width: number; height: number };
  placement?: Placement;
  /** Gap between anchor and floating element, px. Default 8. */
  offset?: number;
  /** Minimum distance kept from viewport edges, px. Default 8. */
  padding?: number;
}

export interface Position {
  top: number;
  left: number;
  /** The side actually used, after flipping. */
  side: Side;
}

const opposite: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

function split(placement: Placement): [Side, Align] {
  const [side, align = "center"] = placement.split("-") as [Side, Align?];
  return [side, align];
}

function place(side: Side, align: Align, { anchor, floating, offset }: { anchor: Rect; floating: PositionInput["floating"]; offset: number }) {
  let top: number;
  let left: number;
  if (side === "top" || side === "bottom") {
    top = side === "top" ? anchor.top - floating.height - offset : anchor.top + anchor.height + offset;
    left =
      align === "start" ? anchor.left : align === "end" ? anchor.left + anchor.width - floating.width : anchor.left + (anchor.width - floating.width) / 2;
  } else {
    left = side === "left" ? anchor.left - floating.width - offset : anchor.left + anchor.width + offset;
    top =
      align === "start" ? anchor.top : align === "end" ? anchor.top + anchor.height - floating.height : anchor.top + (anchor.height - floating.height) / 2;
  }
  return { top, left };
}

const fits = (side: Side, pos: { top: number; left: number }, f: PositionInput["floating"], v: PositionInput["viewport"], pad: number) =>
  side === "top"
    ? pos.top >= pad
    : side === "bottom"
      ? pos.top + f.height <= v.height - pad
      : side === "left"
        ? pos.left >= pad
        : pos.left + f.width <= v.width - pad;

/**
 * Viewport coordinates (for `position: fixed`) for a floating element. Flips to the opposite
 * side when the requested one does not fit, then clamps into the viewport.
 */
export function computePosition({ anchor, floating, viewport, placement = "bottom", offset = 8, padding = 8 }: PositionInput): Position {
  const [requested, align] = split(placement);
  let side = requested;
  let pos = place(side, align, { anchor, floating, offset });
  if (!fits(side, pos, floating, viewport, padding)) {
    const flipped = place(opposite[side], align, { anchor, floating, offset });
    if (fits(opposite[side], flipped, floating, viewport, padding)) {
      side = opposite[side];
      pos = flipped;
    }
  }
  const clamp = (n: number, size: number, max: number) => Math.min(Math.max(n, padding), Math.max(padding, max - size - padding));
  return { side, top: clamp(pos.top, floating.height, viewport.height), left: clamp(pos.left, floating.width, viewport.width) };
}
