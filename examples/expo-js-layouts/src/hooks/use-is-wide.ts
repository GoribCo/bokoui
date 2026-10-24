import { useWindowDimensions } from "react-native";

/** Width from which the app shows the permanent sidebar instead of the bottom bar and drawer (tablet, web). */
export const WIDE_BREAKPOINT = 768;

/**
 * The one place that decides between the wide and the phone layout. Resizing the window (or rotating the
 * device) flips it live; state lives in stores and the router, so nothing remounts or resets.
 */
export function useIsWide(): boolean {
  return useWindowDimensions().width >= WIDE_BREAKPOINT;
}
