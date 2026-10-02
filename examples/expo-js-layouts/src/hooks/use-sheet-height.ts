import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Height a scrolling list may take inside a bokoui `Drawer` or `Modal`. The bokoui card sizes itself to its
 * content, so a `ScrollView` inside it needs an explicit cap; `reserve` is the room for the title and padding.
 */
export function useSheetHeight(reserve = 120): number {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return Math.max(160, height * 0.85 - insets.bottom - reserve);
}
