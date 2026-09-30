/** Brand palette slots. Each theme maps these to concrete colors. */
export const colors = ["primary", "secondary", "accent", "neutral"] as const;
export type Color = (typeof colors)[number];

/** Semantic intents. When set, an action overrides `color`. */
export const actions = ["success", "warning", "danger", "info"] as const;
export type Action = (typeof actions)[number];

export const sizes = ["sm", "md", "lg"] as const;
export type Size = (typeof sizes)[number];

export const variants = ["solid", "outline", "soft", "ghost", "link"] as const;
export type Variant = (typeof variants)[number];

/** The resolved palette entry a component paints itself with. */
export type Tone = Color | Action;

export function resolveTone(color: Color, action?: Action): Tone {
  return action ?? color;
}
