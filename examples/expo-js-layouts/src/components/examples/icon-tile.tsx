import { useTheme, withAlpha } from "bokoui/expo";
import type { ReactNode } from "react";
import { View } from "react-native";

/** A rounded tile with a soft primary tint that holds an icon (or a color swatch with `color`). */
export function IconTile({ children, size = 40, color }: { children?: ReactNode; size?: number; color?: string }) {
  const { tokens } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: Math.round(size * 0.32), alignItems: "center", justifyContent: "center", backgroundColor: color ?? withAlpha(tokens.primary, 0.16) }}>
      {children}
    </View>
  );
}
