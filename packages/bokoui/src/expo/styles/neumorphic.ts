import type { ThemeEffects } from "../effects";

/** The two shadow colors of a neumorphic style: the dark one falls to the bottom right, the light one to the top left. */
export interface NeumorphicShadows {
  dark: string;
  light: string;
  /** Gradient of the filled (solid) buttons. */
  solid: string;
}

/** Raised shapes (a pair of outer shadows) and sunken ones (the same pair inset), at three sizes. */
export function neumorphicEffects({ dark, light, solid }: NeumorphicShadows): ThemeEffects {
  const raised = (px: number, blur: number) => `${px}px ${px}px ${blur}px ${dark}, -${px}px -${px}px ${blur}px ${light}`;
  const sunken = (px: number, blur: number) => `inset ${px}px ${px}px ${blur}px ${dark}, inset -${px}px -${px}px ${blur}px ${light}`;
  return {
    card: { borderWidth: 0, shadow: raised(9, 20) },
    control: { borderWidth: 0, shadow: raised(5, 11) },
    pressed: { shadow: sunken(4, 9) },
    field: { shadow: sunken(4, 9) },
    solid: { gradient: solid, shadow: raised(6, 14) },
  };
}
