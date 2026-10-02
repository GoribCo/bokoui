import { type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

export interface EmptyStateProps {
  /** An icon, shown in a round badge. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Buttons or links, e.g. "Create project". */
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** What to show when a list or search has nothing in it: say why and offer the next step. */
export function EmptyState({ icon, title, description, actions, style }: EmptyStateProps) {
  const { tokens } = useTheme();
  return (
    <View style={[{ alignSelf: "stretch", alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24, paddingVertical: 48 }, style]}>
      {icon ? <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: tokens.muted }}>{icon}</View> : null}
      <RNText style={{ color: tokens.fg, fontSize: 16, fontWeight: "500", textAlign: "center" }}>{title}</RNText>
      {description ? <RNText style={{ color: tokens.mutedFg, fontSize: 14, textAlign: "center", maxWidth: 384 }}>{description}</RNText> : null}
      {actions ? <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 8 }}>{actions}</View> : null}
    </View>
  );
}
