import { Children, Fragment, type ReactNode } from "react";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

export interface BreadcrumbProps {
  /** `BreadcrumbItem`s. Separators are added between them. */
  children?: ReactNode;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Breadcrumb({ children, label = "Breadcrumb", style }: BreadcrumbProps) {
  const { tokens } = useTheme();
  return (
    <View accessibilityRole="list" accessibilityLabel={label} style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 }, style]}>
      {Children.toArray(children).map((child, i) => (
        <Fragment key={i}>
          {i > 0 ? <RNText accessibilityElementsHidden style={{ color: tokens.mutedFg, fontSize: 14 }}>/</RNText> : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

export interface BreadcrumbItemProps {
  /** Marks the page you are on: plain text, not pressable. */
  current?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}

export function BreadcrumbItem({ current, onPress, children }: BreadcrumbItemProps) {
  const { tokens } = useTheme();
  const text = <RNText style={{ fontSize: 14, color: current ? tokens.fg : tokens.mutedFg, fontWeight: current ? "500" : "400" }}>{children}</RNText>;
  if (current || !onPress) return <View accessibilityRole="text" accessibilityState={{ selected: current }}>{text}</View>;
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={{ minHeight: 44, justifyContent: "center" }}>
      {text}
    </Pressable>
  );
}
