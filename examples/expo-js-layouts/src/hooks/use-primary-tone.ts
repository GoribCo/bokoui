import { mix, useTheme, withAlpha } from "bokoui/expo";
import { useMemo } from "react";

export interface PrimaryTone {
  base: string;
  /** Translucent fill for the active row. */
  soft: string;
  /** Readable text color on the soft fill. */
  ink: string;
}

/** The primary color's fill and ink, derived from the tokens the same way bokoui paints its own components. */
export function usePrimaryTone(): PrimaryTone {
  const { tokens } = useTheme();
  return useMemo(
    () => ({ base: tokens.primary, soft: withAlpha(tokens.primary, 0.16), ink: mix(tokens.primary, tokens.fg, tokens.inkTone) }),
    [tokens],
  );
}
