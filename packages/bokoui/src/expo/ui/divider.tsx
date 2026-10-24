import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { type DividerOrientation } from "@/core";
import { useTheme } from "../theme";

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ orientation = "horizontal", label, style }: DividerProps) {
  const { tokens } = useTheme();
  const line = { backgroundColor: tokens.border };
  if (orientation === "vertical") {
    return <View style={[{ alignSelf: "stretch", width: tokens.borderWidth, minHeight: 16 }, line, style]} />;
  }
  const rule = { height: tokens.borderWidth, ...line };
  if (!label) return <View style={[{ alignSelf: "stretch" }, rule, style]} />;
  return (
    <View style={[{ alignSelf: "stretch", flexDirection: "row", alignItems: "center", gap: 12 }, style]}>
      <View style={[{ flex: 1 }, rule]} />
      <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{label}</RNText>
      <View style={[{ flex: 1 }, rule]} />
    </View>
  );
}
